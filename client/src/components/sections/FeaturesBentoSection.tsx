import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { Badge } from '../ui/Badge';
import {
  Printer,
  Boxes,
  Layers,
  BarChart3,
  HeartHandshake,
  QrCode,
  Tv,
  WifiOff,
  CheckCircle2,
  Bell,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { formatINR } from '../../lib/utils';

export const FeaturesBentoSection: React.FC = () => {
  const { t } = useTranslation();

  // Interactive micro-states for tiles
  const [offlineDemoState, setOfflineDemoState] = useState<'offline' | 'online'>('offline');
  const [stockItemCount, setStockItemCount] = useState(14);
  const [kdsStage, setKdsStage] = useState<'cooking' | 'ready'>('cooking');

  return (
    <section id="features" className="py-16 sm:py-24 bg-cream-100/50 dark:bg-maroon-900/20 font-sans">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="saffron" className="mb-3">
            {t.features.badge}
          </Badge>
          <h2 className="h2-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 mb-4">
            {t.features.title}
          </h2>
          <p className="text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
            {t.features.subtitle}
          </p>
        </div>

        {/* Bento Grid (8 Tiles) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Tile 1: 3-Click Billing & KOT (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between hover:shadow-receipt transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-3 rounded-2xl bg-saffron-100 dark:bg-saffron-950 text-saffron-600">
                  <Printer className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-cream-200 dark:bg-maroon-900 text-maroon-800 dark:text-cream-200">
                  58mm & 80mm Support
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-maroon-950 dark:text-cream-50 mb-2">
                {t.features.billingTitle}
              </h3>
              <p className="text-sm text-maroon-900/70 dark:text-cream-200/70 leading-relaxed mb-6">
                {t.features.billingDesc}
              </p>
            </div>

            {/* Interactive Micro Simulation */}
            <div className="p-4 rounded-2xl bg-cream-50 dark:bg-maroon-950/60 border border-receipt-divider dark:border-maroon-800/80 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-[11px] text-receipt-faint border-b border-dashed pb-1.5">
                <span>TOUCH SEQUENCE: #01 → #03 → #FIRE</span>
                <span className="text-curry-600 font-bold">KOT AUTO PRINTED</span>
              </div>
              <div className="flex items-center justify-between text-maroon-950 dark:text-cream-100 font-bold">
                <span>Table 07 • 2x Masala Dosa + 1x Filter Coffee</span>
                <span className="text-saffron-600">₹290</span>
              </div>
            </div>
          </div>

          {/* Tile 2: Recipe-Level Inventory */}
          <div className="p-6 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between hover:shadow-receipt transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-curry-100 dark:bg-curry-950 text-curry-600 mb-4">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-maroon-950 dark:text-cream-50 mb-2">
                {t.features.inventoryTitle}
              </h3>
              <p className="text-xs text-maroon-900/70 dark:text-cream-200/70 leading-relaxed mb-4">
                {t.features.inventoryDesc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-cream-100 dark:bg-maroon-900/40 text-[11px] font-mono space-y-1">
              <div className="flex justify-between">
                <span>Butter Chicken sold:</span>
                <span className="font-bold text-saffron-600">-220g Chicken</span>
              </div>
              <div className="flex justify-between text-receipt-faint">
                <span>Paneer Stock Level:</span>
                <span className="font-bold text-curry-600">{stockItemCount} kg Left</span>
              </div>
            </div>
          </div>

          {/* Tile 3: All Aggregators Sync */}
          <div className="p-6 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between hover:shadow-receipt transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-maroon-950 dark:text-cream-50 mb-2">
                {t.features.aggregatorsTitle}
              </h3>
              <p className="text-xs text-maroon-900/70 dark:text-cream-200/70 leading-relaxed mb-4">
                {t.features.aggregatorsDesc}
              </p>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cream-100 dark:bg-maroon-900/40 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-curry-500 animate-pulse" />
                Zomato + Swiggy
              </span>
              <span className="text-curry-600 font-bold">1-Screen Sync</span>
            </div>
          </div>

          {/* Tile 4: 80+ Reports & GST */}
          <div className="p-6 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between hover:shadow-receipt transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-maroon-950 dark:text-cream-50 mb-2">
                {t.features.reportsTitle}
              </h3>
              <p className="text-xs text-maroon-900/70 dark:text-cream-200/70 leading-relaxed mb-4">
                {t.features.reportsDesc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-cream-100 dark:bg-maroon-900/40 text-[11px] font-mono flex items-center justify-between">
              <span>GSTR-1 Ready</span>
              <span className="font-bold text-blue-600">Export CSV / Excel</span>
            </div>
          </div>

          {/* Tile 5: Customer Loyalty & WhatsApp */}
          <div className="p-6 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between hover:shadow-receipt transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-maroon-950 dark:text-cream-50 mb-2">
                {t.features.crmTitle}
              </h3>
              <p className="text-xs text-maroon-900/70 dark:text-cream-200/70 leading-relaxed mb-4">
                {t.features.crmDesc}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center justify-between">
              <span>WhatsApp GST Invoices</span>
              <span className="font-bold">Automated</span>
            </div>
          </div>

          {/* Tile 6: Table QR Scan & Order */}
          <div className="p-6 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between hover:shadow-receipt transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-maroon-950 dark:text-cream-50 mb-2">
                {t.features.qrTitle}
              </h3>
              <p className="text-xs text-maroon-900/70 dark:text-cream-200/70 leading-relaxed mb-4">
                {t.features.qrDesc}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/40 text-purple-700 dark:text-purple-300 text-[11px] flex items-center justify-between">
              <span>Zero App Download</span>
              <span className="font-bold">Instant Web Menu</span>
            </div>
          </div>

          {/* Tile 7: Kitchen Display System (KDS) */}
          <div className="p-6 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between hover:shadow-receipt transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 mb-4">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-maroon-950 dark:text-cream-50 mb-2">
                {t.features.kdsTitle}
              </h3>
              <p className="text-xs text-maroon-900/70 dark:text-cream-200/70 leading-relaxed mb-4">
                {t.features.kdsDesc}
              </p>
            </div>

            <div
              onClick={() => setKdsStage(kdsStage === 'cooking' ? 'ready' : 'cooking')}
              className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-800 dark:text-amber-200 text-[11px] flex items-center justify-between cursor-pointer select-none"
            >
              <span>Chef Timer: 08:34 min</span>
              <span className={`font-bold uppercase ${kdsStage === 'ready' ? 'text-curry-600' : 'text-amber-600'}`}>
                {kdsStage === 'ready' ? '✓ Served' : '🔥 Cooking'}
              </span>
            </div>
          </div>

          {/* Tile 8: 100% Offline Resilience (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between hover:shadow-receipt transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-3 rounded-2xl bg-curry-100 dark:bg-curry-950 text-curry-600">
                  <WifiOff className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-curry-100 dark:bg-curry-950 text-curry-700 dark:text-curry-300">
                  Local SQLite Engine
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-maroon-950 dark:text-cream-50 mb-2">
                {t.features.offlineTitle}
              </h3>
              <p className="text-sm text-maroon-900/70 dark:text-cream-200/70 leading-relaxed mb-6">
                {t.features.offlineDesc}
              </p>
            </div>

            {/* Interactive Toggle for Offline demo */}
            <div className="p-4 rounded-2xl bg-cream-50 dark:bg-maroon-950/60 border border-receipt-divider dark:border-maroon-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    offlineDemoState === 'offline' ? 'bg-amber-500' : 'bg-curry-500'
                  }`}
                />
                <span className="font-bold">
                  Status: {offlineDemoState === 'offline' ? 'Broadband Disconnected (Offline Mode)' : 'Broadband Connected'}
                </span>
              </div>
              <button
                onClick={() => setOfflineDemoState(offlineDemoState === 'offline' ? 'online' : 'offline')}
                className="px-3 py-1.5 rounded-lg bg-maroon-900 text-white font-bold text-xs hover:bg-maroon-800 focus-ring cursor-pointer"
              >
                Simulate {offlineDemoState === 'offline' ? 'Online' : 'Internet Drop'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
