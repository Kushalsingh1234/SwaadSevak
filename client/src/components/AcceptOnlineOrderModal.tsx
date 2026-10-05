import React, { useState } from 'react';
import { X, Clock, Check, Utensils, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface AcceptOnlineOrderModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onConfirmAccept: (order: Order, estimatedPrepTime: number) => Promise<void>;
}

export const AcceptOnlineOrderModal: React.FC<AcceptOnlineOrderModalProps> = ({
  isOpen,
  order,
  onClose,
  onConfirmAccept,
}) => {
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(25);
  const [customTime, setCustomTime] = useState<string>('25');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const isSwiggy = order.source === 'SWIGGY';
  const presets = [15, 20, 25, 30, 45, 60];

  const handleSelectPreset = (mins: number) => {
    setPrepTimeMinutes(mins);
    setCustomTime(String(mins));
  };

  const handleCustomChange = (val: string) => {
    setCustomTime(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setPrepTimeMinutes(parsed);
    }
  };

  const calculateReadyTime = () => {
    const readyDate = new Date(Date.now() + prepTimeMinutes * 60000);
    return readyDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleConfirm = async () => {
    if (prepTimeMinutes <= 0) return;
    setIsSubmitting(true);
    try {
      await onConfirmAccept(order, prepTimeMinutes);
      onClose();
    } catch (err) {
      console.error('Error confirming acceptance:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isSwiggy ? 'bg-[#FC8019]/10 border-[#FC8019]/20' : 'bg-[#E23744]/10 border-[#E23744]/20'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center text-white ${
              isSwiggy ? 'bg-[#FC8019]' : 'bg-[#E23744]'
            }`}>
              {isSwiggy ? 'SW' : 'ZM'}
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Accept {order.source} Order</span>
                <span className="font-mono text-xs text-slate-500">#{order.orderNumber}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Set estimated preparation time for delivery partner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Items Preview */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 max-h-36 overflow-y-auto">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            <span>Order Items ({order.items.length})</span>
            <span className="text-slate-900 font-bold">Total: ₹{order.total}</span>
          </div>
          <div className="space-y-1 text-xs text-slate-700">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-0.5">
                <span className="font-medium">
                  <strong className="text-slate-900 mr-1.5">{item.quantity}×</strong>
                  {item.name}
                  {item.portion && <span className="text-[10px] text-slate-400 ml-1">({item.portion})</span>}
                </span>
                <span className="text-slate-500 tabular-nums">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          {order.customerNotes && (
            <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/80">
              <strong>Note:</strong> {order.customerNotes}
            </div>
          )}
        </div>

        {/* Estimated Time Selection */}
        <div className="p-5 space-y-4">
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Estimated Kitchen Prep Time:</span>
              </span>
              <span className="text-orange-600 font-extrabold text-sm">{prepTimeMinutes} mins</span>
            </label>

            {/* Preset Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {presets.map((mins) => {
                const isSelected = prepTimeMinutes === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleSelectPreset(mins)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500 text-white shadow-xs scale-102'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {mins} mins
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Time Input & Projection */}
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">Custom:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={customTime}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 text-center focus:outline-none focus:border-orange-500"
                />
                <span className="text-xs text-slate-500">mins</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Ready for Pickup</span>
              <span className="text-xs font-bold text-emerald-700">~{calculateReadyTime()}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/70">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Delivery rider arrival will be synchronized with this target time.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting || prepTimeMinutes <= 0}
            onClick={handleConfirm}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5 ${
              isSwiggy ? 'bg-[#FC8019] hover:bg-[#e47011]' : 'bg-[#E23744] hover:bg-[#c92f3b]'
            } disabled:opacity-50`}
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Accepting...' : `Accept Order (${prepTimeMinutes}m)`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
