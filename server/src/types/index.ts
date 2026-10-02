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
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'REJECTED';

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
