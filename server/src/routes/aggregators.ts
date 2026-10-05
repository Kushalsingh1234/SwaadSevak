import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { aggregatorManager } from '../aggregators/aggregatorManager.js';
import { AggregatorProviderId } from '../aggregators/types.js';
import { emitOrderStatus } from '../realtime/socket.js';
import { PrinterService } from '../printing/printerService.js';
import crypto from 'crypto';

const router = Router();
router.use(requireAuth);

// 1. GET /api/aggregators/status - Get connections status & health
router.get('/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const connections = await aggregatorManager.getAllConnections(restaurantId);

    // Calculate live kitchen load score (0-100%) based on active KOTs and pending orders
    const allOrders = db.getOrders(restaurantId);
    const activeKitchenOrders = allOrders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING');
    const pendingOrders = allOrders.filter(o => o.status === 'PENDING');

    // Load score formula: each preparing order adds ~12%, pending adds ~8%
    const kitchenLoadScore = Math.min(100, Math.round((activeKitchenOrders.length * 12) + (pendingOrders.length * 8)));
    const recommendedPrepTime = kitchenLoadScore > 75 ? 35 : kitchenLoadScore > 50 ? 30 : 25;

    return res.json({
      success: true,
      connections,
      kitchenIntelligence: {
        loadScore: kitchenLoadScore,
        activeOrdersCount: activeKitchenOrders.length,
        pendingOrdersCount: pendingOrders.length,
        recommendedPrepTime,
        statusLabel: kitchenLoadScore > 75 ? 'HIGH_LOAD' : kitchenLoadScore > 40 ? 'MODERATE' : 'NORMAL'
      }
    });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Get status error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. POST /api/aggregators/connect - Connect Swiggy or Zomato outlet
router.post('/connect', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { provider, outletId, outletName, apiKey, merchantSecret } = req.body as {
      provider: AggregatorProviderId;
      outletId: string;
      outletName: string;
      apiKey?: string;
      merchantSecret?: string;
    };

    if (!provider || !outletId || !outletName) {
      return res.status(400).json({
        success: false,
        message: 'Provider, outlet ID, and outlet name are required.'
      });
    }

    const providerInstance = aggregatorManager.getProvider(provider);
    const result = await providerInstance.connect(restaurantId, {
      outletId,
      outletName,
      apiKey,
      merchantSecret
    });

    aggregatorManager.logSyncEvent(
      restaurantId,
      provider,
      'CONNECT',
      'OUTLET_STATUS',
      result.success ? 'SUCCESS' : 'FAILED',
      result.success ? `Connected ${provider} outlet ${outletName} (${outletId})` : `Failed to connect ${provider}: ${result.message}`
    );

    return res.json({
      success: result.success,
      connection: result.connection,
      message: result.message
    });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Connect error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. POST /api/aggregators/disconnect - Disconnect aggregator
router.post('/disconnect', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { provider } = req.body as { provider: AggregatorProviderId };

    if (!provider) {
      return res.status(400).json({ success: false, message: 'Provider is required.' });
    }

    const providerInstance = aggregatorManager.getProvider(provider);
    const success = await providerInstance.disconnect(restaurantId);

    aggregatorManager.logSyncEvent(
      restaurantId,
      provider,
      'DISCONNECT',
      'OUTLET_STATUS',
      'WARNING',
      `Disconnected ${provider} integration for this outlet`
    );

    return res.json({ success, message: `${provider} disconnected.` });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Disconnect error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. GET /api/aggregators/menu - Get unified menu with channel pricing & overrides
router.get('/menu', (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const categories = db.getCategories(restaurantId);
    const items = db.getItems(restaurantId);

    const unifiedItems = items.map(item => {
      const overrides = aggregatorManager.getItemOverrides(item.id, item.price);
      return {
        ...item,
        channelOverrides: overrides
      };
    });

    return res.json({
      success: true,
      categories,
      items: unifiedItems
    });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Get unified menu error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 5. POST /api/aggregators/menu/sync - Trigger sync to Swiggy / Zomato
router.post('/menu/sync', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { channel } = req.body as { channel?: 'SWIGGY' | 'ZOMATO' | 'ALL' };
    const targetChannel = channel || 'ALL';

    const items = db.getItems(restaurantId);
    const categories = db.getCategories(restaurantId);
    const payload = { items, categories };

    const results: Record<string, any> = {};

    if (targetChannel === 'SWIGGY' || targetChannel === 'ALL') {
      const swiggy = aggregatorManager.getProvider('SWIGGY');
      results.swiggy = await swiggy.syncMenu(restaurantId, payload);
    }

    if (targetChannel === 'ZOMATO' || targetChannel === 'ALL') {
      const zomato = aggregatorManager.getProvider('ZOMATO');
      results.zomato = await zomato.syncMenu(restaurantId, payload);
    }

    aggregatorManager.logSyncEvent(
      restaurantId,
      targetChannel,
      'CATALOG_SYNC',
      'MENU',
      'SUCCESS',
      `Synchronized ${items.length} master menu items with ${targetChannel}`
    );

    return res.json({
      success: true,
      results,
      lastSyncAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Menu sync error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 6. PATCH /api/aggregators/menu/override - Update specific item channel config
router.patch('/menu/override', (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { menuItemId, overrides } = req.body;

    if (!menuItemId || !overrides) {
      return res.status(400).json({ success: false, message: 'menuItemId and overrides are required.' });
    }

    const updated = aggregatorManager.setItemOverrides(menuItemId, overrides);

    aggregatorManager.logSyncEvent(
      restaurantId,
      'ALL',
      'UPDATE_OVERRIDE',
      'PRICE',
      'SUCCESS',
      `Updated channel settings for item #${menuItemId}`
    );

    return res.json({ success: true, overrides: updated });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Update override error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 7. POST /api/aggregators/menu/bulk-price - Bulk price adjustment with preview & rounding
router.post('/menu/bulk-price', (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { itemIds, channels, adjustmentType, adjustmentValue, rounding, previewOnly } = req.body;

    const allItems = db.getItems(restaurantId);
    const targetItems = allItems.map(i => ({ id: i.id, name: i.name, price: i.price }));

    if (previewOnly) {
      // Generate preview without persisting changes
      const applyRounding = (val: number) => {
        if (rounding === 'NEAREST_5') return Math.round(val / 5) * 5;
        if (rounding === 'NEAREST_10') return Math.round(val / 10) * 10;
        if (rounding === 'NEAREST_1') return Math.round(val);
        return Math.round(val * 100) / 100;
      };

      const preview = targetItems
        .filter(item => !itemIds || itemIds.length === 0 || itemIds.includes(item.id))
        .map(item => {
          const overrides = aggregatorManager.getItemOverrides(item.id, item.price);
          const oldPrices: Record<string, number> = {
            SWAAD_SEVAK: item.price,
            SWIGGY: overrides.swiggy.price ?? item.price,
            ZOMATO: overrides.zomato.price ?? item.price
          };
          const newPrices: Record<string, number> = { ...oldPrices };

          for (const ch of (channels || ['SWIGGY', 'ZOMATO'])) {
            const base = oldPrices[ch as keyof typeof oldPrices];
            let calculated = base;
            if (adjustmentType === 'PERCENTAGE') calculated = base * (1 + adjustmentValue / 100);
            else if (adjustmentType === 'FIXED') calculated = base + adjustmentValue;
            else if (adjustmentType === 'EXACT') calculated = adjustmentValue;
            newPrices[ch as keyof typeof newPrices] = Math.max(1, applyRounding(calculated));
          }

          return { id: item.id, name: item.name, oldPrices, newPrices };
        });

      return res.json({ success: true, previewOnly: true, preview });
    }

    const result = aggregatorManager.bulkUpdatePrices(
      restaurantId,
      itemIds || [],
      channels || ['SWIGGY', 'ZOMATO'],
      adjustmentType || 'PERCENTAGE',
      Number(adjustmentValue) || 0,
      rounding || 'NEAREST_1',
      targetItems
    );

    return res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Bulk price update error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 8. POST /api/aggregators/menu/bulk-stock - Bulk toggle availability
router.post('/menu/bulk-stock', (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { itemIds, channels, isAvailable } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ success: false, message: 'itemIds array is required.' });
    }

    const count = aggregatorManager.bulkUpdateStock(
      restaurantId,
      itemIds,
      channels || ['SWIGGY', 'ZOMATO', 'SWAAD_SEVAK'],
      Boolean(isAvailable)
    );

    return res.json({ success: true, updatedCount: count, isAvailable });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Bulk stock update error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 9. PATCH /api/aggregators/outlet/status - Pause online ordering or resume
router.patch('/outlet/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { status, pauseMinutes, reason, channels } = req.body as {
      status: 'OPEN' | 'PAUSED' | 'CLOSED';
      pauseMinutes?: number;
      reason?: string;
      channels?: ('SWIGGY' | 'ZOMATO')[];
    };

    const targetChannels = channels || ['SWIGGY', 'ZOMATO'];

    for (const ch of targetChannels) {
      const provider = aggregatorManager.getProvider(ch);
      await provider.updateOutletStatus(restaurantId, {
        status,
        pauseMinutes,
        reason
      });
    }

    aggregatorManager.logSyncEvent(
      restaurantId,
      'ALL',
      status === 'PAUSED' ? 'PAUSE_ONLINE' : 'RESUME_ONLINE',
      'OUTLET_STATUS',
      'SUCCESS',
      status === 'PAUSED'
        ? `Paused online ordering for ${pauseMinutes || 30} mins (${reason || 'Manager request'})`
        : `Resumed online orders on ${targetChannels.join(', ')}`
    );

    return res.json({
      success: true,
      message: status === 'PAUSED' ? `Paused online orders for ${pauseMinutes || 30} mins` : 'Online orders resumed'
    });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Outlet status error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 10. PATCH /api/aggregators/outlet/preptime - Adjust online prep time
router.patch('/outlet/preptime', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { prepTimeMinutes, channels } = req.body;

    const minutes = Number(prepTimeMinutes) || 25;
    const targetChannels: ('SWIGGY' | 'ZOMATO')[] = channels || ['SWIGGY', 'ZOMATO'];

    for (const ch of targetChannels) {
      const provider = aggregatorManager.getProvider(ch);
      await provider.updatePrepTime(restaurantId, minutes);
    }

    aggregatorManager.logSyncEvent(
      restaurantId,
      'ALL',
      'PREP_TIME_UPDATE',
      'PREP_TIME',
      'SUCCESS',
      `Online preparation time updated to ${minutes} minutes on ${targetChannels.join(', ')}`
    );

    return res.json({ success: true, prepTimeMinutes: minutes });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Update prep time error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 11. POST /api/aggregators/outlet/rush-mode - Quick Rush Mode control
router.post('/outlet/rush-mode', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { activate, prepTimeMinutes, pauseZomato } = req.body;

    const connections = await aggregatorManager.getAllConnections(restaurantId);
    for (const conn of connections) {
      conn.rushMode = Boolean(activate);
      if (activate) {
        conn.prepTimeMinutes = prepTimeMinutes || 35;
      } else {
        conn.prepTimeMinutes = 25;
      }
    }

    if (activate && pauseZomato) {
      await aggregatorManager.getProvider('ZOMATO').updateOutletStatus(restaurantId, {
        status: 'PAUSED',
        pauseMinutes: 45,
        reason: 'Kitchen Rush Mode active'
      });
    }

    aggregatorManager.logSyncEvent(
      restaurantId,
      'ALL',
      'RUSH_MODE_TOGGLE',
      'OUTLET_STATUS',
      activate ? 'WARNING' : 'SUCCESS',
      activate
        ? `Rush mode ACTIVATED. Prep time set to ${prepTimeMinutes || 35} mins.`
        : 'Rush mode DEACTIVATED. Normal kitchen operations resumed.'
    );

    return res.json({
      success: true,
      rushMode: Boolean(activate),
      prepTimeMinutes: activate ? (prepTimeMinutes || 35) : 25
    });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Rush mode error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 12. GET /api/aggregators/reconciliation - Aggregator financial reconciliation summary
router.get('/reconciliation', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { period } = req.query;

    const swiggyReconciliation = await aggregatorManager.getProvider('SWIGGY').getReconciliation(restaurantId, period as string);
    const zomatoReconciliation = await aggregatorManager.getProvider('ZOMATO').getReconciliation(restaurantId, period as string);

    return res.json({
      success: true,
      period: period || 'Today',
      reconciliations: [swiggyReconciliation, zomatoReconciliation]
    });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Reconciliation error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 13. GET /api/aggregators/logs - Aggregator activity & audit logs
router.get('/logs', (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const logs = aggregatorManager.getLogs(restaurantId);
    return res.json({ success: true, logs });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Logs error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 14. POST /api/aggregators/simulate-order - Sandbox simulator for testing Swiggy & Zomato orders
router.post('/simulate-order', (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { provider } = req.body as { provider?: 'SWIGGY' | 'ZOMATO' };
    const orderProvider: 'SWIGGY' | 'ZOMATO' = provider === 'ZOMATO' ? 'ZOMATO' : 'SWIGGY';

    const menuItems = db.getItems(restaurantId);
    if (menuItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No menu items found in restaurant to simulate order.' });
    }

    // Pick 1 to 3 random items
    const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 1);

    const items = selected.map(item => {
      const overrides = aggregatorManager.getItemOverrides(item.id, item.price);
      const channelPrice = orderProvider === 'SWIGGY'
        ? (overrides.swiggy.price || item.price)
        : (overrides.zomato.price || item.price);
      const qty = Math.floor(Math.random() * 2) + 1;

      return {
        id: `item_${crypto.randomUUID()}`,
        orderId: '',
        menuItemId: item.id,
        name: item.name,
        price: channelPrice,
        quantity: qty,
        portion: item.portion || 'Standard',
        notes: Math.random() > 0.6 ? 'Less spicy please' : undefined
      };
    });

    const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const packagingCharge = 35;
    const total = subtotal + tax + packagingCharge;

    const externalNum = Math.floor(10000 + Math.random() * 90000);
    const externalOrderId = orderProvider === 'SWIGGY' ? `SWG-${externalNum}` : `ZOM-${externalNum}`;

    // Find or pick a table for the order record
    const tables = db.getTables(restaurantId);
    const tableId = tables.length > 0 ? tables[0].id : 'online_delivery';
    const tableNumber = orderProvider === 'SWIGGY' ? 'Swiggy' : 'Zomato';

    const order = db.createOrder({
      restaurantId,
      tableId,
      tableNumber,
      source: orderProvider,
      status: 'PENDING',
      customerNotes: `Online Delivery (${orderProvider} #${externalOrderId}). Packaging Included: ₹35`,
      subtotal,
      tax,
      total,
      items
    });

    // Real-time alert to manager dashboard
    emitOrderStatus(restaurantId, order.tableId, order);

    aggregatorManager.logSyncEvent(
      restaurantId,
      orderProvider,
      'SIMULATE_ORDER',
      'ORDER',
      'SUCCESS',
      `Simulated incoming ${orderProvider} order #${externalOrderId} (₹${total})`
    );

    return res.json({
      success: true,
      message: `Simulated new incoming ${orderProvider} order!`,
      order
    });
  } catch (error: any) {
    console.error('[AggregatorsRoute] Simulate order error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
