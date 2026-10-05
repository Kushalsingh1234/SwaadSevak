import React, { useState } from 'react';
import { SITE_CONTENT } from '../../content/site';
import { Quote, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = SITE_CONTENT.testimonials;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    trackEvent('testimonial_carousel_prev');
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    trackEvent('testimonial_carousel_next');
  };

  return (
    <section id="testimonials" className="py-12 sm:py-16 font-sans bg-orange-500 text-espresso relative overflow-hidden">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Section Header: Heading Left, Carousel Arrows Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-espresso text-white text-xs font-bold shadow-soft mb-2.5">
              <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
              <span>Operator Feedback</span>
            </div>
            <h2 className="h2-fluid font-extrabold text-espresso-950 tracking-tight mb-1.5">
              Feedback from Busy Indian Kitchens
            </h2>
            <p className="text-xs sm:text-sm text-espresso font-semibold leading-relaxed">
              Real operational feedback from high-volume cafes, biryani houses, and cloud kitchens.
            </p>
          </div>

          {/* Carousel Arrows on the Right */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-white text-espresso hover:bg-cream shadow-soft transition-colors focus-ring cursor-pointer"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-white text-espresso hover:bg-cream shadow-soft transition-colors focus-ring cursor-pointer"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* 3 Visible Cards Inside (White Background) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-orange-600/20 shadow-card flex flex-col justify-between hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                <Quote className="w-5 h-5 text-orange-500 mb-3" />
                <p className="text-xs sm:text-sm text-bodyText leading-relaxed italic mb-5 font-medium">
                  "{test.quote}"
                </p>
              </div>

              <div className="pt-3.5 border-t border-sand-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* Avatar Circle with Initials */}
                  <div className="w-8.5 h-8.5 rounded-full bg-sand-100 text-espresso font-extrabold text-xs flex items-center justify-center shrink-0">
                    {test.author[0]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-espresso">
                      {test.author}
                    </h4>
                    <span className="text-[11px] text-bodyMuted block font-medium">
                      {test.role} • {test.outletName}
                    </span>
                    <span className="text-[9px] text-bodyMuted font-mono font-medium">{test.location}</span>
                  </div>
                </div>

                {test.isPlaceholder && (
                  <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-sand-100 text-espresso font-bold">
                    TODO: PLACEHOLDER
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
