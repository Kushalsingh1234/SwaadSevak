import React, { useState } from 'react';
import {
  CreditCard,
  Calendar,
  Clock,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { RenewSubscriptionModal } from './RenewSubscriptionModal';

export const MySubscriptionSection: React.FC = () => {
  const { subscription, setTestExpiryDays } = useProfile();
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            My Subscription
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Manage your billing cycle, active plan features, and renewal schedule.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRenewModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-stone-950" />
          <span>Renew Subscription</span>
        </button>
      </div>

      {/* Warning Banners based on Status */}
      {subscription.status === 'EXPIRING_SOON' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3.5 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-300">
              Subscription Expiring Soon ({subscription.remainingDays} Days Remaining)
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Your active subscription plan is scheduled to expire on <strong>{formatDate(subscription.expiryDate)}</strong>. Renew now to prevent interruption of your live kitchen display (KOT), customer QR ordering, and table management.
            </p>
            <div className="pt-1.5">
              <button
                onClick={() => setIsRenewModalOpen(true)}
                className="text-xs font-black text-stone-950 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Renew Before Expiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {subscription.status === 'EXPIRED' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-start gap-3.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-red-300">
              Subscription Expired
            </h4>
            <p className="text-xs text-red-200/90 leading-relaxed">
              Your plan expired on <strong>{formatDate(subscription.expiryDate)}</strong>. To resume uninterrupted POS billing and kitchen printer dispatch, please choose a renewal plan below.
            </p>
            <div className="pt-1.5">
              <button
                onClick={() => setIsRenewModalOpen(true)}
                className="text-xs font-black text-white px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Re-Activate Subscription</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Hero Subscription Card (Stripe/Linear Luxury Card) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#24160D] via-[#1C120C] to-[#170E08] border border-white/[0.12] p-6 sm:p-9 shadow-2xl space-y-7">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Title & Top Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 block mb-1">
              MY CURRENT PLAN
            </span>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {subscription.planName}
              </h3>
              {subscription.status === 'ACTIVE' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE
                </span>
              )}
              {subscription.status === 'EXPIRING_SOON' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  EXPIRING SOON
                </span>
              )}
              {subscription.status === 'EXPIRED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                  EXPIRED
                </span>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-400 block">Subscription Price</span>
            <span className="text-2xl sm:text-3xl font-black text-white">
              ₹{subscription.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Inclusive of all taxes
            </span>
          </div>
        </div>

        {/* Lifecycle Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[11px] font-semibold text-stone-400 block">Subscription Duration</span>
            <span className="text-sm font-bold text-white mt-1 block">{subscription.durationLabel}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[11px] font-semibold text-stone-400 block">Subscription Start Date</span>
            <span className="text-sm font-bold text-white mt-1 block">{formatDate(subscription.startDate)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[11px] font-semibold text-stone-400 block">Subscription Expiry Date</span>
            <span className="text-sm font-bold text-amber-400 mt-1 block">{formatDate(subscription.expiryDate)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[11px] font-semibold text-stone-400 block">Days Remaining</span>
            <span className={`text-base font-black mt-1 block ${
              subscription.remainingDays <= 7 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {subscription.remainingDays} Days
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar Section */}
        <div className="space-y-2.5 p-5 rounded-2xl bg-black/30 border border-white/[0.06]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-300 font-medium">
              Subscription Usage Progress: <strong className="text-white">{subscription.progressPercent}%</strong>
            </span>
            <span className="text-stone-400">
              {subscription.usedDays} of {subscription.totalDays} Total Days Consumed
            </span>
          </div>

          <div className="h-3 w-full bg-white/[0.06] rounded-full overflow-hidden border border-white/[0.08] relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                subscription.status === 'EXPIRED'
                  ? 'bg-red-500'
                  : subscription.status === 'EXPIRING_SOON'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                  : 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400'
              }`}
              style={{ width: `${subscription.progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
            <span>Started: {formatDate(subscription.startDate)}</span>
            <span>Expires: {formatDate(subscription.expiryDate)}</span>
          </div>
        </div>

        {/* Feature Entitlements in Active Plan */}
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
            Included Operating System Capabilities
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-stone-300">Live Kitchen Display &amp; KOT System</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-stone-300">Direct QR Digital Ordering (0% Commission)</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-stone-300">GST-Compliant Automated Bill Printing</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-stone-300">Multi-Device Counter &amp; Tablet Sync</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-stone-300">Aggregator Hub (Swiggy + Zomato Sync)</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-stone-300">24/7 Priority Manager Concierge Support</span>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Active Transaction ID: <code className="text-white font-mono">{subscription.transactionId}</code></span>
          </div>

          <button
            type="button"
            onClick={() => setIsRenewModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Renew Subscription</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Testing Dynamic Status Switcher (Interactive Sandbox for Verification) */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-400">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Interactive Expiry Simulator (Verify dynamic date calculations):</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTestExpiryDays(124)}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              subscription.remainingDays > 7
                ? 'bg-emerald-500 text-stone-950 shadow-sm'
                : 'bg-white/[0.06] text-stone-400 hover:text-white'
            }`}
          >
            Active (124d)
          </button>
          <button
            type="button"
            onClick={() => setTestExpiryDays(4)}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              subscription.remainingDays <= 7 && subscription.remainingDays > 0
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'bg-white/[0.06] text-stone-400 hover:text-white'
            }`}
          >
            Expiring Soon (4d)
          </button>
          <button
            type="button"
            onClick={() => setTestExpiryDays(0)}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              subscription.remainingDays === 0
                ? 'bg-red-500 text-white shadow-sm'
                : 'bg-white/[0.06] text-stone-400 hover:text-white'
            }`}
          >
            Expired (0d)
          </button>
        </div>
      </div>

      {/* Renew Subscription Modal */}
      <RenewSubscriptionModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
      />
    </div>
  );
};
