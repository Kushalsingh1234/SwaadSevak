import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import {
  Bell,
  Calendar,
  CreditCard,
  ShieldAlert,
  Sparkles,
  Tag,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const NotificationPreferencesSection: React.FC = () => {
  const { notifications, updateNotifications } = useProfile();
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleToggle = (key: keyof typeof notifications) => {
    const updated = !notifications[key];
    updateNotifications({ [key]: updated });
    setSaveToast(`Updated ${key} preference`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const notificationItems = [
    {
      key: 'expiryReminders' as const,
      label: 'Subscription Expiry Reminders',
      description: 'Get automated warnings 7 days and 24 hours prior to plan expiry so counter POS operations never stall.',
      icon: Calendar,
      badge: 'Critical',
      badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    },
    {
      key: 'paymentAlerts' as const,
      label: 'Payment & Billing Notifications',
      description: 'Receive GST tax invoices, renewal receipts, and transaction confirmation alerts immediately after checkout.',
      icon: CreditCard,
      badge: 'Billing',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      key: 'securityUpdates' as const,
      label: 'Important Account & Security Alerts',
      description: 'Critical notifications about password resets, new device logins, and restaurant authorization modifications.',
      icon: ShieldAlert,
      badge: 'Security',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      key: 'productAnnouncements' as const,
      label: 'Product Announcements & New Features',
      description: 'Be the first to know about new POS features, KOT optimizations, Swiggy/Zomato sync updates, and inventory tools.',
      icon: Sparkles,
      badge: 'Updates',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      key: 'promotions' as const,
      label: 'Promotional Offers & Discounts',
      description: 'Special annual renewal discounts, partner hardware offers (thermal printers, barcode scanners), and festival promos.',
      icon: Tag,
      badge: 'Offers',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1C120C] text-emerald-400 border border-emerald-500/30 shadow-2xl animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="text-xs font-semibold">{saveToast}</span>
        </div>
      )}

      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1C120C] via-[#22160F] to-[#1C120C] p-6 sm:p-7 border border-white/[0.08] shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Notification Preferences</h2>
              <p className="text-xs text-stone-400 mt-1">
                Manage how SwaadSevak communicates important billing, operational, and security events.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toggles List */}
      <div className="bg-[#1C120C] rounded-3xl border border-white/[0.08] p-6 space-y-4 shadow-xl">
        <div className="divide-y divide-white/[0.06]">
          {notificationItems.map((item) => {
            const Icon = item.icon;
            const isEnabled = notifications[item.key];
            return (
              <div
                key={item.key}
                className="py-5 first:pt-0 last:pb-0 flex items-start justify-between gap-4 transition-colors hover:bg-white/[0.01] rounded-2xl px-2"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] text-stone-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-bold text-white">{item.label}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isEnabled}
                  onClick={() => handleToggle(item.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/50 mt-1 ${
                    isEnabled ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-stone-700/60'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Info Box */}
      <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 text-xs text-orange-200/90 flex items-start gap-3">
        <Info className="w-4 h-4 shrink-0 text-orange-400 mt-0.5" />
        <p className="leading-relaxed text-[11px] text-stone-400">
          <strong className="text-orange-300">Firebase Firestore Cloud Sync:</strong> Preferences are automatically persisted locally and synchronized to the user settings collection on change. Expiry reminders and critical security alerts will be transmitted to both your registered email and SMS phone number.
        </p>
      </div>
    </div>
  );
};
