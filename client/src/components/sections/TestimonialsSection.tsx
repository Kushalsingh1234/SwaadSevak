import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { Badge } from '../ui/Badge';
import { ReceiptCard } from '../ui/ReceiptCard';
import { Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 font-sans bg-cream-50 dark:bg-maroon-950/30">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="maroon" className="mb-3">
            Kitchen Stories
          </Badge>
          <h2 className="h2-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 mb-3">
            What restaurant operators tell us
          </h2>
          <p className="text-sm sm:text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
            Stories from high-volume Indian kitchens, bistros, and multi-brand cloud kitchens.
          </p>
        </div>

        {/* 3 Receipt-style Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SITE_CONTENT.testimonials.map((test) => (
            <ReceiptCard
              key={test.id}
              sawtooth="bottom"
              ticketNumber={test.ticketNumber}
              ticketTime={test.date}
              ticketType="FEEDBACK KOT"
              className="p-6 border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between text-left"
            >
              <div>
                <Quote className="w-6 h-6 text-saffron-500/60 mb-3" />
                <p className="text-xs sm:text-sm text-maroon-900/90 dark:text-cream-100 leading-relaxed italic mb-6">
                  "{test.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-dashed border-receipt-divider dark:border-maroon-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-maroon-950 dark:text-cream-50">
                    {test.author}
                  </h4>
                  <span className="text-[11px] text-maroon-700/70 dark:text-cream-300/70 block">
                    {test.role}, {test.outletName}
                  </span>
                  <span className="text-[10px] text-receipt-faint font-mono">{test.location}</span>
                </div>
                {test.isPlaceholder && (
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-cream-200 dark:bg-maroon-900 text-maroon-700/60">
                    TODO: Verified Partner
                  </span>
                )}
              </div>
            </ReceiptCard>
          ))}
        </div>

      </div>
    </section>
  );
};
