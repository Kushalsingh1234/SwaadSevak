import React from 'react';

export const ChefIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px]' }) => {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Background Soft Circle */}
      <circle cx="160" cy="130" r="100" fill="#FFF8F1" stroke="#F5E9DD" strokeWidth="4" />

      {/* Chef Hat */}
      <path d="M130 70C125 50 145 35 160 35C175 35 195 50 190 70H130Z" fill="#FFFFFF" stroke="#3D2519" strokeWidth="2" />
      <circle cx="145" cy="45" r="14" fill="#FFFFFF" />
      <circle cx="175" cy="45" r="14" fill="#FFFFFF" />
      <circle cx="160" cy="38" r="16" fill="#FFFFFF" />
      <rect x="135" y="65" width="50" height="12" rx="2" fill="#F97316" />

      {/* Head */}
      <circle cx="160" cy="100" r="26" fill="#F5E9DD" stroke="#3D2519" strokeWidth="2" />

      {/* Chef Coat */}
      <path d="M110 240V160C110 140 130 130 160 130C190 130 210 140 210 160V240H110Z" fill="#FFFFFF" stroke="#5A3A28" strokeWidth="2" />
      {/* Double-breasted buttons */}
      <circle cx="145" cy="165" r="4" fill="#2B1A12" />
      <circle cx="175" cy="165" r="4" fill="#2B1A12" />
      <circle cx="145" cy="190" r="4" fill="#2B1A12" />
      <circle cx="175" cy="190" r="4" fill="#2B1A12" />
      <circle cx="145" cy="215" r="4" fill="#2B1A12" />
      <circle cx="175" cy="215" r="4" fill="#2B1A12" />

      {/* Flame Icon Indicator */}
      <circle cx="235" cy="90" r="24" fill="#3D2519" stroke="#F97316" strokeWidth="2" />
      <path d="M235 76C230 84 225 90 227 96C229 102 235 104 240 101C245 98 245 92 242 88C240 85 237 81 235 76Z" fill="#F97316" />
    </svg>
  );
};
