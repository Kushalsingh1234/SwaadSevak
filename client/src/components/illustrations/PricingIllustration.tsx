import React from 'react';

export const PricingIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px]' }) => {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="160" cy="130" r="100" fill="#3D2519" />
      
      {/* Zero Hidden Fees Price Tag & Rupee Coin */}
      <rect x="75" y="70" width="170" height="120" rx="16" fill="#2B1A12" stroke="#5A3A28" strokeWidth="2" />
      
      <rect x="90" y="85" width="60" height="24" rx="12" fill="#F97316" />
      <text x="120" y="101" fill="#2B1A12" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">
        0% AMC
      </text>

      <text x="90" y="145" fill="#FFF8F1" fontSize="26" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
        ₹1,199<tspan fontSize="13" fill="#F5E9DD" fontWeight="500">/mo</tspan>
      </text>

      <line x1="90" y1="165" x2="230" y2="165" stroke="#5A3A28" strokeWidth="1.5" />
      <line x1="90" y1="175" x2="200" y2="175" stroke="#6B5444" strokeWidth="2" strokeLinecap="round" />

      {/* Floating Checkmark Badge */}
      <circle cx="235" cy="85" r="18" fill="#16A34A" />
      <path d="M228 85L233 90L242 79" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
