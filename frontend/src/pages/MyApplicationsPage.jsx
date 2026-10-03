import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, Building2, Calendar, ExternalLink, Trash2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { getMyApplications, withdrawApplication } from '../api/applications.api';
import { formatDateAgo } from '../utils/helpers';
import { Card, Badge, Button, EmptyState, Modal, ApplicantRowSkeleton } from '../components/ui';
import { toast } from 'react-hot-toast';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appToWithdraw, setAppToWithdraw] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

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

  const confirmWithdraw = async () => {
    if (!appToWithdraw) return;
    try {
      setWithdrawing(true);
      await withdrawApplication(appToWithdraw._id);
      setApplications((prev) => prev.filter((app) => app._id !== appToWithdraw._id));
      toast.success('Application withdrawn successfully');
      setAppToWithdraw(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <Helmet>
        <title>My Applications | TalentPulse</title>
        <meta name="description" content="Track your submitted job applications and candidate status updates." />
      </Helmet>

      {/* Header Banner */}
      <Card className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-white font-display tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span>Tracked Applications</span>
          </h1>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
            Monitor pipeline progression and recruiter status updates for your submitted applications
          </p>
        </div>

        <Button variant="secondary" onClick={fetchApplications} leftIcon={RefreshCw}>
          Refresh
        </Button>
      </Card>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-status-rejected/10 border border-status-rejected/20 flex items-center justify-between text-xs text-status-rejected">
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
        <EmptyState
          icon={FileText}
          title="No applications submitted yet"
          description="Browse our active job feed and submit your resume to start tracking your application progression."
          actionLabel="Explore Job Openings"
          onAction={() => {
            window.location.href = '/jobs';
          }}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card
              key={app._id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    to={`/jobs/${app.job?._id}`}
                    className="text-base font-bold text-ink-900 dark:text-white font-display hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                  >
                    {app.job?.title || 'Unknown Job Position'}
                  </Link>
                  <Badge variant={app.status} className="capitalize">
                    {app.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-ink-500 dark:text-ink-400 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-ink-900 dark:text-white">
                    <Building2 className="w-3.5 h-3.5 text-ink-400" />
                    {app.job?.company || 'N/A'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-ink-400">
                    <Calendar className="w-3.5 h-3.5 text-ink-400" />
                    Applied {formatDateAgo(app.createdAt)}
                  </span>
                </div>

                {app.resumeUrl && (
                  <div className="pt-1">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-300 hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Uploaded Resume
                    </a>
                  </div>
                )}

                {/* Visual Pipeline Progress */}
                <div className="pt-3 border-t border-ink-100 dark:border-ink-800 max-w-lg">
                  <p className="text-2xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                    Pipeline Status Progression
                  </p>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-ink-200 dark:bg-ink-800 -translate-y-1/2 z-0" />
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
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold border transition-all ${
                              isCurrent
                                ? 'bg-brand-600 text-white border-brand-400 ring-4 ring-brand-500/20'
                                : isPassed
                                ? 'bg-status-hired text-white border-emerald-400'
                                : isRejected && step.key === 'applied'
                                ? 'bg-status-rejected text-white border-rose-400'
                                : 'bg-white dark:bg-ink-900 text-ink-400 border-ink-300 dark:border-ink-700'
                            }`}
                          >
                            {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-2xs font-bold ${
                              isCurrent
                                ? 'text-brand-600 dark:text-brand-300'
                                : isPassed
                                ? 'text-status-hired'
                                : 'text-ink-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {app.status === 'rejected' && (
                    <p className="text-2xs text-status-rejected mt-2 font-semibold">
                      Application not selected for this vacancy.
                    </p>
                  )}
                </div>
              </div>

              {/* Action button */}
              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setAppToWithdraw(app)}
                  leftIcon={Trash2}
                >
                  Withdraw
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Withdraw Modal */}
      <Modal
        isOpen={Boolean(appToWithdraw)}
        onClose={() => setAppToWithdraw(null)}
        title="Withdraw Application"
        subtitle="Are you sure you want to withdraw this application?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-600 dark:text-ink-300">
            This will remove your candidate application from the recruiter's active pipeline.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setAppToWithdraw(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={withdrawing} onClick={confirmWithdraw}>
              Withdraw Application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyApplicationsPage;
