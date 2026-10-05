import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { emitNewOrder, emitBillRequested, emitOrderAddition } from '../realtime/socket.js';
import { OrderItem } from '../types/index.js';

const router = Router();

// Load Public Restaurant Menu for a Table QR scan
router.get('/menu/:restaurantSlug/:qrToken', (req: Request, res: Response) => {
  const restaurantSlug = req.params.restaurantSlug as string;
  const qrToken = req.params.qrToken as string;

  const restaurant = db.getRestaurantBySlug(restaurantSlug);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found.' });
  }

  const table = db.getTableByToken(qrToken);
  if (!table || table.restaurantId !== restaurant.id) {
    return res.status(403).json({
      success: false,
      message: 'Invalid table QR code. Please scan the QR code placed on your dining table.'
    });
  }

  const categories = db.getCategories(restaurant.id);
  const allItems = db.getItems(restaurant.id);

  // Map categories with their items
  const menuData = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    displayOrder: cat.displayOrder,
    items: allItems.filter(item => item.categoryId === cat.id)
  }));

  // Also check if there is an active order for this table
  const orders = db.getOrders(restaurant.id).filter(o => o.tableId === table.id && o.status !== 'COMPLETED' && o.status !== 'REJECTED');
  const activeOrder = orders.length > 0 ? orders[0] : null;

  // CRM Config for Diner
  const crmSettings = db.getCrmSettings(restaurant.id);
  const crmConfig = {
    enabled: crmSettings.enabled,
    minOrderValue: crmSettings.minOrderValue,
    coinsPerAmount: crmSettings.coinsPerAmount,
    redemptionCoinsUnit: crmSettings.redemptionCoinsUnit,
    redemptionDiscountUnit: crmSettings.redemptionDiscountUnit,
    maxDiscountPerOrder: crmSettings.maxDiscountPerOrder,
    signupBonusCoins: crmSettings.signupBonusCoins,
    signupBonusEnabled: crmSettings.signupBonusEnabled
  };

  return res.json({
    success: true,
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      restaurantType: restaurant.restaurantType,
      city: restaurant.city,
      address: restaurant.address,
      phone: restaurant.phone
    },
    table: {
      id: table.id,
      tableNumber: table.tableNumber,
      status: table.status
    },
    menu: menuData,
    activeOrder,
    crmConfig
  });
});

// Place customer order from table
router.post('/order', (req: Request, res: Response) => {
  const { restaurantSlug, qrToken, items, customerNotes, customerId, redeemCoins } = req.body;

  if (!restaurantSlug || !qrToken || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Please select items to place an order.' });
  }

  const restaurant = db.getRestaurantBySlug(restaurantSlug);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found.' });
  }

  const table = db.getTableByToken(qrToken);
  if (!table || table.restaurantId !== restaurant.id) {
    return res.status(403).json({ success: false, message: 'Invalid table token.' });
  }

  // Verify and build verified order items
  let subtotal = 0;
  const verifiedItems: OrderItem[] = [];

  for (const requestedItem of items) {
    const menuItem = db.getItem(restaurant.id, requestedItem.menuItemId);
    if (!menuItem) continue;

    if (!menuItem.isAvailable) {
      return res.status(400).json({
        success: false,
        message: `"${menuItem.name}" is currently sold out and out of stock.`
      });
    }

    const qty = Math.max(1, parseInt(requestedItem.quantity, 10) || 1);
    const itemTotal = menuItem.price * qty;
    subtotal += itemTotal;

    verifiedItems.push({
      id: `ord_item_${Math.random().toString(36).substr(2, 9)}`,
      orderId: '', // populated in order creation
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: qty,
      portion: requestedItem.portion || menuItem.portion,
      notes: requestedItem.notes || ''
    });
  }

  if (verifiedItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No valid items found in order.' });
  }

  // Server-side authoritative coin discount calculation (ANTI-ABUSE)
  let coinsUsed = 0;
  let coinDiscount = 0;
  let identifiedCustomer = null;

  if (customerId) {
    const customer = db.getCustomerById(restaurant.id, customerId);
    if (customer) {
      identifiedCustomer = customer;
      if (redeemCoins) {
        const crmSettings = db.getCrmSettings(restaurant.id);
        if (crmSettings.enabled && subtotal >= crmSettings.minOrderValue) {
          const usableCoins = Math.max(0, customer.coinBalance - customer.reservedCoins);
          const coinsUnit = Math.max(1, crmSettings.redemptionCoinsUnit || 100);
          const discountUnit = Math.max(1, crmSettings.redemptionDiscountUnit || 10);
          const affordableUnits = Math.floor(usableCoins / coinsUnit);
          const maxAffordableDiscount = affordableUnits * discountUnit;
          let eligibleDiscount = Math.min(crmSettings.maxDiscountPerOrder, maxAffordableDiscount);

          if (!crmSettings.allowFullDiscount && eligibleDiscount >= subtotal) {
            eligibleDiscount = Math.max(0, subtotal - 1);
          }

          coinDiscount = eligibleDiscount;
          coinsUsed = Math.floor(eligibleDiscount / discountUnit) * coinsUnit;
        }
      }
    }
  }

  // 5% Restaurant GST on net food subtotal
  const netSubtotal = Math.max(0, subtotal - coinDiscount);
  const tax = Math.round(netSubtotal * 0.05 * 100) / 100;
  const total = Math.round((netSubtotal + tax) * 100) / 100;

  // Check if this table already has an active order in progress
  const activeOrder = db.getActiveOrderByTable(restaurant.id, table.id);

  if (activeOrder) {
    // Attach additional items directly to the existing order card
    const additionResult = db.addOrderAddition(restaurant.id, activeOrder.id, {
      customerNotes: customerNotes ? String(customerNotes).trim() : undefined,
      subtotal,
      tax: Math.round(subtotal * 0.05 * 100) / 100,
      total: Math.round((subtotal + (subtotal * 0.05)) * 100) / 100,
      items: verifiedItems
    });

    if (additionResult) {
      // Real-time broadcast to manager dashboard
      emitOrderAddition(restaurant.id, additionResult.order, additionResult.addition);

      return res.status(201).json({
        success: true,
        isAddition: true,
        message: 'New dishes added to your table order! Sent to kitchen.',
        order: additionResult.order,
        addition: additionResult.addition
      });
    }
  }

  // If no existing active order, create a new primary order
  const order = db.createOrder({
    restaurantId: restaurant.id,
    tableId: table.id,
    tableNumber: table.tableNumber,
    source: 'DINE_IN',
    status: 'PENDING',
    customerNotes: customerNotes ? String(customerNotes).trim() : undefined,
    subtotal,
    tax,
    total,
    customerId: identifiedCustomer?.id,
    customerName: identifiedCustomer?.name,
    customerPhone: identifiedCustomer?.phone,
    coinsUsed,
    coinsEarned: 0,
    coinDiscount,
    items: verifiedItems
  });

  // Assign orderId to items
  for (const item of order.items) {
    item.orderId = order.id;
  }

  // Real-time broadcast to manager dashboard
  emitNewOrder(restaurant.id, order);

  return res.status(201).json({
    success: true,
    isAddition: false,
    message: 'Your order has been sent to the kitchen!',
    order,
    discountApplied: coinDiscount,
    coinsReserved: coinsUsed
  });
});

// --- PUBLIC CRM & DISCOUNT COIN ENDPOINTS ---

// 1. Identify customer by mobile number
router.post('/crm/identify', (req: Request, res: Response) => {
  const { restaurantSlug, phone } = req.body;

  if (!restaurantSlug || !phone) {
    return res.status(400).json({ success: false, message: 'Please provide restaurant and phone number.' });
  }

  const restaurant = db.getRestaurantBySlug(restaurantSlug);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found.' });
  }

  const crmSettings = db.getCrmSettings(restaurant.id);
  if (!crmSettings.enabled) {
    return res.json({
      success: true,
      enabled: false,
      message: 'Discount Coins are currently not active at this restaurant.'
    });
  }

  const normPhone = db.normalizePhone(phone);
  if (!normPhone || normPhone.length !== 10) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
  }

  const customer = db.getCustomerByPhone(restaurant.id, normPhone);

  if (customer) {
    return res.json({
      success: true,
      exists: true,
      customer: {
        id: customer.id,
        name: customer.name,
        phoneMasked: db.maskPhone(customer.phone),
        phone: customer.phone,
        coinBalance: customer.coinBalance,
        usableCoins: Math.max(0, customer.coinBalance - customer.reservedCoins),
        status: customer.status
      }
    });
  }

  return res.json({
    success: true,
    exists: false,
    phone: normPhone
  });
});

// 2. Pre-order or in-flow customer signup
router.post('/crm/signup', (req: Request, res: Response) => {
  const { restaurantSlug, name, phone } = req.body;

  if (!restaurantSlug || !phone || !name) {
    return res.status(400).json({ success: false, message: 'Name and mobile number are required.' });
  }

  const restaurant = db.getRestaurantBySlug(restaurantSlug);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found.' });
  }

  const normPhone = db.normalizePhone(phone);
  if (!normPhone || normPhone.length !== 10) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
  }

  const crmSettings = db.getCrmSettings(restaurant.id);
  const result = db.createCustomer(restaurant.id, {
    name: name.trim(),
    phone: normPhone
  });

  const bonusCoins = result.isNew && crmSettings.enabled && crmSettings.signupBonusEnabled
    ? crmSettings.signupBonusCoins
    : 0;

  return res.status(result.isNew ? 201 : 200).json({
    success: true,
    isNew: result.isNew,
    customer: {
      id: result.customer.id,
      name: result.customer.name,
      phoneMasked: db.maskPhone(result.customer.phone),
      phone: result.customer.phone,
      coinBalance: result.customer.coinBalance,
      usableCoins: Math.max(0, result.customer.coinBalance - result.customer.reservedCoins),
      status: result.customer.status
    },
    bonusAwarded: bonusCoins
  });
});

// 3. Authoritative real-time discount calculation for cart
router.post('/crm/calculate-discount', (req: Request, res: Response) => {
  const { restaurantSlug, customerId, subtotal, orderSubtotal } = req.body;
  const rawSubtotal = subtotal !== undefined ? subtotal : orderSubtotal;

  if (!restaurantSlug || !customerId) {
    return res.status(400).json({ success: false, message: 'Missing parameters.' });
  }

  const restaurant = db.getRestaurantBySlug(restaurantSlug);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found.' });
  }

  const customer = db.getCustomerById(restaurant.id, customerId);
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found.' });
  }

  const crmSettings = db.getCrmSettings(restaurant.id);
  const cartSubtotal = Number(rawSubtotal) || 0;

  if (!crmSettings.enabled) {
    return res.json({
      success: true,
      eligible: false,
      reason: 'Loyalty system is inactive.'
    });
  }

  const usableCoins = Math.max(0, customer.coinBalance - customer.reservedCoins);
  const coinsUnit = Math.max(1, crmSettings.redemptionCoinsUnit || 100);
  const discountUnit = Math.max(1, crmSettings.redemptionDiscountUnit || 10);
  const affordableUnits = Math.floor(usableCoins / coinsUnit);
  const maxAffordableDiscount = affordableUnits * discountUnit;
  let eligibleDiscount = Math.min(crmSettings.maxDiscountPerOrder, maxAffordableDiscount);

  if (!crmSettings.allowFullDiscount && eligibleDiscount >= cartSubtotal) {
    eligibleDiscount = Math.max(0, cartSubtotal - 1);
  }

  const coinsToRedeem = Math.floor(eligibleDiscount / discountUnit) * coinsUnit;
  const isEligible = cartSubtotal >= crmSettings.minOrderValue && eligibleDiscount > 0;

  return res.json({
    success: true,
    eligible: isEligible,
    minOrderValue: crmSettings.minOrderValue,
    currentSubtotal: cartSubtotal,
    usableCoins,
    eligibleDiscount: isEligible ? eligibleDiscount : 0,
    coinsToRedeem: isEligible ? coinsToRedeem : 0,
    conversionText: `${coinsUnit} coins = ₹${discountUnit} discount`,
    maxDiscountPerOrder: crmSettings.maxDiscountPerOrder
  });
});

// 4. Post-order bonus claim for guests
router.post('/crm/post-order-claim', (req: Request, res: Response) => {
  const { restaurantSlug, orderId, name, phone } = req.body;

  if (!restaurantSlug || !name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and mobile number are required.' });
  }

  const restaurant = db.getRestaurantBySlug(restaurantSlug);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found.' });
  }

  const normPhone = db.normalizePhone(phone);
  if (!normPhone || normPhone.length !== 10) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
  }

  const crmSettings = db.getCrmSettings(restaurant.id);
  const result = db.createCustomer(restaurant.id, {
    name: name.trim(),
    phone: normPhone
  });

  // Link order if provided
  if (orderId) {
    const order = db.getOrder(restaurant.id, orderId);
    if (order && !order.customerId) {
      order.customerId = result.customer.id;
      order.customerName = result.customer.name;
      order.customerPhone = result.customer.phone;
    }
  }

  const bonusCoins = result.isNew && crmSettings.enabled && crmSettings.signupBonusEnabled
    ? crmSettings.signupBonusCoins
    : 0;

  return res.json({
    success: true,
    isNew: result.isNew,
    customer: {
      id: result.customer.id,
      name: result.customer.name,
      phoneMasked: db.maskPhone(result.customer.phone),
      coinBalance: result.customer.coinBalance,
      usableCoins: Math.max(0, result.customer.coinBalance - result.customer.reservedCoins)
    },
    bonusAwarded: bonusCoins,
    message: result.isNew
      ? `Welcome to SwaadSevak Rewards! ${bonusCoins} Bonus Coins have been added to your profile.`
      : `Welcome back! You already have ${result.customer.coinBalance} Discount Coins.`
  });
});

// Request Bill from Diner's phone
router.post('/order/:orderId/request-bill', (req: Request, res: Response) => {
  const orderId = req.params.orderId as string;
  const { restaurantSlug, qrToken } = req.body;

  const restaurant = db.getRestaurantBySlug(restaurantSlug);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found.' });
  }

  const table = db.getTableByToken(qrToken);
  if (!table) {
    return res.status(403).json({ success: false, message: 'Invalid table.' });
  }

  const updatedOrder = db.requestBill(restaurant.id, orderId);
  if (!updatedOrder) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Real-time alert to manager
  emitBillRequested(restaurant.id, table.id, updatedOrder);

  return res.json({
    success: true,
    message: 'Bill requested! The manager has been notified and will bring your bill.'
  });
});

// Check Order status from Diner's phone
router.get('/order/:orderId/status', (req: Request, res: Response) => {
  const orderId = req.params.orderId as string;
  let matchedOrder = null;

  for (const ord of db.orders.values()) {
    if (ord.id === orderId) {
      matchedOrder = ord;
      break;
    }
  }

  if (!matchedOrder) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const bill = db.getBillByOrder(orderId);

  return res.json({
    success: true,
    order: matchedOrder,
    bill: bill || null
  });
});

// View Public Digital Invoice
router.get('/order/:orderId/invoice', (req: Request, res: Response) => {
  const orderId = req.params.orderId as string;
  let matchedOrder = null;

  for (const ord of db.orders.values()) {
    if (ord.id === orderId) {
      matchedOrder = ord;
      break;
    }
  }

  if (!matchedOrder) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const restaurant = db.getRestaurant(matchedOrder.restaurantId);
  const bill = db.getBillByOrder(orderId);

  return res.json({
    success: true,
    invoice: {
      restaurant: {
        name: restaurant?.name,
        address: restaurant?.address,
        city: restaurant?.city,
        state: restaurant?.state,
        phone: restaurant?.phone,
        gstNumber: restaurant?.gstNumber
      },
      orderNumber: matchedOrder.orderNumber,
      billNumber: bill?.billNumber || `INV-${matchedOrder.orderNumber.replace('#', '')}`,
      tableNumber: matchedOrder.tableNumber,
      date: new Date(matchedOrder.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: new Date(matchedOrder.createdAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      items: matchedOrder.items,
      subtotal: matchedOrder.subtotal,
      tax: matchedOrder.tax,
      discount: bill?.discount || 0,
      grandTotal: bill?.grandTotal || matchedOrder.total,
      paymentStatus: bill?.paymentStatus || 'UNPAID',
      branding: 'Powered by Swaad Sevak'
    }
  });
});

export default router;
