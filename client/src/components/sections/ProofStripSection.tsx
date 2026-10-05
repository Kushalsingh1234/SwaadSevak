import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { useTranslation } from '../../i18n';
import { Utensils, Coffee, Pizza, Flame, Cake, Wine } from 'lucide-react';

export const ProofStripSection: React.FC = () => {
  const { t } = useTranslation();

  const partnerIcons = [
    <Coffee key="coffee" className="w-5 h-5 text-saffron-600" />,
    <Utensils key="utensils" className="w-5 h-5 text-curry-600" />,
    <Flame key="flame" className="w-5 h-5 text-amber-600" />,
    <Cake key="cake" className="w-5 h-5 text-pink-600" />,
    <Pizza key="pizza" className="w-5 h-5 text-red-600" />,
    <Wine key="wine" className="w-5 h-5 text-purple-600" />,
  ];

  return (
    <section className="py-10 bg-cream-100/70 dark:bg-maroon-900/30 border-y border-receipt-divider dark:border-maroon-800/60 font-sans">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {SITE_CONTENT.proofStats.map((stat, idx) => (
            <div
              key={idx}
              className="relative p-5 sm:p-6 rounded-2xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-serif font-bold text-2xl sm:text-3xl text-saffron-600 dark:text-saffron-400">
                    {stat.value}
                  </span>
                  {stat.isPlaceholder && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cream-200 dark:bg-maroon-900 text-maroon-700/70 dark:text-cream-300/60 uppercase">
                      Target Metric
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-maroon-950 dark:text-cream-50 mb-1">
                  {stat.label}
                </h3>
                <p className="text-xs text-maroon-800/70 dark:text-cream-300/70 leading-relaxed">
                  {stat.sub}
                </p>
              </div>

              {/* Decorative dash border bottom */}
              <div className="receipt-tear-line w-full mt-4" />
            </div>
          ))}
        </div>

        {/* Partner Outlet Categories Strip */}
        <div className="pt-2 text-center">
          <p className="text-xs uppercase tracking-wider font-mono font-semibold text-maroon-700/60 dark:text-cream-300/60 mb-4">
            Engineered For Every Indian Culinary Format:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {SITE_CONTENT.partnerTypes.map((category, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 text-xs font-semibold text-maroon-900 dark:text-cream-100 shadow-subtle hover:border-saffron-400 transition-colors"
              >
                {partnerIcons[index % partnerIcons.length]}
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
