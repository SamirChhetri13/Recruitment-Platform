import React from 'react';

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  className = '',
  status = null, // 'online' | 'offline' | 'busy'
  ...props
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-2xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const statusColors = {
    online: 'bg-status-hired',
    offline: 'bg-ink-400',
    busy: 'bg-status-rejected',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`} {...props}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={`
            rounded-full object-cover border border-ink-200 dark:border-ink-700
            ${sizeStyles[size] || sizeStyles.md}
          `}
          onError={(e) => {
            // Hide broken image link to show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : null}

      {(!src) && (
        <div
          className={`
            rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200
            font-semibold flex items-center justify-center border border-brand-300 dark:border-brand-700 select-none
            ${sizeStyles[size] || sizeStyles.md}
          `}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-ink-900
            ${statusColors[status] || statusColors.online}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
