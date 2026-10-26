import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { Order, Restaurant, Bill } from '../types';
import { downloadInvoicePdf, sendInvoicePdfWhatsApp } from '../utils/invoicePdf';

interface InvoiceModalProps {
  order: Order | null;
  bill?: Bill | null;
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  bill,
  restaurant,
  isOpen,
  onClose,
}) => {
  const [isSendingWa, setIsSendingWa] = useState(false);
  const [waStatus, setWaStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [customPhone, setCustomPhone] = useState(order?.customerPhone || '');

  if (!isOpen || !order) return null;

  const invoiceNumber = bill?.billNumber || `INV-${order.orderNumber.replace('#', '')}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = async (phoneToSend?: string) => {
    const targetPhone = phoneToSend || customPhone || order.customerPhone;
    if (!targetPhone || !targetPhone.trim()) {
      setShowPhonePrompt(true);
      return;
    }

    setIsSendingWa(true);
    setWaStatus(null);
    try {
      const res = await sendInvoicePdfWhatsApp(order, bill || null, restaurant, targetPhone);
      if (res.success) {
        setWaStatus({ type: 'success', message: 'E-receipt PDF sent via WhatsApp!' });
        setShowPhonePrompt(false);
      } else {
        setWaStatus({ type: 'error', message: res.message || 'Failed to send WhatsApp PDF' });
      }
    } catch (err: any) {
      setWaStatus({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsSendingWa(false);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-200 bg-gray-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">Tax Invoice</h3>
              <p className="text-xs text-gray-500 truncate">{invoiceNumber} • {order.tableNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-3 sm:p-6 overflow-y-auto max-h-[70dvh] sm:max-h-[70vh]">
          {waStatus && (
            <div className={`mb-3 p-2.5 rounded-lg text-xs font-medium flex items-center justify-between ${
              waStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              <span>{waStatus.message}</span>
              <button onClick={() => setWaStatus(null)} className="ml-2 font-bold hover:underline">×</button>
            </div>
          )}

          {showPhonePrompt && (
            <div className="mb-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs">
              <label className="block font-bold text-emerald-950 mb-1">
                Enter Customer WhatsApp Number:
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded text-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  disabled={isSendingWa || !customPhone.trim()}
                  onClick={() => handleSendWhatsApp(customPhone)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSendingWa ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhonePrompt(false)}
                  className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div id="thermal-print-area" className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-xs font-sans">
            {/* Restaurant Details */}
            <div className="text-center pb-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                {restaurant?.name || 'The Chai & Chaat Co.'}
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">{restaurant?.address || '12th Main, Indiranagar'}</p>
              <p className="text-xs text-gray-600">
                {restaurant?.city || 'Bengaluru'}, {restaurant?.state || 'Karnataka'} • Phone: {restaurant?.phone || '+91 98765 43210'}
              </p>
              {restaurant?.gstNumber && (
                <p className="text-[11px] font-mono text-gray-500 mt-1">
                  GSTIN: {restaurant.gstNumber}
                </p>
              )}
            </div>

            {/* Bill Meta */}
            <div className="grid grid-cols-2 gap-2 py-3 text-xs border-b border-gray-200 text-gray-600">
              <div>
                <span className="font-semibold text-gray-800">Invoice:</span> {invoiceNumber}
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-800">Date:</span> {orderDate}
              </div>
              <div>
                <span className="font-semibold text-gray-800">Table:</span> {order.tableNumber}
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-800">Time:</span> {orderTime}
              </div>
              {order.customerName && (
                <div className="col-span-2 text-slate-700">
                  <span className="font-semibold">Customer:</span> {order.customerName} {order.customerPhone ? `(${order.customerPhone})` : ''}
                </div>
              )}
            </div>

            {/* Itemized Table */}
            <div className="py-3 overflow-x-auto">
              <table className="w-full text-xs min-w-[240px]">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600 font-semibold">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="text-gray-800">
                      <td className="py-2 pr-2">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        {item.portion && <div className="text-[10px] text-gray-500">{item.portion}</div>}
                      </td>
                      <td className="text-center py-2 font-semibold">{item.quantity}</td>
                      <td className="text-right py-2 text-gray-600">₹{item.price}</td>
                      <td className="text-right py-2 font-semibold">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Totals */}
            <div className="border-t border-gray-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.tax === 0 || restaurant?.gstTier === 'inclusive' ? (
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span>Taxes & GST</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">Included</span>
                  </span>
                  <span className="text-emerald-700 font-semibold">Included in prices</span>
                </div>
              ) : restaurant?.gstTier === '18%' ? (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST (9%)</span>
                    <span>₹{(order.tax / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST (9%)</span>
                    <span>₹{(order.tax / 2).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST (2.5%)</span>
                    <span>₹{(order.tax / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST (2.5%)</span>
                    <span>₹{(order.tax / 2).toFixed(2)}</span>
                  </div>
                </>
              )}
              {bill?.discount ? (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-₹{bill.discount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Grand Total</span>
                <span>₹{(bill?.grandTotal || order.total).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Badge */}
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Payment Status:</span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${
                bill?.paymentStatus && bill.paymentStatus.startsWith('PAID')
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {bill?.paymentStatus ? bill.paymentStatus.replace('PAID_', 'Paid via ') : 'Pending Settlement'}
              </span>
            </div>

            {/* Swaad Sevak Footer */}
            <div className="mt-6 text-center text-xs text-gray-500">
              <p className="font-medium text-gray-700">Thank you for dining with us!</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-medium">
                Powered by Swaad Sevak
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50/70 border-t border-gray-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 text-center"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={() => handleSendWhatsApp()}
            disabled={isSendingWa}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            title="Send the official PDF e-receipt to customer WhatsApp"
          >
            {isSendingWa ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-emerald-600" />}
            <span>WhatsApp PDF</span>
          </button>
          <button
            onClick={() => downloadInvoicePdf(order, bill || null, restaurant)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

