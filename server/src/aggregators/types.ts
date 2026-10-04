// Swaad Sevak - Aggregator Integration Layer
// Types and interfaces conforming to official Swiggy & Zomato POS specifications

export type AggregatorProviderId = 'SWIGGY' | 'ZOMATO' | 'MOCK';

export type AggregatorConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING';

export type ChannelSyncStatus = 'SYNCED' | 'PENDING' | 'FAILED' | 'NEEDS_REVIEW' | 'NOT_MAPPED';

export type RiderStatus = 'UNASSIGNED' | 'ASSIGNED' | 'ARRIVING' | 'AT_RESTAURANT' | 'PICKED_UP' | 'DELIVERED';

export interface AggregatorConnection {
  id: string;
  restaurantId: string;
  provider: AggregatorProviderId;
  outletId: string;
  outletName: string;
  externalRestaurantId?: string;
  status: AggregatorConnectionStatus;
  isOnline: boolean;
  pausedUntil?: string | null;
  prepTimeMinutes: number;
  rushMode: boolean;
  menuSynced: boolean;
  ordersConnected: boolean;
  lastSyncAt?: string | null;
  lastOrderAt?: string | null;
  lastSuccessfulEvent?: string | null;
  errorMessage?: string | null;
  apiKeyMasked?: string;
  merchantSecretMasked?: string;
  updatedAt: string;
}

export interface MenuItemChannelConfig {
  enabled: boolean;
  price?: number;
  customName?: string;
  customDescription?: string;
  customImage?: string;
  isAvailable: boolean;
  syncStatus: ChannelSyncStatus;
  lastSyncAt?: string;
  syncMessage?: string;
}

export interface MenuItemChannelOverrides {
  menuItemId: string;
  priceMode: 'SAME_EVERYWHERE' | 'SEPARATE_CHANNELS';
  swiggy: MenuItemChannelConfig;
  zomato: MenuItemChannelConfig;
}

export interface AggregatorOrderDetails {
  externalOrderId: string;
  provider: AggregatorProviderId;
  deliveryType: 'DELIVERY' | 'SELF_PICKUP';
  prepTimeMinutes: number;
  customerName?: string;
  customerPhoneMasked?: string;
  deliveryAddressMasked?: string;
  rider?: {
    name?: string;
    phoneMasked?: string;
    status: RiderStatus;
    etaMinutes?: number;
  };
  financials: {
    itemTotal: number;
    packagingCharge: number;
    deliveryCharge: number;
    taxes: number;
    customerDiscount: number;
    customerPaidTotal: number;
    restaurantCommissionRate: number; // e.g. 18%
    platformCommissionAmount: number;
    restaurantDiscountFunded: number;
    netPayoutEstimated: number;
  };
  specialInstructions?: string;
  otpRequired?: boolean;
  deliveryOtp?: string;
}

export interface AggregatorSyncLog {
  id: string;
  restaurantId: string;
  provider: AggregatorProviderId | 'ALL';
  action: string;
  entityType: 'MENU' | 'PRICE' | 'AVAILABILITY' | 'OUTLET_STATUS' | 'ORDER' | 'PREP_TIME';
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  summary: string;
  details?: any;
  timestamp: string;
}

export interface AggregatorReconciliationSummary {
  provider: AggregatorProviderId;
  period: string; // e.g. "Today", "Last 7 Days"
  grossOrdersCount: number;
  grossSales: number;
  packagingCharges: number;
  taxesCollected: number;
  platformCommission: number;
  discountsTotal: number;
  restaurantFundedDiscounts: number;
  otherDeductions: number;
  expectedSettlement: number;
  actualSettlement: number;
  difference: number;
  status: 'MATCHED' | 'MISMATCH';
}

export interface AggregatorOutletStatusUpdate {
  status: 'OPEN' | 'PAUSED' | 'CLOSED';
  pauseMinutes?: number;
  reason?: string;
}

export interface AggregatorProvider {
  providerId: AggregatorProviderId;
  connect(restaurantId: string, credentials: { outletId: string; outletName: string; apiKey?: string; merchantSecret?: string }): Promise<{ success: boolean; connection: AggregatorConnection; message?: string }>;
  disconnect(restaurantId: string): Promise<boolean>;
  syncMenu(restaurantId: string, menuData: any): Promise<{ success: boolean; syncedItemsCount: number; errors?: any[] }>;
  updateItemAvailability(restaurantId: string, itemId: string, isAvailable: boolean): Promise<boolean>;
  updateItemPrice(restaurantId: string, itemId: string, price: number): Promise<boolean>;
  updateOutletStatus(restaurantId: string, statusUpdate: AggregatorOutletStatusUpdate): Promise<boolean>;
  updatePrepTime(restaurantId: string, prepTimeMinutes: number): Promise<boolean>;
  acceptOrder(restaurantId: string, externalOrderId: string, prepTimeMinutes: number): Promise<{ success: boolean; message?: string }>;
  rejectOrder(restaurantId: string, externalOrderId: string, reason: string): Promise<{ success: boolean; message?: string }>;
  markOrderReady(restaurantId: string, externalOrderId: string): Promise<{ success: boolean; message?: string }>;
  verifyWebhook(signature: string, payload: any): boolean;
  getReconciliation(restaurantId: string, period?: string): Promise<AggregatorReconciliationSummary>;
}
