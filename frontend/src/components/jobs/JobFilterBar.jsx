import React from 'react';
import { Search, MapPin, Briefcase, Award, X, SlidersHorizontal, ArrowUpDown, DollarSign } from 'lucide-react';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';

export const JobFilterBar = ({ filters, onFilterChange, onResetFilters, sortBy, onSortChange }) => {
  const hasActiveFilters = Boolean(
    filters.search || filters.location || filters.jobType || filters.experienceLevel || filters.salaryMin || filters.salaryMax
  );

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Search & Filter Openings</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-700/80 focus:outline-none cursor-pointer"
            >
              <option value="latest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">Sort: Latest First</option>
              <option value="salary" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">Sort: Highest Salary</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold transition-colors bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Keyword Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Title, skills or keywords..."
            className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        {/* Location input */}
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            placeholder="Location (e.g. Remote, SF)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        {/* Job Type */}
        <div className="relative">
          <Briefcase className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <select
            value={filters.jobType}
            onChange={(e) => onFilterChange('jobType', e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs appearance-none bg-white dark:bg-slate-900 cursor-pointer text-slate-800 dark:text-slate-200"
          >
            {JOB_TYPES.map((type) => (
              <option key={type.value} value={type.value} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div className="relative">
          <Award className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <select
            value={filters.experienceLevel}
            onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs appearance-none bg-white dark:bg-slate-900 cursor-pointer text-slate-800 dark:text-slate-200"
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary Filter Row */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Minimum Salary Filter:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {filters.salaryMin ? `$${filters.salaryMin.toLocaleString()}` : 'Any'}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="range"
            min="0"
            max="200000"
            step="10000"
            value={filters.salaryMin || 0}
            onChange={(e) => onFilterChange('salaryMin', Number(e.target.value) || '')}
            className="w-48 accent-blue-600 cursor-pointer"
          />
          {filters.salaryMin > 0 && (
            <button
              onClick={() => onFilterChange('salaryMin', '')}
              className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
