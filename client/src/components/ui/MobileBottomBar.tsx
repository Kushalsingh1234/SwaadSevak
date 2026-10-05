import React from 'react';
import { Phone, CalendarCheck } from 'lucide-react';
import { SITE_CONTENT } from '../../content/site';
import { trackEvent } from '../../lib/analytics';

export const MobileBottomBar: React.FC = () => {
  const handleCall = () => {
    trackEvent('demo_cta_click', { action: 'mobile_bar_call' });
  };

  const handleBook = () => {
    trackEvent('demo_cta_click', { action: 'mobile_bar_demo' });
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/95 dark:bg-maroon-950/95 backdrop-blur-md border-t border-receipt-divider dark:border-maroon-800 p-2.5 px-4 shadow-lg flex items-center gap-2.5">
      <a
        href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`}
        onClick={handleCall}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-maroon-900/20 dark:border-cream-200/20 text-maroon-900 dark:text-cream-50 font-semibold text-xs focus-ring active:bg-cream-100"
      >
        <Phone className="w-3.5 h-3.5 text-saffron-600 dark:text-saffron-400" />
        <span>Call</span>
      </a>

      <a
        href={SITE_CONTENT.links.demo}
        onClick={handleBook}
        className="flex-[2] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-saffron-500 text-white font-bold text-xs shadow-md focus-ring active:bg-saffron-600"
      >
        <CalendarCheck className="w-4 h-4" />
        <span>Book Free Demo</span>
      </a>
    </div>
  );
};
