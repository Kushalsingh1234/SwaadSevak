import React from 'react';
import { Sparkles, TrendingUp, Check, Coins } from 'lucide-react';

export const InventoryMockup: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white border border-sand-200 shadow-card p-5 sm:p-6 font-sans text-left text-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-sand-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-espresso font-mono">
            AI GROWTH ENGINE &amp; CRM COINS
          </span>
        </div>
        <span className="text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          AI Engine Active
        </span>
      </div>

      {/* Growth Recommendation Alert */}
      <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-espresso flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-600 shrink-0" />
          <span className="font-semibold text-espresso">Bundle Cold Brew + Croissant to increase AOV by +₹85</span>
        </div>
        <button className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-espresso font-extrabold text-[11px] shrink-0 cursor-pointer shadow-soft">
          Apply Combo Deal
        </button>
      </div>

      {/* Customer Loyalty Segments Table */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 text-[10px] font-mono uppercase tracking-wider text-walnut font-bold pb-1 border-b border-sand-200">
          <span className="col-span-5">Customer Segment</span>
          <span className="col-span-3 text-right">Guest Count</span>
          <span className="col-span-4 text-right">Swaad Coins Accrued</span>
        </div>

        <div className="grid grid-cols-12 items-center py-2 border-b border-sand-100">
          <div className="col-span-5 font-bold text-espresso flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-purple-100 text-purple-800 font-bold">VIP</span>
            <span>Regular Diners (3+ visits)</span>
          </div>
          <div className="col-span-3 text-right font-mono font-extrabold text-espresso">
            184 Guests
          </div>
          <div className="col-span-4 text-right font-mono text-amber-700 font-bold">
            18,400 🪙
          </div>
        </div>

        <div className="grid grid-cols-12 items-center py-2 border-b border-sand-100">
          <div className="col-span-5 font-bold text-espresso flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-100 text-amber-800 font-bold">AT RISK</span>
            <span>Inactive 14+ Days</span>
          </div>
          <div className="col-span-3 text-right font-mono font-extrabold text-orange-dark">
            62 Guests
          </div>
          <div className="col-span-4 text-right font-mono text-emerald-700 font-bold">
            Auto-WhatsApp Sent
          </div>
        </div>

        <div className="grid grid-cols-12 items-center py-2 border-b border-sand-100">
          <div className="col-span-5 font-bold text-espresso flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 text-emerald-800 font-bold">NEW</span>
            <span>First-Time QR Diners</span>
          </div>
          <div className="col-span-3 text-right font-mono font-extrabold text-success">
            94 Guests
          </div>
          <div className="col-span-4 text-right font-mono text-amber-700 font-bold">
            +100 Bonus Coins
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-[11px] text-walnut flex items-center justify-between">
        <span className="font-semibold text-espresso">WhatsApp Campaign: "Weekend VIP Perk"</span>
        <span className="font-mono font-extrabold text-emerald-700">38% Re-visit Rate</span>
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
