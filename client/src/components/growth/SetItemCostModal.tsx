import React, { useState } from 'react';
import {
  Coins,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';

interface SetItemCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItemName?: string;
  currentPrice?: number;
  onSuccess: () => void;
}

export const SetItemCostModal: React.FC<SetItemCostModalProps> = ({
  isOpen,
  onClose,
  targetItemName = 'Cold Coffee',
  currentPrice = 129,
  onSuccess
}) => {
  const [costInput, setCostInput] = useState<string>('38');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const costNum = parseFloat(costInput) || 0;
  const marginAmt = Math.max(0, currentPrice - costNum);
  const marginPercent = currentPrice > 0 ? Math.round((marginAmt / currentPrice) * 100) : 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (costNum <= 0) {
      setErrorMsg('Please enter a valid ingredient cost.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await api.setGrowthItemCost(targetItemName, costNum);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update item cost');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Set Ingredient Cost</h2>
              <p className="text-[11px] text-slate-500">Unlock exact gross margin calculations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Selected Item:</span>
              <span className="text-xs font-bold text-slate-800">{targetItemName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Current Selling Price:</span>
              <span className="text-xs font-bold text-emerald-600">₹{currentPrice}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Estimated Ingredient / Raw Material Cost (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
              <input
                type="number"
                min="1"
                step="1"
                value={costInput}
                onChange={(e) => setCostInput(e.target.value)}
                placeholder="e.g. 35"
                className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold text-slate-800"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Include main ingredients (e.g. coffee beans, milk, chocolate drizzle).
            </p>
          </div>

          {/* Live margin preview */}
          {costNum > 0 && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Estimated Gross Margin
                </span>
                <p className="text-xs text-emerald-700 mt-0.5">
                  ₹{marginAmt} profit per dish
                </p>
              </div>
              <span className="text-lg font-black text-emerald-600">
                {marginPercent}%
              </span>
            </div>
          )}

          <div className="pt-2 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Save & Calculate Margins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
