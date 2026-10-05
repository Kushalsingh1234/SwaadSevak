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
  ArrowRight,
} from 'lucide-react';
import { formatINR } from '../../lib/utils';

export const FeaturesBentoSection: React.FC = () => {
  const { t } = useTranslation();

  // Interactive states for micro-demos
  const [offlineState, setOfflineState] = useState<'offline' | 'online'>('offline');
  const [stockItemCount, setStockItemCount] = useState(12);
  const [kdsStatus, setKdsStatus] = useState<'cooking' | 'ready'>('cooking');

  return (
    <section id="features" className="py-16 sm:py-24 font-sans bg-white dark:bg-ink-950">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="ember" className="mb-3">
            {t.features.badge}
          </Badge>
          <h2 className="h2-fluid font-bold text-ink-950 dark:text-ink-50 mb-3">
            {t.features.title}
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            {t.features.subtitle}
          </p>
        </div>

        {/* Bento Grid (8 Tiles) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          {/* Tile 1: 3-Click Billing & KOT (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between hover:border-ink-400 dark:hover:border-ink-600 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-3 rounded-2xl bg-ember-50 dark:bg-ember-950/80 text-ember-600">
                  <Printer className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200">
                  58mm / 80mm ESC-POS
                </span>
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-ink-950 dark:text-ink-50 mb-2">
                {t.features.billingTitle}
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-6">
                {t.features.billingDesc}
              </p>
            </div>

            {/* Micro Live Demo */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-xs font-mono space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-[11px] text-ink-500 border-b border-ink-100 dark:border-ink-800 pb-1">
                <span>TOUCH SEQUENCE: #01 → #03 → #FIRE</span>
                <span className="text-success-600 font-bold">KOT PRINTED</span>
              </div>
              <div className="flex items-center justify-between font-bold text-ink-900 dark:text-ink-100">
                <span>Table 07 • 2x Masala Dosa + 1x Filter Coffee</span>
                <span className="text-ember-600 dark:text-ember-400">₹290</span>
              </div>
            </div>
          </div>

          {/* Tile 2: Recipe-Level Inventory */}
          <div className="p-6 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between hover:border-ink-400 dark:hover:border-ink-600 transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-success-50 dark:bg-success-950/80 text-success-600 mb-4">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink-950 dark:text-ink-50 mb-1.5">
                {t.features.inventoryTitle}
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                {t.features.inventoryDesc}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-[11px] font-mono space-y-1">
              <div className="flex justify-between">
                <span>1x Butter Chicken:</span>
                <span className="font-bold text-danger-600">-220g Chicken</span>
              </div>
              <div className="flex justify-between text-ink-500">
                <span>Paneer Stock Level:</span>
                <span className="font-bold text-success-600">{stockItemCount} kg Left</span>
              </div>
            </div>
          </div>

          {/* Tile 3: All Aggregators Sync */}
          <div className="p-6 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between hover:border-ink-400 dark:hover:border-ink-600 transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink-950 dark:text-ink-50 mb-1.5">
                {t.features.aggregatorsTitle}
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                {t.features.aggregatorsDesc}
              </p>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                Zomato + Swiggy
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">Auto Sync</span>
            </div>
          </div>

          {/* Tile 4: 80+ Reports */}
          <div className="p-6 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between hover:border-ink-400 dark:hover:border-ink-600 transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink-950 dark:text-ink-50 mb-1.5">
                {t.features.reportsTitle}
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                {t.features.reportsDesc}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-[11px] font-mono flex items-center justify-between">
              <span>GSTR-1 Tax Ready</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">Export CSV</span>
            </div>
          </div>

          {/* Tile 5: Customer Loyalty & CRM */}
          <div className="p-6 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between hover:border-ink-400 dark:hover:border-ink-600 transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-success-50 dark:bg-success-950/80 text-success-600 mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink-950 dark:text-ink-50 mb-1.5">
                {t.features.crmTitle}
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                {t.features.crmDesc}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-[11px] font-mono flex items-center justify-between">
              <span>WhatsApp Tax Invoices</span>
              <span className="font-bold text-success-600">Automated</span>
            </div>
          </div>

          {/* Tile 6: Table QR Scan & Order */}
          <div className="p-6 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between hover:border-ink-400 dark:hover:border-ink-600 transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-ember-50 dark:bg-ember-950/80 text-ember-600 mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink-950 dark:text-ink-50 mb-1.5">
                {t.features.qrTitle}
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                {t.features.qrDesc}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-[11px] font-mono flex items-center justify-between">
              <span>No App Download</span>
              <span className="font-bold text-ember-600 dark:text-ember-400">Web Menu</span>
            </div>
          </div>

          {/* Tile 7: Kitchen Display System (KDS) */}
          <div className="p-6 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between hover:border-ink-400 dark:hover:border-ink-600 transition-all">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 mb-4">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink-950 dark:text-ink-50 mb-1.5">
                {t.features.kdsTitle}
              </h3>
              <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                {t.features.kdsDesc}
              </p>
            </div>

            <div
              onClick={() => setKdsStatus(kdsStatus === 'cooking' ? 'ready' : 'cooking')}
              className="p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-[11px] font-mono flex items-center justify-between cursor-pointer select-none"
            >
              <span>Chef Timer: 08:34m</span>
              <span className={`font-bold uppercase ${kdsStatus === 'ready' ? 'text-success-600' : 'text-amber-600'}`}>
                {kdsStatus === 'ready' ? '✓ Served' : '🔥 Cooking'}
              </span>
            </div>
          </div>

          {/* Tile 8: 100% Offline Resilience (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between hover:border-ink-400 dark:hover:border-ink-600 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-3 rounded-2xl bg-success-50 dark:bg-success-950/80 text-success-600">
                  <WifiOff className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-300">
                  Local Sync Engine
                </span>
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-ink-950 dark:text-ink-50 mb-2">
                {t.features.offlineTitle}
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-6">
                {t.features.offlineDesc}
              </p>
            </div>

            {/* Interactive Toggle */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    offlineState === 'offline' ? 'bg-amber-500' : 'bg-success-500'
                  }`}
                />
                <span className="font-mono font-semibold text-ink-900 dark:text-ink-100">
                  Status: {offlineState === 'offline' ? 'Broadband Offline (Local Cache Active)' : 'Broadband Connected'}
                </span>
              </div>
              <button
                onClick={() => setOfflineState(offlineState === 'offline' ? 'online' : 'offline')}
                className="px-3 py-1.5 rounded-lg bg-ink-950 text-white dark:bg-ink-800 text-xs font-semibold hover:bg-ink-900 cursor-pointer"
              >
                Simulate {offlineState === 'offline' ? 'Online' : 'Internet Drop'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
