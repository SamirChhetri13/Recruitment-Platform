import React, { useState } from 'react';
import { User, Mail, FileText, ExternalLink, Calendar, Eye, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { getStatusBadgeStyle, formatDateAgo } from '../../utils/helpers';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { updateApplicationStatus } from '../../api/applications.api';
import { SkillMatchBadge } from './SkillMatchBadge';
import { ResumePreviewModal } from './ResumePreviewModal';

export const CandidateSummaryModal = ({ isOpen, onClose, application, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(application?.status || 'applied');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!application) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      await updateApplicationStatus(application._id, newStatus);
      setCurrentStatus(newStatus);
      onStatusUpdate?.(application._id, newStatus);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setLoading(false);
    }
  };

  const candidate = application.candidate || {};

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Candidate Profile Summary" maxWidth="max-w-2xl">
        <div className="space-y-6">
          
          {/* Candidate Profile Header */}
          <div className="flex items-start justify-between gap-4 p-5 rounded-2xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800 shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
                {candidate.name?.charAt(0) || 'C'}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-ink-900 dark:text-white">{candidate.name || 'Candidate'}</h3>
                <p className="text-xs text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
                  {candidate.email}
                </p>
                <p className="text-[11px] text-ink-400 dark:text-ink-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Applied {formatDateAgo(application.createdAt)}
                </p>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadgeStyle(currentStatus)}`}>
              {currentStatus}
            </span>
          </div>

          {/* Animated Skill Match Score */}
          <SkillMatchBadge
            score={application.matchScore ?? 100}
            matchedSkills={application.matchedSkills || []}
            missingSkills={application.missingSkills || []}
            variant="detailed"
          />

          {/* ATS Pipeline Stage Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink-700 dark:text-ink-300">Update Pipeline Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {APPLICATION_STATUSES.map((st) => (
                <button
                  key={st.value}
                  onClick={() => handleStatusChange(st.value)}
                  disabled={loading || currentStatus === st.value}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all focus:outline-none ${
                    currentStatus === st.value
                      ? st.color + ' ring-2 ring-brand-500/50 scale-[1.02]'
                      : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-300 border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resume CV Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-ink-700 dark:text-ink-300">Resume / CV Document</h4>
            {application.resumeUrl ? (
              <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-brand-600 dark:text-brand-300 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-ink-900 dark:text-white truncate">
                      {application.resumeUrl.split('/').pop() || 'candidate_resume.pdf'}
                    </p>
                    <p className="text-[11px] text-brand-700 dark:text-brand-300 font-medium">
                      In-App preview available
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview CV
                  </button>
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in new window"
                    className="p-1.5 rounded-lg border border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/40"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-ink-400 italic">No resume link provided.</p>
            )}
          </div>

          {/* Cover Letter Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-ink-700 dark:text-ink-300">Cover Letter / Statement</h4>
            <div className="p-4 rounded-xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800 text-xs text-ink-800 dark:text-ink-200 leading-relaxed whitespace-pre-line min-h-[80px]">
              {application.coverLetter || 'No cover letter submitted.'}
            </div>
          </div>

          {/* Modal Close CTA */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-ink-600 dark:text-ink-300 border border-ink-200 dark:border-ink-700 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            >
              Close Summary
            </button>
          </div>
        </div>
      </Modal>

      {/* In-App Resume Preview Modal */}
      <ResumePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        resumeUrl={application.resumeUrl}
        candidateName={candidate.name}
        candidateEmail={candidate.email}
      />
    </>
  );
};
