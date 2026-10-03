import React from 'react';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'segmented', // 'segmented' | 'underline'
  className = '',
}) => {
  if (variant === 'segmented') {
    return (
      <div className={`inline-flex p-1 bg-ink-100 dark:bg-ink-800 rounded-xl border border-ink-200 dark:border-ink-700/60 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 select-none
                ${isActive
                  ? 'bg-white dark:bg-ink-900 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'}
              `}
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.5 text-2xs rounded-full ${isActive ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300' : 'bg-ink-200 dark:bg-ink-700 text-ink-700 dark:text-ink-300'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex border-b border-ink-200 dark:border-ink-800 gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 py-3 text-sm font-semibold border-b-2 transition-all duration-150 select-none -mb-px
              ${isActive
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-300'
                : 'border-transparent text-ink-500 hover:text-ink-800 dark:hover:text-ink-200'}
            `}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
