import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, MessageSquare, Star } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

const TESTIMONIALS = [
  {
    id: 'test-1',
    quote: 'The 3-click billing and instant KOT printing kept our weekend rush completely calm. Staff learned it in 15 minutes with zero mistakes.',
    author: 'Vikram Mehta',
    role: 'Founder & Head Chef',
    outletName: 'The Urban Bistro',
    location: 'Koramangala, Bengaluru',
    rating: 5,
  },
  {
    id: 'test-2',
    quote: 'The website advisory team helped us launch our direct WhatsApp ordering setup quickly, saving us significant aggregator cuts from day one.',
    author: 'Sunita Rao',
    role: 'Managing Partner',
    outletName: 'Dakshin Aroma',
    location: 'Jubilee Hills, Hyderabad',
    rating: 5,
  },
  {
    id: 'test-3',
    quote: 'Managing 4 cloud kitchens from one single dashboard has reduced ingredient theft and stock wastage significantly. Best decision for our scale.',
    author: 'Harpreet Singh',
    role: 'Operations Director',
    outletName: 'Amritsar Kulcha Hub',
    location: 'Sector 29, Gurugram',
    rating: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
    trackEvent('testimonial_carousel_prev');
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
    trackEvent('testimonial_carousel_next');
  };

  return (
    <section
      id="testimonials"
      className="py-8 sm:py-12 font-sans relative overflow-hidden"
      style={{ backgroundColor: '#FFF8F1' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header: Heading Left, Carousel Arrows Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div className="max-w-lg text-left">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-espresso shadow-soft mb-2"
              style={{ backgroundColor: '#EFE2D3', border: '1px solid #D8C2AC' }}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
              <span>Operator Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-espresso tracking-tight mb-2">
              Feedback from Busy Indian Kitchens
            </h2>
            <p className="text-xs sm:text-[13px] text-[#5A3A28] leading-relaxed">
              Real operational feedback from high-volume cafes, biryani houses, and cloud kitchens.
            </p>
          </div>

          {/* Carousel Arrows on the Right */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl transition-all cursor-pointer shadow-soft hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:scale-105 active:scale-95 text-espresso"
              style={{ backgroundColor: '#EFE2D3', border: '1px solid #D8C2AC' }}
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl transition-all cursor-pointer shadow-soft hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:scale-105 active:scale-95 text-espresso"
              style={{ backgroundColor: '#EFE2D3', border: '1px solid #D8C2AC' }}
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Visible Luxury Cards on Dark Espresso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 text-left">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="p-4 sm:p-4.5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.6)] group"
              style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28' }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Quote className="w-4 h-4 text-orange-400" />
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] sm:text-[11.5px] text-[#F5E9DD] leading-relaxed italic mb-4 font-normal">
                  "{test.quote}"
                </p>
              </div>

              <div
                className="pt-3 border-t flex items-center justify-between"
                style={{ borderColor: '#5A3A28' }}
              >
                <div className="flex items-center gap-2.5">
                  {/* Avatar Circle with Initials */}
                  <div
                    className="w-7 h-7 rounded-full text-orange-300 font-extrabold text-xs flex items-center justify-center shrink-0 border border-orange-500/30"
                    style={{ backgroundColor: '#2B1A12' }}
                  >
                    {test.author[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">
                      {test.author}
                    </h4>
                    <span className="text-[10px] text-[#F5E9DD]/80 block font-medium">
                      {test.role} • {test.outletName}
                    </span>
                    <span className="text-[9px] text-orange-400 font-mono">{test.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
