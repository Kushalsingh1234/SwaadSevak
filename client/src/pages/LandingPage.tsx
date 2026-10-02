import React, { useState } from 'react';
import {
  QrCode,
  Sparkles,
  Printer,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  Percent,
  Calculator,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onStartRegistration: () => void;
  onOpenLogin: () => void;
  onLaunchDemoDashboard: () => void;
  onLaunchDemoCustomerMenu: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartRegistration,
  onOpenLogin,
  onLaunchDemoDashboard,
  onLaunchDemoCustomerMenu,
}) => {
  // Interactive ROI Calculator State
  const [monthlyDineInSales, setMonthlyDineInSales] = useState<number>(450000);
  const aggregatorCutPercent = 28;
  const annualSavings = Math.round(monthlyDineInSales * (aggregatorCutPercent / 100) * 12);
  const monthlySavings = Math.round(monthlyDineInSales * (aggregatorCutPercent / 100));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-4 py-2 text-center text-xs font-bold text-white tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Made for Indian Cafés, Bistros & Restaurants • Zero Aggregator Commission on Dine-in</span>
        <button
          onClick={onStartRegistration}
          className="ml-2 underline font-extrabold hover:text-amber-100 transition-colors"
        >
          Get Started Free →
        </button>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-2xl shadow-glow">
              🍛
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
                Swaad Sevak
              </span>
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest block -mt-1">
                Restaurant OS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#calculator" className="hover:text-white transition-colors">Savings Calculator</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              Manager Sign In
            </button>
            <button
              onClick={onStartRegistration}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-xl shadow-glow transition-all flex items-center gap-1.5"
            >
              <span>Register Restaurant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-orange-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/80 text-orange-400 text-xs font-bold mb-6 animate-fade-in shadow-inner">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Phase 1 Live: QR Dine-in • AI Menu • Thermal KOT • Zero App Download</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            The Modern Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">Indian Restaurants & Cafés</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate 28% aggregator cuts. Give your dine-in guests lightning-fast table QR ordering, send instant KOTs to thermal printers, and manage your kitchen live in real-time.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartRegistration}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
            >
              <span>Start Free 14-Day Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLaunchDemoDashboard}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>Explore Live Manager Demo</span>
            </button>

            <button
              onClick={onLaunchDemoCustomerMenu}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-sm border border-amber-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Simulate Table 01 Scan</span>
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-4">
            <span>✓ No credit card required</span>
            <span>✓ Setup menu in 2 minutes</span>
            <span>✓ Works with your existing thermal printer</span>
          </p>

          {/* Interactive Hero Visual Showcase */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-slate-800/60 p-4 sm:p-6 border border-slate-700 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {/* Card 1: Guest Table QR */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Step 1: Dine-In Guest</span>
                    <QrCode className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Table 05 Scans QR</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Opens mobile menu instantly in browser. No app install needed. Filters Veg/Non-veg & adds items to cart.
                  </p>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                  <div className="flex justify-between font-semibold">
                    <span>2x Amritsari Paneer Tikka</span>
                    <span>₹558</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-1">
                    <span>1x Butter Garlic Naan</span>
                    <span>₹75</span>
                  </div>
                  <div className="mt-2 text-right font-bold text-orange-400">Total: ₹633</div>
                </div>
              </div>

              {/* Card 2: Real-time Sound Alert & Acceptance */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-orange-500/40 relative flex flex-col justify-between shadow-glow">
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black animate-pulse">
                  TING ALERT 🔔
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Step 2: Manager OS</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Instant Kitchen Notification</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Manager dashboard plays pleasant repeating alert sound until acknowledged with 1 click.
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={onLaunchDemoDashboard}
                    className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold text-center shadow-sm"
                  >
                    Accept Order
                  </button>
                  <button className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                    Reject
                  </button>
                </div>
              </div>

              {/* Card 3: Thermal KOT Receipt */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Step 3: Kitchen Print</span>
                    <Printer className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Instant Thermal KOT</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Auto-prints directly to kitchen thermal printer (58mm or 80mm) with clear table, time & chef instructions.
                  </p>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-slate-950 font-mono text-[10px] text-slate-300 border border-slate-800 leading-tight">
                  <div className="text-center font-bold text-white">*** KOT #1042 ***</div>
                  <div className="flex justify-between my-1">
                    <span>TBL: 05</span>
                    <span>07:42 PM</span>
                  </div>
                  <div className="border-t border-dashed border-slate-700 my-1" />
                  <div>2x Paneer Tikka</div>
                  <div>1x Butter Garlic Naan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Savings / ROI Calculator */}
      <section id="calculator" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
              <Calculator className="w-3.5 h-3.5" />
              <span>Direct Profitability Calculator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How Much Commission Are You Losing Every Month?
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Aggregators charge 25%–30% on dine-in and pickup orders. Swaad Sevak charges 0% commission on your dine-in guests.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Slider */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Your Monthly Dine-in Restaurant Sales
              </label>
              <div className="text-3xl font-black text-white mb-4">
                ₹{monthlyDineInSales.toLocaleString('en-IN')}
              </div>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="50000"
                value={monthlyDineInSales}
                onChange={(e) => setMonthlyDineInSales(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                <span>₹1 Lakh/mo</span>
                <span>₹15 Lakhs/mo</span>
                <span>₹30 Lakhs/mo</span>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Aggregator Commission (28% avg):</span>
                  <span className="font-bold text-red-400">₹{monthlySavings.toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Swaad Sevak Commission:</span>
                  <span className="font-bold text-emerald-400">₹0 (Zero Cut)</span>
                </div>
              </div>
            </div>

            {/* Savings Callout */}
            <div className="bg-gradient-to-br from-orange-600/20 via-amber-600/10 to-transparent p-8 rounded-2xl border border-orange-500/30 text-center">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-2">
                Estimated Annual Savings
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                ₹{annualSavings.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Saved in pure margins directly into your restaurant bank account every year.
              </p>
              <button
                onClick={onStartRegistration}
                className="mt-6 w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-glow transition-all"
              >
                Claim Your Savings — Register Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Engineered for the Fast-Paced Indian Kitchen
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Every interaction is designed to require as few clicks as possible so restaurant staff can operate effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">AI Menu Digitization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your menu PDF. Swaad Sevak AI reads dishes, pricing, portions, and categories automatically. Review and publish in seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Thermal KOT Printer Ready</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supports standard 58mm and 80mm thermal receipt printers. Optimized ESC/POS layout with instant browser print integration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Table QR Generator & ZIP Export</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate high-res branded QR codes for all your tables. Download single table cards or download all tables bundled as a ZIP file.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Instant Stock Toggle</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ran out of Paneer Tikka? 1-click toggle on the manager screen immediately marks it "Unavailable" on active guest phones via WebSockets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Customer Bill Request</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Guests tap "Request Bill" right from their phone. Manager receives immediate sound alert and prints itemized GST invoice.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Multi-Tenant Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict restaurant ID isolation and secure table tokens. Restaurant A never sees Restaurant B's menus, orders, or financials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-white">
              Trusted by Cafés & Restaurants Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-300 italic mb-4">
                "Our weekend dinner rush used to be chaotic with waiters running around with paper notepads. With Swaad Sevak, guests scan, order, and KOT prints in our kitchen in 2 seconds. Game changer."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white text-xs">
                  RS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Rohit Somani</h4>
                  <p className="text-[11px] text-slate-400">Brew & Bite Café, Indiranagar Bengaluru</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-300 italic mb-4">
                "We uploaded our 6-page PDF menu and the AI organized all 95 dishes with vegetarian badges and prices in less than a minute. No other POS gave us this speed."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white text-xs">
                  AP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Ananya Patil</h4>
                  <p className="text-[11px] text-slate-400">The Saffron Pot, Bandra Mumbai</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-300 italic mb-4">
                "Saving over ₹85,000 every month by not having our dine-in customers order through aggregators. The thermal printer integration works seamlessly with our existing 80mm printer."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                  NK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Nikhil Kapoor</h4>
                  <p className="text-[11px] text-slate-400">Dilli Spice Club, Connaught Place Delhi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Upgrade Your Restaurant Operations?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join hundreds of smart restaurant owners. Register your restaurant, create tables, and start taking QR orders today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartRegistration}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
            >
              <span>Register Restaurant Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">Swaad Sevak</span>
            <span>• Built for Indian Hospitality</span>
          </div>
          <div>
            <span>Desktop POS • Tablet Kiosk • Mobile QR Ordering</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
