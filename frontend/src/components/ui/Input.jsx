import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(({
  label,
  hint,
  error,
  type = 'text',
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  className = '',
  containerClassName = '',
  id,
  isPasswordToggleable = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const actualType = isPasswordToggleable
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs font-semibold text-ink-700 dark:text-ink-300 tracking-wide uppercase"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3.5 text-ink-400 dark:text-ink-500 pointer-events-none">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={actualType}
          className={`
            w-full px-3.5 py-2.5 text-sm rounded-xl transition-all duration-150
            bg-white dark:bg-ink-900 
            text-ink-900 dark:text-ink-100 
            placeholder:text-ink-400 dark:placeholder:text-ink-500
            border ${error ? 'border-status-rejected ring-1 ring-status-rejected/30' : 'border-ink-200 dark:border-ink-700 focus:border-brand-500 dark:focus:border-brand-400'}
            focus:outline-none focus:shadow-focus
            disabled:bg-ink-100 dark:disabled:bg-ink-950 disabled:cursor-not-allowed disabled:opacity-60
            ${LeftIcon ? 'pl-10' : ''}
            ${(RightIcon || isPasswordToggleable) ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />

        {isPasswordToggleable ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-ink-400 hover:text-ink-600 dark:text-ink-500 dark:hover:text-ink-300 focus:outline-none p-1 rounded-lg"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : RightIcon ? (
          <div className="absolute right-3.5 text-ink-400 dark:text-ink-500 pointer-events-none">
            <RightIcon className="w-4 h-4" />
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs text-status-rejected flex items-center gap-1 font-medium mt-0.5 animate-fade-up">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-500 dark:text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
