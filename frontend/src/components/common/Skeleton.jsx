import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-800/60 border border-slate-700/40 ${className}`} />
  );
};

export const JobCardSkeleton = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 bg-slate-900/60 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0" />
          <div className="space-y-2">
            <div className="w-44 h-4 bg-slate-800 rounded-md" />
            <div className="w-32 h-3 bg-slate-800/70 rounded-md" />
          </div>
        </div>
        <div className="w-16 h-6 bg-slate-800 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-800/60 rounded-md" />
        <div className="w-4/5 h-3 bg-slate-800/60 rounded-md" />
      </div>
      <div className="flex gap-2">
        <div className="w-14 h-5 bg-slate-800 rounded-md" />
        <div className="w-16 h-5 bg-slate-800 rounded-md" />
        <div className="w-12 h-5 bg-slate-800 rounded-md" />
      </div>
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="w-24 h-4 bg-slate-800/70 rounded-md" />
        <div className="w-20 h-8 bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="w-24 h-3 bg-slate-800/70 rounded" />
        <div className="w-10 h-10 rounded-xl bg-slate-800" />
      </div>
      <div className="w-16 h-8 bg-slate-800 rounded-lg" />
      <div className="w-32 h-3 bg-slate-800/50 rounded" />
    </div>
  );
};

export const ApplicantRowSkeleton = () => {
  return (
    <div className="p-4 rounded-xl glass-panel bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-800 shrink-0" />
        <div className="space-y-1.5">
          <div className="w-32 h-3.5 bg-slate-800 rounded" />
          <div className="w-44 h-3 bg-slate-800/60 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-20 h-6 bg-slate-800 rounded-full" />
        <div className="w-24 h-8 bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
};
