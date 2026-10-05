import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { Badge } from '../ui/Badge';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SwitchingSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 font-sans bg-cream-50 dark:bg-maroon-950/40">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="saffron" className="mb-3">
            Zero-Disruption Migration
          </Badge>
          <h2 className="h2-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 mb-3">
            Switching to SwaadSevak takes less than one afternoon
          </h2>
          <p className="text-sm sm:text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
            Never lose an order or pause your dinner service. Our white-glove onboarding team handles the migration from your old software.
          </p>
        </div>

        {/* 3 Steps Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {SITE_CONTENT.switchingSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between text-left relative group hover:border-saffron-500 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-serif font-bold text-3xl text-saffron-600 dark:text-saffron-400">
                    {step.step}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-cream-200 dark:bg-maroon-900 text-maroon-800 dark:text-cream-200">
                    <Clock className="w-3 h-3 text-saffron-600" />
                    <span>{step.duration}</span>
                  </span>
                </div>

                <h3 className="font-bold text-lg text-maroon-950 dark:text-cream-50 mb-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-maroon-900/70 dark:text-cream-200/70 leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-dashed border-receipt-divider dark:border-maroon-800 flex items-center gap-2 text-xs font-semibold text-curry-600 dark:text-curry-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Handled by SwaadSevak Team</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
