export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  restaurantType: string;
  gstNumber?: string;
}

export interface Manager {
  id: string;
  username: string;
  role: string;
}

export interface MenuCategory {
  id: string;
  restaurantId?: string;
  name: string;
  displayOrder: number;
}

export interface MenuItem {
  id: string;
  restaurantId?: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  portion: string;
  isVeg: boolean;
  isAvailable: boolean;
  tags: string[];
}

export interface TableItem {
  id: string;
  tableNumber: string;
  qrToken: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'BILL_REQUESTED';
  qrUrl: string;
}

export interface OrderItem {
  id?: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  portion?: string;
  notes?: string;
}

export type OrderSource = 'DINE_IN' | 'SWIGGY' | 'ZOMATO' | 'OTHER';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'REJECTED';

export interface OrderAddition {
  id: string;
  orderId: string;
  additionNumber?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  rejectionReason?: string;
  customerNotes?: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId: string;
  tableNumber: string;
  orderNumber: string;
  source: OrderSource;
  status: OrderStatus;
  customerNotes?: string;
  subtotal: number;
  tax: number;
  total: number;
  kotGenerated: boolean;
  kotNumber?: string;
  billRequested: boolean;
  rejectionReason?: string;
  additions?: OrderAddition[];
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface Bill {
  id: string;
  restaurantId: string;
  orderId: string;
  orderNumber: string;
  tableNumber: string;
  billNumber: string;
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  paymentStatus: 'UNPAID' | 'PAID_CASH' | 'PAID_UPI' | 'PAID_CARD';
  createdAt: string;
  items: OrderItem[];
}

export interface KOTData {
  restaurantName: string;
  kotNumber: string;
  orderNumber: string;
  tableNumber: string;
  time: string;
  source: OrderSource;
  items: {
    name: string;
    quantity: number;
    portion?: string;
    notes?: string;
  }[];
  specialInstructions?: string;
  paperWidth: '58mm' | '80mm';
  isAddition?: boolean;
  additionNumber?: string;
}

export interface PrinterConfig {
  id: string;
  printerName: string;
  paperWidth: '58mm' | '80mm';
  autoPrintKot: boolean;
  printerType: 'BROWSER' | 'USB' | 'NETWORK';
  printerIp?: string;
}

export interface ExtractedMenuItem {
  category: string;
  name: string;
  description: string;
  price: number;
  portion: string;
  isVeg: boolean;
  tags: string[];
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AnalyticsQueryOptions {
  range?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsData {
  period: {
    key: string;
    label: string;
    startDate: string;
    endDate: string;
    comparisonStartDate: string;
    comparisonEndDate: string;
    comparisonLabel: string;
  };
  summary: {
    totalSales: number;
    previousSales: number;
    salesChangePercent: number;

    totalOrders: number;
    previousOrders: number;
    ordersChangePercent: number;

    averageOrderValue: number;
    previousAov: number;
    aovChangePercent: number;

    dineInSales: number;
    previousDineInSales: number;
    dineInSalesChangePercent: number;

    onlineSales: number;
    previousOnlineSales: number;
    onlineSalesChangePercent: number;

    rejectionRate: number;
    previousRejectionRate: number;
    rejectionRateChangeDiff: number;
  };
  executiveReport: {
    headline: string;
    bullets: string[];
  };
  salesTrend: {
    granularity: 'hour' | 'day';
    data: {
      label: string;
      fullDate: string;
      timestamp: string;
      sales: number;
      orders: number;
      dineInSales: number;
      onlineSales: number;
    }[];
  };
  channelBreakdown: {
    channels: {
      source: OrderSource;
      displayName: string;
      orders: number;
      sales: number;
      aov: number;
      shareOfSales: number;
      shareOfOrders: number;
      hasData: boolean;
      statusNote: string;
    }[];
    plainEnglishInsight: string;
  };
  onlineAnalytics: {
    swiggy: {
      orders: number;
      sales: number;
      aov: number;
      rejected: number;
      shareOfSales: number;
      hasOrders: boolean;
    };
    zomato: {
      orders: number;
      sales: number;
      aov: number;
      rejected: number;
      shareOfSales: number;
      hasOrders: boolean;
    };
  };
  itemPerformance: {
    items: {
      itemId: string;
      name: string;
      category: string;
      quantitySold: number;
      revenue: number;
      averagePrice: number;
      shareOfSales: number;
      isVeg: boolean;
      tags: string[];
    }[];
    mostSoldItem: { name: string; quantity: number; revenue: number } | null;
    highestRevenueItem: { name: string; quantity: number; revenue: number } | null;
  };
  categoryPerformance: {
    categoryId: string;
    categoryName: string;
    sales: number;
    quantity: number;
    shareOfSales: number;
  }[];
  peakHours: {
    hourlyData: {
      hour: number;
      label: string;
      orders: number;
      sales: number;
    }[];
    busiestPeriodLabel: string;
    busiestPeriodShare: number;
  };
  peakDays: {
    dayData: {
      dayIndex: number;
      dayName: string;
      sales: number;
      orders: number;
    }[];
    bestDayName: string;
    slowestDayName: string;
  };
  tablePerformance: {
    tables: {
      tableNumber: string;
      orders: number;
      sales: number;
      aov: number;
    }[];
    mostActiveTable: string | null;
  };
  orderOutcomes: {
    completed: number;
    acceptedPreparing: number;
    ready: number;
    rejected: number;
    completionRate: number;
    rejectionRate: number;
    rejectedReasons?: { reason: string; count: number }[];
  };
  insights: {
    id: string;
    type: 'positive' | 'warning' | 'channel' | 'timing' | 'menu';
    title: string;
    description: string;
    priority: number;
  }[];
  exportOrders: {
    date: string;
    orderNumber: string;
    source: string;
    table: string;
    status: string;
    itemsSummary: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  }[];
}

// Aggregator Module Types
export type AggregatorProviderId = 'SWIGGY' | 'ZOMATO' | 'MOCK';
export type AggregatorConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING';
export type ChannelSyncStatus = 'SYNCED' | 'PENDING' | 'FAILED' | 'NEEDS_REVIEW' | 'NOT_MAPPED';

export interface AggregatorConnection {
  id: string;
  restaurantId: string;
  provider: AggregatorProviderId;
  outletId: string;
  outletName: string;
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

export interface UnifiedMenuItem extends MenuItem {
  channelOverrides?: MenuItemChannelOverrides;
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
  period: string;
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

export interface KitchenIntelligence {
  loadScore: number;
  activeOrdersCount: number;
  pendingOrdersCount: number;
  recommendedPrepTime: number;
  statusLabel: 'HIGH_LOAD' | 'MODERATE' | 'NORMAL';
}


