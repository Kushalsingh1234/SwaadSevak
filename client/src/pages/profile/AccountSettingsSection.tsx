import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import {
  Sliders,
  LogOut,
  Trash2,
  Shield,
  Download,
  AlertTriangle,
  Globe,
  Clock,
  Laptop,
} from 'lucide-react';

interface AccountSettingsSectionProps {
  onOpenLogoutModal: () => void;
  onOpenDeleteModal: () => void;
}

export const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({
  onOpenLogoutModal,
  onOpenDeleteModal,
}) => {
  const { profile, restaurantProfile } = useProfile();

  const handleExportData = () => {
    const exportPayload = {
      profile,
      restaurant: restaurantProfile,
      exportedAt: new Date().toISOString(),
      platform: 'SwaadSevak Hospitality Suite',
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `swaadsevak-account-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1C120C] via-[#22160F] to-[#1C120C] p-6 sm:p-7 border border-white/[0.08] shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Account & Session Management</h2>
              <p className="text-xs text-stone-400 mt-1">
                Manage your active session, data residency, local preferences, and dangerous account actions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session & Device Card */}
      <div className="bg-[#1C120C] rounded-3xl border border-white/[0.08] p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Laptop className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Active Shift Session</h3>
              <p className="text-xs text-stone-400">Current device logged in to restaurant terminal</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            Active Now
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[11px] text-stone-500 block mb-1">Browser / Environment</span>
            <span className="font-semibold text-stone-200">Chrome on macOS Desktop</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[11px] text-stone-500 block mb-1">Data Hosting Region</span>
            <span className="font-semibold text-stone-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" /> Asia-South1 (Mumbai)
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[11px] text-stone-500 block mb-1">Session Initialized</span>
            <span className="font-semibold text-stone-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" /> Today, Shift Mode
            </span>
          </div>
        </div>

        {/* Prominent Logout Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div>
            <h4 className="text-sm font-bold text-white">Sign Out of SwaadSevak</h4>
            <p className="text-xs text-stone-400 mt-0.5">
              Securely end your counter and kitchen management session on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenLogoutModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-red-500/15 hover:border-red-500/30 border border-white/[0.1] text-stone-200 hover:text-red-400 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-stone-400 group-hover:text-red-400 transition-colors" />
            <span>Log Out of Account</span>
          </button>
        </div>
      </div>

      {/* Data Export & Compliance */}
      <div className="bg-[#1C120C] rounded-3xl border border-white/[0.08] p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-orange-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Data Portability & Export</h3>
            <p className="text-xs text-stone-400">Download a verified copy of your restaurant configuration and profile.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-stone-400 max-w-lg leading-relaxed">
            Exports account metadata, restaurant catalog identifiers, tax configurations, and notification preferences as standard JSON.
          </p>
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-xs font-bold text-stone-200 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-stone-400" />
            <span>Export Account Data</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-950/20 rounded-3xl border border-red-500/25 p-6 space-y-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-300">Danger Zone</h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Irreversible actions for your restaurant branch account.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/30 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">Delete Restaurant & Account Data</h4>
            <p className="text-[11px] text-stone-400 max-w-lg leading-relaxed">
              Permanently schedule deletion for {restaurantProfile.restaurantName || 'this restaurant'}. Disables active QR tokens, cancels subscription renewal, and archives business records.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenDeleteModal}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 hover:border-red-600 text-red-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
