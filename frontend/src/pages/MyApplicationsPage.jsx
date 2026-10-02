import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Building2, Calendar, ExternalLink, Trash2, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getMyApplications, withdrawApplication } from '../api/applications.api';
import { getStatusBadgeStyle, formatDateAgo } from '../utils/helpers';
import { Badge } from '../components/common/Badge';
import { ApplicantRowSkeleton } from '../components/common/Skeleton';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawingId, setWithdrawingId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getMyApplications();
      if (res.success && res.data) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }
    try {
      setWithdrawingId(applicationId);
      await withdrawApplication(applicationId);
      setApplications((prev) => prev.filter((app) => app._id !== applicationId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>My Applications | TalentPulse</title>
        <meta name="description" content="Track your submitted job applications and candidate status updates." />
      </Helmet>

      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Tracked Applications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor pipeline progression and status updates for your submitted applications
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold glass-panel hover:bg-slate-800 text-slate-300 flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-400">
          <span>{error}</span>
          <button onClick={fetchApplications} className="font-bold underline">Retry</button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((idx) => (
            <ApplicantRowSkeleton key={idx} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No applications submitted yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse our active job feed and submit your resume to start tracking your applications.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-bg-primary shadow-lg shadow-indigo-500/25"
          >
            Explore Open Vacancies
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel-hover"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    to={`/jobs/${app.job?._id}`}
                    className="text-base font-bold text-slate-100 hover:text-indigo-400 transition-colors"
                  >
                    {app.job?.title || 'Unknown Job Position'}
                  </Link>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusBadgeStyle(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {app.job?.company || 'N/A'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Applied {formatDateAgo(app.createdAt)}
                  </span>
                </div>

                {app.resumeUrl && (
                  <div className="pt-1">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Uploaded Resume
                    </a>
                  </div>
                )}

                {/* Visual Step-by-Step Progress Bar */}
                <div className="pt-3 border-t border-slate-800/60 max-w-lg">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Application Pipeline Progress</p>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
                    {[
                      { key: 'applied', label: 'Applied' },
                      { key: 'shortlisted', label: 'Shortlisted' },
                      { key: 'hired', label: 'Hired' },
                    ].map((step, idx) => {
                      const isRejected = app.status === 'rejected';
                      const statusOrder = { applied: 1, shortlisted: 2, hired: 3 };
                      const currentOrder = isRejected ? 1 : (statusOrder[app.status] || 1);
                      const stepOrder = statusOrder[step.key];
                      const isPassed = !isRejected && currentOrder >= stepOrder;
                      const isCurrent = !isRejected && app.status === step.key;

                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10 gap-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 text-white border-indigo-400 ring-4 ring-indigo-500/20'
                                : isPassed
                                ? 'bg-emerald-500 text-white border-emerald-400'
                                : isRejected && step.key === 'applied'
                                ? 'bg-rose-500 text-white border-rose-400'
                                : 'bg-slate-900 text-slate-500 border-slate-700'
                            }`}
                          >
                            {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] font-semibold ${
                              isCurrent
                                ? 'text-indigo-400'
                                : isPassed
                                ? 'text-emerald-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {app.status === 'rejected' && (
                    <p className="text-[11px] text-rose-400 mt-2 font-medium">Application not selected at this time.</p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  onClick={() => handleWithdraw(app._id)}
                  disabled={withdrawingId === app._id}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {withdrawingId === app._id ? 'Withdrawing...' : 'Withdraw'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
