import React, { useState } from 'react';
import {
  Store,
  Check,
  MapPin,
  Coffee,
  X,
  Plus,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { CafeOutlet } from '../types/profile';

interface CafeOutletSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CafeOutletSwitcherModal: React.FC<CafeOutletSwitcherModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { outlets, activeOutlet, switchOutlet } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddSuccess, setShowAddSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredOutlets = outlets.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (outletId: string) => {
    switchOutlet(outletId);
    onClose();
  };

  const handleAddNewBranch = () => {
    setShowAddSuccess('Multi-branch onboarding is available on 6-Month and 12-Month enterprise plans. Contact support to register an additional POS terminal.');
    setTimeout(() => setShowAddSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#1C120C] text-stone-200 rounded-3xl border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-gradient-to-r from-[#22160F] to-[#1C120C]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">Switch Café / Outlet</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  {outlets.length} Branches Active
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Toggle between your restaurant branches to manage live counter orders, KOT & menus.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-white/[0.06] bg-black/20">
          <input
            type="text"
            placeholder="Search branch name, area or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500/50 transition-all"
          />
        </div>

        {/* Notice Message */}
        {showAddSuccess && (
          <div className="mx-4 mt-4 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-xs text-orange-200">
            {showAddSuccess}
          </div>
        )}

        {/* Outlets List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 divide-y-0">
          {filteredOutlets.map((outlet) => {
            const isCurrent = outlet.id === activeOutlet.id;
            return (
              <div
                key={outlet.id}
                onClick={() => handleSelect(outlet.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                  isCurrent
                    ? 'bg-gradient-to-r from-orange-500/15 via-[#251A12] to-orange-500/10 border-orange-500/40 shadow-lg'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Outlet Logo / Emblem */}
                  <div className="relative shrink-0 mt-0.5">
                    {outlet.logoUrl ? (
                      <img
                        src={outlet.logoUrl}
                        alt={outlet.branchName}
                        className="w-12 h-12 rounded-xl object-cover border border-orange-500/30 shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white font-black text-sm shadow-md">
                        <Coffee className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#1C120C]" />
                  </div>

                  {/* Outlet Details */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                        {outlet.branchName}
                      </h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE TERMINAL
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-400 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span>{outlet.area}, {outlet.city}</span>
                      <span className="text-stone-600">•</span>
                      <span className="text-amber-400/90 font-medium">{outlet.type}</span>
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Activity className="w-3 h-3" /> {outlet.ordersActive} Active Orders
                      </span>
                      <span>•</span>
                      <span>{outlet.tablesCount} Tables</span>
                      <span>•</span>
                      <span className="font-mono text-stone-500">FSSAI: {outlet.fssaiNumber.slice(-4)}</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-end">
                  {isCurrent ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] group-hover:bg-orange-500 group-hover:text-white text-stone-300 font-bold text-xs border border-white/[0.08] group-hover:border-orange-500 transition-all flex items-center gap-1.5"
                    >
                      <span>Switch Outlet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: Register New Branch */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-black/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-400 text-center sm:text-left">
            <span className="text-white font-semibold">Need another cafe branch?</span>
            <p className="text-[11px] text-stone-500">Multi-outlet sync links inventory, KOT, and central revenue.</p>
          </div>
          <button
            type="button"
            onClick={handleAddNewBranch}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Branch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
