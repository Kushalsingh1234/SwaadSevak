"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const menu_js_1 = __importDefault(require("./routes/menu.js"));
const tables_js_1 = __importDefault(require("./routes/tables.js"));
const orders_js_1 = __importDefault(require("./routes/orders.js"));
const bills_js_1 = __importDefault(require("./routes/bills.js"));
const printer_js_1 = __importDefault(require("./routes/printer.js"));
const stats_js_1 = __importDefault(require("./routes/stats.js"));
const public_js_1 = __importDefault(require("./routes/public.js"));
const socket_js_1 = require("./realtime/socket.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 5000;
// Enable CORS for client
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Initialize Realtime Socket.IO
(0, socket_js_1.initializeSocket)(server);
// API Routes
app.use('/api/auth', auth_js_1.default);
app.use('/api/menu', menu_js_1.default);
app.use('/api/tables', tables_js_1.default);
app.use('/api/orders', orders_js_1.default);
app.use('/api/bills', bills_js_1.default);
app.use('/api/printer', printer_js_1.default);
app.use('/api/stats', stats_js_1.default);
app.use('/api/public', public_js_1.default);
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
