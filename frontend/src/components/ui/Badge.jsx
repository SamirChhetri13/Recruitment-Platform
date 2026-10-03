import React from 'react';

export const Badge = ({
  children,
  variant = 'brand',
  size = 'md',
  className = '',
  icon: Icon = null,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
    lg: 'text-sm px-3 py-1.5 font-semibold gap-1.5',
  };

  // Himal status mappings
  const variantStyles = {
    // Himal status tokens
    applied: 'bg-status-applied/15 text-status-applied border border-status-applied/30 dark:bg-status-applied/25 dark:text-sky-300',
    shortlisted: 'bg-status-shortlisted/15 text-status-shortlisted border border-status-shortlisted/30 dark:bg-status-shortlisted/25 dark:text-sun-300',
    hired: 'bg-status-hired/15 text-status-hired border border-status-hired/30 dark:bg-status-hired/25 dark:text-emerald-300',
    rejected: 'bg-status-rejected/15 text-status-rejected border border-status-rejected/30 dark:bg-status-rejected/25 dark:text-rose-300',
    
    // Generic semantics
    info: 'bg-status-info/15 text-status-info border border-status-info/30 dark:bg-status-info/25 dark:text-sky-300',
    success: 'bg-status-success/15 text-status-success border border-status-success/30 dark:bg-status-success/25 dark:text-emerald-300',
    warning: 'bg-status-warning/15 text-status-warning border border-status-warning/30 dark:bg-status-warning/25 dark:text-sun-300',
    danger: 'bg-status-danger/15 text-status-danger border border-status-danger/30 dark:bg-status-danger/25 dark:text-rose-300',
    
    // Brand & Neutral
    brand: 'bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800',
    sun: 'bg-sun-50 text-sun-700 border border-sun-200 dark:bg-sun-950/60 dark:text-sun-300 dark:border-sun-800',
    neutral: 'bg-ink-100 text-ink-700 border border-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:border-ink-700',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full tracking-wide transition-colors
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant.toLowerCase()] || variantStyles.brand}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
