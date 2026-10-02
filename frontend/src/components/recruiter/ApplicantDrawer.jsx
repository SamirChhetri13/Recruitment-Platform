import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Calendar, FileText, ExternalLink, MessageSquare, Save, CheckCircle2, User } from 'lucide-react';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { getStatusBadgeStyle, formatDateAgo } from '../../utils/helpers';
import { updateApplicationStatus } from '../../api/applications.api';
import { toast } from 'react-hot-toast';

export const ApplicantDrawer = ({ isOpen, onClose, application, onStatusUpdate }) => {
  const [currentStatus, setCurrentStatus] = useState(application?.status || 'applied');
  const [internalNote, setInternalNote] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [loading, setLoading] = useState(false);

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg glass-panel bg-slate-900 border-l border-slate-800 h-full overflow-y-auto custom-scrollbar p-6 space-y-6 flex flex-col justify-between"
        >
          {/* Top Bar Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Applicant Overview Drawer</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="p-4 rounded-2xl glass-panel bg-slate-800/40 border border-slate-700/60 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                  {candidate.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{candidate.name || 'Candidate'}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    {candidate.email}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    Applied {formatDateAgo(application.createdAt)}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadgeStyle(currentStatus)}`}>
                {currentStatus}
              </span>
            </div>

            {/* Status Change Controls */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Advance ATS Pipeline Stage</label>
              <div className="grid grid-cols-2 gap-2">
                {APPLICATION_STATUSES.map((st) => (
                  <button
                    key={st.value}
                    onClick={() => handleStatusChange(st.value)}
                    disabled={loading || currentStatus === st.value}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      currentStatus === st.value
                        ? st.color + ' ring-2 ring-indigo-500/40'
                        : 'glass-panel text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Preview Link */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Curriculum Vitae / Resume</label>
              {application.resumeUrl ? (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl glass-panel bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 flex items-center justify-between text-xs font-semibold text-indigo-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="truncate max-w-xs">{application.resumeUrl}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-indigo-400 shrink-0" />
                </a>
              ) : (
                <p className="text-xs text-slate-500 italic">No resume URL available.</p>
              )}
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Candidate Statement / Cover Letter</label>
              <div className="p-4 rounded-xl glass-panel bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line min-h-[90px]">
                {application.coverLetter || 'No cover letter submitted.'}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  Internal Recruiter Notes
                </label>
                {savedNotes && <span className="text-[10px] text-emerald-400 font-bold">Saved</span>}
              </div>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={3}
                placeholder="Add private evaluation notes, interview feedback, or screening rating..."
                className="w-full p-3 rounded-xl glass-input text-xs"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-200 glass-panel hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-indigo-400" />
                Save Internal Notes
              </button>
            </div>
          </div>

          {/* Drawer Footer CTA */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-300 glass-panel hover:bg-slate-800"
            >
              Close Drawer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
