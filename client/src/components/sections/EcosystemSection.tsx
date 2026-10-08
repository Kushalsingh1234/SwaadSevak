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

          {/* Card 2: Aggregator Hub */}
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
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Aggregator Hub</h3>
                    <span className="px-1.5 py-0.2 rounded-full text-[8.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono tracking-wide uppercase">Live Sync</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-blue-300 font-extrabold uppercase tracking-wider">Swiggy &amp; Zomato Sync + Rush Mode</span>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-[#E8D5C4] leading-relaxed mb-3.5 font-normal">
                Auto-accept food delivery orders on a single kitchen screen with channel pricing overrides and rush-hour kitchen protection.
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
                  <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-extrabold border border-blue-500/30">RUSH MODE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] text-emerald-400 font-bold">Prep: 35m</span>
                  <span className="font-mono font-bold text-white text-xs">₹495</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: AI Growth & CRM */}
          <div
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-[0_14px_36px_-6px_rgba(43,26,18,0.35)] hover:shadow-[0_22px_48px_-8px_rgba(249,115,22,0.30)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden text-white border border-[#5A3A28] hover:border-emerald-500/70"
            style={{ backgroundColor: '#3D2519' }}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">AI Growth &amp; CRM</h3>
                  <span className="text-[9.5px] font-mono text-amber-300 font-extrabold uppercase tracking-wider">Loyalty Coins &amp; WhatsApp Bot</span>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-[#E8D5C4] leading-relaxed mb-3.5 font-normal">
                Reward returning diners with SwaadSevak Coins, profile guest visit habits, and re-engage lapsed customers with automated WhatsApp perks.
              </p>
            </div>

            {/* Rich Micro UI: Live Loyalty Coins & Campaign Status */}
            <div
              className="rounded-xl p-2.5 sm:p-3 shadow-inner space-y-2 text-xs"
              style={{ backgroundColor: '#24140D', border: '1px solid #5A3A28' }}
            >
              <div className="bg-[#1C0E08] p-2 rounded-lg border border-[#5A3A28] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-mono text-sm">🪙</span>
                  <div>
                    <span className="font-bold text-white text-[11px] block">VIP Diner #204</span>
                    <span className="text-[9px] text-[#A89080]">Favorite: Paneer Tikka</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-amber-400 text-xs block">+80 Coins</span>
                  <span className="text-[9px] text-emerald-400 font-bold">Active VIP</span>
                </div>
              </div>
              <div className="bg-[#1C0E08] p-2 rounded-lg border border-[#5A3A28] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <span className="font-bold text-white text-[10.5px] block">Auto-Retention Bot</span>
                    <span className="text-[9px] text-[#A89080]">Re-engage 14D Inactive</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  34% Return Rate
                </span>
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
