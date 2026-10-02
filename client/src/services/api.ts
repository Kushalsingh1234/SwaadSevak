const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('swaad_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data as T;
}

export const api = {
  // Auth
  register: (payload: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { username: string; pin: string }) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
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
  updateOrderStatus: (id: string, status: string) => request<any>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getOrderKot: (id: string) => request<any>(`/orders/${id}/kot`),

  // Bills
  getBills: () => request<any>('/bills'),
  generateBill: (orderId: string) => request<any>(`/bills/generate/${orderId}`, { method: 'POST' }),
  settleBill: (billId: string, paymentStatus: string) => request<any>(`/bills/${billId}/settle`, { method: 'PATCH', body: JSON.stringify({ paymentStatus }) }),

  // Printer
  getPrinterConfig: () => request<any>('/printer/config'),
  updatePrinterConfig: (config: any) => request<any>('/printer/config', { method: 'PUT', body: JSON.stringify(config) }),

  // Stats
  getTodayStats: () => request<any>('/stats/today'),

  // Public Diner APIs (No auth needed)
  getPublicMenu: (restaurantSlug: string, qrToken: string) => fetch(`${API_BASE}/public/menu/${restaurantSlug}/${qrToken}`).then(r => r.json()),
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
  getPublicInvoice: (orderId: string) => fetch(`${API_BASE}/public/order/${orderId}/invoice`).then(r => r.json())
};
