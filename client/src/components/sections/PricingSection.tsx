import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { SITE_CONTENT } from '../../content/site';
import { formatINR } from '../../lib/utils';
import { trackEvent } from '../../lib/analytics';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  const handleToggleBilling = (annual: boolean) => {
    setIsAnnual(annual);
    trackEvent('pricing_plan_select', { billingCycle: annual ? 'annual' : 'monthly' });
  };

  return (
    <section id="pricing" className="py-6 sm:py-8 font-sans bg-cream text-espresso border-b border-sand-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand-100 border border-sand-200 text-[10.5px] font-semibold text-espresso shadow-soft mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="h2-fluid font-extrabold text-espresso tracking-tight mb-1.5">
            Predictable Plans with Zero Hidden Fees
          </h2>
          <p className="text-[11px] sm:text-xs text-bodyText leading-relaxed">
            No proprietary hardware locks, no unexpected maintenance contracts. Scale smoothly as your restaurant grows.
          </p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="mt-3.5 inline-flex items-center gap-1 p-0.5 rounded-xl bg-white border border-sand-200 shadow-soft">
            <button
              onClick={() => handleToggleBilling(false)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                !isAnnual
                  ? 'bg-espresso text-white shadow-soft'
                  : 'text-bodyText hover:text-espresso'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => handleToggleBilling(true)}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                isAnnual
                  ? 'bg-orange-500 text-espresso shadow-soft'
                  : 'text-bodyText hover:text-espresso'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[8px] uppercase font-bold tracking-wider px-1 py-0.2 rounded bg-black/10 text-espresso">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards: Starter, Growth, Scale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 mb-6 sm:mb-8 items-stretch text-left">
          {SITE_CONTENT.pricingPlans.map((plan) => {
            const price = isAnnual ? plan.annualPricePerMonth : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-card-lg p-3.5 sm:p-4 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'bg-white border-2 border-orange-500 shadow-card ring-2 ring-orange-500/20 lg:-translate-y-1'
                    : 'bg-white border border-sand-200 shadow-soft'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-espresso text-[9.5px] font-extrabold uppercase tracking-wider shadow-sm">
                      <Sparkles className="w-2.5 h-2.5" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-2.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-espresso">
                        {plan.name}
                      </h3>
                      <span className="text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded bg-sand-100 text-bodyText">
                        {plan.outletsLimit}
                      </span>
                    </div>
                    <p className="text-[10px] text-bodyText min-h-[24px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Header */}
                  <div className="pb-2.5 mb-2.5 border-b border-sand-200">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono font-extrabold text-lg sm:text-xl text-espresso">
                        {formatINR(price)}
                      </span>
                      <span className="text-[10px] text-bodyText font-medium">/ month</span>
                    </div>
                    <span className="text-[9px] font-mono text-walnut font-bold block mt-0.5">
                      {isAnnual ? 'Billed annually (20% discount applied)' : 'Billed month-to-month'}
                    </span>
                    <span className="text-[8px] font-mono text-walnut/80 block mt-0.5 font-bold">
                      TODO: PLACEHOLDER PRICING
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[9px] font-mono font-bold text-espresso uppercase block">
                      Included Features:
                    </span>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-1.5 text-[10px] text-bodyText">
                        <Check className="w-2.5 h-2.5 text-orange-dark shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA & Hardware Support */}
                <div>
                  <div className="text-[9px] text-bodyText font-medium mb-2 p-1.5 rounded-lg bg-sand-50 border border-sand-200">
                    <span className="font-bold text-espresso">Hardware: </span>
                    {plan.hardwareSupport}
                  </div>

                  <a
                    href={SITE_CONTENT.links.demo}
                    data-event="pricing_plan_cta_click"
                    onClick={() => trackEvent('pricing_plan_cta_click', { plan: plan.id })}
                    className={`btn-shine w-full py-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-orange-500 text-espresso hover:bg-orange-600 shadow-soft'
                        : 'bg-espresso text-white hover:bg-cocoa'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparent "What Costs Extra" Notice */}
        <div className="max-w-xl mx-auto p-3 sm:p-3.5 rounded-xl bg-white border border-sand-200 text-left shadow-soft">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-[11.5px] sm:text-xs text-espresso">
                Transparent Notice: What is Not Included or Costs Extra
              </h4>
              <ul className="space-y-0.5 text-[10px] text-bodyText">
                {SITE_CONTENT.pricingExtraNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-orange-dark font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
