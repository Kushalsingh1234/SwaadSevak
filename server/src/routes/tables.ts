import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';

const router = Router();
router.use(requireAuth);

// Get all tables for restaurant
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const restaurant = db.getRestaurant(restaurantId);
  const tables = db.getTables(restaurantId);

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  // Attach public QR URL to each table
  const enrichedTables = tables.map(t => ({
    ...t,
    qrUrl: `${clientUrl}/menu/${restaurant?.slug}/${t.qrToken}`
  }));

  return res.json({
    success: true,
    restaurant: {
      name: restaurant?.name,
      slug: restaurant?.slug
    },
    tables: enrichedTables
  });
});

// Add a new table
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { tableNumber } = req.body;

  if (!tableNumber || !tableNumber.trim()) {
    return res.status(400).json({ success: false, message: 'Table number or name is required.' });
  }

  const table = db.createTable(restaurantId, tableNumber.trim());
  const restaurant = db.getRestaurant(restaurantId);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  return res.status(201).json({
    success: true,
    table: {
      ...table,
      qrUrl: `${clientUrl}/menu/${restaurant?.slug}/${table.qrToken}`
    }
  });
});

// Bulk add tables
router.post('/bulk', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { count, prefix = 'Table ' } = req.body;
  const num = parseInt(count, 10);

  if (!num || num < 1 || num > 50) {
    return res.status(400).json({ success: false, message: 'Please specify between 1 and 50 tables.' });
  }

  const existing = db.getTables(restaurantId);
  const startIndex = existing.length + 1;
  const created = [];

  for (let i = startIndex; i < startIndex + num; i++) {
    const pad = i < 10 ? `0${i}` : `${i}`;
    const t = db.createTable(restaurantId, `${prefix}${pad}`);
    created.push(t);
  }

  return res.status(201).json({
    success: true,
    message: `Added ${created.length} new tables!`,
    tables: created
  });
});

// Rename table
router.put('/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { tableNumber } = req.body;

  if (!tableNumber || !tableNumber.trim()) {
    return res.status(400).json({ success: false, message: 'Table number is required.' });
  }

  const updated = db.updateTable(restaurantId, req.params.id as string, { tableNumber: tableNumber.trim() });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Table not found.' });
  }

  return res.json({ success: true, table: updated });
});

// Regenerate single QR token
router.post('/:id/regenerate-qr', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const updated = db.regenerateTableQr(restaurantId, req.params.id as string);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Table not found.' });
  }

  const restaurant = db.getRestaurant(restaurantId);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  return res.json({
    success: true,
    message: 'New QR code generated for table.',
    table: {
      ...updated,
      qrUrl: `${clientUrl}/menu/${restaurant?.slug}/${updated.qrToken}`
    }
  });
});

// Delete table
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const success = db.deleteTable(restaurantId, req.params.id as string);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Table not found.' });
  }

  return res.json({ success: true, message: 'Table removed successfully.' });
});

export default router;
