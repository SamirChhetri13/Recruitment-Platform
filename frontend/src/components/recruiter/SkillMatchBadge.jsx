import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

/**
 * Returns color classes and hex codes based on match percentage.
 */
export const getScoreColorTokens = (score = 0) => {
  if (score >= 80) {
    return {
      text: 'text-status-hired dark:text-emerald-400',
      bg: 'bg-status-hired/10 dark:bg-emerald-950/40',
      border: 'border-status-hired/30 dark:border-emerald-700/40',
      ringColor: '#1FA67A',
      strokeTrack: 'stroke-emerald-100 dark:stroke-emerald-950/60',
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      label: 'High Match',
    };
  }
  if (score >= 50) {
    return {
      text: 'text-sun-600 dark:text-sun-400',
      bg: 'bg-sun-500/10 dark:bg-sun-950/40',
      border: 'border-sun-500/30 dark:border-sun-700/40',
      ringColor: '#EF820D',
      strokeTrack: 'stroke-amber-100 dark:stroke-amber-950/60',
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      label: 'Moderate Match',
    };
  }
  return {
    text: 'text-status-rejected dark:text-rose-400',
    bg: 'bg-status-rejected/10 dark:bg-rose-950/40',
    border: 'border-status-rejected/30 dark:border-rose-700/40',
    ringColor: '#E0526A',
    strokeTrack: 'stroke-rose-100 dark:stroke-rose-950/60',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    label: 'Low Match',
  };
};

/**
 * Reusable animated skill match score badge and detailed breakdown card.
 */
export const SkillMatchBadge = ({
  score = 0,
  matchedSkills = [],
  missingSkills = [],
  variant = 'compact', // 'compact' | 'detailed' | 'ring-only'
  showTooltip = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const safeScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const tokens = getScoreColorTokens(safeScore);

  const radius = variant === 'detailed' ? 36 : 14;
  const strokeWidth = variant === 'detailed' ? 6 : 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;
  const totalSkills = matchedSkills.length + missingSkills.length;

  // Compact Pill / Badge Variant for Kanban Cards and Table rows
  if (variant === 'compact') {
    return (
      <div
        className="relative inline-flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          whileHover={{ scale: 1.04 }}
          className={`
            inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full 
            border text-2xs font-bold transition-all shadow-2xs select-none
            ${tokens.bg} ${tokens.border} ${tokens.text} ${className}
          `}
        >
          {/* Circular SVG Mini Meter */}
          <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-20"
              />
              <motion.circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 14}
                initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 14 - (safeScore / 100) * (2 * Math.PI * 14) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span className="tracking-tight">{safeScore}%</span>
          <span className="opacity-75 font-medium hidden sm:inline">Match</span>
        </motion.div>

        {/* Hover Popover Breakdown */}
        {showTooltip && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 bottom-full mb-2 left-0 w-60 p-3 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 shadow-lift pointer-events-none text-left"
              >
                <div className="flex items-center justify-between pb-2 border-b border-ink-100 dark:border-ink-800">
                  <span className="text-2xs font-extrabold text-ink-900 dark:text-white flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-500" /> Skill Alignment
                  </span>
                  <span className={`text-2xs font-bold ${tokens.text}`}>{safeScore}% Match</span>
                </div>

                <div className="mt-2 space-y-2 text-2xs">
                  {matchedSkills.length > 0 && (
                    <div>
                      <p className="text-ink-500 dark:text-ink-400 font-semibold mb-1 flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-status-hired" /> Matched ({matchedSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {matchedSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {missingSkills.length > 0 && (
                    <div>
                      <p className="text-ink-500 dark:text-ink-400 font-semibold mb-1 flex items-center gap-1 text-[10px]">
                        <AlertCircle className="w-3 h-3 text-status-rejected" /> Missing ({missingSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {missingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700 font-medium text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {totalSkills === 0 && (
                    <p className="text-ink-400 italic text-[11px]">No skill requirements specified.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  }

  // Detailed Card Variant for Drawer / Candidate View
  return (
    <div className={`p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-card space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-ink-100 dark:border-ink-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink-900 dark:text-white">Skill Alignment & Match Score</h4>
            <p className="text-[11px] text-ink-500 dark:text-ink-400">
              Compared with required job vacancy specifications
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-2xs font-extrabold border ${tokens.badgeClass}`}>
          {tokens.label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Animated Circular Meter */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 90 90">
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-ink-100 dark:text-ink-800"
            />
            <motion.circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke={tokens.ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-xl font-extrabold tracking-tight ${tokens.text}`}>
              {safeScore}%
            </span>
            <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">
              Match
            </span>
          </div>
        </div>

        {/* Stats summary */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center justify-between text-2xs font-medium text-ink-600 dark:text-ink-300">
            <span>Matched Requirements</span>
            <span className="font-bold text-ink-900 dark:text-white">
              {matchedSkills.length} of {totalSkills} skills
            </span>
          </div>
          {/* Progress bar line */}
          <div className="w-full h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${safeScore}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                safeScore >= 80 ? 'bg-status-hired' : safeScore >= 50 ? 'bg-sun-500' : 'bg-status-rejected'
              }`}
            />
          </div>
          <p className="text-[11px] text-ink-500 dark:text-ink-400">
            {safeScore >= 80
              ? 'Strong candidate profile alignment with the core tech stack.'
              : safeScore >= 50
              ? 'Candidate meets several key requirements, but misses some stack skills.'
              : 'Candidate profile shows limited overlap with required job skills.'}
          </p>
        </div>
      </div>

      {/* Matched vs Missing Skills Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-ink-100 dark:border-ink-800">
        {/* Matched Skills Column */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-2xs font-bold text-status-hired dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Matched Skills ({matchedSkills.length})</span>
          </div>
          {matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg text-2xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 inline-flex items-center gap-1"
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-2xs text-ink-400 italic">No skills matched directly</p>
          )}
        </div>

        {/* Missing Skills Column */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-2xs font-bold text-status-rejected dark:text-rose-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Missing / Unverified ({missingSkills.length})</span>
          </div>
          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg text-2xs font-semibold bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-700/80 inline-flex items-center gap-1"
                >
                  <AlertCircle className="w-2.5 h-2.5 opacity-60" />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-2xs text-status-hired dark:text-emerald-400 font-medium">All required skills matched! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillMatchBadge;
