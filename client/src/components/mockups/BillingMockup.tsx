import React, { useState } from 'react';
import { formatINR } from '../../lib/utils';
import { Printer, QrCode, CreditCard, Banknote, Plus, Minus, Check, Sparkles } from 'lucide-react';

export const BillingMockup: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'bestsellers' | 'starters' | 'mains'>('bestsellers');
  const [cart, setCart] = useState([
    { id: '1', name: 'Dal Makhani', price: 230, qty: 2 },
    { id: '2', name: 'Butter Garlic Naan', price: 60, qty: 4 },
    { id: '3', name: 'Jeera Rice', price: 180, qty: 1 },
  ]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  return (
    <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-card overflow-hidden font-sans text-left text-xs">
      {/* Top POS Toolbar */}
      <div className="bg-ink-950 text-white p-3 px-4 flex items-center justify-between border-b border-ink-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-success-500" />
          <span className="font-mono font-bold text-xs">TABLE 05 • DINE-IN</span>
          <span className="text-[10px] text-ink-400 font-sans">Captain: Suresh</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-ember-400">
          <span>KOT #0988</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-ink-200 dark:divide-ink-800">
        {/* Left Categories & Fast Item Touch Grid (7 Cols) */}
        <div className="md:col-span-7 p-4 space-y-3">
          {/* Categories */}
          <div className="flex gap-1.5 pb-1 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('bestsellers')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedCategory === 'bestsellers'
                  ? 'bg-ink-950 text-white dark:bg-ember-500 dark:text-ink-950'
                  : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300'
              }`}
            >
              Bestsellers
            </button>
            <button
              onClick={() => setSelectedCategory('starters')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedCategory === 'starters'
                  ? 'bg-ink-950 text-white dark:bg-ember-500 dark:text-ink-950'
                  : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300'
              }`}
            >
              Curries & Dal
            </button>
            <button
              onClick={() => setSelectedCategory('mains')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedCategory === 'mains'
                  ? 'bg-ink-950 text-white dark:bg-ember-500 dark:text-ink-950'
                  : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300'
              }`}
            >
              Tandoor Breads
            </button>
          </div>

          {/* Rapid 3-Touch Dish Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/40 hover:border-ember-500 transition-all cursor-pointer">
              <span className="font-bold text-ink-950 dark:text-ink-50 block truncate">Paneer Tikka Masala</span>
              <div className="flex justify-between items-center mt-1 text-[11px]">
                <span className="font-mono text-ink-600 dark:text-ink-400">₹320</span>
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold">
                  + ADD
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/40 hover:border-ember-500 transition-all cursor-pointer">
              <span className="font-bold text-ink-950 dark:text-ink-50 block truncate">Butter Garlic Naan</span>
              <div className="flex justify-between items-center mt-1 text-[11px]">
                <span className="font-mono text-ink-600 dark:text-ink-400">₹60</span>
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold">
                  + ADD
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/40 hover:border-ember-500 transition-all cursor-pointer">
              <span className="font-bold text-ink-950 dark:text-ink-50 block truncate">Murgh Dum Biryani</span>
              <div className="flex justify-between items-center mt-1 text-[11px]">
                <span className="font-mono text-ink-600 dark:text-ink-400">₹380</span>
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold">
                  + ADD
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/40 hover:border-ember-500 transition-all cursor-pointer">
              <span className="font-bold text-ink-950 dark:text-ink-50 block truncate">Cold Coffee Decoction</span>
              <div className="flex justify-between items-center mt-1 text-[11px]">
                <span className="font-mono text-ink-600 dark:text-ink-400">₹140</span>
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold">
                  + ADD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Active Order Cart & Settlement (5 Cols) */}
        <div className="md:col-span-5 p-4 flex flex-col justify-between bg-ink-50/30 dark:bg-ink-950/20">
          <div className="space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-ink-500 font-mono block">
              Cart Summary (3 items)
            </span>

            <div className="space-y-1.5">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-[11px]">
                  <span className="truncate pr-2 text-ink-900 dark:text-ink-100">
                    {item.qty}x {item.name}
                  </span>
                  <span className="font-mono font-semibold text-ink-900 dark:text-ink-100">
                    {formatINR(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-dashed border-ink-200 dark:border-ink-800 space-y-1 text-[11px]">
              <div className="flex justify-between text-ink-500">
                <span>Subtotal:</span>
                <span className="font-mono">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-500">
                <span>GST (2.5% CGST + 2.5% SGST):</span>
                <span className="font-mono">{formatINR(gst)}</span>
              </div>
              <div className="flex justify-between font-bold text-ink-950 dark:text-ink-50 text-sm pt-1 border-t border-ink-200 dark:border-ink-800">
                <span>Grand Total:</span>
                <span className="font-mono text-ember-600 dark:text-ember-400">{formatINR(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <button className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 font-semibold text-ink-900 dark:text-ink-100 hover:bg-ink-50 cursor-pointer">
                <Printer className="w-3.5 h-3.5 text-ember-500" />
                <span>Fire KOT</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-ember font-bold text-ink-950 shadow-sm hover:opacity-95 cursor-pointer">
                <QrCode className="w-3.5 h-3.5" />
                <span>Dynamic UPI</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
