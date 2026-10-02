import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Sparkles, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { getJobs } from '../api/jobs.api';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilterBar } from '../components/jobs/JobFilterBar';
import { Pagination } from '../components/common/Pagination';
import { ApplicationModal } from '../components/jobs/ApplicationModal';
import { JobCardSkeleton } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';

export const JobsPage = () => {
  const { isAuthenticated, isCandidate } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    page: 1,
  });

  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const queryParams = {
        page: filters.page,
        limit: 6,
        status: 'open',
      };
      if (filters.search) queryParams.search = filters.search;
      if (filters.location) queryParams.location = filters.location;
      if (filters.jobType) queryParams.jobType = filters.jobType;
      if (filters.experienceLevel) queryParams.experienceLevel = filters.experienceLevel;

      const res = await getJobs(queryParams);
      if (res.success && res.data) {
        setJobs(res.data.jobs || []);
        setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ search: '', location: '', jobType: '', experienceLevel: '', page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/jobs' } } });
      return;
    }
    if (!isCandidate) {
      alert('Only candidates can apply for jobs. Please sign in with a candidate account.');
      return;
    }
    setSelectedApplyJob(job);
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Explore Tech & Engineering Jobs | TalentPulse</title>
        <meta
          name="description"
          content="Browse verified job openings across software engineering, product design, marketing, and operations."
        />
      </Helmet>

      {/* Hero Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Active Vacancies Feed
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Discover Your Next <span className="gradient-text">Career Milestone</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Explore verified opportunities across engineering, product, design, and operations from top employers worldwide.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <JobFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <p>
          Showing <span className="font-bold text-slate-200">{jobs.length}</span> of{' '}
          <span className="font-bold text-slate-200">{pagination.total || 0}</span> active openings
        </p>
        <button
          onClick={fetchJobs}
          className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Feed
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-sm font-semibold text-rose-400">{error}</p>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <JobCardSkeleton key={idx} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No matching vacancies found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try broadening your search keywords or clearing filter parameters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onQuickApply={handleApplyClick} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      {/* Application Modal */}
      {selectedApplyJob && (
        <ApplicationModal
          isOpen={Boolean(selectedApplyJob)}
          onClose={() => setSelectedApplyJob(null)}
          job={selectedApplyJob}
          onSuccess={() => {
            fetchJobs();
          }}
        />
      )}
    </div>
  );
};
