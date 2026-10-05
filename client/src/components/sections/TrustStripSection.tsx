import React from 'react';

const PLACEHOLDER_LOGOS = [
  { name: 'Kaveri Tiffins', type: 'South Indian', city: 'Bengaluru', id: 'logo-1' },
  { name: 'Chai & Co.', type: 'Artisanal Cafe', city: 'Pune', id: 'logo-2' },
  { name: 'The Dum Biryani Box', type: 'Cloud Kitchen', city: 'Hyderabad', id: 'logo-3' },
  { name: 'Delhi Sweets & Chaat', type: 'Mithai & QSR', city: 'Delhi NCR', id: 'logo-4' },
  { name: 'Bakehouse 9', type: 'European Bakery', city: 'Mumbai', id: 'logo-5' },
  { name: 'Rasoi Express', type: 'Thali & Quick Dine', city: 'Jaipur', id: 'logo-6' },
  { name: 'Tandoor Nights', type: 'Fine Dine & Bar', city: 'Chandigarh', id: 'logo-7' },
  { name: 'Dosa Plaza Hub', type: 'Fast Food Chain', city: 'Chennai', id: 'logo-8' },
];

export const TrustStripSection: React.FC = () => {
  return (
    <section className="py-12 bg-cream border-b border-sand-200 font-sans overflow-hidden">
      <div className="max-w-container mx-auto px-4 sm:px-6 mb-6 text-center">
        {/* Uppercase Small Label */}
        <p className="text-xs uppercase tracking-widest font-bold text-bodyText">
          TRUSTED BY 500+ RESTAURANTS &amp; OUTLETS ACROSS INDIA
          <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-sand-200 text-espresso font-semibold">
            TODO: PLACEHOLDER PARTNERS
          </span>
        </p>
      </div>

      {/* Infinite Logo Marquee (Marked Placeholders) */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left & Right subtle gradient mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-6 sm:gap-8 shrink-0 items-center">
          {[...PLACEHOLDER_LOGOS, ...PLACEHOLDER_LOGOS].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-sand-200 shadow-soft shrink-0 hover:border-orange-500 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-sand-100 flex items-center justify-center font-extrabold text-sm text-espresso">
                {item.name[0]}
              </div>
              <div className="text-left">
                <span className="font-bold text-xs text-espresso block whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[10px] text-bodyText block whitespace-nowrap">
                  {item.type} • {item.city}
                </span>
              </div>
              <span className="text-[9px] font-mono text-sand-300 ml-1 uppercase">
                TODO
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
