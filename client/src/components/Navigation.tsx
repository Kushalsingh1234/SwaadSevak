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
  Store
} from 'lucide-react';
import { Restaurant, Manager } from '../types';

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

  const navItems = [
    { id: 'orders', label: 'Orders', icon: UtensilsCrossed, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: Store },
    { id: 'tables', label: 'Tables & QR', icon: QrCode },
    { id: 'bills', label: 'Bills', icon: Receipt },
    { id: 'printer', label: 'Kitchen Printer', icon: Printer },
  ];

  // Primary 5 tabs for the mobile bottom bar
  const mobileBottomItems = [
    { id: 'orders', label: 'Orders', icon: UtensilsCrossed, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: Store },
    { id: 'tables', label: 'Tables', icon: QrCode },
    { id: 'bills', label: 'Bills', icon: Receipt },
  ];

  return (
    <>
      {/* Static Desktop Sidebar (Fixed, never scrolls, Logout permanently pinned to bottom) */}
      <aside className="hidden lg:flex flex-col w-60 fixed top-0 bottom-0 left-0 bg-slate-900 text-white border-r border-slate-800 select-none justify-between z-30">
        {/* Brand & Restaurant Identity */}
        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-base tracking-tight shrink-0">
              S
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm tracking-tight text-white leading-tight">
                Swaad Sevak
              </h1>
              <p className="text-[11px] text-gray-400">
                Restaurant OS
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-gray-200 truncate">{restaurant?.name || 'Restaurant'}</p>
            <p className="text-[11px] text-gray-400 truncate">{restaurant?.city || 'Dining Room'}</p>
          </div>
        </div>

        {/* Navigation Items (Static, clean, no inner scrollbar) */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-600 text-white font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Manager Profile & Static Logout Footer (Always pinned & visible) */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-gray-200 truncate">{manager?.username || 'Manager'}</p>
              <p className="text-[10px] text-gray-400">Shift Manager</p>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden flex items-center justify-between px-3.5 py-2.5 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 w-full">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
            S
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-xs text-white leading-tight truncate">
              {restaurant?.name || 'Swaad Sevak'}
            </h1>
            <p className="text-[10px] text-gray-400 capitalize">
              {currentTab} Service
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Drawer for all options */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[49px] bg-slate-950/80 backdrop-blur-xs z-50 flex flex-col justify-between">
          <nav className="p-3 space-y-1 bg-slate-900 border-b border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-600 text-white font-semibold'
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between px-1">
              <div>
                <p className="text-xs font-medium text-white">{manager?.username || 'Manager'}</p>
                <p className="text-[10px] text-gray-400">Shift Manager</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-950/40 hover:bg-red-900/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Fast 1-Thumb Switching for Restaurant Ops) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around py-1.5 px-1 shadow-lg">
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors relative min-w-[54px] ${
                isActive
                  ? 'text-orange-500 font-semibold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
