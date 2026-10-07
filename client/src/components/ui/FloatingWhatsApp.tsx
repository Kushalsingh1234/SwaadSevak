import React from 'react';
import { MessageSquare } from 'lucide-react';
import { SITE_CONTENT } from '../../content/site';
import { trackEvent } from '../../lib/analytics';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = `https://wa.me/${SITE_CONTENT.brand.whatsappNumber}?text=${encodeURIComponent(
    'Namaste! I would like to learn more about SwaadSevak for my restaurant.'
  )}`;

  const handleClick = () => {
    trackEvent('whatsapp_click', { origin: 'floating_button' });
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Chat with SwaadSevak on WhatsApp"
      className="fixed bottom-20 sm:bottom-6 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus-ring group select-none"
    >
      <div className="relative flex items-center justify-center">
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
      </div>
      <span className="hidden sm:inline font-sans text-xs font-bold tracking-wide">
        WhatsApp Us
      </span>
    </a>
  );
};
