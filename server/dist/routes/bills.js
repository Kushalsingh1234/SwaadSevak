"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_js_1 = require("../db/index.js");
const jwt_js_1 = require("../auth/jwt.js");
const socket_js_1 = require("../realtime/socket.js");
const router = (0, express_1.Router)();
router.use(jwt_js_1.requireAuth);
// Get all bills
router.get('/', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const bills = index_js_1.db.getBills(restaurantId);
    return res.json({ success: true, bills });
});
// Generate bill for an order
router.post('/generate/:orderId', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const orderId = req.params.orderId;
    const bill = index_js_1.db.createBill(restaurantId, orderId);
    if (!bill) {
        return res.status(404).json({ success: false, message: 'Could not generate bill. Order not found.' });
    }
    const order = index_js_1.db.getOrder(restaurantId, orderId);
    if (order) {
        (0, socket_js_1.emitBillGenerated)(restaurantId, order.tableId, bill);
    }
    return res.status(201).json({ success: true, bill });
});
// Settle bill
router.patch('/:id/settle', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const { paymentStatus } = req.body;
    if (!['PAID_CASH', 'PAID_UPI', 'PAID_CARD'].includes(paymentStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }
    const updatedBill = index_js_1.db.settleBill(restaurantId, req.params.id, paymentStatus);
    if (!updatedBill) {
        return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    return res.json({
        success: true,
        message: `Bill settled with ${paymentStatus.replace('PAID_', '')}`,
        bill: updatedBill
    });
});
exports.default = router;
