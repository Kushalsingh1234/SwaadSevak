import React, { useState, useEffect, useMemo } from 'react';
import {
  RefreshCw,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TableProperties,
  UtensilsCrossed,
  Flame,
  Store,
  Layers
} from 'lucide-react';
import { Order, Restaurant, Manager, TableItem, MenuItem } from '../types';
import { api } from '../services/api';
import { SoundBanner } from '../components/SoundBanner';
import { VegIcon } from '../components/VegIcon';

interface DashboardOverviewPageProps {
  restaurant: Restaurant | null;
  manager: Manager | null;
  orders: Order[];
  tables?: TableItem[];
  menuItems?: MenuItem[];
  onNavigateTab?: (tab: string) => void;
  onRefreshOrders?: () => void;
}

export const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({
  restaurant,
  manager,
  orders,
  tables = [],
  menuItems = [],
  onNavigateTab,
  onRefreshOrders,
}) => {
  const [stats, setStats] = useState<any>({
    todaySales: 0,
    totalOrders: 0,
    pendingCount: 0,
    completedCount: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshOrders) await onRefreshOrders();
    await loadStats();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const preparingOrders = orders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const activeOrdersCount = pendingOrders.length + preparingOrders.length + readyOrders.length;

  const calculatedSales = useMemo(() => {
    const sum = completedOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    return Math.max(sum, stats.todaySales || 0);
  }, [completedOrders, stats.todaySales]);

  const totalOrdersCount = useMemo(() => {
    return Math.max(orders.length, stats.totalOrders || 0);
  }, [orders.length, stats.totalOrders]);

  // Channel breakdown
  const channelBreakdown = useMemo(() => {
    const dineIn = orders.filter(o => o.source === 'DINE_IN' || !o.source).length;
    const swiggy = orders.filter(o => o.source === 'SWIGGY').length;
    const zomato = orders.filter(o => o.source === 'ZOMATO').length;
    return { dineIn, swiggy, zomato };
  }, [orders]);

  // Real-time table occupancy
  const occupancyMap = useMemo(() => {
    const map = new Map<string, { status: 'AVAILABLE' | 'OCCUPIED' | 'BILL_REQUESTED'; order?: Order }>();

    tables.forEach(t => {
      map.set(t.tableNumber, { status: 'AVAILABLE' });
    });

    orders.forEach(o => {
      if (o.status !== 'COMPLETED' && o.status !== 'REJECTED' && o.tableNumber) {
        map.set(o.tableNumber, {
          status: o.billRequested ? 'BILL_REQUESTED' : 'OCCUPIED',
          order: o,
        });
      }
    });

    return map;
  }, [tables, orders]);

  // Top 5 selling dishes
  const topDishes = useMemo(() => {
    const counts: Record<string, { name: string; quantity: number; revenue: number; isVeg?: boolean; tags?: string[] }> = {};

    orders.filter(o => o.status !== 'REJECTED').forEach(order => {
      order.items?.forEach(item => {
        if (!counts[item.name]) {
          const matchedMenu = menuItems.find(m => m.name.toLowerCase() === item.name.toLowerCase());
          counts[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
            isVeg: matchedMenu ? matchedMenu.isVeg : true,
            tags: matchedMenu?.tags || [],
          };
        }
        counts[item.name].quantity += (item.quantity || 1);
        counts[item.name].revenue += ((item.price || 0) * (item.quantity || 1));
      });
    });

    const sorted = Object.values(counts).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    if (sorted.length === 0 && menuItems.length > 0) {
      return menuItems.slice(0, 5).map(m => ({
        name: m.name,
        quantity: 0,
        revenue: 0,
        isVeg: m.isVeg,
        tags: m.tags || [],
      }));
    }
    return sorted;
  }, [orders, menuItems]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {greeting}, {manager?.username || 'Shift Manager'}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Shift Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {restaurant?.name || 'Swaad Sevak Outlet'} • {todayFormatted}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <SoundBanner pendingCount={pendingOrders.length} />

          <button
            onClick={handleManualRefresh}
            className={`p-2 rounded-xl border border-stone-200 text-slate-600 hover:bg-stone-50 active:scale-95 transition-all ${
              isRefreshing ? 'animate-spin text-brand-600' : ''
            }`}
            title="Refresh Data"
            aria-label="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('orders')}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-stone-950 text-xs font-black transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <span>Live Kitchen</span>
              {activeOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-stone-950/20 text-stone-950 text-[10px] font-black">
                  {activeOrdersCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Today's Revenue */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">Today's Sales</span>
            <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            ₹{calculatedSales.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10.5px] sm:text-[11px] text-emerald-600 font-semibold truncate">
            <span>● Settled revenue</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">Total Tickets</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {totalOrdersCount}
          </div>
          <div className="mt-1 text-[10.5px] sm:text-[11px] text-slate-500 truncate font-medium">
            {channelBreakdown.dineIn} Dine-in • {channelBreakdown.swiggy + channelBreakdown.zomato} Aggregator
          </div>
        </div>

        {/* Active In-Service */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">In Service</span>
            <div className={`w-7 h-7 rounded-xl ${activeOrdersCount > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-stone-50 text-slate-400'} flex items-center justify-center shrink-0`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-black tabular-nums ${activeOrdersCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {activeOrdersCount}
          </div>
          <div className="mt-1 text-[10.5px] sm:text-[11px] text-slate-500 truncate font-medium">
            {pendingOrders.length} new • {preparingOrders.length + readyOrders.length} active
          </div>
        </div>

        {/* Completed & Settled */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">Settled</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {completedOrders.length}
          </div>
          <div className="mt-1 text-[10.5px] sm:text-[11px] text-slate-500 truncate font-medium">
            Billed &amp; paid out
          </div>
        </div>
      </div>

      {/* Table Floor Occupancy Map */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TableProperties className="w-4 h-4 text-orange-500" />
              <span>Table Floor Occupancy</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time dining room seating and bill status</p>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-600 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Seated
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" /> Bill Requested
            </span>
          </div>
        </div>

        {tables.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No tables added yet. Go to <button onClick={() => onNavigateTab?.('tables')} className="text-brand-600 font-semibold underline">Tables &amp; QR</button> to add your dining tables.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {tables.map(table => {
              const liveData = occupancyMap.get(table.tableNumber);
              const status = liveData?.status || 'AVAILABLE';
              const activeOrder = liveData?.order;

              return (
                <div
                  key={table.id}
                  onClick={() => onNavigateTab?.('orders')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-95 shadow-xs ${
                    status === 'BILL_REQUESTED'
                      ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-300'
                      : status === 'OCCUPIED'
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-white border-stone-200/90 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{table.tableNumber}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        status === 'BILL_REQUESTED'
                          ? 'bg-purple-600 animate-pulse'
                          : status === 'OCCUPIED'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  {activeOrder ? (
                    <div>
                      <div className="text-xs font-black text-slate-900 tabular-nums">₹{activeOrder.total?.toFixed(0)}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{activeOrder.items?.length || 0} items</div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Available</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Columns: Top Dishes & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Dishes */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-brand-500" />
                <span>Top Selling Dishes Today</span>
              </h2>
              <p className="text-xs text-slate-500">Ordered by quantity</p>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('menu')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>View Menu</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="divide-y divide-stone-100">
            {topDishes.map((dish, idx) => (
              <div key={dish.name + idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-4 text-slate-400 font-bold shrink-0">{idx + 1}.</span>
                  <div className="shrink-0">
                    <VegIcon isVeg={dish.isVeg !== false} size="sm" />
                  </div>
                  <span className="font-semibold text-slate-900 truncate">{dish.name}</span>
                  {dish.tags?.filter(t => t && t.toLowerCase() !== 'none').slice(0, 1).map((t: string) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 border border-amber-200 text-amber-800 shrink-0"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 tabular-nums">{dish.quantity} sold</span>
                  {dish.revenue > 0 && (
                    <span className="text-slate-400 ml-2.5 tabular-nums">₹{dish.revenue}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-500" />
                <span>Recent Order Tickets</span>
              </h2>
              <p className="text-xs text-slate-500">Latest tickets logged today</p>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
              >
                <span>All Orders</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No orders recorded yet today.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {orders.slice(0, 5).map(order => {
                const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });

                return (
                  <div key={order.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{order.tableNumber || 'Counter'}</span>
                        <span className="font-normal text-slate-500 font-mono text-[11px]">(#{order.orderNumber})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{order.items?.length || 0} items • {orderTime}</span>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <span className="font-bold text-slate-900 tabular-nums">₹{order.total?.toFixed(0)}</span>
                      <span className={`text-[11px] font-semibold ${
                        order.status === 'PENDING'
                          ? 'text-amber-600'
                          : order.status === 'COMPLETED'
                          ? 'text-slate-500'
                          : 'text-blue-600'
                      }`}>
                        {order.status === 'PENDING' && '● Incoming'}
                        {order.status === 'ACCEPTED' && '● Cooking'}
                        {order.status === 'PREPARING' && '● Cooking'}
                        {order.status === 'READY' && '● Ready'}
                        {order.status === 'COMPLETED' && '✓ Settled'}
                        {order.status === 'REJECTED' && '✕ Cancelled'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
