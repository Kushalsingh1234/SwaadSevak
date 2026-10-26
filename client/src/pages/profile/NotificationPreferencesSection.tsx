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
      badgeColor: 'text-orange-700 bg-orange-50 border-orange-200',
    },
    {
      key: 'paymentAlerts' as const,
      label: 'Payment & Billing Notifications',
      description: 'Receive GST tax invoices, renewal receipts, and transaction confirmation alerts immediately after checkout.',
      icon: CreditCard,
      badge: 'Billing',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      key: 'securityUpdates' as const,
      label: 'Important Account & Security Alerts',
      description: 'Critical notifications about password resets, new device logins, and restaurant authorization modifications.',
      icon: ShieldAlert,
      badge: 'Security',
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
    },
    {
      key: 'productAnnouncements' as const,
      label: 'Product Announcements & New Features',
      description: 'Be the first to know about new POS features, KOT optimizations, Swiggy/Zomato sync updates, and inventory tools.',
      icon: Sparkles,
      badge: 'Updates',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      key: 'promotions' as const,
      label: 'Promotional Offers & Discounts',
      description: 'Special annual renewal discounts, partner hardware offers (thermal printers, barcode scanners), and festival promos.',
      icon: Tag,
      badge: 'Offers',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white text-emerald-800 border border-emerald-200 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="text-xs font-semibold">{saveToast}</span>
        </div>
      )}

      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Notification Preferences</h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage how SwaadSevak communicates important billing, operational, and security events.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toggles List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-sm">
        <div className="divide-y divide-slate-100">
          {notificationItems.map((item) => {
            const Icon = item.icon;
            const isEnabled = notifications[item.key];
            return (
              <div
                key={item.key}
                className="py-5 first:pt-0 last:pb-0 flex items-start justify-between gap-4 transition-colors hover:bg-slate-50/70 rounded-2xl px-2"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-orange-50/80 border border-orange-200/60 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-bold text-slate-900">{item.label}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
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
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/30 mt-1 ${
                    isEnabled ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
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
      <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-4 h-4 shrink-0 text-orange-600 mt-0.5" />
        <p className="leading-relaxed text-[11px] text-slate-600">
          <strong className="text-orange-950 font-semibold">Firebase Firestore Cloud Sync:</strong> Preferences are automatically persisted locally and synchronized to the user settings collection on change. Expiry reminders and critical security alerts will be transmitted to both your registered email and SMS phone number.
        </p>
      </div>
    </div>
  );
};
