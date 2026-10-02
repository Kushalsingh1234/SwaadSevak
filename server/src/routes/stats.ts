import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';

const router = Router();
router.use(requireAuth);

router.get('/today', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const stats = db.getTodayStats(restaurantId);
  return res.json({ success: true, stats });
});

export default router;
