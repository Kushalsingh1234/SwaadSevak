import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { SITE_CONTENT, PricingPlan } from '../../content/site';
import { formatINR } from '../../lib/utils';
import { trackEvent } from '../../lib/analytics';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ReceiptCard } from '../ui/ReceiptCard';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  const handleToggleBilling = (annual: boolean) => {
    setIsAnnual(annual);
    trackEvent('pricing_plan_select', { billingCycle: annual ? 'annual' : 'monthly' });
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 font-sans bg-cream-100/50 dark:bg-maroon-900/20 border-t border-receipt-divider dark:border-maroon-800">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <Badge variant="saffron" className="mb-3">
            {t.pricing.badge}
          </Badge>
          <h2 className="h2-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 mb-3">
            {t.pricing.title}
          </h2>
          <p className="text-sm sm:text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
            {t.pricing.subtitle}
          </p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-paper dark:bg-maroon-950 border border-receipt-divider dark:border-maroon-800 shadow-sm">
            <button
              onClick={() => handleToggleBilling(false)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer focus-ring ${
                !isAnnual
                  ? 'bg-maroon-900 text-white shadow-sm'
                  : 'text-maroon-900/70 dark:text-cream-200/70 hover:text-maroon-950'
              }`}
            >
              {t.pricing.monthly}
            </button>
            <button
              onClick={() => handleToggleBilling(true)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer focus-ring ${
                isAnnual
                  ? 'bg-saffron-500 text-white shadow-sm'
                  : 'text-maroon-900/70 dark:text-cream-200/70 hover:text-maroon-950'
              }`}
            >
              <span>{t.pricing.annual}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
          {SITE_CONTENT.pricingPlans.map((plan) => {
            const price = isAnnual ? plan.annualPricePerMonth : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'bg-paper dark:bg-paper-dark border-2 border-saffron-500 shadow-receipt-lg ring-2 ring-saffron-500/20 lg:-translate-y-2'
                    : 'bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-saffron-500 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.pricing.mostPopular}
                    </span>
                  </div>
                )}

                <div>
                  <div className="text-left mb-6">
                    <h3 className="font-serif font-bold text-2xl text-maroon-950 dark:text-cream-50 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-maroon-800/70 dark:text-cream-300/70 min-h-[32px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-left pb-6 mb-6 border-b border-dashed border-receipt-divider dark:border-maroon-800">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif font-bold text-3xl sm:text-4xl text-maroon-950 dark:text-cream-50">
                        {formatINR(price)}
                      </span>
                      <span className="text-xs text-receipt-faint font-mono">/ month</span>
                    </div>
                    <span className="text-[11px] text-maroon-700/80 dark:text-cream-300/80 block mt-1">
                      {isAnnual ? 'Billed annually with 20% savings' : 'Billed month-to-month, cancel anytime'}
                    </span>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-3 text-left mb-8 text-xs sm:text-sm text-maroon-900/90 dark:text-cream-100">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-curry-600 dark:text-curry-400 shrink-0 mt-0.5" />
                        <span className={feature.includes('24 Hours') ? 'font-bold text-saffron-700 dark:text-saffron-300' : ''}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <a href={SITE_CONTENT.links.demo}>
                    <Button
                      variant={plan.popular ? 'saffron' : 'outline'}
                      size="md"
                      fullWidth
                      analyticsEvent="pricing_plan_select"
                      eventPayload={{ planId: plan.id, isAnnual }}
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      {plan.ctaText}
                    </Button>
                  </a>
                  <span className="block text-[11px] text-center text-receipt-faint">
                    {plan.hardwareSupport}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparent Disclosure: What Costs Extra? */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm text-left">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-saffron-500" />
            <h3 className="font-serif font-bold text-lg text-maroon-950 dark:text-cream-50">
              {t.pricing.whatCostsExtra}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-maroon-900/80 dark:text-cream-200/80">
            {SITE_CONTENT.pricingExtraNotes.map((note, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-cream-100/70 dark:bg-maroon-900/40 border border-receipt-divider">
                {note}
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table vs "Typical Old POS" */}
        <div className="p-6 sm:p-8 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm text-left overflow-x-auto">
          <h3 className="font-serif font-bold text-xl text-maroon-950 dark:text-cream-50 mb-6">
            {t.pricing.comparisonTitle}
          </h3>

          <table className="w-full text-left text-xs sm:text-sm font-sans min-w-[500px]">
            <thead>
              <tr className="border-b border-receipt-divider dark:border-maroon-800 pb-3 text-xs uppercase font-mono text-receipt-faint">
                <th className="py-3 font-bold">Key Capability</th>
                <th className="py-3 font-bold text-saffron-600 dark:text-saffron-400">SwaadSevak Platform</th>
                <th className="py-3 font-bold text-maroon-800/60 dark:text-cream-300/60">Typical Old POS Software</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-receipt-divider dark:divide-maroon-800/60">
              {SITE_CONTENT.comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-cream-100/50">
                  <td className="py-3.5 font-semibold text-maroon-950 dark:text-cream-50 pr-4">
                    {row.feature}
                  </td>
                  <td className="py-3.5 font-bold text-curry-700 dark:text-curry-400 pr-4">
                    ✓ {row.swaadSevak}
                  </td>
                  <td className="py-3.5 text-maroon-800/60 dark:text-cream-300/60">
                    ✕ {row.typicalPOS}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
