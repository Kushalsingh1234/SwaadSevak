import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'ember' | 'indigo' | 'success' | 'outline' | 'neutral';
  size?: 'sm' | 'md';
  pulseDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'ember',
  size = 'md',
  pulseDot = false,
  ...props
}) => {
  const variants = {
    ember:
      'bg-ember-50 dark:bg-ember-950/80 text-ember-700 dark:text-ember-300 border-ember-200 dark:border-ember-800',
    indigo:
      'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    success:
      'bg-success-50 dark:bg-success-950/80 text-success-700 dark:text-success-300 border-success-200 dark:border-success-800',
    outline:
      'bg-transparent text-ink-700 dark:text-ink-300 border-ink-300 dark:border-ink-700',
    neutral:
      'bg-ink-100 dark:bg-ink-800 text-ink-800 dark:text-ink-200 border-ink-200 dark:border-ink-700',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-xs font-semibold tracking-wide',
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
