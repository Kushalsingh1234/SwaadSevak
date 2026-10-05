import React from 'react';
import { AlertCircle, Package, Check } from 'lucide-react';

export const InventoryMockup: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white border border-sand-200 shadow-card p-5 sm:p-6 font-sans text-left text-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-sand-200">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-espresso font-mono">
            RECIPE AUTO-DEDUCTION ENGINE
          </span>
        </div>
        <span className="text-[10px] font-mono bg-green-50 text-success border border-success/30 px-2 py-0.5 rounded font-bold">
          Auto Sync Active
        </span>
      </div>

      {/* Morning Alert Box */}
      <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-espresso flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-dark shrink-0" />
          <span className="font-semibold text-espresso">Paneer &amp; Cream below threshold for evening dinner shift</span>
        </div>
        <button className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-espresso font-extrabold text-[11px] shrink-0 cursor-pointer shadow-soft">
          Generate Vendor PO
        </button>
      </div>

      {/* Recipe Stock Table */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 text-[10px] font-mono uppercase tracking-wider text-walnut font-bold pb-1 border-b border-sand-200">
          <span className="col-span-5">Raw Ingredient</span>
          <span className="col-span-3 text-right">Current Stock</span>
          <span className="col-span-4 text-right">Auto-Deduction / Dish</span>
        </div>

        <div className="grid grid-cols-12 items-center py-2 border-b border-sand-100">
          <div className="col-span-5 font-bold text-espresso">
            Fresh Malai Paneer
          </div>
          <div className="col-span-3 text-right font-mono font-extrabold text-orange-dark">
            2.4 kg (Low)
          </div>
          <div className="col-span-4 text-right font-mono text-walnut font-medium">
            -220g per Curry
          </div>
        </div>

        <div className="grid grid-cols-12 items-center py-2 border-b border-sand-100">
          <div className="col-span-5 font-bold text-espresso">
            Fresh Dairy Cream
          </div>
          <div className="col-span-3 text-right font-mono font-extrabold text-amber-700">
            3.0 L
          </div>
          <div className="col-span-4 text-right font-mono text-walnut font-medium">
            -40ml per Gravy
          </div>
        </div>

        <div className="grid grid-cols-12 items-center py-2 border-b border-sand-100">
          <div className="col-span-5 font-bold text-espresso">
            Basmati Biryani Rice
          </div>
          <div className="col-span-3 text-right font-mono font-extrabold text-success">
            42.0 kg
          </div>
          <div className="col-span-4 text-right font-mono text-walnut font-medium">
            -250g per Handi
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-[11px] text-walnut flex items-center justify-between">
        <span className="font-semibold text-espresso">Vendor: "Indiranagar Dairy Farm"</span>
        <span className="font-mono font-extrabold text-espresso">Est. PO: ₹4,250</span>
      </div>
    </div>
  );
};

export const ReportsMockup: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white border border-sand-200 shadow-card p-5 font-sans text-left text-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-sand-200">
        <span className="font-bold text-espresso font-mono">
          DAILY AUDIT &amp; TAX CLOSE-OUT
        </span>
        <span className="text-[10px] font-mono text-walnut font-bold">Shift Date: 05 Oct 2026</span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center font-mono">
        <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
          <span className="text-[10px] text-walnut font-bold block">Gross Sales</span>
          <span className="text-base font-extrabold text-espresso font-sans">₹68,450</span>
          <span className="text-[9px] text-success font-bold block">142 Bills Settled</span>
        </div>

        <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
          <span className="text-[10px] text-walnut font-bold block">5% GST Share</span>
          <span className="text-base font-extrabold text-orange-dark font-sans">₹3,422.50</span>
          <span className="text-[9px] text-walnut block">CGST + SGST</span>
        </div>

        <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
          <span className="text-[10px] text-walnut font-bold block">UPI Volume</span>
          <span className="text-base font-extrabold text-espresso font-sans">₹44,200</span>
          <span className="text-[9px] text-walnut block">64% of Total</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-green-50 border border-success/30 flex items-center justify-between text-espresso">
        <div className="flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 text-success shrink-0" />
          <span>Automated WhatsApp Z-Report delivered to Owner</span>
        </div>
        <span className="font-mono font-bold text-[10px] bg-success text-white px-2 py-0.5 rounded">
          Delivered 11:45 PM
        </span>
      </div>
    </div>
  );
};
