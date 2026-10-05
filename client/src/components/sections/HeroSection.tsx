import React from 'react';
import { useTranslation } from '../../i18n';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SITE_CONTENT } from '../../content/site';
import { LiveOrderFeedMockup } from '../mockups/LiveOrderFeedMockup';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden font-sans bg-cream-50/50 dark:bg-ink-950">
      {/* Warm Technical Grid Background & Warm Ember-to-Brown Ambient Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[450px] bg-gradient-ink-hero blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Copy (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-ember-100/80 dark:bg-ember-950/80 border border-ember-300 dark:border-ember-800 text-xs font-semibold text-ember-800 dark:text-ember-300 shadow-soft">
                <span className="w-2 h-2 rounded-full bg-ember-500 animate-pulse" />
                {t.hero.badge}
              </span>
              <span className="text-xs font-mono text-brown-600 dark:text-brown-400 font-semibold hidden sm:inline">
                GST & UPI Ready
              </span>
            </div>

            {/* Main H1 Title */}
            <h1 className="h1-fluid font-bold text-ink-950 dark:text-ink-50 tracking-tight">
              {t.hero.title}
            </h1>

            {/* Sub-line */}
            <p className="text-base sm:text-lg text-ink-600 dark:text-ink-300 leading-relaxed max-w-xl font-normal">
              {t.hero.subtitle}
            </p>

            {/* Direct CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a href={SITE_CONTENT.links.demo}>
                <Button
                  variant="ember"
                  size="lg"
                  fullWidth
                  analyticsEvent="demo_cta_click"
                  eventPayload={{ location: 'hero_primary' }}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  {t.hero.ctaPrimary}
                </Button>
              </a>

              <a href={SITE_CONTENT.links.websiteInquiry}>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  analyticsEvent="demo_cta_click"
                  eventPayload={{ location: 'hero_secondary_website' }}
                  icon={<MessageSquare className="w-4 h-4 text-ember-500" />}
                >
                  {t.hero.ctaSecondary}
                </Button>
              </a>
            </div>

            {/* Clean Trust Micro-Points */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-ink-500 dark:text-ink-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success-600 dark:text-success-400 shrink-0" />
                <span>Zero proprietary hardware lock-in</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success-600 dark:text-success-400 shrink-0" />
                <span>Works 100% offline without broadband</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success-600 dark:text-success-400 shrink-0" />
                <span>Free menu migration support</span>
              </span>
            </div>
          </div>

          {/* Right Live Order Feed Mockup (5 Cols) */}
          <div className="lg:col-span-5 relative">
            {/* Soft background glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-ember-500/15 via-indigo-500/10 to-transparent rounded-3xl blur-xl -z-10" />
            <LiveOrderFeedMockup />
          </div>

        </div>
      </div>
    </section>
  );
};
