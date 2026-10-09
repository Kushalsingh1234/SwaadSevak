import React from 'react';
import {
  Flame,
  QrCode,
  Coins,
  Sparkles,
  Receipt,
  Store,
  Volume2,
  Printer,
  ShieldCheck,
  Zap,
  ArrowRight,
  CreditCard,
  ScanLine,
  BellRing,
  Clock,
  CheckCircle2,
  Sliders,
  Send,
  BarChart3,
  ExternalLink
} from 'lucide-react';

interface CoreFeaturesShowcaseSectionProps {
  onSelectFeature?: (featureId: string) => void;
}

export const CoreFeaturesShowcaseSection: React.FC<CoreFeaturesShowcaseSectionProps> = ({
  onSelectFeature
}) => {
  const handleFeatureClick = (e: React.MouseEvent, featureId: string) => {
    e.preventDefault();
    if (onSelectFeature) {
      onSelectFeature(featureId);
    }
    window.location.hash = `#feature-${featureId}`;
  };

  return (
    <section
      id="core-features"
      className="py-16 sm:py-24 font-sans relative overflow-hidden"
      style={{ backgroundColor: '#1A0E08' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ============================================================
            FEATURE CARDS GRID (WITH "KNOW MORE" DEEP-DIVE LINKS)
           ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* ==================== CARD 1 (HERO DARK CARD - SPANS 2 COLS ON LG) ==================== */}
          {/* SWAADSEVAK CRM + AI CUSTOMER GROWTH ENGINE (SPOTLIGHT #1 FEATURE) */}
          <div className="lg:col-span-2 rounded-[2rem] p-7 sm:p-9 flex flex-col justify-between bg-[#2C1810] border border-amber-500/25 shadow-2xl relative overflow-hidden text-left group">
            {/* Subtle Ambient Radial Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10">
              {/* Badge & Know More Top Link */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#432316] border border-amber-500/40 text-amber-400 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>CRM &amp; AI Customer Growth Engine</span>
                </div>

                <a
                  href="#feature-crm-loyalty"
                  onClick={(e) => handleFeatureClick(e, 'crm-loyalty')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group cursor-pointer"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2.5">
                SwaadSevak CRM &amp; AI Customer Growth Engine
              </h3>

              {/* Description */}
              <div className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6 space-y-2">
                <p className="font-semibold text-amber-300/90 text-sm sm:text-[15px]">
                  Your restaurant's data. Your customers. Your next growth opportunity.
                </p>
                <p className="text-stone-300 text-xs sm:text-sm">
                  Automatically understand customer behavior, identify high-value and at-risk customers, create targeted segments, and launch personalized campaigns that bring customers back.
                </p>
                <p className="text-stone-400 text-xs sm:text-sm">
                  From customer intelligence to campaign execution and results — SwaadSevak connects the entire growth cycle in one place.
                </p>
              </div>
            </div>

            {/* Inner Dark Action Bar - Compact & Luxury */}
            <div className="relative z-10 mt-4 p-3.5 sm:p-4 rounded-xl bg-[#1D0F08] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <Coins className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    Discount Coins &amp; Loyalty Engine
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-xs text-stone-400">Zero-friction 0-OTP diner rewards &amp; WhatsApp automations</div>
                </div>
              </div>

              <a
                href="#feature-crm-loyalty"
                onClick={(e) => handleFeatureClick(e, 'crm-loyalty')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all shrink-0 cursor-pointer"
              >
                <span>Know More &amp; Architecture</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </a>
            </div>
          </div>


          {/* ==================== CARD 2 (WHITE CARD - SWAADSEVAK AI GROWTH ENGINE) ==================== */}
          <div className="rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between bg-white shadow-xl text-left transition-all duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <a
                  href="#feature-growth-engine"
                  onClick={(e) => handleFeatureClick(e, 'growth-engine')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors group cursor-pointer"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
                SwaadSevak AI Growth Engine
              </h3>

              <div className="space-y-2.5 text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-6">
                <p className="font-semibold text-emerald-700">
                  Turn Your Restaurant Data Into Your Next Growth Opportunity.
                </p>
                <p>
                  The Growth Engine continuously analyzes your sales and customer data to find opportunities to increase repeat visits, recover inactive customers, improve retention and grow revenue.
                </p>
                <p className="text-stone-500">
                  It doesn't just tell you what happened. It identifies what needs attention, recommends what to do next, helps you launch the right campaign, and measures the results.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-emerald-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Discover • Action • Growth • Repeat</span>
              </div>
              <a
                href="#feature-growth-engine"
                onClick={(e) => handleFeatureClick(e, 'growth-engine')}
                className="text-stone-500 hover:text-emerald-700 font-semibold cursor-pointer"
              >
                Details &rarr;
              </a>
            </div>
          </div>


          {/* ==================== CARD 3 (WHITE CARD - SWAADSEVAK ANALYTICS) ==================== */}
          <div className="rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between bg-white shadow-xl text-left transition-all duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <a
                  href="#feature-analytics"
                  onClick={(e) => handleFeatureClick(e, 'analytics')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors group cursor-pointer"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
                SwaadSevak Analytics
              </h3>

              <div className="space-y-2 text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-6">
                <p className="font-semibold text-indigo-700">
                  See What’s Happening Across Your Restaurant.
                </p>
                <p>
                  Turn your restaurant's sales, customer, order and product data into clear, easy-to-understand insights.
                </p>
                <p>
                  Track performance, discover trends, compare results and understand what is driving your restaurant's business — all from one simple dashboard.
                </p>
                <p className="text-stone-500 text-[11px] sm:text-xs pt-1 border-t border-stone-100 font-medium">
                  Sales • Customers • Orders • Products • Retention • Campaigns
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-indigo-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <span>Unified Intelligence Dashboard</span>
              </div>
              <a
                href="#feature-analytics"
                onClick={(e) => handleFeatureClick(e, 'analytics')}
                className="text-stone-500 hover:text-indigo-700 font-semibold cursor-pointer"
              >
                Details &rarr;
              </a>
            </div>
          </div>


          {/* ==================== CARD 4 (WHITE CARD - LIVE KITCHEN BOARD) ==================== */}
          <div className="rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between bg-white shadow-xl text-left transition-all duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                  <Flame className="w-6 h-6" />
                </div>
                <a
                  href="#feature-live-kot"
                  onClick={(e) => handleFeatureClick(e, 'live-kot')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors group cursor-pointer"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
                Live Kitchen Display &amp; Order Management
              </h3>

              <div className="space-y-2 text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-6">
                <p className="font-semibold text-amber-700">
                  Keep Every Order Moving.
                </p>
                <p>
                  Orders appear instantly on the kitchen display as soon as they are placed. Kitchen staff can manage tickets through Incoming → Cooking → Ready, with clear status updates and instant alerts.
                </p>
                <p className="text-stone-500">
                  Reduce missed orders, improve kitchen coordination and get food out faster.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-amber-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Instant Ticket Workflow</span>
              </div>
              <a
                href="#feature-live-kot"
                onClick={(e) => handleFeatureClick(e, 'live-kot')}
                className="text-stone-500 hover:text-amber-700 font-semibold cursor-pointer"
              >
                Details &rarr;
              </a>
            </div>
          </div>


          {/* ==================== CARD 5 (WHITE CARD - THERMAL PRINTER) ==================== */}
          <div className="rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between bg-white shadow-xl text-left transition-all duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                  <Printer className="w-6 h-6" />
                </div>
                <a
                  href="#feature-thermal-printer"
                  onClick={(e) => handleFeatureClick(e, 'thermal-printer')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors group cursor-pointer"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
                Thermal KOT &amp; POS Printing
              </h3>

              <div className="space-y-2 text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-6">
                <p className="font-semibold text-purple-700">
                  Print Every Order Where It Belongs.
                </p>
                <p>
                  Automatically send KOTs, bills and order tickets to the right printer or station. Support 80mm and 58mm thermal printers through USB, Bluetooth or LAN for fast, reliable restaurant printing.
                </p>
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] sm:text-xs text-stone-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    <span>Automatic KOT printing</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    <span>80mm &amp; 58mm thermal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    <span>USB, Bluetooth &amp; LAN</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    <span>Station-wise routing</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    <span>Formatted kitchen tickets</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    <span>Running order additions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-purple-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span>Smart station-wise printing</span>
              </div>
              <a
                href="#feature-thermal-printer"
                onClick={(e) => handleFeatureClick(e, 'thermal-printer')}
                className="text-stone-500 hover:text-purple-700 font-semibold cursor-pointer"
              >
                Details &rarr;
              </a>
            </div>
          </div>


          {/* ==================== CARD 6 (WHITE CARD - SMART QR TABLE ORDERING) ==================== */}
          <div className="rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between bg-white shadow-xl text-left transition-all duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                  <QrCode className="w-6 h-6" />
                </div>
                <a
                  href="#feature-qr-ordering"
                  onClick={(e) => handleFeatureClick(e, 'qr-ordering')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-700 hover:text-orange-900 transition-colors group cursor-pointer"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
                Smart QR Table Ordering &amp; Waiter Call
              </h3>

              <div className="space-y-2 text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-6">
                <p className="font-semibold text-orange-700">
                  Let Guests Order. Let Your Team Focus on Service.
                </p>
                <p>
                  Guests simply scan the table QR to open your digital menu, explore veg/non-veg options, customize their order and place it directly from their phone. They can also call a waiter or request the bill in seconds.
                </p>
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] sm:text-xs text-stone-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span>No app download required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span>Digital dietary menu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span>Custom portions &amp; add-ons</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span>Direct table ordering</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span>One-tap waiter &amp; bill requests</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-orange-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Scan. Order. Call. Done.</span>
              </div>
              <a
                href="#feature-qr-ordering"
                onClick={(e) => handleFeatureClick(e, 'qr-ordering')}
                className="text-stone-500 hover:text-orange-700 font-semibold cursor-pointer"
              >
                Details &rarr;
              </a>
            </div>
          </div>


          {/* ==================== CARD 7 (WHITE CARD - COUNTER POS) ==================== */}
          <div className="rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between bg-white shadow-xl text-left transition-all duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                  <Receipt className="w-6 h-6" />
                </div>
                <a
                  href="#feature-pos-billing"
                  onClick={(e) => handleFeatureClick(e, 'pos-billing')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors group cursor-pointer"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
                High-Speed Billing &amp; Split Payments
              </h3>

              <div className="space-y-2 text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-6">
                <p className="font-semibold text-blue-700">
                  Bill Faster. Serve Faster. Keep the Rush Moving.
                </p>
                <p>
                  Make checkout quick and effortless with a streamlined billing flow built for busy restaurants. Accept Cash, UPI, QR and Card payments while easily splitting bills and keeping every transaction organized.
                </p>
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] sm:text-xs text-stone-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>Fast checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>Cash, UPI, QR &amp; Card</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>Easy split payments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>Quick bill settlement</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>Daily shift &amp; payment records</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-blue-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span>Split the bill. Close in seconds.</span>
              </div>
              <a
                href="#feature-pos-billing"
                onClick={(e) => handleFeatureClick(e, 'pos-billing')}
                className="text-stone-500 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Details &rarr;
              </a>
            </div>
          </div>


          {/* ==================== CARD 8 (WHITE CARD - OWNER DASHBOARD & TABLES) ==================== */}
          <div className="rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between bg-white shadow-xl text-left transition-all duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <a
                  href="#feature-tables-standees"
                  onClick={(e) => handleFeatureClick(e, 'tables-standees')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors group cursor-pointer"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
                Tables &amp; Printable Standee QRs
              </h3>

              <div className="space-y-2 text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-6">
                <p className="font-semibold text-amber-700">
                  Give Every Table Its Own Digital Doorway.
                </p>
                <p>
                  Create and manage your restaurant tables, generate branded QR standees and get them ready for printing in just a few clicks. Keep your QR experience consistent with your restaurant's identity.
                </p>
                <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] sm:text-xs text-stone-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Unlimited table setup</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Custom branded standees</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>High-res PDF &amp; PNG export</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Ready-to-print designs</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Easy table management</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-amber-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Branded QRs. Ready to Print.</span>
              </div>
              <a
                href="#feature-tables-standees"
                onClick={(e) => handleFeatureClick(e, 'tables-standees')}
                className="text-stone-500 hover:text-amber-700 font-semibold cursor-pointer"
              >
                Details &rarr;
              </a>
            </div>
          </div>

        </div>

        {/* ============================================================
            HARDWARE INDEPENDENCE FOOTER STRIP (ULTRA-COMPACT & SLEEK)
           ============================================================ */}
        <div className="mt-6 sm:mt-7 max-w-4xl mx-auto py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl bg-[#24140D] border border-white/[0.08] shadow-md flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-[12px] sm:text-[13px] font-bold text-white leading-tight">
                Zero Proprietary Hardware Lock-In
              </h4>
              <p className="text-[10px] sm:text-[11px] text-stone-300 mt-0.5 leading-tight">
                Runs on any Android Tablet, iPad, Windows PC, or smartphone with standard ESC/POS thermal printers.
              </p>
            </div>
          </div>

          <a
            href="#login"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <span>Platform Login</span>
            <ArrowRight className="w-3 h-3 text-stone-950 stroke-[2.5]" />
          </a>
        </div>

      </div>
    </section>
  );
};
