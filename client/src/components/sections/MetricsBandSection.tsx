import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { ShieldCheck, Zap, Clock } from 'lucide-react';

export const MetricsBandSection: React.FC = () => {
  const statIcons = [
    <Zap key="zap" className="w-6 h-6 text-orange-400" />,
    <ShieldCheck key="shield" className="w-6 h-6 text-orange-400" />,
    <Clock key="clock" className="w-6 h-6 text-orange-400" />,
  ];

  return (
    <section
      className="py-10 sm:py-14 font-sans border-b border-walnut relative overflow-hidden"
      style={{ backgroundColor: '#2B1A12', color: '#FFFFFF' }}
    >
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Heading (4 cols) */}
          <div className="lg:col-span-4 text-left">
            <div
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-soft mb-2.5"
              style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FAF4ED' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Verified Standards</span>
            </div>
            <h2 className="h2-fluid font-extrabold tracking-tight mb-2.5" style={{ color: '#FFFFFF' }}>
              How We Build Trust
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed font-medium" style={{ color: '#F5E9DD' }}>
              Transparent engineering benchmarks. We never make exaggerated claims—every number is grounded in real operational constraints.
            </p>
          </div>

          {/* Right Stats with Divider Lines (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 text-left">
            {SITE_CONTENT.proofStats.map((stat, idx) => (
              <div
                key={idx}
                className="relative flex flex-col justify-between sm:pl-5 first:pl-0 sm:border-l"
                style={{ borderColor: '#5A3A28' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className="w-8.5 h-8.5 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28' }}
                    >
                      {React.cloneElement(statIcons[idx], { className: 'w-4.5 h-4.5 text-orange-400' })}
                    </div>
                    {stat.isPlaceholder && (
                      <span
                        className="text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold"
                        style={{ backgroundColor: '#3D2519', border: '1px solid #5A3A28', color: '#FAF4ED' }}
                      >
                        TODO: PLACEHOLDER
                      </span>
                    )}
                  </div>
                  
                  <div
                    className="font-mono font-extrabold text-2xl sm:text-3xl tracking-tight mb-1"
                    style={{ color: '#FFFFFF' }}
                  >
                    {stat.value}
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm mb-0.5" style={{ color: '#FFFFFF' }}>
                    {stat.label}
                  </h3>
                  <p className="text-[11px] sm:text-xs leading-relaxed font-medium" style={{ color: '#F5E9DD' }}>
                    {stat.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
