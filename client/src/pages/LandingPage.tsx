import React, { useState, useEffect } from 'react';
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
  UtensilsCrossed,
  Flame,
  Check,
  Receipt,
  Store,
  TableProperties,
  TrendingUp,
  Volume2,
  FileX2,
  Lock,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Coffee,
  ChefHat,
  Cake,
  ShoppingBag,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { LANDING_CONTENT, PricingPlan, FaqItem } from '../config/landingContent';

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
  // ROI Calculator State
  const [dailyOrders, setDailyOrders] = useState<number>(120);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(280);
  const [aggregatorCommission, setAggregatorCommission] = useState<number>(25);

  // Monthly Calculations
  const monthlyGrossRevenue = dailyOrders * avgOrderValue * 30;
  // Estimated direct QR ordering savings (saving 15% aggregator commission on 25% of orders converted to direct dine-in)
  // + 5% reduction in billing errors and table turnaround acceleration
  const directConversionRevenue = monthlyGrossRevenue * 0.35;
  const estimatedMonthlySavings = Math.round(directConversionRevenue * (aggregatorCommission / 100) + (monthlyGrossRevenue * 0.03));

  // Pricing State
  const [annualBilling, setAnnualBilling] = useState<boolean>(true);

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Interactive Product Tour Active Tab
  const [tourTab, setTourTab] = useState<'orders' | 'tables' | 'menu' | 'bills' | 'dashboard'>('orders');

  // Sticky Mobile CTA visibility
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans selection:bg-brand-500 selection:text-white antialiased">
      {/* 3.1 Sticky Blurred Navbar */}
      <header className="sticky top-0 z-50 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-black text-sm tracking-tight shadow-xs shadow-brand-500/30">
              S
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                Swaad Sevak
              </span>
              <span className="text-[10px] text-slate-500 block font-medium">
                Restaurant OS
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#tour" className="hover:text-slate-900 transition-colors">Product Tour</a>
            <a href="#calculator" className="hover:text-slate-900 transition-colors">Savings</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Manager Sign In
            </button>
            <button
              onClick={onStartRegistration}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-all flex items-center gap-1.5 shadow-xs shadow-brand-500/25"
            >
              <span>{LANDING_CONTENT.hero.primaryCta}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3.2 Hero Section */}
      <section className="pt-16 pb-20 overflow-hidden relative border-b border-stone-200/80 bg-linear-to-b from-[#FAFAF9] via-stone-50/50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            <span>{LANDING_CONTENT.hero.eyebrow}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] max-w-4xl mx-auto">
            Run your café <br className="hidden sm:block" />
            <span className="text-brand-500">without the chaos.</span>
          </h1>

          {/* Subhead */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {LANDING_CONTENT.hero.subhead}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStartRegistration}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-500/25"
            >
              <span>{LANDING_CONTENT.hero.primaryCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLaunchDemoDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-stone-50 text-slate-800 font-bold text-sm border border-stone-300 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
              <span>Explore Live Manager App</span>
            </button>
          </div>

          {/* Try Guest Menu Demo link */}
          <div className="mt-4">
            <button
              onClick={onLaunchDemoCustomerMenu}
              className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors inline-flex items-center gap-1 underline underline-offset-4"
            >
              <span>{LANDING_CONTENT.hero.guestMenuDemoLink} (Table 01 scan)</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Trust Microcopy */}
          <p className="mt-5 text-xs text-slate-400 font-medium">
            {LANDING_CONTENT.hero.trustMicrocopy}
          </p>

          {/* 3.2 Polished Layered Hero Visual */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            {/* Subtle Brand Glow behind mockup */}
            <div className="absolute -inset-4 bg-linear-to-r from-brand-500/15 via-amber-500/10 to-brand-500/15 rounded-3xl blur-2xl -z-10 pointer-events-none" />

            {/* Main Browser Frame: Live Kitchen Board */}
            <div className="bg-[#0B1020] rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden text-left relative">
              {/* Browser chrome bar */}
              <div className="px-4 py-3 bg-[#070B16] border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-3 text-[11px] font-mono text-slate-400">swaadsevak.app/orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Kitchen Live
                  </span>
                </div>
              </div>

              {/* Realistic Hero Demo Content */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0B1020]">
                {/* Column 1: Incoming */}
                <div className="bg-slate-900/80 rounded-xl p-3 border border-white/[0.08]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Incoming Orders</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300">1</span>
                  </div>

                  <div className="bg-slate-950/90 rounded-lg p-3 border border-amber-400/40 ring-1 ring-amber-400/30">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
                      <span className="px-2 py-0.5 rounded bg-brand-500 text-white font-bold text-xs">Table 05</span>
                      <span className="text-[10px] font-semibold text-amber-400 animate-pulse">2m ago</span>
                    </div>
                    <div className="py-2 text-xs text-slate-200 space-y-1">
                      <div className="flex justify-between font-medium">
                        <span>2× Masala Chai (Kulhad)</span>
                        <span className="tabular-nums">₹120</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>1× Bun Maska</span>
                        <span className="tabular-nums">₹60</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs font-bold text-white tabular-nums">Total: ₹180</span>
                      <span className="px-2.5 py-1 rounded bg-brand-500 text-white font-bold text-[10px]">Accept Order</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Cooking */}
                <div className="bg-slate-900/80 rounded-xl p-3 border border-white/[0.08]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Kitchen Cooking</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-400/20 text-blue-300">1</span>
                  </div>

                  <div className="bg-slate-950/90 rounded-lg p-3 border border-white/[0.08]">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold text-xs">Table 02</span>
                      <span className="text-[10px] text-blue-400 font-semibold">8m ago</span>
                    </div>
                    <div className="py-2 text-xs text-slate-200 space-y-1">
                      <div className="flex justify-between font-medium">
                        <span>1× Paneer Butter Masala</span>
                        <span className="tabular-nums">₹320</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>3× Butter Naan</span>
                        <span className="tabular-nums">₹150</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs font-bold text-white tabular-nums">Total: ₹470</span>
                      <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-[10px]">Mark Ready</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Ready to Serve */}
                <div className="bg-slate-900/80 rounded-xl p-3 border border-white/[0.08]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Ready to Serve</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300">1</span>
                  </div>

                  <div className="bg-slate-950/90 rounded-lg p-3 border border-white/[0.08]">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold text-xs">Table 01</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Ready</span>
                    </div>
                    <div className="py-2 text-xs text-slate-200 space-y-1">
                      <div className="flex justify-between font-medium">
                        <span>2× Cold Coffee with Ice Cream</span>
                        <span className="tabular-nums">₹240</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs font-bold text-white tabular-nums">Total: ₹240</span>
                      <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]">Serve & Settle</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Chip 1: New Order Notification */}
            <div className="hidden sm:flex absolute -top-5 -left-6 bg-white p-3 rounded-xl border border-stone-200/90 shadow-xl items-center gap-3 animate-bounce duration-1000">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">New Order • Table 05</p>
                <p className="text-[11px] text-slate-500">2 items • Instant sound alert</p>
              </div>
            </div>

            {/* Floating Chip 2: Daily Sales */}
            <div className="hidden sm:flex absolute -bottom-5 -right-6 bg-white p-3 rounded-xl border border-stone-200/90 shadow-xl items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Today's Sales</p>
                <p className="text-sm font-extrabold text-emerald-600 tabular-nums">₹24,850</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.3 Social Proof Strip */}
      <section className="py-10 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {LANDING_CONTENT.socialProof.heading}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Dine-In Cafés & Bakeries
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Quick-Service Restaurants (QSR)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Chai & Coffee Outlets
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Cloud Kitchens & Food Courts
            </span>
          </div>
        </div>
      </section>

      {/* 3.4 The Problem Section ("Sound familiar?") */}
      <section className="py-20 bg-stone-50/60 border-b border-stone-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
            {LANDING_CONTENT.problem.tagline}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {LANDING_CONTENT.problem.heading}
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {LANDING_CONTENT.problem.cards.map((card, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs card-hover-lift">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  {idx === 0 && <Volume2 className="w-5 h-5" />}
                  {idx === 1 && <Layers className="w-5 h-5" />}
                  {idx === 2 && <FileX2 className="w-5 h-5" />}
                  {idx === 3 && <Lock className="w-5 h-5" />}
                </div>
                <h3 className="font-bold text-slate-900 text-base">{card.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5 Features: Bento Grid */}
      <section id="features" className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
              {LANDING_CONTENT.features.tagline}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {LANDING_CONTENT.features.heading}
            </h2>
            <p className="text-sm text-slate-500 mt-3">
              {LANDING_CONTENT.features.subhead}
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bento Hero Card: QR Ordering (Spans 2 cols) */}
            <div className="md:col-span-2 bg-[#0B1020] text-white p-7 rounded-2xl border border-white/[0.1] shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30 mb-3">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>No App Download</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">QR Table Ordering for Guests</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">
                  Guests scan the standee QR from their phone camera, browse dishes with veg/non-veg tags, customize portions, and order directly. No waving for busy waitstaff.
                </p>
              </div>

              {/* Graphic snippet */}
              <div className="mt-8 bg-slate-900/90 rounded-xl p-4 border border-white/[0.08] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Table 01 Standee QR</p>
                    <p className="text-[11px] text-slate-400">Instant browser menu</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-400">Scan & Order ➔</span>
              </div>
            </div>

            {/* Feature 2: Live Kitchen Display */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between card-hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Live Kitchen Board</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Orders appear instantly with an audio sound alert. Move tickets from Incoming → Cooking → Ready with 1 tap.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] font-bold text-slate-500">
                ● Audio ting on every new ticket
              </div>
            </div>

            {/* Feature 3: Multi-Channel Order View */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between card-hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">One Screen, All Channels</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Dine-in, Swiggy and Zomato orders in a unified dispatch view. No juggling separate tablets.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] font-bold text-slate-500">
                ● Centralised kitchen queue
              </div>
            </div>

            {/* Feature 4: 5% GST Billing & Invoices */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between card-hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Smart Billing & 5% GST</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Auto-calculated CGST/SGST, Cash and UPI settlement, and 1-click printable digital receipts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] font-bold text-slate-500">
                ● GST-ready receipts with GSTIN
              </div>
            </div>

            {/* Feature 5: Thermal KOT Printing */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between card-hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-4">
                  <Printer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Thermal KOT Printer</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Compatible with 80mm and 58mm thermal printers. Print formatted kitchen tickets with zero driver hassles.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] font-bold text-slate-500">
                ● 80mm POS & 58mm compact slips
              </div>
            </div>

            {/* Feature 6: Instant 86 Stock Toggles */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between card-hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center mb-4">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Instant Menu & 86 Toggles</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ran out of paneer? Toggle an item to "86'd" in one tap, instantly disabled across every live table QR.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] font-bold text-slate-500">
                ● Real-time stock sync
              </div>
            </div>

            {/* Feature 7: Standee QR Generator */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between card-hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-4">
                  <TableProperties className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Tables & Standee QRs</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Add dining tables, generate custom standee QRs with your restaurant name, and download in bulk as a ZIP.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] font-bold text-slate-500">
                ● Printable high-res PNGs
              </div>
            </div>

            {/* Feature 8: Live Sales Dashboard */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between card-hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Owner Sales Dashboard</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Monitor today's gross revenue, active tables, top selling dishes, and shift activity directly from your smartphone.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200/60 text-[11px] font-bold text-slate-500">
                ● Accessible on any phone
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.6 How It Works (3 Steps) */}
      <section id="how-it-works" className="py-20 bg-stone-50/50 border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
              {LANDING_CONTENT.howItWorks.tagline}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {LANDING_CONTENT.howItWorks.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LANDING_CONTENT.howItWorks.steps.map((step) => (
              <div key={step.step} className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between card-hover-lift">
                <div>
                  <span className="text-3xl font-black text-brand-500 font-mono block mb-3">
                    {step.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{step.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{step.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.7 Interactive Product Tour */}
      <section id="tour" className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
              Interactive Product Tour
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              See what runs on your screen.
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Click below to explore each core screen of Swaad Sevak.
            </p>
          </div>

          {/* Tour Tabs Bar */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: 'orders', label: 'Live Orders KDS', icon: UtensilsCrossed },
              { id: 'dashboard', label: 'Owner Overview', icon: TrendingUp },
              { id: 'menu', label: 'Menu & Stock', icon: Store },
              { id: 'tables', label: 'Tables & QR Standees', icon: TableProperties },
              { id: 'bills', label: '5% GST Bills', icon: Receipt },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = tourTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTourTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-stone-50 border-stone-200 text-slate-600 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tour Showcase Card in Dark Frame */}
          <div className="mt-8 bg-[#0B1020] rounded-2xl border border-white/[0.1] p-6 shadow-2xl text-white max-w-4xl mx-auto">
            {tourTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <h3 className="font-bold text-base text-white">Live Kitchen Order Display (KDS)</h3>
                    <p className="text-xs text-slate-400">Incoming → Cooking → Ready to Serve with continuous sound alerts</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-brand-500 text-white font-bold text-xs">Arm's Length Readable</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-amber-400/40">
                    <span className="text-amber-400 font-bold block mb-1">Incoming Orders (2)</span>
                    <p className="text-slate-300">Table 03 • 2x Kulhad Chai, 1x Bun Maska</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-blue-400/40">
                    <span className="text-blue-400 font-bold block mb-1">Kitchen Cooking (1)</span>
                    <p className="text-slate-300">Table 07 • 1x Paneer Tikka (8m in prep)</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-emerald-400/40">
                    <span className="text-emerald-400 font-bold block mb-1">Ready to Serve (1)</span>
                    <p className="text-slate-300">Table 01 • Food plated, ready for server</p>
                  </div>
                </div>
              </div>
            )}

            {tourTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <h3 className="font-bold text-base text-white">Manager & Owner Dashboard</h3>
                    <p className="text-xs text-slate-400">Daily gross revenue, table floor map, and top-selling dishes</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-xs">₹24,850 Today</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Today Sales</span>
                    <span className="text-base font-bold text-white">₹24,850</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Total Tickets</span>
                    <span className="text-base font-bold text-white">48</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Active Tables</span>
                    <span className="text-base font-bold text-amber-400">4 Seated</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Settled</span>
                    <span className="text-base font-bold text-emerald-400">44 Billed</span>
                  </div>
                </div>
              </div>
            )}

            {tourTab === 'menu' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <h3 className="font-bold text-base text-white">Instant Menu & 86 Toggles</h3>
                    <p className="text-xs text-slate-400">Categories, portions, pricing, and 1-tap stock availability</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-xs">AI PDF Importer</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">Old Delhi Butter Chicken</span>
                    <span className="text-slate-400 ml-2">₹389 (Standard Bowl)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    In Stock • Live
                  </span>
                </div>
              </div>
            )}

            {tourTab === 'tables' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <h3 className="font-bold text-base text-white">Tables & Standee QR Generator</h3>
                    <p className="text-xs text-slate-400">Generate table QRs and download printable branded standees</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-purple-600 text-white font-bold text-xs">ZIP Bulk Download</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-white p-1 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-slate-900" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm">Table 01 Standee</span>
                      <p className="text-slate-400 text-[11px]">Ready for acrylic standee print</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded bg-white text-slate-900 font-bold text-xs">Download PNG</span>
                </div>
              </div>
            )}

            {tourTab === 'bills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <h3 className="font-bold text-base text-white">5% GST Invoicing & Thermal Printing</h3>
                    <p className="text-xs text-slate-400">Auto-calculated CGST (2.5%) + SGST (2.5%) with Cash & UPI tracking</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-xs">GSTIN Compliant</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-slate-400">#INV-102 • Table 01</span>
                    <p className="font-bold text-white mt-0.5">Grand Total: ₹743 (incl. ₹35.38 GST)</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Paid via UPI
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3.8 Savings / ROI Calculator */}
      <section id="calculator" className="py-20 bg-stone-50/70 border-b border-stone-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
              {LANDING_CONTENT.calculator.tagline}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {LANDING_CONTENT.calculator.heading}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {LANDING_CONTENT.calculator.subhead}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Sliders Input */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Daily Orders (Dine-in & Direct)</span>
                    <span className="text-brand-600 font-mono text-sm">{dailyOrders} orders/day</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="600"
                    step="10"
                    value={dailyOrders}
                    onChange={(e) => setDailyOrders(parseInt(e.target.value))}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>30</span>
                    <span>300</span>
                    <span>600+</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Average Order Value</span>
                    <span className="text-brand-600 font-mono text-sm">₹{avgOrderValue}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="20"
                    value={avgOrderValue}
                    onChange={(e) => setAvgOrderValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹100</span>
                    <span>₹750</span>
                    <span>₹1,500</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Aggregator Commission %</span>
                    <span className="text-brand-600 font-mono text-sm">{aggregatorCommission}%</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="32"
                    step="1"
                    value={aggregatorCommission}
                    onChange={(e) => setAggregatorCommission(parseInt(e.target.value))}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>18%</span>
                    <span>25% (Standard)</span>
                    <span>32%</span>
                  </div>
                </div>
              </div>

              {/* Output Card */}
              <div className="bg-[#0B1020] text-white p-6 sm:p-7 rounded-2xl border border-white/[0.1] text-center flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Estimated Monthly Value Retained
                  </span>
                  <div className="text-4xl sm:text-5xl font-extrabold text-brand-400 tabular-nums mt-2">
                    ₹{estimatedMonthlySavings.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Retained every month through eliminated order leakage, faster table turns, and direct QR ordering.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] text-[10px] text-slate-400">
                  {LANDING_CONTENT.calculator.disclaimer}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.9 Why Swaad Sevak Comparison Table */}
      <section className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
              {LANDING_CONTENT.comparison.tagline}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {LANDING_CONTENT.comparison.heading}
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200/80 shadow-xs">
            <table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80 text-slate-700 font-bold">
                  <th className="py-3.5 px-4">Feature</th>
                  <th className="py-3.5 px-4 text-slate-500">Notebook / Slips</th>
                  <th className="py-3.5 px-4 text-slate-500">Legacy POS Hardware</th>
                  <th className="py-3.5 px-4 text-brand-600 font-bold bg-brand-50/50">Swaad Sevak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {LANDING_CONTENT.comparison.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.feature}</td>
                    <td className="py-3 px-4 text-slate-500">{row.paper}</td>
                    <td className="py-3 px-4 text-slate-500">{row.legacy}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 bg-brand-50/30">{row.swaad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3.10 Built for Every Kind of Food Business */}
      <section className="py-16 bg-stone-50/60 border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Built for every format of Indian hospitality
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {LANDING_CONTENT.businessTypes.map((type, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs text-left card-hover-lift">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                  {idx === 0 && <Coffee className="w-4 h-4" />}
                  {idx === 1 && <UtensilsCrossed className="w-4 h-4" />}
                  {idx === 2 && <ChefHat className="w-4 h-4" />}
                  {idx === 3 && <Cake className="w-4 h-4" />}
                  {idx === 4 && <ShoppingBag className="w-4 h-4" />}
                </div>
                <h3 className="font-bold text-slate-900 text-xs">{type.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.11 Testimonials (Clearly marked placeholders per brief) */}
      <section className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
              Owner Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Calmer rush hours across Indian kitchens
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              [Early Partner Pilot Feedback]
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LANDING_CONTENT.testimonials.map((t) => (
              <div key={t.id} className="bg-stone-50/70 p-6 rounded-2xl border border-stone-200/80 flex flex-col justify-between card-hover-lift">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="mt-5 pt-3 border-t border-stone-200/60">
                  <p className="text-xs font-bold text-slate-900">{t.author}</p>
                  <p className="text-[11px] text-slate-500">{t.role} • {t.outlet}, {t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.12 Pricing Plans */}
      <section id="pricing" className="py-20 bg-stone-50/50 border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
              {LANDING_CONTENT.pricing.tagline}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {LANDING_CONTENT.pricing.heading}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {LANDING_CONTENT.pricing.subhead}
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="mt-6 inline-flex items-center gap-2 p-1 rounded-xl bg-white border border-stone-200 shadow-xs">
              <button
                onClick={() => setAnnualBilling(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !annualBilling ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setAnnualBilling(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  annualBilling ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-white text-brand-600 font-extrabold">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {LANDING_CONTENT.pricing.plans.map((plan) => {
              const price = annualBilling ? plan.priceAnnual : plan.priceMonthly;
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-7 flex flex-col justify-between transition-all ${
                    plan.popular
                      ? 'bg-[#0B1020] text-white border-2 border-brand-500 shadow-xl relative'
                      : 'bg-white text-slate-900 border border-stone-200/80 shadow-xs'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white shadow-xs">
                      {plan.badge}
                    </span>
                  )}

                  <div>
                    <h3 className={`text-lg font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs mt-1 ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>

                    <div className="mt-5 pb-5 border-b border-stone-200/30">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl sm:text-4xl font-black tabular-nums ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                          ₹{price}
                        </span>
                        <span className={`text-xs ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                          / month
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {annualBilling ? 'Billed annually' : 'Billed monthly'}
                      </span>
                    </div>

                    <ul className="mt-6 space-y-2.5 text-xs">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 shrink-0 ${plan.popular ? 'text-brand-400' : 'text-brand-500'}`} />
                          <span className={plan.popular ? 'text-slate-300' : 'text-slate-700'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <button
                      onClick={onStartRegistration}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        plan.popular
                          ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/25'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {plan.ctaText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            <span>{LANDING_CONTENT.pricing.whatsappSupport}: </span>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 font-bold hover:underline"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 3.13 FAQ Accordion */}
      <section id="faq" className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to know.
            </h2>
          </div>

          <div className="space-y-3">
            {LANDING_CONTENT.faqs.map((faq: FaqItem) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-stone-200/80 bg-white overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4"
                  >
                    <span>{faq.question}</span>
                    <span className="p-1 rounded-md text-slate-400 bg-stone-50 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-stone-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3.14 Final CTA Band */}
      <section className="py-20 bg-[#0B1020] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            {LANDING_CONTENT.finalCta.headline}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            {LANDING_CONTENT.finalCta.subhead}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStartRegistration}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2"
            >
              <span>{LANDING_CONTENT.finalCta.primaryCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-sm border border-white/[0.12] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{LANDING_CONTENT.finalCta.whatsappCta}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3.15 Footer */}
      <footer className="py-12 bg-[#070B16] text-slate-400 border-t border-white/[0.08] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white font-black text-xs">
              S
            </div>
            <span className="font-bold text-sm text-white">Swaad Sevak</span>
            <span className="text-slate-500 ml-2">Restaurant OS</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <button onClick={onOpenLogin} className="hover:text-white transition-colors">Manager Login</button>
          </div>

          <div className="text-slate-500 text-center sm:text-right">
            <p>Made with pride in India 🇮🇳</p>
            <p className="text-[10px] text-slate-600 mt-0.5">© {new Date().getFullYear()} Swaad Sevak. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA Bar */}
      {showStickyCta && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1020]/95 backdrop-blur-md p-3 border-t border-white/[0.1] flex items-center justify-between gap-3 shadow-2xl animate-fade-in">
          <div>
            <p className="text-xs font-bold text-white leading-tight">Start Swaad Sevak</p>
            <p className="text-[10px] text-slate-400">14-day free trial • No card</p>
          </div>
          <button
            onClick={onStartRegistration}
            className="px-4 py-2 rounded-lg bg-brand-500 text-white font-bold text-xs shadow-xs"
          >
            Start Free
          </button>
        </div>
      )}
    </div>
  );
};
