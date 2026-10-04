import React, { useState, useEffect } from 'react';
import {
  Printer,
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  Flame,
  ChefHat,
  UtensilsCrossed,
  Check,
  X,
  Volume2,
  ArrowRight,
  TrendingUp,
  PanelRightClose,
  PanelRightOpen,
  AlertTriangle,
  FileText,
  Bell,
  Sparkles
} from 'lucide-react';
import { Order, Restaurant, Manager, PrinterConfig, Bill } from '../types';
import { api } from '../services/api';
import { getSocket } from '../services/socket';
import { soundManager } from '../utils/sound';
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

interface AdditionToast {
  id: string;
  orderId: string;
  additionId: string;
  tableNumber: string;
  additionNumber: string;
  itemSummary: string;
  total: number;
  time: string;
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
  const [processingAdditionId, setProcessingAdditionId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<AdditionToast[]>([]);

  // Completed / Settled Orders Right Drawer
  const [isSettledDrawerOpen, setIsSettledDrawerOpen] = useState(false);
  const [settledSearchQuery, setSettledSearchQuery] = useState('');

  // Elapsed time tracker (refreshes every 30s)
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedMins = (createdAt: Date | string) => {
    const elapsed = Math.floor((now - new Date(createdAt).getTime()) / 60000);
    return Math.max(0, elapsed);
  };

  // Real-time socket listener for table add-on alerts
  useEffect(() => {
    if (!restaurant?.id) return;
    const socket = getSocket();

    const handleAddition = (data: { order: Order; addition: any }) => {
      const { order, addition } = data;
      const itemSummary = addition.items?.map((i: any) => `${i.quantity}× ${i.name}`).join(', ') || 'Additional items';
      const newToast: AdditionToast = {
        id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        orderId: order.id,
        additionId: addition.id,
        tableNumber: order.tableNumber || 'Counter',
        additionNumber: addition.additionNumber || 'New Table Add-on',
        itemSummary,
        total: addition.total,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setToasts(prev => [newToast, ...prev.slice(0, 3)]);
    };

    socket.on('order:addition_added', handleAddition);
    socket.on(`order:addition_added_${restaurant.id}`, handleAddition);

    return () => {
      socket.off('order:addition_added', handleAddition);
      socket.off(`order:addition_added_${restaurant.id}`, handleAddition);
    };
  }, [restaurant?.id]);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAcceptAddition = async (orderId: string, additionId: string) => {
    try {
      setProcessingAdditionId(additionId);
      const res = await api.acceptOrderAddition(orderId, additionId);
      if (res.success) {
        soundManager.playTing(880, 0.4);
        onRefreshOrders();
      }
    } catch (e) {
      console.error('Failed to accept addition:', e);
    } finally {
      setProcessingAdditionId(null);
    }
  };

  const handleRejectAddition = async (orderId: string, additionId: string) => {
    try {
      setProcessingAdditionId(additionId);
      const res = await api.rejectOrderAddition(orderId, additionId, 'Item unavailable at the moment');
      if (res.success) {
        onRefreshOrders();
      }
    } catch (e) {
      console.error('Failed to reject addition:', e);
    } finally {
      setProcessingAdditionId(null);
    }
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
    } catch {
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
      order.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.additions && order.additions.some(a => a.items.some(ai => ai.name.toLowerCase().includes(searchQuery.toLowerCase()))));
    return matchesSource && matchesSearch;
  });

  // Pipeline Stages (Decoupled: PENDING -> PREPARING -> READY -> SERVED -> COMPLETED)
  const pendingOrders = filteredOrders.filter(o => o.status === 'PENDING');
  const preparingOrders = filteredOrders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const readyOrders = filteredOrders.filter(o => o.status === 'READY');
  const servedOrders = filteredOrders.filter(o => o.status === 'SERVED');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');

  // Count pending additions waiting for confirmation across live orders
  const pendingAdditionsCount = filteredOrders.reduce((sum, o) => {
    return sum + (o.additions?.filter(a => a.status === 'PENDING').length || 0);
  }, 0);

  // Completed drawer search
  const filteredCompletedOrders = completedOrders.filter(o =>
    o.orderNumber.toLowerCase().includes(settledSearchQuery.toLowerCase()) ||
    o.tableNumber.toLowerCase().includes(settledSearchQuery.toLowerCase()) ||
    o.items.some(i => i.name.toLowerCase().includes(settledSearchQuery.toLowerCase()))
  );

  // Today's Sales Calculation
  const todaySales = completedOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);

  // 4 Live Kitchen & Floor Stages
  const liveColumns = [
    {
      id: 'PENDING',
      label: 'Incoming Orders',
      count: pendingOrders.length,
      items: pendingOrders,
      dotColor: 'bg-turmeric',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-900',
      emptyIcon: Clock,
      emptyTitle: 'No incoming orders',
      emptySubtitle: 'New customer QR scans and tickets will appear here with a sound alert.'
    },
    {
      id: 'PREPARING',
      label: 'Kitchen Cooking',
      count: preparingOrders.length,
      items: preparingOrders,
      dotColor: 'bg-indigo-500',
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      emptyIcon: Flame,
      emptyTitle: 'Kitchen is all clear',
      emptySubtitle: 'Accepted orders and add-on items cook here so chefs track prep time.'
    },
    {
      id: 'READY',
      label: 'Ready to Serve',
      count: readyOrders.length,
      items: readyOrders,
      dotColor: 'bg-blue-500',
      badgeBg: 'bg-blue-50 border-blue-200 text-blue-900',
      emptyIcon: CheckCircle2,
      emptyTitle: 'No orders waiting',
      emptySubtitle: 'Plated food ready for waitstaff to serve to tables.'
    },
    {
      id: 'SERVED',
      label: 'Served / Dining',
      count: servedOrders.length,
      items: servedOrders,
      dotColor: 'bg-cardamom',
      badgeBg: 'bg-cardamom-50 border-cardamom-100 text-cardamom-700',
      emptyIcon: UtensilsCrossed,
      emptyTitle: 'No active dining tables',
      emptySubtitle: 'Tables currently dining. Settle bill when guests finish their meal.'
    }
  ];

  const [mobileTab, setMobileTab] = useState<'PENDING' | 'PREPARING' | 'READY' | 'SERVED'>('PENDING');

  return (
    <div className="flex flex-col h-full space-y-3 flex-1 min-h-0 relative">
      {/* Top Bar: Stats Strip & Sound Alerts */}
      <div className="shrink-0 bg-white p-3 sm:p-4 rounded-xl border border-[var(--line)] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-[var(--ink)] tracking-tight flex items-center gap-2">
              <span>Live Kitchen Dispatch</span>
              <span className="w-2 h-2 rounded-full bg-cardamom animate-pulse" title="Socket Connected" />
            </h1>
            <p className="text-xs text-[var(--muted)]">
              {restaurant?.name || 'Restaurant'} • Real-Time Order Flow & Dining Tables
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <div className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-900 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-turmeric" />
              <span>{pendingOrders.length} Incoming</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/60 text-indigo-900 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>{preparingOrders.length} Cooking</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{readyOrders.length} Ready</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-cardamom-50 border border-cardamom-100 text-cardamom font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cardamom" />
              <span>{servedOrders.length} Dining</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Sound Banner & Settled Drawer Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <SoundBanner
            pendingCount={pendingOrders.length}
            pendingAdditionsCount={pendingAdditionsCount}
          />

          {/* Collapsible Settled Drawer Toggle */}
          <button
            onClick={() => setIsSettledDrawerOpen(!isSettledDrawerOpen)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all ${
              isSettledDrawerOpen
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white border-stone-200 text-slate-700 hover:bg-stone-50'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-slate-500" />
            <span>Settled Today ({completedOrders.length})</span>
            {isSettledDrawerOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
        {/* Source Channels: All, Dine-In, Swiggy, Zomato */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Orders', count: orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'REJECTED').length },
            { id: 'DINE_IN', label: 'Dine-In', count: orders.filter(o => o.source === 'DINE_IN' && o.status !== 'COMPLETED' && o.status !== 'REJECTED').length },
            { id: 'SWIGGY', label: 'Swiggy', count: orders.filter(o => o.source === 'SWIGGY' && o.status !== 'COMPLETED' && o.status !== 'REJECTED').length },
            { id: 'ZOMATO', label: 'Zomato', count: orders.filter(o => o.source === 'ZOMATO' && o.status !== 'COMPLETED' && o.status !== 'REJECTED').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterSource(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                filterSource === tab.id
                  ? 'bg-brand-500 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  filterSource === tab.id ? 'bg-white text-brand-600' : 'bg-stone-100 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search table, order #, or dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Mobile Stage Selector Tabs */}
      <div className="shrink-0 flex xl:hidden items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {liveColumns.map(col => (
          <button
            key={col.id}
            onClick={() => setMobileTab(col.id as any)}
            className={`flex-1 min-w-[100px] px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center justify-center gap-1.5 border transition-all ${
              mobileTab === col.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white border-stone-200 text-slate-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${col.dotColor}`} />
            <span>{col.label}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              mobileTab === col.id ? 'bg-brand-500 text-white' : 'bg-stone-100 text-slate-700'
            }`}>
              {col.count}
            </span>
          </button>
        ))}
      </div>

      {/* 4-Column Live Kitchen & Floor Board */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-stretch pb-1">
        {liveColumns.map(col => {
          const isMobileVisible = mobileTab === col.id;
          return (
            <div
              key={col.id}
              className={`${isMobileVisible ? 'flex' : 'hidden xl:flex'} bg-stone-100/70 rounded-xl p-3 border border-stone-200/80 flex-col h-full min-h-0 overflow-hidden`}
            >
              {/* Column Header (Pinned) */}
              <div className="shrink-0 flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {col.label}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${col.badgeBg}`}>
                  {col.count}
                </span>
              </div>

              {/* Column Tickets (Scrolls internally) */}
              <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
                {col.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-slate-400 mb-2 shadow-xs">
                      <col.emptyIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{col.emptyTitle}</p>
                    <p className="text-[11px] text-slate-400 max-w-[200px] mt-0.5 leading-relaxed">{col.emptySubtitle}</p>
                  </div>
                ) : (
                  col.items.map(order => {
                    const isPending = order.status === 'PENDING';
                    const hasPendingAdditions = order.additions && order.additions.some(a => a.status === 'PENDING');
                    const elapsedMins = getElapsedMins(order.createdAt);
                    const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    });

                    // Elapsed Time Styling
                    const isDelayed = elapsedMins >= 20;
                    const isWarning = elapsedMins >= 10 && elapsedMins < 20;

                    return (
                      <div
                        key={order.id}
                        className={`bg-white rounded-xl border p-3.5 shadow-xs transition-all ${
                          hasPendingAdditions
                            ? 'border-amber-400 ring-2 ring-amber-400/40'
                            : isPending
                            ? 'border-amber-300 ring-2 ring-amber-400/30'
                            : 'border-stone-200/90 hover:border-stone-300'
                        }`}
                      >
                        {/* Ticket Header: Table Pill, ID, Elapsed Badge */}
                        <div className="flex items-start justify-between pb-2.5 border-b border-stone-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold text-xs tracking-tight">
                                {order.tableNumber || 'Counter'}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono font-medium">
                                #{order.orderNumber}
                              </span>
                              {order.source && order.source !== 'DINE_IN' && (
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  order.source === 'SWIGGY'
                                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {order.source}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              Ordered at {orderTime}
                            </span>
                          </div>

                          {/* Dynamic Elapsed Badge */}
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isDelayed
                                ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
                                : isWarning
                                ? 'bg-amber-50 border-amber-200 text-amber-800'
                                : 'bg-stone-50 border-stone-200 text-slate-600'
                            }`}>
                              <Clock className="w-3 h-3" />
                              <span>{elapsedMins}m ago</span>
                            </span>
                          </div>
                        </div>

                        {/* SERVED State Indicator */}
                        {order.status === 'SERVED' && (
                          <div className="my-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-semibold">
                              <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Food Served • Table Dining</span>
                            </div>
                            <span className="text-[10px] text-emerald-700 bg-white px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                              Can add dishes
                            </span>
                          </div>
                        )}

                        {/* PENDING TABLE ADD-ON BANNER (Consolidated right on top of same card) */}
                        {order.additions && order.additions.filter(a => a.status === 'PENDING').map(addition => (
                          <div
                            key={addition.id}
                            className="my-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 shadow-sm"
                          >
                            <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                                  <span>🔔 {addition.additionNumber || 'New Table Add-on'}</span>
                                </span>
                              </div>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 uppercase tracking-wider">
                                Action Required
                              </span>
                            </div>

                            {/* Add-on Items list */}
                            <div className="py-2 divide-y divide-amber-200/50 text-xs">
                              {addition.items.map((item, idx) => (
                                <div key={idx} className="py-1 flex items-baseline justify-between gap-2">
                                  <div className="text-amber-950 font-medium">
                                    <span className="font-bold text-amber-900 mr-1.5">{item.quantity} ×</span>
                                    <span>{item.name}</span>
                                    {item.portion && (
                                      <span className="text-[10px] text-amber-700 ml-1">({item.portion})</span>
                                    )}
                                    {item.notes && (
                                      <div className="text-[10px] text-amber-800 italic pl-3 mt-0.5">
                                        Note: {item.notes}
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-amber-950 font-semibold tabular-nums shrink-0">
                                    ₹{item.price * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {addition.customerNotes && (
                              <div className="text-[10px] text-amber-800 bg-amber-100/60 p-1.5 rounded mb-2">
                                <span className="font-bold">Guest Note:</span> {addition.customerNotes}
                              </div>
                            )}

                            {/* Independent Add-on Decision Actions */}
                            <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between gap-2">
                              <div>
                                <span className="text-[10px] text-amber-700 block">Add-on Total</span>
                                <span className="text-xs font-bold text-amber-950 tabular-nums">+₹{addition.total?.toFixed(0)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleRejectAddition(order.id, addition.id)}
                                  disabled={processingAdditionId === addition.id}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-colors border border-rose-300 bg-white"
                                  title="Reject only this addition. Existing order will remain active!"
                                >
                                  Reject Addition
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAcceptAddition(order.id, addition.id)}
                                  disabled={processingAdditionId === addition.id}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accept Addition</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Order Base Items */}
                        <div className="py-2.5 divide-y divide-stone-100 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-1.5 flex items-baseline justify-between gap-2">
                              <div className="text-slate-900 font-medium">
                                <span className="font-bold text-slate-900 mr-2">{item.quantity} ×</span>
                                <span>{item.name}</span>
                                {item.portion && (
                                  <span className="text-[10px] text-slate-400 ml-1">({item.portion})</span>
                                )}
                                {item.notes && (
                                  <div className="text-[10px] text-amber-700 italic pl-4 mt-0.5">
                                    Note: {item.notes}
                                  </div>
                                )}
                              </div>
                              <span className="text-slate-700 font-semibold tabular-nums shrink-0">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Accepted Additions History if any */}
                        {order.additions && order.additions.some(a => a.status !== 'PENDING') && (
                          <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-slate-600 flex items-center justify-between">
                            <span>
                              {order.additions.filter(a => a.status === 'ACCEPTED').length} add-on round(s) merged
                            </span>
                            {order.additions.some(a => a.status === 'REJECTED') && (
                              <span className="text-rose-600 text-[10px] font-semibold">
                                ({order.additions.filter(a => a.status === 'REJECTED').length} declined)
                              </span>
                            )}
                          </div>
                        )}

                        {/* Customer / Table Notes */}
                        {order.customerNotes && (
                          <div className="mb-2 p-2 rounded-lg bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-1.5">
                            <span className="font-bold shrink-0">Note:</span>
                            <span>{order.customerNotes}</span>
                          </div>
                        )}

                        {/* Bill Requested Alert Banner */}
                        {order.billRequested && (
                          <div className="mb-2 p-2 rounded-lg bg-purple-50 border border-purple-200 text-[11px] text-purple-900 font-semibold flex items-center justify-between">
                            <span>Guest requested bill at table</span>
                            <button
                              onClick={() => setSettleOrder(order)}
                              className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold hover:bg-purple-700"
                            >
                              Settle
                            </button>
                          </div>
                        )}

                        {/* Card Footer: Total Price & Stage-Specific Actions */}
                        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Amount</span>
                            <span className="text-sm font-bold text-slate-900 tabular-nums">₹{order.total?.toFixed(0)}</span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* PENDING State Actions */}
                            {order.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'REJECTED')}
                                  className="min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'ACCEPTED')}
                                  className="min-h-[40px] px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accept Order</span>
                                </button>
                              </>
                            )}

                            {/* PREPARING State Actions */}
                            {(order.status === 'ACCEPTED' || order.status === 'PREPARING') && (
                              <>
                                <button
                                  onClick={() => handleOpenKot(order)}
                                  className="min-h-[40px] p-2 rounded-lg border border-stone-200 text-slate-600 hover:bg-stone-50 transition-colors"
                                  title="Print Kitchen Order Ticket (KOT)"
                                >
                                  <Printer className="w-4 h-4 text-slate-500" />
                                </button>
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'READY')}
                                  className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Mark Ready</span>
                                </button>
                              </>
                            )}

                            {/* READY State Actions: Mark as Served (decoupled from bill settlement) */}
                            {order.status === 'READY' && (
                              <>
                                <button
                                  onClick={() => handleOpenKot(order)}
                                  className="min-h-[40px] p-2 rounded-lg border border-stone-200 text-slate-600 hover:bg-stone-50 transition-colors"
                                  title="Print KOT"
                                >
                                  <Printer className="w-4 h-4 text-slate-500" />
                                </button>
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'SERVED')}
                                  className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                                >
                                  <UtensilsCrossed className="w-3.5 h-3.5" />
                                  <span>Mark as Served</span>
                                </button>
                              </>
                            )}

                            {/* SERVED State Actions: Settle Bill (removes card permanently on settlement) */}
                            {order.status === 'SERVED' && (
                              <>
                                <button
                                  onClick={() => handleOpenInvoice(order)}
                                  className="min-h-[40px] px-2.5 py-1.5 rounded-lg border border-stone-200 text-slate-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                                  title="View Invoice / Bill"
                                >
                                  <Receipt className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="hidden sm:inline">Receipt</span>
                                </button>
                                <button
                                  onClick={() => setSettleOrder(order)}
                                  className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Settle Bill</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Toast Notification Stack for New Table Add-ons */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className="pointer-events-auto bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-slide-up"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-amber-300">
                    Table {toast.tableNumber} added items!
                  </span>
                  <button
                    onClick={() => dismissToast(toast.id)}
                    className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                  {toast.itemSummary}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-amber-400 font-bold tabular-nums">
                    +₹{toast.total}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={async () => {
                        dismissToast(toast.id);
                        await handleAcceptAddition(toast.orderId, toast.additionId);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs transition-colors"
                    >
                      Accept Add-on
                    </button>
                    <button
                      onClick={() => dismissToast(toast.id)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settled Orders Right Drawer (Cleanly separated from active floor workflow) */}
      {isSettledDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white border-l border-stone-200 shadow-xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-brand-500" />
                <span>Today's Settled Orders</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {completedOrders.length} orders settled • Total: ₹{todaySales.toFixed(0)}
              </p>
            </div>
            <button
              onClick={() => setIsSettledDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Search */}
          <div className="p-3 border-b border-stone-100 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search settled orders..."
                value={settledSearchQuery}
                onChange={(e) => setSettledSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {/* Drawer Orders List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
            {filteredCompletedOrders.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                No settled orders found.
              </div>
            ) : (
              filteredCompletedOrders.map(order => (
                <div key={order.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center justify-between pb-1.5 border-b border-stone-200/60">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{order.tableNumber || 'Counter'}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">#{order.orderNumber}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 tabular-nums">₹{order.total?.toFixed(0)}</span>
                  </div>

                  <div className="py-1.5 text-[11px] text-slate-600">
                    {order.items.map((i, idx) => (
                      <span key={idx} className="mr-2">
                        {i.quantity}× {i.name}{idx < order.items.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1.5 border-t border-stone-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Settled</span>
                    </span>
                    <button
                      onClick={() => handleOpenInvoice(order)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-slate-700 hover:bg-stone-50 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5 text-slate-500" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <KotModal
        order={selectedKotOrder}
        restaurant={restaurant}
        printerConfig={printerConfig}
        isOpen={Boolean(selectedKotOrder)}
        onClose={() => setSelectedKotOrder(null)}
      />

      <InvoiceModal
        order={selectedInvoiceOrder}
        bill={activeBill}
        restaurant={restaurant}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      <SettleBillModal
        order={settleOrder}
        isOpen={Boolean(settleOrder)}
        onClose={() => setSettleOrder(null)}
        onSettle={handleSettleBill}
      />
    </div>
  );
};
