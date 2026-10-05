import React from 'react';
import { Phone, CalendarCheck } from 'lucide-react';
import { SITE_CONTENT } from '../../content/site';
import { trackEvent } from '../../lib/analytics';

export const MobileBottomBar: React.FC = () => {
  const handleCall = () => {
    trackEvent('mobile_bar_call_click');
  };

  const handleBook = () => {
    trackEvent('mobile_bar_demo_click');
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-espresso/95 backdrop-blur-md border-t border-walnut p-2.5 px-4 shadow-elevated flex items-center gap-3">
      <a
        href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`}
        onClick={handleCall}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-walnut text-sand-100 font-bold text-xs focus-ring active:bg-cocoa"
      >
        <Phone className="w-3.5 h-3.5 text-orange-400" />
        <span>Call</span>
      </a>

      <a
        href={SITE_CONTENT.links.demo}
        onClick={handleBook}
        className="flex-[2] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-orange-500 text-espresso font-extrabold text-xs shadow-soft focus-ring active:bg-orange-600"
      >
        <CalendarCheck className="w-4 h-4" />
        <span>Book Free Demo</span>
      </a>
    </div>
  );
};
