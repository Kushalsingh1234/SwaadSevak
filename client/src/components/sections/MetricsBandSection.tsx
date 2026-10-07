import React from 'react';

export const MetricsBandSection: React.FC = () => {
  return (
    <section
      className="pt-12 sm:pt-16 pb-10 sm:pb-12 font-sans relative overflow-hidden"
      style={{ backgroundColor: '#2B1A12', color: '#FFFFFF' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Heading Column (4 cols) */}
          <div className="lg:col-span-4 text-left pb-6 lg:pb-0 lg:pr-6">
            <span className="text-xs sm:text-sm font-semibold text-orange-400 block mb-2 uppercase tracking-wider font-mono">
              How We Build Trust
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.15rem] font-bold tracking-tight text-white leading-tight">
              Amplifying The<br />
              Key Metrics That<br />
              Power Your Shift
            </h2>
          </div>

          {/* Right Metrics Columns with Dashed Dividers (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3">
            
            {/* Metric 1: Orders Served */}
            <div className="border-t sm:border-t-0 sm:border-l border-dashed border-[#5A3A28] py-4 sm:py-2 px-3 sm:px-6 flex flex-col items-start justify-center">
              {/* Circular Smiley Faces Badge */}
              <div className="mb-4">
                <svg width="68" height="68" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="38" fill="#DDEAF8" />
                  
                  {/* Left Small Smiley */}
                  <circle cx="28" cy="26" r="10" fill="#FFFFFF" stroke="#2B1A12" strokeWidth="2" />
                  <circle cx="25" cy="24" r="1.5" fill="#2B1A12" />
                  <circle cx="31" cy="24" r="1.5" fill="#2B1A12" />
                  <path d="M25 28C26 30 30 30 31 28" stroke="#2B1A12" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Right Small Smiley */}
                  <circle cx="52" cy="26" r="10" fill="#FFFFFF" stroke="#2B1A12" strokeWidth="2" />
                  <circle cx="49" cy="24" r="1.5" fill="#2B1A12" />
                  <circle cx="55" cy="24" r="1.5" fill="#2B1A12" />
                  <path d="M49 28C50 30 54 30 55 28" stroke="#2B1A12" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Center Main Big Smiley */}
                  <circle cx="40" cy="45" r="17" fill="#FFFFFF" stroke="#2B1A12" strokeWidth="2.5" />
                  <ellipse cx="34" cy="41" rx="2" ry="2.5" fill="#2B1A12" />
                  <ellipse cx="46" cy="41" rx="2" ry="2.5" fill="#2B1A12" />
                  <path d="M33 48C33 53 47 53 47 48" fill="#2B1A12" />

                  {/* Sparkles */}
                  <path d="M19 46L21 42L23 46L27 48L23 50L21 54L19 50L15 48L19 46Z" fill="#7FA9D6" />
                  <path d="M61 46L62.5 43L64 46L67 47.5L64 49L62.5 52L61 49L58 47.5L61 46Z" fill="#7FA9D6" />
                  <path d="M40 12L41 9L42 12L45 13L42 14L41 17L40 14L37 13L40 12Z" fill="#7FA9D6" />
                </svg>
              </div>
              <div className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight mb-1">
                2.4M+
              </div>
              <p className="text-xs sm:text-sm text-[#F5E9DD]/90 font-medium">
                Orders served live
              </p>
            </div>

            {/* Metric 2: Platform Uptime */}
            <div className="border-t sm:border-t-0 sm:border-l border-dashed border-[#5A3A28] py-4 sm:py-2 px-3 sm:px-6 flex flex-col items-start justify-center">
              {/* Circular Award Ribbon Badge */}
              <div className="mb-4">
                <svg width="68" height="68" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="38" fill="#FCE8E6" />
                  
                  {/* Ribbon Tails */}
                  <path d="M32 50L30 68L36 64L41 68L39 52" fill="#2B1A12" stroke="#2B1A12" strokeWidth="1.5" />
                  <path d="M48 50L50 68L44 64L39 68L41 52" fill="#2B1A12" stroke="#2B1A12" strokeWidth="1.5" />

                  {/* Scalloped Rosette Outer */}
                  <path d="M40 18C44 18 47 20 49 22C52 21 56 23 57 26C60 28 61 32 60 35C62 38 61 42 59 44C59 48 56 50 53 51C50 53 46 53 43 54C40 54 37 53 34 51C31 50 28 48 28 44C26 42 25 38 27 35C26 32 27 28 30 26C31 23 35 21 38 22C40 20 43 18 40 18Z" fill="#FFFFFF" stroke="#2B1A12" strokeWidth="2.5" />

                  {/* Inner Rosette Center */}
                  <circle cx="40" cy="36" r="14" fill="#2B1A12" />
                  
                  {/* Checkmark */}
                  <path d="M34 36L38 40L46 32" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight mb-1">
                99.99%
              </div>
              <p className="text-xs sm:text-sm text-[#F5E9DD]/90 font-medium">
                Peak rush uptime
              </p>
            </div>

            {/* Metric 3: Processing Errors */}
            <div className="border-t sm:border-t-0 sm:border-l border-dashed border-[#5A3A28] py-4 sm:py-2 px-3 sm:px-6 flex flex-col items-start justify-center">
              {/* Circular Hourglass Badge */}
              <div className="mb-4">
                <svg width="68" height="68" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="38" fill="#DDEAF8" />
                  
                  {/* Hourglass Frame */}
                  <rect x="25" y="20" width="30" height="5" rx="2" fill="#2B1A12" />
                  <rect x="25" y="55" width="30" height="5" rx="2" fill="#2B1A12" />
                  
                  {/* Glass Body */}
                  <path d="M28 25C28 35 37 38 37 40C37 42 28 45 28 55H52C52 45 43 42 43 40C43 38 52 35 52 25H28Z" fill="#FFFFFF" stroke="#2B1A12" strokeWidth="2.5" />
                  
                  {/* Sand Flow */}
                  <path d="M32 30C36 30 40 33 40 37C40 33 44 30 48 30H32Z" fill="#2B1A12" />
                  <line x1="40" y1="37" x2="40" y2="47" stroke="#2B1A12" strokeWidth="2" strokeDasharray="2 2" />
                  <path d="M33 53C35 48 45 48 47 53H33Z" fill="#2B1A12" />

                  {/* Checkmark Circle on Lower Right */}
                  <circle cx="51" cy="47" r="9" fill="#2B1A12" stroke="#FFFFFF" strokeWidth="2" />
                  <path d="M47 47L50 50L56 44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight mb-1">
                0%
              </div>
              <p className="text-xs sm:text-sm text-[#F5E9DD]/90 font-medium">
                Billing &amp; KOT misses
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
