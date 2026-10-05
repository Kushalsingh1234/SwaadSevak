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
    <section className="py-20 sm:py-28 font-sans bg-white text-espresso border-b border-sand-200">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Section Header: Heading Left, Carousel Arrows Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-100 border border-sand-200 text-xs font-semibold text-espresso shadow-soft mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
              <span>Operator Feedback</span>
            </div>
            <h2 className="h2-fluid font-extrabold text-espresso tracking-tight mb-2">
              Feedback from Busy Indian Kitchens
            </h2>
            <p className="text-sm sm:text-base text-bodyText leading-relaxed">
              Real operational feedback from high-volume cafes, biryani houses, and cloud kitchens.
            </p>
          </div>

          {/* Carousel Arrows on the Right */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl border border-sand-200 bg-sand-50 hover:bg-sand-100 text-espresso transition-colors focus-ring cursor-pointer"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-xl border border-sand-200 bg-sand-50 hover:bg-sand-100 text-espresso transition-colors focus-ring cursor-pointer"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Visible Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {testimonials.map((test, idx) => (
            <div
              key={test.id}
              className="p-6 sm:p-8 rounded-card-lg bg-cream border border-sand-200 shadow-soft flex flex-col justify-between hover:shadow-card transition-all"
            >
              <div>
                <Quote className="w-6 h-6 text-orange-dark mb-4 opacity-80" />
                <p className="text-sm text-bodyText leading-relaxed italic mb-8">
                  "{test.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar Circle with Initials */}
                  <div className="w-10 h-10 rounded-full bg-sand-200 text-espresso font-extrabold text-sm flex items-center justify-center shrink-0">
                    {test.author[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-espresso">
                      {test.author}
                    </h4>
                    <span className="text-xs text-bodyText block">
                      {test.role} • {test.outletName}
                    </span>
                    <span className="text-[10px] text-sand-300 font-mono">{test.location}</span>
                  </div>
                </div>

                {test.isPlaceholder && (
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-sand-200 text-espresso font-semibold">
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
