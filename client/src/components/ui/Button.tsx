import React from 'react';
import { trackEvent, AnalyticsEventName } from '../../lib/analytics';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'saffron' | 'maroon' | 'outline' | 'ghost' | 'curry';
  size?: 'sm' | 'md' | 'lg';
  analyticsEvent?: AnalyticsEventName;
  eventPayload?: Record<string, unknown>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'saffron',
  size = 'md',
  analyticsEvent,
  eventPayload,
  onClick,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (analyticsEvent) {
      trackEvent(analyticsEvent, eventPayload);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const variants = {
    saffron:
      'bg-saffron-500 hover:bg-saffron-600 text-white shadow-md hover:shadow-saffron-glow focus-visible:ring-saffron-500 active:scale-[0.98]',
    maroon:
      'bg-maroon-900 hover:bg-maroon-950 text-white shadow-md hover:shadow-lg focus-visible:ring-maroon-900 active:scale-[0.98]',
    outline:
      'border-2 border-maroon-900/20 hover:border-maroon-900 dark:border-cream-200/20 dark:hover:border-cream-50 text-maroon-900 dark:text-cream-50 bg-transparent hover:bg-maroon-900/5 dark:hover:bg-cream-50/5',
    ghost:
      'text-maroon-900 dark:text-cream-50 hover:bg-cream-200/60 dark:hover:bg-maroon-900/40 border border-transparent',
    curry:
      'bg-curry-600 hover:bg-curry-700 text-white shadow-md focus-visible:ring-curry-500 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer focus-ring font-sans disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      onClick={handleClick}
      data-event={analyticsEvent}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
