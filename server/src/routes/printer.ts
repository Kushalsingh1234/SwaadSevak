import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';

const router = Router();
router.use(requireAuth);

router.get('/config', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const config = db.getPrinterConfig(restaurantId);
  return res.json({ success: true, config });
});

router.put('/config', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { printerName, paperWidth, autoPrintKot, printerType, printerIp } = req.body;

  const validWidths = ['58mm', '80mm'];
  if (paperWidth && !validWidths.includes(paperWidth)) {
    return res.status(400).json({ success: false, message: 'Paper width must be either 58mm or 80mm' });
  }

  const updated = db.updatePrinterConfig(restaurantId, {
    ...(printerName && { printerName }),
    ...(paperWidth && { paperWidth }),
    ...(autoPrintKot !== undefined && { autoPrintKot: Boolean(autoPrintKot) }),
    ...(printerType && { printerType }),
    ...(printerIp !== undefined && { printerIp })
  });

  return res.json({
    success: true,
    message: 'Printer configuration saved successfully',
    config: updated
  });
});

export default router;
