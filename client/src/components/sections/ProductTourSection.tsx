import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { Badge } from '../ui/Badge';
import { BillingMockup } from '../mockups/BillingMockup';
import { InventoryMockup, ReportsMockup } from '../mockups/InventoryMockup';
import { LiveOrderFeedMockup } from '../mockups/LiveOrderFeedMockup';
import {
  Sunrise,
  Utensils,
  Smartphone,
  Moon,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const ProductTourSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeMoment, setActiveMoment] = useState<number>(0);

  const moments = [
    {
      id: 'morning',
      time: '09:00 AM',
      icon: <Sunrise className="w-5 h-5 text-amber-500" />,
      title: t.dayStory.moment1Title,
      desc: t.dayStory.moment1Desc,
      screen: <InventoryMockup />,
    },
    {
      id: 'lunch',
      time: '01:30 PM',
      icon: <Utensils className="w-5 h-5 text-ember-500" />,
      title: t.dayStory.moment2Title,
      desc: t.dayStory.moment2Desc,
      screen: <BillingMockup />,
    },
    {
      id: 'evening',
      time: '08:15 PM',
      icon: <Smartphone className="w-5 h-5 text-indigo-500" />,
      title: t.dayStory.moment3Title,
      desc: t.dayStory.moment3Desc,
      screen: <LiveOrderFeedMockup />,
    },
    {
      id: 'night',
      time: '11:45 PM',
      icon: <Moon className="w-5 h-5 text-purple-500" />,
      title: t.dayStory.moment4Title,
      desc: t.dayStory.moment4Desc,
      screen: <ReportsMockup />,
    },
  ];

  return (
    <section id="product-tour" className="py-16 sm:py-24 font-sans bg-ink-50/60 dark:bg-ink-900/30 border-t border-ink-200/80 dark:border-ink-800">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="indigo" className="mb-3">
            {t.dayStory.badge}
          </Badge>
          <h2 className="h2-fluid font-bold text-ink-950 dark:text-ink-50 mb-3">
            {t.dayStory.title}
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            {t.dayStory.subtitle}
          </p>
        </div>

        {/* 2-Column Product Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Step Buttons (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5 text-left">
            {moments.map((moment, idx) => {
              const isActive = activeMoment === idx;
              return (
                <button
                  key={moment.id}
                  onClick={() => setActiveMoment(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer focus-ring flex items-start gap-4 ${
                    isActive
                      ? 'bg-white dark:bg-ink-900 border-ember-500 shadow-card ring-1 ring-ember-500/20'
                      : 'bg-white/60 dark:bg-ink-950/40 border-ink-200 dark:border-ink-800 hover:bg-white'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isActive
                        ? 'bg-ember-50 dark:bg-ember-950 text-ember-600'
                        : 'bg-ink-100 dark:bg-ink-800 text-ink-600'
                    }`}
                  >
                    {moment.icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-ember-600 dark:text-ember-400">
                        {moment.time}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-ink-950 dark:bg-ember-500 text-white dark:text-ink-950">
                          Active View
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-ink-950 dark:text-ink-50">
                      {moment.title.split('—')[1]?.trim() || moment.title}
                    </h3>
                    <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
                      {moment.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Live Device Mockup Display (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-2 sm:p-3 rounded-3xl bg-ink-950 border border-ink-800 shadow-elevated">
              <div className="rounded-2xl overflow-hidden">
                {moments[activeMoment].screen}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
