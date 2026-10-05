import React, { useState } from 'react';
import { SITE_CONTENT, OutletType } from '../../content/site';
import { useTranslation } from '../../i18n';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { ReceiptCard } from '../ui/ReceiptCard';
import { CheckCircle2, Sparkles, TrendingUp, Store } from 'lucide-react';

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
    <section id="outlets" className="py-16 sm:py-24 bg-cream-100/40 dark:bg-maroon-900/10 font-sans">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <Badge variant="maroon" className="mb-3">
            Tailored Workflows
          </Badge>
          <h2 className="h2-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 mb-3">
            Built for how your specific kitchen operates
          </h2>
          <p className="text-sm sm:text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
            Whether you run a 4-table artisanal cafe, a 10-brand cloud kitchen, or a 30-outlet franchise, SwaadSevak adapts to your floor plan.
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="mb-10 flex justify-center">
          <Tabs
            tabs={tabs}
            activeTab={activeOutletId}
            onChange={setActiveOutletId}
            variant="ticket"
          />
        </div>

        {/* Tab Content Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Details (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="saffron">{activeOutlet.badge}</Badge>
                <span className="text-xs font-mono font-semibold text-receipt-faint">
                  Workflow Profile #{activeOutlet.id.toUpperCase()}
                </span>
              </div>

              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-maroon-950 dark:text-cream-50 mb-2">
                {language === 'hi' ? activeOutlet.nameHi : activeOutlet.name}
              </h3>

              <p className="text-sm sm:text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed mb-6">
                {activeOutlet.tagline}
              </p>

              <div className="space-y-3.5">
                {activeOutlet.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-maroon-900/90 dark:text-cream-100">
                    <CheckCircle2 className="w-4 h-4 text-curry-600 dark:text-curry-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Highlight Metric */}
            <div className="mt-8 pt-6 border-t border-dashed border-receipt-divider dark:border-maroon-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-receipt-faint block">
                  {activeOutlet.highlightLabel}
                </span>
                <span className="font-serif font-bold text-xl sm:text-2xl text-saffron-600 dark:text-saffron-400">
                  {activeOutlet.highlightMetric}
                </span>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-cream-200 dark:bg-maroon-900 text-maroon-800 dark:text-cream-200">
                1-Click Preset Setup
              </span>
            </div>
          </div>

          {/* Right Tailored Mini Screen Mockup (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <ReceiptCard
              sawtooth="top"
              theme="paper"
              ticketNumber={`CONFIG #${activeOutlet.id.toUpperCase()}`}
              ticketType={activeOutlet.badge}
              ticketTime="Floor Presets Active"
              className="p-6 border-2 border-receipt-divider shadow-receipt-lg text-left"
            >
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-cream-100 dark:bg-maroon-900/50 border border-receipt-divider">
                  <span className="text-[10px] text-receipt-faint block">ACTIVE FLOOR TEMPLATE</span>
                  <span className="font-bold text-sm text-maroon-950 dark:text-cream-50 font-sans">
                    {activeOutlet.name} Dynamic Queue
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] pb-1 border-b border-dashed">
                    <span>Feature Routing:</span>
                    <span className="text-curry-600 font-bold">Enabled</span>
                  </div>
                  <div className="flex justify-between text-[11px] pb-1 border-b border-dashed">
                    <span>Hardware Integration:</span>
                    <span className="font-bold">Any Thermal / Tablet</span>
                  </div>
                  <div className="flex justify-between text-[11px] pb-1 border-b border-dashed">
                    <span>GST Format:</span>
                    <span className="font-bold">5% / 18% Input Credit</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-saffron-50 dark:bg-saffron-950/40 border border-saffron-200 dark:border-saffron-800 text-saffron-900 dark:text-saffron-200 text-xs">
                  <span className="font-bold block font-sans mb-0.5">Staff Onboarding Guarantee:</span>
                  <p className="text-[11px] font-sans leading-relaxed">
                    Designed specifically for fast Indian restaurant staff training in &lt;15 mins.
                  </p>
                </div>
              </div>
            </ReceiptCard>
          </div>

        </div>
      </div>
    </section>
  );
};
