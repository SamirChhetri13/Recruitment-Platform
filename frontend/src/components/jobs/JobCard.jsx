import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, DollarSign, Clock, Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import { formatSalary, formatDateAgo } from '../../utils/helpers';
import { Card, Badge, Avatar, Button } from '../ui';
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
      // Keep local state fallback
    }
  };

  return (
    <Card hoverEffect className="flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        {/* Top bar with company logo, title & bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 font-bold flex items-center justify-center shrink-0 border border-brand-200 dark:border-brand-800/60 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <Link to={`/jobs/${job._id}`}>
                <h3 className="text-base font-bold text-ink-900 dark:text-white font-display group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors line-clamp-1">
                  {job.title}
                </h3>
              </Link>
              <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 flex items-center gap-1.5 mt-0.5">
                <span>{job.company}</span>
                <span className="text-ink-300 dark:text-ink-600">•</span>
                <span className="flex items-center gap-1 text-ink-400 font-normal">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleBookmark}
              type="button"
              aria-label={isBookmarked ? 'Remove Bookmark' : 'Save Vacancy'}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Vacancy'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-sun-50 text-sun-600 border-sun-300 dark:bg-sun-950/60 dark:text-sun-300 dark:border-sun-800'
                  : 'text-ink-400 border-ink-200 dark:border-ink-700 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <Badge variant="brand" size="sm" className="capitalize">
              {job.jobType}
            </Badge>
          </div>
        </div>

        {/* Short description preview */}
        <p className="text-xs text-ink-500 dark:text-ink-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border border-ink-200 dark:border-ink-700"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-2xs text-ink-400 font-medium">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Action CTAs */}
      <div className="pt-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex items-center gap-1 text-status-hired font-bold">
            <DollarSign className="w-3.5 h-3.5" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
          <span className="text-ink-300 dark:text-ink-600">•</span>
          <span className="flex items-center gap-1 text-ink-400 text-2xs">
            <Clock className="w-3.5 h-3.5" />
            {formatDateAgo(job.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onQuickApply && job.status === 'open' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onQuickApply(job)}
              leftIcon={Sparkles}
            >
              Apply
            </Button>
          )}

          <Link to={`/jobs/${job._id}`}>
            <Button size="sm" variant="secondary" rightIcon={ArrowRight}>
              Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
