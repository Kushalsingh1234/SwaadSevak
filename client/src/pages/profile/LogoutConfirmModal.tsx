import React from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1C120C] text-white rounded-3xl border border-white/[0.12] shadow-2xl p-6 space-y-5 relative">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
            <LogOut className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-white">Are you sure you want to log out?</h3>
          <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
            You will be signed out of your restaurant shift manager session on this device. Any unsaved changes in counter forms may be reset.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/[0.1] text-xs font-bold text-stone-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-98"
          >
            Log Out Now
          </button>
        </div>
      </div>
    </div>
  );
};
