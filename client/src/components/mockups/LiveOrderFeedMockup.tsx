import React, { useState, useEffect } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import { formatINR } from '../../lib/utils';
import {
  ShoppingBag,
  QrCode,
  Smartphone,
  PhoneCall,
  Clock,
  Printer,
  CheckCircle2,
} from 'lucide-react';

interface OrderItem {
  id: string;
  source: 'Dine-In' | 'Zomato' | 'Swiggy' | 'QR Order' | 'Phone';
  tableOrOrder: string;
  items: string[];
  amount: number;
  status: 'New' | 'Cooking' | 'Ready';
  time: string;
}

const INITIAL_FEED: OrderItem[] = [
  {
    id: 'KOT #1042',
    source: 'Dine-In',
    tableOrOrder: 'Table 04',
    items: ['2x Paneer Butter Masala', '4x Butter Naan', '1x Sweet Lassi'],
    amount: 680,
    status: 'Cooking',
    time: '2m ago',
  },
  {
    id: 'KOT #1043',
    source: 'QR Order',
    tableOrOrder: 'Table 09',
    items: ['1x Filter Coffee', '2x Ghee Podi Roast Dosa'],
    amount: 320,
    status: 'Ready',
    time: '4m ago',
  },
  {
    id: 'KOT #1044',
    source: 'Zomato',
    tableOrOrder: 'Delivery #492',
    items: ['1x Dum Chicken Biryani', '2x Mirchi Ka Salan'],
    amount: 790,
    status: 'New',
    time: 'Just now',
  },
];

export const LiveOrderFeedMockup: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_FEED);
  const [isPaused, setIsPaused] = useState(false);
  const [runningTotal, setRunningTotal] = useState(2890);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const sources: Array<OrderItem['source']> = ['Dine-In', 'Swiggy', 'QR Order', 'Zomato', 'Phone'];
    const sampleDishes = [
      { items: ['1x Masala Chai', '2x Bun Maska'], amount: 160 },
      { items: ['2x Dal Makhani', '3x Garlic Naan'], amount: 540 },
      { items: ['1x Hyderabadi Biryani', '1x Raita'], amount: 380 },
      { items: ['1x Cold Brew', '1x Sourdough Toast'], amount: 390 },
      { items: ['2x Chole Bhature Platter'], amount: 340 },
    ];

    const interval = setInterval(() => {
      setOrders((prev) => {
        const nextId = `KOT #${1040 + Math.floor(Math.random() * 800)}`;
        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        const randomDish = sampleDishes[Math.floor(Math.random() * sampleDishes.length)];

        const newOrder: OrderItem = {
          id: nextId,
          source: randomSource,
          tableOrOrder:
            randomSource === 'Dine-In' || randomSource === 'QR Order'
              ? `Table ${Math.floor(Math.random() * 12) + 1}`
              : `Order #${Math.floor(Math.random() * 900) + 100}`,
          items: randomDish.items,
          amount: randomDish.amount,
          status: 'New',
          time: 'Just now',
        };

        setRunningTotal((t) => t + randomDish.amount);
        return [newOrder, prev[0], prev[1]].slice(0, 3);
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isPaused]);

  const getSourceIcon = (source: OrderItem['source']) => {
    switch (source) {
      case 'QR Order':
        return <QrCode className="w-3.5 h-3.5 text-orange-600" />;
      case 'Zomato':
      case 'Swiggy':
        return <Smartphone className="w-3.5 h-3.5 text-orange-500" />;
      case 'Phone':
        return <PhoneCall className="w-3.5 h-3.5 text-success" />;
      default:
        return <ShoppingBag className="w-3.5 h-3.5 text-espresso" />;
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative rounded-2xl bg-white border border-sand-200 shadow-card p-5 sm:p-6 transition-all font-sans text-left"
    >
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-sand-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
          </span>
          <span className="font-bold text-espresso font-mono tracking-wide">
            LIVE KITCHEN FEED
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-walnut font-mono text-[11px]">
          <Clock className="w-3 h-3" />
          <span>{isPaused ? 'Paused' : 'Real-time'}</span>
        </div>
      </div>

      {/* Dynamic Cards */}
      <div className="space-y-3 min-h-[250px]">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-3.5 rounded-xl border border-sand-200 bg-sand-50/70 transition-all hover:bg-sand-50"
          >
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <div className="flex items-center gap-1.5 font-bold text-espresso">
                {getSourceIcon(order.source)}
                <span>{order.id}</span>
                <span className="text-walnut font-normal font-sans">({order.tableOrOrder})</span>
              </div>
              <span
                className={`text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-md border ${
                  order.status === 'Ready'
                    ? 'bg-green-50 text-success border-success/30'
                    : order.status === 'Cooking'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-orange-50 text-orange-dark border-orange-300'
                }`}
              >
                {order.status}
              </span>
            </div>

            <ul className="text-xs text-bodyText font-sans space-y-0.5 pl-0.5 font-medium">
              {order.items.map((item, i) => (
                <li key={i} className="truncate">
                  • {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-sand-200 text-xs font-mono">
              <span className="text-walnut text-[10px]">{order.time}</span>
              <span className="font-extrabold text-espresso">{formatINR(order.amount)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Running Total Bar */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-sand-200 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-walnut">
          <Printer className="w-3.5 h-3.5 text-orange-500" />
          <span className="font-sans font-bold text-[11px] text-espresso">Shift Running Total:</span>
        </div>
        <div className="text-right">
          <span className="font-extrabold text-base text-espresso font-mono">{formatINR(runningTotal)}</span>
          <span className="block text-[10px] text-success font-sans font-bold">
            5% GST Auto Computed
          </span>
        </div>
      </div>
    </div>
  );
};
