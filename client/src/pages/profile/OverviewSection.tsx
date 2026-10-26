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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ACTIVE
        </span>
      );
    }
    if (subscription.status === 'EXPIRING_SOON') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3.5 h-3.5" />
          EXPIRING SOON
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
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
      {/* Top Banner Card: Profile Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50/60 via-white to-orange-50/60 border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Restaurant Emblem */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-md">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white" title="Restaurant Active">
                ✓
              </div>
            </div>

            {/* Name & Identity */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {restaurantProfile.restaurantName || 'The Chai & Chaat Co.'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 border border-orange-200 text-orange-700">
                  <Sparkles className="w-2.5 h-2.5" />
                  RESTAURANT PROFILE
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Restaurant
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Managed by @{profile.username} • {restaurantProfile.restaurantType || 'Café & Bistro'}
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-2 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{restaurantProfile.address || 'Indiranagar'}, {restaurantProfile.city || 'Bengaluru'}</span>
                <span className="text-slate-300">•</span>
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{restaurantProfile.phone || profile.phone}</span>
              </p>
            </div>
          </div>

          {/* Action CTA: Manage Details */}
          <div className="flex items-center gap-2.5 shrink-0 self-stretch lg:self-auto">
            <button
              onClick={() => onNavigateTab('restaurant')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Store className="w-4 h-4 text-orange-500" />
              <span>Manage Restaurant Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Subscription */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 relative overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">Current Plan</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">{subscription.planName}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              <strong className="text-orange-600 font-bold">{subscription.remainingDays} days</strong> remaining
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('subscription')}
            className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center justify-between cursor-pointer group"
          >
            <span>Manage Plan</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Card 2: Restaurant Profile */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 relative overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">Restaurant Profile</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-black text-slate-900 truncate" title={restaurantProfile.restaurantName || 'The Chai & Chaat Co.'}>
              {restaurantProfile.restaurantName || 'The Chai & Chaat Co.'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 truncate">
              {restaurantProfile.city || 'Bengaluru'} • {restaurantProfile.restaurantType || 'Café & Bistro'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
            <button
              onClick={() => onNavigateTab('restaurant')}
              className="text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View Restaurant Info</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Account Member Since */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 relative overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">Member Since</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-black text-slate-900">
              {formatDate(profile.createdAt)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Verified Partner
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between cursor-pointer group"
          >
            <span>Billing Invoices</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Subscription Quick Visual & Renewal Callout */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Subscription Lifecycle
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-medium">
                Expires on <strong className="text-slate-900">{formatDate(subscription.expiryDate)}</strong>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{subscription.usedDays} Days Elapsed</span>
                <span className="font-bold text-slate-900">{subscription.remainingDays} Days Remaining</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${subscription.progressPercent}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Your {subscription.planName} provides zero commission orders, live kitchen KOT display, and automatic GST bills.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-stretch lg:self-auto">
            <button
              onClick={() => onNavigateTab('subscription')}
              className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer flex-1 lg:flex-initial text-center shadow-xs"
            >
              View Plan Details
            </button>
            <button
              onClick={onOpenRenewModal}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-105 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer flex-1 lg:flex-initial text-center"
            >
              Renew Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
          Account Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigateTab('restaurant')}
            className="p-4 rounded-2xl bg-white hover:bg-orange-50/40 border border-slate-200/90 hover:border-orange-300 text-left transition-all cursor-pointer group shadow-xs hover:shadow-sm"
          >
            <Store className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Restaurant Profile</h4>
            <p className="text-xs text-slate-500 mt-0.5">GST, FSSAI, Address &amp; Branding assets</p>
          </button>

          <button
            onClick={() => onNavigateTab('security')}
            className="p-4 rounded-2xl bg-white hover:bg-orange-50/40 border border-slate-200/90 hover:border-orange-300 text-left transition-all cursor-pointer group shadow-xs hover:shadow-sm"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Security &amp; Password</h4>
            <p className="text-xs text-slate-500 mt-0.5">Change password &amp; verified Google login</p>
          </button>

          <button
            onClick={() => onNavigateTab('notifications')}
            className="p-4 rounded-2xl bg-white hover:bg-orange-50/40 border border-slate-200/90 hover:border-orange-300 text-left transition-all cursor-pointer group shadow-xs hover:shadow-sm"
          >
            <Sparkles className="w-5 h-5 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Notification Alerts</h4>
            <p className="text-xs text-slate-500 mt-0.5">Expiry reminders &amp; payment confirmations</p>
          </button>
        </div>
      </div>
    </div>
  );
};
