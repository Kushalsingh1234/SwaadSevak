import React from 'react';

export const TeamIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[340px]' }) => {
  return (
    <svg viewBox="0 0 380 280" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Warm Background Soft Circle */}
      <circle cx="190" cy="140" r="120" fill="#FFF8F1" stroke="#F5E9DD" strokeWidth="3" />
      
      {/* Chef on Left */}
      <g transform="translate(40, 20)">
        {/* Chef Hat */}
        <path d="M70 60C70 42 82 32 95 32C108 32 120 42 120 60H70Z" fill="#FFF8F1" stroke="#5A3A28" strokeWidth="2" />
        <rect x="74" y="58" width="42" height="8" rx="2" fill="#F97316" />
        <circle cx="95" cy="80" r="18" fill="#F5E9DD" stroke="#3D2519" strokeWidth="1.5" />
        <path d="M65 170V120C65 105 78 95 95 95C112 95 125 105 125 120V170H65Z" fill="#2B1A12" />
        <path d="M75 110H115V170H75V110Z" fill="#3D2519" />
        {/* KOT in hand */}
        <rect x="115" y="115" width="28" height="36" rx="4" fill="#FFFFFF" stroke="#5A3A28" strokeWidth="1.5" />
        <line x1="120" y1="124" x2="138" y2="124" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <line x1="120" y1="132" x2="134" y2="132" stroke="#6B5444" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Owner in Center */}
      <g transform="translate(135, 10)">
        <circle cx="55" cy="75" r="22" fill="#F5E9DD" stroke="#3D2519" strokeWidth="2" />
        <path d="M38 68C38 52 46 44 55 44C64 44 72 52 72 68C72 60 62 50 55 50C48 50 38 60 38 68Z" fill="#2B1A12" />
        {/* Blazer & Shirt */}
        <path d="M20 185V120C20 100 35 90 55 90C75 90 90 100 90 120V185H20Z" fill="#2B1A12" />
        <path d="M42 90H68L60 145H50L42 90Z" fill="#FFF8F1" />
        <polygon points="53,98 57,98 55,128" fill="#F97316" />
        {/* Tablet / POS Dashboard */}
        <rect x="30" y="130" width="50" height="34" rx="4" fill="#3D2519" stroke="#F97316" strokeWidth="2" />
        <line x1="36" y1="140" x2="56" y2="140" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="148" x2="68" y2="148" stroke="#FFF8F1" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Staff / Captain on Right */}
      <g transform="translate(225, 25)">
        <circle cx="55" cy="75" r="18" fill="#F5E9DD" stroke="#3D2519" strokeWidth="1.5" />
        <path d="M40 70C40 56 46 48 55 48C64 48 70 56 70 70C70 62 62 54 55 54C48 54 40 62 40 70Z" fill="#2B1A12" />
        <path d="M25 165V115C25 102 38 92 55 92C72 92 85 102 85 115V165H25Z" fill="#3D2519" />
        <path d="M42 92H68V110H42V92Z" fill="#F97316" />
        {/* Smartphone / Fast QR billing */}
        <rect x="15" y="115" width="22" height="34" rx="4" fill="#1F120C" stroke="#F97316" strokeWidth="1.5" />
        <circle cx="26" cy="142" r="2" fill="#16A34A" />
      </g>
    </svg>
  );
};
