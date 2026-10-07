import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Boxes,
  Globe,
  Zap,
  Check
} from 'lucide-react';
import { SITE_CONTENT } from '../../content/site';

interface BenefitItem {
  id: string;
  title: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  exploreLink: string;
  exploreText: string;
}

const BENEFITS: BenefitItem[] = [
  {
    id: 'growth',
    title: 'Boost restaurant growth',
    tag: 'Revenue & Table Turn Speed',
    icon: TrendingUp,
    description: 'Speed up table turn times with fast 3-touch billing, QR table ordering menus, customer loyalty re-engagement, and real-time revenue analytics.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'Explore growth tools',
  },
  {
    id: 'orders',
    title: 'Manage online orders in one hub',
    tag: 'Zomato, Swiggy & ONDC Sync',
    icon: ShoppingBag,
    description: 'Auto-accept Swiggy, Zomato, and Direct orders onto a single kitchen screen. Eliminate tablet clutter and missed rush hour tickets.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'Explore delivery hub',
  },
  {
    id: 'stock',
    title: 'Control stock & raw materials',
    tag: 'Recipe-Level Auto Deductions',
    icon: Boxes,
    description: 'Automate raw ingredient deductions down to grams of dairy, paneer, and poultry. Prevent kitchen pilferage and receive smart reorder alerts.',
    exploreLink: SITE_CONTENT.links.demo,
    exploreText: 'Explore inventory engine',
  },
  {
    id: 'website',
    title: 'Launch a custom restaurant website',
    tag: '0% Commission Direct Orders',
    icon: Globe,
    description: 'Launch your direct digital ordering portal with instant WhatsApp ordering and 0% aggregator commission. We deploy your site within 24 hours.',
    exploreLink: SITE_CONTENT.links.websiteInquiry,
    exploreText: 'Get 24h website quote',
  },
];

export const AccordionBenefitsSection: React.FC = () => {
  const [openId, setOpenId] = useState<string>('growth');
  const activeBenefit = BENEFITS.find((b) => b.id === openId) || BENEFITS[0];

  return (
    <section className="pt-4 sm:pt-6 pb-10 sm:pb-14 text-espresso font-sans relative overflow-hidden" style={{ backgroundColor: '#FFF8F1' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-lg mx-auto mb-5 sm:mb-7">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-espresso shadow-soft mb-2"
            style={{ backgroundColor: '#EFE2D3', border: '1px solid #D8C2AC' }}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
            <span>Operational Outcomes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-espresso tracking-tight mb-2">
            What SwaadSevak Can Do For You
          </h2>
          <p className="text-xs sm:text-[13px] text-[#5A3A28] leading-relaxed">
            Engineered specifically to solve day-to-day rush hour chaos for Indian restaurant owners, managers, and kitchen teams.
          </p>
        </div>

        {/* 2-Column Layout: Luxury Dark Accordion Left (7 cols), SaaS Terminal Widget Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          
          {/* Accordion List (7 cols) */}
          <div className="lg:col-span-7 space-y-2.5 text-left flex flex-col justify-center">
            {BENEFITS.map((item) => {
              const isOpen = item.id === openId;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl sm:rounded-2xl transition-all duration-300 overflow-hidden shadow-md ${
                    isOpen
                      ? 'border border-orange-500/80 shadow-[0_10px_30px_-5px_rgba(249,115,22,0.25)]'
                      : 'border border-[#5A3A28]/60 hover:border-[#8B5A3E]'
                  }`}
                  style={{ backgroundColor: isOpen ? '#3D2519' : '#2E1A11' }}
                >
                  <button
                    onClick={() => setOpenId(item.id)}
                    className="w-full p-3 sm:p-3.5 flex items-center justify-between gap-3 text-left cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all shadow-xs shrink-0 ${
                          isOpen
                            ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]'
                            : 'bg-[#3D2519] text-[#D8C2B0] border border-[#5A3A28]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                          {item.title}
                        </h3>
                        <span className="text-[9.5px] font-mono text-orange-400 font-extrabold uppercase tracking-wider block mt-0.5">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isOpen ? 'bg-orange-500 text-white rotate-180' : 'bg-[#3D2519] text-[#A89080] border border-[#5A3A28]'
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: 'auto' },
                          collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      >
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-[#5A3A28]/50">
                          <p className="text-[11px] sm:text-xs text-[#E8D5C4] leading-relaxed mb-2.5">
                            {item.description}
                          </p>
                          <a
                            href={item.exploreLink}
                            className="inline-flex items-center gap-1.5 font-bold text-xs text-orange-400 hover:text-orange-300 rounded transition-colors group"
                          >
                            <span>{item.exploreText}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Compact Dynamic Visual Showcase Right (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              className="h-full rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_14px_36px_-6px_rgba(43,26,18,0.35)] flex flex-col justify-between relative overflow-hidden min-h-[240px] text-white"
              style={{ backgroundColor: '#24140D', border: '1px solid #5A3A28' }}
            >
              
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#5A3A28]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                    Live Engine
                  </span>
                </div>
                <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded bg-[#3D2519] text-orange-400 border border-[#5A3A28]">
                  {activeBenefit.tag}
                </span>
              </div>

              {/* Morphing Interactive Content Screen */}
              <div className="flex-1 flex items-center justify-center my-auto">
                <AnimatePresence mode="wait">
                  
                  {/* View 1: Boost Restaurant Growth Analytics */}
                  {openId === 'growth' && (
                    <motion.div
                      key="growth"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="w-full space-y-2.5 text-left"
                    >
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-[#3D2519] p-3 rounded-xl border border-[#5A3A28]">
                          <span className="text-[9.5px] font-mono text-[#A89080] font-bold uppercase block">Today Sales</span>
                          <div className="text-lg sm:text-xl font-black text-white font-mono">₹48,250</div>
                          <span className="text-[9.5px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                            <TrendingUp className="w-3 h-3" /> +28% growth
                          </span>
                        </div>
                        <div className="bg-[#3D2519] p-3 rounded-xl border border-[#5A3A28]">
                          <span className="text-[9.5px] font-mono text-[#A89080] font-bold uppercase block">Table Turn</span>
                          <div className="text-lg sm:text-xl font-black text-white font-mono">24 Mins</div>
                          <span className="text-[9.5px] text-orange-400 font-bold flex items-center gap-1 mt-0.5">
                            <Zap className="w-3 h-3" /> 2.1x faster
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#1C0E08] p-2.5 rounded-xl border border-[#5A3A28] space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between items-center text-[#E8D5C4] font-bold text-[10.5px]">
                          <span>Floor Occupancy</span>
                          <span className="text-emerald-400">8/10 Tables Active</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#3D2519] overflow-hidden">
                          <div className="w-[80%] h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* View 2: Online Delivery Hub */}
                  {openId === 'orders' && (
                    <motion.div
                      key="orders"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="w-full space-y-2 text-left"
                    >
                      <div className="p-2.5 rounded-xl bg-[#3D2519] border border-[#5A3A28] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-[11.5px]">Zomato #1094</span>
                              <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">AUTO</span>
                            </div>
                            <p className="text-[9.5px] text-[#C4A895]">2x Butter Chicken, 4x Naan</p>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="font-bold text-white text-[12px] block">₹780</span>
                          <span className="text-[9px] text-[#A89080]">Ready 6m</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#3D2519] border border-[#5A3A28] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-[11.5px]">Swiggy #842</span>
                              <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">FIRED</span>
                            </div>
                            <p className="text-[9.5px] text-[#C4A895]">1x Dal Makhani, 2x Paratha</p>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="font-bold text-white text-[12px] block">₹420</span>
                          <span className="text-[9px] text-emerald-400 font-bold">Plating</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* View 3: Control Stock & Raw Materials */}
                  {openId === 'stock' && (
                    <motion.div
                      key="stock"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="w-full space-y-2 text-left"
                    >
                      <div className="bg-[#3D2519] p-2.5 rounded-xl border border-[#5A3A28] space-y-1">
                        <div className="flex justify-between font-bold text-white text-[11px]">
                          <span>Fresh Malai Paneer</span>
                          <span className="font-mono text-orange-400 font-bold">3.8 kg Left</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#1C0E08] overflow-hidden">
                          <div className="w-[38%] h-full bg-orange-500 rounded-full" />
                        </div>
                        <span className="text-[9px] text-[#A89080] block">-220g auto deducted / dish</span>
                      </div>

                      <div className="bg-[#3D2519] p-2.5 rounded-xl border border-[#5A3A28] space-y-1">
                        <div className="flex justify-between font-bold text-white text-[11px]">
                          <span>Aged Basmati Rice</span>
                          <span className="font-mono text-emerald-400 font-bold">42 kg Left</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#1C0E08] overflow-hidden">
                          <div className="w-[84%] h-full bg-emerald-400 rounded-full" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* View 4: Custom Restaurant Website */}
                  {openId === 'website' && (
                    <motion.div
                      key="website"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="w-full space-y-2 text-left"
                    >
                      <div className="bg-[#3D2519] p-3.5 rounded-xl border border-[#5A3A28] text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C0E08] border border-[#5A3A28] text-[10.5px] font-mono font-bold text-white shadow-xs">
                          <Globe className="w-3.5 h-3.5 text-orange-400" />
                          <span>yourbrand.swaadsevak.app</span>
                        </div>
                        <p className="text-[12px] font-bold text-white">
                          Digital Menu + 1-Tap WhatsApp Ordering
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-0.5 text-[10px] text-emerald-400 font-bold font-mono">
                          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> 0% Cut</span>
                          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> Direct UPI</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Bottom Footer Callout */}
              <div className="pt-2.5 mt-2.5 border-t border-[#5A3A28] flex items-center justify-between text-[10px] text-[#A89080]">
                <span className="font-medium">Indian F&amp;B Operations</span>
                <span className="font-mono font-bold text-orange-400">Zero Hardware Lock</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
