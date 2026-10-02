import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { emitBillGenerated } from '../realtime/socket.js';

const router = Router();
router.use(requireAuth);

// Get all bills
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const bills = db.getBills(restaurantId);
  return res.json({ success: true, bills });
});

// Generate bill for an order
router.post('/generate/:orderId', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const orderId = req.params.orderId as string;
  const bill = db.createBill(restaurantId, orderId);

  if (!bill) {
    return res.status(404).json({ success: false, message: 'Could not generate bill. Order not found.' });
  }

  const order = db.getOrder(restaurantId, orderId);
  if (order) {
    emitBillGenerated(restaurantId, order.tableId, bill);
  }

  return res.status(201).json({ success: true, bill });
});

// Settle bill
router.patch('/:id/settle', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { paymentStatus } = req.body;

  if (!['PAID_CASH', 'PAID_UPI', 'PAID_CARD'].includes(paymentStatus)) {
    return res.status(400).json({ success: false, message: 'Invalid payment method' });
  }

  const updatedBill = db.settleBill(restaurantId, req.params.id as string, paymentStatus);
  if (!updatedBill) {
    return res.status(404).json({ success: false, message: 'Bill not found' });
  }

  return res.json({
    success: true,
    message: `Bill settled with ${paymentStatus.replace('PAID_', '')}`,
    bill: updatedBill
  });
});

export default router;
