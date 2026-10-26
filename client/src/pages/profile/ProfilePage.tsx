import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { ProfileTabId } from '../../types/profile';
import {
  LayoutDashboard,
  User,
  Store,
  CreditCard,
  History,
  ShieldCheck,
  Bell,
  Sliders,
  LogOut,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import { OverviewSection } from './OverviewSection';
import { PersonalInfoSection } from './PersonalInfoSection';
import { RestaurantDetailsSection } from './RestaurantDetailsSection';
import { MySubscriptionSection } from './MySubscriptionSection';
import { RenewSubscriptionModal } from './RenewSubscriptionModal';
import { SubscriptionHistorySection } from './SubscriptionHistorySection';
import { SecuritySection } from './SecuritySection';
import { NotificationPreferencesSection } from './NotificationPreferencesSection';
import { AccountSettingsSection } from './AccountSettingsSection';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { DeleteAccountModal } from './DeleteAccountModal';

interface ProfilePageProps {
  onLogout: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout, onNavigateTab }) => {
  const {
    activeTab,
    setActiveTab,
    profile,
    restaurantProfile,
    subscription,
    requestAccountDeletion,
  } = useProfile();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  // Tab definitions
  const tabs = [
    {
      id: 'overview' as ProfileTabId,
      label: 'Profile Overview',
      shortLabel: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'personal' as ProfileTabId,
      label: 'Personal Information',
      shortLabel: 'Personal',
      icon: User,
      badge: null,
    },
    {
      id: 'restaurant' as ProfileTabId,
      label: 'Restaurant Details',
      shortLabel: 'Restaurant',
      icon: Store,
      badge: null,
    },
    {
      id: 'subscription' as ProfileTabId,
      label: 'My Subscription',
      shortLabel: 'Subscription',
      icon: CreditCard,
      badge: subscription.status === 'EXPIRING_SOON' ? 'Expiring' : subscription.status === 'EXPIRED' ? 'Expired' : 'Active',
      badgeColor:
        subscription.status === 'ACTIVE'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : subscription.status === 'EXPIRING_SOON'
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-red-50 text-red-700 border-red-200',
    },
    {
      id: 'history' as ProfileTabId,
      label: 'Subscription History',
      shortLabel: 'History',
      icon: History,
      badge: null,
    },
    {
      id: 'security' as ProfileTabId,
      label: 'Security & Password',
      shortLabel: 'Security',
      icon: ShieldCheck,
      badge: null,
    },
    {
      id: 'notifications' as ProfileTabId,
      label: 'Notifications',
      shortLabel: 'Notifications',
      icon: Bell,
      badge: null,
    },
    {
      id: 'account' as ProfileTabId,
      label: 'Account Settings',
      shortLabel: 'Account',
      icon: Sliders,
      badge: null,
    },
  ];

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    onLogout();
  };

  const getInitials = (name: string) => {
    if (!name) return 'SS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Banner Navigation Bar */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-slate-700 font-semibold">{restaurantProfile.restaurantName || 'Restaurant'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-orange-600 font-bold">Profile & Account</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRenewModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Renew Plan</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-red-300 text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Log out of shift session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile Horizontal Tabs Scroll */}
        <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto flex items-center gap-2 pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 shadow-xs'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.shortLabel}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                      isActive ? 'bg-black/30 text-white' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Layout: Left Sidebar + Right Content */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-20 space-y-4">
            {/* Restaurant Identity Card */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{restaurantProfile.restaurantName || 'The Chai & Chaat Co.'}</h3>
                  <p className="text-[11px] text-slate-500 truncate">{restaurantProfile.city || 'Bengaluru'}, {restaurantProfile.state || 'Karnataka'}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Operational
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-3 shadow-sm space-y-1">
              <div className="px-3 py-2 text-[10px] font-black tracking-wider uppercase text-slate-400">
                Account & Settings
              </div>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-500'
                        }`}
                      />
                      <span className="truncate">{tab.label}</span>
                    </div>

                    {tab.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          isActive
                            ? 'bg-white/20 border-white/30 text-white'
                            : tab.badgeColor
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Sidebar Logout Action */}
              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer group"
                >
                  <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50/50 border border-orange-200/80 text-xs space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">Active License</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {subscription.remainingDays}d Left
                </span>
              </div>
              <p className="text-[11px] text-slate-800 font-bold">
                {subscription.planName}
              </p>
              <button
                type="button"
                onClick={() => setIsRenewModalOpen(true)}
                className="w-full mt-1 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs"
              >
                Renew Subscription
              </button>
            </div>
          </aside>

          {/* Right Main Content Pane */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {activeTab === 'overview' && (
              <OverviewSection
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenRenewModal={() => setIsRenewModalOpen(true)}
              />
            )}
            {activeTab === 'personal' && <PersonalInfoSection />}
            {activeTab === 'restaurant' && <RestaurantDetailsSection />}
            {activeTab === 'subscription' && <MySubscriptionSection />}
            {activeTab === 'history' && <SubscriptionHistorySection />}
            {activeTab === 'security' && <SecuritySection />}
            {activeTab === 'notifications' && <NotificationPreferencesSection />}
            {activeTab === 'account' && (
              <AccountSettingsSection
                onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
                onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        restaurantName={restaurantProfile.restaurantName}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={requestAccountDeletion}
      />

      <RenewSubscriptionModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
      />

    </div>
  );
};
