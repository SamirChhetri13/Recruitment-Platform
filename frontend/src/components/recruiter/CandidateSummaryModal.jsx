import React, { useState } from 'react';
import { User, Mail, FileText, ExternalLink, Calendar, CheckCircle2, XCircle, Clock, Award } from 'lucide-react';
import { Modal } from '../common/Modal';
import { getStatusBadgeStyle, formatDateAgo } from '../../utils/helpers';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { updateApplicationStatus } from '../../api/applications.api';

export const CandidateSummaryModal = ({ isOpen, onClose, application, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(application?.status || 'applied');

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
    <Modal isOpen={isOpen} onClose={onClose} title="Candidate Profile Summary" maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Candidate Profile Header */}
        <div className="flex items-start justify-between gap-4 p-5 rounded-2xl glass-panel bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
              {candidate.name?.charAt(0) || 'C'}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100">{candidate.name || 'Candidate'}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {candidate.email}
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Applied {formatDateAgo(application.createdAt)}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadgeStyle(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>

        {/* ATS Pipeline Stage Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Update Pipeline Status</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {APPLICATION_STATUSES.map((st) => (
              <button
                key={st.value}
                onClick={() => handleStatusChange(st.value)}
                disabled={loading || currentStatus === st.value}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  currentStatus === st.value
                    ? st.color + ' ring-2 ring-indigo-500/50 scale-[1.02]'
                    : 'glass-panel text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resume CV Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-300">Resume / CV Document</h4>
          {application.resumeUrl ? (
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl glass-panel bg-indigo-500/5 border border-indigo-500/20 hover:bg-indigo-500/10 flex items-center justify-between text-xs font-medium text-indigo-300 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="font-bold text-slate-200 group-hover:text-indigo-400">View Candidate Curriculum Vitae</p>
                  <p className="text-[11px] text-slate-400 truncate max-w-sm">{application.resumeUrl}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-indigo-400" />
            </a>
          ) : (
            <p className="text-xs text-slate-500 italic">No resume link provided.</p>
          )}
        </div>

        {/* Cover Letter Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-300">Cover Letter / Statement</h4>
          <div className="p-4 rounded-xl glass-panel bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line min-h-[80px]">
            {application.coverLetter || 'No cover letter submitted.'}
          </div>
        </div>

        {/* Modal Close CTA */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-300 glass-panel hover:bg-slate-800"
          >
            Close Summary
          </button>
        </div>
      </div>
    </Modal>
  );
};
