import React from 'react';
import { cn } from '../../lib/utils';

export interface ReceiptCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  sawtooth?: 'top' | 'bottom' | 'both' | 'none';
  hasTearLine?: boolean;
  ticketNumber?: string;
  ticketTime?: string;
  ticketType?: string;
  theme?: 'paper' | 'dark' | 'yellow' | 'green';
  compact?: boolean;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  children,
  className,
  sawtooth = 'none',
  hasTearLine = false,
  ticketNumber,
  ticketTime,
  ticketType,
  theme = 'paper',
  compact = false,
  ...props
}) => {
  const themeClasses = {
    paper: 'bg-paper text-maroon-950 dark:bg-paper-dark dark:text-cream-100 border-receipt-divider/70 dark:border-maroon-800/40',
    dark: 'bg-maroon-950 text-cream-50 border-maroon-800/60',
    yellow: 'bg-receipt-yellow/90 text-maroon-950 border-amber-200/80',
    green: 'bg-curry-50 text-curry-900 border-curry-200',
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl shadow-receipt border transition-all duration-300',
        compact ? 'p-4' : 'p-6 sm:p-8',
        sawtooth === 'top' && 'receipt-sawtooth-top mt-2',
        sawtooth === 'bottom' && 'receipt-sawtooth-bottom mb-2',
        sawtooth === 'both' && 'receipt-sawtooth-top receipt-sawtooth-bottom my-2',
        themeClasses[theme],
        className
      )}
      {...props}
    >
      {(ticketNumber || ticketTime || ticketType) && (
        <div className="flex items-center justify-between border-b border-dashed border-receipt-divider dark:border-maroon-800/50 pb-3 mb-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            {ticketNumber && <span className="font-bold text-saffron-600 dark:text-saffron-400">{ticketNumber}</span>}
            {ticketType && <span className="px-2 py-0.5 rounded bg-maroon-100 dark:bg-maroon-900 text-maroon-800 dark:text-cream-200 text-[10px] font-sans font-semibold uppercase">{ticketType}</span>}
          </div>
          {ticketTime && <span className="text-receipt-faint">{ticketTime}</span>}
        </div>
      )}

      {children}

      {hasTearLine && (
        <div className="relative my-5">
          <div className="receipt-tear-line w-full" />
          <div className="absolute -left-8 sm:-left-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cream-50 dark:bg-cream-bg" />
          <div className="absolute -right-8 sm:-right-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cream-50 dark:bg-cream-bg" />
        </div>
      )}
    </div>
  );
};
