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
      className="relative min-h-[calc(100vh-73px)] flex flex-col justify-between font-sans overflow-hidden px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 text-left"
      style={{ backgroundColor: '#1A0F0A', color: '#FFFFFF' }}
    >
      {/* Ambient Lighting & Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-orange-500/20 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[500px] bg-orange-600/15 rounded-full blur-[140px] pointer-events-none -z-0" />
      
      {/* High-Visibility Warm Sand Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.22) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col justify-center">
        
        {/* 2-Column Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center py-4 sm:py-8">
          
          {/* Left Column: Copy & Actions (6 Cols) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Top Pill Label */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-soft mb-2"
              style={{ backgroundColor: '#2B1A12', border: '1px solid #5A3A28', color: '#FAF4ED' }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <span>Restaurant Website Services</span>
              <span style={{ color: '#D5BEAA' }}>•</span>
              <span className="font-mono font-extrabold text-orange-400">Built for Indian Restaurants</span>
            </div>

            {/* Big Bold Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-black tracking-tight leading-[1.08]"
              style={{ color: '#FFFFFF' }}
            >
              We Build Stunning{' '}
              <span className="text-orange-500 inline-block">Websites</span>{' '}
              for Cafes &amp; Restaurants
            </h1>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg lg:text-xl leading-relaxed font-normal max-w-xl"
              style={{ color: '#F5E9DD' }}
            >
              Get a modern, mobile-friendly website for your restaurant with online ordering, menu, table booking and more — so you can focus on what you do best, great food.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href={SITE_CONTENT.links.websiteInquiry}
                data-event="hero_get_website_click"
                onClick={() => trackEvent('hero_get_website_click')}
                className="btn-shine inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-extrabold text-base bg-orange-500 text-espresso shadow-glow-orange hover:bg-orange-600 transition-all cursor-pointer"
                style={{ color: '#1A0F0A' }}
              >
                <span>Get Your Website Now</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href={SITE_CONTENT.links.demo}
                data-event="hero_see_how_it_works_click"
                onClick={() => trackEvent('hero_see_how_it_works_click')}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-base transition-all border border-walnut hover:border-orange-500 hover:bg-cocoa cursor-pointer"
                style={{ backgroundColor: '#2B1A12', color: '#FFFFFF' }}
              >
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>See How It Works</span>
              </a>
            </div>

            {/* 3 Trust Points Row */}
            <div className="pt-3 flex flex-wrap items-center gap-5 sm:gap-7 text-xs font-semibold" style={{ color: '#FAF4ED' }}>
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

          {/* Right Column: Visual Showcase Illustration (6 Cols) */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full overflow-hidden rounded-2xl flex items-center justify-center">
              <img
                src="/brand/hero-showcase.jpg"
                alt="SwaadSevak Restaurant Team Illustration"
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          </div>

        </div>

        {/* Bottom 5-Card Feature Bar Across Full Width */}
        <div className="mt-8 pt-4 border-t border-walnut/60">
          <div
            className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 sm:p-4 rounded-2xl shadow-card"
            style={{ backgroundColor: '#2B1A12', border: '1px solid #3D2519' }}
          >
            {/* Card 1 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cocoa/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">Custom Website Design</h4>
                <p className="text-[11px] text-sand-100 font-medium">Modern &amp; Mobile Friendly</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cocoa/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">Digital Menu</h4>
                <p className="text-[11px] text-sand-100 font-medium">Beautiful Menu Showcase</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cocoa/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">Online Ordering</h4>
                <p className="text-[11px] text-sand-100 font-medium">Swiggy / Zomato Integration</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cocoa/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-white">Table Booking</h4>
                <p className="text-[11px] text-sand-100 font-medium">Let Customers Reserve</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="col-span-2 md:col-span-1 flex items-center gap-3 p-2.5 rounded-xl hover:bg-cocoa/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
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
