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
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  coinsUsed?: number;
  coinsEarned?: number;
  coinDiscount?: number;
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
  coinsUsed?: number;
  coinsEarned?: number;
  grandTotal: number;
  paymentStatus: 'UNPAID' | 'PAID_CASH' | 'PAID_UPI' | 'PAID_CARD';
  createdAt: Date;
  items: OrderItem[];
}

export type CustomerStatus = 'NEW' | 'REGULAR' | 'VIP' | 'AT_RISK' | 'INACTIVE';

export interface Customer {
  id: string;
  restaurantId: string;
  name: string;
  phone: string;
  coinBalance: number;
  reservedCoins: number;
  totalCoinsEarned: number;
  totalCoinsRedeemed: number;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  firstVisit: Date;
  lastVisit: Date;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CoinTransactionType =
  | 'SIGNUP_BONUS'
  | 'ORDER_EARN'
  | 'REDEMPTION'
  | 'REFUND'
  | 'ADMIN_ADJUSTMENT'
  | 'REVERSAL';

export interface CoinTransaction {
  id: string;
  restaurantId: string;
  customerId: string;
  type: CoinTransactionType;
  coins: number;
  orderId?: string;
  discount?: number;
  reason?: string;
  balanceAfter: number;
  createdAt: Date;
}

export interface CrmSettings {
  id: string;
  restaurantId: string;
  enabled: boolean;
  coinsPerAmount: number; // e.g. 10 => 1 coin for every 10 Rs spent
  coinsEarnedPerUnit: number; // e.g. 1
  signupBonusEnabled: boolean;
  signupBonusCoins: number; // e.g. 100
  minOrderValue: number; // e.g. 300
  redemptionCoinsUnit: number; // e.g. 100
  redemptionDiscountUnit: number; // e.g. 10 (100 coins = Rs 10 discount)
  maxDiscountPerOrder: number; // e.g. 100
  allowFullDiscount: boolean; // default false
  earnOnFood: boolean;
  earnOnTax: boolean;
  earnOnService: boolean;
  earnOnDelivery: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CrmEventType =
  | 'CUSTOMER_SIGNED_UP'
  | 'ORDER_COMPLETED'
  | 'COINS_REDEEMED'
  | 'CUSTOMER_INACTIVE_30_DAYS'
  | 'CUSTOMER_INACTIVE_60_DAYS'
  | 'CUSTOMER_REACHED_10_VISITS'
  | 'CUSTOMER_BECAME_VIP'
  | 'CUSTOMER_BIRTHDAY'
  | 'CUSTOMER_EARNED_REWARD';

export interface CrmEvent {
  id: string;
  restaurantId: string;
  type: CrmEventType;
  customerId?: string;
  orderId?: string;
  data?: Record<string, any>;
  createdAt: Date;
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

// ==========================================
// SWAADSEVAK AI CRM TYPES & MODELS
// ==========================================

export type AiRecommendationCategory =
  | 'WIN_BACK'
  | 'NEW_RETENTION'
  | 'VIP_PROTECTION'
  | 'INCREASE_AOV'
  | 'PRODUCT_BASED'
  | 'LOW_FREQ_HIGH_VALUE'
  | 'FEEDBACK_RECOVERY'
  | 'BIRTHDAY'
  | 'NO_DISCOUNT';

export interface AiRecommendation {
  id: string;
  category: AiRecommendationCategory;
  title: string;
  explanation: string;
  recommendedAction: string;
  expectedObjective: string;
  targetAudienceLabel: string;
  targetAudienceCount: number;
  estimatedValue: string;
  historicalAov?: number;
  recommendedCoins?: number;
  validityDays?: number;
  badge: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedTemplate?: string;
  actionPayload?: {
    audienceFilter: string;
    coinsReward: number;
    validityDays: number;
    channel: CampaignChannel;
    defaultTone: CampaignTone;
    defaultLanguage: CampaignLanguage;
  };
}

export interface AiSegment {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  customerCount: number;
  avgOrderValue: number;
  avgVisitsPerMonth: number;
  totalRevenue: number;
  suggestedCampaignIdea: string;
  icon?: string;
}

export type CampaignStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'PAUSED'
  | 'CANCELLED';

export type CampaignMode = 'RECOMMENDATION_ONLY' | 'APPROVAL_REQUIRED' | 'AUTOMATIC';
export type CampaignChannel = 'WHATSAPP' | 'SMS' | 'EMAIL';
export type CampaignPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type CampaignTone = 'FRIENDLY' | 'PREMIUM' | 'CASUAL' | 'URGENT' | 'FESTIVE' | 'PROFESSIONAL';
export type CampaignLanguage = 'ENGLISH' | 'HINDI' | 'HINGLISH';
export type CampaignOfferType = 'DISCOUNT_COINS' | 'FLAT_DISCOUNT' | 'FREE_ITEM' | 'NO_DISCOUNT';

export interface CampaignStats {
  sent: number;
  delivered: number;
  clicks?: number;
  redeemed: number;
  conversionRate: number;
  revenueGenerated: number;
  discountCost: number;
  netRevenue: number;
  controlGroup?: {
    groupSize: number;
    returnCount: number;
    returnRate: number;
    incrementalRevenue: number;
  };
}

export interface AiCampaign {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  objective: string;
  audienceSegment: string;
  audienceConditions?: string;
  targetCount: number;
  channel: CampaignChannel;
  mode: CampaignMode;
  priority: CampaignPriority;
  status: CampaignStatus;
  tone: CampaignTone;
  language: CampaignLanguage;
  offerType: CampaignOfferType;
  offerValue: number;
  offerPerkText?: string;
  validityDays: number;
  messageTemplate: string;
  resolvedMessagePreview: string;
  scheduledFor?: string;
  sentAt?: string;
  maxRewardCost: number;
  requiresApproval: boolean;
  frequencyGuard: {
    maxPerMonth: number;
    minGapDays: number;
  };
  stats?: CampaignStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiAutomation {
  id: string;
  restaurantId: string;
  name: string;
  trigger: string;
  conditions: string;
  action: string;
  channel: CampaignChannel;
  frequencyLimitDays: number;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  lastRun?: string;
  customersReached: number;
  revenueAttributed: number;
  createdAt: Date;
}

export interface CustomerAiSummary {
  customerId: string;
  customerName: string;
  summaryText: string;
  churnRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  churnRiskLabel: string;
  estimatedClv: number;
  normalVisitIntervalDays: number;
  daysSinceLastVisit: number;
  favoriteItems: string[];
  discountDependence: 'LOW' | 'MEDIUM' | 'HIGH';
  nextBestAction: {
    title: string;
    actionText: string;
    reason: string;
    coinsOffer?: number;
  };
  marketingPreferences: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
  };
}

export interface AiCrmDashboardData {
  winBackCard: {
    customerCount: number;
    potentialRevenue: number;
  };
  vipCard: {
    customerCount: number;
    lifetimeSpend: number;
  };
  opportunitiesCard: {
    count: number;
  };
  automationsCard: {
    activeCount: number;
    recentRunsCount: number;
    totalAttributedRevenue: number;
  };
  topRecommendations: AiRecommendation[];
  recentCampaigns: AiCampaign[];
}


