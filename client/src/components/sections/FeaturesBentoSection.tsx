import React from 'react';
import {
  QrCode,
  Flame,
  Layers,
  Receipt,
  Printer,
  Store,
  TableProperties,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const FeaturesBentoSection: React.FC = () => {
  return (
    <section
      id="features"
      className="pt-3 sm:pt-4 pb-12 sm:pb-16 font-sans relative overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[3.5rem] md:rounded-b-[4rem] shadow-2xl"
      style={{ backgroundColor: '#2B1A12' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <div
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-bold shadow-soft mb-2.5"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FAF4ED' }}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
            <span>Everything Included</span>
          </div>
          <h2 className="h2-fluid font-extrabold tracking-tight mb-1.5 text-white">
            Engineered for High-Speed Food Operations
          </h2>
          <p className="text-[11px] sm:text-xs leading-relaxed font-medium text-[#F5E9DD]">
            Every feature you need to take orders, fire KOTs, print bills, and track revenue seamlessly.
          </p>
        </div>

        {/* Bento Grid (3-column layout matching design) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 text-left">
          
          {/* Card 1: QR Table Ordering for Guests (Hero card, spans 2 cols on md/lg) */}
          <div
            className="md:col-span-2 text-white p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28' }}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-[#FF9E58] border border-orange-500/30 mb-2.5">
                <QrCode className="w-3.5 h-3.5" />
                <span>No App Download</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-1.5">
                QR Table Ordering for Guests
              </h3>
              <p className="text-[11px] sm:text-xs text-[#F5E9DD] leading-relaxed max-w-xl">
                Guests scan the standee QR from their phone camera, browse dishes with veg/non-veg tags, customize portions, and order directly. No waving for busy waitstaff.
              </p>
            </div>

            {/* Graphic snippet */}
            <div
              className="mt-5 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3"
              style={{ backgroundColor: '#2B1A12', border: '1px solid #5A3A28' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Table 01 Standee QR</p>
                  <p className="text-[10px] text-[#F5E9DD]/80">Instant browser menu</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#FF9E58] flex items-center gap-1">
                Scan &amp; Order <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Live Kitchen Board */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-slate-900 min-h-[190px]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-2.5">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Live Kitchen Board
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Orders appear instantly with an audio sound alert. Move tickets from Incoming &rarr; Cooking &rarr; Ready with 1 tap.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 text-[10.5px] font-bold text-amber-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span>Audio ting on every new ticket</span>
            </div>
          </div>

          {/* Card 3: One Screen, All Channels */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-slate-900 min-h-[190px]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-2.5">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                One Screen, All Channels
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Dine-in, Swiggy and Zomato orders in a unified dispatch view. No juggling separate tablets.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 text-[10.5px] font-bold text-blue-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span>Centralised kitchen queue</span>
            </div>
          </div>

          {/* Card 4: Smart Billing & 5% GST */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-slate-900 min-h-[190px]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-2.5">
                <Receipt className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Smart Billing &amp; 5% GST
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Auto-calculated CGST/SGST, Cash and UPI settlement, and 1-click printable digital receipts.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 text-[10.5px] font-bold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>GST-ready receipts with GSTIN</span>
            </div>
          </div>

          {/* Card 5: Thermal KOT Printer */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-slate-900 min-h-[190px]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-2.5">
                <Printer className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Thermal KOT Printer
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Compatible with 80mm and 58mm thermal printers. Print formatted kitchen tickets with zero driver hassles.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 text-[10.5px] font-bold text-purple-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
              <span>80mm POS &amp; 58mm compact slips</span>
            </div>
          </div>

          {/* Card 6: Instant Menu & 86 Toggles */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-slate-900 min-h-[190px]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center mb-2.5">
                <Store className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Instant Menu &amp; 86 Toggles
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Ran out of paneer? Toggle an item to "86'd" in one tap, instantly disabled across every live table QR.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 text-[10.5px] font-bold text-orange-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              <span>Real-time stock sync</span>
            </div>
          </div>

          {/* Card 7: Tables & Standee QRs */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-slate-900 min-h-[190px]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-2.5">
                <TableProperties className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Tables &amp; Standee QRs
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Add dining tables, generate custom standee QRs with your restaurant name, and download in bulk as a ZIP.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 text-[10.5px] font-bold text-amber-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span>Printable high-res PNGs</span>
            </div>
          </div>

          {/* Card 8: Owner Sales Dashboard */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-slate-900 min-h-[190px]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-2.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Owner Sales Dashboard
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Monitor today's gross revenue, active tables, top selling dishes, and shift activity directly from your smartphone.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 text-[10.5px] font-bold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Accessible on any phone</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
