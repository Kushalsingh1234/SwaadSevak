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
    <section
      className="py-10 sm:py-12 font-sans overflow-hidden border-y border-walnut/40 relative"
      style={{ backgroundColor: '#1A0F0A' }}
    >
      {/* Subtle Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none -z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 233, 221, 0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 mb-6 text-center relative z-10">
        {/* Uppercase Heading Label */}
        <p className="text-xs sm:text-sm uppercase tracking-widest font-extrabold text-sand-100 flex items-center justify-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>TRUSTED BY 500+ RESTAURANTS &amp; OUTLETS ACROSS INDIA</span>
        </p>
      </div>

      {/* Infinite Logo Marquee (Moving Right to Left) */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left & Right gradient fade masks matching page background */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#1A0F0A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#1A0F0A] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-4 sm:gap-6 shrink-0 items-center py-2">
          {[...PLACEHOLDER_LOGOS, ...PLACEHOLDER_LOGOS, ...PLACEHOLDER_LOGOS].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-3.5 px-5 py-3 rounded-2xl shadow-card shrink-0 hover:border-orange-500 hover:scale-[1.02] transition-all cursor-pointer"
              style={{
                backgroundColor: '#2B1A12',
                border: '1px solid #4A2D1F',
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-black text-sm shrink-0 border border-orange-500/20 shadow-inner">
                {item.name[0]}
              </div>
              <div className="text-left">
                <span className="font-extrabold text-xs sm:text-sm text-white block whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[11px] text-sand-100 font-medium block whitespace-nowrap mt-0.5">
                  {item.type} • <span className="text-orange-400/90">{item.city}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
