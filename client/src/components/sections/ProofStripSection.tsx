import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { Store, Utensils, Coffee, Flame, Cake, Pizza } from 'lucide-react';

export const ProofStripSection: React.FC = () => {
  const categoryIcons = [
    <Coffee key="coffee" className="w-4 h-4 text-ember-500" />,
    <Utensils key="utensils" className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    <Flame key="flame" className="w-4 h-4 text-ember-600" />,
    <Cake key="cake" className="w-4 h-4 text-pink-500" />,
    <Pizza key="pizza" className="w-4 h-4 text-amber-500" />,
    <Store key="store" className="w-4 h-4 text-success-600" />,
  ];

  return (
    <section className="py-10 bg-ink-50/70 dark:bg-ink-900/40 border-y border-ink-200/80 dark:border-ink-800 font-sans">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {SITE_CONTENT.proofStats.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-soft text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono font-bold text-2xl sm:text-3xl text-ink-950 dark:text-ink-50">
                    {stat.value}
                  </span>
                  {stat.isPlaceholder && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 uppercase">
                      Target Metric
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-ink-900 dark:text-ink-100 mb-1">
                  {stat.label}
                </h3>
                <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
                  {stat.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Format Category Pills */}
        <div className="pt-2 text-center">
          <p className="text-xs uppercase tracking-wider font-mono font-semibold text-ink-400 dark:text-ink-500 mb-4">
            Engineered For High-Volume Indian Food Formats:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {SITE_CONTENT.partnerTypes.map((category, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-xs font-semibold text-ink-800 dark:text-ink-200 shadow-soft hover:border-ember-400 transition-colors"
              >
                {categoryIcons[index % categoryIcons.length]}
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
