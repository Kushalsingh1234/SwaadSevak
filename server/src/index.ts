import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import tablesRoutes from './routes/tables.js';
import ordersRoutes from './routes/orders.js';
import billsRoutes from './routes/bills.js';
import printerRoutes from './routes/printer.js';
import statsRoutes from './routes/stats.js';
import publicRoutes from './routes/public.js';
import { initializeSocket } from './realtime/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Enable CORS for client
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Realtime Socket.IO
initializeSocket(server);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/bills', billsRoutes);
app.use('/api/printer', printerRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/public', publicRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Swaad Sevak API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  SWAAD SEVAK - RESTAURANT OS BACKEND    `);
  console.log(`  Running on: http://localhost:${PORT}      `);
  console.log(`  Socket.IO: Ready for real-time orders  `);
  console.log(`=========================================`);
});
