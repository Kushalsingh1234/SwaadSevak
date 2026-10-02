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

  const validStatuses: OrderStatus[] = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'REJECTED'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status specified.' });
  }

  const updatedOrder = db.updateOrderStatus(restaurantId, req.params.id as string, status);
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
