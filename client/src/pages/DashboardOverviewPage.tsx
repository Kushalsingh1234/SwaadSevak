import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
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
    const counts: Record<string, { name: string; quantity: number; revenue: number; isVeg?: boolean }> = {};

    orders.filter(o => o.status !== 'REJECTED').forEach(order => {
      order.items?.forEach(item => {
        if (!counts[item.name]) {
          counts[item.name] = { name: item.name, quantity: 0, revenue: 0, isVeg: true };
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
    <div className="space-y-5">
      {/* Simple, Professional Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {greeting}, {manager?.username || 'Manager'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {restaurant?.name || 'The Chai & Chaat Co.'} • {todayFormatted}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SoundBanner pendingCount={pendingOrders.length} />

          <button
            onClick={handleManualRefresh}
            className={`p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors ${
              isRefreshing ? 'animate-spin text-orange-600' : ''
            }`}
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('orders')}
              className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition-colors shadow-xs"
            >
              View Live Orders {activeOrdersCount > 0 ? `(${activeOrdersCount})` : ''}
            </button>
          )}
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 gap-y-3 sm:gap-y-0">
        <div className="sm:pr-5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Sales</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            ₹{calculatedSales.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Net completed revenue</span>
        </div>

        <div className="sm:px-5 pt-3 sm:pt-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</span>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {totalOrdersCount}
          </div>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Total logged today</span>
        </div>

        <div className="sm:px-5 pt-3 sm:pt-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Orders</span>
          <div className={`text-2xl font-semibold mt-1 ${activeOrdersCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {activeOrdersCount}
          </div>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Currently in service</span>
        </div>

        <div className="sm:pl-5 pt-3 sm:pt-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</span>
          <div className="text-2xl font-semibold text-gray-700 mt-1">
            {completedOrders.length}
          </div>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Billed & settled</span>
        </div>
      </div>

      {/* Table Floor Map */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Table Occupancy</h2>
            <p className="text-xs text-gray-500 mt-0.5">Real-time dining floor status</p>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Occupied
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600" /> Bill Requested
            </span>
          </div>
        </div>

        {tables.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No tables added yet. Go to <button onClick={() => onNavigateTab?.('tables')} className="text-orange-600 font-semibold underline">Tables & QR</button> to add your dining tables.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {tables.map(table => {
              const liveData = occupancyMap.get(table.tableNumber);
              const status = liveData?.status || 'AVAILABLE';
              const activeOrder = liveData?.order;

              return (
                <div
                  key={table.id}
                  onClick={() => onNavigateTab?.('orders')}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                    status === 'BILL_REQUESTED'
                      ? 'bg-purple-50/60 border-purple-300'
                      : status === 'OCCUPIED'
                      ? 'bg-amber-50/50 border-amber-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-900">{table.tableNumber}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        status === 'BILL_REQUESTED'
                          ? 'bg-purple-600'
                          : status === 'OCCUPIED'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  {activeOrder ? (
                    <div>
                      <div className="text-xs font-semibold text-gray-900">₹{activeOrder.total?.toFixed(0)}</div>
                      <div className="text-[10px] text-gray-500">{activeOrder.items?.length || 0} items</div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400">Available</span>
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Top Dishes Today</h2>
              <p className="text-xs text-gray-500">Ordered by quantity</p>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('menu')}
                className="text-xs font-medium text-orange-600 hover:text-orange-700"
              >
                View Menu
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {topDishes.map((dish, idx) => (
              <div key={dish.name + idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-gray-400 font-semibold">{idx + 1}.</span>
                  <span className="font-medium text-gray-900">{dish.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">{dish.quantity} sold</span>
                  {dish.revenue > 0 && (
                    <span className="text-gray-400 ml-2">₹{dish.revenue}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
              <p className="text-xs text-gray-500">Latest tickets logged</p>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
              >
                <span>All Orders</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No orders recorded yet today.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 5).map(order => {
                const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });

                return (
                  <div key={order.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {order.tableNumber || 'Dine-In'} <span className="font-normal text-gray-500 font-mono">({order.orderNumber})</span>
                      </div>
                      <span className="text-[11px] text-gray-400">{order.items?.length || 0} items • {orderTime}</span>
                    </div>

                    <div className="text-right flex items-center gap-2.5">
                      <span className="font-bold text-gray-900">₹{order.total?.toFixed(0)}</span>
                      <span className={`text-[11px] font-medium ${
                        order.status === 'PENDING'
                          ? 'text-amber-600 font-semibold'
                          : order.status === 'COMPLETED'
                          ? 'text-gray-500'
                          : 'text-blue-600 font-medium'
                      }`}>
                        {order.status === 'PENDING' && '● Incoming'}
                        {order.status === 'ACCEPTED' && '● Kitchen Cooking'}
                        {order.status === 'PREPARING' && '● Kitchen Cooking'}
                        {order.status === 'READY' && '● Ready to Serve'}
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
