import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { ArrowRight, MessageSquare, ChevronDown, Zap, QrCode, ShoppingBag, Globe } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-[calc(100vh-73px)] flex flex-col justify-between items-center text-center font-sans overflow-hidden px-4 sm:px-6 pt-8 sm:pt-14 pb-6"
      style={{ backgroundColor: '#2B1A12', color: '#FFFFFF' }}
    >
      {/* Dynamic Ambient Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[650px] bg-orange-500/25 rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none -z-0" />
      
      {/* High-Visibility Warm Sand Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.28) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Big Content Container */}
      <div className="max-w-5xl mx-auto relative z-10 flex-1 flex flex-col justify-center items-center py-4">
        
        {/* Top Pill Label */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-soft mb-8 transition-transform hover:scale-105 cursor-default"
          style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FAF4ED' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="tracking-wide">Restaurant POS &amp; Management Platform</span>
          <span style={{ color: '#D5BEAA' }}>•</span>
          <span className="font-mono font-extrabold" style={{ color: '#FB923C' }}>Indian Context (GST &amp; UPI)</span>
        </div>

        {/* Big Impactful Headline */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-tight leading-[1.08] mb-6 max-w-5xl mx-auto"
          style={{ color: '#FFFFFF' }}
        >
          Billing, orders and stock for your restaurant.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 block sm:inline">
            One calm screen.
          </span>
        </h1>

        {/* Large Readable Subtitle */}
        <p
          className="text-base sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10 font-medium"
          style={{ color: '#F5E9DD' }}
        >
          Everything an Indian restaurant owner needs: 3-click POS billing, instant thermal KOT, aggregator sync, automated recipe inventory, and rapid restaurant website advisory.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto mb-12">
          <a
            href={SITE_CONTENT.links.demo}
            data-event="hero_primary_demo_click"
            onClick={() => trackEvent('hero_primary_demo_click')}
            className="btn-shine inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl font-black text-base sm:text-lg transition-all duration-200 shadow-glow-orange focus-ring w-full sm:w-auto cursor-pointer hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#F97316', color: '#1A0F0A' }}
          >
            <span>Book a 10-Minute Demo</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          <a
            href={SITE_CONTENT.links.websiteInquiry}
            data-event="hero_secondary_website_click"
            onClick={() => trackEvent('hero_secondary_website_click')}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base sm:text-lg transition-all focus-ring group cursor-pointer hover:bg-white/5 border border-sand-100/20 w-full sm:w-auto hover:border-orange-500/50"
            style={{ color: '#FAF4ED', backgroundColor: '#3D2519' }}
          >
            <MessageSquare className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>Get a Website Quote</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* 4 Pillars Feature Badges filling lower hero area */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl">
          <div
            className="p-3.5 rounded-2xl text-left flex items-center gap-3 shadow-card border border-walnut/70 transition-all hover:-translate-y-1"
            style={{ backgroundColor: '#3D2519' }}
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-white block">3-Click Billing</span>
              <span className="text-[11px] font-medium" style={{ color: '#F5E9DD' }}>Fast Counter POS</span>
            </div>
          </div>

          <div
            className="p-3.5 rounded-2xl text-left flex items-center gap-3 shadow-card border border-walnut/70 transition-all hover:-translate-y-1"
            style={{ backgroundColor: '#3D2519' }}
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-white block">Dynamic UPI QR</span>
              <span className="text-[11px] font-medium" style={{ color: '#F5E9DD' }}>Instant Settlement</span>
            </div>
          </div>

          <div
            className="p-3.5 rounded-2xl text-left flex items-center gap-3 shadow-card border border-walnut/70 transition-all hover:-translate-y-1"
            style={{ backgroundColor: '#3D2519' }}
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-white block">Zomato / Swiggy</span>
              <span className="text-[11px] font-medium" style={{ color: '#F5E9DD' }}>Auto-Accept Hub</span>
            </div>
          </div>

          <div
            className="p-3.5 rounded-2xl text-left flex items-center gap-3 shadow-card border border-walnut/70 transition-all hover:-translate-y-1"
            style={{ backgroundColor: '#3D2519' }}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-white block">24h Website Quote</span>
              <span className="text-[11px] font-medium" style={{ color: '#F5E9DD' }}>0% Commission Menu</span>
            </div>
          </div>
        </div>

      </div>

      {/* Subtle Scroll Down Prompt at the bottom */}
      <div className="relative z-10 pt-4 pb-1">
        <a
          href="#products"
          aria-label="Scroll to explore features"
          className="inline-flex flex-col items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-sand-100/70 hover:text-orange-400 transition-colors group cursor-pointer"
        >
          <span className="font-bold tracking-widest text-[10px]">EXPLORE PRODUCTS &amp; DEMO</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-orange-400 group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
};
