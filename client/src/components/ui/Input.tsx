import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, prefixElement, className, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left font-sans">
        {label && (
          <label htmlFor={inputId} className="text-xs sm:text-sm font-semibold text-maroon-950 dark:text-cream-100">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3.5 pointer-events-none text-maroon-700/60 dark:text-cream-300/60 font-medium text-sm flex items-center">
              {prefixElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border bg-paper dark:bg-maroon-900/50 text-maroon-950 dark:text-cream-50 placeholder:text-maroon-900/40 dark:placeholder:text-cream-300/40 text-sm transition-all focus-ring shadow-sm',
              prefixElement ? 'pl-12' : 'pl-4',
              error
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-receipt-divider dark:border-maroon-800 focus:border-saffron-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</span>}
        {helperText && !error && <span className="text-xs text-maroon-700/70 dark:text-cream-300/70">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left font-sans">
        {label && (
          <label htmlFor={selectId} className="text-xs sm:text-sm font-semibold text-maroon-950 dark:text-cream-100">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border bg-paper dark:bg-maroon-900/50 text-maroon-950 dark:text-cream-50 text-sm transition-all focus-ring shadow-sm cursor-pointer',
            error
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-receipt-divider dark:border-maroon-800 focus:border-saffron-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-paper dark:bg-maroon-950 text-maroon-950 dark:text-cream-50">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
