import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Calendar,
  FileText,
  ExternalLink,
  MessageSquare,
  Save,
  CheckCircle2,
  User,
  Eye,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { getStatusBadgeStyle, formatDateAgo } from '../../utils/helpers';
import { updateApplicationStatus } from '../../api/applications.api';
import { toast } from 'react-hot-toast';
import { SkillMatchBadge } from './SkillMatchBadge';
import { ResumePreviewModal } from './ResumePreviewModal';

export const ApplicantDrawer = ({ isOpen, onClose, application, onStatusUpdate }) => {
  const [currentStatus, setCurrentStatus] = useState(application?.status || 'applied');
  const [internalNote, setInternalNote] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (application) {
      setCurrentStatus(application.status || 'applied');
      const noteKey = `internal_notes_${application._id}`;
      const existing = localStorage.getItem(noteKey) || '';
      setInternalNote(existing);
      setSavedNotes(existing);
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const candidate = application.candidate || {};
  const candidateExperience = candidate.experience || application.experience;
  const candidateSkills = candidate.skills || application.skills || [];

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      await updateApplicationStatus(application._id, newStatus);
      setCurrentStatus(newStatus);
      onStatusUpdate?.(application._id, newStatus);
    } catch (err) {
      // Axios interceptor shows toast error automatically
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = () => {
    const noteKey = `internal_notes_${application._id}`;
    localStorage.setItem(noteKey, internalNote);
    setSavedNotes(internalNote);
    toast.success('Internal notes saved successfully!');
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-40 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-lg glass-panel bg-white dark:bg-ink-900 border-l border-ink-100 dark:border-ink-800 h-full overflow-y-auto custom-scrollbar p-6 space-y-6 flex flex-col justify-between text-ink-900 dark:text-white"
          >
            {/* Top Bar Header */}
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-ink-100 dark:border-ink-800">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-600 dark:text-brand-300" />
                  <h3 className="text-base font-bold text-ink-900 dark:text-white font-display">
                    Applicant Overview Drawer
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="p-4 rounded-2xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800 flex items-start justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                    {candidate.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-ink-900 dark:text-white">{candidate.name || 'Candidate'}</h4>
                    <p className="text-xs text-ink-500 dark:text-ink-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
                      {candidate.email}
                    </p>
                    <p className="text-[11px] text-ink-400 dark:text-ink-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      Applied {formatDateAgo(application.createdAt)}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadgeStyle(currentStatus)}`}>
                  {currentStatus}
                </span>
              </div>

              {/* Animated Skill Match Detailed Card */}
              <SkillMatchBadge
                score={application.matchScore ?? 100}
                matchedSkills={application.matchedSkills || []}
                missingSkills={application.missingSkills || []}
                variant="detailed"
              />

              {/* Candidate Experience & Profile Bio (if supplied) */}
              {candidateExperience && (
                <div className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950/40 border border-ink-100 dark:border-ink-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-ink-800 dark:text-ink-200">
                    <Briefcase className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
                    <span>Candidate Experience Summary</span>
                  </div>
                  <p className="text-ink-600 dark:text-ink-300 leading-relaxed text-2xs">
                    {candidateExperience}
                  </p>
                </div>
              )}

              {/* Status Change Controls */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink-700 dark:text-ink-300">
                  Advance ATS Pipeline Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {APPLICATION_STATUSES.map((st) => (
                    <button
                      key={st.value}
                      onClick={() => handleStatusChange(st.value)}
                      disabled={loading || currentStatus === st.value}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all focus:outline-none ${
                        currentStatus === st.value
                          ? st.color + ' ring-2 ring-brand-500/40'
                          : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-300 border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume Document Review & In-App Preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink-700 dark:text-ink-300 flex items-center justify-between">
                  <span>Curriculum Vitae / Resume</span>
                  {application.resumeUrl && (
                    <span className="text-[11px] text-brand-600 dark:text-brand-300 font-bold">
                      Document Attached
                    </span>
                  )}
                </label>

                {application.resumeUrl ? (
                  <div className="p-3.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-brand-600 dark:text-brand-300 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink-900 dark:text-white truncate">
                          {application.resumeUrl.split('/').pop() || 'candidate_resume.pdf'}
                        </p>
                        <p className="text-[11px] text-brand-700 dark:text-brand-300 font-medium">
                          Click to preview document in-app
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Primary In-App Preview Button */}
                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview CV
                      </button>

                      {/* Secondary External Link Button */}
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in new window"
                        className="p-1.5 rounded-lg border border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-ink-400 italic">No resume URL available.</p>
                )}
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink-700 dark:text-ink-300">
                  Candidate Statement / Cover Letter
                </label>
                <div className="p-4 rounded-xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800 text-xs text-ink-800 dark:text-ink-200 leading-relaxed whitespace-pre-line min-h-[90px]">
                  {application.coverLetter || 'No cover letter submitted.'}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2 pt-2 border-t border-ink-100 dark:border-ink-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-ink-700 dark:text-ink-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                    Internal Recruiter Notes
                  </label>
                  {savedNotes && <span className="text-[10px] text-status-hired font-bold">Saved</span>}
                </div>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  rows={3}
                  placeholder="Add private evaluation notes, interview feedback, or screening rating..."
                  className="w-full p-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-xs text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-ink-800 dark:text-ink-200 border border-ink-200 dark:border-ink-700 hover:bg-ink-100 dark:hover:bg-ink-800 flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
                >
                  <Save className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
                  Save Internal Notes
                </button>
              </div>
            </div>

          {/* Drawer Footer CTA */}
          <div className="pt-4 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-[var(--text-muted)] glass-panel hover:bg-[var(--surface-hover)] hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              Close Drawer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>

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
