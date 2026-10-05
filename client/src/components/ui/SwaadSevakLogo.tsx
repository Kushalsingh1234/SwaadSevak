import React from 'react';

interface SwaadSevakLogoProps {
  className?: string;
  iconOnly?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
}

export const SwaadSevakLogo: React.FC<SwaadSevakLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }[size];

  const textDimensions = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none font-serif ${className}`}>
      {/* Custom SVG Icon: Stylized Ladle + Indian Dining Plate + Rupee Sparkle motif */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-700 shadow-sm p-1.5 text-white ${iconDimensions}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Outer plate circle */}
          <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="2.2" strokeDasharray="3 2" />
          {/* Inner serving plate */}
          <circle cx="18" cy="18" r="9" fill="currentColor" fillOpacity="0.2" />
          {/* Stylized ladle handle and bowl */}
          <path
            d="M10 24C10 21 13 18 17 18H20"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M20 15L25 10M25 10L27 12M25 10L23 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Spark of flavor / Swaad essence dot */}
          <circle cx="18" cy="18" r="2.2" fill="white" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold tracking-tight font-serif text-maroon-950 dark:text-cream-50 ${textDimensions}`}>
            Swaad<span className="text-saffron-600 dark:text-saffron-400">Sevak</span>
          </span>
          <span className="text-[10px] tracking-wider uppercase font-sans font-semibold text-maroon-700/70 dark:text-cream-200/60 mt-0.5">
            Restaurant OS
          </span>
        </div>
      )}
    </div>
  );
};
