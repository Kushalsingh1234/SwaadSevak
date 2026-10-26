import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  Lock,
  Clock,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../config/subscriptionPlans';
import { SubscriptionPlan } from '../../types/auth';
import { RazorpayModalPlaceholder } from '../../components/payment/RazorpayModalPlaceholder';
import { useProfile } from '../../context/ProfileContext';

interface RenewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RenewSubscriptionModal: React.FC<RenewSubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { subscription, renewSubscriptionPlan } = useProfile();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(subscription.planId || '6-months');
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [renewalSuccessMsg, setRenewalSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentSelectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  // Calculate prospective new expiry date
  const now = new Date();
  const currentExpiry = new Date(subscription.expiryDate);
  const baseDate = currentExpiry > now ? currentExpiry : now;
  const prospectiveExpiry = new Date(baseDate.getTime() + currentSelectedPlan.months * 30 * 24 * 60 * 60 * 1000);

  const formatProspectiveDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleOpenPayment = () => {
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = async () => {
    setIsRazorpayOpen(false);
    // As per requirement: Prepare structure for activation after payment verification
    await renewSubscriptionPlan(selectedPlanId);
    setRenewalSuccessMsg(`Plan renewal initiated for ${currentSelectedPlan.name}. In production, backend HMAC webhook extends your expiry date.`);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
        <div className="w-full max-w-4xl bg-white text-slate-800 rounded-3xl border border-slate-200/90 shadow-2xl p-5 sm:p-8 space-y-6 relative my-auto max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-50 border border-orange-200 text-orange-700">
                  <Sparkles className="w-3 h-3 text-orange-600" />
                  RENEW OR UPGRADE SUBSCRIPTION
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-slate-500">Current: {subscription.planName}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                Select Your Subscription Plan
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose a plan to extend your SwaadSevak POS, live KOT display, and WhatsApp billing features.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {renewalSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{renewalSuccessMsg}</span>
            </div>
          )}

          {/* 3 Plans Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = plan.id === selectedPlanId;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`rounded-2xl p-5 border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-orange-50/70 to-amber-50/40 border-2 border-orange-500 shadow-md shadow-orange-500/10 ring-2 ring-orange-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-extrabold text-base text-slate-900">{plan.name}</h3>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <span className="text-xs font-black">✓</span>}
                      </div>
                    </div>

                    <div className="mt-2 mb-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">₹{plan.price.toLocaleString('en-IN')}</span>
                        {plan.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">₹{plan.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-orange-600 font-semibold mt-0.5">
                        ₹{plan.pricePerMonth}/month • {plan.savingsLabel || 'Standard rate'}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-slate-600 text-[11px] leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <span className={`block w-full py-2 rounded-xl text-center text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}>
                      {isSelected ? 'Selected Tier' : 'Choose Plan'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Subscription Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Renewal Order Summary
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Selected Renewal Tier:</span>
                <span className="font-extrabold text-slate-900 text-sm">{currentSelectedPlan.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Duration Extension:</span>
                <span className="font-bold text-amber-700">+{currentSelectedPlan.months} Months ({currentSelectedPlan.months * 30} Days)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Prospective Expiry Date:</span>
                <span className="font-bold text-slate-900">{formatProspectiveDate(prospectiveExpiry)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Total Payable (Incl. Taxes):</span>
                <span className="font-black text-orange-600 text-base">₹{currentSelectedPlan.price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay 256-bit Encrypted Checkout • UPI, NetBanking &amp; Cards</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOpenPayment}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-105 text-white font-black text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Architectural Notice */}
          <p className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-3">
            Architectural Note: Actual subscription activation in production happens automatically when Razorpay webhook <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-mono">order.paid</code> verifies server-side HMAC signature.
          </p>
        </div>
      </div>

      {/* Razorpay Modal Placeholder */}
      <RazorpayModalPlaceholder
        isOpen={isRazorpayOpen}
        plan={currentSelectedPlan}
        onClose={() => setIsRazorpayOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};
