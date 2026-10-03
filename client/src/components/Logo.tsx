import React from 'react';

export interface LogoProps {
  variant?: 'mark' | 'horizontal' | 'stacked';
  theme?: 'dark' | 'light' | 'mono-black' | 'mono-white';
  className?: string;
  size?: number | string;
  showTagline?: boolean;
}

/**
 * Swaad Sevak Brand Logo System
 * Modern Soup Bowl with Dual Rising Steam Plumes
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  theme = 'dark',
  className = '',
  size,
  showTagline = true,
}) => {
  // Color tokens based on theme
  const isDark = theme === 'dark';
  const isMonoBlack = theme === 'mono-black';
  const isMonoWhite = theme === 'mono-white';

  const orangeColor = isMonoBlack ? '#000000' : (isMonoWhite ? '#FFFFFF' : '#FF5E0E');
  const bowlColor = isMonoBlack ? '#000000' : (isMonoWhite ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#0B1020'));
  const textColor = isMonoBlack ? '#000000' : (isMonoWhite ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#0B1020'));
  const taglineColor = isMonoBlack ? '#555555' : (isMonoWhite ? 'rgba(255,255,255,0.7)' : (isDark ? '#D4C3B3' : '#64748B'));

  // 1. Mark Only
  if (variant === 'mark') {
    const defaultMarkSize = size || 36;
    return (
      <svg
        width={defaultMarkSize}
        height={defaultMarkSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Swaad Sevak Logo Mark"
      >
        {/* Left Steam Ribbon */}
        <path
          d="M 37 40 C 31 29 46 21 39 8"
          stroke={orangeColor}
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right Steam Ribbon */}
        <path
          d="M 63 40 C 57 29 72 21 65 8"
          stroke={orangeColor}
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bowl Rim */}
        <rect x="14" y="47" width="72" height="8" rx="4" fill={orangeColor} />
        {/* Bowl Basin */}
        <path
          d="M 18 55 C 20 76 34 88 50 88 C 66 88 80 76 82 55 Z"
          fill={bowlColor}
        />
        {/* Bowl Foot Stand */}
        <rect x="36" y="88" width="28" height="4.5" rx="2.25" fill={bowlColor} />
      </svg>
    );
  }

  // 2. Stacked
  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        <svg
          width={size || 56}
          height={size || 56}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path d="M 37 40 C 31 29 46 21 39 8" stroke={orangeColor} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 63 40 C 57 29 72 21 65 8" stroke={orangeColor} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="14" y="47" width="72" height="8" rx="4" fill={orangeColor} />
          <path d="M 18 55 C 20 76 34 88 50 88 C 66 88 80 76 82 55 Z" fill={bowlColor} />
          <rect x="36" y="88" width="28" height="4.5" rx="2.25" fill={bowlColor} />
        </svg>
        <div className="mt-2">
          <span style={{ color: textColor }} className="font-extrabold text-lg tracking-tight">
            Swaad<span style={{ color: orangeColor }}>Sevak</span>
          </span>
          {showTagline && (
            <span style={{ color: taglineColor }} className="block text-[9px] font-bold tracking-widest uppercase mt-0.5">
              Restaurant OS
            </span>
          )}
        </div>
      </div>
    );
  }

  // 3. Horizontal Lockup (Default)
  const markSize = size || 32;
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="Swaad Sevak Logo Mark"
      >
        <path d="M 37 40 C 31 29 46 21 39 8" stroke={orangeColor} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 63 40 C 57 29 72 21 65 8" stroke={orangeColor} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="47" width="72" height="8" rx="4" fill={orangeColor} />
        <path d="M 18 55 C 20 76 34 88 50 88 C 66 88 80 76 82 55 Z" fill={bowlColor} />
        <rect x="36" y="88" width="28" height="4.5" rx="2.25" fill={bowlColor} />
      </svg>
      <div className="leading-tight">
        <div style={{ color: textColor }} className="font-extrabold text-[17px] tracking-tight">
          Swaad<span style={{ color: orangeColor }}>Sevak</span>
        </div>
        {showTagline && (
          <div style={{ color: taglineColor }} className="text-[8px] font-bold tracking-[0.14em] uppercase -mt-0.5">
            Restaurant OS
          </div>
        )}
      </div>
    </div>
  );
};
