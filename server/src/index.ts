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
import analyticsRoutes from './routes/analytics.js';
import aggregatorsRoutes from './routes/aggregators.js';
import webhooksRoutes from './routes/webhooks.js';
import growthRoutes from './routes/growthEngine.js';
import crmRoutes from './routes/crm.js';
import aiCrmRoutes from './routes/aiCrm.js';
import whatsappRoutes from './routes/whatsapp.js';
import { CampaignScheduler } from './services/campaignScheduler.js';
import { WhatsAppService } from './services/whatsappService.js';
import { initializeSocket } from './realtime/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

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
app.use('/api/analytics', analyticsRoutes);
app.use('/api/aggregators', aggregatorsRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/crm/ai', aiCrmRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Health check endpoints (for uptime monitors like cron-job.org / UptimeRobot and pre-warming)
const handleHealth = (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    service: 'Swaad Sevak API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};
app.get('/health', handleHealth);
app.get('/api/health', handleHealth);

// Start Automated CRM Campaign Scheduler & Resume WhatsApp Sessions
const AUTOMATION_INTERVAL_MS = 60 * 1000; // 1 minute (for on-time execution of scheduled campaigns)
setTimeout(() => {
  // Auto-resume existing paired WhatsApp connections
  WhatsAppService.autoResumeAllSessions().catch(err => {
    console.error('[WhatsApp] Startup auto-resume error:', err);
  });

  CampaignScheduler.processAutomations().catch(err => {
    console.error('[Scheduler] Initial automation tick error:', err);
  });
  setInterval(() => {
    CampaignScheduler.processAutomations().catch(err => {
      console.error('[Scheduler] Periodic automation tick error:', err);
    });
  }, AUTOMATION_INTERVAL_MS);
}, 5000); // 5s after startup to ensure DB is initialized

server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  SWAAD SEVAK - RESTAURANT OS BACKEND    `);
  console.log(`  Running on: http://localhost:${PORT}      `);
  console.log(`  Socket.IO: Ready for real-time orders  `);
  console.log(`  WhatsApp Engine: Multi-tenant ready    `);
  console.log(`=========================================`);
});

