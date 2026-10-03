import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        className={`
          w-full ${maxWidth} 
          bg-white dark:bg-ink-900 
          border border-ink-100 dark:border-ink-800 
          rounded-2xl shadow-lift overflow-hidden 
          flex flex-col max-h-[90vh]
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between bg-surface-muted dark:bg-surface-dark-muted">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-ink-900 dark:text-white font-display tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors focus:outline-none focus:shadow-focus"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-ink-800 dark:text-ink-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
