import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { trackEvent } from '../../lib/analytics';

export interface AccordionItemData {
  id: string;
  title: string;
  content: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || '']);

  const toggle = (id: string) => {
    trackEvent('faq_expand', { questionId: id });
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('divide-y divide-receipt-divider dark:divide-maroon-800/60 rounded-2xl border border-receipt-divider dark:border-maroon-800/60 bg-paper dark:bg-paper-dark shadow-sm overflow-hidden', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="transition-colors">
            <button
              type="button"
              className="flex w-full items-center justify-between p-5 sm:p-6 text-left font-sans font-semibold text-base sm:text-lg text-maroon-950 dark:text-cream-50 hover:bg-cream-100/60 dark:hover:bg-maroon-900/30 focus-ring cursor-pointer"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              id={`accordion-btn-${item.id}`}
            >
              <span className="pr-4">{item.title}</span>
              <span className={`shrink-0 transition-transform duration-200 text-saffron-600 dark:text-saffron-400 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5" />
              </span>
            </button>
            <div
              id={`accordion-panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-btn-${item.id}`}
              className={cn(
                'grid transition-all duration-200 ease-in-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
              )}
            >
              <div className="overflow-hidden">
                <div className="p-5 sm:p-6 pt-0 text-sm sm:text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed border-t border-dashed border-receipt-divider/50 dark:border-maroon-800/30 mt-1">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
