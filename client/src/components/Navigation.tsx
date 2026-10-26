import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  Receipt,
  Printer,
  LogOut,
  Menu as MenuIcon,
  X,
  Store,
  TrendingUp,
  Layers,
  Sparkles,
  Coins,
  Settings,
  User,
  ChevronDown,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  Coffee,
} from 'lucide-react';
import { Restaurant, Manager } from '../types';
import { Logo } from './Logo';
import { useProfile } from '../context/ProfileContext';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  restaurant: Restaurant | null;
  manager: Manager | null;
  onLogout: () => void;
  pendingOrdersCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  setCurrentTab,
  restaurant,
  manager,
  onLogout,
  pendingOrdersCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const {
    profile,
    subscription,
    setActiveTab: setProfileTab,
  } = useProfile();

  const displayName = restaurant?.name || profile?.fullName || 'The Chai & Chaat Co.';
  
  const getInitials = (name: string) => {
    if (!name) return 'SS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  // Grouped Navigation per brief: Operations vs Business
  const operationItems = [
    {
      id: 'orders',
      label: 'Live Orders',
      icon: UtensilsCrossed,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      urgent: pendingOrdersCount > 0
    },
    {
      id: 'aggregators',
      label: 'Aggregator Hub',
      icon: Layers,
      badge: 'Swiggy+Zomato'
    },
    {
      id: 'tables',
      label: 'Tables & QR',
      icon: QrCode
    },
    {
      id: 'printer',
      label: 'Kitchen Printer',
      icon: Printer
    },
  ];

  const businessItems = [
    {
      id: 'growth',
      label: 'Growth Engine',
      icon: Sparkles,
      badge: 'AI'
    },
    {
      id: 'crm',
      label: 'CRM & Loyalty',
      icon: Coins,
      badge: 'Coins'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp
    },
    {
      id: 'menu',
      label: 'Menu & Stock',
      icon: Store
    },
    {
      id: 'bills',
      label: 'Bills & Invoices',
      icon: Receipt
    },
    {
      id: 'settings',
      label: 'Settings & GST',
      icon: Settings
    },
  ];

  // Mobile Bottom Bar (5 quick touch items)
  const mobileBottomItems = [
    { id: 'orders', label: 'Orders', icon: UtensilsCrossed, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: 'growth', label: 'Growth', icon: Sparkles, badge: 'AI' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: Store },
  ];

  return (
    <>
      {/* Desktop Fixed Sidebar - Permanently Open */}
      <aside className="hidden lg:flex flex-col fixed top-0 bottom-0 left-0 w-60 bg-[#1B1226] text-slate-100 border-r border-white/[0.08] select-none justify-between z-30">
        {/* Top: Brand & Outlet Info */}
        <div className="p-4 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <Logo variant="horizontal" theme="dark" size={30} showTagline={false} />
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              Live
            </span>
          </div>

          <div className="w-full mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center gap-2.5 p-1.5 -mx-1.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-orange-500/30 shrink-0 bg-[#251A12] flex items-center justify-center">
              <Coffee className="w-4 h-4 text-orange-400" />
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">
                {restaurant?.name || 'The Chai & Chaat Co.'}
              </p>
              <p className="text-[10px] text-stone-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {restaurant?.city || 'Bengaluru'} • Operational
              </p>
            </div>
          </div>
        </div>

        {/* Grouped Navigation Links */}
        <div className="flex-1 p-3 space-y-5 overflow-y-auto no-scrollbar">
          {/* Operations Section */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operations
            </p>
            <nav className="space-y-1">
              {operationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-brand-500/12 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {/* Left Accent Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-brand-500" />
                    )}

                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && item.badge !== undefined && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Business Section */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Business
            </p>
            <nav className="space-y-1">
              {businessItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-brand-500/12 text-white font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-brand-500" />
                    )}

                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {(item as any).badge && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-linear-to-r from-violet-500 to-indigo-500 text-white shadow-xs">
                        {(item as any).badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Professional Profile Button: Replaced the old Logout Button */}
        <div ref={profileMenuRef} className="relative p-2.5 border-t border-white/[0.08] bg-[#140C1D] shrink-0">
          {/* Dropdown Menu (pops up above footer) */}
          {isProfileMenuOpen && (
            <div 
              className="absolute bottom-full left-2 right-2 mb-2 bg-[#1C120C] text-stone-200 border border-white/[0.12] rounded-2xl p-2 shadow-2xl space-y-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 truncate">{restaurant?.city || 'Bengaluru'}, {restaurant?.state || 'Karnataka'}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-semibold text-emerald-400">
                    {subscription?.remainingDays || 180} days remaining
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentTab('profile');
                  setProfileTab('overview');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-orange-400" />
                <span>Profile & Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentTab('profile');
                  setProfileTab('subscription');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>My Subscription</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/25">
                  {subscription?.status || 'ACTIVE'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentTab('profile');
                  setProfileTab('security');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Security & Password</span>
              </button>

              <div className="pt-1 border-t border-white/[0.06] mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setCurrentTab('profile');
                    setProfileTab('account');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Log Out...</span>
                </button>
              </div>
            </div>
          )}

          {/* Profile button trigger */}
          <div
            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${
              currentTab === 'profile'
                ? 'bg-orange-500/15 border-orange-500/40 text-white shadow-sm'
                : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] text-stone-200'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setCurrentTab('profile');
                setIsProfileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer group"
              title="Open Profile & Account Dashboard"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  <Coffee className="w-4 h-4 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#140C1D]" />
              </div>
              <div className="text-left overflow-hidden min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                  {displayName}
                </p>
                <p className="text-[10px] text-stone-400 truncate">
                  {restaurant?.city || 'Operational'} • {subscription?.remainingDays || 180}d
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsProfileMenuOpen(prev => !prev);
              }}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0 ml-1"
              title="Toggle Quick Menu"
              aria-label="Toggle quick menu"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isProfileMenuOpen ? 'rotate-180 text-orange-400' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header - Pinned Fixed to Top */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#1B1226]/95 backdrop-blur-md text-white border-b border-white/[0.08] px-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Logo variant="mark" theme="dark" size={26} />
          <div className="overflow-hidden">
            <h1 className="font-bold text-xs text-white leading-tight truncate">
              {restaurant?.name || 'Swaad Sevak'}
            </h1>
            <p className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {currentTab} Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentTab('profile')}
            title="Profile & Account Management"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
              currentTab === 'profile'
                ? 'bg-orange-500/20 border-orange-500/40 text-white'
                : 'bg-white/[0.05] border-white/[0.08] text-slate-300 hover:text-white'
            }`}
            aria-label="Profile and account"
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-[10px]">
              <Coffee className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold max-w-[80px] truncate hidden xs:inline">{displayName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.05] active:scale-95 transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer (When hamburger clicked) */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-[#1B1226] border-t border-white/[0.1] rounded-t-3xl p-4 sm:p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Logo variant="mark" theme="dark" size={26} />
                <div className="overflow-hidden">
                  <span className="font-bold text-sm text-white block truncate">{restaurant?.name || 'Swaad Sevak'}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{restaurant?.city || 'Dining Room'}</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.05] active:scale-95 transition-all"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">Operations</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {operationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-left border text-xs font-semibold transition-all active:scale-98 ${
                        isActive
                          ? 'bg-brand-500/15 border-brand-500/40 text-brand-400 shadow-xs'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-200 hover:bg-white/[0.06]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge !== null && item.badge !== undefined && (
                        <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">Business & Growth</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {businessItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl text-left border text-xs font-semibold transition-all active:scale-98 ${
                        isActive
                          ? 'bg-brand-500/15 border-brand-500/40 text-brand-400 shadow-xs'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-200 hover:bg-white/[0.06]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {(item as any).badge && (
                        <span className="ml-auto px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-xs">
                          {(item as any).badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-300 font-medium truncate">{displayName}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentTab('profile');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-semibold py-1.5 px-3 rounded-lg bg-orange-500/10 border border-orange-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar (1-Thumb Touch with Safe-Area) */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B1226]/95 backdrop-blur-md border-t border-white/[0.08] flex items-center justify-around px-1 pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.35)]"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
      >
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl text-[10px] font-medium transition-all active:scale-90 relative flex-1 max-w-[72px] ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              )}
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-amber-400 scale-110' : 'text-slate-400'}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 shadow-xs animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5 tracking-tight truncate w-full text-center">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
