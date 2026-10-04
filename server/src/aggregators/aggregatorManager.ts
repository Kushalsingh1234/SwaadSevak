import { SwiggyProvider } from './swiggyProvider.js';
import { ZomatoProvider } from './zomatoProvider.js';
import {
  AggregatorProviderId,
  AggregatorConnection,
  AggregatorSyncLog,
  MenuItemChannelOverrides,
  AggregatorOutletStatusUpdate
} from './types.js';

export class AggregatorManager {
  private swiggy = new SwiggyProvider();
  private zomato = new ZomatoProvider();
  private processedOrderIds = new Set<string>(); // Idempotency tracker
  private syncLogs: AggregatorSyncLog[] = [];
  private channelOverrides = new Map<string, MenuItemChannelOverrides>(); // key: menuItemId

  getProvider(providerId: AggregatorProviderId) {
    if (providerId === 'SWIGGY') return this.swiggy;
    if (providerId === 'ZOMATO') return this.zomato;
    throw new Error(`Unsupported aggregator provider: ${providerId}`);
  }

  // Idempotency check for incoming order webhooks
  isOrderProcessed(provider: AggregatorProviderId, externalOrderId: string, restaurantId: string): boolean {
    const key = `${provider}_${restaurantId}_${externalOrderId}`;
    return this.processedOrderIds.has(key);
  }

  markOrderProcessed(provider: AggregatorProviderId, externalOrderId: string, restaurantId: string) {
    const key = `${provider}_${restaurantId}_${externalOrderId}`;
    this.processedOrderIds.add(key);
  }

  // Sync Logging
  logSyncEvent(
    restaurantId: string,
    provider: AggregatorProviderId | 'ALL',
    action: string,
    entityType: AggregatorSyncLog['entityType'],
    status: AggregatorSyncLog['status'],
    summary: string,
    details?: any
  ) {
    const log: AggregatorSyncLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      restaurantId,
      provider,
      action,
      entityType,
      status,
      summary,
      details,
      timestamp: new Date().toISOString()
    };
    this.syncLogs.unshift(log);
    if (this.syncLogs.length > 200) {
      this.syncLogs = this.syncLogs.slice(0, 200);
    }
  }

  getLogs(restaurantId: string): AggregatorSyncLog[] {
    return this.syncLogs.filter(l => l.restaurantId === restaurantId);
  }

  // Connection management
  async getAllConnections(restaurantId: string): Promise<AggregatorConnection[]> {
    const swiggyConn = this.swiggy.getConnection(restaurantId) || {
      id: `swiggy_${restaurantId}`,
      restaurantId,
      provider: 'SWIGGY',
      outletId: 'SWG-IND-8841',
      outletName: 'The Chai & Chaat Co. - Swiggy',
      status: 'CONNECTED',
      isOnline: true,
      prepTimeMinutes: 25,
      rushMode: false,
      menuSynced: true,
      ordersConnected: true,
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      lastOrderAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      updatedAt: new Date().toISOString()
    };

    const zomatoConn = this.zomato.getConnection(restaurantId) || {
      id: `zomato_${restaurantId}`,
      restaurantId,
      provider: 'ZOMATO',
      outletId: 'ZOM-IND-4921',
      outletName: 'The Chai & Chaat Co. - Zomato',
      status: 'CONNECTED',
      isOnline: true,
      prepTimeMinutes: 25,
      rushMode: false,
      menuSynced: true,
      ordersConnected: true,
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      lastOrderAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Ensure they are stored
    this.swiggy.setConnection(restaurantId, swiggyConn);
    this.zomato.setConnection(restaurantId, zomatoConn);

    return [swiggyConn, zomatoConn];
  }

  // Channel Overrides Management
  getItemOverrides(menuItemId: string, defaultPrice = 0): MenuItemChannelOverrides {
    const existing = this.channelOverrides.get(menuItemId);
    if (existing) return existing;

    // Default: Same price or slight commercial markup (e.g. Swiggy +15%, Zomato +12%)
    const defaultOverrides: MenuItemChannelOverrides = {
      menuItemId,
      priceMode: 'SEPARATE_CHANNELS',
      swiggy: {
        enabled: true,
        price: Math.round(defaultPrice * 1.15),
        isAvailable: true,
        syncStatus: 'SYNCED'
      },
      zomato: {
        enabled: true,
        price: Math.round(defaultPrice * 1.12),
        isAvailable: true,
        syncStatus: 'SYNCED'
      }
    };
    this.channelOverrides.set(menuItemId, defaultOverrides);
    return defaultOverrides;
  }

  setItemOverrides(menuItemId: string, overrides: Partial<MenuItemChannelOverrides>) {
    const current = this.getItemOverrides(menuItemId);
    const updated: MenuItemChannelOverrides = {
      ...current,
      ...overrides,
      swiggy: { ...current.swiggy, ...overrides.swiggy },
      zomato: { ...current.zomato, ...overrides.zomato }
    };
    this.channelOverrides.set(menuItemId, updated);
    return updated;
  }

  // Bulk Price Updates with mathematical rounding
  bulkUpdatePrices(
    restaurantId: string,
    itemIds: string[],
    channels: ('SWIGGY' | 'ZOMATO' | 'SWAAD_SEVAK')[],
    adjustmentType: 'PERCENTAGE' | 'FIXED' | 'EXACT',
    adjustmentValue: number,
    rounding: 'NONE' | 'NEAREST_1' | 'NEAREST_5' | 'NEAREST_10',
    currentItems: Array<{ id: string; name: string; price: number }>
  ): { updatedCount: number; preview: Array<{ id: string; name: string; oldPrices: Record<string, number>; newPrices: Record<string, number> }> } {
    const previewList = [];

    const applyRounding = (val: number) => {
      if (rounding === 'NEAREST_5') return Math.round(val / 5) * 5;
      if (rounding === 'NEAREST_10') return Math.round(val / 10) * 10;
      if (rounding === 'NEAREST_1') return Math.round(val);
      return Math.round(val * 100) / 100;
    };

    for (const item of currentItems) {
      if (itemIds.length > 0 && !itemIds.includes(item.id)) continue;

      const overrides = this.getItemOverrides(item.id, item.price);
      const oldPrices: Record<string, number> = {
        SWAAD_SEVAK: item.price,
        SWIGGY: overrides.swiggy.price ?? item.price,
        ZOMATO: overrides.zomato.price ?? item.price
      };
      const newPrices: Record<string, number> = { ...oldPrices };

      for (const ch of channels) {
        const base = oldPrices[ch];
        let calculated = base;

        if (adjustmentType === 'PERCENTAGE') {
          calculated = base * (1 + adjustmentValue / 100);
        } else if (adjustmentType === 'FIXED') {
          calculated = base + adjustmentValue;
        } else if (adjustmentType === 'EXACT') {
          calculated = adjustmentValue;
        }

        newPrices[ch] = Math.max(1, applyRounding(calculated));
      }

      // Commit update
      if (channels.includes('SWIGGY')) {
        overrides.swiggy.price = newPrices.SWIGGY;
        overrides.swiggy.syncStatus = 'SYNCED';
      }
      if (channels.includes('ZOMATO')) {
        overrides.zomato.price = newPrices.ZOMATO;
        overrides.zomato.syncStatus = 'SYNCED';
      }
      this.setItemOverrides(item.id, overrides);

      previewList.push({
        id: item.id,
        name: item.name,
        oldPrices,
        newPrices
      });
    }

    this.logSyncEvent(
      restaurantId,
      'ALL',
      'BULK_PRICE_UPDATE',
      'PRICE',
      'SUCCESS',
      `Updated prices for ${previewList.length} items across ${channels.join(', ')} (${adjustmentType} ${adjustmentValue})`
    );

    return {
      updatedCount: previewList.length,
      preview: previewList
    };
  }

  // Bulk Availability (e.g. Sold Out Everywhere)
  bulkUpdateStock(
    restaurantId: string,
    itemIds: string[],
    channels: ('SWIGGY' | 'ZOMATO' | 'SWAAD_SEVAK')[],
    isAvailable: boolean
  ): number {
    for (const id of itemIds) {
      const overrides = this.getItemOverrides(id);
      if (channels.includes('SWIGGY')) {
        overrides.swiggy.isAvailable = isAvailable;
      }
      if (channels.includes('ZOMATO')) {
        overrides.zomato.isAvailable = isAvailable;
      }
      this.setItemOverrides(id, overrides);
    }

    this.logSyncEvent(
      restaurantId,
      'ALL',
      'BULK_STOCK_TOGGLE',
      'AVAILABILITY',
      'SUCCESS',
      `Marked ${itemIds.length} items ${isAvailable ? 'AVAILABLE' : 'OUT_OF_STOCK'} on ${channels.join(', ')}`
    );

    return itemIds.length;
  }
}

export const aggregatorManager = new AggregatorManager();
