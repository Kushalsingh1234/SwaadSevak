import React from 'react';

export const OwnerIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px]' }) => {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="160" cy="130" r="100" fill="#3D2519" />

      {/* Analytics Chart Screen in background */}
      <rect x="180" y="45" width="105" height="75" rx="8" fill="#2B1A12" stroke="#5A3A28" strokeWidth="2" />
      <path d="M195 100L220 85L245 92L270 65" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="270" cy="65" r="4" fill="#F97316" />

      {/* Owner Figure */}
      <path d="M95 240V165C95 140 115 125 145 125C175 125 195 140 195 165V240H95Z" fill="#F5E9DD" />
      <path d="M120 145L145 185L170 145H120Z" fill="#F97316" />
      <circle cx="145" cy="90" r="26" fill="#F5E9DD" stroke="#2B1A12" strokeWidth="2" />
      <path d="M124 85C124 70 134 60 145 60C156 60 166 70 166 85C166 76 154 66 145 66C136 66 124 76 124 85Z" fill="#2B1A12" />

      {/* Floating Badge */}
      <rect x="55" y="60" width="70" height="28" rx="6" fill="#F97316" />
      <text x="90" y="78" fill="#2B1A12" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        +38% ROI
      </text>
    </svg>
  );
};

export const SupportAgentIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px]' }) => {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="160" cy="130" r="100" fill="#FFF8F1" stroke="#F5E9DD" strokeWidth="3" />

      {/* Agent Figure */}
      <path d="M105 240V165C105 140 125 125 160 125C195 125 215 140 215 165V240H105Z" fill="#2B1A12" />
      <path d="M140 135H180V165H140V135Z" fill="#F97316" />

      {/* Head */}
      <circle cx="160" cy="90" r="26" fill="#F5E9DD" stroke="#2B1A12" strokeWidth="2" />

      {/* Headset */}
      <path d="M136 90C136 72 146 62 160 62C174 62 184 72 184 90" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
      <circle cx="136" cy="92" r="6" fill="#F97316" />
      <circle cx="184" cy="92" r="6" fill="#F97316" />
      <path d="M184 94V105C184 109 178 111 170 111" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="170" cy="111" r="3" fill="#2B1A12" />

      {/* 24/7 Priority Badge */}
      <rect x="210" y="55" width="75" height="30" rx="8" fill="#16A34A" />
      <text x="247" y="74" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        &lt; 5m SLA
      </text>
    </svg>
  );
};

export const OrderNotificationIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px]' }) => {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="160" cy="130" r="100" fill="#F5E9DD" />

      {/* Central Phone Device */}
      <rect x="110" y="50" width="100" height="160" rx="16" fill="#2B1A12" stroke="#5A3A28" strokeWidth="3" />
      <rect x="120" y="65" width="80" height="130" rx="8" fill="#FFF8F1" />

      {/* Floating Order Chip 1 */}
      <rect x="40" y="70" width="90" height="35" rx="8" fill="#FFFFFF" stroke="#F97316" strokeWidth="2" />
      <circle cx="55" cy="87" r="5" fill="#F97316" />
      <line x1="68" y1="83" x2="115" y2="83" stroke="#2B1A12" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="92" x2="105" y2="92" stroke="#6B5444" strokeWidth="1.5" strokeLinecap="round" />

      {/* Floating Order Chip 2 */}
      <rect x="190" y="130" width="95" height="35" rx="8" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2" />
      <circle cx="205" cy="147" r="5" fill="#16A34A" />
      <line x1="218" y1="143" x2="268" y2="143" stroke="#2B1A12" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="218" y1="152" x2="255" y2="152" stroke="#6B5444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
