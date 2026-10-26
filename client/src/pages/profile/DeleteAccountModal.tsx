import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  restaurantName: string;
  onClose: () => void;
  onConfirm: (confirmationText: string) => Promise<{ success: boolean; message?: string }>;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  restaurantName,
  onClose,
  onConfirm,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText.trim().toUpperCase() !== 'DELETE') {
      setErrorMsg('Please type DELETE in capital letters to confirm.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await onConfirm(confirmText);
      if (res.success) {
        setSuccessMsg(res.message || 'Account deletion request initiated.');
        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        setErrorMsg(res.message || 'Failed to submit deletion request.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white text-slate-800 rounded-3xl border border-red-200 shadow-2xl p-6 sm:p-7 space-y-5 relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Delete Restaurant Account</h3>
              <p className="text-xs text-red-600 font-semibold">Danger Zone Action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Details */}
        <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200 text-xs text-red-950 space-y-2">
          <p className="font-semibold text-red-900">
            This will schedule permanent deletion for <strong>{restaurantName}</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
            <li>Live tables, QR tokens, and online menu will be permanently disabled.</li>
            <li>Sales reports, billing history, and KOT logs will be archived.</li>
            <li>Active subscription days will not be automatically refunded.</li>
          </ul>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Type <strong className="text-red-600 font-mono font-bold">DELETE</strong> to confirm:
            </label>
            <input
              type="text"
              required
              autoCapitalize="characters"
              placeholder="DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-red-300 text-slate-900 text-xs font-mono placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || confirmText.trim().toUpperCase() !== 'DELETE'}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/25 transition-all disabled:opacity-40 cursor-pointer"
            >
              {isSubmitting ? 'Submitting Request...' : 'Confirm Deletion Request'}
            </button>
          </div>
        </form>

        <p className="text-[10px] text-slate-400 text-center">
          Enterprise Security Note: In accordance with hospitality compliance, deletion requires 24h verification link dispatch to owner email.
        </p>
      </div>
    </div>
  );
};
