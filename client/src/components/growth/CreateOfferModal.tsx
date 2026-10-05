import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { api } from '../../services/api';
import { GrowthRecommendation } from '../../types';

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: GrowthRecommendation | null;
  onActionComplete: () => void;
}

export const CreateOfferModal: React.FC<CreateOfferModalProps> = ({
  isOpen,
  onClose,
  recommendation,
  onActionComplete
}) => {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !recommendation) return null;

  const itemA = recommendation.targetItemName || 'Cold Coffee';
  const itemB = recommendation.suggestedComboWith || 'Chocolate Brownie';
  const timeSlot = recommendation.suggestedTimeSlot || '3 PM – 6 PM';
  const comboPrice = 239;
  const originalPrice = 278;

  const promoCopy = `🔥 Afternoon Special at ${itemA} + ${itemB} Combo for only ₹${comboPrice}! Valid every day from ${timeSlot}. Drop by or order at your table! ☕✨`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImplement = async () => {
    setIsSubmitting(true);
    try {
      await api.toggleGrowthRecommendation(recommendation.id);
      onActionComplete();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update recommendation status');
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
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Launch Growth Offer</h2>
              <p className="text-[11px] text-slate-500">Ready-to-use business action plan</p>
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
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-xl bg-linear-to-br from-orange-50 via-amber-50/60 to-white border border-orange-200/80">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-600 text-white uppercase tracking-wider mb-2">
              <Tag className="w-3 h-3" />
              Recommended Promotion
            </span>

            <h3 className="text-base font-extrabold text-slate-900 leading-tight">
              {itemA} + {itemB} Duo
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-black text-emerald-600">₹{comboPrice}</span>
              <span className="text-xs text-slate-400 line-through">₹{originalPrice}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Save ₹{originalPrice - comboPrice} (14% off)
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <span>Recommended Window: <strong className="text-slate-800">{timeSlot}</strong></span>
            </div>
          </div>

          {/* Quick social / staff promo copy */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">Promo Text for Chalkboard / WhatsApp:</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-orange-600 font-semibold hover:text-orange-700"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-sans italic select-all leading-relaxed">
              "{promoCopy}"
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-800">Expected Result:</span>
              <p className="text-slate-500 mt-0.5">{recommendation.expectedImpact || 'Increase table orders during afternoon slump'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleImplement}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{recommendation.implemented ? 'Mark as Not Implemented' : 'Mark as Implemented'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
