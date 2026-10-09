import React from 'react';
import { trackEvent } from '../../lib/analytics';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Globe,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface WebsiteInquirySectionProps {
  onOpenWebsiteService?: () => void;
}

export const WebsiteInquirySection: React.FC<WebsiteInquirySectionProps> = ({
  onOpenWebsiteService,
}) => {
  const handleGetItNow = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent('website_promo_get_it_now_click');
    if (onOpenWebsiteService) {
      onOpenWebsiteService();
    } else {
      window.location.hash = 'website-inquiry';
    }
  };

  return (
    <section
      id="website-inquiry"
      className="py-12 sm:py-16 font-sans border-b border-[#3D2519] relative overflow-hidden text-left"
      style={{ backgroundColor: '#1A0F0A', color: '#FFFFFF' }}
    >
      {/* Ambient Lighting & Luxury Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-orange-500/15 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      {/* Subtle Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Single Big Unified Showcase Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2E1A11]/95 via-[#24150D]/95 to-[#190E08]/95 border border-orange-500/30 rounded-3xl p-7 sm:p-12 lg:p-14 shadow-2xl backdrop-blur-md">
          
          {/* Subtle Ambient Radial Highlight on Card */}
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Content Column */}
            <div className="space-y-4 sm:space-y-5 text-left flex-1 max-w-2xl">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-bold shadow-sm">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Get response in 24 hrs</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-4xl lg:text-[2.6rem] font-black tracking-tight text-white leading-[1.15]">
                Need a Website for Your Restaurant?{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 inline-block drop-shadow-[0_2px_12px_rgba(242,92,5,0.35)]">
                  Zero Commission.
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed font-normal">
                Launch your branded online ordering portal with 1-tap WhatsApp checkout. Keep 100% of your profits on direct orders from repeat neighbourhood diners.
              </p>

              {/* 4 Key Highlight Glass Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm font-semibold text-stone-200">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>0% Commission Direct Orders</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>WhatsApp 1-Tap Checkout</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Custom Domain &amp; Google SEO</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Direct POS &amp; Kitchen Sync</span>
                </div>
              </div>

              {/* Notice */}
              <div className="pt-2 flex items-center gap-2 text-xs text-stone-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Tailored proposal, mockup preview &amp; exact quote sent within 24 hours.</span>
              </div>
            </div>

            {/* Right Call To Action Area */}
            <div className="w-full lg:w-auto flex flex-col items-center lg:items-end justify-center gap-3 shrink-0">
              <a
                href="#website-inquiry"
                onClick={handleGetItNow}
                className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-11 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-[0_0_35px_rgba(242,92,5,0.45)] hover:shadow-[0_0_50px_rgba(242,92,5,0.7)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
              >
                <Zap className="w-5 h-5 text-stone-950 fill-stone-950 shrink-0" />
                <span className="tracking-wide">Get It Now</span>
                <ArrowRight className="w-5 h-5 text-stone-950 shrink-0 transition-transform group-hover:translate-x-1.5" />
              </a>

              <p className="text-xs text-stone-400 font-semibold flex items-center gap-1.5 text-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>24h guaranteed proposal reply</span>
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
