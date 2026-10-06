import React from 'react';
import { Monitor, ShoppingBag, Boxes, Globe, ArrowRight, Flame } from 'lucide-react';
import { SITE_CONTENT } from '../../content/site';

export const EcosystemSection: React.FC = () => {
  return (
    <section id="ecosystem" className="py-8 sm:py-12 text-espresso font-sans relative overflow-hidden" style={{ backgroundColor: '#FFF8F1' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-6 sm:mb-8">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-espresso shadow-soft mb-2"
            style={{ backgroundColor: '#EFE2D3', border: '1px solid #D8C2AC' }}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
            <span>Complete Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-espresso tracking-tight mb-2">
            Four Modular Engines to Run Your Entire Food Business
          </h2>
          <p className="text-xs sm:text-[13px] text-[#5A3A28] leading-relaxed">
            Everything connects seamlessly. Use one module or combine them all without messy third-party integrations or monthly surprises.
          </p>
        </div>

        {/* 2x2 Grid of Rich Brown Luxury Cards with Deep Shadows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-left">
          
          {/* Card 1: SwaadSevak POS */}
          <div
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_14px_36px_-6px_rgba(43,26,18,0.35)] hover:shadow-[0_22px_48px_-8px_rgba(249,115,22,0.30)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden text-white border border-[#5A3A28] hover:border-orange-500/70"
            style={{ backgroundColor: '#3D2519' }}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">SwaadSevak POS</h3>
                  <span className="text-[9.5px] font-mono text-orange-400 font-extrabold uppercase tracking-wider">Fast Counter Billing &amp; KOT</span>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-[#E8D5C4] leading-relaxed mb-3.5 font-normal">
                3-touch checkout, dynamic table floor plans, split payments, and automated thermal KOT routing direct to kitchen stations.
              </p>
            </div>

            {/* Rich Micro UI: Bill & KOT Duo */}
            <div
              className="rounded-xl p-2.5 sm:p-3 shadow-inner grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-stretch"
              style={{ backgroundColor: '#24140D', border: '1px solid #5A3A28' }}
            >
              {/* Receipt slip left */}
              <div className="bg-[#1C0E08] rounded-lg p-2.5 border border-[#5A3A28] text-left text-xs font-mono space-y-1 text-[#E8D5C4]">
                <div className="flex justify-between font-bold text-white border-b border-[#5A3A28] pb-1 text-[10px]">
                  <span>TAX INVOICE</span>
                  <span className="text-orange-400 font-extrabold">#1042</span>
                </div>
                <div className="text-[9.5px] flex justify-between pt-0.5 text-[#C4A895]">
                  <span>1x Paneer Butter</span>
                  <span className="text-white">₹340</span>
                </div>
                <div className="text-[9.5px] flex justify-between text-[#C4A895]">
                  <span>2x Garlic Naan</span>
                  <span className="text-white">₹160</span>
                </div>
                <div className="text-[10px] text-white font-bold flex justify-between border-t border-[#5A3A28] pt-1 mt-0.5">
                  <span>Total (5% GST)</span>
                  <span className="text-orange-400 font-extrabold">₹525</span>
                </div>
              </div>

              {/* KOT ticket right */}
              <div className="bg-[#1C0E08] text-white rounded-lg p-2.5 text-left text-xs font-mono space-y-1 border border-[#5A3A28]">
                <div className="flex justify-between font-bold text-orange-400 border-b border-[#5A3A28] pb-1 text-[10px]">
                  <span>KOT: T-04</span>
                  <span className="text-[9px] text-[#A89080]">19:42</span>
                </div>
                <div className="text-[9.5px] text-[#E8D5C4] pt-0.5">
                  <span className="font-bold text-white">2x</span> Garlic Naan <span className="text-orange-300 text-[8.5px]">[Crispy]</span>
                </div>
                <div className="text-[9.5px] text-[#E8D5C4]">
                  <span className="font-bold text-white">1x</span> Paneer Masala
                </div>
                <div className="text-[8.5px] text-emerald-400 pt-0.5 font-sans font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span>Fired to Tandoor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Online Orders Hub */}
          <div
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_14px_36px_-6px_rgba(43,26,18,0.35)] hover:shadow-[0_22px_48px_-8px_rgba(249,115,22,0.30)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden text-white border border-[#5A3A28] hover:border-blue-500/70"
            style={{ backgroundColor: '#3D2519' }}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Online Orders Hub</h3>
                    <span className="px-1.5 py-0.2 rounded-full text-[8.5px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono tracking-wide uppercase">Coming Soon</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-blue-300 font-extrabold uppercase tracking-wider">Zomato, Swiggy &amp; ONDC Sync</span>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-[#E8D5C4] leading-relaxed mb-3.5 font-normal">
                Auto-accept food delivery orders on a single kitchen screen without juggling five separate aggregator tablets.
              </p>
            </div>

            {/* Rich Micro UI: Live Aggregator Feeds */}
            <div
              className="rounded-xl p-2.5 sm:p-3 shadow-inner space-y-2"
              style={{ backgroundColor: '#24140D', border: '1px solid #5A3A28' }}
            >
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1C0E08] border border-[#5A3A28] text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="font-bold text-white text-[11px]">Zomato #892</span>
                  <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-extrabold border border-orange-500/30">AUTO</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] text-[#A89080] font-medium">Ready in 4m</span>
                  <span className="font-mono font-bold text-white text-xs">₹680</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1C0E08] border border-[#5A3A28] text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="font-bold text-white text-[11px]">Swiggy #410</span>
                  <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-extrabold border border-blue-500/30">RIDER</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] text-emerald-400 font-bold">Packed</span>
                  <span className="font-mono font-bold text-white text-xs">₹495</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Inventory & Stock */}
          <div
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_14px_36px_-6px_rgba(43,26,18,0.35)] hover:shadow-[0_22px_48px_-8px_rgba(249,115,22,0.30)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden text-white border border-[#5A3A28] hover:border-emerald-500/70"
            style={{ backgroundColor: '#3D2519' }}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Inventory &amp; Stock</h3>
                  <span className="text-[9.5px] font-mono text-emerald-300 font-extrabold uppercase tracking-wider">Automated Recipe Deductions</span>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-[#E8D5C4] leading-relaxed mb-3.5 font-normal">
                Prevent kitchen pilferage and stockouts with recipe-level ingredient consumption tracking and automated purchase alerts.
              </p>
            </div>

            {/* Rich Micro UI: Live Stock Gauges */}
            <div
              className="rounded-xl p-2.5 sm:p-3 shadow-inner space-y-2 text-xs"
              style={{ backgroundColor: '#24140D', border: '1px solid #5A3A28' }}
            >
              <div className="bg-[#1C0E08] p-2.5 rounded-lg border border-[#5A3A28]">
                <div className="flex justify-between font-bold text-white mb-1.5 text-[10.5px]">
                  <span>Paneer Blocks (Fresh)</span>
                  <span className="font-mono text-orange-400 font-extrabold">4.2 kg left • <span className="text-[9px] font-normal text-[#A89080]">-220g</span></span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#3D2519] overflow-hidden">
                  <div className="w-[32%] h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-[0_0_6px_rgba(249,115,22,0.5)]" />
                </div>
              </div>
              <div className="bg-[#1C0E08] p-2.5 rounded-lg border border-[#5A3A28]">
                <div className="flex justify-between font-bold text-white mb-1.5 text-[10.5px]">
                  <span>Basmati Rice (Daily)</span>
                  <span className="font-mono text-emerald-400 font-extrabold">38 kg left</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#3D2519] overflow-hidden">
                  <div className="w-[82%] h-full bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Restaurant Website & Direct Orders */}
          <div
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_14px_36px_-6px_rgba(43,26,18,0.35)] hover:shadow-[0_22px_48px_-8px_rgba(249,115,22,0.30)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden text-white border border-[#5A3A28] hover:border-purple-500/70"
            style={{ backgroundColor: '#3D2519' }}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Restaurant Website</h3>
                  <span className="text-[9.5px] font-mono text-purple-300 font-extrabold uppercase tracking-wider">0% Commission Direct Orders</span>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-[#E8D5C4] leading-relaxed mb-3.5 font-normal">
                Custom branded digital menu with 1-tap WhatsApp ordering. We provide custom scope, quote, and live delivery within 24 hours.
              </p>
            </div>

            {/* Rich Micro UI: Web URL & Action Pill */}
            <div
              className="rounded-xl p-2.5 sm:p-3 shadow-inner flex items-center justify-between gap-2.5"
              style={{ backgroundColor: '#24140D', border: '1px solid #5A3A28' }}
            >
              <div className="text-left space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white text-[11px]">yourbrand.swaadsevak.app</span>
                </div>
                <span className="text-[#C4A895] text-[9.5px] block font-medium">Digital Menu • Direct UPI • 0% Cut</span>
              </div>
              <a
                href={SITE_CONTENT.links.websiteInquiry}
                className="px-3 py-1.5 rounded-lg bg-orange-500 text-espresso text-[11px] font-bold hover:bg-orange-400 transition-all shrink-0 flex items-center gap-1.5 shadow-[0_0_12px_rgba(249,115,22,0.4)] hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Get Quote</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
