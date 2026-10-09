import {
  AnalyticsData,
  AnalyticsQueryOptions,
  AiCrmDashboardData,
  AiRecommendation,
  AiSegment,
  AiCampaign,
  AiAutomation,
  CustomerAiSummary
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('swaad_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class ApiError extends Error {
  status: number;
  data?: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401 && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/register')) {
      localStorage.removeItem('swaad_token');
      localStorage.removeItem('swaad_restaurant');
      localStorage.removeItem('swaad_manager');
      window.dispatchEvent(new CustomEvent('swaad:unauthorized'));
    }
    throw new ApiError(data?.message || `Request failed with status ${response.status}`, response.status, data);
  }
  return data as T;
}

export const api = {
  // Auth
  register: (payload: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { username: string; pin: string }) =>
    request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: String(payload.username || '').trim(),
        pin: String(payload.pin || '').trim()
      })
    }),
  getMe: () => request<any>('/auth/me'),

  // Menu
  getCategories: () => request<any>('/menu/categories'),
  createCategory: (name: string) => request<any>('/menu/categories', { method: 'POST', body: JSON.stringify({ name }) }),
  updateCategory: (id: string, name: string) => request<any>(`/menu/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),
  deleteCategory: (id: string) => request<any>(`/menu/categories/${id}`, { method: 'DELETE' }),

  getMenuItems: () => request<any>('/menu/items'),
  createMenuItem: (payload: any) => request<any>('/menu/items', { method: 'POST', body: JSON.stringify(payload) }),
  updateMenuItem: (id: string, payload: any) => request<any>(`/menu/items/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  toggleItemStock: (id: string, isAvailable: boolean) => request<any>(`/menu/items/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ isAvailable }) }),
  deleteMenuItem: (id: string) => request<any>(`/menu/items/${id}`, { method: 'DELETE' }),

  // AI Menu Upload
  uploadMenuPdf: async (file: File) => {
    const formData = new FormData();
    formData.append('menuPdf', file);
    const token = localStorage.getItem('swaad_token');
    const response = await fetch(`${API_BASE}/menu/ai/parse-pdf`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'PDF upload failed');
    return data;
  },
  confirmAiMenu: (items: any[]) => request<any>('/menu/ai/confirm-menu', { method: 'POST', body: JSON.stringify({ items }) }),

  // Tables & QR
  getTables: () => request<any>('/tables'),
  createTable: (tableNumber: string) => request<any>('/tables', { method: 'POST', body: JSON.stringify({ tableNumber }) }),
  bulkCreateTables: (count: number, prefix?: string) => request<any>('/tables/bulk', { method: 'POST', body: JSON.stringify({ count, prefix }) }),
  updateTable: (id: string, tableNumber: string) => request<any>(`/tables/${id}`, { method: 'PUT', body: JSON.stringify({ tableNumber }) }),
  regenerateTableQr: (id: string) => request<any>(`/tables/${id}/regenerate-qr`, { method: 'POST' }),
  deleteTable: (id: string) => request<any>(`/tables/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: (params?: { status?: string; source?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any>(`/orders${query ? `?${query}` : ''}`);
  },
  updateOrderStatus: (id: string, status: string, rejectionReason?: string, estimatedPrepTime?: number) =>
    request<any>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, rejectionReason, estimatedPrepTime }) }),
  getOrderKot: (id: string) => request<any>(`/orders/${id}/kot`),
  acceptOrderAddition: (orderId: string, additionId: string) => request<any>(`/orders/${orderId}/additions/${additionId}/accept`, { method: 'PATCH' }),
  rejectOrderAddition: (orderId: string, additionId: string, reason?: string) => request<any>(`/orders/${orderId}/additions/${additionId}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }),

  // Bills
  getBills: () => request<any>('/bills'),
  generateBill: (orderId: string) => request<any>(`/bills/generate/${orderId}`, { method: 'POST' }),
  settleBill: (billId: string, paymentStatus: string) => request<any>(`/bills/${billId}/settle`, { method: 'PATCH', body: JSON.stringify({ paymentStatus }) }),

  // Printer
  getPrinterConfig: () => request<any>('/printer/config'),
  updatePrinterConfig: (config: any) => request<any>('/printer/config', { method: 'PUT', body: JSON.stringify(config) }),
  printKotNetwork: (orderId: string, isAddition?: boolean, additionId?: string) =>
    request<any>('/printer/print-kot', {
      method: 'POST',
      body: JSON.stringify({ orderId, isAddition, additionId })
    }),

  // Stats & Analytics
  getTodayStats: () => request<any>('/stats/today'),
  getAnalytics: (params?: AnalyticsQueryOptions) => {
    const query = new URLSearchParams(params as any).toString();
    return request<{ success: boolean; analytics: AnalyticsData }>(`/analytics${query ? `?${query}` : ''}`);
  },
  downloadAnalyticsCsv: async (params?: AnalyticsQueryOptions): Promise<void> => {
    const query = new URLSearchParams(params as any).toString();
    const token = localStorage.getItem('swaad_token');
    const res = await fetch(`${API_BASE}/analytics/export/csv${query ? `?${query}` : ''}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) throw new Error('Failed to download CSV');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swaad_sevak_analytics_${params?.range || 'custom'}_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  // Public Diner APIs (No auth needed)
  getPublicMenu: (restaurantSlug: string, qrToken: string, customerId?: string) =>
    fetch(`${API_BASE}/public/menu/${restaurantSlug}/${qrToken}${customerId ? `?customerId=${encodeURIComponent(customerId)}` : ''}`).then(r => r.json()),
  placePublicOrder: (payload: any) => fetch(`${API_BASE}/public/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r => r.json()),
  requestPublicBill: (orderId: string, payload: any) => fetch(`${API_BASE}/public/order/${orderId}/request-bill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r => r.json()),
  getPublicOrderStatus: (orderId: string) => fetch(`${API_BASE}/public/order/${orderId}/status`).then(r => r.json()),
  getPublicInvoice: (orderId: string) => fetch(`${API_BASE}/public/order/${orderId}/invoice`).then(r => r.json()),

  // Public Diner CRM & Discount Coins (No auth needed)
  getPublicCustomer: (restaurantSlug: string, customerId: string) =>
    fetch(`${API_BASE}/public/crm/customer/${encodeURIComponent(customerId)}?restaurantSlug=${encodeURIComponent(restaurantSlug)}`).then(r => r.json()),
  identifyPublicCustomer: (restaurantSlug: string, phone: string) =>
    fetch(`${API_BASE}/public/crm/identify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantSlug, phone })
    }).then(r => r.json()),
  signupPublicCustomer: (restaurantSlug: string, name: string, phone: string) =>
    fetch(`${API_BASE}/public/crm/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantSlug, name, phone })
    }).then(r => r.json()),
  calculatePublicDiscount: (restaurantSlug: string, customerId: string, subtotal: number) =>
    fetch(`${API_BASE}/public/crm/calculate-discount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantSlug, customerId, subtotal })
    }).then(r => r.json()),
  claimPostOrderBonus: (restaurantSlug: string, orderId: string, name: string, phone: string) =>
    fetch(`${API_BASE}/public/crm/post-order-claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantSlug, orderId, name, phone })
    }).then(r => r.json()),

  // Manager CRM & Discount Coins APIs (Authenticated)
  getCrmOverview: () =>
    request<{ success: boolean; overview: import('../types').CrmOverviewStats }>('/crm/overview'),
  getCustomers: (filter?: string, search?: string) =>
    request<{ success: boolean; customers: import('../types').Customer[] }>(
      `/crm/customers?filter=${encodeURIComponent(filter || 'ALL')}${search ? `&search=${encodeURIComponent(search)}` : ''}`
    ),
  getCustomer: (id: string) =>
    request<{
      success: boolean;
      customer: import('../types').Customer;
      orders: import('../types').Order[];
      coinHistory: import('../types').CoinTransaction[];
    }>(`/crm/customers/${id}`),
  adjustCustomerCoins: (id: string, coins: number, reason: string) =>
    request<{
      success: boolean;
      message: string;
      customer: import('../types').Customer;
      transaction: import('../types').CoinTransaction;
    }>(`/crm/customers/${id}/adjust-coins`, {
      method: 'POST',
      body: JSON.stringify({ coins, reason })
    }),
  sendDirectCustomerMessage: (
    id: string,
    payload: { message: string; coins?: number; reason?: string }
  ) =>
    request<{
      success: boolean;
      message: string;
      waSent: boolean;
      waError?: string;
      customer: import('../types').Customer;
      transaction?: import('../types').CoinTransaction;
    }>(`/crm/customers/${id}/direct-message`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getCoinLedger: (customerId?: string) =>
    request<{ success: boolean; transactions: import('../types').CoinTransaction[] }>(
      `/crm/ledger${customerId ? `?customerId=${encodeURIComponent(customerId)}` : ''}`
    ),
  getCrmSettings: () =>
    request<{ success: boolean; settings: import('../types').CrmSettings }>('/crm/settings'),
  updateCrmSettings: (settings: Partial<import('../types').CrmSettings>) =>
    request<{ success: boolean; message: string; settings: import('../types').CrmSettings }>('/crm/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),
  getCrmAnalytics: () =>
    request<{ success: boolean; overview: any; topSpenders: any[]; topFrequent: any[]; segments: any }>('/crm/analytics'),
  getCrmEvents: () =>
    request<{ success: boolean; events: any[] }>('/crm/events'),

  // AI CRM APIs (Phase 1 to 40)
  getAiCrmDashboard: () =>
    request<{ success: boolean; dashboard: import('../types').AiCrmDashboardData }>('/crm/ai/dashboard'),
  getAiRecommendations: () =>
    request<{ success: boolean; recommendations: import('../types').AiRecommendation[] }>('/crm/ai/recommendations'),
  getAiSegments: () =>
    request<{ success: boolean; segments: import('../types').AiSegment[] }>('/crm/ai/segments'),
  parseAiCampaignPrompt: (prompt: string) =>
    request<{
      success: boolean;
      campaignDraft: Partial<import('../types').AiCampaign>;
      explanation: string;
      matchedAudienceCount: number;
      estimatedCost: number;
      audienceReason: string;
    }>('/crm/ai/builder/parse', { method: 'POST', body: JSON.stringify({ prompt }) }),
  parseAiCampaign: (prompt: string) =>
    request<{
      success: boolean;
      message?: string;
      draft?: any;
      campaignDraft?: any;
    }>('/crm/ai/builder/parse', { method: 'POST', body: JSON.stringify({ prompt }) }),
  getAiCampaigns: () =>
    request<{ success: boolean; campaigns: import('../types').AiCampaign[] }>('/crm/ai/campaigns'),
  createAiCampaign: (payload: Partial<import('../types').AiCampaign>) =>
    request<{ success: boolean; message: string; campaign: import('../types').AiCampaign }>('/crm/ai/campaigns', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  approveAiCampaign: (id: string) =>
    request<{ success: boolean; message: string; campaign: import('../types').AiCampaign }>(`/crm/ai/campaigns/${id}/approve`, {
      method: 'POST'
    }),
  executeAiCampaign: (id: string) =>
    request<{
      success: boolean;
      message: string;
      campaign?: import('../types').AiCampaign;
      sentCount: number;
      deliveredCount: number;
    }>(`/crm/ai/campaigns/${id}/execute`, { method: 'POST' }),
  cancelAiCampaign: (id: string) =>
    request<{ success: boolean; message: string; campaign: import('../types').AiCampaign }>(`/crm/ai/campaigns/${id}/cancel`, {
      method: 'POST'
    }),
  deleteAiCampaign: (id: string) =>
    request<{ success: boolean; message: string }>(`/crm/ai/campaigns/${id}`, { method: 'DELETE' }),
  getAiAutomations: () =>
    request<{ success: boolean; automations: import('../types').AiAutomation[] }>('/crm/ai/automations'),
  createAiAutomation: (payload: Partial<import('../types').AiAutomation>) =>
    request<{ success: boolean; message: string; automation: import('../types').AiAutomation }>('/crm/ai/automations', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  toggleAiAutomation: (id: string, status?: string) =>
    request<{ success: boolean; message: string; automation: import('../types').AiAutomation }>(`/crm/ai/automations/${id}/toggle`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
  deleteAiAutomation: (id: string) =>
    request<{ success: boolean; message: string }>(`/crm/ai/automations/${id}`, { method: 'DELETE' }),
  getCustomerAiSummary: (id: string) =>
    request<{ success: boolean; summary: import('../types').CustomerAiSummary }>(`/crm/ai/customers/${id}/summary`),
  updateCustomerMarketingPrefs: (id: string, prefs: { sms?: boolean; whatsapp?: boolean; email?: boolean }) =>
    request<{ success: boolean; message: string; preferences: any }>(`/crm/ai/customers/${id}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(prefs)
    }),
  getMarketingChannels: () =>
    request<{ success: boolean; channels: { whatsapp: boolean; sms: boolean; email: boolean } }>('/crm/ai/channels'),
  toggleMarketingChannel: (channel: 'whatsapp' | 'sms' | 'email', connected: boolean) =>
    request<{ success: boolean; message: string; channels: any }>('/crm/ai/channels/toggle', {
      method: 'POST',
      body: JSON.stringify({ channel, connected })
    }),

  // Pre-warm server ping
  pingServer: async (): Promise<boolean> => {
    try {
      const baseUrl = API_BASE.replace('/api', '');
      const res = await fetch(`${baseUrl}/health`, { method: 'GET', cache: 'no-cache' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Aggregator Integration APIs
  getAggregatorStatus: () => request('/aggregators/status'),
  connectAggregator: (payload: { provider: string; outletId: string; outletName: string; apiKey?: string; merchantSecret?: string }) =>
    request('/aggregators/connect', { method: 'POST', body: JSON.stringify(payload) }),
  disconnectAggregator: (provider: string) =>
    request('/aggregators/disconnect', { method: 'POST', body: JSON.stringify({ provider }) }),
  getUnifiedAggregatorMenu: () => request('/aggregators/menu'),
  syncAggregatorMenu: (channel?: 'SWIGGY' | 'ZOMATO' | 'ALL') =>
    request('/aggregators/menu/sync', { method: 'POST', body: JSON.stringify({ channel }) }),
  updateMenuItemOverride: (menuItemId: string, overrides: any) =>
    request('/aggregators/menu/override', { method: 'PATCH', body: JSON.stringify({ menuItemId, overrides }) }),
  bulkUpdateAggregatorPrices: (payload: {
    itemIds?: string[];
    channels: ('SWIGGY' | 'ZOMATO' | 'SWAAD_SEVAK')[];
    adjustmentType: 'PERCENTAGE' | 'FIXED' | 'EXACT';
    adjustmentValue: number;
    rounding: 'NONE' | 'NEAREST_1' | 'NEAREST_5' | 'NEAREST_10';
    previewOnly?: boolean;
  }) => request('/aggregators/menu/bulk-price', { method: 'POST', body: JSON.stringify(payload) }),
  bulkUpdateAggregatorStock: (payload: {
    itemIds: string[];
    channels: ('SWIGGY' | 'ZOMATO' | 'SWAAD_SEVAK')[];
    isAvailable: boolean;
  }) => request('/aggregators/menu/bulk-stock', { method: 'POST', body: JSON.stringify(payload) }),
  updateAggregatorOutletStatus: (payload: {
    status: 'OPEN' | 'PAUSED' | 'CLOSED';
    pauseMinutes?: number;
    reason?: string;
    channels?: ('SWIGGY' | 'ZOMATO')[];
  }) => request('/aggregators/outlet/status', { method: 'PATCH', body: JSON.stringify(payload) }),
  updateAggregatorPrepTime: (prepTimeMinutes: number, channels?: ('SWIGGY' | 'ZOMATO')[]) =>
    request('/aggregators/outlet/preptime', { method: 'PATCH', body: JSON.stringify({ prepTimeMinutes, channels }) }),
  setAggregatorRushMode: (payload: { activate: boolean; prepTimeMinutes?: number; pauseZomato?: boolean }) =>
    request('/aggregators/outlet/rush-mode', { method: 'POST', body: JSON.stringify(payload) }),
  getAggregatorReconciliation: (period?: string) =>
    request(`/aggregators/reconciliation${period ? `?period=${encodeURIComponent(period)}` : ''}`),
  getAggregatorLogs: () => request('/aggregators/logs'),
  simulateAggregatorOrder: (provider: 'SWIGGY' | 'ZOMATO') =>
    request('/aggregators/simulate-order', { method: 'POST', body: JSON.stringify({ provider }) }),

  // Growth Engine APIs
  getGrowthData: (params?: { dataMode?: string; reportId?: string; businessType?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<{ success: boolean; growth: import('../types').GrowthEngineData }>(`/growth${query ? `?${query}` : ''}`);
  },
  uploadPosReport: async (file: File, providerHint?: string) => {
    const formData = new FormData();
    formData.append('posFile', file);
    if (providerHint) formData.append('providerHint', providerHint);

    const token = localStorage.getItem('swaad_token');
    const response = await fetch(`${API_BASE}/growth/upload-pos`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Report upload failed');
    return data;
  },
  confirmPosReport: (report: any, setAsActive = true, dataMode = 'combined') =>
    request<{ success: boolean; message: string; reportId: string }>('/growth/confirm-pos', {
      method: 'POST',
      body: JSON.stringify({ report, setAsActive, dataMode })
    }),
  deletePosReport: (id: string) =>
    request<{ success: boolean; message: string }>(`/growth/reports/${id}`, { method: 'DELETE' }),
  setGrowthDataMode: (dataMode: string, reportId?: string) =>
    request<{ success: boolean; mode: string; reportId?: string }>('/growth/mode', {
      method: 'POST',
      body: JSON.stringify({ dataMode, reportId })
    }),
  setGrowthBusinessType: (businessType: string) =>
    request<{ success: boolean; businessType: string }>('/growth/business-type', {
      method: 'POST',
      body: JSON.stringify({ businessType })
    }),
  setGrowthItemCost: (itemName: string, cost: number) =>
    request<{ success: boolean; itemName: string; cost: number }>('/growth/item-cost', {
      method: 'POST',
      body: JSON.stringify({ itemName, cost })
    }),
  toggleGrowthRecommendation: (id: string) =>
    request<{ success: boolean; recommendationId: string; implemented: boolean }>(`/growth/recommendations/${id}/action`, {
      method: 'POST'
    }),
  downloadSamplePosReport: async (format: 'csv' | 'xlsx' = 'xlsx') => {
    const token = localStorage.getItem('swaad_token');
    const res = await fetch(`${API_BASE}/growth/sample-pos-report?format=${format}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) throw new Error('Failed to download sample file');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Petpooja_Sample_Sales_Report.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  // WhatsApp Device Automation
  getWhatsAppStatus: () => request<{ success: boolean; data: any }>('/whatsapp/status'),
  connectWhatsApp: () => request<{ success: boolean; message: string; data: any }>('/whatsapp/connect', { method: 'POST' }),
  disconnectWhatsApp: () => request<{ success: boolean; message: string }>('/whatsapp/disconnect', { method: 'POST' }),
  testSendWhatsApp: (targetPhone?: string) =>
    request<{ success: boolean; message: string; messageId?: string }>('/whatsapp/test-send', {
      method: 'POST',
      body: JSON.stringify({ targetPhone })
    })
};

