import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'md',
  as: Component = 'div',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <Component
      className={`
        bg-white dark:bg-ink-900 
        border border-ink-100 dark:border-ink-800 
        rounded-2xl shadow-card 
        transition-all duration-200 
        ${hoverEffect ? 'hover:shadow-lift hover:border-brand-200 dark:hover:border-brand-800/60 hover:-translate-y-0.5' : ''}
        ${paddingStyles[padding] || paddingStyles.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between pb-4 mb-4 border-b border-ink-100 dark:border-ink-800 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-ink-900 dark:text-white font-display tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-ink-500 dark:text-ink-400 mt-1 ${className}`}>
    {children}
  </p>
);

export default Card;
