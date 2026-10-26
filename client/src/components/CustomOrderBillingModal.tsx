import React, { useState } from 'react';
import {
  X,
  Printer,
  Send,
  Receipt,
  User,
  Phone,
  CheckCircle2,
  Loader2,
  CreditCard,
  Banknote,
  QrCode,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Utensils
} from 'lucide-react';
import { Order, Restaurant, Bill, PrinterConfig } from '../types';
import { api } from '../services/api';
import { sendInvoicePdfWhatsApp } from '../utils/invoicePdf';

interface CustomOrderBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  restaurant: Restaurant | null;
  printerConfig?: PrinterConfig;
  onOrderFinalized: (order: Order, bill: Bill) => void;
  onOpenInvoiceModal?: (order: Order, bill: Bill) => void;
}

export const CustomOrderBillingModal: React.FC<CustomOrderBillingModalProps> = ({
  isOpen,
  onClose,
  order,
  restaurant,
  onOrderFinalized,
  onOpenInvoiceModal
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CASH' | 'CARD'>('UPI');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<'PRINT' | 'WHATSAPP' | 'SETTLE_ONLY' | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen || !order) return null;

  const subtotal = order.subtotal || order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const gstTier = restaurant?.gstTier || '5%';
  const isGstInclusive = gstTier === 'inclusive' || gstTier === '0%' || gstTier === '0';
  const tax = isGstInclusive
    ? 0
    : order.tax !== undefined && order.tax !== null
    ? order.tax
    : gstTier === '18%'
    ? Math.round(subtotal * 0.18 * 100) / 100
    : Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((order.total || subtotal + tax) * 100) / 100;

  const handleFinalizeBill = async (targetAction: 'PRINT' | 'WHATSAPP' | 'SETTLE_ONLY') => {
    const rawPhone = customerPhone.trim().replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.slice(-10);

    if (targetAction === 'WHATSAPP') {
      if (!cleanPhone || cleanPhone.length !== 10) {
        setStatusMessage({
          type: 'error',
          text: 'Please provide a valid 10-digit WhatsApp phone number to send the e-receipt.'
        });
        return;
      }
    }

    setIsSubmitting(true);
    setActionInProgress(targetAction);
    setStatusMessage(null);

    try {
      // 1. Settle custom order billing and save customer to directory
      const res = await api.finalizeCustomOrderBill(order.id, {
        customerName: customerName.trim() || undefined,
        customerPhone: cleanPhone || undefined,
        paymentMode
      });

      if (!res.success || !res.order || !res.bill) {
        throw new Error(res.message || 'Failed to finalize order billing');
      }

      const finalizedOrder: Order = res.order;
      const finalizedBill: Bill = res.bill;

      // 2. Perform requested post-settlement action
      if (targetAction === 'PRINT') {
        setStatusMessage({
          type: 'success',
          text: '✓ Bill finalized! Customer saved to directory. Opening receipt...'
        });

        setTimeout(() => {
          onOrderFinalized(finalizedOrder, finalizedBill);
          if (onOpenInvoiceModal) {
            onOpenInvoiceModal(finalizedOrder, finalizedBill);
          }
          onClose();
        }, 600);
      } else if (targetAction === 'WHATSAPP') {
        setStatusMessage({
          type: 'success',
          text: 'Generating official PDF receipt and sending via WhatsApp...'
        });

        const waRes = await sendInvoicePdfWhatsApp(
          finalizedOrder,
          finalizedBill,
          restaurant,
          cleanPhone
        );

        if (!waRes.success) {
          throw new Error(waRes.message || 'Failed to send WhatsApp document receipt');
        }

        setStatusMessage({
          type: 'success',
          text: `✓ Bill finalized! Official PDF receipt sent to WhatsApp +91 ${cleanPhone} & customer added to directory.`
        });

        setTimeout(() => {
          onOrderFinalized(finalizedOrder, finalizedBill);
          onClose();
        }, 1500);
      } else {
        // Quick settle only
        setStatusMessage({
          type: 'success',
          text: '✓ Bill finalized and settled successfully!'
        });

        setTimeout(() => {
          onOrderFinalized(finalizedOrder, finalizedBill);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      console.error('Finalize bill error:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to finalize bill and process receipt.'
      });
      setIsSubmitting(false);
      setActionInProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-stone-200">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Finalize Custom Order Bill</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500 text-white">
                  Settlement
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {order.orderNumber} • {order.tableNumber || 'Takeaway'} • Custom Order
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="flex-1">{statusMessage.text}</span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. Order Items Summary */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-slate-500" />
                Order Itemization
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {order.items.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>

            <div className="divide-y divide-stone-100 max-h-44 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-baseline justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 mr-2">{item.quantity} ×</span>
                    <span className="text-slate-800 font-medium">{item.name}</span>
                    {item.portion && (
                      <span className="text-[10px] text-slate-400 ml-1">({item.portion})</span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Calculations */}
            <div className="pt-2 border-t border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST / Taxes ({gstTier})</span>
                <span className="font-semibold text-slate-900 tabular-nums">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="text-base font-extrabold text-slate-900 tabular-nums">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Customer Information (Automatically Saved to CRM Directory) */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" />
                <h4 className="text-xs font-bold text-slate-900">Customer Details</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Added to CRM Directory
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Entering customer info will automatically record them in your restaurant directory for loyalty tracking and marketing campaigns.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Customer Name:
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  WhatsApp Number:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit WhatsApp number"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-11 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none tracking-wide"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Required if sending the official PDF receipt via WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Payment Mode Chosen */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2.5 shadow-xs">
            <label className="block text-xs font-bold text-slate-900">
              Payment Mode Chosen:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMode === 'UPI'
                    ? 'border-brand-500 bg-brand-50/50 text-brand-900 ring-2 ring-brand-400/20'
                    : 'border-stone-200 hover:border-stone-300 text-slate-700 hover:bg-stone-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-brand-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('CASH')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMode === 'CASH'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-400/20'
                    : 'border-stone-200 hover:border-stone-300 text-slate-700 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('CARD')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMode === 'CARD'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900 ring-2 ring-blue-400/20'
                    : 'border-stone-200 hover:border-stone-300 text-slate-700 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Card</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 space-y-2.5 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Generate & Print Receipt */}
            <button
              type="button"
              onClick={() => handleFinalizeBill('PRINT')}
              disabled={isSubmitting}
              className="py-3 px-4 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-slate-900 text-xs font-bold shadow-xs hover:bg-stone-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting && actionInProgress === 'PRINT' ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              ) : (
                <Printer className="w-4 h-4 text-slate-600" />
              )}
              <span>Generate & Print Receipt</span>
            </button>

            {/* Settle & Send Receipt on WhatsApp */}
            <button
              type="button"
              onClick={() => handleFinalizeBill('WHATSAPP')}
              disabled={isSubmitting}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting && actionInProgress === 'WHATSAPP' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
              <span>Send Receipt on WhatsApp</span>
            </button>
          </div>

          {/* Optional Quick Settlement Only */}
          <button
            type="button"
            onClick={() => handleFinalizeBill('SETTLE_ONLY')}
            disabled={isSubmitting}
            className="w-full py-2 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Mark Paid & Settle without Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
