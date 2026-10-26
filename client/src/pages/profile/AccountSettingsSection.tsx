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
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 shrink-0">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Account & Session Management</h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage your active session, data residency, local preferences, and dangerous account actions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session & Device Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Laptop className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Shift Session</h3>
              <p className="text-xs text-slate-500">Current device logged in to restaurant terminal</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-2xs">
            Active Now
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-1">Browser / Environment</span>
            <span className="font-semibold text-slate-800">Chrome on macOS Desktop</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-1">Data Hosting Region</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-500" /> Asia-South1 (Mumbai)
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-1">Session Initialized</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" /> Today, Shift Mode
            </span>
          </div>
        </div>

        {/* Prominent Logout Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Sign Out of SwaadSevak</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Securely end your counter and kitchen management session on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenLogoutModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-red-50 hover:border-red-200 border border-slate-200 text-slate-700 hover:text-red-600 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer group shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
            <span>Log Out of Account</span>
          </button>
        </div>
      </div>

      {/* Data Export & Compliance */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-orange-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Data Portability & Export</h3>
            <p className="text-xs text-slate-500">Download a verified copy of your restaurant configuration and profile.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
            Exports account metadata, restaurant catalog identifiers, tax configurations, and notification preferences as standard JSON.
          </p>
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Account Data</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/50 rounded-3xl border border-red-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-900">Danger Zone</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Irreversible actions for your restaurant branch account.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900">Delete Restaurant & Account Data</h4>
            <p className="text-[11px] text-slate-500 max-w-lg leading-relaxed">
              Permanently schedule deletion for {restaurantProfile.restaurantName || 'this restaurant'}. Disables active QR tokens, cancels subscription renewal, and archives business records.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenDeleteModal}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
