import React from 'react';
import { FileText, ExternalLink, Calendar, Eye, User } from 'lucide-react';
import { getStatusBadgeStyle, formatDateAgo } from '../../utils/helpers';
import { APPLICATION_STATUSES } from '../../utils/constants';

export const ApplicantTable = ({ applications, onSelectCandidate, onStatusChange }) => {
  if (!applications || applications.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-[var(--text-subtle)] glass-panel rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        No applicants found for this job position yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl glass-panel border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full text-left text-xs">
        <thead className="bg-[var(--surface)] text-[var(--text-subtle)] uppercase tracking-wider font-semibold border-b border-[var(--border)]">
          <tr>
            <th className="py-3.5 px-4">Candidate</th>
            <th className="py-3.5 px-4">Applied Date</th>
            <th className="py-3.5 px-4">Resume CV</th>
            <th className="py-3.5 px-4">Status Pipeline</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] text-[var(--text)]">
          {applications.map((app) => (
            <tr key={app._id} className="hover:bg-[var(--surface-hover)] transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                    {app.candidate?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text)]">{app.candidate?.name || 'Candidate'}</p>
                    <p className="text-[11px] text-[var(--text-subtle)]">{app.candidate?.email}</p>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4 text-[var(--text-subtle)] font-medium">
                {formatDateAgo(app.createdAt)}
              </td>

              <td className="py-3.5 px-4">
                {app.resumeUrl ? (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--primary)] hover:underline font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    CV Link
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[var(--text-subtle)]">None</span>
                )}
              </td>

              <td className="py-3.5 px-4">
                <select
                  value={app.status}
                  onChange={(e) => onStatusChange(app._id, e.target.value)}
                  className={`py-1 px-2.5 rounded-lg font-bold text-xs capitalize cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${getStatusBadgeStyle(app.status)}`}
                >
                  {APPLICATION_STATUSES.map((st) => (
                    <option key={st.value} value={st.value} className="bg-[var(--bg-elevated)] text-[var(--text)]">
                      {st.label}
                    </option>
                  ))}
                </select>
              </td>

              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => onSelectCandidate(app)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text)] glass-panel hover:bg-[var(--surface-hover)] transition-colors inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <Eye className="w-3.5 h-3.5 text-[var(--primary)]" />
                  View Summary
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
