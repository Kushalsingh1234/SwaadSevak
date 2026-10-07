import React from 'react';

export const StaffIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px]' }) => {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Background Soft Circle */}
      <circle cx="160" cy="130" r="100" fill="#F5E9DD" />
      
      {/* Floating KOT Ticket Graphic */}
      <rect x="200" y="40" width="75" height="95" rx="8" fill="#FFFFFF" stroke="#5A3A28" strokeWidth="2" />
      <line x1="212" y1="58" x2="260" y2="58" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      <line x1="212" y1="72" x2="250" y2="72" stroke="#6B5444" strokeWidth="2" strokeLinecap="round" />
      <line x1="212" y1="84" x2="245" y2="84" stroke="#6B5444" strokeWidth="2" strokeLinecap="round" />
      <line x1="212" y1="96" x2="235" y2="96" stroke="#6B5444" strokeWidth="2" strokeLinecap="round" />
      <circle cx="255" cy="115" r="5" fill="#16A34A" />

      {/* Staff Body (Apron & Torso) */}
      <path d="M110 240V170C110 145 130 130 160 130C190 130 210 145 210 170V240H110Z" fill="#2B1A12" />
      <path d="M125 155H195V240H125V155Z" fill="#3D2519" />
      <path d="M140 145H180V165H140V145Z" fill="#F97316" />

      {/* Head & Face */}
      <circle cx="160" cy="95" r="28" fill="#F5E9DD" stroke="#3D2519" strokeWidth="2" />
      {/* Hair */}
      <path d="M136 90C136 74 146 64 160 64C174 64 184 74 184 90C184 80 170 70 160 70C150 70 136 80 136 90Z" fill="#2B1A12" />

      {/* Tablet in Hand */}
      <rect x="75" y="160" width="70" height="50" rx="6" fill="#1F120C" stroke="#F97316" strokeWidth="2" />
      <rect x="83" y="168" width="54" height="34" rx="3" fill="#FFF8F1" />
      <line x1="90" y1="178" x2="125" y2="178" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="90" y1="188" x2="115" y2="188" stroke="#6B5444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
