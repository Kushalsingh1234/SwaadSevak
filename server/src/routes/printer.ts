import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { PrinterService } from '../printing/printerService.js';

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

router.post('/print-kot', async (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { orderId, isAddition, additionId } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, message: 'orderId is required' });
  }

  const config = db.getPrinterConfig(restaurantId);
  const restaurant = db.getRestaurant(restaurantId);
  const order = db.getOrder(restaurantId, orderId);

  if (!order || !restaurant) {
    return res.status(404).json({ success: false, message: 'Order or restaurant not found' });
  }

  // Network printer dispatch
  if (config.printerType === 'NETWORK' && config.printerIp) {
    const kotData = PrinterService.generateKotData(
      restaurant,
      order,
      config,
      isAddition ? { isAddition: true, additionNumber: additionId } : undefined
    );
    const escText = PrinterService.generateThermalText(kotData);
    const printed = await PrinterService.sendToNetworkPrinter(config.printerIp, escText);
    return res.json({
      success: printed,
      message: printed ? 'KOT sent to network printer' : 'Could not reach network printer IP'
    });
  }

  return res.json({ success: true, message: 'KOT generated and queued for printer' });
});

export default router;
