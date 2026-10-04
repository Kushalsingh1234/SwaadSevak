import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { emitOrderStatus } from '../realtime/socket.js';
import { PrinterService } from '../printing/printerService.js';
import { OrderStatus } from '../types/index.js';

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

// Update order status (Accept, Reject, Preparing, Ready, Completed)
router.patch('/:id/status', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { status } = req.body as { status: OrderStatus };

  const validStatuses: OrderStatus[] = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'REJECTED'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status specified.' });
  }

  const { rejectionReason } = req.body as { rejectionReason?: string };
  const updatedOrder = db.updateOrderStatus(restaurantId, req.params.id as string, status, rejectionReason);
  if (!updatedOrder) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Real-time broadcast to manager and table
  emitOrderStatus(restaurantId, updatedOrder.tableId, updatedOrder);

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
    kotData = PrinterService.generateKotData(restaurant, additionOrderDraft as any, printerConfig);
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
