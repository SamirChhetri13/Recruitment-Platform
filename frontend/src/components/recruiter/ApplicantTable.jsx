import React, { useState } from 'react';
import { FileText, ExternalLink, Calendar, Eye, User, Sparkles } from 'lucide-react';
import { getStatusBadgeStyle, formatDateAgo } from '../../utils/helpers';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { SkillMatchBadge } from './SkillMatchBadge';
import { ResumePreviewModal } from './ResumePreviewModal';

export const ApplicantTable = ({ applications, onSelectCandidate, onStatusChange }) => {
  const [previewResumeApp, setPreviewResumeApp] = useState(null);

  if (!applications || applications.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-ink-500 dark:text-ink-400 bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 shadow-2xs">
        No applicants found for this job position yet.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-card">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-muted dark:bg-surface-dark-muted text-ink-500 dark:text-ink-400 uppercase tracking-wider font-semibold border-b border-ink-100 dark:border-ink-800 text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Candidate</th>
              <th className="py-3.5 px-4">Skill Match</th>
              <th className="py-3.5 px-4">Applied Date</th>
              <th className="py-3.5 px-4">Resume CV</th>
              <th className="py-3.5 px-4">Status Pipeline</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800 text-ink-900 dark:text-white">
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-ink-50/70 dark:hover:bg-ink-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center font-bold text-white text-xs shadow-2xs">
                      {app.candidate?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-bold text-ink-900 dark:text-white">{app.candidate?.name || 'Candidate'}</p>
                      <p className="text-[11px] text-ink-500 dark:text-ink-400">{app.candidate?.email}</p>
                    </div>
                  </div>
                </td>

                {/* Animated Skill Match Score */}
                <td className="py-3.5 px-4">
                  <SkillMatchBadge
                    score={app.matchScore ?? 100}
                    matchedSkills={app.matchedSkills || []}
                    missingSkills={app.missingSkills || []}
                    variant="compact"
                  />
                </td>

                <td className="py-3.5 px-4 text-ink-500 dark:text-ink-400 font-medium">
                  {formatDateAgo(app.createdAt)}
                </td>

                {/* Resume In-App Preview & External Link */}
                <td className="py-3.5 px-4">
                  {app.resumeUrl ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewResumeApp(app)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 font-semibold text-2xs transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Preview CV
                      </button>
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in new window"
                        className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-ink-400 italic">None</span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <select
                    value={app.status}
                    onChange={(e) => onStatusChange(app._id, e.target.value)}
                    className={`py-1 px-2.5 rounded-lg font-bold text-xs capitalize cursor-pointer border focus:outline-none ${getStatusBadgeStyle(app.status)}`}
                  >
                    {APPLICATION_STATUSES.map((st) => (
                      <option key={st.value} value={st.value} className="bg-white dark:bg-ink-900 text-ink-900 dark:text-white">
                        {st.label}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onSelectCandidate(app)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-700 dark:text-ink-200 border border-ink-200 dark:border-ink-700 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
                    Review Drawer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* In-App Resume Preview Modal */}
      <ResumePreviewModal
        isOpen={Boolean(previewResumeApp)}
        onClose={() => setPreviewResumeApp(null)}
        resumeUrl={previewResumeApp?.resumeUrl}
        candidateName={previewResumeApp?.candidate?.name}
        candidateEmail={previewResumeApp?.candidate?.email}
      />
    </>
  );
};

