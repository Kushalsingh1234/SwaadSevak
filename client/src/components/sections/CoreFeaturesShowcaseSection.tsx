import React from 'react';
import {
  Flame,
  QrCode,
  Coins,
  Sparkles,
  Receipt,
  Store,
  Volume2,
  TrendingUp,
  Printer,
  ShieldCheck,
  Check,
  Smartphone,
  Bot,
  Zap,
  ArrowRight,
  CreditCard,
  ScanLine
} from 'lucide-react';

export const CoreFeaturesShowcaseSection: React.FC = () => {
  const features = [
    {
      id: 'kot',
      tag: 'Kitchen Operations',
      tagColor: 'from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30',
      icon: Flame,
      iconBg: 'bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 text-white shadow-orange-500/30',
      title: 'Live Kitchen Dispatch & Thermal KOT Engine',
      subtitle: 'Zero delay between table orders and chef pans',
      description:
        'A high-speed 3-column kitchen command display (Incoming → Cooking → Ready & Served). Orders appear with instant audio sound chimes and auto-print to 80mm/58mm thermal printers.',
      highlights: [
        'Real-time WebSocket instant order streaming with multi-station dispatch',
        'Custom audio sound alert engine with continuous loop alerts for peak rush',
        'Auto thermal printing on 80mm & 58mm USB, LAN & Bluetooth printers',
        'Running additions and chef instructions highlighted with color badges'
      ],
      badge: 'Live Sound Alerts',
      preview: (
        <div className="rounded-2xl p-3 bg-black/50 border border-white/[0.08] space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="font-bold text-white">Live KOT: Table 04</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">DINE-IN</span>
            </div>
            <span className="text-[10px] text-stone-400">19:42 • Tandoor</span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between text-[11px]">
            <span className="font-bold text-white">2x Paneer Tikka (Crispy)</span>
            <span className="text-emerald-400 font-bold">Chef Station</span>
          </div>
        </div>
      )
    },
    {
      id: 'qr',
      tag: 'Guest Experience',
      tagColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      icon: QrCode,
      iconBg: 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-500 text-white shadow-emerald-500/30',
      title: 'Smart QR Table Ordering & Digital Waiter Call',
      subtitle: 'Frictionless mobile web dining without app downloads',
      description:
        'Guests scan their table standee QR to browse rich digital menus with high-res photos, veg/non-veg tags, and portion sizes. Diners place running additions, request bills, or call the waiter in 1 tap directly from their phone.',
      highlights: [
        'Zero app download or registration required for diners',
        'Running table additions: order starters first and add mains later seamlessly',
        '1-Tap "Call Waiter" and "Request Bill" alerts sent to manager screens',
        'Dietary filters: Veg / Non-Veg indicators, spice level badges & portion options'
      ],
      badge: 'Zero App Download',
      preview: (
        <div className="rounded-2xl p-3 bg-black/50 border border-white/[0.08] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Table 02 Standee QR</div>
              <div className="text-[10px] text-emerald-400 font-medium">1-Tap Waiter Call &amp; Bill Request</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 font-mono">
            Active
          </span>
        </div>
      )
    },
    {
      id: 'crm',
      tag: 'Retention & Loyalty',
      tagColor: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
      icon: Coins,
      iconBg: 'bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 text-white shadow-amber-500/30',
      title: 'SwaadSevak Coins CRM & Automated WhatsApp Bot',
      subtitle: 'Turn first-time diners into loyal weekly regulars',
      description:
        'A built-in customer loyalty program that awards discount coins on every meal. Automatically segment guests into VIP Regulars, New Diners, and At-Risk groups, then trigger automated re-engagement WhatsApp perks directly from your restaurant phone.',
      highlights: [
        'Configurable Coin Earn & Burn rules (e.g. 10 coins / ₹100) with discount caps',
        'Dynamic guest segmentation: VIP regulars, frequent diners, and 14+ day inactive',
        'Direct WhatsApp Web QR integration (send campaigns from your own official number)',
        'Automated re-engagement perks, birthday coupons, and digital receipts'
      ],
      badge: 'WhatsApp Linked',
      preview: (
        <div className="rounded-2xl p-3 bg-black/50 border border-white/[0.08] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-mono text-base">🪙</span>
            <div>
              <div className="font-bold text-white text-[11px]">VIP Loyalty Tier</div>
              <div className="text-[9.5px] text-stone-400">10 Coins per ₹100 Spent</div>
            </div>
          </div>
          <span className="text-[10.5px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/30">
            38% Return Rate
          </span>
        </div>
      )
    },
    {
      id: 'growth',
      tag: 'AI Intelligence',
      tagColor: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
      icon: Sparkles,
      iconBg: 'bg-gradient-to-tr from-purple-600 via-indigo-500 to-purple-500 text-white shadow-purple-500/30',
      title: 'AI Growth Engine & Menu Profitability Matrix',
      subtitle: 'Your POS tells you what happened; Growth Engine tells you what to do',
      description:
        'Transform raw transaction logs into prioritized, concrete revenue actions. Uses menu engineering matrices to pinpoint your high-margin "Stars" vs low-profit "Dogs", recommending combo bundles and price optimizations.',
      highlights: [
        'Menu Engineering Matrix: Classifies dishes by profitability vs popularity',
        'Universal POS CSV/Excel importer (Petpooja, Posist, UrbanPiper, standard sheets)',
        'Actionable AI revenue suggestions: combo deals, dead-stock clearance & pricing tips',
        'Tailored operational benchmarks for Cafés, QSRs, Bakeries, and Fine Dining'
      ],
      badge: 'Actionable Advice',
      preview: (
        <div className="rounded-2xl p-3 bg-black/50 border border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <div>
            <div className="text-[10px] text-purple-300 font-bold uppercase">Star Combo Recommendation</div>
            <div className="text-white font-bold text-[11px] mt-0.5">Cold Brew + Croissant</div>
          </div>
          <span className="text-emerald-400 text-[10.5px] font-bold">+₹85 Ticket Lift</span>
        </div>
      )
    },
    {
      id: 'billing',
      tag: 'Fast Checkout',
      tagColor: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
      icon: Receipt,
      iconBg: 'bg-gradient-to-tr from-blue-600 via-cyan-500 to-blue-500 text-white shadow-blue-500/30',
      title: 'High-Speed Counter POS & Instant Thermal Billing',
      subtitle: 'Lightning fast counter checkout for 200+ orders per hour',
      description:
        'Ultra-fast checkout flow designed for high-volume shifts. Handles split payments, coin discount redemptions, customized tax invoices, service charges, and daily cash drawer balance closing audits.',
      highlights: [
        '3-Touch ultra-fast checkout flow built for peak rush-hour counters',
        'Split tender support: accept Cash, UPI / QR, Card, and Coin redemptions in 1 bill',
        'Instant 2-inch & 3-inch thermal invoice printing or paperless WhatsApp receipts',
        'End-of-day register audit: sales summaries, tax ledgers, and cashier shift reports'
      ],
      badge: '3-Touch Speed',
      preview: (
        <div className="rounded-2xl p-3 bg-black/50 border border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <div>
              <div className="font-bold text-white text-[11px]">Split Tender Ready</div>
              <div className="text-[9.5px] text-stone-400">Cash + UPI + Swaad Coins</div>
            </div>
          </div>
          <span className="text-[10.5px] font-mono font-bold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-lg border border-blue-500/30">
            &lt; 3s Checkout
          </span>
        </div>
      )
    },
    {
      id: 'menu',
      tag: 'Catalog & Inventory',
      tagColor: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
      icon: Store,
      iconBg: 'bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-500 text-white shadow-rose-500/30',
      title: 'AI Menu OCR Scanner & 86 Instant Stock Toggles',
      subtitle: 'Digitize your entire physical menu card in 30 seconds',
      description:
        'Simply snap a photo or upload a PDF of your paper menu. AI vision scans dish names, prices, categories, and veg/non-veg tags automatically. Ran out of paneer? Toggle an item to "Sold Out" in 1 tap to update all live table QRs immediately.',
      highlights: [
        'AI Vision Menu Card OCR: converts photos or PDF cards to digital catalog instantly',
        '1-Tap "86 / Sold Out" toggles: prevents guest disappointment and canceled tickets',
        'Custom course categories, add-on variants, spice levels, and preparation time tags',
        'Table Standee QR Generator: 1-click batch download of printable high-res QR standees'
      ],
      badge: 'AI Vision OCR',
      preview: (
        <div className="rounded-2xl p-3 bg-black/50 border border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-rose-400" />
            <div>
              <div className="font-bold text-white text-[11px]">Instant OCR Card Scan</div>
              <div className="text-[9.5px] text-stone-400">Photo / PDF &rarr; Live Menu</div>
            </div>
          </div>
          <span className="text-[10.5px] font-mono font-bold text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded-lg border border-rose-500/30">
            1-Tap 86 Out
          </span>
        </div>
      )
    }
  ];

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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-orange-500/15 border border-orange-500/30 text-amber-300 shadow-[0_0_20px_rgba(242,92,5,0.25)] mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span className="tracking-wide uppercase text-[11px] font-mono">Precision Operational Stack</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white">
            Every Powerhouse Feature Built For{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400 drop-shadow-[0_2px_20px_rgba(242,92,5,0.4)]">
              Real Kitchen Shifts.
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-stone-300/90 mt-4 leading-relaxed font-normal max-w-2xl mx-auto">
            From table scans and real-time chef tickets to automated WhatsApp retention and AI menu engineering — everything runs in sync without hardware lock-in.
          </p>
        </div>

        {/* Ultra-Premium 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch text-left">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_-5px_rgba(242,92,5,0.25)] border border-white/[0.08] hover:border-orange-500/60 backdrop-blur-2xl"
                style={{ backgroundColor: 'rgba(32, 18, 11, 0.95)' }}
              >
                {/* Glow Accent Top Right */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 group-hover:bg-orange-500/15 rounded-full blur-2xl transition-all pointer-events-none" />

                <div>
                  {/* Top Bar: Icon, Tag, & Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl ${feat.iconBg} flex items-center justify-center shadow-lg shrink-0 ring-4 ring-white/[0.05]`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r border ${feat.tagColor}`}>
                        {feat.tag}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/[0.06] border border-white/10 text-stone-200">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{feat.badge}</span>
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1 group-hover:text-amber-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-semibold text-orange-400/90 mb-3">
                    {feat.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-stone-300 leading-relaxed mb-4 font-normal">
                    {feat.description}
                  </p>
                </div>

                <div className="space-y-3.5 pt-3 border-t border-white/[0.08]">
                  {/* Mini Interactive Preview Widget */}
                  {feat.preview}

                  {/* Key Capabilities */}
                  <div className="space-y-1.5">
                    {feat.highlights.slice(0, 2).map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-stone-300 font-medium leading-snug">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                          <Check className="w-2 h-2 text-emerald-400 stroke-[3]" />
                        </div>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Hardware Independence Strip */}
        <div className="mt-12 sm:mt-16 p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#2B1A12] via-[#24140D] to-[#1A0E08] border border-orange-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
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
