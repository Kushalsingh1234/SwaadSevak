import React from 'react';

interface SwaadSevakLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  lightText?: boolean;
}

export const SwaadSevakLogo: React.FC<SwaadSevakLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  lightText = false,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }[size];

  const textDimensions = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none font-sans ${className}`}>
      {/* Modern B2B SaaS Mark: Stylized Serving Plate & Ladle in Vibrant Orange */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-orange-500 shadow-soft p-1.5 text-espresso-950 shrink-0 ${iconDimensions}`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Plate contour */}
          <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2.5" />
          {/* Ladle stem and head */}
          <path
            d="M9 20C9 16 13 14 17 14H20"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M20 11L24 7M24 7L26 9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Center core */}
          <circle cx="16" cy="16" r="2.5" fill="currentColor" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex items-center gap-1 leading-none">
          <span className={`font-extrabold tracking-tight ${lightText ? 'text-white' : 'text-espresso-900'} ${textDimensions}`}>
            Swaad<span className="text-orange-500">Sevak</span>
          </span>
        </div>
      )}
    </div>
  );
};
