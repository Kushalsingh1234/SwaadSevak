import React from 'react';

export const SupportAgentIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px]' }) => {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Background soft circle */}
      <circle cx="160" cy="130" r="100" fill="#3D2519" />
      
      {/* Floating 24/7 Badge */}
      <rect x="210" y="45" width="80" height="34" rx="17" fill="#F97316" />
      <text x="250" y="67" fill="#2B1A12" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">
        &lt; 5 MIN
      </text>

      {/* Support Agent Body */}
      <path d="M100 245V180C100 152 124 135 160 135C196 135 220 152 220 180V245H100Z" fill="#2B1A12" stroke="#5A3A28" strokeWidth="2" />
      <path d="M125 160H195V245H125V160Z" fill="#3D2519" />
      <path d="M142 145H178V170H142V145Z" fill="#F97316" />

      {/* Head */}
      <circle cx="160" cy="98" r="28" fill="#F5E9DD" />
      
      {/* Hair */}
      <path d="M136 92C136 76 146 66 160 66C174 66 184 76 184 92C184 82 170 72 160 72C150 72 136 82 136 92Z" fill="#2B1A12" />

      {/* Headset */}
      <path d="M134 98C134 82 145 70 160 70C175 70 186 82 186 98" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
      <rect x="130" y="92" width="8" height="14" rx="4" fill="#F97316" />
      <rect x="182" y="92" width="8" height="14" rx="4" fill="#F97316" />
      <path d="M184 102L168 116" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      <circle cx="166" cy="118" r="4" fill="#16A34A" />

      {/* Chat Speech Bubble */}
      <rect x="40" y="140" width="85" height="50" rx="10" fill="#FFF8F1" stroke="#5A3A28" strokeWidth="2" />
      <line x1="52" y1="156" x2="112" y2="156" stroke="#2B1A12" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="168" x2="96" y2="168" stroke="#6B5444" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="114" cy="172" r="3.5" fill="#16A34A" />
    </svg>
  );
};
