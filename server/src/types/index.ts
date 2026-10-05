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
  createdAt: Date;
  updatedAt: Date;
}

export interface Manager {
  id: string;
  restaurantId: string;
  username: string;
  pinHash: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  createdAt: Date;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  displayOrder: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  portion: string; // "Standard", "Half", "Full", etc.
  isVeg: boolean;
  isAvailable: boolean;
  tags: string[]; // ["Bestseller", "Spicy", "Chef's Special"]
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: string;
  restaurantId: string;
  tableNumber: string; // e.g. "Table 01", "Table 02"
  qrToken: string; // secure token
  status: 'AVAILABLE' | 'OCCUPIED' | 'BILL_REQUESTED';
  createdAt: Date;
}

export type OrderSource = 'DINE_IN' | 'SWIGGY' | 'ZOMATO' | 'OTHER';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'REJECTED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  portion?: string;
  notes?: string;
}

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
  createdAt: Date;
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
  estimatedPrepTime?: number;
  settled?: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  items: OrderItem[];
}

export interface PrinterConfig {
  id: string;
  restaurantId: string;
  printerName: string;
  paperWidth: '58mm' | '80mm';
  autoPrintKot: boolean;
  printerType: 'BROWSER' | 'USB' | 'NETWORK';
  printerIp?: string;
}

export interface JwtPayload {
  managerId: string;
  restaurantId: string;
  username: string;
  restaurantName: string;
  restaurantSlug: string;
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
  tz?: string;
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

// ==========================================
// GROWTH ENGINE TYPES & MODELS
// ==========================================

export type BusinessType = 'Café' | 'Restaurant' | 'Fast Food' | 'Bakery / Café' | 'QSR' | 'Other';

export type GrowthDataMode = 'swaad' | 'pos' | 'combined';

export type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type RecommendationBadge = '🔥 High opportunity' | '💡 Worth trying' | '⚠️ Needs attention';
export type ConfidenceLevel = 'High confidence' | 'Moderate confidence' | 'Limited data';

export type RecommendationCategory =
  | 'REVENUE'
  | 'MENU'
  | 'PRICING'
  | 'TIMING'
  | 'INVENTORY'
  | 'CUSTOMER';

export interface GrowthRecommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  badge: RecommendationBadge;
  priority: RecommendationPriority;
  confidence: ConfidenceLevel;
  confidenceNote?: string;
  found: string;           // "What we found"
  impact: string;          // "Why it matters"
  action: string;          // "What the owner can do / Try this"
  expectedImpact?: string; // "Potential opportunity"
  actionType: 'CREATE_OFFER' | 'UPDATE_PRICE' | 'REVIEW_MENU' | 'ADJUST_INVENTORY' | 'SET_COST' | 'DISMISS';
  targetItemName?: string;
  currentPrice?: number;
  suggestedPrice?: number;
  suggestedComboWith?: string;
  suggestedTimeSlot?: string;
  implemented?: boolean;
}

export interface PosReportItem {
  name: string;
  category?: string;
  quantity: number;
  totalSales: number;
  unitPrice?: number;
  estimatedCost?: number;
}

export interface PosReport {
  id: string;
  restaurantId: string;
  fileName: string;
  posProvider: string; // 'Petpooja' | 'Posist' | 'DotPe' | 'Generic POS'
  fileType: 'csv' | 'xlsx' | 'pdf';
  uploadedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  periodLabel: string;
  totalOrders: number;
  totalSales: number;
  totalProducts: number;
  items: PosReportItem[];
  hourlyDistribution?: Record<number, number>; // hour -> count/sales
  dowDistribution?: Record<number, number>;    // 0-6 -> sales
  overlapDetectedWithSwaad?: boolean;
  overlapNotes?: string;
}

export interface GrowthEngineData {
  businessType: BusinessType;
  dataMode: GrowthDataMode;
  period: {
    label: string;
    startDate: string;
    endDate: string;
  };
  sources: {
    swaad: {
      available: boolean;
      orders: number;
      sales: number;
      dateRange?: string;
    };
    pos: {
      available: boolean;
      reportId?: string;
      reportName?: string;
      provider?: string;
      orders: number;
      sales: number;
      dateRange?: string;
    };
    totalAnalyzedSales: number;
    totalAnalyzedOrders: number;
    overlapDetected: boolean;
    overlapMessage?: string;
  };
  confidence: {
    level: ConfidenceLevel;
    message: string;
    daysCount: number;
    ordersCount: number;
  };
  snapshot: {
    revenue: number;
    orders: number;
    averageOrderValue: number;
    bestsellerItem: string;
    bestsellerSales: number;
    bestsellerQty: number;
    comparison?: {
      periodLabel: string;
      previousRevenue: number;
      currentRevenue: number;
      percentChange: number;
      explanation: string;
    };
  };
  topOpportunities: GrowthRecommendation[];
  menuOpportunities: GrowthRecommendation[];
  timingOpportunities: GrowthRecommendation[];
  pricingOpportunities: GrowthRecommendation[];
  inventoryOpportunities: GrowthRecommendation[];
  customerOpportunities: GrowthRecommendation[];
  allRecommendations: GrowthRecommendation[];
  inventoryAvailable: boolean;
  costsConfiguredCount: number;
  totalItemsCount: number;
  availableReports: {
    id: string;
    fileName: string;
    posProvider: string;
    periodLabel: string;
    totalOrders: number;
    totalSales: number;
    uploadedAt: string;
  }[];
}

