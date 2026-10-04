import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { AnalyticsQueryOptions } from '../types/index.js';

const router = Router();
router.use(requireAuth);

// Get complete restaurant analytics
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { range, startDate, endDate, tz } = req.query as Record<string, string>;

  const options: AnalyticsQueryOptions = {
    range: range as any,
    startDate,
    endDate,
    tz
  };

  try {
    const data = AnalyticsService.getRestaurantAnalytics(restaurantId, options);
    return res.json({ success: true, analytics: data });
  } catch (err: any) {
    console.error('[AnalyticsRoute] Error generating analytics:', err);
    return res.status(500).json({ success: false, message: 'Failed to compute analytics.' });
  }
});

// CSV Export Endpoint
router.get('/export/csv', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { range, startDate, endDate, tz } = req.query as Record<string, string>;

  try {
    const data = AnalyticsService.getRestaurantAnalytics(restaurantId, {
      range: range as any,
      startDate,
      endDate,
      tz
    });

    const headers = ['Date', 'Order ID', 'Channel', 'Table', 'Status', 'Items', 'Subtotal (INR)', 'Tax (INR)', 'Total (INR)'];
    const rows = data.exportOrders.map(o => [
      `"${o.date}"`,
      `"${o.orderNumber}"`,
      `"${o.source}"`,
      `"${o.table}"`,
      `"${o.status}"`,
      `"${o.itemsSummary.replace(/"/g, '""')}"`,
      o.subtotal,
      o.tax,
      o.total
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="swaad_sevak_orders_${data.period.key}_${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err: any) {
    console.error('[AnalyticsRoute] Error exporting CSV:', err);
    return res.status(500).json({ success: false, message: 'Failed to export CSV.' });
  }
});

export default router;
