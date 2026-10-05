import React from 'react';

interface SwaadSevakLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightText?: boolean;
  onOrangeBg?: boolean;
}

export const SwaadSevakLogo: React.FC<SwaadSevakLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  lightText = true,
  onOrangeBg = false,
}) => {
  const heightClass = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
    xl: 'h-14',
  }[size];

  if (iconOnly) {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClass} w-auto select-none shrink-0 ${className}`}
        aria-label="SwaadSevak Logo"
      >
        <rect width="48" height="48" rx="12" fill="#1A0F0A" stroke="#5A3A28" strokeWidth="1.5" />
        {/* 3 Rising Saffron Steam Waves */}
        <path d="M 16 19 C 14 13 20 10 17 5" stroke="#F97316" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 24 19 C 22 13 28 10 25 5" stroke="#F97316" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 32 19 C 30 13 36 10 33 5" stroke="#F97316" strokeWidth="3.2" strokeLinecap="round" />
        {/* Saffron Bowl Rim */}
        <rect x="8" y="24" width="32" height="4" rx="2" fill="#F97316" />
        {/* Pure White Bowl Body */}
        <path d="M 10 28 C 11 38 18 43 24 43 C 30 43 37 38 38 28 Z" fill="#FFFFFF" />
        {/* Pedestal Foot */}
        <rect x="18" y="43" width="12" height="2.5" rx="1.25" fill="#FFFFFF" />
      </svg>
    );
  }

  const primaryText = onOrangeBg ? '#1A0F0A' : (lightText ? '#FFFFFF' : '#2B1A12');
  const accentText = onOrangeBg ? '#FFFFFF' : '#F97316';
  const swooshColor = onOrangeBg ? '#1A0F0A' : '#F97316';

  return (
    <svg
      viewBox="0 0 234 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${heightClass} w-auto select-none shrink-0 ${className}`}
      aria-label="SwaadSevak"
    >
      {/* App Icon Mark (Left) */}
      <g transform="translate(1, 1)">
        <rect width="48" height="48" rx="12" fill="#1A0F0A" stroke="#5A3A28" strokeWidth="1.5" />
        {/* 3 Rising Saffron Steam Waves */}
        <path d="M 16 19 C 14 13 20 10 17 5" stroke="#F97316" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 24 19 C 22 13 28 10 25 5" stroke="#F97316" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 32 19 C 30 13 36 10 33 5" stroke="#F97316" strokeWidth="3.2" strokeLinecap="round" />
        {/* Saffron Bowl Rim */}
        <rect x="8" y="24" width="32" height="4" rx="2" fill="#F97316" />
        {/* Pure White Bowl Body */}
        <path d="M 10 28 C 11 38 18 43 24 43 C 30 43 37 38 38 28 Z" fill="#FFFFFF" />
        {/* Pedestal Foot */}
        <rect x="18" y="43" width="12" height="2.5" rx="1.25" fill="#FFFFFF" />
      </g>

      {/* Wordmark */}
      <text
        x="60"
        y="33"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="25"
        letterSpacing="-0.03em"
        fill={primaryText}
      >
        Swaad<tspan fill={accentText}>Sevak</tspan>
      </text>

      {/* Dynamic Curved Underline Swoosh: Perfectly positioned under 'Sevak' */}
      <path
        d="M 146 39 C 166 45 198 45 224 38 C 198 42 166 42 146 39 Z"
        fill={swooshColor}
      />
    </svg>
  );
};
