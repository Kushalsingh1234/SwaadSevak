import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'saffron' | 'maroon' | 'curry' | 'outline' | 'neutral';
  size?: 'sm' | 'md';
  pulseDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'saffron',
  size = 'md',
  pulseDot = false,
  ...props
}) => {
  const variants = {
    saffron: 'bg-saffron-100 dark:bg-saffron-950/70 text-saffron-800 dark:text-saffron-300 border-saffron-200 dark:border-saffron-800/60',
    maroon: 'bg-maroon-100 dark:bg-maroon-900/60 text-maroon-900 dark:text-maroon-200 border-maroon-200 dark:border-maroon-800',
    curry: 'bg-curry-50 dark:bg-curry-950/60 text-curry-700 dark:text-curry-300 border-curry-200 dark:border-curry-800/60',
    outline: 'bg-transparent text-maroon-900 dark:text-cream-100 border-maroon-300 dark:border-maroon-700',
    neutral: 'bg-cream-200 dark:bg-maroon-900/50 text-maroon-800 dark:text-cream-200 border-cream-300 dark:border-maroon-800',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3.5 py-1 text-xs sm:text-sm font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-sans uppercase tracking-wider',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {pulseDot && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};
