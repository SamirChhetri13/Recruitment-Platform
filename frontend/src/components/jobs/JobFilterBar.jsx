import React from 'react';
import { Search, MapPin, Briefcase, Award, X, SlidersHorizontal, ArrowUpDown, DollarSign } from 'lucide-react';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';
import { Card, Input, Button } from '../ui';

export const JobFilterBar = ({ filters, onFilterChange, onResetFilters, sortBy, onSortChange }) => {
  const hasActiveFilters = Boolean(
    filters.search || filters.location || filters.jobType || filters.experienceLevel || filters.salaryMin
  );

  return (
    <Card className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-ink-100 dark:border-ink-800 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-ink-900 dark:text-white font-bold text-sm font-display">
          <SlidersHorizontal className="w-4 h-4 text-brand-600 dark:text-brand-300" />
          <span>Search & Filter Vacancies</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
            <select
              value={sortBy}
              aria-label="Sort openings"
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-white font-semibold text-xs cursor-pointer focus:outline-none focus:shadow-focus"
            >
              <option value="latest">Sort: Latest First</option>
              <option value="salary">Sort: Highest Salary</option>
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="danger"
              onClick={onResetFilters}
              leftIcon={X}
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Keyword Search */}
        <Input
          placeholder="Title, skills or keywords..."
          leftIcon={Search}
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />

        {/* Location input */}
        <Input
          placeholder="Location (e.g. Remote, SF)..."
          leftIcon={MapPin}
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
        />

        {/* Job Type */}
        <div className="relative flex items-center">
          <Briefcase className="w-4 h-4 absolute left-3.5 text-ink-400 pointer-events-none" />
          <select
            value={filters.jobType}
            aria-label="Filter by job type"
            onChange={(e) => onFilterChange('jobType', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100 focus:outline-none focus:shadow-focus cursor-pointer appearance-none"
          >
            {JOB_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div className="relative flex items-center">
          <Award className="w-4 h-4 absolute left-3.5 text-ink-400 pointer-events-none" />
          <select
            value={filters.experienceLevel}
            aria-label="Filter by experience level"
            onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100 focus:outline-none focus:shadow-focus cursor-pointer appearance-none"
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary Filter Slider */}
      <div className="pt-2 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between text-xs text-ink-500 dark:text-ink-400 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-status-hired" />
          <span className="font-semibold text-ink-900 dark:text-white">Minimum Salary Filter:</span>
          <span className="font-bold text-status-hired">
            {filters.salaryMin ? `$${Number(filters.salaryMin).toLocaleString()}` : 'Any'}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="range"
            aria-label="Minimum salary range filter"
            min="0"
            max="200000"
            step="10000"
            value={filters.salaryMin || 0}
            onChange={(e) => onFilterChange('salaryMin', Number(e.target.value) || '')}
            className="w-48 accent-brand-600 cursor-pointer min-h-[44px]"
          />
          {filters.salaryMin > 0 && (
            <button
              onClick={() => onFilterChange('salaryMin', '')}
              type="button"
              className="text-xs font-semibold text-ink-400 hover:text-ink-800 dark:hover:text-white underline px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default JobFilterBar;
