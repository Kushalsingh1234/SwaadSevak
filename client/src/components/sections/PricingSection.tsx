import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { SITE_CONTENT, PricingPlan } from '../../content/site';
import { formatINR } from '../../lib/utils';
import { trackEvent } from '../../lib/analytics';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  const handleToggleBilling = (annual: boolean) => {
    setIsAnnual(annual);
    trackEvent('pricing_plan_select', { billingCycle: annual ? 'annual' : 'monthly' });
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 font-sans bg-ink-50/50 dark:bg-ink-900/30 border-t border-ink-200/80 dark:border-ink-800">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <Badge variant="ember" className="mb-3">
            {t.pricing.badge}
          </Badge>
          <h2 className="h2-fluid font-bold text-ink-950 dark:text-ink-50 mb-3">
            {t.pricing.title}
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            {t.pricing.subtitle}
          </p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-2 p-1 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-soft">
            <button
              onClick={() => handleToggleBilling(false)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                !isAnnual
                  ? 'bg-ink-950 text-white dark:bg-ink-800 shadow-xs'
                  : 'text-ink-600 dark:text-ink-400 hover:text-ink-950'
              }`}
            >
              {t.pricing.monthly}
            </button>
            <button
              onClick={() => handleToggleBilling(true)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                isAnnual
                  ? 'bg-gradient-ember text-ink-950 font-bold shadow-xs'
                  : 'text-ink-600 dark:text-ink-400 hover:text-ink-950'
              }`}
            >
              <span>{t.pricing.annual}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/10 text-ink-950">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch text-left">
          {SITE_CONTENT.pricingPlans.map((plan) => {
            const price = isAnnual ? plan.annualPricePerMonth : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'bg-white dark:bg-ink-900 border-2 border-ember-500 shadow-card ring-1 ring-ember-500/20 lg:-translate-y-2'
                    : 'bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-soft'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-ember-500 text-ink-950 text-xs font-bold uppercase tracking-wider shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.pricing.mostPopular}
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="font-bold text-xl text-ink-950 dark:text-ink-50 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-ink-500 dark:text-ink-400 min-h-[32px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Header */}
                  <div className="pb-6 mb-6 border-b border-ink-100 dark:border-ink-800">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono font-bold text-3xl sm:text-4xl text-ink-950 dark:text-ink-50">
                        {formatINR(price)}
                      </span>
                      <span className="text-xs text-ink-500 font-mono">/ month</span>
                    </div>
                    <span className="text-[11px] text-ink-500 dark:text-ink-400 block mt-1">
                      {isAnnual ? 'Billed annually' : 'Billed month-to-month, cancel anytime'}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 text-xs sm:text-sm text-ink-800 dark:text-ink-200">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-success-600 dark:text-success-400 shrink-0 mt-0.5" />
                        <span className={feature.includes('Zomato') ? 'font-semibold' : ''}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <a href={SITE_CONTENT.links.demo}>
                    <Button
                      variant={plan.popular ? 'ember' : 'outline'}
                      size="md"
                      fullWidth
                      analyticsEvent="pricing_plan_select"
                      eventPayload={{ planId: plan.id, isAnnual }}
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      {plan.ctaText}
                    </Button>
                  </a>
                  <span className="block text-[11px] text-center text-ink-400 font-mono">
                    {plan.hardwareSupport}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* What Costs Extra? */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-soft text-left">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-ember-500" />
            <h3 className="font-bold text-base text-ink-950 dark:text-ink-50">
              {t.pricing.whatCostsExtra}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-600 dark:text-ink-300">
            {SITE_CONTENT.pricingExtraNotes.map((note, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950/60 border border-ink-200/80 dark:border-ink-800">
                {note}
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table vs Typical Old POS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-soft text-left overflow-x-auto">
          <h3 className="font-bold text-lg text-ink-950 dark:text-ink-50 mb-6">
            {t.pricing.comparisonTitle}
          </h3>

          <table className="w-full text-left text-xs sm:text-sm font-sans min-w-[500px]">
            <thead>
              <tr className="border-b border-ink-200 dark:border-ink-800 pb-3 text-xs uppercase font-mono text-ink-500">
                <th className="py-3 font-bold">Key Capability</th>
                <th className="py-3 font-bold text-ember-600 dark:text-ember-400">SwaadSevak Platform</th>
                <th className="py-3 font-bold text-ink-400">Legacy POS Software</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {SITE_CONTENT.comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-ink-50/50">
                  <td className="py-3.5 font-semibold text-ink-950 dark:text-ink-50 pr-4">
                    {row.feature}
                  </td>
                  <td className="py-3.5 font-bold text-success-600 dark:text-success-400 pr-4">
                    ✓ {row.swaadSevak}
                  </td>
                  <td className="py-3.5 text-ink-500">
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
