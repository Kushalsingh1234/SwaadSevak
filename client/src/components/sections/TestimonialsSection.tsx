import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { Badge } from '../ui/Badge';
import { Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 font-sans bg-white dark:bg-ink-950">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="neutral" className="mb-3">
            Customer Feedback
          </Badge>
          <h2 className="h2-fluid font-bold text-ink-950 dark:text-ink-50 mb-3">
            What restaurant operators tell us
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            Feedback from high-volume kitchens, bistros, and multi-brand cloud kitchens.
          </p>
        </div>

        {/* 3 Placeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {SITE_CONTENT.testimonials.map((test) => (
            <div
              key={test.id}
              className="p-6 rounded-3xl bg-ink-50/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between"
            >
              <div>
                <Quote className="w-5 h-5 text-ember-500 mb-3" />
                <p className="text-xs sm:text-sm text-ink-800 dark:text-ink-200 leading-relaxed italic mb-6">
                  "{test.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-ink-200/80 dark:border-ink-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-ink-950 dark:text-ink-50">
                    {test.author}
                  </h4>
                  <span className="text-[11px] text-ink-500 dark:text-ink-400 block">
                    {test.role}, {test.outletName}
                  </span>
                  <span className="text-[10px] text-ink-400 font-mono">{test.location}</span>
                </div>
                {test.isPlaceholder && (
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-500">
                    TODO: Partner
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
