import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';

const router = Router();
router.use(requireAuth);

// Get CRM Overview KPIs
router.get('/overview', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const overview = db.getCrmOverview(restaurantId);
  return res.json({ success: true, overview });
});

// Get Customers List (search, filter)
router.get('/customers', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const filter = (req.query.filter as string) || 'ALL';
  const search = req.query.search as string;
  const customers = db.getCustomers(restaurantId, filter, search);
  return res.json({ success: true, customers });
});

// Get Single Customer Profile (with orders and coin transactions)
router.get('/customers/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const customerId = req.params.id as string;
  const customer = db.getCustomerById(restaurantId, customerId);

  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found.' });
  }

  // Get customer's orders
  const allOrders = db.getOrders(restaurantId);
  const customerOrders = allOrders.filter(
    o => o.customerId === customerId || (customer.phone && o.customerPhone && db.normalizePhone(o.customerPhone) === db.normalizePhone(customer.phone))
  );

  // Get customer's coin ledger transactions
  const coinHistory = db.getCoinTransactions(restaurantId, customerId);

  return res.json({
    success: true,
    customer,
    orders: customerOrders,
    coinHistory
  });
});

// Manual Coin Adjustment (Admin)
router.post('/customers/:id/adjust-coins', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const customerId = req.params.id as string;
  const { coins, reason } = req.body;

  const numCoins = parseInt(coins, 10);
  if (isNaN(numCoins) || numCoins === 0) {
    return res.status(400).json({ success: false, message: 'Please provide a valid non-zero number of coins.' });
  }

  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return res.status(400).json({ success: false, message: 'A reason is required for manual coin adjustment.' });
  }

  const result = db.adjustCustomerCoins(restaurantId, customerId, numCoins, reason.trim());
  if (!result) {
    return res.status(400).json({
      success: false,
      message: 'Failed to adjust coins. Adjustment would cause customer balance to fall below zero.'
    });
  }

  return res.json({
    success: true,
    message: `Successfully ${numCoins > 0 ? 'added' : 'deducted'} ${Math.abs(numCoins)} coins.`,
    customer: result.customer,
    transaction: result.transaction
  });
});

// Get Full Coin Ledger
router.get('/ledger', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const customerId = req.query.customerId as string;
  const transactions = db.getCoinTransactions(restaurantId, customerId);
  return res.json({ success: true, transactions });
});

// Get CRM & Discount Coin Settings
router.get('/settings', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const settings = db.getCrmSettings(restaurantId);
  return res.json({ success: true, settings });
});

// Update CRM & Discount Coin Settings
router.put('/settings', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const updatedSettings = db.updateCrmSettings(restaurantId, req.body);
  return res.json({
    success: true,
    message: 'CRM and Discount Coin settings saved successfully.',
    settings: updatedSettings
  });
});

// Get CRM Analytics
router.get('/analytics', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const overview = db.getCrmOverview(restaurantId);
  const customers = db.getCustomers(restaurantId, 'ALL');

  // Top spending customers
  const topSpenders = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  // Top frequent customers
  const topFrequent = [...customers]
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, 10);

  // Customer status segment breakdown
  const segments = {
    new: customers.filter(c => c.status === 'NEW').length,
    regular: customers.filter(c => c.status === 'REGULAR').length,
    vip: customers.filter(c => c.status === 'VIP').length,
    atRisk: customers.filter(c => c.status === 'AT_RISK').length,
    inactive: customers.filter(c => c.status === 'INACTIVE').length
  };

  return res.json({
    success: true,
    overview,
    topSpenders,
    topFrequent,
    segments
  });
});

// Get CRM Events (Growth Engine integration)
router.get('/events', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const events = db.getCrmEvents(restaurantId);
  return res.json({ success: true, events });
});

export default router;
