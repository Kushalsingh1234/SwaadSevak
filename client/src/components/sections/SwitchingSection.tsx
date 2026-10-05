import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { Badge } from '../ui/Badge';
import { Clock, CheckCircle2 } from 'lucide-react';

export const SwitchingSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 font-sans bg-white dark:bg-ink-950 border-t border-ink-200/80 dark:border-ink-800">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="ember" className="mb-3">
            Fast Migration
          </Badge>
          <h2 className="h2-fluid font-bold text-ink-950 dark:text-ink-50 mb-3">
            Switch to SwaadSevak without pausing dinner service
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            Our onboarding team handles menu formatting, printer configuration, and staff training so you never drop an active table order.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {SITE_CONTENT.switchingSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between hover:border-ink-400 dark:hover:border-ink-600 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono font-bold text-2xl text-ember-600 dark:text-ember-400">
                    {step.step}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200">
                    <Clock className="w-3 h-3 text-ember-500" />
                    <span>{step.duration}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-ink-950 dark:text-ink-50 mb-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-ink-200/80 dark:border-ink-800 flex items-center gap-2 text-xs font-semibold text-success-600 dark:text-success-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Assisted by SwaadSevak Team</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
