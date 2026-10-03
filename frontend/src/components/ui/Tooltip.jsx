import React, { useState } from 'react';

export const Tooltip = ({
  content,
  children,
  position = 'top', // 'top' | 'bottom' | 'left' | 'right'
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) return children;

  const positionStyles = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`
            absolute z-50 whitespace-nowrap px-2.5 py-1 text-xs font-medium
            bg-ink-900 text-white dark:bg-white dark:text-ink-900
            rounded-lg shadow-lift pointer-events-none animate-fade-up
            ${positionStyles[position] || positionStyles.top}
            ${className}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
