import React from 'react';
import { trackEvent, AnalyticsEventName } from '../../lib/analytics';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ember' | 'ink' | 'outline' | 'ghost' | 'indigo';
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
  variant = 'ember',
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
    // Primary Ember Gradient with near-black ink text (#0B1220) for strict WCAG AA contrast
    ember:
      'bg-gradient-ember text-ink-950 font-bold shadow-soft hover:shadow-glow-ember focus-visible:ring-ember-500 active:scale-[0.98]',
    ink:
      'bg-ink-950 hover:bg-ink-900 text-white font-semibold shadow-soft focus-visible:ring-ink-500 active:scale-[0.98]',
    outline:
      'border border-ink-200 dark:border-ink-800 hover:border-ink-400 dark:hover:border-ink-600 text-ink-950 dark:text-ink-50 bg-white dark:bg-ink-900 hover:bg-ink-50 dark:hover:bg-ink-800 font-semibold shadow-soft',
    ghost:
      'text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 hover:bg-ink-100 dark:hover:bg-ink-800 font-semibold',
    indigo:
      'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-soft focus-visible:ring-indigo-500 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer focus-ring font-sans disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden',
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
