import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import {
  ArrowRight,
  CheckCircle2,
  Monitor,
  FileText,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Sparkles,
  LogIn,
} from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

interface HeroSectionProps {
  onOpenLogin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin }) => {
  return (
    <section
      className="relative min-h-[100dvh] xl:min-h-screen flex flex-col justify-between font-sans overflow-hidden px-4 sm:px-8 lg:px-12 xl:px-16 pt-24 sm:pt-28 pb-6 sm:pb-8 text-left"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center flex-1 my-auto py-2 sm:py-6">
          
          {/* Left Column: Copy & Actions (6.5 Cols on xl) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-4 sm:space-y-6 text-left">

            {/* Big Bold High-Impact Headline */}
            <h1
              className="text-[2.15rem] sm:text-5xl lg:text-[3.25rem] xl:text-[3.85rem] 2xl:text-[4.35rem] font-black tracking-tight leading-[1.1]"
              style={{ color: '#FFFFFF' }}
            >
              Run your Restaurant{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 inline-block drop-shadow-[0_2px_12px_rgba(242,92,5,0.3)]">
                without the chaos.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm sm:text-base xl:text-lg leading-relaxed font-normal max-w-xl text-stone-200/90"
            >
              Customers scan, order and pay. Your kitchen sees every order live. You see every rupee. QR ordering, kitchen display, billing, Swiggy &amp; Zomato orders and reports, all in one simple system for cafés, restaurants, cloud kitchens and more.
            </p>

            {/* CTA Button: Platform Login */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <a
                href="#login"
                data-event="hero_platform_login_click"
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent('hero_platform_login_click');
                  if (onOpenLogin) {
                    onOpenLogin();
                  } else {
                    window.location.hash = 'login';
                  }
                }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-[0_0_30px_rgba(242,92,5,0.4)] hover:shadow-[0_0_40px_rgba(242,92,5,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
              >
                <LogIn className="w-5 h-5 text-stone-950 shrink-0" />
                <span className="tracking-wide">Platform Login</span>
                <ArrowRight className="w-5 h-5 text-stone-950 shrink-0 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* 3 Trust Points Row as Glassmorphic Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.09] backdrop-blur-md text-stone-200 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Fast Delivery</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.09] backdrop-blur-md text-stone-200 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Affordable Pricing</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.09] backdrop-blur-md text-stone-200 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>No Technical Skills Needed</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase Characters Cutout (5.5 Cols on xl) */}
          <div className="lg:col-span-6 xl:col-span-5 relative flex justify-center items-center py-4 lg:py-0">
            {/* Ambient Warm Glow behind Characters */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/25 via-amber-500/15 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Character Illustration */}
            <div className="relative w-full flex items-center justify-center transition-transform hover:scale-[1.02] duration-500">
              <img
                src="/brand/hero-characters-transparent.png"
                alt="SwaadSevak Restaurant Team & Characters"
                className="w-full max-h-[300px] sm:max-h-[420px] xl:max-h-[480px] 2xl:max-h-[540px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
              />
            </div>
          </div>

        </div>

        {/* Bottom 5-Card Feature Bar Across Full Width */}
        <div className="mt-4 pt-3 border-t border-walnut/50">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-md"
            style={{ backgroundColor: 'rgba(43, 26, 18, 0.85)', border: '1px solid rgba(242, 92, 5, 0.2)' }}
          >
            {/* Card 1 */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-white/[0.06] transition-all border border-transparent hover:border-orange-500/20">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/25 shadow-inner">
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">Custom Website</h4>
                <p className="text-[10.5px] sm:text-[11px] text-stone-300 font-medium truncate">Modern &amp; Mobile</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-white/[0.06] transition-all border border-transparent hover:border-orange-500/20">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/25 shadow-inner">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">Digital Menu</h4>
                <p className="text-[10.5px] sm:text-[11px] text-stone-300 font-medium truncate">Instant QR Ordering</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-white/[0.06] transition-all border border-transparent hover:border-orange-500/20">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/25 shadow-inner">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">Online Orders</h4>
                <p className="text-[10.5px] sm:text-[11px] text-stone-300 font-medium truncate">Swiggy &amp; Zomato</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-white/[0.06] transition-all border border-transparent hover:border-orange-500/20">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/25 shadow-inner">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">Table Booking</h4>
                <p className="text-[10.5px] sm:text-[11px] text-stone-300 font-medium truncate">Instant Reservation</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-white/[0.06] transition-all border border-transparent hover:border-orange-500/20">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/25 shadow-inner">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">More Revenue</h4>
                <p className="text-[10.5px] sm:text-[11px] text-stone-300 font-medium truncate">Grow Your Business</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

