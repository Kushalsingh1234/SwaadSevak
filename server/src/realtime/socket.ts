import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Order, Bill } from '../types/index.js';

let ioInstance: SocketIOServer | null = null;

export function initializeSocket(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket: Socket) => {
    // Restaurant Manager joins their dedicated room
    socket.on('join_restaurant', (restaurantId: string) => {
      if (restaurantId) {
        socket.join(`restaurant_${restaurantId}`);
      }
    });

    // Customer table joins their table room
    socket.on('join_table', (data: { restaurantId: string; tableId: string }) => {
      if (data?.restaurantId && data?.tableId) {
        socket.join(`table_${data.restaurantId}_${data.tableId}`);
      }
    });

    // Customer joins their customer room for real-time loyalty balance updates
    socket.on('join_customer', (data: { restaurantId?: string; customerId: string }) => {
      if (data?.customerId) {
        socket.join(`customer_${data.customerId}`);
      }
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  ioInstance = io;
  return io;
}

export function getIO(): SocketIOServer {
  if (!ioInstance) {
    throw new Error('Socket.IO is not initialized!');
  }
  return ioInstance;
}

// Socket Emitters
export function emitNewOrder(restaurantId: string, order: Order) {
  if (ioInstance) {
    ioInstance.to(`restaurant_${restaurantId}`).emit('order:new', order);
    ioInstance.emit(`order:new_${restaurantId}`, order);
  }
}

export function emitOrderStatus(restaurantId: string, tableId: string, order: Order) {
  if (ioInstance) {
    ioInstance.to(`restaurant_${restaurantId}`).emit('order:status_updated', order);
    ioInstance.to(`table_${restaurantId}_${tableId}`).emit('order:status_updated', order);
    ioInstance.emit(`order:status_updated_${restaurantId}`, order);
  }
}

export function emitOrderAddition(restaurantId: string, order: Order, addition: any) {
  if (ioInstance) {
    ioInstance.to(`restaurant_${restaurantId}`).emit('order:addition_added', { order, addition });
    ioInstance.emit(`order:addition_added_${restaurantId}`, { order, addition });
    ioInstance.to(`table_${restaurantId}_${order.tableId}`).emit('order:status_updated', order);
  }
}

export function emitBillRequested(restaurantId: string, tableId: string, order: Order) {
  if (ioInstance) {
    const payload = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      tableNumber: order.tableNumber,
      tableId: order.tableId,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    ioInstance.to(`restaurant_${restaurantId}`).emit('bill:requested', payload);
    ioInstance.emit(`bill:requested_${restaurantId}`, payload);
    ioInstance.to(`table_${restaurantId}_${tableId}`).emit('bill:request_acknowledged', {
      orderId: order.id
    });
  }
}

export function emitBillGenerated(restaurantId: string, tableId: string, bill: Bill) {
  if (ioInstance) {
    ioInstance.to(`restaurant_${restaurantId}`).emit('bill:generated', bill);
    ioInstance.to(`table_${restaurantId}_${tableId}`).emit('bill:generated', bill);
    ioInstance.emit(`bill:generated_${restaurantId}`, bill);
  }
}

export function emitMenuStockChange(restaurantId: string, itemId: string, isAvailable: boolean) {
  if (ioInstance) {
    // Broadcast to restaurant dashboard and any customer browsing
    ioInstance.to(`restaurant_${restaurantId}`).emit('menu:stock_updated', { itemId, isAvailable });
    ioInstance.emit(`menu:stock_updated_${restaurantId}`, { itemId, isAvailable });
  }
}

export function emitCustomerCoinsUpdated(restaurantId: string, customer: any) {
  if (ioInstance && customer) {
    const payload = {
      customerId: customer.id,
      coinBalance: customer.coinBalance,
      reservedCoins: customer.reservedCoins || 0,
      usableCoins: Math.max(0, customer.coinBalance - (customer.reservedCoins || 0)),
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        coinBalance: customer.coinBalance,
        reservedCoins: customer.reservedCoins || 0,
        usableCoins: Math.max(0, customer.coinBalance - (customer.reservedCoins || 0)),
        status: customer.status,
        totalCoinsEarned: customer.totalCoinsEarned,
        totalCoinsRedeemed: customer.totalCoinsRedeemed
      }
    };
    ioInstance.to(`customer_${customer.id}`).emit('customer:coins_updated', payload);
    ioInstance.emit(`customer:coins_updated_${customer.id}`, payload);
    ioInstance.to(`restaurant_${restaurantId}`).emit('customer:coins_updated', payload);
  }
}
