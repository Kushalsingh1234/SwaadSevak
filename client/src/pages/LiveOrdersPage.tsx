import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Printer,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  Store,
  Sparkles,
  ArrowRight,
  BellRing,
  UtensilsCrossed
} from 'lucide-react';
import { Order, Restaurant, Manager, PrinterConfig, Bill } from '../types';
import { api } from '../services/api';
import { SoundBanner } from '../components/SoundBanner';
import { KotModal } from '../components/KotModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { SettleBillModal } from '../components/SettleBillModal';

interface LiveOrdersPageProps {
  restaurant: Restaurant | null;
  manager: Manager | null;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
  onRefreshOrders: () => void;
  printerConfig?: PrinterConfig;
}

export const LiveOrdersPage: React.FC<LiveOrdersPageProps> = ({
  restaurant,
  manager,
  orders,
  onUpdateOrderStatus,
  onRefreshOrders,
  printerConfig,
}) => {
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKotOrder, setSelectedKotOrder] = useState<Order | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [activeBill, setActiveBill] = useState<Bill | null>(null);
  const [settleOrder, setSettleOrder] = useState<Order | null>(null);

  // Time tracker for elapsed minutes
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedMins = (createdAt: Date | string) => {
    const elapsed = Math.floor((now - new Date(createdAt).getTime()) / 60000);
    return Math.max(0, elapsed);
  };

  const handleSettleBill = async (orderId: string, paymentStatus: 'PAID_UPI' | 'PAID_CASH' | 'PAID_CARD') => {
    try {
      let billId: string | null = null;
      try {
        const billRes = await api.generateBill(orderId);
        if (billRes.success && billRes.bill) {
          billId = billRes.bill.id;
        }
      } catch {}

      if (!billId) {
        const allBills = await api.getBills();
        const existing = allBills.bills?.find((b: any) => b.orderId === orderId);
        billId = existing?.id;
      }

      if (billId) {
        await api.settleBill(billId, paymentStatus);
      }

      await onUpdateOrderStatus(orderId, 'COMPLETED');
      onRefreshOrders();
    } catch (e) {
      console.error('Failed to settle bill:', e);
    }
  };

  const handleOpenKot = async (order: Order) => {
    try {
      await api.getOrderKot(order.id);
      setSelectedKotOrder(order);
    } catch (e) {
      setSelectedKotOrder(order);
    }
  };

  const handleOpenInvoice = async (order: Order) => {
    try {
      const res = await api.getBills();
      if (res.success && res.bills) {
        const match = res.bills.find((b: any) => b.orderId === order.id);
        setActiveBill(match || null);
      }
    } catch {}
    setSelectedInvoiceOrder(order);
  };

  // Filter orders by source and search
  const filteredOrders = orders.filter((order) => {
    const matchesSource = filterSource === 'ALL' || order.source === filterSource;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSource && matchesSearch;
  });

  // 4 Kanban Pipeline Columns
  const pendingOrders = filteredOrders.filter(o => o.status === 'PENDING');
  const cookingOrders = filteredOrders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const readyOrders = filteredOrders.filter(o => o.status === 'READY');
  const diningBillingOrders = filteredOrders.filter(o => o.status === 'COMPLETED' || o.billRequested);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Operations Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Live Kitchen & Order Dispatch (KDS)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-stage orders pipeline • Accept, cook, serve & settle bills
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <SoundBanner pendingCount={pendingOrders.length} />
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Source Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => setFilterSource('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              filterSource === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Channels ({orders.length})
          </button>
          <button
            onClick={() => setFilterSource('DINE_IN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              filterSource === 'DINE_IN'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            Dine-In (Table QR)
          </button>
          <button
            onClick={() => setFilterSource('SWIGGY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              filterSource === 'SWIGGY'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Swiggy
          </button>
          <button
            onClick={() => setFilterSource('ZOMATO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              filterSource === 'ZOMATO'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Zomato
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search table, order #, or dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* 4-COLUMN KITCHEN KANBAN PIPELINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Column 1: Incoming Orders */}
        <div className="flex flex-col bg-slate-100/70 p-3.5 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-950">
                Incoming Orders
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-black">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {pendingOrders.length === 0 ? (
              <div className="text-center py-10 bg-white/60 rounded-2xl border border-dashed border-slate-300">
                <UtensilsCrossed className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-400">No incoming orders</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Orders from table QR codes appear here</p>
              </div>
            ) : (
              pendingOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-sm space-y-3 animate-in zoom-in-95 duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-black text-slate-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {order.tableNumber}
                      </span>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1">
                        {order.orderNumber} • ₹{order.total}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>{getElapsedMins(order.createdAt)}m ago</span>
                      </span>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {order.customerNotes && (
                    <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-xs text-amber-900 font-medium">
                      <span className="font-bold text-amber-800">Chef Note:</span> "{order.customerNotes}"
                    </div>
                  )}

                  {/* Items preview */}
                  <div className="space-y-1 text-xs border-t border-slate-100 pt-2 text-slate-700">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="truncate pr-1">
                          <b className="text-slate-900">{i.quantity}x</b> {i.name}
                        </span>
                        <span className="font-semibold shrink-0">₹{i.price * i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Accept / Reject */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'REJECTED')}
                      className="px-3 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold transition-all"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'ACCEPTED')}
                      className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept & KOT</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Kitchen Cooking */}
        <div className="flex flex-col bg-slate-100/70 p-3.5 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-blue-950">
                Kitchen Cooking
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 text-xs font-black">
              {cookingOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {cookingOrders.length === 0 ? (
              <div className="text-center py-10 bg-white/60 rounded-2xl border border-dashed border-slate-300">
                <Flame className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-400">Kitchen is idle</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Accepted dishes cooking on stove</p>
              </div>
            ) : (
              cookingOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-black text-blue-950 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {order.tableNumber}
                      </span>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1">
                        {order.orderNumber} • ₹{order.total}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      Cooking {getElapsedMins(order.createdAt)}m
                    </span>
                  </div>

                  {/* Itemized List with KOT info */}
                  <div className="space-y-1 text-xs border-t border-slate-100 pt-2 text-slate-700">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="truncate pr-1">
                          <b className="text-slate-900">{i.quantity}x</b> {i.name}
                          {i.portion && <span className="text-slate-400 text-[10px]"> ({i.portion})</span>}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions: Print KOT + Mark Ready */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenKot(order)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Print KOT"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'READY')}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-sm transition-all"
                    >
                      Mark Ready to Serve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready to Serve */}
        <div className="flex flex-col bg-slate-100/70 p-3.5 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-purple-950">
                Ready to Serve
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-xs font-black">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {readyOrders.length === 0 ? (
              <div className="text-center py-10 bg-white/60 rounded-2xl border border-dashed border-slate-300">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-400">No dishes on pickup counter</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Orders ready to deliver to tables</p>
              </div>
            ) : (
              readyOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border-2 border-purple-300 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-black text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                        {order.tableNumber}
                      </span>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1">
                        {order.orderNumber} • ₹{order.total}
                      </p>
                    </div>
                    <span className="text-[11px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      Hot & Ready
                    </span>
                  </div>

                  <p className="text-xs text-purple-900 bg-purple-50 p-2 rounded-xl border border-purple-100 font-semibold">
                    👉 Waitstaff: Deliver {order.items.length} items to {order.tableNumber}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenKot(order)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="Reprint KOT"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSettleOrder(order)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Settle Bill</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Table Active / Settle Bill */}
        <div className="flex flex-col bg-slate-100/70 p-3.5 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950">
                At Table & Settled
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-black">
              {diningBillingOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {diningBillingOrders.length === 0 ? (
              <div className="text-center py-10 bg-white/60 rounded-2xl border border-dashed border-slate-300">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-400">No active bills</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Bills requested and settled orders appear here</p>
              </div>
            ) : (
              diningBillingOrders.map(order => {
                const isSettled = order.status === 'COMPLETED';
                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl p-4 border shadow-sm space-y-3 ${
                      order.billRequested && !isSettled
                        ? 'border-2 border-amber-400 ring-2 ring-amber-200'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                          {order.tableNumber}
                        </span>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1">
                          {order.orderNumber} • ₹{order.total}
                        </p>
                      </div>
                      {order.billRequested && !isSettled ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                          <Receipt className="w-3 h-3" />
                          <span>Bill Requested</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          ✓ Settled
                        </span>
                      )}
                    </div>

                    {/* Action */}
                    {!isSettled ? (
                      <button
                        onClick={() => setSettleOrder(order)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Settle Bill (₹{order.total})</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenInvoice(order)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View / Print Tax Invoice</span>
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
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

      {/* Settle Bill Modal */}
      <SettleBillModal
        order={settleOrder}
        isOpen={Boolean(settleOrder)}
        onClose={() => setSettleOrder(null)}
        onSettle={handleSettleBill}
      />
    </div>
  );
};
