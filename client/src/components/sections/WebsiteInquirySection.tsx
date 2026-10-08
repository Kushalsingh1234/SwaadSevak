import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { formatINR } from '../../lib/utils';
import { trackEvent } from '../../lib/analytics';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Globe,
  Coins,
  Smartphone,
  MapPin,
  Sparkles,
  ShieldCheck,
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
      style={{ backgroundColor: '#23150F', color: '#FFFFFF' }}
    >
      {/* Ambient Lighting & Luxury Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-500/15 rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[250px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-0" />

      {/* Subtle Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Promo Card */}
        <div className="bg-gradient-to-b from-[#2F1B12]/95 to-[#1F120B]/95 border border-orange-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Content Area */}
            <div className="space-y-4 max-w-xl text-left">
              
              {/* Badge: 24h SLA */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>Get response in 24 hrs</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-4xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Need a Website for Your Restaurant?{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500">
                  Zero Commission.
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                Launch your branded online ordering portal with 1-tap WhatsApp checkout. Keep 100% of your profits on direct orders from repeat neighbourhood diners.
              </p>

              {/* 4 Key Highlight Points */}
              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs font-semibold text-stone-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>0% Commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>WhatsApp 1-Tap Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Custom Domain &amp; SEO</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Direct POS &amp; KDS Sync</span>
                </div>
              </div>

              {/* Trust Guarantee Note */}
              <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Tailored proposal, mockup preview &amp; exact quote sent within 24 hours.</span>
              </div>
            </div>

            {/* Right Action & Pricing Box */}
            <div className="w-full lg:w-auto bg-[#1A0F0A]/80 border border-[#3D2519] rounded-2xl p-6 text-center space-y-4 shrink-0 shadow-lg min-w-[260px] sm:min-w-[280px]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-orange-400 tracking-wider block">
                  Complete Setup
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">
                  {formatINR(SITE_CONTENT.websiteConfigurator.startingPrice)}
                </div>
                <span className="text-[11px] text-stone-400 font-medium block mt-0.5">
                  One-time all-inclusive setup
                </span>
              </div>

              <div className="border-t border-[#3D2519] pt-3">
                <a
                  href="#website-inquiry"
                  onClick={handleGetItNow}
                  className="btn-shine w-full py-3.5 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-stone-950 shadow-[0_0_25px_rgba(242,92,5,0.4)] hover:shadow-[0_0_35px_rgba(242,92,5,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get It Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <p className="text-[10px] text-stone-400 font-medium">
                ⚡ 24h guaranteed proposal reply
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
