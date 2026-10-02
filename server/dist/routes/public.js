"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_js_1 = require("../db/index.js");
const socket_js_1 = require("../realtime/socket.js");
const router = (0, express_1.Router)();
// Load Public Restaurant Menu for a Table QR scan
router.get('/menu/:restaurantSlug/:qrToken', (req, res) => {
    const restaurantSlug = req.params.restaurantSlug;
    const qrToken = req.params.qrToken;
    const restaurant = index_js_1.db.getRestaurantBySlug(restaurantSlug);
    if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }
    const table = index_js_1.db.getTableByToken(qrToken);
    if (!table || table.restaurantId !== restaurant.id) {
        return res.status(403).json({
            success: false,
            message: 'Invalid table QR code. Please scan the QR code placed on your dining table.'
        });
    }
    const categories = index_js_1.db.getCategories(restaurant.id);
    const allItems = index_js_1.db.getItems(restaurant.id);
    // Map categories with their items
    const menuData = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        displayOrder: cat.displayOrder,
        items: allItems.filter(item => item.categoryId === cat.id)
    }));
    // Also check if there is an active order for this table
    const orders = index_js_1.db.getOrders(restaurant.id).filter(o => o.tableId === table.id && o.status !== 'COMPLETED' && o.status !== 'REJECTED');
    const activeOrder = orders.length > 0 ? orders[0] : null;
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
        activeOrder
    });
});
// Place customer order from table
router.post('/order', (req, res) => {
    const { restaurantSlug, qrToken, items, customerNotes } = req.body;
    if (!restaurantSlug || !qrToken || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Please select items to place an order.' });
    }
    const restaurant = index_js_1.db.getRestaurantBySlug(restaurantSlug);
    if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }
    const table = index_js_1.db.getTableByToken(qrToken);
    if (!table || table.restaurantId !== restaurant.id) {
        return res.status(403).json({ success: false, message: 'Invalid table token.' });
    }
    // Verify and build verified order items
    let subtotal = 0;
    const verifiedItems = [];
    for (const requestedItem of items) {
        const menuItem = index_js_1.db.getItem(restaurant.id, requestedItem.menuItemId);
        if (!menuItem)
            continue;
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
    // 5% Restaurant GST
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    const order = index_js_1.db.createOrder({
        restaurantId: restaurant.id,
        tableId: table.id,
        tableNumber: table.tableNumber,
        source: 'DINE_IN',
        status: 'PENDING',
        customerNotes: customerNotes ? String(customerNotes).trim() : undefined,
        subtotal,
        tax,
        total,
        items: verifiedItems
    });
    // Assign orderId to items
    for (const item of order.items) {
        item.orderId = order.id;
    }
    // Real-time broadcast to manager dashboard
    (0, socket_js_1.emitNewOrder)(restaurant.id, order);
    return res.status(201).json({
        success: true,
        message: 'Your order has been sent to the kitchen!',
        order
    });
});
// Request Bill from Diner's phone
router.post('/order/:orderId/request-bill', (req, res) => {
    const orderId = req.params.orderId;
    const { restaurantSlug, qrToken } = req.body;
    const restaurant = index_js_1.db.getRestaurantBySlug(restaurantSlug);
    if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }
    const table = index_js_1.db.getTableByToken(qrToken);
    if (!table) {
        return res.status(403).json({ success: false, message: 'Invalid table.' });
    }
    const updatedOrder = index_js_1.db.requestBill(restaurant.id, orderId);
    if (!updatedOrder) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    // Real-time alert to manager
    (0, socket_js_1.emitBillRequested)(restaurant.id, table.id, updatedOrder);
    return res.json({
        success: true,
        message: 'Bill requested! The manager has been notified and will bring your bill.'
    });
});
// Check Order status from Diner's phone
router.get('/order/:orderId/status', (req, res) => {
    const orderId = req.params.orderId;
    let matchedOrder = null;
    for (const ord of index_js_1.db.orders.values()) {
        if (ord.id === orderId) {
            matchedOrder = ord;
            break;
        }
    }
    if (!matchedOrder) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    const bill = index_js_1.db.getBillByOrder(orderId);
    return res.json({
        success: true,
        order: matchedOrder,
        bill: bill || null
    });
});
// View Public Digital Invoice
router.get('/order/:orderId/invoice', (req, res) => {
    const orderId = req.params.orderId;
    let matchedOrder = null;
    for (const ord of index_js_1.db.orders.values()) {
        if (ord.id === orderId) {
            matchedOrder = ord;
            break;
        }
    }
    if (!matchedOrder) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    const restaurant = index_js_1.db.getRestaurant(matchedOrder.restaurantId);
    const bill = index_js_1.db.getBillByOrder(orderId);
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
exports.default = router;
