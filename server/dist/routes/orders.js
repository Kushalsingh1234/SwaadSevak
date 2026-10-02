"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_js_1 = require("../db/index.js");
const jwt_js_1 = require("../auth/jwt.js");
const socket_js_1 = require("../realtime/socket.js");
const printerService_js_1 = require("../printing/printerService.js");
const router = (0, express_1.Router)();
router.use(jwt_js_1.requireAuth);
// Get all orders for restaurant
router.get('/', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const { status, source } = req.query;
    let orders = index_js_1.db.getOrders(restaurantId);
    if (status && typeof status === 'string') {
        orders = orders.filter(o => o.status === status);
    }
    if (source && typeof source === 'string') {
        orders = orders.filter(o => o.source === source);
    }
    return res.json({ success: true, orders });
});
// Update order status (Accept, Reject, Preparing, Ready, Completed)
router.patch('/:id/status', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const { status } = req.body;
    const validStatuses = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'REJECTED'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid order status specified.' });
    }
    const updatedOrder = index_js_1.db.updateOrderStatus(restaurantId, req.params.id, status);
    if (!updatedOrder) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    // Real-time broadcast to manager and table
    (0, socket_js_1.emitOrderStatus)(restaurantId, updatedOrder.tableId, updatedOrder);
    // If order was accepted and KOT generated, also return KOT payload
    let kotData = null;
    let thermalText = null;
    if (status === 'ACCEPTED' || updatedOrder.kotGenerated) {
        const restaurant = index_js_1.db.getRestaurant(restaurantId);
        const printerConfig = index_js_1.db.getPrinterConfig(restaurantId);
        if (restaurant) {
            kotData = printerService_js_1.PrinterService.generateKotData(restaurant, updatedOrder, printerConfig);
            thermalText = printerService_js_1.PrinterService.generateThermalText(kotData);
        }
    }
    return res.json({
        success: true,
        message: `Order marked as ${status}`,
        order: updatedOrder,
        kotData,
        thermalText
    });
});
// Get KOT for printing
router.get('/:id/kot', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const order = index_js_1.db.getOrder(restaurantId, req.params.id);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    const restaurant = index_js_1.db.getRestaurant(restaurantId);
    const printerConfig = index_js_1.db.getPrinterConfig(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant details missing.' });
    }
    const kotData = printerService_js_1.PrinterService.generateKotData(restaurant, order, printerConfig);
    const thermalText = printerService_js_1.PrinterService.generateThermalText(kotData);
    return res.json({
        success: true,
        kotData,
        thermalText,
        printerConfig
    });
});
exports.default = router;
