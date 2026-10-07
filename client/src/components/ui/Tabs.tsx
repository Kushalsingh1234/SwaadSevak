import React from 'react';
import { cn } from '../../lib/utils';
import { trackEvent } from '../../lib/analytics';

export interface TabItem {
  id: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pill' | 'ticket' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'ticket',
}) => {
  const handleTabClick = (id: string) => {
    onChange(id);
    trackEvent('outlet_tab_change', { tabId: id });
  };

  return (
    <div
      role="tablist"
      aria-label="Selection Tabs"
      className={cn(
        'flex flex-wrap items-center justify-start sm:justify-center gap-2 p-1.5 rounded-2xl bg-cream-100 dark:bg-maroon-900/60 border border-receipt-divider dark:border-maroon-800/60 overflow-x-auto no-scrollbar',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer focus-ring',
              isActive
                ? 'bg-saffron-500 text-white shadow-md shadow-saffron-500/20'
                : 'text-maroon-900/70 dark:text-cream-200/70 hover:text-maroon-950 dark:hover:text-cream-50 hover:bg-cream-200/50 dark:hover:bg-maroon-800/40'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-cream-300 dark:bg-maroon-800 text-maroon-900 dark:text-cream-200'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
