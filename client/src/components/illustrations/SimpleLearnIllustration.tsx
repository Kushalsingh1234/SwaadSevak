import React from 'react';

export const SimpleLearnIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px]' }) => {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="160" cy="130" r="100" fill="#3D2519" />
      
      {/* 3 Step Interactive Card */}
      <rect x="80" y="65" width="160" height="130" rx="14" fill="#2B1A12" stroke="#5A3A28" strokeWidth="2" />
      
      {/* 15 min timer pill */}
      <rect x="95" y="80" width="70" height="22" rx="11" fill="#F97316" />
      <text x="130" y="95" fill="#2B1A12" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">
        15 MINS
      </text>

      {/* 3 Simple Action Buttons */}
      <rect x="95" y="115" width="38" height="30" rx="6" fill="#3D2519" stroke="#5A3A28" strokeWidth="1.5" />
      <text x="114" y="135" fill="#FFF8F1" fontSize="14" fontWeight="700" textAnchor="middle">1</text>

      <rect x="141" y="115" width="38" height="30" rx="6" fill="#3D2519" stroke="#5A3A28" strokeWidth="1.5" />
      <text x="160" y="135" fill="#FFF8F1" fontSize="14" fontWeight="700" textAnchor="middle">2</text>

      <rect x="187" y="115" width="38" height="30" rx="6" fill="#F97316" />
      <text x="206" y="135" fill="#2B1A12" fontSize="14" fontWeight="800" textAnchor="middle">✓</text>

      {/* Bill Print preview */}
      <rect x="95" y="155" width="130" height="24" rx="4" fill="#FFF8F1" />
      <line x1="105" y1="167" x2="160" y2="167" stroke="#2B1A12" strokeWidth="2" strokeLinecap="round" />
      <line x1="175" y1="167" x2="215" y2="167" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
