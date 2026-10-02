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
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'REJECTED';

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
