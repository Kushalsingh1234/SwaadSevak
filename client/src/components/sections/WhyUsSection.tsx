import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Coins,
  Flame,
  Smartphone,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Receipt,
  ScanLine,
  Layers,
  Lock,
  Clock,
  Check,
  Cpu,
  RefreshCw,
  Award,
  QrCode,
  Laptop,
  CheckCheck,
  X,
  Users,
  Send,
  Store
} from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'pillars'>('comparison');

  const comparisonData = [
    {
      id: 'daily-ops',
      icon: Store,
      capability: 'Daily Operations',
      category: 'Core Operations',
      legacy: 'Built mainly for billing and basic restaurant operations',
      swaad: 'Built to manage operations and drive growth',
      pill: 'Ops + Growth'
    },
    {
      id: 'customer-data',
      icon: Users,
      capability: 'Customer Data',
      category: 'Customer Intelligence',
      legacy: 'Customer information is often scattered or underused',
      swaad: 'Centralized customer profiles with actionable insights',
      pill: 'Unified Profiles'
    },
    {
      id: 'repeat-customers',
      icon: RefreshCw,
      capability: 'Repeat Customers',
      category: 'Retention & RFM',
      legacy: 'Limited visibility into who is returning',
      swaad: 'Identify repeat, inactive, and high-value customers',
      pill: 'RFM Tracking'
    },
    {
      id: 'marketing',
      icon: Send,
      capability: 'Marketing',
      category: 'Guest Engagement',
      legacy: 'Marketing usually requires separate tools',
      swaad: 'Built-in campaigns and customer engagement',
      pill: 'Built-in WhatsApp'
    },
    {
      id: 'automation',
      icon: Zap,
      capability: 'Automation',
      category: 'Smart Workflows',
      legacy: 'Manual follow-ups and repetitive tasks',
      swaad: 'Automated customer journeys and campaigns',
      pill: 'Auto Journeys'
    },
    {
      id: 'analytics',
      icon: Sparkles,
      capability: 'Analytics',
      category: 'Business Intelligence',
      legacy: 'Reports show what happened',
      swaad: 'Insights help explain why it happened and what to do next',
      pill: 'Actionable AI'
    },
    {
      id: 'growth-tools',
      icon: TrendingUp,
      capability: 'Growth Tools',
      category: 'Revenue Engine',
      legacy: 'Mostly focused on transactions',
      swaad: 'Designed around retention, revenue, and customer growth',
      pill: 'Growth Engine'
    },
    {
      id: 'customer-engagement',
      icon: Clock,
      capability: 'Customer Engagement',
      category: 'Lifecycle Care',
      legacy: 'Ends after the bill is generated',
      swaad: 'Continues after the customer leaves',
      pill: 'Continuous CRM'
    },
    {
      id: 'decision-making',
      icon: Award,
      capability: 'Decision Making',
      category: 'Data Strategy',
      legacy: 'Owner relies heavily on manual analysis',
      swaad: 'Clear recommendations based on restaurant data',
      pill: 'Data-Backed'
    },
    {
      id: 'ease-of-use',
      icon: Laptop,
      capability: 'Ease of Use',
      category: 'All-In-One UX',
      legacy: 'Multiple tools may be needed for different tasks',
      swaad: 'One connected platform for operations + growth',
      pill: '1 Connected App'
    },
    {
      id: 'scalability',
      icon: ShieldCheck,
      capability: 'Scalability',
      category: 'Multi-Stage Scale',
      legacy: 'Additional tools often needed as the business grows',
      swaad: 'Growth features built into the platform',
      pill: 'Built-in Scale'
    },
    {
      id: 'business-focus',
      icon: CheckCircle2,
      capability: 'Business Focus',
      category: 'Core Mission',
      legacy: 'Run the restaurant',
      swaad: 'Run + Grow the restaurant',
      pill: 'Run + Grow'
    }
  ];

  const pillars = [
    {
      num: '01',
      tag: '01 — OPERATE',
      icon: Store,
      title: '01 — OPERATE',
      badge: '6 Core Modules',
      metric: 'Frictionless Ops',
      headline: 'Run your restaurant smarter',
      desc: 'SwaadSevak simplifies everyday restaurant operations by bringing essential business data and workflows into one connected platform.',
      features: [
        { name: 'Restaurant Dashboard', desc: 'A single view of today’s sales, order volume, average order value, visits, new vs returning diners, and growth indicators.' },
        { name: 'Sales & Revenue Tracking', desc: 'Track daily, weekly and monthly revenue trends, peak sales rush periods, order counts, and comparative performance.' },
        { name: 'Customer & Transaction Data', desc: 'Automatically log purchase histories, visit frequency, lifetime spend, and favourite dish categories.' },
        { name: 'Unified Customer Profiles', desc: 'Centralize diner contact info, spend tier, last visit date, customer segment, and historical campaign responses.' },
        { name: 'Universal Data Import', desc: 'Bring existing data from Petpooja, Posist, UrbanPiper, or standard CSV/Excel reports without starting from zero.' },
        { name: 'Multi-Outlet Management', desc: 'Manage multiple branches from one login with outlet-wise revenue, customer analytics, and centralized reporting.' }
      ]
    },
    {
      num: '02',
      tag: '02 — UNDERSTAND',
      icon: Sparkles,
      title: '02 — UNDERSTAND',
      badge: '10 Analytics Engines',
      metric: 'AI Intelligence',
      headline: 'Turn restaurant data into clear insights',
      desc: 'SwaadSevak transforms raw restaurant data into actionable information that helps owners understand customers, sales and business performance.',
      features: [
        { name: 'Business Analytics', desc: 'Understand revenue trends, order velocity, repeat visit rate, acquisition cost, and average ticket sizes.' },
        { name: 'Customer Analytics', desc: 'Differentiate new, returning, loyal, high-value, inactive, and at-risk diner cohorts.' },
        { name: 'Automated Segmentation', desc: 'Group customers automatically into New, Repeat, Loyal, High-Value, At-Risk, and Inactive segments.' },
        { name: 'RFM Value Scoring', desc: 'Evaluate diner worth using Recency (last visit), Frequency (visit cadence), and Monetary (lifetime spend).' },
        { name: 'Product & Category Analytics', desc: 'Identify high-margin Stars vs low-profit Dogs, item attachment rates, and category revenue share.' },
        { name: 'Customer Cohort Analysis', desc: 'Track retention curves by acquisition month (e.g. Jan vs Feb cohorts) to measure long-term customer value.' },
        { name: 'Retention & Churn Tracking', desc: 'Shift focus from pure acquisition to keeping diners with automated churn risk detection.' },
        { name: 'Campaign Attribution Analytics', desc: 'Measure exact table visits, redeemed coins, and POS revenue generated per marketing campaign.' },
        { name: 'Automated Growth Insights', desc: 'Plain-English alerts: "Repeat visits down 12% this month • 142 diners overdue by 45 days".' },
        { name: 'Analytics Report Upload', desc: 'Upload existing POS spreadsheets to generate insights without needing to replace your POS system.' }
      ]
    },
    {
      num: '03',
      tag: '03 — ENGAGE',
      icon: Send,
      title: '03 — ENGAGE',
      badge: '10 CRM Capabilities',
      metric: 'Diner Loyalty',
      headline: 'Build stronger customer relationships',
      desc: 'Once SwaadSevak understands customers, it helps restaurants communicate with the right customers at the right time with zero spam.',
      features: [
        { name: 'Centralized Restaurant CRM', desc: 'A 360° view of diner identity, purchase history, spend frequency, and preferences to build personalized relationships.' },
        { name: 'Smart Customer Segments', desc: 'Create targeted audiences: "Spent > ₹5,000", "Ordered Pizza 5+ times", or "Inactive 30+ days".' },
        { name: 'No-Code Campaign Builder', desc: 'Choose Audience, Offer, Message, Channel & Timing in under 60 seconds without technical complexity.' },
        { name: 'Dynamic Personalization', desc: 'Automatically insert diner name, favourite dish, coin balance, and restaurant name into every message.' },
        { name: 'Automated Customer Campaigns', desc: 'Set-and-forget campaigns for Welcome, 2nd Visit, 30-Day Win-Back, Birthday Specials, and Loyalty Milestones.' },
        { name: 'Official WhatsApp Campaigns', desc: 'Reach customers directly on WhatsApp via official Meta Business API with verified open rates and delivery tracking.' },
        { name: 'Ready-Made Campaign Templates', desc: 'Pre-written templates for Weekend Offers, "We Miss You", VIP Appreciation, and New Menu Announcements.' },
        { name: 'Smart Campaign Scheduling', desc: 'Schedule campaigns for peak decision hours (e.g. Friday 6:30 PM) based on customer dining habits.' },
        { name: 'Automated Customer Journeys', desc: 'Multi-step visual flows: First Visit → 3-day Thank You → 10-day Comeback Incentive if unvisited.' },
        { name: 'Campaign Performance & Attribution', desc: 'Track audience reach, delivery, engagement, table redemptions, and net revenue generated.' }
      ]
    },
    {
      num: '04',
      tag: '04 — GROW',
      icon: TrendingUp,
      title: '04 — GROW',
      badge: '10 Growth Drivers',
      metric: 'Revenue Engine',
      headline: 'Turn insights into measurable growth',
      desc: 'This is where SwaadSevak differentiates itself from traditional POS systems: turning customer data into continuous, profitable revenue growth.',
      features: [
        { name: 'AI Growth Engine', desc: 'Answers "Where are you losing customers?", "Which campaign should you run?", and "What opportunity are you missing?".' },
        { name: 'AI-Powered Recommendations', desc: 'Converts data directly into actions: "214 customers overdue → Launch ₹75 Win-Back campaign".' },
        { name: 'Opportunity Detection', desc: 'Automatically identifies slow weekdays, declining repeat visits, and high-value diners at risk of churn.' },
        { name: 'Win-Back Revenue Recovery', desc: 'Pinpoint lost customers and launch targeted reactivation offers instead of costly blanket discounts.' },
        { name: 'Customer Retention Engine', desc: 'Identify customers likely to return vs becoming inactive and trigger timely loyalty incentives.' },
        { name: 'Customer Lifetime Value (LTV)', desc: 'Estimate long-term customer worth to prioritize VIP hospitality and high-yield retention.' },
        { name: 'Contextual Campaign Triggers', desc: 'Proposes high-margin beverage combo pairings on weekends and slow-day promotions.' },
        { name: 'Measurable Growth Goals', desc: 'Set and track targets like "+15% repeat customers", "+10% monthly revenue", or "Reactivate 200 diners".' },
        { name: 'Executive Growth Dashboard', desc: 'A dedicated dashboard tracking business growth, retention lift, and campaign-attributed revenue.' },
        { name: '4-Stage Growth Reports', desc: 'Simple executive format: "What Happened → Why It Happened → What To Do Next → Growth Generated".' }
      ]
    }
  ];

  return (
    <div className="overflow-hidden" style={{ backgroundColor: '#FFF8F1' }}>
      <section
        id="why-us"
        className="py-14 sm:py-20 font-sans relative overflow-hidden text-white rounded-b-[2.5rem] sm:rounded-b-[3.5rem] lg:rounded-b-[4.5rem]"
        style={{ backgroundColor: '#2B1A12' }}
      >
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-[550px] h-[450px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none -z-0" />

      {/* Subtle Warm Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 -z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 184, 61, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md text-[11px] font-bold bg-[#3D2519] border border-[#5A3A28] text-amber-400 mb-3.5 shadow-sm font-mono uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>The SwaadSevak Advantage</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[1.15] text-white">
            Why High-Volume Restaurants Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400">
              SwaadSevak.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-stone-300/90 mt-3 leading-relaxed font-normal max-w-xl mx-auto">
            Traditional POS systems are slow, locked to expensive hardware, and leave your customer data stranded. SwaadSevak is engineered for high-speed shifts.
          </p>

          {/* Sharp Compact Switcher Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-[#3A2216] border border-[#5A3A28] mt-6 shadow-lg">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-md scale-100'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Side-by-Side Analysis
            </button>
            <button
              onClick={() => setActiveTab('pillars')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pillars'
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-md scale-100'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Core Value Pillars
            </button>
          </div>
        </div>

        {/* ============================================================
            TAB 1: COMPACT SHARP-CORNER COMPARISON TABLE
           ============================================================ */}
        {activeTab === 'comparison' && (
          <div className="rounded-2xl bg-[#361F14] border border-[#5A3A28] shadow-2xl overflow-hidden backdrop-blur-xl">
            
            {/* Header Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 bg-[#452819] border-b border-[#5A3A28] text-left items-center gap-3">
              <div className="md:col-span-4 text-[11px] font-mono font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Operational Dimension</span>
              </div>
              <div className="md:col-span-4 text-[11px] font-mono font-bold uppercase tracking-wider text-stone-300 hidden md:flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Legacy POS / Old Software</span>
              </div>
              <div className="md:col-span-4 text-[11px] font-mono font-extrabold uppercase tracking-wider text-amber-300 hidden md:flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SwaadSevak Platform</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30">
                  HIGH SPEED
                </span>
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-[#5A3A28]/60 text-left">
              {comparisonData.map((row, idx) => {
                const RowIcon = row.icon;
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 sm:py-4.5 gap-3 md:gap-4 items-center hover:bg-white/[0.025] transition-all group"
                  >
                    {/* Capability Info (Column 1) */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 shadow-sm">
                        <RowIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400/80 block">
                          {row.category}
                        </span>
                        <h4 className="text-xs sm:text-[13.5px] font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {row.capability}
                        </h4>
                      </div>
                    </div>

                    {/* Legacy System (Column 2) */}
                    <div className="md:col-span-4 p-3 rounded-lg bg-[#28150D] border border-rose-500/20 text-stone-300">
                      <div className="flex items-center gap-1 mb-1 text-rose-400 text-[10px] font-bold font-mono md:hidden">
                        <X className="w-3 h-3" />
                        <span>Legacy POS</span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed text-stone-300">
                        {row.legacy}
                      </p>
                    </div>

                    {/* SwaadSevak Superior Advantage (Column 3) */}
                    <div className="md:col-span-4 p-3 rounded-lg bg-gradient-to-b from-[#4A2D1E] to-[#3D2316] border border-amber-500/40 shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-1 text-emerald-400 text-[10.5px] font-bold font-mono">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>SwaadSevak</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9.5px] font-mono font-bold border border-amber-500/30">
                          {row.pill}
                        </span>
                      </div>

                      <p className="text-[11.5px] leading-relaxed text-amber-100 font-semibold">
                        {row.swaad}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================================================
            TAB 2: CORE VALUE PILLARS (EXPANDABLE RICH FEATURE CARDS)
           ============================================================ */}
        {activeTab === 'pillars' && (
          <div className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {pillars.map((pillar, idx) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-2xl bg-[#361F14] border border-[#5A3A28] hover:border-amber-400/50 transition-all duration-200 shadow-xl flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                            <PillarIcon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-mono font-black text-amber-400 px-2.5 py-1 rounded-md bg-[#452819] border border-[#5A3A28]">
                            {pillar.tag}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/[0.06] text-stone-300 border border-white/10">
                            {pillar.metric}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {pillar.badge}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1.5 group-hover:text-amber-300 transition-colors">
                        {pillar.headline}
                      </h3>
                      <p className="text-xs text-stone-300 leading-relaxed mb-5 font-normal">
                        {pillar.desc}
                      </p>

                      {/* Feature Modules Breakdown */}
                      <div className="space-y-2.5 mb-5">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-amber-400/90 block mb-2">
                          Core Features ({pillar.features.length})
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {pillar.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="p-2.5 rounded-lg bg-[#28150D] border border-white/[0.04] text-xs leading-snug"
                            >
                              <div className="flex items-center gap-1.5 font-bold text-amber-200 mb-0.5">
                                <div className="w-3.5 h-3.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                  <Check className="w-2 h-2 text-emerald-400 stroke-[3]" />
                                </div>
                                <span>{feat.name}</span>
                              </div>
                              <p className="text-[11px] text-stone-300/85 pl-5">
                                {feat.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3.5 border-t border-[#5A3A28] flex items-center justify-between text-[11px] font-mono text-stone-400">
                      <span>SwaadSevak Core Architecture</span>
                      <span className="text-amber-400 font-bold">100% Connected</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* The Complete SwaadSevak Closed Loop & Core Promise */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#3D2519] via-[#331C11] to-[#28140B] border border-amber-500/30 shadow-2xl text-left">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#5A3A28]">
                <div className="max-w-xl">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-amber-400 block mb-1">
                    Architectural Flywheel
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white">
                    The Complete SwaadSevak Loop
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                    Data captured during daily operations continuously feeds intelligence, powers automated engagement, drives measurable revenue growth, and optimizes subsequent shifts.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center shrink-0">
                  <div className="p-3 rounded-xl bg-[#200F07] border border-amber-500/20">
                    <span className="text-[10px] font-mono font-bold text-amber-400 block">01</span>
                    <span className="text-xs font-bold text-white">OPERATE</span>
                    <span className="text-[9px] text-stone-400 block mt-0.5">Collect Data</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#200F07] border border-amber-500/20">
                    <span className="text-[10px] font-mono font-bold text-amber-400 block">02</span>
                    <span className="text-xs font-bold text-white">UNDERSTAND</span>
                    <span className="text-[9px] text-stone-400 block mt-0.5">Analyze RFM</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#200F07] border border-amber-500/20">
                    <span className="text-[10px] font-mono font-bold text-amber-400 block">03</span>
                    <span className="text-xs font-bold text-white">ENGAGE</span>
                    <span className="text-[9px] text-stone-400 block mt-0.5">WhatsApp CRM</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#200F07] border border-amber-500/20">
                    <span className="text-[10px] font-mono font-bold text-amber-400 block">04</span>
                    <span className="text-xs font-bold text-white">GROW</span>
                    <span className="text-[9px] text-stone-400 block mt-0.5">Measure ROI</span>
                  </div>
                </div>
              </div>

              {/* The Core Promise Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="p-4 rounded-xl bg-[#200F07] border border-rose-500/20">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-rose-400 block mb-1">
                    Traditional Legacy POS
                  </span>
                  <p className="text-xs text-stone-300 font-serif italic">
                    "Here is what happened in your restaurant today."
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/40">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-300 block mb-1">
                    The SwaadSevak Platform Promise
                  </span>
                  <p className="text-xs text-amber-100 font-semibold">
                    "Here is what happened, why it happened, what you should do next, and how much growth that action generated."
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Compact Sharp Bottom Banner */}
        <div className="mt-6 sm:mt-7 max-w-4xl mx-auto py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl bg-[#361F14] border border-[#5A3A28] shadow-md flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-[12px] sm:text-[13px] font-bold text-white leading-tight">
                Start Running High-Speed Shifts Today
              </h4>
              <p className="text-[10px] sm:text-[11px] text-stone-300 mt-0.5 leading-tight">
                Setup your restaurant in 5 minutes with zero upfront hardware cost.
              </p>
            </div>
          </div>

          <a
            href="#login"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <span>Platform Login</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-950 stroke-[2.5]" />
          </a>
        </div>

      </div>
    </section>
  </div>
  );
};
