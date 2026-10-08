import React from 'react';
import {
  Flame,
  QrCode,
  Coins,
  Sparkles,
  Receipt,
  Store,
  CheckCircle2,
  ArrowRight,
  Zap,
  Volume2,
  MessageSquare,
  TrendingUp,
  FileSpreadsheet,
  ScanLine,
  Printer,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';

export const CoreFeaturesShowcaseSection: React.FC = () => {
  const features = [
    {
      id: 'kot',
      tag: 'Kitchen Operations',
      tagColor: 'from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30',
      icon: Flame,
      iconBg: 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-500/30',
      title: 'Live Kitchen Dispatch & Thermal KOT Engine',
      subtitle: 'Zero delay between table ordering and chef pans',
      description:
        'A high-speed, 3-column kitchen command center (Incoming → Cooking → Ready & Served). Orders placed by guests or captains appear instantly with customized audio chimes and automated thermal KOT print routing.',
      highlights: [
        'Real-time WebSocket instant order pipeline with multi-station dispatch',
        'Custom audio sound alert engine with continuous loop alerts for peak rush',
        'Auto thermal printing on 80mm & 58mm USB, LAN & Bluetooth printers',
        'Table add-ons and special cooking instructions highlighted with color badges'
      ],
      badge: 'Live Sound Alerts'
    },
    {
      id: 'qr',
      tag: 'Guest Experience',
      tagColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      icon: QrCode,
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/30',
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
      badge: 'Zero App Download'
    },
    {
      id: 'crm',
      tag: 'Retention & Loyalty',
      tagColor: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
      icon: Coins,
      iconBg: 'bg-gradient-to-tr from-amber-600 to-yellow-500 text-white shadow-amber-500/30',
      title: 'SwaadSevak Coins CRM & Automated WhatsApp Bot',
      subtitle: 'Turn first-time diners into loyal weekly regulars',
      description:
        'A built-in customer loyalty program that awards discount coins on every meal. Automatically segment guests into VIP Regulars, New Diners, and At-Risk groups, then trigger automated re-engagement WhatsApp perks directly from your restaurant phone.',
      highlights: [
        'Configurable Coin Earn & Burn rules (e.g. 10 coins / ₹100) with discount caps',
        'Dynamic guest segmentation: VIP regulars, frequent diners, and 14+ day inactive',
        'Direct WhatsApp Web QR integration (send campaigns from your own official number)',
        'Automated re-engagement perks, birthday coupons, and digital tax receipts'
      ],
      badge: 'WhatsApp Bot Linked'
    },
    {
      id: 'growth',
      tag: 'AI Intelligence',
      tagColor: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
      icon: Sparkles,
      iconBg: 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-purple-500/30',
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
      badge: 'Actionable Insights'
    },
    {
      id: 'billing',
      tag: 'Checkout & Accounts',
      tagColor: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
      icon: Receipt,
      iconBg: 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-blue-500/30',
      title: '3-Touch POS Billing & 5% GST Invoicing',
      subtitle: 'Lightning fast counter checkout for 200+ orders per hour',
      description:
        'Generate tax-compliant GST invoices in under 3 seconds. Handles dynamic split billing, coin discount redemptions, customized CGST/SGST tax slabs, service charge adjustments, and cash drawer balance closing audits.',
      highlights: [
        'Auto-calculated 5% / 12% / 18% GST with customized restaurant GSTIN',
        'Split tender support: accept Cash, UPI / QR, Card, and Coin redemptions in 1 bill',
        'Instant 2-inch & 3-inch thermal invoice printing or paperless WhatsApp receipt',
        'End-of-day register audit: sales summaries, tax ledgers, and cashier shift reports'
      ],
      badge: 'GST-Ready Invoices'
    },
    {
      id: 'menu',
      tag: 'Catalog & Inventory',
      tagColor: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
      icon: Store,
      iconBg: 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-rose-500/30',
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
      badge: 'AI Vision OCR'
    }
  ];

  return (
    <section
      id="core-features"
      className="py-14 sm:py-20 lg:py-24 font-sans relative overflow-hidden text-white"
      style={{ backgroundColor: '#180E09' }}
    >
      {/* Dynamic Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-orange-600/15 via-amber-600/10 to-transparent rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* Subtle Warm Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 -z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: High Impact & Attention Grabbing */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-orange-500/15 border border-orange-500/30 text-orange-400 shadow-glow-orange mb-3.5 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>Complete Restaurant Operating System</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
            Every Powerhouse Feature Built For{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 drop-shadow-[0_2px_15px_rgba(242,92,5,0.35)]">
              Real Kitchen Shifts.
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-stone-300/90 mt-4 leading-relaxed font-normal">
            No half-baked widgets or generic retail tools. SwaadSevak delivers battle-tested floor workflows, AI-driven guest retention, and instant thermal KOT dispatch engineered specifically for Indian restaurants.
          </p>
        </div>

        {/* 6 Feature Showcase Cards in High-Contrast 2x3 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 text-left">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] hover:shadow-[0_25px_60px_-10px_rgba(242,92,5,0.25)] border border-white/[0.08] hover:border-orange-500/50 backdrop-blur-xl"
                style={{ backgroundColor: 'rgba(38, 22, 14, 0.92)' }}
              >
                {/* Glow Accent Top Right */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 group-hover:bg-orange-500/15 rounded-full blur-2xl transition-all pointer-events-none" />

                <div>
                  {/* Top Bar: Icon, Tag, & Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${feat.iconBg} flex items-center justify-center shrink-0 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10.5px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r border ${feat.tagColor}`}>
                          {feat.tag}
                        </span>
                      </div>
                    </div>

                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/[0.06] border border-white/10 text-stone-200">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{feat.badge}</span>
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1 group-hover:text-amber-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-orange-400/90 mb-3.5">
                    {feat.subtitle}
                  </p>

                  {/* Deep Detailed Description */}
                  <p className="text-xs sm:text-[13.5px] text-stone-300 leading-relaxed mb-5 font-normal">
                    {feat.description}
                  </p>
                </div>

                {/* Concrete Bullet Highlights */}
                <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Key Capabilities Included:
                  </div>
                  {feat.highlights.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-stone-200/95 font-medium leading-snug">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                        <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                      </div>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner Strip: Complete Tech Independence */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-950/80 via-[#2B1A12] to-stone-950 border border-orange-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                Works With Hardware You Already Own
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 mt-0.5 max-w-xl">
                Run SwaadSevak on any Android Tablet, iPad, Windows PC, or mobile phone with standard 80mm/58mm thermal receipt printers. Zero proprietary locks.
              </p>
            </div>
          </div>

          <a
            href="#login"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-glow-orange hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <span>Explore Platform Live</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </a>
        </div>

      </div>
    </section>
  );
};
