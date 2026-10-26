import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Building2, Wallet, ArrowRight, Lock } from 'lucide-react';
import { SubscriptionPlan } from '../../types/auth';
import { RAZORPAY_CONFIG } from '../../config/subscriptionPlans';

interface RazorpayModalPlaceholderProps {
  isOpen: boolean;
  plan: SubscriptionPlan;
  onClose: () => void;
  onSuccess: () => void;
}

export const RazorpayModalPlaceholder: React.FC<RazorpayModalPlaceholderProps> = ({
  isOpen,
  plan,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('restaurantowner@okhdfcbank');

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0C2340] text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-blue-500/30 overflow-hidden flex flex-col relative font-sans">
        
        {/* Top Razorpay Header Bar */}
        <div className="bg-[#08182B] px-5 py-4 border-b border-blue-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs tracking-wider text-blue-200">RAZORPAY CHECKOUT</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  TEST MODE
                </span>
              </div>
              <p className="text-[11px] text-blue-300/80">{RAZORPAY_CONFIG.companyName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Plan Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-blue-950/40 px-5 py-4 border-b border-blue-900/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-blue-300 font-semibold">
              Selected Subscription
            </span>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {plan.name} ({plan.durationLabel})
            </h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-blue-300/80 block uppercase">Total Payable</span>
            <span className="text-xl font-black text-white tracking-tight">₹{plan.price.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Integration Notice Alert */}
        <div className="mx-5 mt-4 p-3 rounded-xl bg-blue-950/70 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-white block font-semibold">Razorpay Architecture Preparation:</strong>
            In production, this modal opens using the real Razorpay Web SDK. Click below to simulate an approved test transaction.
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2 bg-[#08182B] p-1 rounded-xl border border-blue-900/40">
            <button
              type="button"
              onClick={() => setActiveTab('upi')}
              className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeTab === 'upi' ? 'bg-blue-600 text-white shadow' : 'text-blue-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>UPI / QR</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeTab === 'card' ? 'bg-blue-600 text-white shadow' : 'text-blue-300 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Card</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('netbanking')}
              className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeTab === 'netbanking' ? 'bg-blue-600 text-white shadow' : 'text-blue-300 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Netbanking</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'upi' && (
            <div className="space-y-3 bg-[#08182B] p-4 rounded-xl border border-blue-900/40">
              <label className="block text-[11px] font-semibold text-blue-200">Virtual Payment Address (VPA)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#0C2340] border border-blue-700/40 text-white text-xs outline-none focus:border-blue-400 font-mono"
                  placeholder="name@upi"
                />
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/30"
                >
                  Verify
                </button>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-blue-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant confirmation via PhonePe, GPay, Paytm</span>
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-3 bg-[#08182B] p-4 rounded-xl border border-blue-900/40">
              <div>
                <label className="block text-[11px] font-semibold text-blue-200 mb-1">Card Number (Mock)</label>
                <input
                  type="text"
                  readOnly
                  value="4111 •••• •••• 1111 (Test Visa)"
                  className="w-full px-3 py-2 rounded-lg bg-[#0C2340] border border-blue-700/40 text-blue-200 text-xs font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-blue-200 mb-1">Expiry</label>
                  <input
                    type="text"
                    readOnly
                    value="12/28"
                    className="w-full px-3 py-2 rounded-lg bg-[#0C2340] border border-blue-700/40 text-blue-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-blue-200 mb-1">CVV</label>
                  <input
                    type="password"
                    readOnly
                    value="123"
                    className="w-full px-3 py-2 rounded-lg bg-[#0C2340] border border-blue-700/40 text-blue-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'netbanking' && (
            <div className="space-y-2 bg-[#08182B] p-4 rounded-xl border border-blue-900/40">
              <span className="text-[11px] text-blue-200 font-semibold block mb-2">Popular Indian Banks</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((b) => (
                  <div key={b} className="p-2 rounded-lg bg-[#0C2340] border border-blue-700/30 text-blue-200 font-medium">
                    {b}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSimulatePayment}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Authorizing Test Payment...</span>
            ) : (
              <>
                <span>Confirm &amp; Pay ₹{plan.price.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Security Footer */}
        <div className="bg-[#08182B] px-5 py-3 border-t border-blue-900/50 flex items-center justify-center gap-2 text-[11px] text-blue-300/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured by Razorpay • PCI-DSS Level 1 Compliant</span>
        </div>
      </div>
    </div>
  );
};
