import React from 'react';

export const TableViewMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-[1000px] mx-auto text-left font-sans select-none">
      {/* Real iPad Hardware Showcase */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-sand-300 group">
        <img
          src="/brand/real-ipad-pos.jpg"
          alt="Real Apple iPad running SwaadSevak POS at Restaurant Counter"
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
        />

        {/* Floating Real-Time Status Pill Overlay */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-espresso/90 backdrop-blur-md text-white border border-walnut shadow-elevated">
          <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
          <span className="font-extrabold text-xs sm:text-sm">Live SwaadSevak POS</span>
          <span className="text-sand-100 text-[10px] sm:text-xs font-mono hidden sm:inline">• Apple iPad Compatible</span>
        </div>

        {/* Floating Quick Feature Badge */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-orange-500 text-espresso font-black text-xs sm:text-sm shadow-glow-orange">
          <span>⚡ 3-Second Billing &amp; KOT</span>
        </div>
      </div>
    </div>
  );
};
