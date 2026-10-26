import React from 'react';
import {
  User,
  Store,
  CreditCard,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { ProfileTabId } from '../../types/profile';

interface OverviewSectionProps {
  onNavigateTab: (tab: ProfileTabId) => void;
  onOpenRenewModal: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  onNavigateTab,
  onOpenRenewModal,
}) => {
  const { profile, restaurantProfile, subscription } = useProfile();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'SS';
  };

  const getStatusBadge = () => {
    if (subscription.status === 'ACTIVE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ACTIVE
        </span>
      );
    }
    if (subscription.status === 'EXPIRING_SOON') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5" />
          EXPIRING SOON
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30">
        EXPIRED
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card: Café Outlet & Profile Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#20140D] via-[#1A0F0A] to-[#25150C] border border-white/[0.1] p-6 sm:p-8 shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-orange-500/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Café Logo / Outlet Emblem */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-stone-950 font-black text-xl sm:text-2xl flex items-center justify-center shadow-xl">
                <Store className="w-8 h-8 text-stone-950" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#1A0F0A] flex items-center justify-center text-[10px] text-white" title="Outlet Active Online">
                ✓
              </div>
            </div>

            {/* Name & Identity */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {restaurantProfile.restaurantName || 'The Chai & Chaat Co.'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 border border-orange-500/30 text-orange-400">
                  <Sparkles className="w-2.5 h-2.5" />
                  RESTAURANT PROFILE
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Restaurant
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">
                Managed by @{profile.username} • {restaurantProfile.restaurantType || 'Café & Bistro'}
              </p>
              <p className="text-xs text-stone-300 flex items-center gap-2 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{restaurantProfile.address || 'Indiranagar'}, {restaurantProfile.city || 'Bengaluru'}</span>
                <span className="text-stone-500">•</span>
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{restaurantProfile.phone || profile.phone}</span>
              </p>
            </div>
          </div>

          {/* Action CTA: Manage Details */}
          <div className="flex items-center gap-2.5 shrink-0 self-stretch lg:self-auto">
            <button
              onClick={() => onNavigateTab('restaurant')}
              className="px-4 py-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-xs font-bold text-orange-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/10"
            >
              <Store className="w-4 h-4 text-orange-400" />
              <span>Manage Restaurant Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Subscription */}
        <div className="p-5 rounded-2xl bg-[#1C120C]/90 border border-white/[0.08] relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-stone-400">Current Plan</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">{subscription.planName}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-stone-400 mt-1">
              <strong className="text-orange-400 font-bold">{subscription.remainingDays} days</strong> remaining
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('subscription')}
            className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center justify-between cursor-pointer group"
          >
            <span>Manage Plan</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Card 2: Restaurant Profile */}
        <div className="p-5 rounded-2xl bg-[#1C120C]/90 border border-white/[0.08] relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-stone-400">Restaurant Profile</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-black text-white truncate" title={restaurantProfile.restaurantName || 'The Chai & Chaat Co.'}>
              {restaurantProfile.restaurantName || 'The Chai & Chaat Co.'}
            </h3>
            <p className="text-xs text-stone-400 mt-1 truncate">
              {restaurantProfile.city || 'Bengaluru'} • {restaurantProfile.restaurantType || 'Café & Bistro'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-bold">
            <button
              onClick={() => onNavigateTab('restaurant')}
              className="text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Restaurant Info</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Account Member Since */}
        <div className="p-5 rounded-2xl bg-[#1C120C]/90 border border-white/[0.08] relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-stone-400">Member Since</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-black text-white">
              {formatDate(profile.createdAt)}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Verified Partner
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center justify-between cursor-pointer group"
          >
            <span>Billing Invoices</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Subscription Quick Visual & Renewal Callout */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1C120C]/90 border border-white/[0.1] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Subscription Lifecycle
              </span>
              <span className="text-xs text-stone-500">•</span>
              <span className="text-xs text-stone-300 font-medium">
                Expires on <strong className="text-white">{formatDate(subscription.expiryDate)}</strong>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>{subscription.usedDays} Days Elapsed</span>
                <span className="font-bold text-white">{subscription.remainingDays} Days Remaining</span>
              </div>
              <div className="h-2.5 w-full bg-white/[0.06] rounded-full overflow-hidden border border-white/[0.08]">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${subscription.progressPercent}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-stone-400">
              Your {subscription.planName} provides zero commission orders, live kitchen KOT display, and automatic GST bills.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-stretch lg:self-auto">
            <button
              onClick={() => onNavigateTab('subscription')}
              className="px-4 py-3 rounded-xl border border-white/[0.1] text-xs font-bold text-stone-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer flex-1 lg:flex-initial text-center"
            >
              View Plan Details
            </button>
            <button
              onClick={onOpenRenewModal}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex-1 lg:flex-initial text-center"
            >
              Renew Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-3">
          Account Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigateTab('restaurant')}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-left transition-all cursor-pointer group"
          >
            <Store className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Restaurant Profile</h4>
            <p className="text-xs text-stone-400 mt-0.5">GST, FSSAI, Address &amp; Branding assets</p>
          </button>

          <button
            onClick={() => onNavigateTab('security')}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-left transition-all cursor-pointer group"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Security &amp; Password</h4>
            <p className="text-xs text-stone-400 mt-0.5">Change password &amp; verified Google login</p>
          </button>

          <button
            onClick={() => onNavigateTab('notifications')}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-left transition-all cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">Notification Alerts</h4>
            <p className="text-xs text-stone-400 mt-0.5">Expiry reminders &amp; payment confirmations</p>
          </button>
        </div>
      </div>
    </div>
  );
};
