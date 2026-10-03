import React from 'react';

/**
 * Himal Design System - Button Primitive
 * 
 * Variants:
 * - primary: Deep Teal brand gradient (bg-brand-gradient)
 * - accent: Saffron sun gradient with shadow-cta (RESERVED FOR SINGLE TOP CTA PER VIEWPORT)
 * - secondary: Subtle ink surface with ink border
 * - ghost: Transparent background with ink hover
 * - outline: Brand teal border & text
 * - danger: Rose status background
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-sm px-4 py-2.5 min-h-[44px] gap-2',
    lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-brand-gradient text-white shadow-sm hover:brightness-105 active:brightness-95 hover:shadow-lift',
    accent: 'bg-sun-gradient text-white font-semibold shadow-cta hover:brightness-105 active:brightness-95',
    secondary: 'bg-ink-100 dark:bg-ink-800 text-ink-800 dark:text-ink-100 hover:bg-ink-200 dark:hover:bg-ink-700 border border-ink-200 dark:border-ink-700',
    outline: 'border border-brand-600 text-brand-600 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40',
    ghost: 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60 hover:text-ink-900 dark:hover:text-white',
    danger: 'bg-status-danger text-white hover:brightness-105 shadow-sm',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
