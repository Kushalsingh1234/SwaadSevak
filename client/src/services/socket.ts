import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE ? import.meta.env.VITE_API_BASE.replace('/api', '') : 'http://localhost:5000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
  }
  return socket;
}

export function joinRestaurantRoom(restaurantId: string): void {
  const s = getSocket();
  s.emit('join_restaurant', restaurantId);
}

export function joinTableRoom(restaurantId: string, tableId: string): void {
  const s = getSocket();
  s.emit('join_table', { restaurantId, tableId });
}
