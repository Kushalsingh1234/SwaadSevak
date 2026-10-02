import React, { useState } from 'react';
import { X, Printer, Check, Copy } from 'lucide-react';
import { Order, Restaurant, PrinterConfig } from '../types';

interface KotModalProps {
  order: Order | null;
  restaurant: Restaurant | null;
  printerConfig?: PrinterConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const KotModal: React.FC<KotModalProps> = ({
  order,
  restaurant,
  printerConfig,
  isOpen,
  onClose,
}) => {
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>(printerConfig?.paperWidth || '80mm');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const lines = [
      '========================================',
      restaurant?.name.toUpperCase() || 'SWAAD SEVAK KITCHEN',
      '*** KITCHEN ORDER TICKET (KOT) ***',
      `${order.kotNumber || 'KOT-1001'}  |  ORD ${order.orderNumber}`,
      '========================================',
      `TABLE: ${order.tableNumber}     TIME: ${orderTime}`,
      `SOURCE: ${order.source}`,
      '----------------------------------------',
      ...order.items.map(i => `${i.quantity} x ${i.name} ${i.portion ? `(${i.portion})` : ''}${i.notes ? `\n   Note: ${i.notes}` : ''}`),
      '----------------------------------------',
      order.customerNotes ? `INSTRUCTIONS: ${order.customerNotes}\n----------------------------------------` : '',
      'POWERED BY SWAAD SEVAK'
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Printer className="w-4 h-4 text-orange-600" />
              Kitchen Order Ticket (KOT)
            </h3>
            <p className="text-xs text-slate-500">
              {order.kotNumber || 'KOT Generated'} • {order.tableNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-200 p-0.5 text-xs font-medium">
              <button
                onClick={() => setPaperWidth('58mm')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  paperWidth === '58mm'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                58mm
              </button>
              <button
                onClick={() => setPaperWidth('80mm')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  paperWidth === '80mm'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                80mm
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thermal Slip Preview Container */}
        <div className="p-6 bg-slate-100 flex justify-center">
          <div
            id="thermal-print-area"
            style={{ width: paperWidth === '58mm' ? '240px' : '320px' }}
            className="bg-white p-5 rounded-lg shadow-sm border border-slate-300 font-mono text-xs text-slate-800 transition-all select-all"
          >
            <div className="text-center font-bold text-sm tracking-wider uppercase mb-1">
              {restaurant?.name || 'Swaad Sevak'}
            </div>
            <div className="text-center font-semibold text-xs text-slate-600 tracking-widest uppercase mb-1">
              *** KITCHEN TICKET ***
            </div>
            <div className="text-center font-bold text-xs border-y border-dashed border-slate-400 py-1 my-1">
              {order.kotNumber || 'KOT-1042'} | ORD {order.orderNumber}
            </div>

            <div className="flex justify-between py-1 text-[11px] font-semibold">
              <span>TABLE: {order.tableNumber}</span>
              <span>{orderTime}</span>
            </div>
            <div className="text-[11px] text-slate-600 mb-1">
              TYPE: {order.source}
            </div>

            <div className="border-t border-slate-400 my-1"></div>
            <div className="flex justify-between font-bold text-[11px] py-1 border-b border-dashed border-slate-300">
              <span>QTY  ITEM</span>
              <span>PORTION</span>
            </div>

            <div className="py-1 space-y-1.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="border-b border-dotted border-slate-200 pb-1">
                  <div className="flex justify-between font-semibold">
                    <span>
                      <strong className="text-slate-900">{item.quantity}x</strong> {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.portion || '-'}</span>
                  </div>
                  {item.notes && (
                    <div className="text-[10px] text-amber-700 italic pl-4">
                      * {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {order.customerNotes && (
              <div className="mt-2 pt-1 border-t border-dashed border-slate-400 text-[11px]">
                <span className="font-bold">INSTRUCTIONS:</span>
                <p className="text-slate-700 italic">{order.customerNotes}</p>
              </div>
            )}

            <div className="border-t border-dashed border-slate-400 mt-3 pt-2 text-center text-[10px] text-slate-500 uppercase">
              Powered by Swaad Sevak
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Raw KOT' : 'Copy Text'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print to Thermal ({paperWidth})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
