import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getPrismaClient } from './prismaClient.js';
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
  OrderSource,
  OrderAddition,
  PosReport,
  BusinessType,
  GrowthDataMode,
  Customer,
  CustomerStatus,
  CoinTransaction,
  CoinTransactionType,
  CrmSettings,
  CrmEvent,
  CrmEventType,
  AiCampaign,
  AiAutomation
} from '../types/index.js';

class DatabaseStore {
  restaurants: Map<string, Restaurant> = new Map();
  managers: Map<string, Manager> = new Map();
  categories: Map<string, MenuCategory> = new Map();
  menuItems: Map<string, MenuItem> = new Map();
  tables: Map<string, Table> = new Map();
  orders: Map<string, Order> = new Map();
  bills: Map<string, Bill> = new Map();
  printerConfigs: Map<string, PrinterConfig> = new Map();

  // CRM & Discount Coins Maps
  customers: Map<string, Customer> = new Map();
  coinTransactions: Map<string, CoinTransaction> = new Map();
  crmSettings: Map<string, CrmSettings> = new Map();
  crmEvents: CrmEvent[] = [];

  // AI CRM Maps
  aiCampaigns: Map<string, AiCampaign> = new Map();
  aiAutomations: Map<string, AiAutomation> = new Map();
  marketingChannels: Map<string, { whatsapp: boolean; sms: boolean; email: boolean }> = new Map();
  customerMarketingPreferences: Map<string, { sms: boolean; whatsapp: boolean; email: boolean }> = new Map();

  // Growth Engine Maps
  posReports: Map<string, PosReport> = new Map();
  itemCostOverrides: Map<string, Map<string, number>> = new Map();
  implementedRecommendations: Map<string, Set<string>> = new Map();
  businessTypes: Map<string, BusinessType> = new Map();
  growthDataModes: Map<string, { mode: GrowthDataMode; reportId?: string }> = new Map();

  private kotCounter = 1000;
  private billCounter = 5000;
  private orderCounter = 100;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.init();
  }

  public async ensureInitialized() {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  public async init() {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await this.syncFromNeon(prisma);
        this.isInitialized = true;
        console.log('✓ Successfully connected & synchronized with Neon PostgreSQL!');
        return;
      } catch (err) {
        console.warn('Could not sync from Neon PostgreSQL, falling back to local seed:', err);
      }
    }
    this.seedDemoData();
    this.isInitialized = true;
  }

  public async syncFromNeon(prisma: any) {
    // 1. Fetch Restaurants, Managers & Printer Config (Essential for authentication)
    let restaurants: any[] = [];
    try {
      restaurants = await prisma.restaurant.findMany({
        include: {
          managers: true,
          printerConfig: true
        }
      });
    } catch (err) {
      console.error('Error querying restaurants & managers from PostgreSQL:', err);
      throw err;
    }

    if (restaurants.length === 0) {
      this.seedDemoData();
      return;
    }

    for (const r of restaurants) {
      this.restaurants.set(r.id, {
        id: r.id,
        slug: r.slug,
        name: r.name,
        ownerName: r.ownerName,
        phone: r.phone,
        email: r.email,
        address: r.address,
        city: r.city,
        state: r.state,
        restaurantType: r.restaurantType,
        gstNumber: r.gstNumber || undefined,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      });

      if (r.printerConfig) {
        this.printerConfigs.set(r.id, {
          id: r.printerConfig.id,
          restaurantId: r.id,
          printerName: r.printerConfig.printerName,
          paperWidth: r.printerConfig.paperWidth as any,
          autoPrintKot: r.printerConfig.autoPrintKot,
          printerType: r.printerConfig.printerType as any,
          printerIp: r.printerConfig.printerIp || undefined
        });
      }

      for (const m of r.managers) {
        this.managers.set(m.id, {
          id: m.id,
          restaurantId: r.id,
          username: m.username,
          pinHash: m.pinHash,
          role: m.role as any,
          createdAt: m.createdAt
        });
      }

      // Only seed demo POS report and demo customers for demo restaurant
      if (r.id === 'rest_demo_01') {
        const now = new Date();
        const sepStart = new Date(now);
        sepStart.setDate(sepStart.getDate() - 35);
        const sepEnd = new Date(now);
        sepEnd.setDate(sepEnd.getDate() - 5);

        const repId = `pos_rep_${r.id}`;
        this.posReports.set(repId, {
          id: repId,
          restaurantId: r.id,
          fileName: 'Petpooja_Sales_Report_September.xlsx',
          posProvider: 'Petpooja',
          fileType: 'xlsx',
          uploadedAt: new Date(now.getTime() - 4 * 86400000),
          periodStart: sepStart,
          periodEnd: sepEnd,
          periodLabel: '1 Sep – 30 Sep 2026',
          totalOrders: 1248,
          totalSales: 284500,
          totalProducts: 42,
          items: [
            { name: 'Cold Coffee', category: 'Beverages', quantity: 412, totalSales: 53148, unitPrice: 129 },
            { name: 'Paneer Sandwich', category: 'Snacks', quantity: 310, totalSales: 39990, unitPrice: 129 },
            { name: 'Chocolate Brownie', category: 'Desserts', quantity: 245, totalSales: 36505, unitPrice: 149 },
            { name: 'Kulhad Masala Chai', category: 'Beverages', quantity: 560, totalSales: 38640, unitPrice: 69 },
            { name: 'Amritsari Paneer Tikka', category: 'Starters', quantity: 180, totalSales: 50220, unitPrice: 279 },
            { name: 'Butter Croissant', category: 'Bakery', quantity: 140, totalSales: 16660, unitPrice: 119 },
            { name: 'Old Delhi Butter Chicken', category: 'Mains', quantity: 95, totalSales: 36955, unitPrice: 389 },
            { name: 'Dal Makhani Slow Cooked', category: 'Mains', quantity: 120, totalSales: 35880, unitPrice: 299 }
          ],
          hourlyDistribution: {
            12: 24000, 13: 38000, 14: 29000,
            15: 12000, 16: 14000, 17: 15500,
            18: 26000, 19: 42000, 20: 51000, 21: 33000
          },
          dowDistribution: {
            0: 48000, 1: 31000, 2: 26000, 3: 32000, 4: 37000, 5: 56000, 6: 54500
          }
        });

        this.businessTypes.set(r.id, 'Café');
        this.growthDataModes.set(r.id, { mode: 'swaad', reportId: repId });
        this.seedCrmDemoData(r.id);
      } else {
        // Real restaurant: ensure default CRM settings exist, no fake data
        this.ensureCrmSettings(r.id);
      }
    }

    // Always ensure demo_manager exists in memory so demo credentials work out-of-the-box
    if (!this.getManagerByUsername('demo_manager')) {
      const demoRestId = 'rest_demo_01';
      if (!this.restaurants.has(demoRestId)) {
        this.restaurants.set(demoRestId, {
          id: demoRestId,
          slug: 'chai-and-chaat',
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
        });
      }
      this.managers.set('mgr_demo_01', {
        id: 'mgr_demo_01',
        restaurantId: demoRestId,
        username: 'demo_manager',
        pinHash: bcrypt.hashSync('1234', 10),
        role: 'OWNER',
        createdAt: new Date()
      });
    }

    // 2. Fetch Categories & Menu Items safely
    try {
      const categories = await prisma.menuCategory.findMany();
      for (const c of categories) {
        this.categories.set(c.id, {
          id: c.id,
          restaurantId: c.restaurantId,
          name: c.name,
          displayOrder: c.displayOrder
        });
      }

      const items = await prisma.menuItem.findMany();
      for (const item of items) {
        let tags: string[] = [];
        try {
          tags = JSON.parse(item.tags);
        } catch {
          tags = [];
        }
        this.menuItems.set(item.id, {
          id: item.id,
          restaurantId: item.restaurantId,
          categoryId: item.categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          portion: item.portion,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
          tags,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        });
      }
    } catch (catErr) {
      console.warn('Warning syncing categories/items from Neon:', catErr);
    }

    // 3. Fetch Tables safely
    try {
      const tables = await prisma.table.findMany();
      for (const t of tables) {
        this.tables.set(t.id, {
          id: t.id,
          restaurantId: t.restaurantId,
          tableNumber: t.tableNumber,
          qrToken: t.qrToken,
          status: t.status as any,
          createdAt: t.createdAt
        });
      }
    } catch (tabErr) {
      console.warn('Warning syncing tables from Neon:', tabErr);
    }

    // 4. Fetch Orders safely
    try {
      const orders = await prisma.order.findMany({
        include: {
          items: true
        }
      });
      for (const ord of orders) {
        const orderItems: OrderItem[] = ord.items.map((i: any) => ({
          id: i.id,
          orderId: ord.id,
          menuItemId: i.menuItemId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          portion: i.portion || undefined,
          notes: i.notes || undefined
        }));

        const table = this.tables.get(ord.tableId);

        let additions: any[] = [];
        try {
          additions = ord.additions ? JSON.parse(ord.additions) : [];
        } catch {
          additions = [];
        }

        this.orders.set(ord.id, {
          id: ord.id,
          restaurantId: ord.restaurantId,
          tableId: ord.tableId,
          tableNumber: table?.tableNumber || 'Table 01',
          orderNumber: ord.orderNumber,
          source: ord.source as any,
          status: ord.status as any,
          customerNotes: ord.customerNotes || undefined,
          subtotal: ord.subtotal,
          tax: ord.tax,
          total: ord.total,
          kotGenerated: ord.kotGenerated,
          kotNumber: ord.kotNumber || undefined,
          billRequested: ord.billRequested,
          rejectionReason: ord.rejectionReason || undefined,
          additions,
          createdAt: ord.createdAt,
          updatedAt: ord.updatedAt,
          items: orderItems
        });
      }
    } catch (ordErr) {
      console.warn('Warning syncing orders from Neon:', ordErr);
    }

    // 5. Fetch Bills safely
    try {
      const bills = await prisma.bill.findMany();
      for (const b of bills) {
        const matchingOrder = this.orders.get(b.orderId);
        this.bills.set(b.id, {
          id: b.id,
          restaurantId: b.restaurantId,
          orderId: b.orderId,
          orderNumber: matchingOrder?.orderNumber || '#101',
          tableNumber: matchingOrder?.tableNumber || 'Table 01',
          billNumber: b.billNumber,
          subtotal: b.subtotal,
          tax: b.tax,
          discount: b.discount,
          grandTotal: b.grandTotal,
          paymentStatus: b.paymentStatus as any,
          createdAt: b.createdAt,
          items: matchingOrder?.items || []
        });
      }
    } catch (billErr) {
      console.warn('Warning syncing bills from Neon:', billErr);
    }

    // 6. Fetch Customers safely from database
    try {
      const customers = await prisma.customer.findMany();
      for (const cust of customers) {
        this.customers.set(cust.id, {
          id: cust.id,
          restaurantId: cust.restaurantId,
          name: cust.name,
          phone: cust.phone,
          coinBalance: cust.coinBalance,
          reservedCoins: cust.reservedCoins,
          totalCoinsEarned: cust.totalCoinsEarned,
          totalCoinsRedeemed: cust.totalCoinsRedeemed,
          totalOrders: cust.totalOrders,
          totalSpent: cust.totalSpent,
          avgOrderValue: cust.avgOrderValue,
          firstVisit: cust.firstVisit,
          lastVisit: cust.lastVisit,
          status: cust.status as CustomerStatus,
          createdAt: cust.createdAt,
          updatedAt: cust.updatedAt
        });
      }
    } catch (custErr) {
      console.warn('Warning syncing customers from Neon:', custErr);
    }

    // 7. Fetch CRM Settings safely from database
    try {
      const crmSets = await prisma.crmSettings.findMany();
      for (const s of crmSets) {
        this.crmSettings.set(s.restaurantId, {
          id: s.id,
          restaurantId: s.restaurantId,
          enabled: s.enabled,
          coinsPerAmount: s.coinsPerAmount,
          coinsEarnedPerUnit: s.coinsEarnedPerUnit,
          signupBonusEnabled: s.signupBonusEnabled,
          signupBonusCoins: s.signupBonusCoins,
          minOrderValue: s.minOrderValue,
          redemptionCoinsUnit: s.redemptionCoinsUnit,
          redemptionDiscountUnit: s.redemptionDiscountUnit,
          maxDiscountPerOrder: s.maxDiscountPerOrder,
          allowFullDiscount: s.allowFullDiscount,
          earnOnFood: s.earnOnFood,
          earnOnTax: s.earnOnTax,
          earnOnService: s.earnOnService,
          earnOnDelivery: s.earnOnDelivery,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt
        });
      }
    } catch (crmSetErr) {
      console.warn('Warning syncing crmSettings from Neon:', crmSetErr);
    }

    // 8. Fetch Coin Transactions safely from database
    try {
      const txs = await prisma.coinTransaction.findMany();
      for (const tx of txs) {
        this.coinTransactions.set(tx.id, {
          id: tx.id,
          restaurantId: tx.restaurantId,
          customerId: tx.customerId,
          type: tx.type as any,
          coins: tx.coins,
          orderId: tx.orderId || undefined,
          discount: tx.discount || undefined,
          reason: tx.reason || undefined,
          balanceAfter: tx.balanceAfter,
          createdAt: tx.createdAt
        });
      }
    } catch (txErr) {
      console.warn('Warning syncing coinTransactions from Neon:', txErr);
    }

    // Purge mock demo customers and POS reports from any real (non-demo) restaurant
    const mockCustomerNames = new Set([
      'Rahul Sharma', 'Priya Patel', 'Amit Verma', 'Neha Gupta',
      'Vikram Malhotra', 'Ananya Sen', 'Rohan Mehta', 'Siddharth Rao',
      'Deepak Joshi', 'Kavita Reddy', 'Tanvi Kapoor'
    ]);

    for (const [id, c] of Array.from(this.customers.entries())) {
      if (c.restaurantId !== 'rest_demo_01' && mockCustomerNames.has(c.name)) {
        this.customers.delete(id);
      }
    }

    for (const [id, rep] of Array.from(this.posReports.entries())) {
      if (rep.restaurantId !== 'rest_demo_01') {
        this.posReports.delete(id);
      }
    }
  }

  private seedDemoData() {
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

    this.printerConfigs.set(restaurantId, {
      id: `print_${restaurantId}`,
      restaurantId,
      printerName: 'POS-80 Thermal Kitchen Printer',
      paperWidth: '80mm',
      autoPrintKot: true,
      printerType: 'BROWSER'
    });

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
        id: 'item_09',
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
      },
      {
        id: 'item_10',
        restaurantId,
        categoryId: catBeveragesId,
        name: 'Cold Coffee',
        description: 'Rich creamy brewed espresso blended with chilled milk and chocolate drizzle.',
        price: 129,
        portion: '350 ml Glass',
        isVeg: true,
        isAvailable: true,
        tags: ['Bestseller'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_11',
        restaurantId,
        categoryId: catDessertsId,
        name: 'Chocolate Brownie',
        description: 'Fudge dark chocolate walnut brownie with warm Belgian ganache center.',
        price: 149,
        portion: '1 Pc',
        isVeg: true,
        isAvailable: true,
        tags: ['Popular'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_12',
        restaurantId,
        categoryId: catStartersId,
        name: 'Paneer Sandwich',
        description: 'Grilled multi-grain sandwich layered with spiced cottage cheese cubes, mint chutney, and cheese.',
        price: 129,
        portion: '2 Halves with Chips',
        isVeg: true,
        isAvailable: true,
        tags: ['Bestseller'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item_13',
        restaurantId,
        categoryId: catDessertsId,
        name: 'Butter Croissant',
        description: 'Flaky golden French butter croissant baked fresh daily.',
        price: 119,
        portion: '1 Pc',
        isVeg: true,
        isAvailable: true,
        tags: ['Breakfast Special'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const d of dishes) {
      this.menuItems.set(d.id, d);
    }

    for (let i = 1; i <= 8; i++) {
      const padNum = i < 10 ? `0${i}` : `${i}`;
      const tableId = `tbl_demo_${padNum}`;
      const qrToken = `qr_token_demo_tbl_${padNum}_${crypto.randomBytes(4).toString('hex')}`;
      this.tables.set(tableId, {
        id: tableId,
        restaurantId,
        tableNumber: `Table ${padNum}`,
        qrToken,
        status: 'AVAILABLE',
        createdAt: new Date()
      });
    }

    // Seed realistic 30-day orders for demo restaurant
    const dishList = Array.from(this.menuItems.values()).filter(d => d.restaurantId === restaurantId);
    const tableList = Array.from(this.tables.values()).filter(t => t.restaurantId === restaurantId);

    // Distribution seeds across past 30 days
    const now = new Date();
    const daysBackDistribution = [
      // Today (12 orders)
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      // Yesterday (14 orders)
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      // Days 2 to 6 (Last 7 Days total ~70 orders)
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      3, 3, 3, 3, 3, 3, 3, 3, 3,
      4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
      // Days 7 to 29 (Rest of the month: ~60 orders)
      7, 7, 7, 8, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 13, 13, 14, 14,
      15, 15, 16, 16, 17, 18, 18, 19, 19, 20, 20, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 27, 28, 29
    ];

    const mealTimeSlots = [
      { hour: 12, min: 35 }, { hour: 13, min: 15 }, { hour: 13, min: 45 }, { hour: 14, min: 10 }, // Lunch peak
      { hour: 17, min: 20 }, // Evening chai
      { hour: 19, min: 15 }, { hour: 19, min: 40 }, { hour: 20, min: 10 }, { hour: 20, min: 35 }, { hour: 21, min: 0 }, { hour: 21, min: 25 } // Dinner peak
    ];

    let orderIndex = 0;
    for (const daysAgo of daysBackDistribution) {
      orderIndex++;
      const orderNum = 100 + orderIndex;
      const orderId = `ord_demo_${orderNum}`;

      // Pick source: 52% Dine-in, 28% Swiggy, 20% Zomato
      const randSrc = Math.random();
      let source: OrderSource = 'DINE_IN';
      if (randSrc > 0.80) source = 'ZOMATO';
      else if (randSrc > 0.52) source = 'SWIGGY';

      // Pick table for dine-in
      const table = tableList[orderIndex % tableList.length];

      // Time of day
      const slot = mealTimeSlots[orderIndex % mealTimeSlots.length];
      const orderDate = new Date(now);
      orderDate.setDate(orderDate.getDate() - daysAgo);
      orderDate.setHours(slot.hour, slot.min, (orderIndex * 7) % 60, 0);

      // Status
      let status: OrderStatus = 'COMPLETED';
      let rejectionReason: string | undefined = undefined;

      if (daysAgo === 0) {
        if (orderIndex % 9 === 0) {
          status = 'REJECTED';
          rejectionReason = 'Item out of stock / ingredient unavailable';
        } else if (orderIndex % 6 === 0) {
          status = 'PREPARING';
        } else if (orderIndex % 5 === 0) {
          status = 'READY';
        }
      } else {
        if (orderIndex % 23 === 0) {
          status = 'REJECTED';
          rejectionReason = 'Kitchen at peak rush capacity';
        }
      }

      // Pick 2-4 items for the order
      const itemCombinations: MenuItem[][] = [
        [dishList[1], dishList[6], dishList[7]], // Amritsari Paneer Tikka + Butter Garlic Naan + Masala Chai
        [dishList[3], dishList[6], dishList[6], dishList[8]], // Dal Makhani + 2 Naans + Gulab Jamun
        [dishList[5], dishList[6], dishList[6], dishList[7]], // Butter Chicken + 2 Naans + Masala Chai
        [dishList[1], dishList[4], dishList[6], dishList[7]], // Paneer Tikka + Paneer Butter Masala + Naan + Chai
        [dishList[0], dishList[3], dishList[6]], // Dahi Ke Kebab + Dal Makhani + Naan
        [dishList[2], dishList[5], dishList[6], dishList[6]], // Chicken Malai Tikka + Butter Chicken + 2 Naans
        [dishList[7], dishList[8]], // Masala Chai + Gulab Jamun
        [dishList[9], dishList[11]], // Cold Coffee + Paneer Sandwich
        [dishList[9], dishList[10]], // Cold Coffee + Chocolate Brownie
        [dishList[7], dishList[12]], // Kulhad Masala Chai + Butter Croissant
        [dishList[9]], // Cold Coffee standalone
        [dishList[11]], // Paneer Sandwich standalone
        [dishList[12]] // Butter Croissant standalone
      ];

      const combo = itemCombinations[orderIndex % itemCombinations.length];
      const orderItems: OrderItem[] = combo.map((dish, i) => {
        const qty = (dish.id === 'item_07' || dish.id === 'item_08' || dish.id === 'item_10') && Math.random() > 0.6 ? 2 : 1;
        return {
          id: `item_ord_${orderNum}_${i}`,
          orderId,
          menuItemId: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: qty,
          portion: dish.portion,
          notes: ''
        };
      });

      const subtotal = orderItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;

      const orderObj: Order = {
        id: orderId,
        restaurantId,
        tableId: table.id,
        tableNumber: source === 'DINE_IN' ? table.tableNumber : 'Online',
        orderNumber: `#${orderNum}`,
        source,
        status,
        subtotal,
        tax,
        total,
        kotGenerated: status !== 'REJECTED',
        kotNumber: status !== 'REJECTED' ? `KOT-${1000 + orderIndex}` : undefined,
        billRequested: status === 'COMPLETED' && source === 'DINE_IN',
        rejectionReason,
        createdAt: orderDate,
        updatedAt: orderDate,
        items: orderItems
      };

      this.orders.set(orderId, orderObj);

      // Create bills for completed dine-in orders
      if (status === 'COMPLETED' && source === 'DINE_IN') {
        const billId = `bill_${orderId}`;
        const payModes: ('PAID_UPI' | 'PAID_CASH' | 'PAID_CARD')[] = ['PAID_UPI', 'PAID_UPI', 'PAID_CASH', 'PAID_CARD'];
        this.bills.set(billId, {
          id: billId,
          restaurantId,
          orderId,
          orderNumber: orderObj.orderNumber,
          tableNumber: orderObj.tableNumber,
          billNumber: `INV-${5000 + orderIndex}`,
          subtotal,
          tax,
          discount: 0,
          grandTotal: total,
          paymentStatus: payModes[orderIndex % payModes.length],
          createdAt: orderDate,
          items: orderItems
        });
      }
    }

    this.orderCounter = 100 + orderIndex;
    this.kotCounter = 1000 + orderIndex;
    this.billCounter = 5000 + orderIndex;

    // Seed initial Petpooja POS Report for seamless demo and combined data experience
    const sepStart = new Date(now);
    sepStart.setDate(sepStart.getDate() - 35);
    const sepEnd = new Date(now);
    sepEnd.setDate(sepEnd.getDate() - 5);

    this.posReports.set('pos_rep_demo_01', {
      id: 'pos_rep_demo_01',
      restaurantId,
      fileName: 'Petpooja_Sales_Report_September.xlsx',
      posProvider: 'Petpooja',
      fileType: 'xlsx',
      uploadedAt: new Date(now.getTime() - 4 * 86400000),
      periodStart: sepStart,
      periodEnd: sepEnd,
      periodLabel: '1 Sep – 30 Sep 2026',
      totalOrders: 1248,
      totalSales: 284500,
      totalProducts: 42,
      items: [
        { name: 'Cold Coffee', category: 'Beverages', quantity: 412, totalSales: 53148, unitPrice: 129 },
        { name: 'Paneer Sandwich', category: 'Snacks', quantity: 310, totalSales: 39990, unitPrice: 129 },
        { name: 'Chocolate Brownie', category: 'Desserts', quantity: 245, totalSales: 36505, unitPrice: 149 },
        { name: 'Kulhad Masala Chai', category: 'Beverages', quantity: 560, totalSales: 38640, unitPrice: 69 },
        { name: 'Amritsari Paneer Tikka', category: 'Starters', quantity: 180, totalSales: 50220, unitPrice: 279 },
        { name: 'Butter Croissant', category: 'Bakery', quantity: 140, totalSales: 16660, unitPrice: 119 },
        { name: 'Old Delhi Butter Chicken', category: 'Mains', quantity: 95, totalSales: 36955, unitPrice: 389 },
        { name: 'Dal Makhani Slow Cooked', category: 'Mains', quantity: 120, totalSales: 35880, unitPrice: 299 }
      ],
      hourlyDistribution: {
        12: 24000, 13: 38000, 14: 29000,
        15: 12000, 16: 14000, 17: 15500,
        18: 26000, 19: 42000, 20: 51000, 21: 33000
      },
      dowDistribution: {
        0: 48000, 1: 31000, 2: 26000, 3: 32000, 4: 37000, 5: 56000, 6: 54500
      }
    });

    this.businessTypes.set(restaurantId, 'Café');
    this.growthDataModes.set(restaurantId, { mode: 'swaad', reportId: 'pos_rep_demo_01' });

    this.seedCrmDemoData(restaurantId);
  }

  public ensureCrmSettings(restaurantId: string): CrmSettings {
    let settings = this.crmSettings.get(restaurantId);
    if (!settings) {
      settings = {
        id: `crm_set_${restaurantId}`,
        restaurantId,
        enabled: true,
        coinsPerAmount: 10,
        coinsEarnedPerUnit: 1,
        signupBonusEnabled: true,
        signupBonusCoins: 100,
        minOrderValue: 300,
        redemptionCoinsUnit: 100,
        redemptionDiscountUnit: 10,
        maxDiscountPerOrder: 100,
        allowFullDiscount: false,
        earnOnFood: true,
        earnOnTax: false,
        earnOnService: false,
        earnOnDelivery: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.crmSettings.set(restaurantId, settings);
    }
    return settings;
  }

  private seedCrmDemoData(restaurantId: string) {
    if (restaurantId !== 'rest_demo_01') return;
    if (this.crmSettings.has(restaurantId)) return;

    // Seed CRM Settings (Phases 3 & 4)
    this.crmSettings.set(restaurantId, {
      id: `crm_set_${restaurantId}`,
      restaurantId,
      enabled: true,
      coinsPerAmount: 10,
      coinsEarnedPerUnit: 1,
      signupBonusEnabled: true,
      signupBonusCoins: 100,
      minOrderValue: 300,
      redemptionCoinsUnit: 100,
      redemptionDiscountUnit: 10, // 100 coins = Rs 10 discount
      maxDiscountPerOrder: 100,
      allowFullDiscount: false,
      earnOnFood: true,
      earnOnTax: false,
      earnOnService: false,
      earnOnDelivery: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const now = new Date();

    // Seed realistic customers with rich diverse states
    const rawCustomers = [
      {
        id: `cust_${restaurantId.substring(0, 6)}_rahul`,
        name: 'Rahul Sharma',
        phone: '9820112345',
        coins: 240,
        orders: 14,
        spent: 9850,
        status: 'VIP' as CustomerStatus,
        daysAgo: 2,
        firstDaysAgo: 54
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_priya`,
        name: 'Priya Patel',
        phone: '9876543210',
        coins: 180,
        orders: 8,
        spent: 5420,
        status: 'REGULAR' as CustomerStatus,
        daysAgo: 4,
        firstDaysAgo: 40
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_amit`,
        name: 'Amit Verma',
        phone: '9123456789',
        coins: 450,
        orders: 19,
        spent: 15200,
        status: 'VIP' as CustomerStatus,
        daysAgo: 1,
        firstDaysAgo: 60
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_neha`,
        name: 'Neha Gupta',
        phone: '9811223344',
        coins: 100,
        orders: 1,
        spent: 750,
        status: 'NEW' as CustomerStatus,
        daysAgo: 3,
        firstDaysAgo: 3
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_vikram`,
        name: 'Vikram Malhotra',
        phone: '9988776655',
        coins: 320,
        orders: 6,
        spent: 4300,
        status: 'REGULAR' as CustomerStatus,
        daysAgo: 6,
        firstDaysAgo: 35
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_ananya`,
        name: 'Ananya Sen',
        phone: '9711002233',
        coins: 80,
        orders: 4,
        spent: 2800,
        status: 'AT_RISK' as CustomerStatus,
        daysAgo: 42,
        firstDaysAgo: 70
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_rohan`,
        name: 'Rohan Mehta',
        phone: '9822334455',
        coins: 120,
        orders: 3,
        spent: 1950,
        status: 'INACTIVE' as CustomerStatus,
        daysAgo: 75,
        firstDaysAgo: 90
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_siddharth`,
        name: 'Siddharth Rao',
        phone: '9900112233',
        coins: 210,
        orders: 7,
        spent: 5100,
        status: 'REGULAR' as CustomerStatus,
        daysAgo: 5,
        firstDaysAgo: 45
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_deepak`,
        name: 'Deepak Joshi',
        phone: '9899001122',
        coins: 150,
        orders: 2,
        spent: 1400,
        status: 'NEW' as CustomerStatus,
        daysAgo: 8,
        firstDaysAgo: 12
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_kavita`,
        name: 'Kavita Reddy',
        phone: '9844556677',
        coins: 390,
        orders: 16,
        spent: 12900,
        status: 'VIP' as CustomerStatus,
        daysAgo: 3,
        firstDaysAgo: 58
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_tanvi`,
        name: 'Tanvi Kapoor',
        phone: '9911223300',
        coins: 100,
        orders: 1,
        spent: 680,
        status: 'NEW' as CustomerStatus,
        daysAgo: 2,
        firstDaysAgo: 2
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_aditya`,
        name: 'Aditya Nair',
        phone: '9833445566',
        coins: 160,
        orders: 5,
        spent: 3750,
        status: 'REGULAR' as CustomerStatus,
        daysAgo: 7,
        firstDaysAgo: 38
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_meera`,
        name: 'Meera Iyer',
        phone: '9877001122',
        coins: 60,
        orders: 3,
        spent: 2100,
        status: 'AT_RISK' as CustomerStatus,
        daysAgo: 48,
        firstDaysAgo: 65
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_gaurav`,
        name: 'Gaurav Deshmukh',
        phone: '9966554433',
        coins: 280,
        orders: 9,
        spent: 6400,
        status: 'REGULAR' as CustomerStatus,
        daysAgo: 9,
        firstDaysAgo: 50
      },
      {
        id: `cust_${restaurantId.substring(0, 6)}_sunita`,
        name: 'Sunita Choudhary',
        phone: '9811992288',
        coins: 140,
        orders: 2,
        spent: 1600,
        status: 'INACTIVE' as CustomerStatus,
        daysAgo: 80,
        firstDaysAgo: 95
      }
    ];

    for (const raw of rawCustomers) {
      const firstVisit = new Date(now.getTime() - raw.firstDaysAgo * 86400000);
      const lastVisit = new Date(now.getTime() - raw.daysAgo * 86400000);
      const avgOrder = Math.round(raw.spent / raw.orders);

      const cust: Customer = {
        id: raw.id,
        restaurantId,
        name: raw.name,
        phone: raw.phone,
        coinBalance: raw.coins,
        reservedCoins: 0,
        totalCoinsEarned: raw.coins + (raw.status === 'VIP' ? 300 : 100),
        totalCoinsRedeemed: raw.status === 'VIP' ? 300 : 100,
        totalOrders: raw.orders,
        totalSpent: raw.spent,
        avgOrderValue: avgOrder,
        firstVisit,
        lastVisit,
        status: raw.status,
        createdAt: firstVisit,
        updatedAt: lastVisit
      };
      this.customers.set(cust.id, cust);

      // Seed Signup bonus transaction
      const signupTxId = `tx_signup_${raw.id}`;
      this.coinTransactions.set(signupTxId, {
        id: signupTxId,
        restaurantId,
        customerId: raw.id,
        type: 'SIGNUP_BONUS',
        coins: 100,
        reason: 'Welcome First Signup Bonus',
        balanceAfter: 100,
        createdAt: firstVisit
      });

      // Seed historical redemption if VIP
      if (raw.status === 'VIP') {
        const redeemTxId = `tx_red_${raw.id}`;
        this.coinTransactions.set(redeemTxId, {
          id: redeemTxId,
          restaurantId,
          customerId: raw.id,
          type: 'REDEMPTION',
          coins: -200,
          discount: 20,
          reason: 'Redeemed for ₹20 discount on order',
          balanceAfter: raw.coins,
          createdAt: lastVisit
        });
      }

      // Seed recent order reward
      const earnTxId = `tx_earn_${raw.id}`;
      const rewardCoins = Math.floor(avgOrder / 10);
      this.coinTransactions.set(earnTxId, {
        id: earnTxId,
        restaurantId,
        customerId: raw.id,
        type: 'ORDER_EARN',
        coins: rewardCoins,
        reason: 'Earned from completed order',
        balanceAfter: raw.coins,
        createdAt: lastVisit
      });
    }

    // Link a few existing demo orders to customers
    const recentOrders = Array.from(this.orders.values()).filter(o => o.restaurantId === restaurantId).slice(0, 15);
    if (recentOrders.length > 0 && rawCustomers.length > 0) {
      recentOrders[0].customerId = rawCustomers[0].id;
      recentOrders[0].customerName = rawCustomers[0].name;
      recentOrders[0].customerPhone = rawCustomers[0].phone;
      recentOrders[0].coinsUsed = 100;
      recentOrders[0].coinDiscount = 10;
      recentOrders[0].coinsEarned = 58;

      if (recentOrders.length > 1) {
        recentOrders[1].customerId = rawCustomers[1].id;
        recentOrders[1].customerName = rawCustomers[1].name;
        recentOrders[1].customerPhone = rawCustomers[1].phone;
        recentOrders[1].coinsEarned = 42;
      }

      if (recentOrders.length > 2) {
        recentOrders[2].customerId = rawCustomers[2].id;
        recentOrders[2].customerName = rawCustomers[2].name;
        recentOrders[2].customerPhone = rawCustomers[2].phone;
        recentOrders[2].coinsUsed = 200;
        recentOrders[2].coinDiscount = 20;
        recentOrders[2].coinsEarned = 76;
      }
    }

    // Seed Marketing Channels
    this.marketingChannels.set(restaurantId, {
      whatsapp: true,
      sms: true,
      email: false
    });

    // Seed AI Automations (Phase 34, 35)
    const initialAutomations: AiAutomation[] = [
      {
        id: 'auto-winback-30d',
        restaurantId,
        name: 'Win Back Inactive Diners',
        trigger: 'Customer inactive for 30 days',
        conditions: 'Orders >= 2 and total spend >= ₹500',
        action: '₹75 Discount Coins + personalized message',
        channel: 'WHATSAPP',
        frequencyLimitDays: 45,
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 86400000).toISOString(),
        customersReached: 42,
        revenueAttributed: 24800,
        createdAt: new Date(Date.now() - 14 * 86400000)
      },
      {
        id: 'auto-first-order-followup',
        restaurantId,
        name: 'New Customer 2nd-Visit Follow-Up',
        trigger: '7 days after first order completed',
        conditions: 'Total orders == 1',
        action: '₹50 Second-Visit Coins + thank-you note',
        channel: 'WHATSAPP',
        frequencyLimitDays: 90,
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 2 * 86400000).toISOString(),
        customersReached: 26,
        revenueAttributed: 14200,
        createdAt: new Date(Date.now() - 21 * 86400000)
      },
      {
        id: 'auto-vip-protection',
        restaurantId,
        name: 'VIP Falling Frequency Shield',
        trigger: 'VIP guest visit gap > 25 days',
        conditions: 'VIP status or spend > ₹8,000',
        action: 'Chef Tasting Invitation + 150 VIP Coins',
        channel: 'WHATSAPP',
        frequencyLimitDays: 30,
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 3 * 86400000).toISOString(),
        customersReached: 8,
        revenueAttributed: 9800,
        createdAt: new Date(Date.now() - 30 * 86400000)
      },
      {
        id: 'auto-feedback-recovery',
        restaurantId,
        name: 'Feedback Recovery Apology',
        trigger: 'Customer rating < 3/5 or service complaint',
        conditions: 'Identified phone number recorded',
        action: 'Personal apology note + 100 Compensation Coins',
        channel: 'SMS',
        frequencyLimitDays: 14,
        status: 'PAUSED',
        lastRun: new Date(Date.now() - 6 * 86400000).toISOString(),
        customersReached: 4,
        revenueAttributed: 2100,
        createdAt: new Date(Date.now() - 45 * 86400000)
      },
      {
        id: 'auto-weekend-combo-boost',
        restaurantId,
        name: 'Weekend Beverage Combo Boost',
        trigger: 'Friday 4:00 PM pre-dinner trigger',
        conditions: 'Past weekend dinner visitors',
        action: 'Free Kulhad Chai unlock on ₹499+ order',
        channel: 'WHATSAPP',
        frequencyLimitDays: 14,
        status: 'ACTIVE',
        lastRun: new Date(Date.now() - 4 * 86400000).toISOString(),
        customersReached: 34,
        revenueAttributed: 18600,
        createdAt: new Date(Date.now() - 10 * 86400000)
      }
    ];

    for (const a of initialAutomations) {
      this.aiAutomations.set(a.id, a);
    }

    // Seed AI Campaigns (Completed with performance analytics + Pending Approval draft)
    const initialCampaigns: AiCampaign[] = [
      {
        id: 'camp-weekend-kickoff-01',
        restaurantId,
        name: 'Chai & Chaat Weekend Kickoff',
        description: 'Special weekend re-engagement campaign for snack lovers',
        objective: 'Re-engage weekend diners with signature chai pairings',
        audienceSegment: 'WEEKEND_DINERS',
        audienceConditions: 'Visited on weekend in last 60 days',
        targetCount: 127,
        channel: 'WHATSAPP',
        mode: 'AUTOMATIC',
        priority: 'MEDIUM',
        status: 'COMPLETED',
        tone: 'FRIENDLY',
        language: 'HINGLISH',
        offerType: 'DISCOUNT_COINS',
        offerValue: 75,
        validityDays: 7,
        messageTemplate: 'Hey {{customer_name}}! We haven\'t seen you in a while at {{restaurant_name}}. Here\'s ₹75 in SwaadSevak Coins for your next visit. We\'d love to have you back! ❤️',
        resolvedMessagePreview: 'Hey Rahul! We haven\'t seen you in a while at The Chai & Chaat Co. Here\'s ₹75 in SwaadSevak Coins for your next visit. We\'d love to have you back! ❤️',
        sentAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        maxRewardCost: 9525,
        requiresApproval: false,
        frequencyGuard: { maxPerMonth: 3, minGapDays: 5 },
        stats: {
          sent: 127,
          delivered: 121,
          clicks: 84,
          redeemed: 38,
          conversionRate: 31.4,
          revenueGenerated: 24800,
          discountCost: 2850,
          netRevenue: 21950,
          controlGroup: {
            groupSize: 100,
            returnCount: 9,
            returnRate: 9.0,
            incrementalRevenue: 18200
          }
        },
        createdAt: new Date(Date.now() - 6 * 86400000),
        updatedAt: new Date(Date.now() - 5 * 86400000)
      },
      {
        id: 'camp-winback-draft-02',
        restaurantId,
        name: 'Win Back Inactive Diners',
        description: 'Targeted win-back for diners with 30+ days inactivity',
        objective: 'Re-activate 43 inactive diners with time-bound reward',
        audienceSegment: 'AT_RISK',
        audienceConditions: 'Last visit > 30 days ago, total orders >= 2',
        targetCount: 43,
        channel: 'WHATSAPP',
        mode: 'APPROVAL_REQUIRED',
        priority: 'HIGH',
        status: 'PENDING_APPROVAL',
        tone: 'FRIENDLY',
        language: 'HINGLISH',
        offerType: 'DISCOUNT_COINS',
        offerValue: 75,
        validityDays: 7,
        messageTemplate: 'Hey {{customer_name}}! Kaafi time ho gaya aapse mile hue at {{restaurant_name}} ❤️ Aapke next visit ke liye ₹75 Discount Coins ready hain. Jaldi aao!',
        resolvedMessagePreview: 'Hey Rahul! Kaafi time ho gaya aapse mile hue at The Chai & Chaat Co. ❤️ Aapke next visit ke liye ₹75 Discount Coins ready hain. Jaldi aao!',
        maxRewardCost: 3225,
        requiresApproval: true,
        frequencyGuard: { maxPerMonth: 3, minGapDays: 5 },
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        id: 'camp-vip-draft-03',
        restaurantId,
        name: 'VIP Patron Appreciation Reserve',
        description: 'Exclusive reward for top 15% lifetime spenders',
        objective: 'Reward top VIP guests and prevent high-value churn',
        audienceSegment: 'VIP',
        audienceConditions: 'Total spend >= ₹8,000 or status = VIP',
        targetCount: 18,
        channel: 'WHATSAPP',
        mode: 'APPROVAL_REQUIRED',
        priority: 'HIGH',
        status: 'DRAFT',
        tone: 'PREMIUM',
        language: 'ENGLISH',
        offerType: 'DISCOUNT_COINS',
        offerValue: 150,
        validityDays: 14,
        messageTemplate: 'Dear {{customer_name}}, as one of our most valued patrons at {{restaurant_name}}, your VIP reserve of 150 Discount Coins is active for your next dinner. We look forward to hosting you.',
        resolvedMessagePreview: 'Dear Amit, as one of our most valued patrons at The Chai & Chaat Co., your VIP reserve of 150 Discount Coins is active for your next dinner. We look forward to hosting you.',
        maxRewardCost: 2700,
        requiresApproval: true,
        frequencyGuard: { maxPerMonth: 2, minGapDays: 10 },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const c of initialCampaigns) {
      this.aiCampaigns.set(c.id, c);
    }
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

  async createRestaurant(data: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Restaurant> {
    const id = `rest_${crypto.randomUUID()}`;
    const restaurant: Restaurant = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.restaurants.set(id, restaurant);

    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await prisma.restaurant.create({
          data: {
            id: restaurant.id,
            slug: restaurant.slug,
            name: restaurant.name,
            ownerName: restaurant.ownerName,
            phone: restaurant.phone,
            email: restaurant.email,
            address: restaurant.address,
            city: restaurant.city,
            state: restaurant.state,
            restaurantType: restaurant.restaurantType,
            gstNumber: restaurant.gstNumber
          }
        });
      } catch (err) {
        console.error('Prisma createRestaurant error:', err);
      }
    }

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

  async createManager(data: Omit<Manager, 'id' | 'createdAt'>): Promise<Manager> {
    const id = `mgr_${crypto.randomUUID()}`;
    const manager: Manager = {
      ...data,
      id,
      createdAt: new Date()
    };
    this.managers.set(id, manager);

    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await prisma.manager.create({
          data: {
            id: manager.id,
            restaurantId: manager.restaurantId,
            username: manager.username,
            pinHash: manager.pinHash,
            role: manager.role
          }
        });
      } catch (err) {
        console.error('Prisma createManager error:', err);
      }
    }

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

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.menuCategory.create({
        data: {
          id: category.id,
          restaurantId,
          name: category.name,
          displayOrder: category.displayOrder
        }
      }).catch(err => console.error('Prisma createCategory error:', err));
    }

    return category;
  }

  updateCategory(restaurantId: string, categoryId: string, name: string): MenuCategory | null {
    const cat = this.categories.get(categoryId);
    if (!cat || cat.restaurantId !== restaurantId) return null;
    cat.name = name;

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.menuCategory.update({
        where: { id: categoryId },
        data: { name }
      }).catch(err => console.error('Prisma updateCategory error:', err));
    }

    return cat;
  }

  deleteCategory(restaurantId: string, categoryId: string): boolean {
    const cat = this.categories.get(categoryId);
    if (!cat || cat.restaurantId !== restaurantId) return false;
    this.categories.delete(categoryId);

    for (const [itemId, item] of this.menuItems.entries()) {
      if (item.categoryId === categoryId) {
        this.menuItems.delete(itemId);
      }
    }

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.menuCategory.delete({
        where: { id: categoryId }
      }).catch(err => console.error('Prisma deleteCategory error:', err));
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

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.menuItem.create({
        data: {
          id: item.id,
          restaurantId,
          categoryId: item.categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          portion: item.portion,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
          tags: JSON.stringify(item.tags)
        }
      }).catch(err => console.error('Prisma createItem error:', err));
    }

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

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.menuItem.update({
        where: { id: itemId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.portion && { portion: data.portion }),
          ...(data.isVeg !== undefined && { isVeg: data.isVeg }),
          ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
          ...(data.tags && { tags: JSON.stringify(data.tags) })
        }
      }).catch(err => console.error('Prisma updateItem error:', err));
    }

    return updated;
  }

  setItemStock(restaurantId: string, itemId: string, isAvailable: boolean): MenuItem | null {
    const item = this.menuItems.get(itemId);
    if (!item || item.restaurantId !== restaurantId) return null;
    item.isAvailable = isAvailable;
    item.updatedAt = new Date();

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.menuItem.update({
        where: { id: itemId },
        data: { isAvailable }
      }).catch(err => console.error('Prisma setItemStock error:', err));
    }

    return item;
  }

  deleteItem(restaurantId: string, itemId: string): boolean {
    const item = this.menuItems.get(itemId);
    if (!item || item.restaurantId !== restaurantId) return false;
    this.menuItems.delete(itemId);

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.menuItem.delete({
        where: { id: itemId }
      }).catch(err => console.error('Prisma deleteItem error:', err));
    }

    return true;
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

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.table.create({
        data: {
          id: table.id,
          restaurantId,
          tableNumber: table.tableNumber,
          qrToken: table.qrToken,
          status: table.status
        }
      }).catch(err => console.error('Prisma createTable error:', err));
    }

    return table;
  }

  updateTable(restaurantId: string, tableId: string, data: Partial<Table>): Table | null {
    const table = this.tables.get(tableId);
    if (!table || table.restaurantId !== restaurantId) return null;
    const updated = { ...table, ...data };
    this.tables.set(tableId, updated);

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.table.update({
        where: { id: tableId },
        data: {
          ...(data.tableNumber && { tableNumber: data.tableNumber }),
          ...(data.status && { status: data.status })
        }
      }).catch(err => console.error('Prisma updateTable error:', err));
    }

    return updated;
  }

  regenerateTableQr(restaurantId: string, tableId: string): Table | null {
    const table = this.tables.get(tableId);
    if (!table || table.restaurantId !== restaurantId) return null;
    table.qrToken = `qr_${crypto.randomBytes(6).toString('hex')}`;

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.table.update({
        where: { id: tableId },
        data: { qrToken: table.qrToken }
      }).catch(err => console.error('Prisma regenerateTableQr error:', err));
    }

    return table;
  }

  deleteTable(restaurantId: string, tableId: string): boolean {
    const table = this.tables.get(tableId);
    if (!table || table.restaurantId !== restaurantId) return false;
    this.tables.delete(tableId);

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.table.delete({
        where: { id: tableId }
      }).catch(err => console.error('Prisma deleteTable error:', err));
    }

    return true;
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

  getActiveOrderByTable(restaurantId: string, tableId: string): Order | undefined {
    for (const ord of this.orders.values()) {
      if (
        ord.restaurantId === restaurantId &&
        ord.tableId === tableId &&
        ord.status !== 'COMPLETED' &&
        ord.status !== 'REJECTED'
      ) {
        return ord;
      }
    }
    return undefined;
  }

  addOrderAddition(
    restaurantId: string,
    orderId: string,
    data: { customerNotes?: string; subtotal: number; tax: number; total: number; items: OrderItem[] }
  ): { order: Order; addition: OrderAddition } | null {
    const order = this.getOrder(restaurantId, orderId);
    if (!order) return null;

    if (!order.additions) order.additions = [];
    const additionId = `add_${crypto.randomUUID()}`;
    const additionNumber = `Add-on #${order.additions.length + 1}`;

    const addition: OrderAddition = {
      id: additionId,
      orderId: order.id,
      additionNumber,
      status: 'PENDING',
      customerNotes: data.customerNotes,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      createdAt: new Date(),
      items: data.items.map(it => ({ ...it, orderId: order.id }))
    };

    order.additions.push(addition);
    order.updatedAt = new Date();

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.order.update({
        where: { id: orderId },
        data: {
          additions: JSON.stringify(order.additions)
        }
      }).catch(err => console.error('Prisma addOrderAddition error:', err));
    }

    return { order, addition };
  }

  acceptOrderAddition(
    restaurantId: string,
    orderId: string,
    additionId: string
  ): { order: Order; addition: OrderAddition; kotData?: any } | null {
    const order = this.getOrder(restaurantId, orderId);
    if (!order || !order.additions) return null;

    const addition = order.additions.find(a => a.id === additionId);
    if (!addition || addition.status !== 'PENDING') return null;

    addition.status = 'ACCEPTED';

    // Merge addition items into order
    for (const item of addition.items) {
      order.items.push({
        id: item.id || `item_${crypto.randomUUID()}`,
        orderId: order.id,
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        portion: item.portion || 'Standard',
        notes: item.notes
      });
    }

    // Update totals
    order.subtotal = Math.round((order.subtotal + addition.subtotal) * 100) / 100;
    order.tax = Math.round((order.tax + addition.tax) * 100) / 100;
    order.total = Math.round((order.total + addition.total) * 100) / 100;

    // If order was already served or ready, move back to PREPARING so kitchen prepares the extra items
    if (order.status === 'SERVED' || order.status === 'READY') {
      order.status = 'PREPARING';
    }
    order.updatedAt = new Date();

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: order.status,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total,
          additions: JSON.stringify(order.additions)
        }
      }).catch(err => console.error('Prisma acceptOrderAddition error:', err));
    }

    return { order, addition };
  }

  rejectOrderAddition(
    restaurantId: string,
    orderId: string,
    additionId: string,
    rejectionReason?: string
  ): { order: Order; addition: OrderAddition } | null {
    const order = this.getOrder(restaurantId, orderId);
    if (!order || !order.additions) return null;

    const addition = order.additions.find(a => a.id === additionId);
    if (!addition || addition.status !== 'PENDING') return null;

    // Reject ONLY this addition. The main order remains completely unaffected!
    addition.status = 'REJECTED';
    addition.rejectionReason = rejectionReason || 'Item unavailable';
    order.updatedAt = new Date();

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.order.update({
        where: { id: orderId },
        data: {
          additions: JSON.stringify(order.additions)
        }
      }).catch(err => console.error('Prisma rejectOrderAddition error:', err));
    }

    return { order, addition };
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

    // Safely reserve coins if customer applied discount coins
    if (order.customerId && order.coinsUsed && order.coinsUsed > 0) {
      this.reserveCoinsForOrder(order.restaurantId, order.customerId, order.coinsUsed);
    }

    const table = this.tables.get(data.tableId);
    if (table) {
      table.status = 'OCCUPIED';
    }

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.order.create({
        data: {
          id: order.id,
          restaurantId: order.restaurantId,
          tableId: order.tableId,
          orderNumber: order.orderNumber,
          source: order.source,
          status: order.status,
          customerNotes: order.customerNotes,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total,
          kotGenerated: false,
          billRequested: false,
          items: {
            create: order.items.map(i => ({
              id: i.id || `item_${crypto.randomUUID()}`,
              menuItemId: i.menuItemId,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              portion: i.portion || 'Standard',
              notes: i.notes
            }))
          }
        }
      }).catch(err => console.error('Prisma createOrder error:', err));
    }

    return order;
  }

  updateOrderStatus(restaurantId: string, orderId: string, status: OrderStatus, rejectionReason?: string, estimatedPrepTime?: number): Order | null {
    const order = this.orders.get(orderId);
    if (!order || order.restaurantId !== restaurantId) return null;
    order.status = status;
    if (rejectionReason) {
      order.rejectionReason = rejectionReason;
    }
    if (estimatedPrepTime !== undefined && estimatedPrepTime > 0) {
      order.estimatedPrepTime = estimatedPrepTime;
    }
    order.updatedAt = new Date();

    if (status === 'ACCEPTED' && !order.kotGenerated) {
      order.kotGenerated = true;
      order.kotNumber = this.getNextKotNumber();
    }

    // If order is rejected or cancelled, safely release any reserved coins
    if (status === 'REJECTED') {
      if (order.customerId && order.coinsUsed && order.coinsUsed > 0) {
        this.releaseCoinsForOrder(restaurantId, order.customerId, order.coinsUsed);
      }
    }

    if (status === 'COMPLETED' || status === 'DELIVERED') {
      const table = this.tables.get(order.tableId);
      if (table) {
        table.status = 'AVAILABLE';
      }
    }

    // For online aggregator orders, marking delivered also marks settled
    if (status === 'DELIVERED') {
      order.settled = true;
      const existingBill = Array.from(this.bills.values()).find(b => b.orderId === orderId);
      if (!existingBill) {
        const billId = `bill_${crypto.randomUUID()}`;
        this.bills.set(billId, {
          id: billId,
          restaurantId: order.restaurantId,
          orderId: order.id,
          orderNumber: order.orderNumber,
          tableNumber: order.tableNumber,
          billNumber: this.getNextBillNumber(),
          subtotal: order.subtotal,
          tax: order.tax,
          discount: order.coinDiscount || 0,
          coinsUsed: order.coinsUsed || 0,
          grandTotal: Math.max(0, order.total - (order.coinDiscount || 0)),
          paymentStatus: 'PAID_UPI',
          createdAt: new Date(),
          items: order.items
        });
      } else {
        existingBill.paymentStatus = 'PAID_UPI';
      }
      this.finalizeCoinsForOrder(restaurantId, orderId, order.coinDiscount || 0);
    }

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: order.status,
          kotGenerated: order.kotGenerated,
          kotNumber: order.kotNumber,
          rejectionReason: order.rejectionReason
        }
      }).catch(err => console.error('Prisma updateOrderStatus error:', err));
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

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.order.update({
        where: { id: orderId },
        data: { billRequested: true }
      }).catch(err => console.error('Prisma requestBill error:', err));
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

    const discount = order.coinDiscount || 0;
    const grandTotal = Math.max(0, order.total - discount);

    const existing = this.getBillByOrder(orderId);
    if (existing) {
      existing.subtotal = order.subtotal;
      existing.tax = order.tax;
      existing.discount = discount;
      existing.coinsUsed = order.coinsUsed || 0;
      existing.grandTotal = grandTotal;
      existing.items = order.items;
      return existing;
    }

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
      discount,
      coinsUsed: order.coinsUsed || 0,
      grandTotal,
      paymentStatus: 'UNPAID',
      createdAt: new Date(),
      items: order.items
    };
    this.bills.set(id, bill);

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.bill.create({
        data: {
          id: bill.id,
          restaurantId,
          orderId,
          billNumber: bill.billNumber,
          subtotal: bill.subtotal,
          tax: bill.tax,
          discount: bill.discount,
          grandTotal: bill.grandTotal,
          paymentStatus: 'UNPAID'
        }
      }).catch(err => console.error('Prisma createBill error:', err));
    }

    return bill;
  }

  settleBill(restaurantId: string, billId: string, paymentStatus: 'PAID_CASH' | 'PAID_UPI' | 'PAID_CARD'): Bill | null {
    const bill = this.bills.get(billId);
    if (!bill || bill.restaurantId !== restaurantId) return null;
    bill.paymentStatus = paymentStatus;

    const order = this.orders.get(bill.orderId);
    if (order) {
      order.status = 'COMPLETED';
      const table = this.tables.get(order.tableId);
      if (table) table.status = 'AVAILABLE';
      // Automatically finalize coins: deduct redeemed coins safely and award newly earned coins
      this.finalizeCoinsForOrder(restaurantId, bill.orderId, bill.discount);
    }

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.bill.update({
        where: { id: billId },
        data: { paymentStatus }
      }).catch(err => console.error('Prisma settleBill error:', err));

      if (order) {
        prisma.order.update({
          where: { id: order.id },
          data: { status: 'COMPLETED' }
        }).catch(err => console.error('Prisma order complete error:', err));
      }
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

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.printerConfig.upsert({
        where: { restaurantId },
        update: {
          ...(data.printerName && { printerName: data.printerName }),
          ...(data.paperWidth && { paperWidth: data.paperWidth }),
          ...(data.autoPrintKot !== undefined && { autoPrintKot: data.autoPrintKot }),
          ...(data.printerType && { printerType: data.printerType }),
          ...(data.printerIp !== undefined && { printerIp: data.printerIp })
        },
        create: {
          restaurantId,
          printerName: updated.printerName,
          paperWidth: updated.paperWidth,
          autoPrintKot: updated.autoPrintKot,
          printerType: updated.printerType,
          printerIp: updated.printerIp
        }
      }).catch(err => console.error('Prisma updatePrinterConfig error:', err));
    }

    return updated;
  }

  // --- CRM & DISCOUNT COIN METHODS ---

  normalizePhone(phone: string): string {
    const cleaned = (phone || '').replace(/\D/g, '');
    if (cleaned.length > 10 && cleaned.startsWith('91')) {
      return cleaned.slice(-10);
    }
    return cleaned.slice(-10);
  }

  maskPhone(phone: string): string {
    const norm = this.normalizePhone(phone);
    if (norm.length === 10) {
      return `${norm.slice(0, 2)}XXXXXX${norm.slice(-2)}`;
    }
    return phone;
  }

  getCrmSettings(restaurantId: string): CrmSettings {
    let settings = this.crmSettings.get(restaurantId);
    if (!settings) {
      settings = {
        id: `crm_set_${restaurantId}`,
        restaurantId,
        enabled: true,
        coinsPerAmount: 10,
        coinsEarnedPerUnit: 1,
        signupBonusEnabled: true,
        signupBonusCoins: 100,
        minOrderValue: 300,
        redemptionCoinsUnit: 100,
        redemptionDiscountUnit: 10,
        maxDiscountPerOrder: 100,
        allowFullDiscount: false,
        earnOnFood: true,
        earnOnTax: false,
        earnOnService: false,
        earnOnDelivery: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.crmSettings.set(restaurantId, settings);
    }
    return settings;
  }

  updateCrmSettings(restaurantId: string, data: Partial<CrmSettings>): CrmSettings {
    const current = this.getCrmSettings(restaurantId);
    const updated: CrmSettings = {
      ...current,
      ...data,
      updatedAt: new Date()
    };
    this.crmSettings.set(restaurantId, updated);

    const prisma = getPrismaClient();
    if (prisma && (prisma as any).crmSettings) {
      (prisma as any).crmSettings.upsert({
        where: { restaurantId },
        update: {
          enabled: updated.enabled,
          coinsPerAmount: updated.coinsPerAmount,
          coinsEarnedPerUnit: updated.coinsEarnedPerUnit,
          signupBonusEnabled: updated.signupBonusEnabled,
          signupBonusCoins: updated.signupBonusCoins,
          minOrderValue: updated.minOrderValue,
          redemptionCoinsUnit: updated.redemptionCoinsUnit,
          redemptionDiscountUnit: updated.redemptionDiscountUnit,
          maxDiscountPerOrder: updated.maxDiscountPerOrder,
          allowFullDiscount: updated.allowFullDiscount,
          earnOnFood: updated.earnOnFood,
          earnOnTax: updated.earnOnTax,
          earnOnService: updated.earnOnService,
          earnOnDelivery: updated.earnOnDelivery
        },
        create: {
          restaurantId,
          enabled: updated.enabled,
          coinsPerAmount: updated.coinsPerAmount,
          coinsEarnedPerUnit: updated.coinsEarnedPerUnit,
          signupBonusEnabled: updated.signupBonusEnabled,
          signupBonusCoins: updated.signupBonusCoins,
          minOrderValue: updated.minOrderValue,
          redemptionCoinsUnit: updated.redemptionCoinsUnit,
          redemptionDiscountUnit: updated.redemptionDiscountUnit,
          maxDiscountPerOrder: updated.maxDiscountPerOrder,
          allowFullDiscount: updated.allowFullDiscount,
          earnOnFood: updated.earnOnFood,
          earnOnTax: updated.earnOnTax,
          earnOnService: updated.earnOnService,
          earnOnDelivery: updated.earnOnDelivery
        }
      }).catch(err => console.error('Prisma updateCrmSettings error:', err));
    }

    return updated;
  }

  getCustomerById(restaurantId: string, customerId: string): Customer | undefined {
    const customer = this.customers.get(customerId);
    if (customer && customer.restaurantId === restaurantId) {
      return customer;
    }
    return undefined;
  }

  getCustomerByPhone(restaurantId: string, rawPhone: string): Customer | undefined {
    const norm = this.normalizePhone(rawPhone);
    if (!norm) return undefined;
    for (const c of this.customers.values()) {
      if (c.restaurantId === restaurantId && this.normalizePhone(c.phone) === norm) {
        return c;
      }
    }
    return undefined;
  }

  createCustomer(
    restaurantId: string,
    data: { name: string; phone: string; initialCoins?: number }
  ): { customer: Customer; isNew: boolean } {
    const existing = this.getCustomerByPhone(restaurantId, data.phone);
    if (existing) {
      return { customer: existing, isNew: false };
    }

    const normPhone = this.normalizePhone(data.phone);
    const settings = this.getCrmSettings(restaurantId);
    const id = `cust_${crypto.randomUUID()}`;
    const now = new Date();

    const signupBonus = data.initialCoins !== undefined
      ? data.initialCoins
      : (settings.enabled && settings.signupBonusEnabled ? settings.signupBonusCoins : 0);

    const customer: Customer = {
      id,
      restaurantId,
      name: data.name.trim() || 'Valued Guest',
      phone: normPhone,
      coinBalance: signupBonus,
      reservedCoins: 0,
      totalCoinsEarned: signupBonus,
      totalCoinsRedeemed: 0,
      totalOrders: 0,
      totalSpent: 0,
      avgOrderValue: 0,
      firstVisit: now,
      lastVisit: now,
      status: 'NEW',
      createdAt: now,
      updatedAt: now
    };

    this.customers.set(id, customer);

    // Record signup bonus transaction if applicable
    if (signupBonus > 0) {
      const txId = `tx_${crypto.randomUUID()}`;
      const tx: CoinTransaction = {
        id: txId,
        restaurantId,
        customerId: id,
        type: 'SIGNUP_BONUS',
        coins: signupBonus,
        reason: 'Welcome Signup Bonus',
        balanceAfter: signupBonus,
        createdAt: now
      };
      this.coinTransactions.set(txId, tx);
    }

    this.recordCrmEvent(restaurantId, 'CUSTOMER_SIGNED_UP', id, undefined, { name: customer.name, phone: customer.phone, signupBonus });

    const prisma = getPrismaClient();
    if (prisma && (prisma as any).customer) {
      (prisma as any).customer.create({
        data: {
          id: customer.id,
          restaurantId: customer.restaurantId,
          name: customer.name,
          phone: customer.phone,
          coinBalance: customer.coinBalance,
          reservedCoins: customer.reservedCoins,
          totalCoinsEarned: customer.totalCoinsEarned,
          totalCoinsRedeemed: customer.totalCoinsRedeemed,
          totalOrders: customer.totalOrders,
          totalSpent: customer.totalSpent,
          avgOrderValue: customer.avgOrderValue,
          firstVisit: customer.firstVisit,
          lastVisit: customer.lastVisit,
          status: customer.status
        }
      }).catch(err => console.error('Prisma createCustomer error:', err));
    }

    return { customer, isNew: true };
  }

  getCustomers(restaurantId: string, filter = 'ALL', search?: string): Customer[] {
    let list: Customer[] = [];
    const now = new Date().getTime();

    for (const c of this.customers.values()) {
      if (c.restaurantId !== restaurantId) continue;

      // Search query
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesPhone = c.phone.includes(q);
        if (!matchesName && !matchesPhone) continue;
      }

      // Dynamic status calculation based on orders and visit recency
      const daysSinceLastVisit = Math.floor((now - new Date(c.lastVisit).getTime()) / (1000 * 60 * 60 * 24));
      let currentStatus: CustomerStatus = c.status;
      if (c.totalOrders === 0 || c.totalOrders === 1) {
        currentStatus = 'NEW';
      } else if (c.totalOrders >= 10 || c.totalSpent >= 8000) {
        currentStatus = 'VIP';
      } else if (daysSinceLastVisit > 60) {
        currentStatus = 'INACTIVE';
      } else if (daysSinceLastVisit > 30) {
        currentStatus = 'AT_RISK';
      } else {
        currentStatus = 'REGULAR';
      }
      c.status = currentStatus;

      const f = filter.toUpperCase();
      if (f === 'ALL') {
        list.push(c);
      } else if (f === 'NEW' && currentStatus === 'NEW') {
        list.push(c);
      } else if (f === 'REGULAR' && currentStatus === 'REGULAR') {
        list.push(c);
      } else if (f === 'VIP' && currentStatus === 'VIP') {
        list.push(c);
      } else if (f === 'AT_RISK' && currentStatus === 'AT_RISK') {
        list.push(c);
      } else if (f === 'INACTIVE' && currentStatus === 'INACTIVE') {
        list.push(c);
      } else if (f === 'RETURNING' && c.totalOrders > 1) {
        list.push(c);
      } else if (f === 'HIGH_SPENDING' && c.totalSpent >= 5000) {
        list.push(c);
      } else if (f === 'HIGH_FREQUENCY' && c.totalOrders >= 8) {
        list.push(c);
      }
    }

    return list.sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
  }

  adjustCustomerCoins(
    restaurantId: string,
    customerId: string,
    coins: number,
    reason: string
  ): { customer: Customer; transaction: CoinTransaction } | null {
    const customer = this.getCustomerById(restaurantId, customerId);
    if (!customer) return null;
    if (coins === 0 || !reason || !reason.trim()) return null;

    if (customer.coinBalance + coins < 0) {
      return null; // Prevent negative balances
    }

    customer.coinBalance += coins;
    if (coins > 0) {
      customer.totalCoinsEarned += coins;
    } else {
      customer.totalCoinsRedeemed += Math.abs(coins);
    }
    customer.updatedAt = new Date();

    const txId = `tx_${crypto.randomUUID()}`;
    const tx: CoinTransaction = {
      id: txId,
      restaurantId,
      customerId,
      type: 'ADMIN_ADJUSTMENT',
      coins,
      reason: reason.trim(),
      balanceAfter: customer.coinBalance,
      createdAt: new Date()
    };
    this.coinTransactions.set(txId, tx);

    const prisma = getPrismaClient();
    if (prisma && (prisma as any).customer) {
      (prisma as any).customer.update({
        where: { id: customerId },
        data: {
          coinBalance: customer.coinBalance,
          totalCoinsEarned: customer.totalCoinsEarned,
          totalCoinsRedeemed: customer.totalCoinsRedeemed
        }
      }).catch(err => console.error('Prisma adjustCustomerCoins error:', err));
    }

    return { customer, transaction: tx };
  }

  getCoinTransactions(
    restaurantId: string,
    customerId?: string
  ): (CoinTransaction & { customerName?: string; customerPhone?: string })[] {
    const list: (CoinTransaction & { customerName?: string; customerPhone?: string })[] = [];
    for (const tx of this.coinTransactions.values()) {
      if (tx.restaurantId !== restaurantId) continue;
      if (customerId && tx.customerId !== customerId) continue;

      const cust = this.customers.get(tx.customerId);
      list.push({
        ...tx,
        customerName: cust?.name || 'Customer',
        customerPhone: cust ? this.maskPhone(cust.phone) : undefined
      });
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  reserveCoinsForOrder(restaurantId: string, customerId: string, coins: number): boolean {
    const customer = this.getCustomerById(restaurantId, customerId);
    if (!customer) return false;
    const usableBalance = customer.coinBalance - customer.reservedCoins;
    if (usableBalance < coins) return false;

    customer.reservedCoins += coins;
    customer.updatedAt = new Date();
    return true;
  }

  releaseCoinsForOrder(restaurantId: string, customerId: string, coins: number): boolean {
    const customer = this.getCustomerById(restaurantId, customerId);
    if (!customer) return false;
    customer.reservedCoins = Math.max(0, customer.reservedCoins - coins);
    customer.updatedAt = new Date();
    return true;
  }

  finalizeCoinsForOrder(
    restaurantId: string,
    orderId: string,
    billDiscount = 0
  ): { redeemed: number; earned: number } | null {
    const order = this.getOrder(restaurantId, orderId);
    if (!order) return null;

    let redeemed = 0;
    let earned = 0;

    const settings = this.getCrmSettings(restaurantId);

    if (order.customerId) {
      const customer = this.getCustomerById(restaurantId, order.customerId);
      if (customer) {
        // Step 1: Permanently deduct reserved coins if any
        if (order.coinsUsed && order.coinsUsed > 0) {
          redeemed = order.coinsUsed;
          customer.reservedCoins = Math.max(0, customer.reservedCoins - redeemed);
          customer.coinBalance = Math.max(0, customer.coinBalance - redeemed);
          customer.totalCoinsRedeemed += redeemed;

          const txId = `tx_${crypto.randomUUID()}`;
          const tx: CoinTransaction = {
            id: txId,
            restaurantId,
            customerId: customer.id,
            type: 'REDEMPTION',
            coins: -redeemed,
            orderId: order.id,
            discount: order.coinDiscount || billDiscount,
            reason: `Redeemed on Order ${order.orderNumber}`,
            balanceAfter: customer.coinBalance,
            createdAt: new Date()
          };
          this.coinTransactions.set(txId, tx);
          this.recordCrmEvent(restaurantId, 'COINS_REDEEMED', customer.id, order.id, { coins: redeemed, discount: order.coinDiscount });
        }

        // Step 2: Award newly earned coins if CRM enabled
        if (settings.enabled) {
          const eligibleAmount = Math.max(0, order.subtotal - (order.coinDiscount || 0));
          const coinsPerAmt = Math.max(1, settings.coinsPerAmount || 10);
          earned = Math.floor(eligibleAmount / coinsPerAmt) * (settings.coinsEarnedPerUnit || 1);

          if (earned > 0) {
            customer.coinBalance += earned;
            customer.totalCoinsEarned += earned;
            order.coinsEarned = earned;

            const txId = `tx_${crypto.randomUUID()}`;
            const tx: CoinTransaction = {
              id: txId,
              restaurantId,
              customerId: customer.id,
              type: 'ORDER_EARN',
              coins: earned,
              orderId: order.id,
              reason: `Earned from Order ${order.orderNumber}`,
              balanceAfter: customer.coinBalance,
              createdAt: new Date()
            };
            this.coinTransactions.set(txId, tx);
            this.recordCrmEvent(restaurantId, 'CUSTOMER_EARNED_REWARD', customer.id, order.id, { coins: earned });
          }
        }

        // Step 3: Update customer stats
        customer.totalOrders += 1;
        customer.totalSpent = Math.round((customer.totalSpent + order.total) * 100) / 100;
        customer.avgOrderValue = Math.round((customer.totalSpent / customer.totalOrders) * 100) / 100;
        customer.lastVisit = new Date();

        if (customer.totalOrders >= 10 || customer.totalSpent >= 8000) {
          if (customer.status !== 'VIP') {
            this.recordCrmEvent(restaurantId, 'CUSTOMER_BECAME_VIP', customer.id);
          }
          customer.status = 'VIP';
        } else if (customer.totalOrders >= 3) {
          customer.status = 'REGULAR';
        }

        customer.updatedAt = new Date();
        this.recordCrmEvent(restaurantId, 'ORDER_COMPLETED', customer.id, order.id, { total: order.total });

        const prisma = getPrismaClient();
        if (prisma && (prisma as any).customer) {
          (prisma as any).customer.update({
            where: { id: customer.id },
            data: {
              coinBalance: customer.coinBalance,
              reservedCoins: customer.reservedCoins,
              totalCoinsEarned: customer.totalCoinsEarned,
              totalCoinsRedeemed: customer.totalCoinsRedeemed,
              totalOrders: customer.totalOrders,
              totalSpent: customer.totalSpent,
              avgOrderValue: customer.avgOrderValue,
              lastVisit: customer.lastVisit,
              status: customer.status
            }
          }).catch(err => console.error('Prisma finalize customer error:', err));
        }
      }
    }

    return { redeemed, earned };
  }

  recordCrmEvent(restaurantId: string, type: CrmEventType, customerId?: string, orderId?: string, data?: any): void {
    this.crmEvents.push({
      id: `evt_${crypto.randomUUID()}`,
      restaurantId,
      type,
      customerId,
      orderId,
      data,
      createdAt: new Date()
    });
  }

  getCrmEvents(restaurantId: string): CrmEvent[] {
    return this.crmEvents
      .filter(e => e.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getCrmOverview(restaurantId: string): any {
    const allCustomers = this.getCustomers(restaurantId, 'ALL');
    const now = new Date().getTime();

    let identifiedCustomers = allCustomers.length;
    let activeCustomers = 0;
    let atRiskCustomers = 0;
    let newCustomersThisWeek = 0;
    let newCustomersThisMonth = 0;
    let returningCustomers = 0;
    let outstandingLiability = 0;

    for (const c of allCustomers) {
      outstandingLiability += c.coinBalance;
      const daysSinceVisit = Math.floor((now - new Date(c.lastVisit).getTime()) / (1000 * 60 * 60 * 24));
      const daysSinceCreated = Math.floor((now - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceVisit <= 30) activeCustomers++;
      else if (daysSinceVisit <= 60) atRiskCustomers++;

      if (daysSinceCreated <= 7) newCustomersThisWeek++;
      if (daysSinceCreated <= 30) newCustomersThisMonth++;

      if (c.totalOrders > 1) returningCustomers++;
    }

    // Anonymous orders (completed orders without customerId)
    const restaurantOrders = this.getOrders(restaurantId).filter(o => o.status === 'COMPLETED');
    const anonymousCustomers = restaurantOrders.filter(o => !o.customerId).length;

    let totalCoinsIssued = 0;
    let totalCoinsRedeemed = 0;
    let totalDiscountGenerated = 0;

    for (const tx of this.coinTransactions.values()) {
      if (tx.restaurantId !== restaurantId) continue;
      if (tx.coins > 0) {
        totalCoinsIssued += tx.coins;
      } else if (tx.coins < 0) {
        totalCoinsRedeemed += Math.abs(tx.coins);
      }
      if (tx.discount) {
        totalDiscountGenerated += tx.discount;
      }
    }

    const repeatCustomerRate = identifiedCustomers > 0
      ? Math.round((returningCustomers / identifiedCustomers) * 100)
      : 0;

    const redemptionRate = totalCoinsIssued > 0
      ? Math.round((totalCoinsRedeemed / totalCoinsIssued) * 100)
      : 0;

    const avgCoinsPerCustomer = identifiedCustomers > 0
      ? Math.round(outstandingLiability / identifiedCustomers)
      : 0;

    return {
      totalCustomers: identifiedCustomers + anonymousCustomers,
      identifiedCustomers,
      anonymousCustomers,
      activeCustomers,
      atRiskCustomers,
      totalCoinsIssued,
      totalCoinsRedeemed,
      outstandingLiability,
      newCustomersThisWeek,
      newCustomersThisMonth,
      returningCustomers,
      repeatCustomerRate,
      redemptionRate,
      totalDiscountGenerated,
      avgCoinsPerCustomer
    };
  }

  // Dynamic Today's Stats
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

  // ==========================================
  // GROWTH ENGINE METHODS
  // ==========================================

  savePosReport(report: PosReport): PosReport {
    this.posReports.set(report.id, report);
    return report;
  }

  getPosReports(restaurantId: string): PosReport[] {
    return Array.from(this.posReports.values())
      .filter(r => r.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  getPosReport(id: string): PosReport | undefined {
    return this.posReports.get(id);
  }

  deletePosReport(id: string): boolean {
    return this.posReports.delete(id);
  }

  setItemCost(restaurantId: string, itemName: string, cost: number) {
    if (!this.itemCostOverrides.has(restaurantId)) {
      this.itemCostOverrides.set(restaurantId, new Map());
    }
    this.itemCostOverrides.get(restaurantId)!.set(itemName.toLowerCase().trim(), cost);
  }

  getItemCosts(restaurantId: string): Record<string, number> {
    const map = this.itemCostOverrides.get(restaurantId);
    if (!map) return {};
    const obj: Record<string, number> = {};
    for (const [k, v] of map.entries()) {
      obj[k] = v;
    }
    return obj;
  }

  setBusinessType(restaurantId: string, type: BusinessType) {
    this.businessTypes.set(restaurantId, type);
  }

  getBusinessType(restaurantId: string): BusinessType {
    return this.businessTypes.get(restaurantId) || 'Café';
  }

  setGrowthDataMode(restaurantId: string, mode: GrowthDataMode, reportId?: string) {
    this.growthDataModes.set(restaurantId, { mode, reportId });
  }

  getGrowthDataMode(restaurantId: string): { mode: GrowthDataMode; reportId?: string } {
    return this.growthDataModes.get(restaurantId) || { mode: 'swaad' };
  }

  toggleRecommendationAction(restaurantId: string, recId: string): boolean {
    if (!this.implementedRecommendations.has(restaurantId)) {
      this.implementedRecommendations.set(restaurantId, new Set());
    }
    const set = this.implementedRecommendations.get(restaurantId)!;
    if (set.has(recId)) {
      set.delete(recId);
      return false;
    } else {
      set.add(recId);
      return true;
    }
  }

  getImplementedRecommendations(restaurantId: string): string[] {
    const set = this.implementedRecommendations.get(restaurantId);
    return set ? Array.from(set) : [];
  }

  // ==========================================
  // SWAADSEVAK AI CRM METHODS
  // ==========================================

  saveAiCampaign(campaign: AiCampaign): AiCampaign {
    this.aiCampaigns.set(campaign.id, campaign);
    return campaign;
  }

  getAiCampaigns(restaurantId: string): AiCampaign[] {
    return Array.from(this.aiCampaigns.values())
      .filter(c => c.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAiCampaignById(restaurantId: string, campaignId: string): AiCampaign | undefined {
    const c = this.aiCampaigns.get(campaignId);
    if (c && c.restaurantId === restaurantId) return c;
    return undefined;
  }

  updateAiCampaign(restaurantId: string, campaignId: string, updates: Partial<AiCampaign>): AiCampaign | null {
    const existing = this.getAiCampaignById(restaurantId, campaignId);
    if (!existing) return null;
    const updated: AiCampaign = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.aiCampaigns.set(campaignId, updated);
    return updated;
  }

  deleteAiCampaign(restaurantId: string, campaignId: string): boolean {
    const existing = this.getAiCampaignById(restaurantId, campaignId);
    if (!existing) return false;
    return this.aiCampaigns.delete(campaignId);
  }

  saveAiAutomation(automation: AiAutomation): AiAutomation {
    this.aiAutomations.set(automation.id, automation);
    return automation;
  }

  getAiAutomations(restaurantId: string): AiAutomation[] {
    return Array.from(this.aiAutomations.values())
      .filter(a => a.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAiAutomationById(restaurantId: string, automationId: string): AiAutomation | undefined {
    const a = this.aiAutomations.get(automationId);
    if (a && a.restaurantId === restaurantId) return a;
    return undefined;
  }

  updateAiAutomation(restaurantId: string, automationId: string, updates: Partial<AiAutomation>): AiAutomation | null {
    const existing = this.getAiAutomationById(restaurantId, automationId);
    if (!existing) return null;
    const updated: AiAutomation = {
      ...existing,
      ...updates
    };
    this.aiAutomations.set(automationId, updated);
    return updated;
  }

  deleteAiAutomation(restaurantId: string, automationId: string): boolean {
    const existing = this.getAiAutomationById(restaurantId, automationId);
    if (!existing) return false;
    return this.aiAutomations.delete(automationId);
  }

  getMarketingChannels(restaurantId: string): { whatsapp: boolean; sms: boolean; email: boolean } {
    return this.marketingChannels.get(restaurantId) || { whatsapp: true, sms: true, email: false };
  }

  setMarketingChannelStatus(restaurantId: string, channel: 'whatsapp' | 'sms' | 'email', connected: boolean) {
    const current = this.getMarketingChannels(restaurantId);
    this.marketingChannels.set(restaurantId, {
      ...current,
      [channel]: connected
    });
  }

  getCustomerMarketingPreferences(restaurantId: string, customerId: string): { sms: boolean; whatsapp: boolean; email: boolean } {
    return this.customerMarketingPreferences.get(customerId) || { sms: true, whatsapp: true, email: true };
  }

  setCustomerMarketingPreferences(restaurantId: string, customerId: string, prefs: { sms?: boolean; whatsapp?: boolean; email?: boolean }) {
    const current = this.getCustomerMarketingPreferences(restaurantId, customerId);
    this.customerMarketingPreferences.set(customerId, {
      ...current,
      ...prefs
    });
  }
}

export const db = new DatabaseStore();
