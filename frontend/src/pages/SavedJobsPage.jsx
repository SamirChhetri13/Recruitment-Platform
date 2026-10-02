import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bookmark, AlertCircle, RefreshCw } from 'lucide-react';
import { getSavedJobs } from '../api/jobs.api';
import { JobCard } from '../components/jobs/JobCard';
import { JobCardSkeleton } from '../components/common/Skeleton';
import { ApplicationModal } from '../components/jobs/ApplicationModal';

export const SavedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getSavedJobs();
      if (res.success && res.data) {
        setJobs(res.data.jobs || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch saved vacancies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleBookmarkToggle = (jobId, isBookmarked) => {
    if (!isBookmarked) {
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    }
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Saved Vacancies | TalentPulse</title>
        <meta name="description" content="View and manage your bookmarked job openings." />
      </Helmet>

      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400/20" />
            Bookmarked Vacancies
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Your saved job positions for quick application and monitoring
          </p>
        </div>

        <button
          onClick={fetchSaved}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold glass-panel hover:bg-slate-800 text-slate-300 flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchSaved} className="font-bold underline">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <JobCardSkeleton key={idx} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No bookmarked vacancies</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the bookmark icon on any job card in the Public Job Feed to save positions for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onQuickApply={(j) => setSelectedApplyJob(j)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}

      {selectedApplyJob && (
        <ApplicationModal
          isOpen={Boolean(selectedApplyJob)}
          onClose={() => setSelectedApplyJob(null)}
          job={selectedApplyJob}
          onSuccess={() => {
            fetchSaved();
          }}
        />
      )}
    </div>
  );
};
