import React from 'react';

export const UpdateIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px]' }) => {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="160" cy="130" r="100" fill="#3D2519" />
      
      {/* Cloud & Sync Circle */}
      <rect x="70" y="60" width="180" height="130" rx="16" fill="#2B1A12" stroke="#5A3A28" strokeWidth="2" />
      
      {/* App screen header */}
      <rect x="80" y="72" width="160" height="24" rx="6" fill="#3D2519" />
      <circle cx="92" cy="84" r="4" fill="#F97316" />
      <circle cx="104" cy="84" r="4" fill="#5A3A28" />
      <line x1="120" y1="84" x2="180" y2="84" stroke="#F5E9DD" strokeWidth="2" strokeLinecap="round" />

      {/* Progress & Update Badge */}
      <rect x="90" y="110" width="140" height="12" rx="6" fill="#1F120C" />
      <rect x="90" y="110" width="95" height="12" rx="6" fill="#F97316" />

      <rect x="90" y="135" width="140" height="36" rx="8" fill="#FFF8F1" />
      <line x1="102" y1="148" x2="190" y2="148" stroke="#2B1A12" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="102" y1="158" x2="160" y2="158" stroke="#6B5444" strokeWidth="2" strokeLinecap="round" />
      <circle cx="215" cy="153" r="6" fill="#16A34A" />

      {/* Sync Badge */}
      <circle cx="240" cy="80" r="22" fill="#F97316" />
      <path d="M232 80C232 75.5 235.5 72 240 72C243.5 72 246.5 74.2 247.6 77.5M248 80C248 84.5 244.5 88 240 88C236.5 88 233.5 85.8 232.4 82.5" stroke="#2B1A12" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M248 74V78H244" stroke="#2B1A12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M232 86V82H236" stroke="#2B1A12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
