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
          <label htmlFor={inputId} className="text-xs sm:text-sm font-bold text-espresso">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3.5 pointer-events-none text-bodyText font-medium text-sm flex items-center">
              {prefixElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border bg-white text-espresso placeholder:text-sand-300 text-sm transition-all focus-ring shadow-soft',
              prefixElement ? 'pl-12' : 'pl-4',
              error
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-sand-200 focus:border-orange-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
        {helperText && !error && <span className="text-xs text-bodyText">{helperText}</span>}
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
          <label htmlFor={selectId} className="text-xs sm:text-sm font-bold text-espresso">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border bg-white text-espresso text-sm transition-all focus-ring shadow-soft cursor-pointer',
            error
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-sand-200 focus:border-orange-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-espresso">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
