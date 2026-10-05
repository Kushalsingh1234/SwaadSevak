import React, { useState } from 'react';
import { SITE_CONTENT, OutletType } from '../../content/site';
import { useTranslation } from '../../i18n';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { CheckCircle2, Store } from 'lucide-react';

export const OutletTypesSection: React.FC = () => {
  const { language } = useTranslation();
  const [activeOutletId, setActiveOutletId] = useState<string>('cafe');

  const tabs = SITE_CONTENT.outletTypes.map((outlet) => ({
    id: outlet.id,
    label: language === 'hi' ? outlet.nameHi : outlet.name,
    badge: outlet.badge,
  }));

  const activeOutlet: OutletType =
    SITE_CONTENT.outletTypes.find((o) => o.id === activeOutletId) || SITE_CONTENT.outletTypes[0];

  return (
    <section id="outlets" className="py-16 sm:py-24 font-sans bg-ink-50/50 dark:bg-ink-900/30 border-t border-ink-200/80 dark:border-ink-800">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <Badge variant="neutral" className="mb-3">
            Tailored Outlet Workflows
          </Badge>
          <h2 className="h2-fluid font-bold text-ink-950 dark:text-ink-50 mb-3">
            Built for how your specific food business runs
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            From a single-counter chai bar to a 50-outlet quick-service franchise, SwaadSevak adapts to your order flow.
          </p>
        </div>

        {/* Animated Tabs */}
        <div className="mb-10 flex justify-center">
          <Tabs
            tabs={tabs}
            activeTab={activeOutletId}
            onChange={setActiveOutletId}
            variant="ticket"
          />
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
          
          {/* Details (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="ember">{activeOutlet.badge}</Badge>
                <span className="text-xs font-mono text-ink-400">
                  Profile #{activeOutlet.id.toUpperCase()}
                </span>
              </div>

              <h3 className="font-bold text-xl sm:text-2xl text-ink-950 dark:text-ink-50 mb-2">
                {language === 'hi' ? activeOutlet.nameHi : activeOutlet.name}
              </h3>

              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-6">
                {activeOutlet.tagline}
              </p>

              <div className="space-y-3">
                {activeOutlet.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-800 dark:text-ink-200">
                    <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-ink-400 block">
                  {activeOutlet.highlightLabel}
                </span>
                <span className="font-mono font-bold text-xl text-ember-600 dark:text-ember-400">
                  {activeOutlet.highlightMetric}
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200">
                1-Click Preset
              </span>
            </div>
          </div>

          {/* Tailored Mini Mockup (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between">
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-ink-100 dark:border-ink-800">
                <span className="font-bold text-ink-950 dark:text-ink-50 font-sans">
                  {activeOutlet.name} Configuration
                </span>
                <span className="text-[10px] bg-success-50 dark:bg-success-950 text-success-600 dark:text-success-400 px-2 py-0.5 rounded font-bold">
                  Preset Ready
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950/60 border border-ink-200/80 dark:border-ink-800 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-ink-500">Order Routing:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Automated</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-ink-500">Printer Format:</span>
                  <span className="font-bold text-ink-900 dark:text-ink-100">58mm & 80mm ESC/POS</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-ink-500">Tax Schedule:</span>
                  <span className="font-bold text-ink-900 dark:text-ink-100">5% Indian GST Compliant</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-ember-50 dark:bg-ember-950/40 border border-ember-200 dark:border-ember-800/60 text-ember-800 dark:text-ember-200 text-xs font-sans">
                <span className="font-bold block mb-0.5">Staff Onboarding Speed:</span>
                <p className="text-[11px] leading-relaxed text-ember-900/80 dark:text-ember-200/80">
                  Kitchen staff learn menu codes and KOT billing in under 15 minutes.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
