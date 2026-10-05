import React from 'react';
import { UpdateIllustration } from '../illustrations/UpdateIllustration';
import { PricingIllustration } from '../illustrations/PricingIllustration';
import { SimpleLearnIllustration } from '../illustrations/SimpleLearnIllustration';
import { SupportAgentIllustration } from '../illustrations/SupportAgentIllustration';
import { CheckCircle2 } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  return (
    <section
      id="why-us"
      className="py-12 sm:py-16 font-sans border-b border-walnut/40 relative overflow-hidden"
      style={{ backgroundColor: '#2B1A12', color: '#FFFFFF' }}
    >
      {/* Background glow & subtle patterns */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-soft mb-3"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FAF4ED' }}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Why SwaadSevak</span>
          </div>
          <h2 className="h2-fluid font-extrabold tracking-tight mb-3" style={{ color: '#FFFFFF' }}>
            Built for the Reality of Indian Restaurant Rush Hours
          </h2>
          <p className="text-sm sm:text-base leading-relaxed font-medium" style={{ color: '#F5E9DD' }}>
            No proprietary hardware locks, no hidden maintenance fees, and no complicated menus. Just dependable software that runs smoothly through your busiest shifts.
          </p>
        </div>

        {/* 4-Card Asymmetric Grid: 2+1 / 1+2 Layout (Wide, Narrow, Narrow, Wide) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
          
          {/* Card 1: Continuous Updates (Wide: 7 cols) */}
          <div
            className="md:col-span-7 rounded-card-lg p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-card hover:shadow-elevated group"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FFFFFF' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-5">
              <div className="max-w-md">
                <span className="text-[11px] uppercase font-mono font-extrabold tracking-wider block mb-1" style={{ color: '#FB923C' }}>
                  01 • Real-Time Cloud Engine
                </span>
                <h3 className="text-lg sm:text-xl font-bold mb-1.5" style={{ color: '#FFFFFF' }}>
                  Continuous Cloud Updates &amp; Instant Sync
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed font-normal" style={{ color: '#F5E9DD' }}>
                  Automatic feature rollouts with zero downtime. Multi-terminal sync keeps your cash counters, captain tablets, and kitchen displays seamlessly synchronized in real-time.
                </p>
              </div>
              <div className="w-full sm:w-auto shrink-0 flex justify-center">
                <UpdateIllustration className="w-36 h-auto" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium pt-3.5" style={{ borderTop: '1px solid #5A3A28', color: '#FAF4ED' }}>
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>Instant real-time multi-device cloud synchronization</span>
            </div>
          </div>

          {/* Card 2: Transparent Pricing (Narrow: 5 cols) */}
          <div
            className="md:col-span-5 rounded-card-lg p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-card hover:shadow-elevated group"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FFFFFF' }}
          >
            <div>
              <span className="text-[11px] uppercase font-mono font-extrabold tracking-wider block mb-1" style={{ color: '#FB923C' }}>
                02 • Honest Numbers
              </span>
              <h3 className="text-lg sm:text-xl font-bold mb-1.5" style={{ color: '#FFFFFF' }}>
                Transparent Pricing
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed font-normal mb-3" style={{ color: '#F5E9DD' }}>
                Zero setup fees, zero annual maintenance contracts (AMC), and no lock-in. Pay month-to-month or save 20% on annual plans.
              </p>
            </div>
            <div className="flex justify-center my-1.5">
              <PricingIllustration className="w-32 h-auto" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium pt-3.5" style={{ borderTop: '1px solid #5A3A28', color: '#FAF4ED' }}>
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>No proprietary hardware fees</span>
            </div>
          </div>

          {/* Card 3: Simple to Learn (Narrow: 5 cols) */}
          <div
            className="md:col-span-5 rounded-card-lg p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-card hover:shadow-elevated group"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FFFFFF' }}
          >
            <div>
              <span className="text-[11px] uppercase font-mono font-extrabold tracking-wider block mb-1" style={{ color: '#FB923C' }}>
                03 • 15-Minute Onboarding
              </span>
              <h3 className="text-lg sm:text-xl font-bold mb-1.5" style={{ color: '#FFFFFF' }}>
                Simple to Learn
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed font-normal mb-3" style={{ color: '#F5E9DD' }}>
                Designed for high staff turnover. Cashiers and captains learn the 3-touch billing system in under 15 minutes with our interactive walkthrough simulator.
              </p>
            </div>
            <div className="flex justify-center my-1.5">
              <SimpleLearnIllustration className="w-32 h-auto" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium pt-3.5" style={{ borderTop: '1px solid #5A3A28', color: '#FAF4ED' }}>
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>Zero technical training required for new waiters</span>
            </div>
          </div>

          {/* Card 4: Support that Responds (Wide: 7 cols) */}
          <div
            className="md:col-span-7 rounded-card-lg p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-card hover:shadow-elevated group"
            style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FFFFFF' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-5">
              <div className="max-w-md">
                <span className="text-[11px] uppercase font-mono font-extrabold tracking-wider block mb-1" style={{ color: '#FB923C' }}>
                  04 • Dedicated Helpdesk
                </span>
                <h3 className="text-lg sm:text-xl font-bold mb-1.5" style={{ color: '#FFFFFF' }}>
                  Support that Actually Responds
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed font-normal" style={{ color: '#F5E9DD' }}>
                  Direct WhatsApp bridge and phone support with under 5-minute response times during peak lunch and dinner hours. No ticketing bots or endless queues.
                </p>
              </div>
              <div className="w-full sm:w-auto shrink-0 flex justify-center">
                <SupportAgentIllustration className="w-36 h-auto" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium pt-3.5" style={{ borderTop: '1px solid #5A3A28', color: '#FAF4ED' }}>
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>7 days a week live engineer support</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
