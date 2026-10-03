import React, { useState, useRef, useEffect } from 'react';

export const Dropdown = ({
  trigger,
  children,
  align = 'right', // 'left' | 'right'
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute top-full mt-2 z-50 min-w-[200px]
            bg-white dark:bg-ink-900 
            border border-ink-100 dark:border-ink-800 
            rounded-2xl shadow-lift py-1.5 animate-fade-up
            ${align === 'right' ? 'right-0' : 'left-0'}
            ${className}
          `}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  icon: Icon = null,
  danger = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150 text-left
        ${danger 
          ? 'text-status-rejected hover:bg-status-rejected/10 dark:hover:bg-status-rejected/20' 
          : 'text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800/80 hover:text-ink-900 dark:hover:text-white'}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className={`w-4 h-4 shrink-0 ${danger ? 'text-status-rejected' : 'text-ink-400 dark:text-ink-400'}`} />}
      <span>{children}</span>
    </button>
  );
};

export const DropdownDivider = () => (
  <div className="my-1.5 border-t border-ink-100 dark:border-ink-800" />
);

export default Dropdown;
