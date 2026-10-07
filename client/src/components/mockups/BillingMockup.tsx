import React, { useState } from 'react';
import { formatINR } from '../../lib/utils';
import { Printer, QrCode } from 'lucide-react';

export const BillingMockup: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'bestsellers' | 'starters' | 'mains'>('bestsellers');
  const [cart] = useState([
    { id: '1', name: 'Dal Makhani', price: 230, qty: 2 },
    { id: '2', name: 'Butter Garlic Naan', price: 60, qty: 4 },
    { id: '3', name: 'Jeera Rice', price: 180, qty: 1 },
  ]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  return (
    <div className="rounded-2xl bg-white border border-sand-200 shadow-card overflow-hidden font-sans text-left text-xs">
      {/* Top POS Toolbar */}
      <div className="bg-espresso text-white p-3 px-4 flex items-center justify-between border-b border-walnut">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
          <span className="font-mono font-bold text-xs text-white">TABLE 05 • DINE-IN</span>
          <span className="text-[10px] text-sand-200 font-sans">Captain: Suresh</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-orange-400 font-bold">
          <span>KOT #0988</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-sand-200">
        {/* Left Categories & Fast Item Touch Grid (7 Cols) */}
        <div className="md:col-span-7 p-4 space-y-3 bg-white">
          {/* Categories */}
          <div className="flex gap-1.5 pb-1 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('bestsellers')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedCategory === 'bestsellers'
                  ? 'bg-espresso text-white shadow-soft'
                  : 'bg-sand-100 text-espresso hover:bg-sand-200'
              }`}
            >
              Bestsellers
            </button>
            <button
              onClick={() => setSelectedCategory('starters')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedCategory === 'starters'
                  ? 'bg-espresso text-white shadow-soft'
                  : 'bg-sand-100 text-espresso hover:bg-sand-200'
              }`}
            >
              Curries &amp; Dal
            </button>
            <button
              onClick={() => setSelectedCategory('mains')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedCategory === 'mains'
                  ? 'bg-espresso text-white shadow-soft'
                  : 'bg-sand-100 text-espresso hover:bg-sand-200'
              }`}
            >
              Tandoor Breads
            </button>
          </div>

          {/* Rapid 3-Touch Dish Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl border border-sand-200 bg-sand-50/60 hover:border-orange-500 hover:bg-orange-50/30 transition-all cursor-pointer">
              <span className="font-bold text-espresso block truncate">Paneer Tikka Masala</span>
              <div className="flex justify-between items-center mt-1 text-[11px]">
                <span className="font-mono font-bold text-orange-dark">₹320</span>
                <span className="text-[10px] bg-orange-500 text-espresso font-extrabold px-2 py-0.5 rounded shadow-soft">
                  + ADD
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-sand-200 bg-sand-50/60 hover:border-orange-500 hover:bg-orange-50/30 transition-all cursor-pointer">
              <span className="font-bold text-espresso block truncate">Butter Garlic Naan</span>
              <div className="flex justify-between items-center mt-1 text-[11px]">
                <span className="font-mono font-bold text-orange-dark">₹60</span>
                <span className="text-[10px] bg-orange-500 text-espresso font-extrabold px-2 py-0.5 rounded shadow-soft">
                  + ADD
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-sand-200 bg-sand-50/60 hover:border-orange-500 hover:bg-orange-50/30 transition-all cursor-pointer">
              <span className="font-bold text-espresso block truncate">Murgh Dum Biryani</span>
              <div className="flex justify-between items-center mt-1 text-[11px]">
                <span className="font-mono font-bold text-orange-dark">₹380</span>
                <span className="text-[10px] bg-orange-500 text-espresso font-extrabold px-2 py-0.5 rounded shadow-soft">
                  + ADD
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-sand-200 bg-sand-50/60 hover:border-orange-500 hover:bg-orange-50/30 transition-all cursor-pointer">
              <span className="font-bold text-espresso block truncate">Cold Coffee Decoction</span>
              <div className="flex justify-between items-center mt-1 text-[11px]">
                <span className="font-mono font-bold text-orange-dark">₹140</span>
                <span className="text-[10px] bg-orange-500 text-espresso font-extrabold px-2 py-0.5 rounded shadow-soft">
                  + ADD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Active Order Cart & Settlement (5 Cols) */}
        <div className="md:col-span-5 p-4 flex flex-col justify-between bg-sand-50/80">
          <div className="space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-walnut font-mono block">
              Cart Summary (3 items)
            </span>

            <div className="space-y-1.5">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-[11px]">
                  <span className="truncate pr-2 text-espresso font-medium">
                    {item.qty}x {item.name}
                  </span>
                  <span className="font-mono font-bold text-espresso">
                    {formatINR(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-dashed border-sand-300 space-y-1 text-[11px]">
              <div className="flex justify-between text-walnut font-medium">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-espresso">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-walnut font-medium">
                <span>GST (2.5% CGST + 2.5% SGST):</span>
                <span className="font-mono font-bold text-espresso">{formatINR(gst)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-espresso text-sm pt-1 border-t border-sand-200">
                <span>Grand Total:</span>
                <span className="font-mono text-orange-dark font-extrabold">{formatINR(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <button className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-sand-300 bg-white font-bold text-espresso hover:bg-cream cursor-pointer shadow-soft">
                <Printer className="w-3.5 h-3.5 text-orange-500" />
                <span>Fire KOT</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-orange-500 font-extrabold text-espresso shadow-soft hover:bg-orange-600 cursor-pointer">
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
