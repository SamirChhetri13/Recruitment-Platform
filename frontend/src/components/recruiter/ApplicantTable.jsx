import React from 'react';
import { FileText, ExternalLink, Calendar, Eye, User } from 'lucide-react';
import { getStatusBadgeStyle, formatDateAgo } from '../../utils/helpers';
import { APPLICATION_STATUSES } from '../../utils/constants';

export const ApplicantTable = ({ applications, onSelectCandidate, onStatusChange }) => {
  if (!applications || applications.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 glass-panel rounded-2xl border border-slate-800">
        No applicants found for this job position yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
          <tr>
            <th className="py-3.5 px-4">Candidate</th>
            <th className="py-3.5 px-4">Applied Date</th>
            <th className="py-3.5 px-4">Resume CV</th>
            <th className="py-3.5 px-4">Status Pipeline</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80 text-slate-200">
          {applications.map((app) => (
            <tr key={app._id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                    {app.candidate?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-100">{app.candidate?.name || 'Candidate'}</p>
                    <p className="text-[11px] text-slate-400">{app.candidate?.email}</p>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4 text-slate-400 font-medium">
                {formatDateAgo(app.createdAt)}
              </td>

              <td className="py-3.5 px-4">
                {app.resumeUrl ? (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-400 hover:underline font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    CV Link
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-500">None</span>
                )}
              </td>

              <td className="py-3.5 px-4">
                <select
                  value={app.status}
                  onChange={(e) => onStatusChange(app._id, e.target.value)}
                  className={`py-1 px-2.5 rounded-lg font-bold text-xs capitalize cursor-pointer border focus:outline-none ${getStatusBadgeStyle(app.status)}`}
                >
                  {APPLICATION_STATUSES.map((st) => (
                    <option key={st.value} value={st.value} className="bg-slate-900 text-slate-200">
                      {st.label}
                    </option>
                  ))}
                </select>
              </td>

              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => onSelectCandidate(app)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 glass-panel hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
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
