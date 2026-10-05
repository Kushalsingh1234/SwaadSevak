import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 text-center font-sans overflow-hidden"
      style={{ backgroundColor: '#2B1A12', color: '#FFFFFF' }}
    >
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#5A3A28_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none -z-0" />

      <div className="max-w-container mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Pill Label */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-soft mb-6"
          style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FAF4ED' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span>Restaurant POS &amp; Management Platform</span>
          <span style={{ color: '#D5BEAA' }}>•</span>
          <span className="font-mono font-extrabold" style={{ color: '#FB923C' }}>Indian Context (GST &amp; UPI)</span>
        </div>

        {/* Centered Large H1 */}
        <h1
          className="h1-fluid max-w-4xl mx-auto font-extrabold tracking-tight mb-6"
          style={{ color: '#FFFFFF' }}
        >
          Billing, orders and stock for your restaurant. One calm screen.
        </h1>

        {/* Short Sub-line in Crisp High-Contrast Sand */}
        <p
          className="text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8 font-medium"
          style={{ color: '#F5E9DD' }}
        >
          Everything an Indian restaurant owner needs: 3-click POS billing, offline KOT, aggregator sync, automated recipe inventory, and rapid restaurant website advisory.
        </p>

        {/* Actions: Primary Orange CTA + Secondary Text Link */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href={SITE_CONTENT.links.demo}
            data-event="hero_primary_demo_click"
            onClick={() => trackEvent('hero_primary_demo_click')}
            className="btn-shine inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-extrabold text-base transition-all duration-200 shadow-glow-orange focus-ring w-full sm:w-auto cursor-pointer"
            style={{ backgroundColor: '#F97316', color: '#1A0F0A' }}
          >
            <span>Book a 10-Minute Demo</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href={SITE_CONTENT.links.websiteInquiry}
            data-event="hero_secondary_website_click"
            onClick={() => trackEvent('hero_secondary_website_click')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-colors focus-ring group cursor-pointer"
            style={{ color: '#FAF4ED' }}
          >
            <MessageSquare className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>Get a Website Quote</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
