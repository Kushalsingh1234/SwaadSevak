import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { Restaurant, Manager } from '../types';
import { Logo } from './Logo';

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

          <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
            <div className="overflow-hidden pr-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{restaurant?.name || 'My Restaurant'}</p>
              <p className="text-[10px] text-slate-400 truncate">{restaurant?.city || 'Dining Room'}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="System Online" />
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

        {/* Manager Footer: Pinned to bottom, static */}
        <div className="p-3 border-t border-white/[0.08] bg-[#140C1D] shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{manager?.username || 'Shift Manager'}</p>
              <p className="text-[10px] text-slate-400">Shift Active</p>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-red-400 hover:bg-white/[0.06] transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-3.5 py-2.5 bg-[#1B1226] text-white border-b border-white/[0.08] sticky top-0 z-40 w-full">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Logo variant="mark" theme="dark" size={26} />
          <div className="overflow-hidden">
            <h1 className="font-bold text-xs text-white leading-tight truncate">
              {restaurant?.name || 'Swaad Sevak'}
            </h1>
            <p className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {currentTab} Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/[0.06] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer (When hamburger clicked) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-[#1B1226] border-t border-white/[0.1] rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Logo variant="mark" theme="dark" size={24} />
                <span className="font-bold text-sm text-white">{restaurant?.name || 'Swaad Sevak'}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Operations</p>
              <div className="grid grid-cols-2 gap-2">
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
                      className={`flex items-center gap-2 p-3 rounded-xl text-left border text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-500/15 border-brand-500/40 text-brand-400'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.badge !== null && item.badge !== undefined && (
                        <span className="ml-auto px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Business</p>
              <div className="grid grid-cols-2 gap-2">
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
                      className={`flex items-center gap-2 p-3 rounded-xl text-left border text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-500/15 border-brand-500/40 text-brand-400'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-xs text-slate-400">{manager?.username || 'Manager'}</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium py-1 px-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar (1-Thumb Touch) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B1226]/95 backdrop-blur-md border-t border-white/[0.08] flex items-center justify-around py-1 px-1">
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors relative min-w-[56px] ${
                isActive ? 'text-brand-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
