import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { emitOrderStatus, emitCustomerCoinsUpdated, emitNewOrder } from '../realtime/socket.js';
import { PrinterService } from '../printing/printerService.js';
import { OrderStatus } from '../types/index.js';
import { aggregatorManager } from '../aggregators/aggregatorManager.js';
import { CampaignScheduler } from '../services/campaignScheduler.js';
import crypto from 'crypto';

const router = Router();
router.use(requireAuth);

// Get all orders for restaurant
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { status, source } = req.query;

  let orders = db.getOrders(restaurantId);

  if (status && typeof status === 'string') {
    orders = orders.filter(o => o.status === status);
  }

  if (source && typeof source === 'string') {
    orders = orders.filter(o => o.source === source);
  }

  return res.json({ success: true, orders });
});

/**
 * POST /api/orders
 * Create a custom manual order from the manager dashboard (Dine-in, Takeaway, or Delivery)
 */
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const restaurant = db.getRestaurant(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const {
      tableId,
      tableNumber,
      source,
      items,
      customerName,
      customerPhone,
      customerNotes,
      status: initialStatus,
      paymentMode,
      paymentStatus,
      discount
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add at least one item to the order.' });
    }

    // Resolve table
    let resolvedTableId = tableId;
    let resolvedTableNumber = tableNumber || 'Takeaway';
    const allTables = db.getTables(restaurantId);
    if (resolvedTableId) {
      const existingTable = allTables.find(t => t.id === resolvedTableId);
      if (existingTable) {
        resolvedTableNumber = existingTable.tableNumber;
      }
    } else if (source === 'DINE_IN' && tableNumber) {
      const found = allTables.find(t => t.tableNumber.toLowerCase() === String(tableNumber).toLowerCase());
      if (found) {
        resolvedTableId = found.id;
        resolvedTableNumber = found.tableNumber;
      } else {
        resolvedTableId = `tbl_manual_${Date.now()}`;
      }
    } else {
      resolvedTableId = `tbl_counter_${Date.now()}`;
      resolvedTableNumber = tableNumber || (source === 'DELIVERY' ? 'Delivery' : 'Takeaway / Counter');
    }

    // Format and calculate items
    const verifiedItems = items.map((it: any) => ({
      id: it.id || `item_${crypto.randomUUID()}`,
      orderId: '',
      menuItemId: it.menuItemId || it.id || `custom_${Date.now()}`,
      name: it.name || 'Custom Item',
      price: Number(it.price) || 0,
      quantity: Number(it.quantity) || 1,
      portion: it.portion || 'Standard',
      notes: it.notes || undefined
    }));

    const subtotal = verifiedItems.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
    
    // Tax calculation based on restaurant GST tier
    const gstTier = restaurant.gstTier || '5%';
    let tax = 0;
    if (gstTier === '18%') {
      tax = Math.round(subtotal * 0.18 * 100) / 100;
    } else if (gstTier === 'inclusive' || gstTier === '0%' || gstTier === '0') {
      tax = 0;
    } else {
      tax = Math.round(subtotal * 0.05 * 100) / 100;
    }

    const discountAmount = Number(discount) || 0;
    const total = Math.max(0, Math.round((subtotal + tax - discountAmount) * 100) / 100);

    // Check or find/create customer in CRM if phone is provided
    let customerId: string | undefined = undefined;
    if (customerPhone && String(customerPhone).trim().length >= 10) {
      const cleanPhone = String(customerPhone).trim();
      const existingCust = db.getCustomerByPhone(restaurantId, cleanPhone);
      if (existingCust) {
        customerId = existingCust.id;
      } else {
        const newCust = db.createCustomer(restaurantId, {
          name: customerName ? String(customerName).trim() : 'Guest',
          phone: cleanPhone
        });
        customerId = newCust?.customer?.id;
      }
    }

    const orderStatus = initialStatus || 'PREPARING'; // Default to preparing for manual kitchen dispatch

    const order = db.createOrder({
      restaurantId,
      tableId: resolvedTableId,
      tableNumber: resolvedTableNumber,
      source: source || 'DINE_IN',
      status: orderStatus,
      customerNotes: customerNotes ? String(customerNotes).trim() : undefined,
      subtotal,
      tax,
      total,
      customerId,
      customerName: customerName ? String(customerName).trim() : undefined,
      customerPhone: customerPhone ? String(customerPhone).trim() : undefined,
      coinsUsed: 0,
      coinsEarned: 0,
      coinDiscount: discountAmount,
      items: verifiedItems
    });

    for (const item of order.items) {
      item.orderId = order.id;
    }

    // Broadcast new order via real-time WebSocket to kitchen/floor
    emitNewOrder(restaurantId, order);

    // If bill / receipt was marked settled or paid immediately (e.g. cash/UPI at counter)
    let bill = null;
    if (paymentStatus === 'PAID') {
      const mode = (paymentMode || 'CASH').toUpperCase();
      const createdBill = db.createBill(restaurantId, order.id);
      if (createdBill) {
        const payStatus = mode === 'CARD' ? 'PAID_CARD' : mode === 'UPI' ? 'PAID_UPI' : 'PAID_CASH';
        bill = db.settleBill(restaurantId, createdBill.id, payStatus as any);
      }
    }

    // Auto-generate KOT data
    const printerConfig = db.getPrinterConfig(restaurantId);
    const kotData = PrinterService.generateKotData(restaurant, order, printerConfig);
    const thermalText = PrinterService.generateThermalText(kotData);

    order.kotGenerated = true;
    order.kotNumber = kotData.kotNumber;

    // If network printer is configured, auto-dispatch
    if (printerConfig?.printerType === 'NETWORK' && printerConfig.printerIp) {
      PrinterService.sendToNetworkPrinter(printerConfig.printerIp, thermalText).catch(err => {
        console.warn('[OrdersRoute] Network print dispatch error:', err);
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Custom order created successfully!',
      order,
      bill,
      kotData,
      thermalText
    });
  } catch (error: any) {
    console.error('Error creating custom order:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create order.' });
  }
});

// Update order status (Accept, Reject, Preparing, Ready, Completed)
router.patch('/:id/status', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { status } = req.body as { status: OrderStatus };

  const validStatuses: OrderStatus[] = [
    'PENDING',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'SERVED',
    'COMPLETED',
    'REJECTED',
    'OUT_FOR_DELIVERY',
    'DELIVERED'
  ];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status specified.' });
  }

  const { rejectionReason, estimatedPrepTime, prepTimeMinutes } = req.body as {
    rejectionReason?: string;
    estimatedPrepTime?: number;
    prepTimeMinutes?: number;
  };
  const chosenPrepTime = Number(estimatedPrepTime || prepTimeMinutes) || undefined;

  const updatedOrder = db.updateOrderStatus(restaurantId, req.params.id as string, status, rejectionReason, chosenPrepTime);
  if (!updatedOrder) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Real-time broadcast to manager and table
  emitOrderStatus(restaurantId, updatedOrder.tableId, updatedOrder);

  // If order was completed and associated with a customer, broadcast updated coin balance
  if (status === 'COMPLETED') {
    if (updatedOrder.customerId) {
      const cust = db.getCustomerById(restaurantId, updatedOrder.customerId);
      if (cust) {
        emitCustomerCoinsUpdated(restaurantId, cust);
      }
    }
    // Asynchronously trigger automation tick
    CampaignScheduler.processAutomations().catch(err => {
      console.error('[Scheduler] Error processing automations on order completion:', err);
    });
  }

  // Aggregator notification if order came from Swiggy or Zomato
  if (updatedOrder.source === 'SWIGGY' || updatedOrder.source === 'ZOMATO') {
    try {
      const provider = aggregatorManager.getProvider(updatedOrder.source);
      if (status === 'ACCEPTED') {
        const prepTime = chosenPrepTime || 25;
        provider.acceptOrder(restaurantId, updatedOrder.orderNumber, prepTime);
        aggregatorManager.logSyncEvent(
          restaurantId,
          updatedOrder.source,
          'ACCEPT_ORDER',
          'ORDER',
          'SUCCESS',
          `Accepted ${updatedOrder.source} order #${updatedOrder.orderNumber} (Prep time: ${prepTime}m, KOT dispatched)`
        );
      } else if (status === 'REJECTED') {
        provider.rejectOrder(restaurantId, updatedOrder.orderNumber, rejectionReason || 'Kitchen rejected');
        aggregatorManager.logSyncEvent(
          restaurantId,
          updatedOrder.source,
          'REJECT_ORDER',
          'ORDER',
          'WARNING',
          `Rejected ${updatedOrder.source} order #${updatedOrder.orderNumber} (${rejectionReason || 'No reason'})`
        );
      } else if (status === 'READY') {
        provider.markOrderReady(restaurantId, updatedOrder.orderNumber);
        aggregatorManager.logSyncEvent(
          restaurantId,
          updatedOrder.source,
          'ORDER_READY',
          'ORDER',
          'SUCCESS',
          `Marked ${updatedOrder.source} order #${updatedOrder.orderNumber} READY for pickup`
        );
      } else if (status === 'OUT_FOR_DELIVERY') {
        aggregatorManager.logSyncEvent(
          restaurantId,
          updatedOrder.source,
          'ORDER_DISPATCH',
          'ORDER',
          'SUCCESS',
          `${updatedOrder.source} order #${updatedOrder.orderNumber} is OUT FOR DELIVERY with delivery partner`
        );
      } else if (status === 'DELIVERED') {
        aggregatorManager.logSyncEvent(
          restaurantId,
          updatedOrder.source,
          'ORDER_DELIVERED',
          'ORDER',
          'SUCCESS',
          `${updatedOrder.source} order #${updatedOrder.orderNumber} DELIVERED & SETTLED (₹${updatedOrder.total})`
        );
      }
    } catch (aggErr) {
      console.warn('[OrdersRoute] Aggregator sync hook warning:', aggErr);
    }
  }

  // If order was accepted and KOT generated, also return KOT payload
  let kotData = null;
  let thermalText = null;
  if (status === 'ACCEPTED' || updatedOrder.kotGenerated) {
    const restaurant = db.getRestaurant(restaurantId);
    const printerConfig = db.getPrinterConfig(restaurantId);
    if (restaurant) {
      kotData = PrinterService.generateKotData(restaurant, updatedOrder, printerConfig);
      thermalText = PrinterService.generateThermalText(kotData);

      // Auto-send directly to kitchen thermal printer if network printer is configured
      if (printerConfig?.printerType === 'NETWORK' && printerConfig.printerIp) {
        PrinterService.sendToNetworkPrinter(printerConfig.printerIp, thermalText).catch(err => {
          console.warn('[OrdersRoute] Network print dispatch error:', err);
        });
      }
    }
  }

  return res.json({
    success: true,
    message: `Order marked as ${status}`,
    order: updatedOrder,
    kotData,
    thermalText
  });
});

// Accept Table Order Addition
router.patch('/:id/additions/:additionId/accept', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const result = db.acceptOrderAddition(restaurantId, req.params.id as string, req.params.additionId as string);

  if (!result) {
    return res.status(404).json({ success: false, message: 'Order addition not found or already processed.' });
  }

  // Broadcast updated order to dashboard and diner table
  emitOrderStatus(restaurantId, result.order.tableId, result.order);

  // Generate KOT for the accepted addition items so kitchen can prepare them
  let kotData = null;
  let thermalText = null;
  const restaurant = db.getRestaurant(restaurantId);
  const printerConfig = db.getPrinterConfig(restaurantId);

  if (restaurant) {
    const additionOrderDraft = {
      ...result.order,
      orderNumber: `${result.order.orderNumber} (${result.addition.additionNumber || 'Add-on'})`,
      items: result.addition.items
    };
    kotData = PrinterService.generateKotData(restaurant, additionOrderDraft as any, printerConfig, {
      isAddition: true,
      additionNumber: result.addition.additionNumber || 'New Addition'
    });
    thermalText = PrinterService.generateThermalText(kotData);

    if (printerConfig?.printerType === 'NETWORK' && printerConfig.printerIp) {
      PrinterService.sendToNetworkPrinter(printerConfig.printerIp, thermalText).catch(err => {
        console.warn('[OrdersRoute] Network print dispatch error for addition:', err);
      });
    }
  }

  return res.json({
    success: true,
    message: 'Added items accepted and sent to kitchen!',
    order: result.order,
    addition: result.addition,
    kotData,
    thermalText
  });
});

// Reject Table Order Addition (Leaving existing order untouched!)
router.patch('/:id/additions/:additionId/reject', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { reason } = req.body as { reason?: string };

  const result = db.rejectOrderAddition(
    restaurantId,
    req.params.id as string,
    req.params.additionId as string,
    reason
  );

  if (!result) {
    return res.status(404).json({ success: false, message: 'Order addition not found or already processed.' });
  }

  // Broadcast updated order to dashboard and diner table
  emitOrderStatus(restaurantId, result.order.tableId, result.order);

  return res.json({
    success: true,
    message: 'Item addition declined without affecting original order.',
    order: result.order,
    addition: result.addition
  });
});

// Get KOT for printing
router.get('/:id/kot', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const order = db.getOrder(restaurantId, req.params.id as string);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const restaurant = db.getRestaurant(restaurantId);
  const printerConfig = db.getPrinterConfig(restaurantId);

  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant details missing.' });
  }

  const kotData = PrinterService.generateKotData(restaurant, order, printerConfig);
  const thermalText = PrinterService.generateThermalText(kotData);

  return res.json({
    success: true,
    kotData,
    thermalText,
    printerConfig
  });
});

export default router;
