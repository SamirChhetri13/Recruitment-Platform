import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse rounded-xl bg-ink-200/60 dark:bg-ink-800/80 border border-ink-100 dark:border-ink-800/50 ${className}`} />
  );
};

export const JobCardSkeleton = () => {
  return (
    <div className="p-6 rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card animate-pulse space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-ink-200 dark:bg-ink-800 shrink-0" />
          <div className="space-y-2">
            <div className="w-44 h-4 bg-ink-200 dark:bg-ink-800 rounded-md" />
            <div className="w-32 h-3 bg-ink-100 dark:bg-ink-800/60 rounded-md" />
          </div>
        </div>
        <div className="w-16 h-6 bg-ink-200 dark:bg-ink-800 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-ink-100 dark:bg-ink-800/60 rounded-md" />
        <div className="w-4/5 h-3 bg-ink-100 dark:bg-ink-800/60 rounded-md" />
      </div>
      <div className="flex gap-2">
        <div className="w-14 h-5 bg-ink-200 dark:bg-ink-800 rounded-md" />
        <div className="w-16 h-5 bg-ink-200 dark:bg-ink-800 rounded-md" />
        <div className="w-12 h-5 bg-ink-200 dark:bg-ink-800 rounded-md" />
      </div>
      <div className="pt-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
        <div className="w-24 h-4 bg-ink-100 dark:bg-ink-800/60 rounded-md" />
        <div className="w-20 h-8 bg-ink-200 dark:bg-ink-800 rounded-lg" />
      </div>
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="p-6 rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="w-24 h-3 bg-ink-200 dark:bg-ink-800 rounded" />
        <div className="w-10 h-10 rounded-xl bg-ink-200 dark:bg-ink-800" />
      </div>
      <div className="w-16 h-8 bg-ink-200 dark:bg-ink-800 rounded-lg" />
      <div className="w-32 h-3 bg-ink-100 dark:bg-ink-800/50 rounded" />
    </div>
  );
};

export const ApplicantRowSkeleton = () => {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 flex items-center justify-between gap-4 animate-pulse shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-ink-200 dark:bg-ink-800 shrink-0" />
        <div className="space-y-1.5">
          <div className="w-32 h-3.5 bg-ink-200 dark:bg-ink-800 rounded" />
          <div className="w-44 h-3 bg-ink-100 dark:bg-ink-800/60 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-20 h-6 bg-ink-200 dark:bg-ink-800 rounded-full" />
        <div className="w-24 h-8 bg-ink-200 dark:bg-ink-800 rounded-lg" />
      </div>
    </div>
  );
};

export default Skeleton;
