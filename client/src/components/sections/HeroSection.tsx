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
  LogIn,
  Globe,
} from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

interface HeroSectionProps {
  onOpenLogin?: () => void;
  isLoggedIn?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin, isLoggedIn = false }) => {
  return (
    <section
      className="relative min-h-screen xl:h-screen flex flex-col justify-between font-sans overflow-hidden px-4 sm:px-8 lg:px-12 xl:px-16 pt-20 sm:pt-24 pb-4 sm:pb-5 text-left"
      style={{ backgroundColor: '#1A0F0A', color: '#FFFFFF' }}
    >
      {/* Ambient Lighting & Luxury Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-orange-500/20 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-1/4 w-[650px] h-[550px] bg-orange-600/18 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none -z-0" />
      
      {/* Subtle Ambient Warm Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-[1700px] mx-auto w-full relative z-10 flex-1 flex flex-col justify-between">
        
        {/* 2-Column Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-14 items-center flex-1 my-auto py-2 sm:py-4">
          
          {/* Left Column: Copy & Actions (6.5 Cols on xl) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-4 sm:space-y-5 xl:space-y-6 text-left">
            
            {/* Top Pill Label */}
            <div
              className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-xs font-bold shadow-soft"
              style={{ backgroundColor: '#2B1A12', border: '1px solid #5A3A28', color: '#FAF4ED' }}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Every order. Every table. Every rupee.</span>
              <span style={{ color: '#D5BEAA' }}>•</span>
              <span className="font-mono font-extrabold text-orange-400">One calm system for your whole food business</span>
            </div>

            {/* Big Bold High-Impact Headline */}
            <h1
              className="text-3xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.85rem] 2xl:text-[4.35rem] font-black tracking-tight leading-[1.08]"
              style={{ color: '#FFFFFF' }}
            >
              Run your Restaurant{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 inline-block drop-shadow-sm">
                without the chaos.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm sm:text-base xl:text-lg leading-relaxed font-normal max-w-xl"
              style={{ color: '#F5E9DD' }}
            >
              Customers scan, order and pay. Your kitchen sees every order live. You see every rupee. QR ordering, kitchen display, billing, Swiggy &amp; Zomato orders and reports, all in one simple system for cafés, restaurants, cloud kitchens and more.
            </p>

            {/* CTA Button: Platform Login / Go to Dashboard */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <a
                href={isLoggedIn ? "#dashboard" : "#login"}
                data-event={isLoggedIn ? "hero_dashboard_click" : "hero_platform_login_click"}
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent(isLoggedIn ? 'hero_dashboard_click' : 'hero_platform_login_click');
                  if (onOpenLogin) {
                    onOpenLogin();
                  } else {
                    window.location.hash = isLoggedIn ? 'dashboard' : 'login';
                  }
                }}
                className="btn-shine inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl font-extrabold text-sm sm:text-base bg-gradient-to-r from-orange-500 to-amber-500 text-espresso shadow-glow-orange hover:from-orange-600 hover:to-amber-600 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                style={{ color: '#1A0F0A' }}
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-espresso shrink-0" />
                <span>{isLoggedIn ? 'Go to Dashboard' : 'Platform Login'}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-espresso" />
              </a>
            </div>

            {/* 3 Trust Points Row */}
            <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold" style={{ color: '#FAF4ED' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Affordable Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
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
                className="w-full max-h-[360px] sm:max-h-[420px] xl:max-h-[480px] 2xl:max-h-[540px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
              />
            </div>
          </div>

        </div>

        {/* Bottom 5-Card Feature Bar Across Full Width */}
        <div className="mt-4 pt-3 border-t border-walnut/50">
          <div
            className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-2xl shadow-card"
            style={{ backgroundColor: '#2B1A12', border: '1px solid #3D2519' }}
          >
            {/* Card 1 */}
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-cocoa/70 transition-all border border-transparent hover:border-walnut/50">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">Custom Website Design</h4>
                <p className="text-[11px] text-sand-100 font-medium">Modern &amp; Mobile Friendly</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-cocoa/70 transition-all border border-transparent hover:border-walnut/50">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">Digital Menu</h4>
                <p className="text-[11px] text-sand-100 font-medium">Beautiful Menu Showcase</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-cocoa/70 transition-all border border-transparent hover:border-walnut/50">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">Online Ordering</h4>
                <p className="text-[11px] text-sand-100 font-medium">Swiggy / Zomato Integration</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-cocoa/70 transition-all border border-transparent hover:border-walnut/50">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">Table Booking</h4>
                <p className="text-[11px] text-sand-100 font-medium">Let Customers Reserve</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="col-span-2 md:col-span-1 flex items-center gap-3 p-2 rounded-xl hover:bg-cocoa/70 transition-all border border-transparent hover:border-walnut/50">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-inner">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">More Customers</h4>
                <p className="text-[11px] text-sand-100 font-medium">Grow Your Business</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
