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
    <section className="py-16 sm:py-20 bg-espresso text-white font-sans border-b border-walnut relative overflow-hidden">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Heading (4 cols) */}
          <div className="lg:col-span-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cocoa border border-walnut text-xs font-semibold text-sand-100 shadow-soft mb-3">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>Verified Standards</span>
            </div>
            <h2 className="h2-fluid font-extrabold text-white tracking-tight mb-3">
              How We Build Trust
            </h2>
            <p className="text-sm text-sand-200 leading-relaxed">
              Transparent engineering benchmarks. We never make exaggerated claims—every number is grounded in real operational constraints.
            </p>
          </div>

          {/* Right Stats with Divider Lines (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {SITE_CONTENT.proofStats.map((stat, idx) => (
              <div
                key={idx}
                className="relative flex flex-col justify-between sm:pl-6 first:pl-0 sm:border-l sm:border-walnut"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-cocoa border border-walnut flex items-center justify-center">
                      {statIcons[idx]}
                    </div>
                    {stat.isPlaceholder && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cocoa text-sand-300 uppercase">
                        TODO: PLACEHOLDER
                      </span>
                    )}
                  </div>
                  
                  <div className="font-mono font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <h3 className="font-bold text-sm text-sand-100 mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-sand-300 leading-relaxed">
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
