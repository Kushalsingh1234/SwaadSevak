import React from 'react';

interface SwaadSevakLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightText?: boolean;
}

export const SwaadSevakLogo: React.FC<SwaadSevakLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  lightText = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }[size];

  const fontSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none font-sans ${className}`}>
      {/* Official SwaadSevak App Icon Mark: Steaming Hot Bowl in Dark Rounded Squircle */}
      <div
        className={`relative flex items-center justify-center rounded-[22%] bg-[#1A0F0A] shadow-md border border-walnut/60 p-1.5 shrink-0 ${iconSizes}`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* 3 Rising Saffron Steam Waves */}
          <path
            d="M 33 38 C 29 27 41 20 35 10"
            stroke="#F97316"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 50 38 C 46 27 58 20 52 10"
            stroke="#F97316"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 67 38 C 63 27 75 20 69 10"
            stroke="#F97316"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Saffron Bowl Rim */}
          <rect x="16" y="47" width="68" height="7.5" rx="3.75" fill="#F97316" />

          {/* Pure White Bowl Body */}
          <path
            d="M 19 54.5 C 21 75 35 86 50 86 C 65 86 79 75 81 54.5 Z"
            fill="#FFFFFF"
          />

          {/* Bowl Pedestal Stand */}
          <rect x="36" y="86" width="28" height="4.5" rx="2.25" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Wordmark with Swaad in Bold, Sevak in Orange, and Curved Smile Swoosh */}
      {!iconOnly && (
        <div className="flex flex-col relative leading-none">
          <div className={`font-black tracking-tight flex items-center ${fontSizes}`}>
            <span className={lightText ? 'text-white' : 'text-espresso'}>Swaad</span>
            <span className="text-orange-500 ml-0.5">Sevak</span>
          </div>
          {/* Dynamic Curved Underline Swoosh underneath "Sevak" */}
          <svg
            viewBox="0 0 120 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[52%] self-end -mt-0.5"
            aria-hidden="true"
          >
            <path
              d="M 2 4 C 38 16 85 16 118 4 C 85 10 38 10 2 4 Z"
              fill="#F97316"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
