import React from 'react';

export const OrderNotificationIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px]' }) => {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="160" cy="130" r="100" fill="#3D2519" />
      
      {/* Soundbox Speaker & Notification waves */}
      <rect x="90" y="70" width="140" height="120" rx="16" fill="#2B1A12" stroke="#5A3A28" strokeWidth="2" />
      
      {/* Sound grid */}
      <circle cx="160" cy="120" r="28" fill="#1F120C" stroke="#F97316" strokeWidth="2" />
      <circle cx="160" cy="120" r="14" fill="#3D2519" />
      <circle cx="160" cy="120" r="5" fill="#F97316" />

      {/* Floating incoming payment chip */}
      <rect x="50" y="40" width="130" height="42" rx="10" fill="#FFF8F1" stroke="#5A3A28" strokeWidth="1.5" />
      <circle cx="72" cy="61" r="10" fill="#16A34A" />
      <path d="M68 61L71 64L76 58" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <text x="90" y="56" fill="#2B1A12" fontSize="11" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">₹840 Received</text>
      <text x="90" y="69" fill="#6B5444" fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">Table 04 • Dynamic UPI</text>

      {/* Floating KOT Chip */}
      <rect x="150" y="180" width="140" height="44" rx="10" fill="#2B1A12" stroke="#F97316" strokeWidth="1.5" />
      <circle cx="170" cy="202" r="8" fill="#F97316" />
      <text x="186" y="197" fill="#FFF8F1" fontSize="11" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">New Order #104</text>
      <text x="186" y="211" fill="#F5E9DD" fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">2x Butter Naan, 1x Dal Makhani</text>
    </svg>
  );
};
