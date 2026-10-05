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
      className="py-6 sm:py-7 font-sans overflow-hidden relative"
      style={{ backgroundColor: '#2B1A12' }}
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 mb-4 text-center relative z-10">
        {/* Uppercase Heading Label */}
        <p className="text-[11px] sm:text-xs uppercase tracking-widest font-extrabold text-sand-100 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span>TRUSTED BY 500+ RESTAURANTS &amp; OUTLETS ACROSS INDIA</span>
        </p>
      </div>

      {/* Infinite Logo Marquee (Moving Right to Left) */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left & Right gradient fade masks matching #2B1A12 */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 sm:w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #2B1A12 10%, transparent 100%)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 sm:w-28 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #2B1A12 10%, transparent 100%)' }}
        />

        <div className="animate-marquee-left gap-3.5 sm:gap-4.5 items-center py-1.5">
          {[...PLACEHOLDER_LOGOS, ...PLACEHOLDER_LOGOS, ...PLACEHOLDER_LOGOS, ...PLACEHOLDER_LOGOS].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl shadow-card shrink-0 hover:border-orange-500 hover:scale-[1.02] transition-all cursor-pointer"
              style={{
                backgroundColor: '#382015',
                border: '1px solid #5A3A28',
              }}
            >
              <div className="w-7.5 h-7.5 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center font-black text-xs shrink-0 border border-orange-500/20 shadow-inner">
                {item.name[0]}
              </div>
              <div className="text-left">
                <span className="font-extrabold text-xs text-white block whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[10px] text-sand-100 font-medium block whitespace-nowrap mt-0.5">
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
