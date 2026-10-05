import React from 'react';
import { UpdateIllustration } from '../illustrations/UpdateIllustration';
import { PricingIllustration } from '../illustrations/PricingIllustration';
import { SimpleLearnIllustration } from '../illustrations/SimpleLearnIllustration';
import { SupportAgentIllustration } from '../illustrations/SupportAgentIllustration';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SITE_CONTENT } from '../../content/site';

export const WhyUsSection: React.FC = () => {
  return (
    <section id="why-us" className="py-20 sm:py-28 bg-espresso text-white font-sans border-b border-walnut relative overflow-hidden">
      {/* Background glow & subtle patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cocoa border border-walnut text-xs font-semibold text-sand-100 shadow-soft mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Why SwaadSevak</span>
          </div>
          <h2 className="h2-fluid font-extrabold text-white tracking-tight mb-4">
            Built for the Reality of Indian Restaurant Rush Hours
          </h2>
          <p className="text-base sm:text-lg text-sand-200 leading-relaxed font-normal">
            No proprietary hardware locks, no hidden maintenance fees, and no complicated menus. Just dependable software that runs smoothly through your busiest shifts.
          </p>
        </div>

        {/* 4-Card Asymmetric Grid: 2+1 / 1+2 Layout (Wide, Narrow, Narrow, Wide) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Continuous Updates (Wide: 7 cols) */}
          <div className="md:col-span-7 bg-cocoa border border-walnut rounded-card-lg p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1.5 hover:border-orange-500/50 shadow-card hover:shadow-elevated group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
              <div className="max-w-md">
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-orange-400 block mb-1">
                  01 • Auto Cloud Sync
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Continuous Updates &amp; 100% Offline Resilience
                </h3>
                <p className="text-sm text-sand-200 leading-relaxed">
                  Automatic feature rollouts with zero downtime. Even if broadband dips during a peak dinner rush, cashiers continue billing and KOTs print locally without freezing.
                </p>
              </div>
              <div className="w-full sm:w-auto shrink-0 flex justify-center">
                <UpdateIllustration className="w-44 h-auto" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-sand-300 pt-4 border-t border-walnut/60">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Offline SQLite cache automatically syncs on reconnect</span>
            </div>
          </div>

          {/* Card 2: Transparent Pricing (Narrow: 5 cols) */}
          <div className="md:col-span-5 bg-cocoa border border-walnut rounded-card-lg p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1.5 hover:border-orange-500/50 shadow-card hover:shadow-elevated group">
            <div>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-orange-400 block mb-1">
                02 • Honest Numbers
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Transparent Pricing
              </h3>
              <p className="text-sm text-sand-200 leading-relaxed mb-4">
                Zero setup fees, zero annual maintenance contracts (AMC), and no lock-in. Pay month-to-month or save 20% on annual plans.
              </p>
            </div>
            <div className="flex justify-center my-2">
              <PricingIllustration className="w-40 h-auto" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-sand-300 pt-4 border-t border-walnut/60">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>No proprietary hardware fees</span>
            </div>
          </div>

          {/* Card 3: Simple to Learn (Narrow: 5 cols) */}
          <div className="md:col-span-5 bg-cocoa border border-walnut rounded-card-lg p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1.5 hover:border-orange-500/50 shadow-card hover:shadow-elevated group">
            <div>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-orange-400 block mb-1">
                03 • 15-Minute Onboarding
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Simple to Learn
              </h3>
              <p className="text-sm text-sand-200 leading-relaxed mb-4">
                Designed for high staff turnover. Cashiers and captains learn the 3-touch billing system in under 15 minutes with our interactive walkthrough simulator.
              </p>
            </div>
            <div className="flex justify-center my-2">
              <SimpleLearnIllustration className="w-40 h-auto" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-sand-300 pt-4 border-t border-walnut/60">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Zero technical training required for new waiters</span>
            </div>
          </div>

          {/* Card 4: Support that Responds (Wide: 7 cols) */}
          <div className="md:col-span-7 bg-cocoa border border-walnut rounded-card-lg p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1.5 hover:border-orange-500/50 shadow-card hover:shadow-elevated group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
              <div className="max-w-md">
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-orange-400 block mb-1">
                  04 • Dedicated Helpdesk
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Support that Actually Responds
                </h3>
                <p className="text-sm text-sand-200 leading-relaxed">
                  Direct WhatsApp bridge and phone support with under 5-minute response times during peak lunch and dinner hours. No ticketing bots or endless queues.
                </p>
              </div>
              <div className="w-full sm:w-auto shrink-0 flex justify-center">
                <SupportAgentIllustration className="w-44 h-auto" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-sand-300 pt-4 border-t border-walnut/60">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>7 days a week live engineer support</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
