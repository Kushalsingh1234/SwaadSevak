import React, { useState, useEffect } from 'react';
import {
  Printer,
  Receipt,
  Search,
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
      order.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSource && matchesSearch;
  });

  const pendingOrders = filteredOrders.filter(o => o.status === 'PENDING');
  const preparingOrders = filteredOrders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const readyOrders = filteredOrders.filter(o => o.status === 'READY');
  const completedOrders = filteredOrders.filter(o => o.status === 'COMPLETED');

  const columns = [
    { id: 'PENDING', label: 'Pending', count: pendingOrders.length, items: pendingOrders, dotColor: 'bg-amber-500' },
    { id: 'PREPARING', label: 'Cooking', count: preparingOrders.length, items: preparingOrders, dotColor: 'bg-blue-500' },
    { id: 'READY', label: 'Ready to Serve', count: readyOrders.length, items: readyOrders, dotColor: 'bg-emerald-500' },
    { id: 'COMPLETED', label: 'Completed', count: completedOrders.length, items: completedOrders, dotColor: 'bg-gray-400' },
  ];

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Orders
          </h1>
          <p className="text-xs text-gray-500">
            Live kitchen dispatch and order management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SoundBanner pendingCount={pendingOrders.length} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
        {/* Source Filter Tabs */}
        <div className="flex items-center gap-1">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'DINE_IN', label: 'Dine-In' },
            { id: 'SWIGGY', label: 'Swiggy' },
            { id: 'ZOMATO', label: 'Zomato' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterSource(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterSource === tab.id
                  ? 'bg-gray-900 text-white font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by table or dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* 4-Column Restaurant Order Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map(col => (
          <div key={col.id} className="bg-gray-100/70 rounded-xl p-3 border border-gray-200/80 min-h-[500px] flex flex-col">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  {col.label}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                {col.count}
              </span>
            </div>

            {/* Orders Stack */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {col.items.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  No orders
                </div>
              ) : (
                col.items.map(order => {
                  const isPending = order.status === 'PENDING';
                  const elapsedMins = getElapsedMins(order.createdAt);
                  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  });

                  return (
                    <div
                      key={order.id}
                      className={`bg-white rounded-xl border p-4 shadow-xs transition-shadow ${
                        isPending
                          ? 'border-amber-300 ring-1 ring-amber-300/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Ticket Header */}
                      <div className="flex items-start justify-between pb-2.5 border-b border-gray-100">
                        <div>
                          <div className="text-sm font-bold text-gray-900 tracking-tight">
                            {order.tableNumber || 'Dine-In'}
                          </div>
                          <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                            {order.orderNumber} • {orderTime}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-[11px] font-semibold ${
                            order.status === 'PENDING'
                              ? 'text-amber-600'
                              : order.status === 'COMPLETED'
                              ? 'text-gray-500'
                              : order.status === 'READY'
                              ? 'text-emerald-600'
                              : 'text-blue-600'
                          }`}>
                            {order.status === 'PENDING' && '● Pending'}
                            {order.status === 'ACCEPTED' && '● Accepted'}
                            {order.status === 'PREPARING' && '● Cooking'}
                            {order.status === 'READY' && '● Ready'}
                            {order.status === 'COMPLETED' && '✓ Settled'}
                          </span>
                          {elapsedMins > 0 && order.status !== 'COMPLETED' && (
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              {elapsedMins}m ago
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="py-2.5 divide-y divide-gray-50 text-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-1 flex items-baseline justify-between">
                            <div className="text-gray-900 font-medium pr-2">
                              <span className="font-bold text-gray-900 mr-1.5">{item.quantity} ×</span>
                              <span>{item.name}</span>
                              {item.portion && (
                                <span className="text-[10px] text-gray-400 ml-1">({item.portion})</span>
                              )}
                              {item.notes && (
                                <div className="text-[10px] text-amber-700 italic pl-4">Note: {item.notes}</div>
                              )}
                            </div>
                            <span className="text-gray-700 font-semibold shrink-0">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Customer Note */}
                      {order.customerNotes && (
                        <div className="mb-2 p-2 rounded-md bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-900">
                          <span className="font-semibold">Note:</span> {order.customerNotes}
                        </div>
                      )}

                      {/* Bill Requested Alert */}
                      {order.billRequested && order.status !== 'COMPLETED' && (
                        <div className="mb-2 p-2 rounded-md bg-purple-50 border border-purple-200 text-[11px] text-purple-900 font-semibold flex items-center justify-between">
                          <span>Guest requested bill</span>
                          <button
                            onClick={() => setSettleOrder(order)}
                            className="underline text-purple-700 hover:text-purple-900 text-[11px]"
                          >
                            Settle
                          </button>
                        </div>
                      )}

                      {/* Ticket Footer & Actions */}
                      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[11px] text-gray-400 block">Total</span>
                          <span className="text-sm font-bold text-gray-900">₹{order.total?.toFixed(0)}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Pending Actions */}
                          {order.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'REJECTED')}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'ACCEPTED')}
                                className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors"
                              >
                                Accept Order
                              </button>
                            </>
                          )}

                          {/* Cooking Actions */}
                          {(order.status === 'ACCEPTED' || order.status === 'PREPARING') && (
                            <>
                              <button
                                onClick={() => handleOpenKot(order)}
                                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                title="Print KOT"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'READY')}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                              >
                                Mark Ready
                              </button>
                            </>
                          )}

                          {/* Ready to Serve Actions */}
                          {order.status === 'READY' && (
                            <>
                              <button
                                onClick={() => handleOpenKot(order)}
                                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                title="Print KOT"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSettleOrder(order)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                              >
                                Settle Bill
                              </button>
                            </>
                          )}

                          {/* Completed Actions */}
                          {order.status === 'COMPLETED' && (
                            <button
                              onClick={() => handleOpenInvoice(order)}
                              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <Receipt className="w-3.5 h-3.5 text-gray-500" />
                              <span>Invoice</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

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
