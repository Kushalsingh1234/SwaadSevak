import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { Button } from '../ui/Button';
import { ReceiptCard } from '../ui/ReceiptCard';
import { Badge } from '../ui/Badge';
import { SITE_CONTENT } from '../../content/site';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import { formatINR } from '../../lib/utils';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Printer,
  CheckCircle,
  Flame,
  ShoppingBag,
  QrCode,
  Smartphone,
  RotateCcw,
} from 'lucide-react';

interface SimulatedOrder {
  id: string;
  source: 'Dine-In' | 'Zomato' | 'Swiggy' | 'QR Order' | 'Phone';
  sourceIcon: React.ReactNode;
  tableOrOrder: string;
  items: string[];
  amount: number;
  status: 'New' | 'Cooking' | 'Ready';
  time: string;
}

const INITIAL_ORDERS: SimulatedOrder[] = [
  {
    id: 'KOT #1042',
    source: 'Dine-In',
    sourceIcon: <ShoppingBag className="w-3.5 h-3.5 text-saffron-600" />,
    tableOrOrder: 'Table 04',
    items: ['2x Paneer Tikka Butter Masala', '4x Butter Naan', '1x Sweet Lassi'],
    amount: 680,
    status: 'Cooking',
    time: '2 mins ago',
  },
  {
    id: 'KOT #1043',
    source: 'QR Order',
    sourceIcon: <QrCode className="w-3.5 h-3.5 text-curry-600" />,
    tableOrOrder: 'Table 09',
    items: ['1x Filter Coffee Decoction', '2x Ghee Podi Roast Dosa'],
    amount: 320,
    status: 'Ready',
    time: '4 mins ago',
  },
  {
    id: 'KOT #1044',
    source: 'Zomato',
    sourceIcon: <Smartphone className="w-3.5 h-3.5 text-red-500" />,
    tableOrOrder: 'Delivery #492',
    items: ['1x Dum Chicken Biryani (Family Pack)', '2x Mirchi Ka Salan'],
    amount: 790,
    status: 'New',
    time: 'Just now',
  },
];

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [orders, setOrders] = useState<SimulatedOrder[]>(INITIAL_ORDERS);
  const [isPaused, setIsPaused] = useState(false);
  const [runningTotal, setRunningTotal] = useState(2890);

  // Dynamic KOT ticket loop (pauses on hover and static on reduced motion)
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const sources: Array<SimulatedOrder['source']> = ['Dine-In', 'Swiggy', 'QR Order', 'Zomato', 'Phone'];
    const sampleItems = [
      { items: ['1x Masala Chai', '2x Bun Maska'], amount: 160 },
      { items: ['2x Dal Makhani', '3x Garlic Naan'], amount: 540 },
      { items: ['1x Veg Hyderabadi Biryani', '1x Raita'], amount: 380 },
      { items: ['1x Cold Brew', '1x Blueberry Cheesecake'], amount: 410 },
      { items: ['2x Chole Bhature Platter'], amount: 340 },
    ];

    const interval = setInterval(() => {
      setOrders((prev) => {
        const nextId = `KOT #${1040 + Math.floor(Math.random() * 800)}`;
        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        const randomItem = sampleItems[Math.floor(Math.random() * sampleItems.length)];
        const sourceIcon =
          randomSource === 'QR Order' ? (
            <QrCode className="w-3.5 h-3.5 text-curry-600" />
          ) : randomSource === 'Zomato' || randomSource === 'Swiggy' ? (
            <Smartphone className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5 text-saffron-600" />
          );

        const newOrder: SimulatedOrder = {
          id: nextId,
          source: randomSource,
          sourceIcon,
          tableOrOrder: randomSource === 'Dine-In' || randomSource === 'QR Order' ? `Table ${Math.floor(Math.random() * 12) + 1}` : `Online #${Math.floor(Math.random() * 900) + 100}`,
          items: randomItem.items,
          amount: randomItem.amount,
          status: 'New',
          time: 'Just now',
        };

        setRunningTotal((tot) => tot + randomItem.amount);
        return [newOrder, prev[0], prev[1]].slice(0, 3);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isPaused]);

  return (
    <section className="relative pt-6 sm:pt-12 pb-16 sm:pb-24 overflow-hidden font-sans">
      {/* Background Decorative Mesh & Kitchen Dots */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#E57A1F_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 dark:opacity-10 pointer-events-none" />

      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {/* Top Announcement Chip */}
            <div className="inline-flex items-center gap-2">
              <Badge variant="saffron" pulseDot>
                {t.hero.badge}
              </Badge>
              <span className="text-xs font-semibold text-saffron-700 dark:text-saffron-300 hidden sm:inline">
                ⚡ 24h Website Included
              </span>
            </div>

            {/* Main H1 Title */}
            <h1 className="h1-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 leading-[1.08] tracking-tight">
              {t.hero.title}
            </h1>

            {/* Sub-line */}
            <p className="text-base sm:text-lg text-maroon-900/80 dark:text-cream-200/80 leading-relaxed max-w-xl font-normal">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a href={SITE_CONTENT.links.demo}>
                <Button
                  variant="saffron"
                  size="lg"
                  fullWidth
                  analyticsEvent="demo_cta_click"
                  eventPayload={{ location: 'hero_primary' }}
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  {t.hero.ctaPrimary}
                </Button>
              </a>

              <a href={SITE_CONTENT.links.website24h}>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  analyticsEvent="demo_cta_click"
                  eventPayload={{ location: 'hero_secondary_24h' }}
                  icon={<Sparkles className="w-4 h-4 text-saffron-500" />}
                >
                  {t.hero.ctaSecondary}
                </Button>
              </a>
            </div>

            {/* Trust Micro-Bullets */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-maroon-800/70 dark:text-cream-300/70">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-curry-600 dark:text-curry-400 shrink-0" />
                <span>Zero hardware lock-in</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-curry-600 dark:text-curry-400 shrink-0" />
                <span>100% Offline KOT Engine</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-curry-600 dark:text-curry-400 shrink-0" />
                <span>No Credit Card Required</span>
              </span>
            </div>
          </div>

          {/* Right Interactive Live KOT Order Stream & Thermal Bill */}
          <div
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Interactive Live Order Stream"
          >
            {/* Soft Ambient Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-saffron-500/20 to-maroon-500/10 rounded-3xl blur-xl -z-10" />

            <ReceiptCard
              sawtooth="both"
              theme="paper"
              className="p-5 sm:p-6 shadow-receipt-lg border-2 border-receipt-divider dark:border-maroon-800"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-dashed border-receipt-divider dark:border-maroon-800 font-sans">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-curry-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-curry-600" />
                  </span>
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-maroon-900 dark:text-cream-100">
                    {t.hero.liveTicker}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-receipt-faint">
                  <Clock className="w-3 h-3" />
                  <span>Real-time</span>
                </div>
              </div>

              {/* Dynamic KOT Tickets Drop Stream */}
              <div className="space-y-3 min-h-[260px]">
                {orders.map((order, idx) => {
                  const isLatest = idx === 0 && !prefersReducedMotion;
                  return (
                    <div
                      key={order.id}
                      className={`p-3.5 rounded-xl border border-receipt-divider dark:border-maroon-800/80 bg-paper-light dark:bg-maroon-900/40 transition-all shadow-sm ${
                        isLatest ? 'animate-ticket-drop' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                        <div className="flex items-center gap-1.5 font-bold text-maroon-950 dark:text-cream-50">
                          {order.sourceIcon}
                          <span>{order.id}</span>
                          <span className="text-receipt-faint font-normal font-sans">({order.tableOrOrder})</span>
                        </div>
                        <span
                          className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full uppercase ${
                            order.status === 'Ready'
                              ? 'bg-curry-100 text-curry-800 dark:bg-curry-950 dark:text-curry-300'
                              : order.status === 'Cooking'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-saffron-100 text-saffron-800 dark:bg-saffron-950 dark:text-saffron-300'
                          }`}
                        >
                          {order.status === 'Ready'
                            ? t.hero.statusReady
                            : order.status === 'Cooking'
                            ? t.hero.statusCooking
                            : t.hero.statusNew}
                        </span>
                      </div>

                      <ul className="text-xs text-maroon-900/80 dark:text-cream-200/80 font-sans space-y-0.5 pl-1">
                        {order.items.map((item, i) => (
                          <li key={i} className="truncate">
                            • {item}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-dashed border-receipt-divider/60 dark:border-maroon-800/50 text-xs font-mono">
                        <span className="text-receipt-faint text-[10px]">{order.time}</span>
                        <span className="font-bold text-saffron-700 dark:text-saffron-400">
                          {formatINR(order.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tear Line */}
              <div className="relative my-4">
                <div className="receipt-tear-line w-full" />
              </div>

              {/* Bottom Thermal Summary Bar */}
              <div className="flex items-center justify-between pt-1 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-maroon-800 dark:text-cream-200">
                  <Printer className="w-3.5 h-3.5 text-saffron-600" />
                  <span className="font-sans font-semibold text-[11px]">{t.hero.totalBill}:</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-base text-maroon-950 dark:text-cream-50">
                    {formatINR(runningTotal)}
                  </span>
                  <span className="block text-[9px] text-curry-600 dark:text-curry-400 font-sans font-semibold">
                    GST @ 5% Auto Calculated
                  </span>
                </div>
              </div>
            </ReceiptCard>

            {/* Hover Notice for Desktop */}
            <div className="hidden sm:flex items-center justify-center gap-1.5 mt-2 text-[11px] font-mono text-receipt-faint">
              <RotateCcw className="w-3 h-3" />
              <span>{isPaused ? 'Paused on hover' : 'Live ticket drop simulator active'}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
