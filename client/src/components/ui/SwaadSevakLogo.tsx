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
        viewBox="0 0 36 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClass} w-auto select-none shrink-0 ${className}`}
        aria-label="SwaadSevak Logo"
      >
        {/* 3 Rising Saffron Steam Waves */}
        <path d="M 10 16 C 8 10 14 7 11 2" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M 18 16 C 16 10 22 7 19 2" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M 26 16 C 24 10 30 7 27 2" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" />
        {/* Saffron Bowl Rim */}
        <rect x="2" y="20" width="32" height="4" rx="2" fill="#F97316" />
        {/* Pure White Bowl Body */}
        <path d="M 4 24 C 5 33 12 37 18 37 C 24 37 31 33 32 24 Z" fill="#FFFFFF" />
        {/* Pedestal Foot */}
        <rect x="12" y="37" width="12" height="2.5" rx="1.25" fill="#FFFFFF" />
      </svg>
    );
  }

  const primaryText = onOrangeBg ? '#1A0F0A' : (lightText ? '#FFFFFF' : '#2B1A12');
  const accentText = onOrangeBg ? '#FFFFFF' : '#F97316';
  const swooshColor = onOrangeBg ? '#1A0F0A' : '#F97316';

  return (
    <svg
      viewBox="0 0 216 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${heightClass} w-auto select-none shrink-0 ${className}`}
      aria-label="SwaadSevak"
    >
      {/* App Icon Mark */}
      <g>
        {/* 3 Rising Saffron Steam Waves */}
        <path d="M 10 16 C 8 10 14 7 11 2" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M 18 16 C 16 10 22 7 19 2" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M 26 16 C 24 10 30 7 27 2" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" />
        {/* Saffron Bowl Rim */}
        <rect x="2" y="20" width="32" height="4" rx="2" fill="#F97316" />
        {/* Pure White Bowl Body */}
        <path d="M 4 24 C 5 33 12 37 18 37 C 24 37 31 33 32 24 Z" fill="#FFFFFF" />
        {/* Pedestal Foot */}
        <rect x="12" y="37" width="12" height="2.5" rx="1.25" fill="#FFFFFF" />
      </g>

      {/* Wordmark */}
      <text
        x="44"
        y="29"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="26"
        letterSpacing="-0.03em"
        fill={primaryText}
      >
        Swaad<tspan fill={accentText}>Sevak</tspan>
      </text>

      {/* Dynamic Curved Underline Swoosh under 'Sevak' */}
      <path
        d="M 132 35 C 152 41 184 41 210 34 C 184 38 152 38 132 35 Z"
        fill={swooshColor}
      />
    </svg>
  );
};
