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
  GrowthDataMode
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

  constructor() {
    this.init();
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
    const restaurants = await prisma.restaurant.findMany({
      include: {
        managers: true,
        categories: true,
        items: true,
        tables: true,
        orders: {
          include: {
            items: true
          }
        },
        bills: true,
        printerConfig: true
      }
    });

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

      for (const c of r.categories) {
        this.categories.set(c.id, {
          id: c.id,
          restaurantId: r.id,
          name: c.name,
          displayOrder: c.displayOrder
        });
      }

      for (const item of r.items) {
        let tags: string[] = [];
        try {
          tags = JSON.parse(item.tags);
        } catch {
          tags = [];
        }
        this.menuItems.set(item.id, {
          id: item.id,
          restaurantId: r.id,
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

      for (const t of r.tables) {
        this.tables.set(t.id, {
          id: t.id,
          restaurantId: r.id,
          tableNumber: t.tableNumber,
          qrToken: t.qrToken,
          status: t.status as any,
          createdAt: t.createdAt
        });
      }

      for (const ord of r.orders) {
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
          restaurantId: r.id,
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

      for (const b of r.bills) {
        const matchingOrder = this.orders.get(b.orderId);
        this.bills.set(b.id, {
          id: b.id,
          restaurantId: r.id,
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

      // Seed initial Petpooja POS Report for seamless demo and combined data experience
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

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.restaurant.create({
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
      }).catch(err => console.error('Prisma createRestaurant error:', err));
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

  createManager(data: Omit<Manager, 'id' | 'createdAt'>): Manager {
    const id = `mgr_${crypto.randomUUID()}`;
    const manager: Manager = {
      ...data,
      id,
      createdAt: new Date()
    };
    this.managers.set(id, manager);

    const prisma = getPrismaClient();
    if (prisma) {
      prisma.manager.create({
        data: {
          id: manager.id,
          restaurantId: manager.restaurantId,
          username: manager.username,
          pinHash: manager.pinHash,
          role: manager.role
        }
      }).catch(err => console.error('Prisma createManager error:', err));
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
          discount: 0,
          grandTotal: order.total,
          paymentStatus: 'PAID_UPI',
          createdAt: new Date(),
          items: order.items
        });
      } else {
        existingBill.paymentStatus = 'PAID_UPI';
      }
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

    const existing = this.getBillByOrder(orderId);
    if (existing) {
      existing.subtotal = order.subtotal;
      existing.tax = order.tax;
      existing.grandTotal = order.total;
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
      discount: 0,
      grandTotal: order.total,
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
          discount: 0,
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
}

export const db = new DatabaseStore();
