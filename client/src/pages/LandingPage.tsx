import React, { useState } from 'react';
import {
  QrCode,
  Printer,
  ChevronRight,
  ArrowRight,
  Calculator,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  UtensilsCrossed
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
  // Monthly sales calculation
  const [monthlyDineInSales, setMonthlyDineInSales] = useState<number>(450000);
  const commissionRate = 25;
  const annualSavings = Math.round(monthlyDineInSales * (commissionRate / 100) * 12);
  const monthlySavings = Math.round(monthlyDineInSales * (commissionRate / 100));

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white antialiased">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg">
              🍛
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                Swaad Sevak
              </span>
              <span className="text-[11px] text-slate-400 block -mt-0.5 font-normal">
                Restaurant Operating System
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#live-preview" className="hover:text-white transition-colors">Live Preview</a>
            <a href="#calculator" className="hover:text-white transition-colors">Savings</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Manager Sign In
            </button>
            <button
              onClick={onStartRegistration}
              className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Start Free Trial</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-20 overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-4">
            Built for Indian Cafés & Restaurants
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Restaurant operations,<br />without the chaos.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            QR ordering, live kitchen orders, billing and restaurant management in one simple system.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStartRegistration}
              className="w-full sm:w-auto px-7 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLaunchDemoDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>See How It Works</span>
            </button>

            <button
              onClick={onLaunchDemoCustomerMenu}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Scan Guest Menu Demo</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span>✓ No credit card required</span>
            <span>✓ Works on any tablet or phone</span>
            <span>✓ Thermal KOT compatible</span>
          </div>

          {/* Live Product Preview Frame */}
          <div id="live-preview" className="mt-14 rounded-xl bg-slate-800/80 p-3 sm:p-5 border border-slate-700/80 shadow-2xl text-left backdrop-blur-sm">
            {/* Mock browser header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                <span className="text-xs text-slate-400 font-medium ml-2">Swaad Sevak — The Chai & Chaat Co.</span>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Live Service Active
              </span>
            </div>

            {/* Mock Dashboard Preview */}
            <div className="bg-[#F7F8FA] rounded-lg p-5 text-gray-900">
              {/* Operational Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Good evening, Demo Manager</h3>
                  <p className="text-xs text-gray-500 mt-0.5">The Chai & Chaat Co. • Friday, 2 October</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-gray-200 rounded-md text-gray-700">
                    Dinner Service
                  </span>
                </div>
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-white p-3.5 rounded-lg border border-gray-200">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Today's Sales</span>
                  <p className="text-xl font-bold text-gray-900 mt-1">₹24,850</p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-gray-200">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Orders</span>
                  <p className="text-xl font-bold text-gray-900 mt-1">82</p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-gray-200">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Active Orders</span>
                  <p className="text-xl font-bold text-orange-600 mt-1">4</p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-gray-200">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Completed</span>
                  <p className="text-xl font-bold text-emerald-600 mt-1">71</p>
                </div>
              </div>

              {/* Order board preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Live Orders Board</h4>
                  <span className="text-xs text-gray-500">Auto-refresh active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Order Ticket 1 */}
                  <div className="bg-white rounded-lg border border-orange-200 p-3.5 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-bold text-sm text-gray-900">TABLE 05</span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-orange-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        Pending
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">Order #1042 • 7:42 PM</div>
                    <div className="mt-3 space-y-1 text-xs text-gray-800">
                      <div className="flex justify-between">
                        <span>2 × Paneer Tikka</span>
                        <span className="font-medium text-gray-700">₹498</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1 × Butter Naan</span>
                        <span className="font-medium text-gray-700">₹65</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Total: ₹563</span>
                      <span className="text-xs px-2.5 py-1 bg-orange-600 text-white font-medium rounded-md">
                        Accept Order
                      </span>
                    </div>
                  </div>

                  {/* Order Ticket 2 */}
                  <div className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-bold text-sm text-gray-900">TABLE 02</span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Preparing
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">Order #1041 • 7:38 PM</div>
                    <div className="mt-3 space-y-1 text-xs text-gray-800">
                      <div className="flex justify-between">
                        <span>1 × Dal Makhani</span>
                        <span className="font-medium text-gray-700">₹299</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2 × Garlic Naan</span>
                        <span className="font-medium text-gray-700">₹150</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Total: ₹449</span>
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-200">
                        Mark Ready
                      </span>
                    </div>
                  </div>

                  {/* Order Ticket 3 */}
                  <div className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="font-bold text-sm text-gray-900">TABLE 08</span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Ready
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">Order #1039 • 7:31 PM</div>
                    <div className="mt-3 space-y-1 text-xs text-gray-800">
                      <div className="flex justify-between">
                        <span>1 × Papdi Chaat</span>
                        <span className="font-medium text-gray-700">₹149</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2 × Kulhad Masala Chai</span>
                        <span className="font-medium text-gray-700">₹138</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Total: ₹287</span>
                      <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-200">
                        Complete
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Designed for Everyday Restaurant Service
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Clear tools to keep orders moving from dining tables to the kitchen without delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="w-9 h-9 rounded-lg bg-orange-600/15 text-orange-400 flex items-center justify-center mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Tables & QR Ordering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate high-resolution printable QR cards for your tables. Guests scan with their phone camera to view the menu and place orders directly.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="w-9 h-9 rounded-lg bg-amber-600/15 text-amber-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Live Kitchen Order Board</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Incoming orders appear instantly with continuous audio alerts. Restaurant managers can accept, prepare, and complete orders with a single tap.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="w-9 h-9 rounded-lg bg-emerald-600/15 text-emerald-400 flex items-center justify-center mb-4">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Kitchen Printer & Billing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Print Kitchen Order Tickets (KOT) directly to standard 58mm or 80mm thermal printers, and generate itemized customer bills when diners are ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Savings Calculator */}
      <section id="calculator" className="py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Direct Ordering Savings Calculator
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              See how much you keep when dine-in guests order directly through your tables.
            </p>
          </div>

          <div className="bg-slate-800/70 rounded-xl p-6 sm:p-8 border border-slate-700/80 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Monthly Dine-in Sales
              </label>
              <div className="text-3xl font-bold text-white mb-4">
                ₹{monthlyDineInSales.toLocaleString('en-IN')}
              </div>
              <input
                type="range"
                min="100000"
                max="2500000"
                step="50000"
                value={monthlyDineInSales}
                onChange={(e) => setMonthlyDineInSales(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                <span>₹1 Lakh</span>
                <span>₹12.5 Lakhs</span>
                <span>₹25 Lakhs</span>
              </div>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-lg border border-slate-700 text-center">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                Estimated Annual Retained Profit
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-orange-400">
                ₹{annualSavings.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Assuming a typical 25% third-party commission saved on in-house dine-in volume.
              </p>
              <button
                onClick={onStartRegistration}
                className="mt-5 w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Swaad Sevak</span>
            <span>• Restaurant Management System</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenLogin} className="hover:text-slate-300 transition-colors">
              Manager Login
            </button>
            <button onClick={onStartRegistration} className="hover:text-slate-300 transition-colors">
              Register Restaurant
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
