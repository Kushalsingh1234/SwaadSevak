import React from 'react';
import {
  Flame,
  QrCode,
  Coins,
  Sparkles,
  Store,
  ArrowRight,
  Zap,
  Volume2,
  TrendingUp,
  ScanLine,
  Printer,
  ShieldCheck,
  Check,
  Smartphone,
  Layers,
  BellRing,
  Bot
} from 'lucide-react';

export const CoreFeaturesShowcaseSection: React.FC = () => {
  return (
    <section
      id="core-features"
      className="py-16 sm:py-24 font-sans relative overflow-hidden text-white"
      style={{ backgroundColor: '#130B06' }}
    >
      {/* Multi-Layer Ambient Luxury Lighting */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-[650px] h-[500px] bg-amber-500/12 rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-900/10 rounded-full blur-[180px] pointer-events-none -z-0" />

      {/* Warm Ambient Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 -z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Premium Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-linear-to-r from-orange-500/15 via-amber-500/15 to-orange-500/15 border border-orange-500/30 text-amber-300 shadow-[0_0_20px_rgba(242,92,5,0.25)] mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span className="tracking-wide uppercase text-[11px] font-mono">Precision Operational Stack</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white">
            Engineered For{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400 drop-shadow-[0_2px_20px_rgba(242,92,5,0.4)]">
              High-Speed Food Operations.
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-stone-300/90 mt-4 leading-relaxed font-normal max-w-2xl mx-auto">
            From table scans and real-time chef tickets to automated WhatsApp retention and AI menu engineering — everything runs in sync without hardware lock-in.
          </p>
        </div>

        {/* Ultra-Premium 4-Card Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch text-left">
          
          {/* Card 1: Live Kitchen Dispatch (7 Cols) */}
          <div
            className="lg:col-span-7 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_-5px_rgba(242,92,5,0.25)] border border-white/[0.08] hover:border-orange-500/60 backdrop-blur-2xl"
            style={{ backgroundColor: 'rgba(32, 18, 11, 0.95)' }}
          >
            {/* Ambient Radial Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 group-hover:bg-orange-500/20 rounded-full blur-3xl transition-all pointer-events-none" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0 ring-4 ring-orange-500/15">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10.5px] font-mono font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
                      Kitchen Flow
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Real-Time Audio Alerts</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1 group-hover:text-amber-300 transition-colors">
                Live Kitchen Dispatch &amp; Thermal KOT Routing
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-orange-400/90 mb-3">
                Zero lag between guest orders and chef pans
              </p>
              <p className="text-xs sm:text-[13.5px] text-stone-300 leading-relaxed mb-6 font-normal">
                A high-speed 3-column kitchen display (Incoming → Cooking → Ready &amp; Served). Orders appear instantly with customizable audio chimes and automatically fire formatted KOT slips to 80mm/58mm thermal printers.
              </p>
            </div>

            {/* Interactive Preview Widget */}
            <div className="rounded-2xl p-3.5 sm:p-4 bg-black/40 border border-white/[0.08] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="font-bold text-white">Live KOT: Table 04</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">DINE-IN</span>
                </div>
                <span className="text-[10px] text-stone-400">19:42 • Chef Station</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-stone-200">
                  <div className="font-bold text-white text-[11px]">2x Paneer Butter Masala</div>
                  <div className="text-[9.5px] text-orange-300">Spice: Medium • Extra Butter</div>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-stone-200">
                  <div className="font-bold text-white text-[11px]">4x Garlic Butter Naan</div>
                  <div className="text-[9.5px] text-emerald-400">Fired to Tandoor Section</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Smart QR Dine-In Ordering (5 Cols) */}
          <div
            className="lg:col-span-5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_-5px_rgba(16,185,129,0.2)] border border-white/[0.08] hover:border-emerald-500/60 backdrop-blur-2xl"
            style={{ backgroundColor: 'rgba(32, 18, 11, 0.95)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 group-hover:bg-emerald-500/20 rounded-full blur-3xl transition-all pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 ring-4 ring-emerald-500/15">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No App Required</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1 group-hover:text-emerald-300 transition-colors">
                Smart QR Dine-In Ordering
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-emerald-400 mb-3">
                Seamless guest ordering &amp; running additions
              </p>
              <p className="text-xs sm:text-[13.5px] text-stone-300 leading-relaxed mb-6 font-normal">
                Guests scan standee QRs to view responsive menus with veg/non-veg tags and spice notes. Guests order starters first and add main courses later without waving down floor waitstaff.
              </p>
            </div>

            {/* Micro QR Action Bar */}
            <div className="rounded-2xl p-3.5 bg-black/40 border border-white/[0.08] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-7 h-7 text-slate-900" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Table 02 Standee QR</div>
                  <div className="text-[10px] text-emerald-400 font-medium">1-Tap Waiter Call &amp; Bill Request</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10.5px] font-bold border border-emerald-500/30 font-mono">
                Active
              </span>
            </div>
          </div>

          {/* Card 3: SwaadSevak Coins CRM & WhatsApp Bot (5 Cols) */}
          <div
            className="lg:col-span-5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_-5px_rgba(245,158,11,0.2)] border border-white/[0.08] hover:border-amber-500/60 backdrop-blur-2xl"
            style={{ backgroundColor: 'rgba(32, 18, 11, 0.95)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 group-hover:bg-amber-500/20 rounded-full blur-3xl transition-all pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 ring-4 ring-amber-500/15">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>WhatsApp Linked</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1 group-hover:text-amber-300 transition-colors">
                SwaadSevak Coins &amp; WhatsApp CRM
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-amber-400 mb-3">
                Automated guest retention on your own WhatsApp
              </p>
              <p className="text-xs sm:text-[13.5px] text-stone-300 leading-relaxed mb-6 font-normal">
                Reward diners with discount coins on every bill. Automatically profile guest visits into VIP Regulars and At-Risk segments, triggering automated WhatsApp deals from your restaurant phone.
              </p>
            </div>

            {/* Micro Coin & WhatsApp Stat Box */}
            <div className="rounded-2xl p-3.5 bg-black/40 border border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-mono text-base">🪙</span>
                <div>
                  <div className="font-bold text-white text-[11px]">VIP Loyalty Tier</div>
                  <div className="text-[9.5px] text-stone-400">10 Coins per ₹100 Spent</div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                38% Re-visit Rate
              </span>
            </div>
          </div>

          {/* Card 4: AI Growth Engine & Menu Matrix (7 Cols) */}
          <div
            className="lg:col-span-7 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_-5px_rgba(168,85,247,0.2)] border border-white/[0.08] hover:border-purple-500/60 backdrop-blur-2xl"
            style={{ backgroundColor: 'rgba(32, 18, 11, 0.95)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 group-hover:bg-purple-500/20 rounded-full blur-3xl transition-all pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0 ring-4 ring-purple-500/15">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10.5px] font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      Intelligence
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  <span>Profitability Matrix</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1 group-hover:text-purple-300 transition-colors">
                AI Growth Engine &amp; Menu Matrix
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-purple-300/90 mb-3">
                Actionable revenue advice, not just raw reports
              </p>
              <p className="text-xs sm:text-[13.5px] text-stone-300 leading-relaxed mb-6 font-normal">
                Converts sales data into concrete revenue recommendations. Automatically categorizes items into high-margin Stars vs slow-moving Dogs, suggesting combo bundles and pricing adjustments.
              </p>
            </div>

            {/* Menu Matrix Mini Gauges */}
            <div className="rounded-2xl p-3.5 bg-black/40 border border-white/[0.08] grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                <div className="text-[10px] text-purple-300 font-bold uppercase">Star Combo Recommendation</div>
                <div className="text-white font-bold text-xs mt-0.5">Cold Brew + Croissant</div>
                <div className="text-emerald-400 text-[9.5px] mt-0.5 font-bold">+₹85 Lift in Average Ticket</div>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                <div className="text-[10px] text-purple-300 font-bold uppercase">Universal POS Importer</div>
                <div className="text-white font-bold text-xs mt-0.5">Petpooja / Excel Sync</div>
                <div className="text-amber-400 text-[9.5px] mt-0.5 font-bold">Instant 1-Click Import</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Hardware Independence Strip */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#2B1A12] via-[#24140D] to-[#1A0E08] border border-orange-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Zero Proprietary Hardware Lock-In
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                Runs on any Android Tablet, iPad, Windows PC, or smartphone with standard ESC/POS thermal printers.
              </p>
            </div>
          </div>

          <a
            href="#login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-glow-orange hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <span>Platform Login</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </a>
        </div>

      </div>
    </section>
  );
};
