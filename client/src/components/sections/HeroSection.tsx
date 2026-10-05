import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Monitor,
  FileText,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Sparkles,
  UtensilsCrossed,
  ChefHat,
  Smartphone,
} from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-[calc(100vh-73px)] flex flex-col justify-between font-sans overflow-hidden px-4 sm:px-8 lg:px-12 xl:px-16 pt-8 sm:pt-12 pb-8 text-left"
      style={{ backgroundColor: '#1A0F0A', color: '#FFFFFF' }}
    >
      {/* Ambient Lighting & Luxury Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] bg-orange-500/20 rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-1/4 w-[750px] h-[650px] bg-orange-600/18 rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      
      {/* High-Visibility Warm Sand Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.22) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-[1700px] mx-auto w-full relative z-10 flex-1 flex flex-col justify-between py-2 sm:py-4">
        
        {/* 2-Column Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center flex-1 my-auto py-4 sm:py-8">
          
          {/* Left Column: Copy & Actions (6.5 Cols on xl) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {/* Top Pill Label */}
            <div
              className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-soft"
              style={{ backgroundColor: '#2B1A12', border: '1px solid #5A3A28', color: '#FAF4ED' }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <span>Every order. Every table. Every rupee.</span>
              <span style={{ color: '#D5BEAA' }}>•</span>
              <span className="font-mono font-extrabold text-orange-400">One calm system for your whole food business</span>
            </div>

            {/* Big Bold High-Impact Headline */}
            <h1
              className="text-4xl sm:text-6xl lg:text-6xl xl:text-7xl 2xl:text-[5.25rem] font-black tracking-tight leading-[1.06]"
              style={{ color: '#FFFFFF' }}
            >
              Run your Restaurant{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 inline-block drop-shadow-sm">
                without the chaos.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl lg:text-2xl leading-relaxed font-normal max-w-2xl"
              style={{ color: '#F5E9DD' }}
            >
              Customers scan, order and pay. Your kitchen sees every order live. You see every rupee. QR ordering, kitchen display, billing, Swiggy &amp; Zomato orders and reports, all in one simple system for cafés, restaurants, cloud kitchens and more.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 pt-2">
              <a
                href={SITE_CONTENT.links.websiteInquiry}
                data-event="hero_get_website_click"
                onClick={() => trackEvent('hero_get_website_click')}
                className="btn-shine inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4.5 sm:py-5 rounded-2xl font-extrabold text-base sm:text-lg bg-orange-500 text-espresso shadow-glow-orange hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                style={{ color: '#1A0F0A' }}
              >
                <span>Get Your Website Now</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>

              <a
                href={SITE_CONTENT.links.demo}
                data-event="hero_see_how_it_works_click"
                onClick={() => trackEvent('hero_see_how_it_works_click')}
                className="inline-flex items-center justify-center gap-3 px-8 sm:px-9 py-4.5 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all border border-walnut hover:border-orange-500 hover:bg-cocoa hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{ backgroundColor: '#2B1A12', color: '#FFFFFF' }}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
                </div>
                <span>See How It Works</span>
              </a>
            </div>

            {/* 3 Trust Points Row */}
            <div className="pt-2 flex flex-wrap items-center gap-6 sm:gap-8 text-sm sm:text-base font-semibold" style={{ color: '#FAF4ED' }}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                <span>Affordable Pricing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                <span>No Technical Skills Needed</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase Characters Cutout (5.5 Cols on xl) */}
          <div className="lg:col-span-6 xl:col-span-5 relative flex justify-center items-center">
            {/* Ambient Warm Glow behind Characters */}
            <div className="absolute inset-0 bg-orange-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="relative w-full flex items-center justify-center transition-transform hover:scale-[1.02] duration-500">
              <img
                src="/brand/hero-characters-transparent.png"
                alt="SwaadSevak Restaurant Team & Characters"
                className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
              />
            </div>
          </div>

        </div>

        {/* Bottom 5-Card Feature Bar Across Full Width */}
        <div className="mt-8 pt-6 border-t border-walnut/60">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 p-3 sm:p-5 rounded-3xl shadow-card"
            style={{ backgroundColor: '#2B1A12', border: '1px solid #3D2519' }}
          >
            {/* Card 1 */}
            <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl hover:bg-cocoa/70 transition-all border border-transparent hover:border-walnut/50">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">Custom Website Design</h4>
                <p className="text-xs sm:text-xs text-sand-100 font-medium mt-0.5">Modern &amp; Mobile Friendly</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl hover:bg-cocoa/70 transition-all border border-transparent hover:border-walnut/50">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">Digital Menu</h4>
                <p className="text-xs sm:text-xs text-sand-100 font-medium mt-0.5">Beautiful Menu Showcase</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl hover:bg-cocoa/70 transition-all border border-transparent hover:border-walnut/50">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">Online Ordering</h4>
                <p className="text-xs sm:text-xs text-sand-100 font-medium mt-0.5">Swiggy / Zomato Integration</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl hover:bg-cocoa/70 transition-all border border-transparent hover:border-walnut/50">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">Table Booking</h4>
                <p className="text-xs sm:text-xs text-sand-100 font-medium mt-0.5">Let Customers Reserve</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="sm:col-span-2 lg:col-span-1 flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl hover:bg-cocoa/70 transition-all border border-transparent hover:border-walnut/50">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">More Customers</h4>
                <p className="text-xs sm:text-xs text-sand-100 font-medium mt-0.5">Grow Your Business</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
