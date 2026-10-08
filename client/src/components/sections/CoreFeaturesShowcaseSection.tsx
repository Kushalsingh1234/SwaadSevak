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
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                SwaadSevak CRM &amp; AI Customer Growth Engine
              </h3>

              {/* Description */}
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                Engineered specifically for high-speed restaurant QR dining without Salesforce bloat. Turn 1-time anonymous diners into repeat VIP regulars: track dining habits, reward Discount Coins (0-OTP), predict at-risk churn, and automatically execute margin-aware WhatsApp campaigns with 100% verified POS revenue attribution.
              </p>
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


          {/* ==================== CARD 2 (WHITE CARD - LIVE KITCHEN BOARD) ==================== */}
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
                Live Kitchen Dispatch &amp; Sound Alerts
              </h3>

              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Orders appear instantly with custom audio sound chimes. Kitchen staff smoothly move tickets from Incoming → Cooking → Ready with 1 tap.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-amber-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Audio ting on every ticket</span>
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


          {/* ==================== CARD 3 (WHITE CARD - THERMAL PRINTER) ==================== */}
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
                Thermal KOT &amp; POS Station Printing
              </h3>

              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Automatic direct printing to 80mm and 58mm thermal printers over USB, Bluetooth, or LAN. Formatted tickets with running additions and station tags.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-purple-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span>80mm POS &amp; 58mm compact slips</span>
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


          {/* ==================== CARD 4 (WHITE CARD - SMART QR TABLE ORDERING) ==================== */}
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

              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Guests scan the table standee directly from phone camera to browse digital menus with veg/non-veg tags, customize portion sizes, place orders, or request bills in 1 tap.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-orange-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>No App Download Required</span>
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


          {/* ==================== CARD 5 (WHITE CARD - COUNTER POS) ==================== */}
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

              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                High-speed 3-touch checkout flow for peak rush. Settle bills across Cash, UPI QR, Card, and Swaad Coin redemptions with daily shift audit ledgers.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-blue-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span>Split tender &amp; &lt; 3s checkout</span>
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


          {/* ==================== CARD 6 (WHITE CARD - MENU OCR & 86) ==================== */}
          <div className="rounded-[2rem] p-7 sm:p-8 flex flex-col justify-between bg-white shadow-xl text-left transition-all duration-200 hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                  <Store className="w-6 h-6" />
                </div>
                <a
                  href="#feature-menu-ocr"
                  onClick={(e) => handleFeatureClick(e, 'menu-ocr')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-700 hover:text-orange-900 transition-colors group cursor-pointer"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
                AI Menu Scanner &amp; 86 Stock Toggles
              </h3>

              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Ran out of paneer? Toggle an item to "86 / Sold Out" in one tap to update every live table QR. Digitize physical menu cards from photo or PDF in 30 seconds.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-orange-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Real-time stock sync &amp; AI OCR</span>
              </div>
              <a
                href="#feature-menu-ocr"
                onClick={(e) => handleFeatureClick(e, 'menu-ocr')}
                className="text-stone-500 hover:text-orange-700 font-semibold cursor-pointer"
              >
                Details &rarr;
              </a>
            </div>
          </div>


          {/* ==================== CARD 7 (WHITE CARD - AI GROWTH ENGINE) ==================== */}
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
                AI Growth Engine &amp; Menu Matrix
              </h3>

              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Analyzes your item sales against profitability to identify high-margin "Stars" vs low-margin "Dogs", recommending proven combo deals to lift ticket size.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-emerald-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Margin optimization &amp; combos</span>
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

              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Add and configure dining tables, generate custom standee QRs with your restaurant branding, and export ready-to-print high-res PDF/PNG standees in 1 click.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 text-xs font-bold text-amber-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Printable standees &amp; ZIP export</span>
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
