import React, { useState } from 'react';
import { X, Printer, Check, Copy, Sparkles, Bell } from 'lucide-react';
import { Order, Restaurant, PrinterConfig, OrderAddition } from '../types';
import { Logo } from './Logo';
import { kotPrinter, getOrderDisplayTitle } from '../utils/kotPrinter';

interface KotModalProps {
  order: Order | null;
  addition?: OrderAddition | null;
  restaurant: Restaurant | null;
  printerConfig?: PrinterConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const KotModal: React.FC<KotModalProps> = ({
  order,
  addition,
  restaurant,
  printerConfig,
  isOpen,
  onClose,
}) => {
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>(printerConfig?.paperWidth || '80mm');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const isAddition = Boolean(addition);
  const items = addition ? addition.items : order.items;
  const notes = addition ? addition.customerNotes : order.customerNotes;

  const orderTime = new Date(addition?.createdAt || order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const isOnline =
    order.source === 'SWIGGY' ||
    order.source === 'ZOMATO' ||
    order.source === 'OTHER' ||
    order.tableNumber?.toLowerCase().includes('swiggy') ||
    order.tableNumber?.toLowerCase().includes('zomato');

  const channelTitle = getOrderDisplayTitle(order);

  const handlePrint = () => {
    if (isAddition && addition) {
      kotPrinter.printAdditionKot(
        restaurant,
        order,
        addition,
        {
          id: printerConfig?.id || 'cfg',
          printerName: printerConfig?.printerName || 'Thermal',
          paperWidth,
          autoPrintKot: true,
          printerType: printerConfig?.printerType || 'BROWSER'
        },
        { interactiveModal: true }
      );
    } else {
      kotPrinter.printOrderKot(
        restaurant,
        order,
        {
          id: printerConfig?.id || 'cfg',
          printerName: printerConfig?.printerName || 'Thermal',
          paperWidth,
          autoPrintKot: true,
          printerType: printerConfig?.printerType || 'BROWSER'
        },
        { interactiveModal: true }
      );
    }
  };

  const handleCopyText = () => {
    const rawText = kotPrinter.generateEscPosText(restaurant, order, paperWidth, addition || undefined);
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/70">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Printer className="w-4 h-4 text-orange-600" />
              <span>{isAddition ? 'Table Add-on KOT (New Addition)' : 'Kitchen Order Ticket (KOT)'}</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isAddition
                ? `${addition?.additionNumber} • ${channelTitle}`
                : `${order.kotNumber || 'KOT Generated'} • ${channelTitle}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-gray-100 border border-gray-200 p-0.5 text-xs font-medium">
              <button
                onClick={() => setPaperWidth('58mm')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  paperWidth === '58mm'
                    ? 'bg-white text-gray-900 shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                58mm
              </button>
              <button
                onClick={() => setPaperWidth('80mm')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  paperWidth === '80mm'
                    ? 'bg-white text-gray-900 shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                80mm
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thermal Slip Preview Container */}
        <div className="p-6 bg-gray-100 flex justify-center">
          <div
            id="thermal-print-area"
            style={{ width: paperWidth === '58mm' ? '240px' : '320px' }}
            className="bg-white p-5 rounded-lg shadow-xs border border-gray-300 font-mono text-xs text-gray-800 transition-all select-all flex flex-col items-center"
          >
            <div className="mb-2">
              <Logo variant="mark" theme="mono-black" size={28} />
            </div>
            <div className="text-center font-bold text-sm tracking-wider uppercase mb-1">
              {restaurant?.name || 'Swaad Sevak'}
            </div>

            {isAddition ? (
              <div className="text-center my-1 w-full">
                <div className="bg-slate-900 text-white font-bold text-[11px] py-1 px-2 rounded mb-1">
                  *** TABLE ADD-ON KOT ***
                </div>
                <div className="font-extrabold text-xs text-amber-900 tracking-wider">
                  &gt;&gt;&gt; NEW ADDITION &lt;&lt;&lt;
                </div>
                <div className="text-[11px] font-bold border-y border-dashed border-gray-400 py-1 my-1">
                  {addition?.additionNumber} | REF ORD #{order.orderNumber.replace('#', '')}
                </div>
              </div>
            ) : (
              <div className="text-center w-full">
                <div className="font-semibold text-xs text-gray-600 tracking-widest uppercase mb-1">
                  *** KITCHEN TICKET ***
                </div>
                <div className="font-bold text-xs border-y border-dashed border-gray-400 py-1 my-1">
                  {order.kotNumber || 'KOT-1042'} | ORD #{order.orderNumber.replace('#', '')}
                </div>
              </div>
            )}

            <div className="w-full flex justify-between py-1 text-[11px] font-semibold">
              <span>{isOnline ? channelTitle.toUpperCase() : `TABLE: ${channelTitle}`}</span>
              <span>{orderTime}</span>
            </div>
            <div className="w-full text-[11px] text-gray-600 mb-1">
              TYPE: {isOnline ? `${order.source} ONLINE DELIVERY` : (order.source || 'DINE_IN')} {isAddition ? '• (NEW TABLE ADDITION)' : ''}
              {order.estimatedPrepTime ? ` • PREP: ${order.estimatedPrepTime}m` : ''}
            </div>

            <div className="w-full border-t border-gray-400 my-1"></div>
            <div className="w-full flex justify-between font-bold text-[11px] py-1 border-b border-dashed border-gray-300">
              <span>QTY  ITEM</span>
              <span>PORTION</span>
            </div>

            <div className="w-full py-1 space-y-1.5">
              {items.map((item, idx) => (
                <div key={idx} className="border-b border-dotted border-gray-200 pb-1">
                  <div className="flex justify-between font-semibold">
                    <span>
                      <strong className="text-gray-900">{item.quantity}x</strong> {item.name}
                    </span>
                    <span className="text-[10px] text-gray-500">{item.portion || '-'}</span>
                  </div>
                  {item.notes && (
                    <div className="text-[10px] text-amber-700 italic pl-4">
                      * {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {notes && (
              <div className="w-full mt-2 pt-1 border-t border-dashed border-gray-400 text-[11px]">
                <span className="font-bold">INSTRUCTIONS:</span>
                <p className="text-gray-700 italic">{notes}</p>
              </div>
            )}

            {isAddition && (
              <div className="w-full my-2 p-1.5 rounded bg-amber-50 border border-amber-200 text-center text-[10px] font-bold text-amber-900">
                PREPARE & DELIVER TO ACTIVE TABLE
              </div>
            )}

            <div className="w-full border-t border-dashed border-gray-400 mt-3 pt-2 text-center text-[10px] text-gray-500 uppercase">
              Powered by Swaad Sevak POS
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Raw KOT' : 'Copy Text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to Connected Thermal ({paperWidth})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
