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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 text-white shrink-0 border-r border-slate-800 select-none">
        {/* Brand & Restaurant Identity */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-base tracking-tight">
              S
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white">
                Swaad Sevak
              </h1>
              <p className="text-[11px] text-gray-400">
                Restaurant OS
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-gray-200 truncate">{restaurant?.name || 'Restaurant'}</p>
            <p className="text-[11px] text-gray-400 truncate">{restaurant?.city || 'India'}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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

        {/* Manager Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-gray-200 truncate">{manager?.username || 'Manager'}</p>
              <p className="text-[11px] text-gray-400">Active Shift</p>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-xs text-white">
            S
          </div>
          <div>
            <h1 className="font-bold text-xs text-white leading-tight">Swaad Sevak</h1>
            <p className="text-[10px] text-gray-400">{restaurant?.name || 'Restaurant'}</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[49px] bg-slate-950/80 backdrop-blur-xs z-50 flex flex-col justify-between">
          <nav className="p-4 space-y-1 bg-slate-900 border-b border-slate-800">
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

            <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white">{manager?.username || 'Manager'}</p>
                <p className="text-[10px] text-gray-400">Shift Manager</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
