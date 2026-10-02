import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, DollarSign, Clock, Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import { formatSalary, formatDateAgo } from '../../utils/helpers';
import { Badge } from '../common/Badge';

import { toggleJobBookmark } from '../../api/jobs.api';

export const JobCard = ({ job, onQuickApply, onBookmarkToggle }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarked_jobs') || '[]');
    setIsBookmarked(savedBookmarks.includes(job._id));
  }, [job._id]);

  const toggleBookmark = async (e) => {
    e.stopPropagation();
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarked_jobs') || '[]');
    let updated;
    if (isBookmarked) {
      updated = savedBookmarks.filter((id) => id !== job._id);
    } else {
      updated = [...savedBookmarks, job._id];
    }
    localStorage.setItem('bookmarked_jobs', JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);

    try {
      await toggleJobBookmark(job._id);
      onBookmarkToggle?.(job._id, !isBookmarked);
    } catch (err) {
      // Keep local state if backend route fails
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 group bg-white/80 dark:bg-slate-900/60 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="space-y-3">
        {/* Top bar with logo, title, and Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>{job.company}</span>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-normal">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {job.location}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleBookmark}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Vacancy'}
              className={`p-1.5 rounded-lg border transition-all ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/40'
                  : 'text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <Badge variant={job.status === 'open' ? 'success' : 'default'} className="capitalize">
              {job.jobType}
            </Badge>
          </div>
        </div>

        {/* Short description preview */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-slate-800/90 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700/60"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Action CTAs */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <DollarSign className="w-3.5 h-3.5" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            {formatDateAgo(job.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onQuickApply && job.status === 'open' && (
            <button
              onClick={() => onQuickApply(job)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apply
            </button>
          )}

          <Link
            to={`/jobs/${job._id}`}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1"
          >
            Details
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
