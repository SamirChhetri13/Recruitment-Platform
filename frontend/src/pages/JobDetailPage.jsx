import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Building2, MapPin, DollarSign, Clock, ArrowLeft, Sparkles, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { getJobById } from '../api/jobs.api';
import { formatSalary, formatDateAgo } from '../utils/helpers';
import { Badge } from '../components/common/Badge';
import { ApplicationModal } from '../components/jobs/ApplicationModal';
import { useAuth } from '../context/AuthContext';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCandidate } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getJobById(id);
        if (res.success && res.data?.job) {
          setJob(res.data.job);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Job vacancy not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    if (!isCandidate) {
      alert('Only candidates can apply for jobs.');
      return;
    }
    setIsApplyModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse py-8">
        <Helmet>
          <title>Job Opening Details | TalentPulse</title>
        </Helmet>
        <div className="h-8 bg-slate-800 rounded w-1/4" />
        <div className="h-48 glass-panel rounded-3xl bg-slate-800/50" />
        <div className="h-64 glass-panel rounded-3xl bg-slate-800/30" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <Helmet>
          <title>Job Not Found | TalentPulse</title>
        </Helmet>
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-100">{error || 'Job not found'}</h2>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-bg-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>{`${job.title} at ${job.company} | TalentPulse`}</title>
        <meta
          name="description"
          content={`Apply for ${job.title} at ${job.company} in ${job.location}. ${job.description?.slice(0, 150)}...`}
        />
      </Helmet>

      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs Feed
      </Link>

      {/* Hero Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/90 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-indigo-400 font-extrabold text-2xl shadow-xl shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">{job.title}</h1>
                <Badge variant={job.status === 'open' ? 'success' : 'default'} className="capitalize">
                  {job.status}
                </Badge>
              </div>
              <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span>{job.company}</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400 font-normal">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  {job.location}
                </span>
              </p>
            </div>
          </div>

          {/* Action CTA */}
          {job.status === 'open' && (
            <button
              onClick={handleApplyClick}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white gradient-bg-primary shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Apply for Position
            </button>
          )}
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Job Type</span>
            <p className="font-semibold text-slate-200 capitalize mt-0.5">{job.jobType}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Salary Range</span>
            <p className="font-semibold text-indigo-400 mt-0.5">{formatSalary(job.salaryMin, job.salaryMax)}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Experience Level</span>
            <p className="font-semibold text-slate-200 capitalize mt-0.5">{job.experienceLevel} Level</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Posted</span>
            <p className="font-semibold text-slate-200 mt-0.5">{formatDateAgo(job.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Description & Skills */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">
              Job Description & Responsibilities
            </h3>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-slate-100">Required Key Competencies</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recruiter Info & Summary */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Posted By</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {job.postedBy?.name?.charAt(0) || 'R'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">{job.postedBy?.name || 'Recruiter'}</p>
                <p className="text-[11px] text-slate-400">{job.postedBy?.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Checklist */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <h3 className="font-bold text-slate-100">Application Checklist</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Updated Resume (PDF / Doc)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Contact Email</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Optional Cover Statement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onSuccess={() => {
          navigate('/my-applications');
        }}
      />
    </div>
  );
};
