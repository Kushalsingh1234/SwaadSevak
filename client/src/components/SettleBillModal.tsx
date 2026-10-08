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
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-200 bg-gray-50/70">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Settle Bill & Complete Order</h3>
            <p className="text-xs text-gray-500 mt-0.5">{order.tableNumber} • {order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Order Items Snapshot */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 max-h-36 sm:max-h-40 overflow-y-auto space-y-1.5 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-gray-700">
                <span className="truncate pr-2">
                  <span className="font-semibold text-gray-900">{item.quantity}x</span> {item.name}
                </span>
                <span className="font-medium shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Amount Breakdown */}
          <div className="bg-gray-50 rounded-lg p-3.5 sm:p-4 border border-gray-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (5%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total Payable:</span>
              <span className="text-orange-600 text-base">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Select Payment Mode Received
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('PAID_UPI')}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg border text-xs font-semibold transition-all active:scale-95 ${
                  selectedMethod === 'PAID_UPI'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <QrCode className="w-5 h-5 mb-1 text-orange-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('PAID_CASH')}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg border text-xs font-semibold transition-all active:scale-95 ${
                  selectedMethod === 'PAID_CASH'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Banknote className="w-5 h-5 mb-1 text-emerald-600" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('PAID_CARD')}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg border text-xs font-semibold transition-all active:scale-95 ${
                  selectedMethod === 'PAID_CARD'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1 text-blue-600" />
                <span>Card</span>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 active:scale-98 cursor-pointer"
          >
            {loading ? (
              <span>Settling Bill...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">Confirm Payment (₹{grandTotal}) & Free Table</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
