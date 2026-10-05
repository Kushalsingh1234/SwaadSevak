import React from 'react';

export const TableViewMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-[1100px] mx-auto text-left font-sans select-none">
      {/* Clean Device Hardware Showcase matching Reference */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-sand-200 bg-white">
        <img
          src="/brand/real-ipad-pos.jpg"
          alt="SwaadSevak POS Table View Device & Mobile Ordering Showcase"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};
