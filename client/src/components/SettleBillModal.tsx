import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Banknote, QrCode, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface SettleBillModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSettle: (orderId: string, paymentStatus: 'PAID_UPI' | 'PAID_CASH' | 'PAID_CARD') => Promise<void>;
}

export const SettleBillModal: React.FC<SettleBillModalProps> = ({
  order,
  isOpen,
  onClose,
  onSettle
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'PAID_UPI' | 'PAID_CASH' | 'PAID_CARD'>('PAID_UPI');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const subtotal = order.subtotal || order.items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const tax = order.tax || Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = order.total || (subtotal + tax);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSettle(order.id, selectedMethod);
      onClose();
    } catch (e) {
      console.error('Failed to settle bill:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Settle Bill & Complete Order</h3>
            <p className="text-xs text-slate-500">{order.tableNumber} • {order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Order Items Snapshot */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 max-h-40 overflow-y-auto space-y-1.5 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-700">
                <span className="truncate pr-2">
                  <span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}
                </span>
                <span className="font-semibold shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Amount Breakdown */}
          <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (5%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-orange-200/60">
              <span>Total Payable:</span>
              <span className="text-orange-600 text-lg">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Payment Mode Received
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('PAID_UPI')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedMethod === 'PAID_UPI'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5 mb-1 text-orange-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('PAID_CASH')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedMethod === 'PAID_CASH'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 mb-1 text-emerald-600" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('PAID_CARD')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedMethod === 'PAID_CARD'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1 text-blue-600" />
                <span>Card / POS</span>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Settling Bill...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Confirm Payment (₹{grandTotal}) & Free Table</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
