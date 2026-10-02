import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Printer,
  ChevronRight,
  Filter,
  Check,
  X,
  ExternalLink,
  Flame,
  Store,
  Receipt,
  BellRing
} from 'lucide-react';
import { Order, Restaurant, Manager, PrinterConfig, Bill } from '../types';
import { api } from '../services/api';
import { SoundBanner } from '../components/SoundBanner';
import { KotModal } from '../components/KotModal';
import { InvoiceModal } from '../components/InvoiceModal';

interface DashboardOverviewPageProps {
  restaurant: Restaurant | null;
  manager: Manager | null;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
  onRefreshOrders: () => void;
  printerConfig?: PrinterConfig;
  onOpenLiveDinerDemo: () => void;
}

export const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({
  restaurant,
  manager,
  orders,
  onUpdateOrderStatus,
  onRefreshOrders,
  printerConfig,
  onOpenLiveDinerDemo,
}) => {
  const [stats, setStats] = useState<any>({
    todaySales: 0,
    totalOrders: 0,
    pendingCount: 0,
    completedCount: 0,
    onlineOrders: { swiggy: { count: 0, sales: 0 }, zomato: { count: 0, sales: 0 } }
  });

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedKotOrder, setSelectedKotOrder] = useState<Order | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [activeBill, setActiveBill] = useState<Bill | null>(null);

  // Fetch dynamic stats
  useEffect(() => {
    loadStats();
  }, [orders]);

  const loadStats = async () => {
    try {
      const res = await api.getTodayStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
  };

  // Filter orders
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const preparingOrders = orders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const handleOpenKot = (order: Order) => {
    setSelectedKotOrder(order);
  };

  const handleOpenInvoice = async (order: Order) => {
    setSelectedInvoiceOrder(order);
    try {
      const billsRes = await api.getBills();
      if (billsRes.success) {
        const found = billsRes.bills.find((b: Bill) => b.orderId === order.id);
        setActiveBill(found || null);
      }
    } catch {}
  };

  const handleGenerateBill = async (order: Order) => {
    try {
      const res = await api.generateBill(order.id);
      if (res.success) {
        setActiveBill(res.bill);
        setSelectedInvoiceOrder(order);
        onRefreshOrders();
      }
    } catch (e) {
      console.error('Bill generation error:', e);
    }
  };

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Top Banner: Greeting, Live Stats & Sound Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {greeting}, {manager?.username || 'Manager'} 👋
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {restaurant?.name} • Live Dine-in & Kitchen Operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SoundBanner pendingCount={pendingOrders.length} />
          <button
            onClick={onOpenLiveDinerDemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Table 01 Menu</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards (Section 26 & 28) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Sales</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            ₹{stats.todaySales?.toLocaleString('en-IN') || '0'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Calculated from completed dine-in orders
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {stats.totalOrders || orders.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {orders.length} active sessions today
          </p>
        </div>

        {/* Pending Orders */}
        <div className={`p-5 rounded-2xl border shadow-card transition-all ${
          pendingOrders.length > 0
            ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
              {pendingOrders.length > 0 ? (
                <BellRing className="w-4 h-4 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-2">
            {pendingOrders.length}
          </div>
          <p className="text-[11px] text-amber-700/80 mt-1 font-medium">
            {pendingOrders.length > 0 ? 'Requires immediate action' : 'All orders accepted'}
          </p>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {completedOrders.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Served & settled bills
          </p>
        </div>
      </div>

      {/* Online Orders Integration Ready Section (Section 29) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Omnichannel Orders Overview
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
              Architecture Ready
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Unified view: Dine-In, Swiggy, Zomato
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-orange-950">Dine-In (Swaad Sevak QR)</span>
              <p className="text-[11px] text-orange-800">{orders.filter(o => o.source === 'DINE_IN').length} Orders</p>
            </div>
            <div className="text-right font-extrabold text-sm text-orange-900">
              0% Commission
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between opacity-80">
            <div>
              <span className="text-xs font-bold text-slate-800">Swiggy</span>
              <p className="text-[11px] text-slate-500">Integration Gateway Ready</p>
            </div>
            <div className="text-right text-xs font-semibold text-slate-500">
              Webhooks Configured
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between opacity-80">
            <div>
              <span className="text-xs font-bold text-slate-800">Zomato</span>
              <p className="text-[11px] text-slate-500">Integration Gateway Ready</p>
            </div>
            <div className="text-right text-xs font-semibold text-slate-500">
              Webhooks Configured
            </div>
          </div>
        </div>
      </div>

      {/* Bill Requested Notifications (Section 23) */}
      {orders.filter(o => o.billRequested && o.status !== 'COMPLETED').map((order) => (
        <div
          key={`bill_req_${order.id}`}
          className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-purple-950">
                Bill Requested — {order.tableNumber}
              </h4>
              <p className="text-xs text-purple-800">
                Order {order.orderNumber} • Total: ₹{order.total.toFixed(2)} ({order.items.length} items)
              </p>
            </div>
          </div>

          <button
            onClick={() => handleGenerateBill(order)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Generate & Settle Bill</span>
          </button>
        </div>
      ))}

      {/* Live Orders Section (Section 27) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span>Live Restaurant Orders</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time synchronization across kitchen and dining tables
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            {['ALL', 'PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === status
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'ALL' ? 'All Orders' : status}
                {status === 'PENDING' && pendingOrders.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[10px] font-bold">
                    {pendingOrders.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <UtensilsIcon className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No active orders yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              New customer orders from table QR codes will appear here instantly with sound alert.
            </p>
            <button
              onClick={onOpenLiveDinerDemo}
              className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sm hover:bg-orange-700"
            >
              Simulate First Order (Table 01)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const isPending = order.status === 'PENDING';
              const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                    isPending
                      ? 'bg-amber-50/40 border-amber-300 shadow-md ring-2 ring-amber-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-card'
                  }`}
                >
                  {/* Card Header */}
                  <div className={`p-4 border-b flex items-center justify-between ${
                    isPending ? 'bg-amber-100/50 border-amber-200' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{order.tableNumber}</span>
                        <span className="text-xs text-slate-500 font-mono">{order.orderNumber}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{orderTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        order.status === 'PENDING'
                          ? 'bg-amber-500 text-white animate-pulse'
                          : order.status === 'ACCEPTED' || order.status === 'PREPARING'
                          ? 'bg-blue-600 text-white'
                          : order.status === 'READY'
                          ? 'bg-purple-600 text-white'
                          : order.status === 'COMPLETED'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="p-4 flex-1 space-y-2 text-xs">
                    <div className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-900">{item.quantity}x</span>{' '}
                            <span className="text-slate-800">{item.name}</span>
                            {item.portion && (
                              <span className="text-[10px] text-slate-400 ml-1">({item.portion})</span>
                            )}
                            {item.notes && (
                              <p className="text-[10px] text-amber-700 italic pl-4">* {item.notes}</p>
                            )}
                          </div>
                          <span className="text-slate-600 font-semibold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {order.customerNotes && (
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                        <strong className="text-slate-800">Note:</strong> {order.customerNotes}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom / Total & Actions */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Order Total</span>
                      <span className="text-base font-extrabold text-slate-900">₹{order.total.toFixed(2)}</span>
                    </div>

                    {/* Action Buttons based on status */}
                    <div className="flex gap-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'ACCEPTED')}
                            className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'REJECTED')}
                            className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {(order.status === 'ACCEPTED' || order.status === 'PREPARING') && (
                        <>
                          <button
                            onClick={() => handleOpenKot(order)}
                            className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
                            title="View / Print KOT"
                          >
                            <Printer className="w-3.5 h-3.5 text-orange-600" />
                            <span>KOT</span>
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'READY')}
                            className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all"
                          >
                            Mark Ready to Serve
                          </button>
                        </>
                      )}

                      {order.status === 'READY' && (
                        <>
                          <button
                            onClick={() => handleOpenKot(order)}
                            className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'COMPLETED')}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                          >
                            Mark Served / Settled
                          </button>
                        </>
                      )}

                      {order.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleOpenInvoice(order)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>View Tax Invoice</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* KOT Modal */}
      <KotModal
        order={selectedKotOrder}
        restaurant={restaurant}
        printerConfig={printerConfig}
        isOpen={Boolean(selectedKotOrder)}
        onClose={() => setSelectedKotOrder(null)}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        bill={activeBill}
        restaurant={restaurant}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
};

function UtensilsIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}
