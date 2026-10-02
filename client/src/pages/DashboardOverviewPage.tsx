import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
  Receipt,
  BellRing,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  DollarSign,
  Award,
  UtensilsCrossed,
  RefreshCw,
  ChefHat,
  ChevronRight,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { Order, Restaurant, Manager, TableItem, MenuItem } from '../types';
import { api } from '../services/api';
import { SoundBanner } from '../components/SoundBanner';

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
    onlineOrders: { swiggy: { count: 0, sales: 0 }, zomato: { count: 0, sales: 0 } }
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch dynamic stats from backend
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
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Order status classifications
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const preparingOrders = orders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const billRequestedOrders = orders.filter(o => o.billRequested && o.status !== 'COMPLETED');

  // Executive Financial Calculations
  const calculatedSales = useMemo(() => {
    const sum = completedOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    return Math.max(sum, stats.todaySales || 0);
  }, [completedOrders, stats.todaySales]);

  const totalOrdersCount = useMemo(() => {
    return Math.max(orders.length, stats.totalOrders || 0);
  }, [orders.length, stats.totalOrders]);

  const aov = useMemo(() => {
    return totalOrdersCount > 0 ? Math.round(calculatedSales / (completedOrders.length || totalOrdersCount || 1)) : 0;
  }, [calculatedSales, totalOrdersCount, completedOrders.length]);

  // Table Occupancy Real-time Mapping
  const occupancyMap = useMemo(() => {
    const map = new Map<string, { status: 'AVAILABLE' | 'OCCUPIED' | 'BILL_REQUESTED'; order?: Order }>();

    // Initial fill from tables prop
    tables.forEach(t => {
      map.set(t.tableNumber, { status: 'AVAILABLE' });
    });

    // Overlay active non-completed orders
    orders.forEach(o => {
      if (o.status !== 'COMPLETED' && o.status !== 'REJECTED' && o.tableNumber) {
        const isBillReq = o.billRequested;
        map.set(o.tableNumber, {
          status: isBillReq ? 'BILL_REQUESTED' : 'OCCUPIED',
          order: o
        });
      }
    });

    return map;
  }, [tables, orders]);

  const occupiedCount = useMemo(() => {
    let count = 0;
    occupancyMap.forEach(v => {
      if (v.status !== 'AVAILABLE') count++;
    });
    return count;
  }, [occupancyMap]);

  const occupancyRate = tables.length > 0 ? Math.round((occupiedCount / tables.length) * 100) : 0;

  // Top 5 Bestselling Dishes calculation
  const topDishes = useMemo(() => {
    const counts: Record<string, { name: string; quantity: number; revenue: number; isVeg?: boolean }> = {};

    orders.filter(o => o.status !== 'REJECTED').forEach(order => {
      order.items?.forEach(item => {
        if (!counts[item.name]) {
          counts[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        counts[item.name].quantity += (item.quantity || 1);
        counts[item.name].revenue += ((item.price || 0) * (item.quantity || 1));
      });
    });

    const sorted = Object.values(counts).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    // If no sales yet, fill with showcase dishes from menu
    if (sorted.length === 0 && menuItems.length > 0) {
      return menuItems.slice(0, 5).map(m => ({
        name: m.name,
        quantity: 0,
        revenue: 0,
        isVeg: m.isVeg,
      }));
    }
    return sorted;
  }, [orders, menuItems]);

  // Direct QR Savings (22% standard Swiggy/Zomato commission saved)
  const dineInRevenue = useMemo(() => {
    return orders
      .filter(o => o.source === 'DINE_IN' && o.status === 'COMPLETED')
      .reduce((acc, o) => acc + (o.total || 0), 0);
  }, [orders]);

  const commissionSaved = Math.round(dineInRevenue * 0.22);

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {greeting}, {manager?.username || 'Partner'} 👋
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 tracking-wide">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {restaurant?.name || 'Swaad Sevak'} • {restaurant?.city || 'India'} • Executive Business Performance
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <SoundBanner pendingCount={pendingOrders.length} />

          <button
            onClick={handleManualRefresh}
            className={`p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
              isRefreshing ? 'animate-spin text-orange-600' : ''
            }`}
            title="Refresh Live Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('orders')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-sm shadow-orange-500/20 transition-all"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Kitchen Display (KDS)</span>
              {pendingOrders.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-orange-600 text-[10px] font-black">
                  {pendingOrders.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bill Requested Alert Banner (If Any) */}
      {billRequestedOrders.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-purple-50/70 to-white border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Receipt className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-purple-950 flex items-center gap-1.5">
                <span>Payment & Bill Requested</span>
                <span className="px-2 py-0.2 text-[10px] rounded-full bg-purple-200 text-purple-900 font-bold">
                  {billRequestedOrders.length} {billRequestedOrders.length === 1 ? 'Table' : 'Tables'}
                </span>
              </h4>
              <p className="text-xs text-purple-800">
                {billRequestedOrders.map(o => o.tableNumber).join(', ')} • Guests are ready for instant checkout
              </p>
            </div>
          </div>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('orders')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Settle in Live Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 4 Executive Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Net Sales</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            ₹{calculatedSales.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-600 font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>100% Direct to Your Account</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Orders Today</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {totalOrdersCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            {completedOrders.length} completed • {pendingOrders.length + preparingOrders.length + readyOrders.length} live
          </p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            ₹{aov > 0 ? aov.toLocaleString('en-IN') : '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Per dining table average ticket size
          </p>
        </div>

        {/* Live Table Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Table Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {tables.length > 0 ? `${occupancyRate}%` : `${occupiedCount} Active`}
            </span>
            {tables.length > 0 && (
              <span className="text-xs font-bold text-slate-500">
                ({occupiedCount}/{tables.length})
              </span>
            )}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(occupancyRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Live Floor & Table Occupancy Map */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-orange-600" />
              <span>Live Floor & Table Map</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time table status, running diner balances, and quick QR actions
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center flex-wrap gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600">Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <span className="text-slate-600">Bill Requested</span>
            </div>
          </div>
        </div>

        {tables.length === 0 ? (
          <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <QrCode className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No tables configured yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Configure dining tables with QR codes in the Tables & QR Codes tab.
            </p>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('tables')}
                className="mt-3 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                Go to Tables & QR Setup
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {tables.map(table => {
              const liveData = occupancyMap.get(table.tableNumber);
              const status = liveData?.status || 'AVAILABLE';
              const activeOrder = liveData?.order;

              const isAvailable = status === 'AVAILABLE';
              const isOccupied = status === 'OCCUPIED';
              const isBillReq = status === 'BILL_REQUESTED';

              return (
                <div
                  key={table.id}
                  className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                    isBillReq
                      ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400/30'
                      : isOccupied
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-sm text-slate-900">
                        {table.tableNumber}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isBillReq
                            ? 'bg-purple-600 ring-4 ring-purple-200 animate-ping'
                            : isOccupied
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </div>

                    {/* Status Pill */}
                    <div className="mb-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                          isBillReq
                            ? 'bg-purple-600 text-white'
                            : isOccupied
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isBillReq ? 'Bill Req' : isOccupied ? 'Occupied' : 'Available'}
                      </span>
                    </div>

                    {/* Active Order Details if any */}
                    {activeOrder ? (
                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <div className="font-mono text-slate-500">{activeOrder.orderNumber}</div>
                        <div className="font-bold text-slate-900">₹{activeOrder.total?.toFixed(2)}</div>
                        <div className="text-slate-400 text-[10px]">{activeOrder.items?.length || 0} items</div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 py-1">
                        Ready for guests
                      </div>
                    )}
                  </div>

                  {activeOrder && onNavigateTab && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-end">
                      <button
                        onClick={() => onNavigateTab('orders')}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
                        title="View order in KDS"
                      >
                        <span>View in KDS</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2-Column Section: Top 5 Bestsellers & Omnichannel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Bestselling Dishes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Top Bestselling Dishes Today</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Most popular dishes ordered by dining guests
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ranked by volume
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {topDishes.map((dish, index) => {
                const medals = ['🥇', '🥈', '🥉', '4', '5'];
                return (
                  <div key={dish.name + index} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-700">
                        {medals[index]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${dish.isVeg === false ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{dish.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {dish.quantity > 0 ? `${dish.quantity} orders placed today` : 'Showcase Item'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-black text-slate-900">
                        {dish.revenue > 0 ? `₹${dish.revenue.toLocaleString('en-IN')}` : '—'}
                      </div>
                      <span className="text-[10px] text-slate-400">Gross Sales</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {onNavigateTab && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => onNavigateTab('menu')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>Manage Menu & Dish Pricing</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Omnichannel & Direct Commission Savings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Omnichannel & Commission Savings</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct table QR orders vs third-party food delivery aggregators
                </p>
              </div>
            </div>

            {/* Savings Callout Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    Direct QR Commission Savings
                  </span>
                  <div className="text-2xl font-black text-emerald-950 mt-0.5">
                    ₹{commissionSaved.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                  0%
                </div>
              </div>
              <p className="text-[11px] text-emerald-800/90 mt-2 font-medium">
                Saved based on a typical 22% aggregator commission by serving diners directly on Swaad Sevak.
              </p>
            </div>

            {/* Channels breakdown */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-orange-950">Dine-In (Swaad Sevak QR)</span>
                  <p className="text-[11px] text-orange-800">
                    {orders.filter(o => o.source === 'DINE_IN').length} Orders Today
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-orange-900">0% Commission</span>
                  <p className="text-[10px] text-orange-700">Direct Settlement</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between opacity-85">
                <div>
                  <span className="text-xs font-bold text-slate-800">Swiggy</span>
                  <p className="text-[11px] text-slate-500">POS Integration Gateway</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500">Ready for Sync</span>
                  <p className="text-[10px] text-slate-400">~22% Comm.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between opacity-85">
                <div>
                  <span className="text-xs font-bold text-slate-800">Zomato</span>
                  <p className="text-[11px] text-slate-500">POS Integration Gateway</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500">Ready for Sync</span>
                  <p className="text-[10px] text-slate-400">~22% Comm.</p>
                </div>
              </div>
            </div>
          </div>

          {onNavigateTab && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-500">Want to dispatch kitchen orders?</span>
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>Open Live Orders Dispatch</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Stream Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span>Recent Activity Pulse</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest dine-in orders placed across tables
            </p>
          </div>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('orders')}
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <span>View All Live Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-xl">
            <UtensilsCrossed className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No orders logged today yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map(order => {
              const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });

              return (
                <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                      {order.tableNumber?.replace(/Table\s*/i, 'T') || 'ORD'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{order.tableNumber || 'Online'}</span>
                        <span className="text-[11px] font-mono text-slate-400">{order.orderNumber}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {order.items?.length || 0} items • {orderTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-900">₹{order.total?.toFixed(2)}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        order.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'ACCEPTED' || order.status === 'PREPARING'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'READY'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
