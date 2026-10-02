"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
exports.getIO = getIO;
exports.emitNewOrder = emitNewOrder;
exports.emitOrderStatus = emitOrderStatus;
exports.emitBillRequested = emitBillRequested;
exports.emitBillGenerated = emitBillGenerated;
exports.emitMenuStockChange = emitMenuStockChange;
const socket_io_1 = require("socket.io");
let ioInstance = null;
function initializeSocket(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
        }
    });
    io.on('connection', (socket) => {
        // Restaurant Manager joins their dedicated room
        socket.on('join_restaurant', (restaurantId) => {
            if (restaurantId) {
                socket.join(`restaurant_${restaurantId}`);
            }
        });
        // Customer table joins their table room
        socket.on('join_table', (data) => {
            if (data?.restaurantId && data?.tableId) {
                socket.join(`table_${data.restaurantId}_${data.tableId}`);
            }
        });
        socket.on('disconnect', () => {
            // Clean disconnect
        });
    });
    ioInstance = io;
    return io;
}
function getIO() {
    if (!ioInstance) {
        throw new Error('Socket.IO is not initialized!');
    }
    return ioInstance;
}
// Socket Emitters
function emitNewOrder(restaurantId, order) {
    if (ioInstance) {
        ioInstance.to(`restaurant_${restaurantId}`).emit('order:new', order);
    }
}
function emitOrderStatus(restaurantId, tableId, order) {
    if (ioInstance) {
        ioInstance.to(`restaurant_${restaurantId}`).emit('order:status_updated', order);
        ioInstance.to(`table_${restaurantId}_${tableId}`).emit('order:status_updated', order);
    }
}
function emitBillRequested(restaurantId, tableId, order) {
    if (ioInstance) {
        ioInstance.to(`restaurant_${restaurantId}`).emit('bill:requested', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            tableNumber: order.tableNumber,
            tableId: order.tableId,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        });
        ioInstance.to(`table_${restaurantId}_${tableId}`).emit('bill:request_acknowledged', {
            orderId: order.id
        });
    }
}
function emitBillGenerated(restaurantId, tableId, bill) {
    if (ioInstance) {
        ioInstance.to(`restaurant_${restaurantId}`).emit('bill:generated', bill);
        ioInstance.to(`table_${restaurantId}_${tableId}`).emit('bill:generated', bill);
    }
}
function emitMenuStockChange(restaurantId, itemId, isAvailable) {
    if (ioInstance) {
        // Broadcast to restaurant dashboard and any customer browsing
        ioInstance.to(`restaurant_${restaurantId}`).emit('menu:stock_updated', { itemId, isAvailable });
        ioInstance.emit(`menu:stock_updated_${restaurantId}`, { itemId, isAvailable });
    }
}
