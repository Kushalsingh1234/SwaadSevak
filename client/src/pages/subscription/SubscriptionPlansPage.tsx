import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Zap,
  Star,
  Clock,
  HelpCircle
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, DEFAULT_PLAN_ID } from '../../config/subscriptionPlans';
import { SubscriptionPlan } from '../../types/auth';
import { useAuthOnboarding } from '../../context/AuthOnboardingContext';
import { RazorpayModalPlaceholder } from '../../components/payment/RazorpayModalPlaceholder';
import { SwaadSevakLogo } from '../../components/ui/SwaadSevakLogo';

interface SubscriptionPlansPageProps {
  onPlanConfirmed: (plan: SubscriptionPlan) => void;
  onBackToLanding?: () => void;
}

export const SubscriptionPlansPage: React.FC<SubscriptionPlansPageProps> = ({
  onPlanConfirmed,
  onBackToLanding,
}) => {
  const { selectedPlan, selectPlan } = useAuthOnboarding();
  const [activePlanId, setActivePlanId] = useState<string>(selectedPlan?.id || DEFAULT_PLAN_ID);
  const [showRazorpayDemo, setShowRazorpayDemo] = useState<boolean>(false);

  const activePlan = SUBSCRIPTION_PLANS.find((p) => p.id === activePlanId) || SUBSCRIPTION_PLANS[1];

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setActivePlanId(plan.id);
    selectPlan(plan.id);
  };

  const handleProceedWithPlan = (plan: SubscriptionPlan) => {
    setActivePlanId(plan.id);
    selectPlan(plan.id);
    onPlanConfirmed(plan);
  };

  return (
    <div className="min-h-screen bg-[#1A0F0A] text-[#FFF7ED] flex flex-col justify-between py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans selection:bg-brand-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Saffron Glows */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[650px] h-[500px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-[550px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* Subtle Warm Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 mb-8 sm:mb-12">
        <a
          href="#landing"
          onClick={(e) => {
            if (onBackToLanding) {
              e.preventDefault();
              onBackToLanding();
            }
          }}
          className="focus-ring rounded-lg shrink-0 flex items-center gap-3"
        >
          <SwaadSevakLogo size="md" lightText />
        </a>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400 hidden sm:inline-block">
            Step 2 of 3: Plan Selection
          </span>
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="text-xs text-stone-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              Exit to Home
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto z-10 space-y-10">
        {/* Page Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-500/15 border border-orange-500/30 text-orange-400 shadow-inner">
            <Zap className="w-3 h-3 text-orange-400" />
            Transparent Pricing • No Hidden Fees
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Choose the Perfect Plan for Your Restaurant
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Grow your restaurant business with SwaadSevak. Choose a plan that works for you.
          </p>
        </div>

        {/* 3 Responsive Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = activePlanId === plan.id;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#2E1E14] to-[#20140D] border-2 border-orange-500 shadow-2xl shadow-orange-500/20 lg:-translate-y-2'
                    : 'bg-[#251A12]/90 border border-white/[0.12] hover:border-orange-500/40 shadow-xl'
                } ${isSelected ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-[#1A0F0A]' : ''}`}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 font-black text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{plan.badge || 'MOST POPULAR'}</span>
                  </div>
                )}

                {/* Best Value Badge for 12 months */}
                {!isPopular && plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-stone-950 font-black text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="border-b border-white/[0.08] pb-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-white">{plan.durationLabel}</h3>
                      {plan.savingsLabel && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          {plan.savingsLabel}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-base text-stone-500 line-through font-medium">
                          ₹{plan.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-stone-400">
                      Equivalent to <strong className="text-orange-400">₹{plan.pricePerMonth} / month</strong>
                    </p>
                  </div>

                  {/* Feature List */}
                  <div className="py-6 space-y-3.5">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Everything Included:
                    </span>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            feature.includes('Priority')
                              ? 'bg-amber-400 text-stone-950 font-black'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        <span
                          className={`text-xs leading-relaxed ${
                            feature.includes('Priority')
                              ? 'text-amber-300 font-bold'
                              : 'text-stone-200'
                          }`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Choose Plan CTA Button */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceedWithPlan(plan);
                    }}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer ${
                      isPopular
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-stone-950 shadow-lg shadow-orange-500/25'
                        : isSelected
                        ? 'bg-orange-500 text-stone-950 hover:bg-orange-600'
                        : 'bg-[#140D08] hover:bg-[#1f140c] text-white border border-white/[0.14] hover:border-orange-500/40'
                    }`}
                  >
                    <span>Choose {plan.durationLabel} Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Summary Banner & Razorpay Notice */}
        <div className="bg-[#251A12] border border-white/[0.12] rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Selected Plan Summary
              </span>
              <span className="text-xs text-stone-400">
                Duration: <strong className="text-white">{activePlan.durationLabel}</strong>
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-black text-white">
              {activePlan.name} — ₹{activePlan.price.toLocaleString('en-IN')} (One-time payment)
            </h4>

            <p className="text-xs text-stone-300 max-w-xl">
              Includes full access to all SwaadSevak live kitchen KOT, QR ordering, analytics, menu management, and dedicated restaurant profile.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Payment will be securely processed through <strong>Razorpay</strong> once integrated. No auto-debit without your consent.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            {/* Optional Test Razorpay Preview Modal */}
            <button
              type="button"
              onClick={() => setShowRazorpayDemo(true)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 border border-blue-500/40 text-blue-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>Preview Razorpay Modal</span>
            </button>

            {/* Main Action: Proceed to Restaurant Onboarding */}
            <button
              type="button"
              onClick={() => handleProceedWithPlan(activePlan)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-stone-950 font-black text-xs shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Continue to Restaurant Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Razorpay Interactive Preview Modal */}
      <RazorpayModalPlaceholder
        isOpen={showRazorpayDemo}
        plan={activePlan}
        onClose={() => setShowRazorpayDemo(false)}
        onSuccess={() => {
          setShowRazorpayDemo(false);
          handleProceedWithPlan(activePlan);
        }}
      />

      {/* Footer info */}
      <div className="w-full max-w-6xl mx-auto mt-10 text-center text-xs text-stone-400 border-t border-white/[0.08] pt-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>Questions? Need custom enterprise pricing or multi-outlet setup?</span>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          className="text-orange-400 font-bold hover:underline"
        >
          Chat with Restaurant Success Team →
        </a>
      </div>
    </div>
  );
};
