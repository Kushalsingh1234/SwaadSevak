import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Order, Restaurant, Bill } from '../types';
import { downloadInvoicePdf } from '../utils/invoicePdf';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tax Invoice / Receipt</h3>
              <p className="text-xs text-slate-500">{invoiceNumber} • {order.tableNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div id="thermal-print-area" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm font-sans">
            {/* Restaurant Details */}
            <div className="text-center pb-4 border-b border-slate-200">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {restaurant?.name || 'Swaad Sevak Restaurant'}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">{restaurant?.address || 'Indiranagar 100ft Road'}</p>
              <p className="text-xs text-slate-600">
                {restaurant?.city}, {restaurant?.state} • Phone: {restaurant?.phone || '+91 98765 43210'}
              </p>
              {restaurant?.gstNumber && (
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  GSTIN: {restaurant.gstNumber}
                </p>
              )}
            </div>

            {/* Bill Meta */}
            <div className="grid grid-cols-2 gap-2 py-3 text-xs border-b border-slate-100 text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">Invoice:</span> {invoiceNumber}
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-800">Date:</span> {orderDate}
              </div>
              <div>
                <span className="font-semibold text-slate-800">Table:</span> {order.tableNumber}
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-800">Time:</span> {orderTime}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="py-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="text-slate-800">
                      <td className="py-2 pr-2">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        {item.portion && <div className="text-[10px] text-slate-500">{item.portion}</div>}
                      </td>
                      <td className="text-center py-2 font-semibold">{item.quantity}</td>
                      <td className="text-right py-2 text-slate-600">₹{item.price}</td>
                      <td className="text-right py-2 font-semibold">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Totals */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              {bill?.discount ? (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-₹{bill.discount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total</span>
                <span>₹{(bill?.grandTotal || order.total).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Badge */}
            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Payment Status:</span>
              <span className={`px-2 py-0.5 rounded font-semibold ${
                bill?.paymentStatus && bill.paymentStatus.startsWith('PAID')
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {bill?.paymentStatus ? bill.paymentStatus.replace('PAID_', 'PAID VIA ') : 'PENDING SETTLEMENT'}
              </span>
            </div>

            {/* Swaad Sevak Footer */}
            <div className="mt-6 text-center text-xs text-slate-500">
              <p className="font-medium text-slate-700">Thank you for dining with us!</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Powered by Swaad Sevak
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => downloadInvoicePdf(order, bill || null, restaurant)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};
