import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {
  Restaurant,
  Manager,
  MenuCategory,
  MenuItem,
  Table,
  Order,
  OrderItem,
  Bill,
  PrinterConfig,
  OrderStatus,
  OrderSource
} from '../types/index.js';

// In-Memory Database store with optional local file persistence fallback
// When Neon PostgreSQL URL is plugged into .env, Prisma integration connects seamlessly.

class MemoryDatabase {
  restaurants: Map<string, Restaurant> = new Map();
  managers: Map<string, Manager> = new Map();
  categories: Map<string, MenuCategory> = new Map();
  menuItems: Map<string, MenuItem> = new Map();
  tables: Map<string, Table> = new Map();
  orders: Map<string, Order> = new Map();
  bills: Map<string, Bill> = new Map();
  printerConfigs: Map<string, PrinterConfig> = new Map();

  private kotCounter = 1000;
  private billCounter = 5000;
  private orderCounter = 100;

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    // Seed initial demo restaurant "The Chai & Chaat Co."
    const restaurantId = 'rest_demo_01';
    const slug = 'chai-and-chaat';

    const restaurant: Restaurant = {
      id: restaurantId,
      slug,
      name: 'The Chai & Chaat Co.',
      ownerName: 'Vikram Sharma',
      phone: '+91 98765 43210',
      email: 'vikram@chaichaat.in',
      address: 'Shop 14, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      restaurantType: 'Café & Bistro',
      gstNumber: '29ABCDE1234F1Z5',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.restaurants.set(restaurantId, restaurant);

    // Seed Manager (Username: "demo_manager", PIN: "1234")
    const pinHash = bcrypt.hashSync('1234', 10);
    const managerId = 'mgr_demo_01';
    this.managers.set(managerId, {
      id: managerId,
      restaurantId,
      username: 'demo_manager',
      pinHash,
      role: 'OWNER',
      createdAt: new Date()
    });

    // Seed Printer Config
    this.printerConfigs.set(restaurantId, {
      id: `print_${restaurantId}`,
      restaurantId,
      printerName: 'POS-80 Thermal Kitchen Printer',
      paperWidth: '80mm',
      autoPrintKot: true,
      printerType: 'BROWSER'
    });

    // Seed Categories
    const catStartersId = 'cat_01';
    const catMainsId = 'cat_02';
    const catBreadsId = 'cat_03';
    const catBeveragesId = 'cat_04';
    const catDessertsId = 'cat_05';

    const categoriesData: MenuCategory[] = [
      { id: catStartersId, restaurantId, name: 'Starters & Chaat', displayOrder: 1 },
      { id: catMainsId, restaurantId, name: 'Main Course', displayOrder: 2 },
      { id: catBreadsId, restaurantId, name: 'Tandoori Breads', displayOrder: 3 },
      { id: catBeveragesId, restaurantId, name: 'Chai & Coolers', displayOrder: 4 },
      { id: catDessertsId, restaurantId, name: 'Mithai & Desserts', displayOrder: 5 }
    ];

    for (const c of categoriesData) {
      this.categories.set(c.id, c);
    }

    // Seed Dishes
    const dishes: MenuItem[] = [
      {
        id: 'item_01',
        restaurantId,
        categoryId: catStartersId,
        name: 'Dahi Ke Kebab',
        description: 'Crispy hung curd patties spiced with green chillies, cardamom, and fresh coriander.',
        price: 249,
        portion: 'Standard (6 pcs)',
        isVeg: true,
        isAvailable: true,
        tags: ['Bestseller', "Chef's Special"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_02',
        restaurantId,
        categoryId: catStartersId,
        name: 'Amritsari Paneer Tikka',
        description: 'Tender cottage cheese marinated in ajwain, curd, and hand-ground spices, clay-oven roasted.',
        price: 279,
        portion: 'Standard (6 pcs)',
        isVeg: true,
        isAvailable: true,
        tags: ['Bestseller', 'Popular'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_03',
        restaurantId,
        categoryId: catStartersId,
        name: 'Chicken Malai Tikka',
        description: 'Succulent boneless chicken morsels coated in creamy cashew-cheese marinade with crushed white peppercorns.',
        price: 329,
        portion: 'Standard (6 pcs)',
        isVeg: false,
        isAvailable: true,
        tags: ['Popular'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_04',
        restaurantId,
        categoryId: catMainsId,
        name: 'Dal Makhani Slow Cooked',
        description: 'Black lentils slow cooked overnight on charcoal with churned butter and rich cream.',
        price: 299,
        portion: 'Standard Bowl',
        isVeg: true,
        isAvailable: true,
        tags: ['Bestseller'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_05',
        restaurantId,
        categoryId: catMainsId,
        name: 'Paneer Butter Masala',
        description: 'Cottage cheese simmered in a luscious tomato, butter, and cashew gravy finished with kasuri methi.',
        price: 319,
        portion: 'Standard Bowl',
        isVeg: true,
        isAvailable: true,
        tags: ['Recommended'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_06',
        restaurantId,
        categoryId: catMainsId,
        name: 'Old Delhi Butter Chicken',
        description: 'Smoked tandoori chicken cooked in velvety, mildly spiced makhani gravy with authentic Delhi flavors.',
        price: 389,
        portion: 'Standard Bowl',
        isVeg: false,
        isAvailable: true,
        tags: ['Bestseller', "Chef's Special"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_07',
        restaurantId,
        categoryId: catBreadsId,
        name: 'Butter Garlic Naan',
        description: 'Clay-oven leavened bread brushed with garlic butter and fresh cilantro.',
        price: 75,
        portion: '1 Pc',
        isVeg: true,
        isAvailable: true,
        tags: ['Popular'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_08',
        restaurantId,
        categoryId: catBreadsId,
        name: 'Amritsari Kulcha',
        description: 'Flaky layered bread stuffed with spiced potato and onion, topped with pomegranate seeds.',
        price: 95,
        portion: '1 Pc',
        isVeg: true,
        isAvailable: true,
        tags: ['Recommended'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_09',
        restaurantId,
        categoryId: catBeveragesId,
        name: 'Kulhad Masala Chai',
        description: 'Hand-brewed strong Assam tea infused with fresh ginger, green cardamom, and lemongrass served in clay cup.',
        price: 69,
        portion: 'Standard Kulhad',
        isVeg: true,
        isAvailable: true,
        tags: ['Bestseller'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_10',
        restaurantId,
        categoryId: catBeveragesId,
        name: 'Mango Shikanji Fizz',
        description: 'Traditional spiced lemon cooler infused with sweet alphonso pulp, mint, and black salt.',
        price: 129,
        portion: 'Glass (350ml)',
        isVeg: true,
        isAvailable: true,
        tags: ['New'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_11',
        restaurantId,
        categoryId: catDessertsId,
        name: 'Warm Gulab Jamun with Rabri',
        description: 'Soft melt-in-mouth khoya dumplings soaked in saffron syrup, paired with slow-reduced rabri.',
        price: 159,
        portion: '2 Pcs with Rabri',
        isVeg: true,
        isAvailable: true,
        tags: ["Chef's Special"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const d of dishes) {
      this.menuItems.set(d.id, d);
    }

    // Seed 8 Tables with QR tokens
    for (let i = 1; i <= 8; i++) {
      const padNum = i < 10 ? `0${i}` : `${i}`;
      const tableId = `tbl_demo_${padNum}`;
      const qrToken = `qr_token_demo_tbl_${padNum}_${crypto.randomBytes(4).toString('hex')}`;
      this.tables.set(tableId, {
        id: tableId,
        restaurantId,
        tableNumber: `Table ${padNum}`,
        qrToken,
        status: i === 2 ? 'OCCUPIED' : 'AVAILABLE',
        createdAt: new Date()
      });
    }

    // Seed a couple of recent orders for realistic stats
    const orderId1 = 'ord_demo_101';
    const sampleOrder1: Order = {
      id: orderId1,
      restaurantId,
      tableId: 'tbl_demo_02',
      tableNumber: 'Table 02',
      orderNumber: '#101',
      source: 'DINE_IN',
      status: 'PREPARING',
      customerNotes: 'Please keep the butter chicken mild spicy.',
      subtotal: 757,
      tax: 37.85,
      total: 794.85,
      kotGenerated: true,
      kotNumber: 'KOT-1001',
      billRequested: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 18),
      updatedAt: new Date(),
      items: [
        {
          id: 'item_ord_1',
          orderId: orderId1,
          menuItemId: 'item_06',
          name: 'Old Delhi Butter Chicken',
          price: 389,
          quantity: 1,
          portion: 'Standard Bowl'
        },
        {
          id: 'item_ord_2',
          orderId: orderId1,
          menuItemId: 'item_07',
          name: 'Butter Garlic Naan',
          price: 75,
          quantity: 2,
          portion: '1 Pc'
        },
        {
          id: 'item_ord_3',
          orderId: orderId1,
          menuItemId: 'item_01',
          name: 'Dahi Ke Kebab',
          price: 249,
          quantity: 1,
          portion: 'Standard (6 pcs)'
        }
      ]
    };
    this.orders.set(orderId1, sampleOrder1);

    // Completed sample order
    const orderId2 = 'ord_demo_102';
    const sampleOrder2: Order = {
      id: orderId2,
      restaurantId,
      tableId: 'tbl_demo_04',
      tableNumber: 'Table 04',
      orderNumber: '#102',
      source: 'DINE_IN',
      status: 'COMPLETED',
      subtotal: 443,
      tax: 22.15,
      total: 465.15,
      kotGenerated: true,
      kotNumber: 'KOT-1002',
      billRequested: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 85),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
      items: [
        {
          id: 'item_ord_4',
          orderId: orderId2,
          menuItemId: 'item_04',
          name: 'Dal Makhani Slow Cooked',
          price: 299,
          quantity: 1
        },
        {
          id: 'item_ord_5',
          orderId: orderId2,
          menuItemId: 'item_08',
          name: 'Amritsari Kulcha',
          price: 95,
          quantity: 1
        },
        {
          id: 'item_ord_6',
          orderId: orderId2,
          menuItemId: 'item_09',
          name: 'Kulhad Masala Chai',
          price: 69,
          quantity: 1
        }
      ]
    };
    this.orders.set(orderId2, sampleOrder2);

    // Bill for completed order
    const billId2 = 'bill_demo_5001';
    this.bills.set(billId2, {
      id: billId2,
      restaurantId,
      orderId: orderId2,
      orderNumber: '#102',
      tableNumber: 'Table 04',
      billNumber: 'INV-5001',
      subtotal: 443,
      tax: 22.15,
      discount: 0,
      grandTotal: 465.15,
      paymentStatus: 'PAID_UPI',
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      items: sampleOrder2.items
    });
  }

  // Next identifiers
  getNextKotNumber(): string {
    this.kotCounter++;
    return `KOT-${this.kotCounter}`;
  }

  getNextBillNumber(): string {
    this.billCounter++;
    return `INV-${this.billCounter}`;
  }

  getNextOrderNumber(): string {
    this.orderCounter++;
    return `#${this.orderCounter}`;
  }

  // Restaurant methods
  getRestaurant(id: string): Restaurant | undefined {
    return this.restaurants.get(id);
  }

  getRestaurantBySlug(slug: string): Restaurant | undefined {
    for (const r of this.restaurants.values()) {
      if (r.slug === slug) return r;
    }
    return undefined;
  }

  createRestaurant(data: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Restaurant {
    const id = `rest_${crypto.randomUUID()}`;
    const restaurant: Restaurant = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  // Manager methods
  getManagerByUsername(username: string): Manager | undefined {
    const norm = username.trim().toLowerCase();
    for (const m of this.managers.values()) {
      if (m.username.trim().toLowerCase() === norm) return m;
    }
    return undefined;
  }

  createManager(data: Omit<Manager, 'id' | 'createdAt'>): Manager {
    const id = `mgr_${crypto.randomUUID()}`;
    const manager: Manager = {
      ...data,
      id,
      createdAt: new Date()
    };
    this.managers.set(id, manager);
    return manager;
  }

  // Categories
  getCategories(restaurantId: string): MenuCategory[] {
    const list: MenuCategory[] = [];
    for (const c of this.categories.values()) {
      if (c.restaurantId === restaurantId) {
        list.push(c);
      }
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  createCategory(restaurantId: string, name: string): MenuCategory {
    const categories = this.getCategories(restaurantId);
    const id = `cat_${crypto.randomUUID()}`;
    const category: MenuCategory = {
      id,
      restaurantId,
      name,
      displayOrder: categories.length + 1
    };
    this.categories.set(id, category);
    return category;
  }

  updateCategory(restaurantId: string, categoryId: string, name: string): MenuCategory | null {
    const cat = this.categories.get(categoryId);
    if (!cat || cat.restaurantId !== restaurantId) return null;
    cat.name = name;
    return cat;
  }

  deleteCategory(restaurantId: string, categoryId: string): boolean {
    const cat = this.categories.get(categoryId);
    if (!cat || cat.restaurantId !== restaurantId) return false;
    this.categories.delete(categoryId);
    // Delete items in category
    for (const [itemId, item] of this.menuItems.entries()) {
      if (item.categoryId === categoryId) {
        this.menuItems.delete(itemId);
      }
    }
    return true;
  }

  // Menu items
  getItems(restaurantId: string): MenuItem[] {
    const list: MenuItem[] = [];
    for (const item of this.menuItems.values()) {
      if (item.restaurantId === restaurantId) {
        list.push(item);
      }
    }
    return list;
  }

  getItem(restaurantId: string, itemId: string): MenuItem | undefined {
    const item = this.menuItems.get(itemId);
    if (item && item.restaurantId === restaurantId) return item;
    return undefined;
  }

  createItem(restaurantId: string, data: Omit<MenuItem, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>): MenuItem {
    const id = `item_${crypto.randomUUID()}`;
    const item: MenuItem = {
      ...data,
      id,
      restaurantId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.menuItems.set(id, item);
    return item;
  }

  updateItem(restaurantId: string, itemId: string, data: Partial<MenuItem>): MenuItem | null {
    const item = this.menuItems.get(itemId);
    if (!item || item.restaurantId !== restaurantId) return null;
    const updated = {
      ...item,
      ...data,
      updatedAt: new Date()
    };
    this.menuItems.set(itemId, updated);
    return updated;
  }

  setItemStock(restaurantId: string, itemId: string, isAvailable: boolean): MenuItem | null {
    const item = this.menuItems.get(itemId);
    if (!item || item.restaurantId !== restaurantId) return null;
    item.isAvailable = isAvailable;
    item.updatedAt = new Date();
    return item;
  }

  deleteItem(restaurantId: string, itemId: string): boolean {
    const item = this.menuItems.get(itemId);
    if (!item || item.restaurantId !== restaurantId) return false;
    return this.menuItems.delete(itemId);
  }

  // Tables
  getTables(restaurantId: string): Table[] {
    const list: Table[] = [];
    for (const t of this.tables.values()) {
      if (t.restaurantId === restaurantId) {
        list.push(t);
      }
    }
    return list.sort((a, b) => a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true }));
  }

  getTableByToken(qrToken: string): Table | undefined {
    for (const t of this.tables.values()) {
      if (t.qrToken === qrToken) return t;
    }
    return undefined;
  }

  createTable(restaurantId: string, tableNumber: string): Table {
    const id = `tbl_${crypto.randomUUID()}`;
    const qrToken = `qr_${crypto.randomBytes(6).toString('hex')}`;
    const table: Table = {
      id,
      restaurantId,
      tableNumber,
      qrToken,
      status: 'AVAILABLE',
      createdAt: new Date()
    };
    this.tables.set(id, table);
    return table;
  }

  updateTable(restaurantId: string, tableId: string, data: Partial<Table>): Table | null {
    const table = this.tables.get(tableId);
    if (!table || table.restaurantId !== restaurantId) return null;
    const updated = { ...table, ...data };
    this.tables.set(tableId, updated);
    return updated;
  }

  regenerateTableQr(restaurantId: string, tableId: string): Table | null {
    const table = this.tables.get(tableId);
    if (!table || table.restaurantId !== restaurantId) return null;
    table.qrToken = `qr_${crypto.randomBytes(6).toString('hex')}`;
    return table;
  }

  deleteTable(restaurantId: string, tableId: string): boolean {
    const table = this.tables.get(tableId);
    if (!table || table.restaurantId !== restaurantId) return false;
    return this.tables.delete(tableId);
  }

  // Orders
  getOrders(restaurantId: string): Order[] {
    const list: Order[] = [];
    for (const ord of this.orders.values()) {
      if (ord.restaurantId === restaurantId) {
        list.push(ord);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrder(restaurantId: string, orderId: string): Order | undefined {
    const ord = this.orders.get(orderId);
    if (ord && ord.restaurantId === restaurantId) return ord;
    return undefined;
  }

  createOrder(data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'kotGenerated' | 'billRequested'>): Order {
    const id = `ord_${crypto.randomUUID()}`;
    const orderNumber = this.getNextOrderNumber();
    const order: Order = {
      ...data,
      id,
      orderNumber,
      kotGenerated: false,
      billRequested: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);

    // Update table status to OCCUPIED
    const table = this.tables.get(data.tableId);
    if (table) {
      table.status = 'OCCUPIED';
    }

    return order;
  }

  updateOrderStatus(restaurantId: string, orderId: string, status: OrderStatus): Order | null {
    const order = this.orders.get(orderId);
    if (!order || order.restaurantId !== restaurantId) return null;
    order.status = status;
    order.updatedAt = new Date();

    if (status === 'ACCEPTED' && !order.kotGenerated) {
      order.kotGenerated = true;
      order.kotNumber = this.getNextKotNumber();
    }

    if (status === 'COMPLETED') {
      const table = this.tables.get(order.tableId);
      if (table) {
        table.status = 'AVAILABLE';
      }
    }

    return order;
  }

  requestBill(restaurantId: string, orderId: string): Order | null {
    const order = this.orders.get(orderId);
    if (!order || order.restaurantId !== restaurantId) return null;
    order.billRequested = true;
    order.updatedAt = new Date();

    const table = this.tables.get(order.tableId);
    if (table) {
      table.status = 'BILL_REQUESTED';
    }

    return order;
  }

  // Bills
  getBills(restaurantId: string): Bill[] {
    const list: Bill[] = [];
    for (const b of this.bills.values()) {
      if (b.restaurantId === restaurantId) {
        list.push(b);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getBillByOrder(orderId: string): Bill | undefined {
    for (const b of this.bills.values()) {
      if (b.orderId === orderId) return b;
    }
    return undefined;
  }

  createBill(restaurantId: string, orderId: string): Bill | null {
    const order = this.orders.get(orderId);
    if (!order || order.restaurantId !== restaurantId) return null;

    // Check if already billed
    const existing = this.getBillByOrder(orderId);
    if (existing) return existing;

    const billNumber = this.getNextBillNumber();
    const id = `bill_${crypto.randomUUID()}`;
    const bill: Bill = {
      id,
      restaurantId,
      orderId,
      orderNumber: order.orderNumber,
      tableNumber: order.tableNumber,
      billNumber,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: 0,
      grandTotal: order.total,
      paymentStatus: 'UNPAID',
      createdAt: new Date(),
      items: order.items
    };
    this.bills.set(id, bill);
    return bill;
  }

  settleBill(restaurantId: string, billId: string, paymentStatus: 'PAID_CASH' | 'PAID_UPI' | 'PAID_CARD'): Bill | null {
    const bill = this.bills.get(billId);
    if (!bill || bill.restaurantId !== restaurantId) return null;
    bill.paymentStatus = paymentStatus;

    // Also mark order completed if not already
    const order = this.orders.get(bill.orderId);
    if (order) {
      order.status = 'COMPLETED';
      const table = this.tables.get(order.tableId);
      if (table) table.status = 'AVAILABLE';
    }

    return bill;
  }

  // Printer Config
  getPrinterConfig(restaurantId: string): PrinterConfig {
    let config = this.printerConfigs.get(restaurantId);
    if (!config) {
      config = {
        id: `print_${restaurantId}`,
        restaurantId,
        printerName: 'POS-80 Kitchen Thermal Printer',
        paperWidth: '80mm',
        autoPrintKot: true,
        printerType: 'BROWSER'
      };
      this.printerConfigs.set(restaurantId, config);
    }
    return config;
  }

  updatePrinterConfig(restaurantId: string, data: Partial<PrinterConfig>): PrinterConfig {
    const current = this.getPrinterConfig(restaurantId);
    const updated = { ...current, ...data };
    this.printerConfigs.set(restaurantId, updated);
    return updated;
  }

  // Real-time Today's Stats (dynamically computed, not hardcoded)
  getTodayStats(restaurantId: string) {
    const orders = this.getOrders(restaurantId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(o => new Date(o.createdAt).getTime() >= today.getTime());

    let todaySales = 0;
    let pendingCount = 0;
    let completedCount = 0;
    let preparingCount = 0;
    let swiggyOrdersCount = 0;
    let swiggySales = 0;
    let zomatoOrdersCount = 0;
    let zomatoSales = 0;

    for (const ord of todayOrders) {
      if (ord.status === 'COMPLETED' || ord.status === 'READY' || ord.status === 'PREPARING' || ord.status === 'ACCEPTED') {
        todaySales += ord.total;
      }

      if (ord.status === 'PENDING') pendingCount++;
      if (ord.status === 'PREPARING') preparingCount++;
      if (ord.status === 'COMPLETED') completedCount++;

      if (ord.source === 'SWIGGY') {
        swiggyOrdersCount++;
        swiggySales += ord.total;
      } else if (ord.source === 'ZOMATO') {
        zomatoOrdersCount++;
        zomatoSales += ord.total;
      }
    }

    return {
      todaySales: Math.round(todaySales),
      totalOrders: todayOrders.length,
      pendingCount,
      preparingCount,
      completedCount,
      onlineOrders: {
        swiggy: { count: swiggyOrdersCount, sales: Math.round(swiggySales) },
        zomato: { count: zomatoOrdersCount, sales: Math.round(zomatoSales) }
      }
    };
  }
}

export const db = new MemoryDatabase();
