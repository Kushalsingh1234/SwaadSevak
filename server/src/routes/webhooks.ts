import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { aggregatorManager } from '../aggregators/aggregatorManager.js';
import { emitOrderStatus } from '../realtime/socket.js';
import crypto from 'crypto';

const router = Router();

// Handle incoming Swiggy Order Webhook
router.post('/swiggy/orders', (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-swiggy-signature'] as string || '';
    const payload = req.body;

    const swiggyProvider = aggregatorManager.getProvider('SWIGGY');
    if (!swiggyProvider.verifyWebhook(signature, payload)) {
      return res.status(401).json({ success: false, message: 'Invalid Swiggy webhook signature' });
    }

    const { restaurantId, externalOrderId, items: webhookItems, customer, totals } = payload;
    const restId = restaurantId || 'rest_demo_01';
    const extId = externalOrderId || `SWG-${Math.floor(10000 + Math.random() * 90000)}`;

    // Idempotency check: Do not create duplicate orders if aggregator retries webhook
    if (aggregatorManager.isOrderProcessed('SWIGGY', extId, restId)) {
      return res.status(200).json({ success: true, message: 'Order already processed (idempotent response)' });
    }

    // Convert items to internal format
    const menuItems = db.getItems(restId);
    const orderItems = (webhookItems || []).map((wi: any) => {
      const match = menuItems.find(m => m.id === wi.id || m.name.toLowerCase() === (wi.name || '').toLowerCase());
      return {
        id: `item_${crypto.randomUUID()}`,
        orderId: '',
        menuItemId: match ? match.id : wi.id || 'custom',
        name: wi.name || 'Swiggy Dish',
        price: Number(wi.price) || 249,
        quantity: Number(wi.quantity) || 1,
        portion: wi.portion || 'Standard',
        notes: wi.notes
      };
    });

    const subtotal = totals?.subtotal || orderItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const tax = totals?.taxes || Math.round(subtotal * 0.05);
    const packagingCharge = totals?.packagingCharge || 35;
    const total = totals?.total || (subtotal + tax + packagingCharge);

    const tables = db.getTables(restId);
    const tableId = tables.length > 0 ? tables[0].id : 'online_delivery';

    const order = db.createOrder({
      restaurantId: restId,
      tableId,
      tableNumber: 'Swiggy',
      source: 'SWIGGY',
      status: 'PENDING',
      customerNotes: `Swiggy #${extId}. Cust: ${customer?.name || 'Customer'}. Packaging: ₹${packagingCharge}`,
      subtotal,
      tax,
      total,
      items: orderItems
    });

    aggregatorManager.markOrderProcessed('SWIGGY', extId, restId);
    emitOrderStatus(restId, order.tableId, order);

    aggregatorManager.logSyncEvent(
      restId,
      'SWIGGY',
      'WEBHOOK_ORDER_RECEIVED',
      'ORDER',
      'SUCCESS',
      `Webhook order received: Swiggy #${extId} (₹${total})`
    );

    return res.status(200).json({ success: true, orderId: order.id, externalOrderId: extId });
  } catch (error: any) {
    console.error('[Webhooks] Swiggy order error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Handle incoming Zomato Order Webhook
router.post('/zomato/orders', (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-zomato-signature'] as string || '';
    const payload = req.body;

    const zomatoProvider = aggregatorManager.getProvider('ZOMATO');
    if (!zomatoProvider.verifyWebhook(signature, payload)) {
      return res.status(401).json({ success: false, message: 'Invalid Zomato webhook signature' });
    }

    const { restaurantId, externalOrderId, items: webhookItems, customer, totals } = payload;
    const restId = restaurantId || 'rest_demo_01';
    const extId = externalOrderId || `ZOM-${Math.floor(10000 + Math.random() * 90000)}`;

    // Idempotency check
    if (aggregatorManager.isOrderProcessed('ZOMATO', extId, restId)) {
      return res.status(200).json({ success: true, message: 'Order already processed (idempotent response)' });
    }

    const menuItems = db.getItems(restId);
    const orderItems = (webhookItems || []).map((wi: any) => {
      const match = menuItems.find(m => m.id === wi.id || m.name.toLowerCase() === (wi.name || '').toLowerCase());
      return {
        id: `item_${crypto.randomUUID()}`,
        orderId: '',
        menuItemId: match ? match.id : wi.id || 'custom',
        name: wi.name || 'Zomato Dish',
        price: Number(wi.price) || 249,
        quantity: Number(wi.quantity) || 1,
        portion: wi.portion || 'Standard',
        notes: wi.notes
      };
    });

    const subtotal = totals?.subtotal || orderItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const tax = totals?.taxes || Math.round(subtotal * 0.05);
    const packagingCharge = totals?.packagingCharge || 35;
    const total = totals?.total || (subtotal + tax + packagingCharge);

    const tables = db.getTables(restId);
    const tableId = tables.length > 0 ? tables[0].id : 'online_delivery';

    const order = db.createOrder({
      restaurantId: restId,
      tableId,
      tableNumber: 'Zomato',
      source: 'ZOMATO',
      status: 'PENDING',
      customerNotes: `Zomato #${extId}. Cust: ${customer?.name || 'Customer'}. Packaging: ₹${packagingCharge}`,
      subtotal,
      tax,
      total,
      items: orderItems
    });

    aggregatorManager.markOrderProcessed('ZOMATO', extId, restId);
    emitOrderStatus(restId, order.tableId, order);

    aggregatorManager.logSyncEvent(
      restId,
      'ZOMATO',
      'WEBHOOK_ORDER_RECEIVED',
      'ORDER',
      'SUCCESS',
      `Webhook order received: Zomato #${extId} (₹${total})`
    );

    return res.status(200).json({ success: true, orderId: order.id, externalOrderId: extId });
  } catch (error: any) {
    console.error('[Webhooks] Zomato order error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Status Webhook (Rider updates, Delivery partner arrival)
router.post('/:provider/status', (req: Request, res: Response) => {
  const { provider } = req.params;
  const { externalOrderId, riderStatus, riderName, etaMinutes } = req.body;

  console.log(`[Webhooks] Rider update from ${provider}: order ${externalOrderId}, status: ${riderStatus}`);

  return res.json({
    success: true,
    message: 'Status update received',
    provider,
    externalOrderId,
    riderStatus,
    riderName,
    etaMinutes
  });
});

export default router;
