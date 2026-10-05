import { Router, Response } from 'express';
import multer from 'multer';
import * as xlsx from 'xlsx';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { GrowthEngineService } from '../services/growthEngineService.js';
import { PosReportParser } from '../services/posReportParser.js';
import { db } from '../db/index.js';
import { BusinessType, GrowthDataMode, PosReport } from '../types/index.js';

const router = Router();
router.use(requireAuth);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15 MB limit
});

/**
 * GET /api/growth
 * Main endpoint: fetches the latest Growth Engine dashboard & recommendations
 */
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { dataMode, reportId, businessType } = req.query as {
    dataMode?: GrowthDataMode;
    reportId?: string;
    businessType?: BusinessType;
  };

  try {
    const analysis = GrowthEngineService.generateGrowthAnalysis(
      restaurantId,
      dataMode,
      reportId,
      businessType
    );
    return res.json({ success: true, growth: analysis });
  } catch (err: any) {
    console.error('[GrowthEngineRoute] Error generating growth analysis:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate Growth Engine recommendations.' });
  }
});

/**
 * POST /api/growth/upload-pos
 * Uploads and parses an external POS report (CSV, XLSX, XLS, or PDF)
 * Returns the parsed confirmation preview
 */
router.post('/upload-pos', upload.single('posFile'), async (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'Please attach a valid CSV, Excel, or PDF report file.' });
  }

  const providerHint = req.body?.providerHint || undefined;

  try {
    const parsedReport = await PosReportParser.parseReport(
      file.buffer,
      file.originalname,
      restaurantId,
      providerHint
    );

    return res.json({
      success: true,
      message: 'Report analyzed successfully.',
      report: parsedReport
    });
  } catch (err: any) {
    console.error('[GrowthEngineRoute] Error parsing uploaded POS report:', err);
    return res.status(422).json({
      success: false,
      message: err.message || 'We could not process this report. Please ensure it is a valid restaurant sales report export.'
    });
  }
});

/**
 * POST /api/growth/confirm-pos
 * Confirms and stores the parsed POS report into the restaurant's records
 */
router.post('/confirm-pos', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { report, setAsActive, dataMode } = req.body as {
    report: PosReport;
    setAsActive?: boolean;
    dataMode?: GrowthDataMode;
  };

  if (!report || !report.fileName) {
    return res.status(400).json({ success: false, message: 'Invalid report data provided.' });
  }

  try {
    report.restaurantId = restaurantId;
    report.uploadedAt = new Date();
    db.savePosReport(report);

    if (setAsActive) {
      db.setGrowthDataMode(restaurantId, dataMode || 'combined', report.id);
    }

    return res.json({
      success: true,
      message: 'POS report successfully saved.',
      reportId: report.id
    });
  } catch (err: any) {
    console.error('[GrowthEngineRoute] Error confirming POS report:', err);
    return res.status(500).json({ success: false, message: 'Failed to save POS report.' });
  }
});

/**
 * DELETE /api/growth/reports/:id
 * Removes a saved POS report
 */
router.delete('/reports/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    db.deletePosReport(id);
    return res.json({ success: true, message: 'Report removed.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to remove report.' });
  }
});

/**
 * POST /api/growth/mode
 * Switches the active data mode ('swaad' | 'pos' | 'combined') and optional active report
 */
router.post('/mode', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { dataMode, reportId } = req.body as { dataMode: GrowthDataMode; reportId?: string };

  if (!dataMode) {
    return res.status(400).json({ success: false, message: 'dataMode is required.' });
  }

  try {
    db.setGrowthDataMode(restaurantId, dataMode, reportId);
    return res.json({ success: true, mode: dataMode, reportId });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to update data mode.' });
  }
});

/**
 * POST /api/growth/business-type
 * Updates business profile (Café, Restaurant, Fast Food, Bakery / Café, QSR, Other)
 */
router.post('/business-type', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { businessType } = req.body as { businessType: BusinessType };

  if (!businessType) {
    return res.status(400).json({ success: false, message: 'businessType is required.' });
  }

  try {
    db.setBusinessType(restaurantId, businessType);
    return res.json({ success: true, businessType });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to update business type.' });
  }
});

/**
 * POST /api/growth/item-cost
 * Optionally saves estimated ingredient cost for an item
 */
router.post('/item-cost', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { itemName, cost } = req.body as { itemName: string; cost: number };

  if (!itemName || cost === undefined || cost < 0) {
    return res.status(400).json({ success: false, message: 'Valid itemName and cost are required.' });
  }

  try {
    db.setItemCost(restaurantId, itemName, Number(cost));
    return res.json({ success: true, itemName, cost: Number(cost) });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to set item cost.' });
  }
});

/**
 * POST /api/growth/recommendations/:id/action
 * Toggles recommendation implementation tracking
 */
router.post('/recommendations/:id/action', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { id } = req.params;

  try {
    const isNowImplemented = db.toggleRecommendationAction(restaurantId, id);
    return res.json({ success: true, recommendationId: id, implemented: isNowImplemented });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to update action.' });
  }
});

/**
 * GET /api/growth/sample-pos-report
 * Generates and downloads a sample Petpooja sales report (CSV or XLSX) for quick testing
 */
router.get('/sample-pos-report', (req: AuthenticatedRequest, res: Response) => {
  const format = (req.query.format as string) || 'xlsx';

  const rows = [
    ['Petpooja POS - Item Sales & Bill Summary Report'],
    ['Outlet Name: The Chai & Chaat Co.', '', '', '', '', 'Date: 01-Sep-2026 to 30-Sep-2026'],
    [],
    ['Bill No', 'Date', 'Time', 'Item Name', 'Category', 'Quantity', 'Rate (INR)', 'Net Amount (INR)'],
    ['INV-8001', '01/09/2026', '12:35', 'Cold Coffee', 'Beverages', 2, 129, 258],
    ['INV-8001', '01/09/2026', '12:35', 'Paneer Sandwich', 'Snacks', 1, 129, 129],
    ['INV-8002', '01/09/2026', '13:15', 'Amritsari Paneer Tikka', 'Starters', 1, 279, 279],
    ['INV-8002', '01/09/2026', '13:15', 'Butter Garlic Naan', 'Breads', 2, 75, 150],
    ['INV-8003', '02/09/2026', '15:45', 'Cold Coffee', 'Beverages', 1, 129, 129],
    ['INV-8003', '02/09/2026', '15:45', 'Chocolate Brownie', 'Desserts', 1, 149, 149],
    ['INV-8004', '03/09/2026', '16:20', 'Kulhad Masala Chai', 'Beverages', 2, 69, 138],
    ['INV-8004', '03/09/2026', '16:20', 'Butter Croissant', 'Bakery', 1, 119, 119],
    ['INV-8005', '04/09/2026', '19:40', 'Dal Makhani Slow Cooked', 'Mains', 1, 299, 299],
    ['INV-8005', '04/09/2026', '19:40', 'Butter Garlic Naan', 'Breads', 2, 75, 150],
    ['INV-8005', '04/09/2026', '19:40', 'Warm Gulab Jamun with Rabri', 'Desserts', 1, 159, 159],
    ['INV-8006', '05/09/2026', '20:15', 'Old Delhi Butter Chicken', 'Mains', 1, 389, 389],
    ['INV-8006', '05/09/2026', '20:15', 'Butter Garlic Naan', 'Breads', 3, 75, 225],
    ['INV-8006', '05/09/2026', '20:15', 'Cold Coffee', 'Beverages', 2, 129, 258],
    ['INV-8007', '06/09/2026', '17:10', 'Cold Coffee', 'Beverages', 2, 129, 258],
    ['INV-8007', '06/09/2026', '17:10', 'Paneer Sandwich', 'Snacks', 2, 129, 258],
    ['INV-8008', '07/09/2026', '14:20', 'Dahi Ke Kebab', 'Starters', 1, 249, 249],
    ['INV-8008', '07/09/2026', '14:20', 'Kulhad Masala Chai', 'Beverages', 1, 69, 69]
  ];

  if (format === 'csv') {
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Petpooja_Sample_Sales_Report.csv"');
    return res.status(200).send(csvContent);
  }

  // XLSX default
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(rows);
  xlsx.utils.book_append_sheet(wb, ws, 'Petpooja Item Sales');
  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="Petpooja_Sample_Sales_Report.xlsx"');
  return res.status(200).send(buffer);
});

export default router;
