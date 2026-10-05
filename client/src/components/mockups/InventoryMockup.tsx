import React from 'react';
import { AlertCircle, ArrowDownRight, Package, Check, RefreshCw } from 'lucide-react';

export const InventoryMockup: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-card p-5 font-sans text-left text-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-ink-100 dark:border-ink-800">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-ember-500" />
          <span className="font-bold text-ink-950 dark:text-ink-50 font-mono">
            RECIPE AUTO-DEDUCTION ENGINE
          </span>
        </div>
        <span className="text-[10px] font-mono bg-success-50 dark:bg-success-950/60 text-success-600 dark:text-success-400 px-2 py-0.5 rounded font-bold">
          Auto Sync Active
        </span>
      </div>

      {/* Morning Alert Box */}
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Paneer & Cream below threshold for evening dinner shift</span>
        </div>
        <button className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] cursor-pointer">
          Generate Vendor PO
        </button>
      </div>

      {/* Recipe Stock Table */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 text-[10px] font-mono uppercase tracking-wider text-ink-500 pb-1 border-b border-ink-100 dark:border-ink-800">
          <span className="col-span-5">Raw Ingredient</span>
          <span className="col-span-3 text-right">Current Stock</span>
          <span className="col-span-4 text-right">Auto-Deduction / Dish</span>
        </div>

        <div className="grid grid-cols-12 items-center py-1.5 border-b border-ink-100 dark:border-ink-800/50">
          <div className="col-span-5 font-semibold text-ink-900 dark:text-ink-100">
            Fresh Malai Paneer
          </div>
          <div className="col-span-3 text-right font-mono font-bold text-red-600 dark:text-red-400">
            2.4 kg (Low)
          </div>
          <div className="col-span-4 text-right font-mono text-ink-500">
            -220g per Curry
          </div>
        </div>

        <div className="grid grid-cols-12 items-center py-1.5 border-b border-ink-100 dark:border-ink-800/50">
          <div className="col-span-5 font-semibold text-ink-900 dark:text-ink-100">
            Fresh Dairy Cream
          </div>
          <div className="col-span-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
            3.0 L
          </div>
          <div className="col-span-4 text-right font-mono text-ink-500">
            -40ml per Gravy
          </div>
        </div>

        <div className="grid grid-cols-12 items-center py-1.5 border-b border-ink-100 dark:border-ink-800/50">
          <div className="col-span-5 font-semibold text-ink-900 dark:text-ink-100">
            Basmati Biryani Rice
          </div>
          <div className="col-span-3 text-right font-mono font-bold text-success-600 dark:text-success-400">
            42.0 kg
          </div>
          <div className="col-span-4 text-right font-mono text-ink-500">
            -250g per Handi
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-ink-50 dark:bg-ink-950/40 text-[11px] text-ink-600 dark:text-ink-400 flex items-center justify-between">
        <span>Vendor: "Indiranagar Dairy Farm"</span>
        <span className="font-mono font-bold text-ink-900 dark:text-ink-100">Est. PO: ₹4,250</span>
      </div>
    </div>
  );
};

export const ReportsMockup: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-card p-5 font-sans text-left text-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-ink-100 dark:border-ink-800">
        <span className="font-bold text-ink-950 dark:text-ink-50 font-mono">
          DAILY AUDIT & TAX CLOSE-OUT
        </span>
        <span className="text-[10px] font-mono text-ink-500">Shift Date: 05 Oct 2026</span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center font-mono">
        <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-200/80 dark:border-ink-800">
          <span className="text-[10px] text-ink-500 block">Gross Sales</span>
          <span className="text-base font-bold text-ink-950 dark:text-ink-50 font-sans">₹68,450</span>
          <span className="text-[9px] text-success-600 block">142 Bills Settled</span>
        </div>

        <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-200/80 dark:border-ink-800">
          <span className="text-[10px] text-ink-500 block">5% GST Share</span>
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-sans">₹3,422.50</span>
          <span className="text-[9px] text-ink-400 block">CGST + SGST</span>
        </div>

        <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-200/80 dark:border-ink-800">
          <span className="text-[10px] text-ink-500 block">UPI Volume</span>
          <span className="text-base font-bold text-ember-600 dark:text-ember-400 font-sans">₹44,200</span>
          <span className="text-[9px] text-ink-400 block">64% of Total</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-success-50 dark:bg-success-950/40 border border-success-200 dark:border-success-800/60 flex items-center justify-between text-success-900 dark:text-success-200">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-success-600 shrink-0" />
          <span>Automated WhatsApp Z-Report delivered to Owner</span>
        </div>
        <span className="font-mono font-bold text-[10px] bg-success-600 text-white px-2 py-0.5 rounded">
          Delivered 11:45 PM
        </span>
      </div>
    </div>
  );
};
