import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [waStatus, setWaStatus] = useState<{ connected: boolean; phone?: string } | null>(null);

  // CRITICAL: Reset all form states whenever modal opens or order changes so no previous toasts/states persist!
  useEffect(() => {
    if (isOpen && order) {
      setCustomerName(order.customerName || '');
      setCustomerPhone(order.customerPhone ? String(order.customerPhone).replace(/\D/g, '').slice(-10) : '');
      setPaymentMode('UPI');
      setIsSubmitting(false);
      setActionInProgress(null);
      setStatusMessage(null);

      // Check live WhatsApp connection state
      api.getWhatsAppStatus()
        .then(res => {
          if (res && res.success && res.data) {
            setWaStatus({
              connected: res.data.status === 'CONNECTED',
              phone: res.data.phoneNumber
            });
          } else {
            setWaStatus({ connected: false });
          }
        })
        .catch(() => setWaStatus({ connected: false }));
    } else {
      setStatusMessage(null);
      setIsSubmitting(false);
      setActionInProgress(null);
      setWaStatus(null);
    }
  }, [isOpen, order?.id]);

  if (!isOpen || !order) return null;

  const rawPhone = customerPhone.replace(/\D/g, '');
  const cleanPhone = rawPhone.slice(-10);
  const hasValidPhone = cleanPhone.length === 10;

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
    if (targetAction === 'WHATSAPP' && !hasValidPhone) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid 10-digit WhatsApp number to send the digital receipt.'
      });
      return;
    }

    setIsSubmitting(true);
    setActionInProgress(targetAction);
    setStatusMessage(null);

    try {
      // 1. Finalize custom order bill on server & link customer to CRM directory
      const res = await api.finalizeCustomOrderBill(order.id, {
        customerName: customerName.trim() || undefined,
        customerPhone: hasValidPhone ? cleanPhone : undefined,
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
          text: '✓ Bill finalized! Opening receipt...'
        });

        setTimeout(() => {
          onOrderFinalized(finalizedOrder, finalizedBill);
          if (onOpenInvoiceModal) {
            onOpenInvoiceModal(finalizedOrder, finalizedBill);
          }
          onClose();
        }, 400);
      } else if (targetAction === 'WHATSAPP') {
        setStatusMessage({
          type: 'success',
          text: 'Dispatching PDF receipt from connected WhatsApp number...'
        });

        const waRes = await sendInvoicePdfWhatsApp(
          finalizedOrder,
          finalizedBill,
          restaurant,
          cleanPhone
        );

        if (waRes.success) {
          setStatusMessage({
            type: 'success',
            text: waRes.message || `✓ Official PDF receipt sent to WhatsApp (+91 ${cleanPhone})!`
          });

          setTimeout(() => {
            onOrderFinalized(finalizedOrder, finalizedBill);
            onClose();
          }, 1500);
        } else {
          setStatusMessage({
            type: 'error',
            text: waRes.message || 'Could not send WhatsApp receipt. Please check device pairing in CRM Settings.'
          });
          setIsSubmitting(false);
          setActionInProgress(null);
        }
      } else {
        // Quick settle only
        setStatusMessage({
          type: 'success',
          text: '✓ Order settled successfully!'
        });

        setTimeout(() => {
          onOrderFinalized(finalizedOrder, finalizedBill);
          onClose();
        }, 400);
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

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 sm:p-6 md:p-8 overflow-y-auto no-scrollbar animate-fade-in"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col max-h-[85vh] overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Clean, Modern Header with Generous Padding */}
        <div className="px-6 py-5 bg-white border-b border-stone-200 flex items-center justify-between shrink-0 rounded-t-3xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-xs">
              <Receipt className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Finalize Custom Order Bill</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 border border-emerald-200/80">
                  Bill & Settle
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-700 bg-stone-100 px-2 py-0.5 rounded-md text-[11px]">{order.orderNumber}</span>
                <span>•</span>
                <span className="text-slate-600 bg-stone-100 px-2 py-0.5 rounded-md text-[11px]">{order.tableNumber || 'Takeaway'}</span>
                <span>•</span>
                <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 text-[10px]">
                  Custom Order
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors disabled:opacity-40 cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Action Status Banner (Only visible when active action or error) */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 animate-fade-in ${
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

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          
          {/* 1. Order Itemization Summary (Compact Card) */}
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2.5">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-slate-500" />
                Order Breakdown
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {order.items.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>

            <div className="divide-y divide-stone-200/50 max-h-32 overflow-y-auto pr-1 no-scrollbar">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-1.5 flex items-baseline justify-between text-xs">
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

            {/* Subtotal, Tax, Grand Total */}
            <div className="pt-2 border-t border-stone-200/80 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST / Taxes ({gstTier})</span>
                <span className="font-semibold text-slate-900 tabular-nums">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-stone-200/80">
                <span>Grand Total</span>
                <span className="text-base font-extrabold text-slate-900 tabular-nums">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Customer Information (Directory CRM Integration) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-slate-900">Customer Details</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Auto-saved to Directory
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
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
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
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
                    placeholder="10-digit number"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-11 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none tracking-wide transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic helper text for WhatsApp */}
            <div className="pt-0.5 space-y-1.5">
              <p className="text-[11px] transition-colors">
                {hasValidPhone ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Recipient set to +91 {cleanPhone}
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1.5 px-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Enter 10-digit WhatsApp number to send automatic PDF e-receipt.
                  </span>
                )}
              </p>

              {waStatus && (
                <div className="text-[10px] px-1 font-medium flex items-center gap-1.5">
                  {waStatus.connected ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Sender: Connected {waStatus.phone ? `(${waStatus.phone})` : ''} • Sends automatically
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Sender: Disconnected. Scan QR in CRM Settings to pair device.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 3. Payment Mode Selection */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-xs">
            <label className="block text-xs font-bold text-slate-900">
              Payment Mode Chosen:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMode === 'UPI'
                    ? 'border-brand-500 bg-brand-50/60 text-brand-900 ring-2 ring-brand-400/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-slate-700 hover:bg-stone-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-brand-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('CASH')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMode === 'CASH'
                    ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-400/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-slate-700 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('CARD')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMode === 'CARD'
                    ? 'border-blue-500 bg-blue-50/60 text-blue-900 ring-2 ring-blue-400/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-slate-700 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Card</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 sm:p-6 bg-stone-50 border-t border-stone-200 space-y-3 shrink-0 rounded-b-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Generate & Print Receipt (Always available) */}
            <button
              type="button"
              onClick={() => handleFinalizeBill('PRINT')}
              disabled={isSubmitting}
              className="py-3 px-4 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-slate-900 text-xs font-bold shadow-xs hover:bg-stone-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting && actionInProgress === 'PRINT' ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              ) : (
                <Printer className="w-4 h-4 text-slate-600" />
              )}
              <span>Generate & Print Receipt</span>
            </button>

            {/* 2. Settle & Send Receipt on WhatsApp (Enabled only when 10 digits entered) */}
            <button
              type="button"
              onClick={() => handleFinalizeBill('WHATSAPP')}
              disabled={isSubmitting || !hasValidPhone}
              className={`py-3 px-4 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                hasValidPhone && !isSubmitting
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg cursor-pointer'
                  : 'bg-stone-200 text-slate-400 cursor-not-allowed opacity-60'
              }`}
              title={hasValidPhone ? 'Send PDF e-receipt to WhatsApp' : 'Enter 10-digit WhatsApp number to enable'}
            >
              {isSubmitting && actionInProgress === 'WHATSAPP' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Send Receipt on WhatsApp</span>
            </button>
          </div>

          {/* Quick Settlement Without Receipt */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => handleFinalizeBill('SETTLE_ONLY')}
              disabled={isSubmitting}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Mark Paid & Settle without Receipt
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
