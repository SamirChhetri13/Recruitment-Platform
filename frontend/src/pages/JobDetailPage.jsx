import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Building2, MapPin, DollarSign, Clock, ArrowLeft, Sparkles, CheckCircle2, AlertCircle, Bookmark } from 'lucide-react';
import { getJobById } from '../api/jobs.api';
import { formatSalary, formatDateAgo } from '../utils/helpers';
import { Card, Badge, Avatar, Button } from '../components/ui';
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
      alert('Only candidates can apply for jobs. Please log in with a candidate account.');
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
        <div className="h-6 bg-ink-200 dark:bg-ink-800 rounded w-1/4" />
        <div className="h-48 rounded-3xl bg-ink-100 dark:bg-ink-900" />
        <div className="h-64 rounded-3xl bg-ink-100 dark:bg-ink-900" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <Helmet>
          <title>Job Not Found | TalentPulse</title>
        </Helmet>
        <AlertCircle className="w-12 h-12 text-status-rejected mx-auto" />
        <h2 className="text-xl font-bold text-ink-900 dark:text-white">{error || 'Job not found'}</h2>
        <Link to="/jobs">
          <Button variant="primary" leftIcon={ArrowLeft}>
            Back to Jobs Feed
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
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
        className="inline-flex items-center gap-2 text-xs font-semibold text-ink-500 hover:text-ink-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs Feed
      </Link>

      {/* Hero Card */}
      <Card className="relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 font-extrabold text-2xl border border-brand-200 dark:border-brand-800 flex items-center justify-center shrink-0 shadow-sm">
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-white font-display tracking-tight">
                  {job.title}
                </h1>
                <Badge variant={job.status === 'open' ? 'hired' : 'neutral'} className="capitalize">
                  {job.status}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-ink-500 dark:text-ink-400 flex items-center gap-2 flex-wrap">
                <span className="text-ink-900 dark:text-white font-bold">{job.company}</span>
                <span className="text-ink-300 dark:text-ink-600">•</span>
                <span className="flex items-center gap-1 text-ink-400 font-normal">
                  <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                  {job.location}
                </span>
              </p>
            </div>
          </div>

          {/* SINGLE SAFFRON HIGHLIGHT CTA */}
          {job.status === 'open' && (
            <Button
              variant="accent"
              size="lg"
              onClick={handleApplyClick}
              leftIcon={Sparkles}
              className="shrink-0"
            >
              Apply Now
            </Button>
          )}
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-ink-100 dark:border-ink-800 text-xs">
          <div>
            <span className="text-ink-400 font-medium">Job Type</span>
            <p className="font-bold text-ink-900 dark:text-white capitalize mt-0.5">{job.jobType}</p>
          </div>
          <div>
            <span className="text-ink-400 font-medium">Salary Range</span>
            <p className="font-bold text-status-hired mt-0.5">{formatSalary(job.salaryMin, job.salaryMax)}</p>
          </div>
          <div>
            <span className="text-ink-400 font-medium">Experience Level</span>
            <p className="font-bold text-ink-900 dark:text-white capitalize mt-0.5">{job.experienceLevel} Level</p>
          </div>
          <div>
            <span className="text-ink-400 font-medium">Posted</span>
            <p className="font-bold text-ink-900 dark:text-white mt-0.5">{formatDateAgo(job.createdAt)}</p>
          </div>
        </div>
      </Card>

      {/* Main Content Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column: Description & Skills */}
        <div className="md:col-span-2 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-ink-900 dark:text-white font-display border-b border-ink-100 dark:border-ink-800 pb-3">
              Job Description & Responsibilities
            </h3>
            <div className="text-xs sm:text-sm text-ink-700 dark:text-ink-200 leading-relaxed whitespace-pre-line font-sans">
              {job.description}
            </div>
          </Card>

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <Card className="space-y-3">
              <h3 className="text-base font-bold text-ink-900 dark:text-white font-display">
                Required Key Competencies
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Recruiter Info & Sticky Apply Box */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Posted By
            </h3>
            <div className="flex items-center gap-3">
              <Avatar name={job.postedBy?.name} size="md" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-ink-900 dark:text-white truncate">{job.postedBy?.name || 'Hiring Manager'}</p>
                <p className="text-2xs text-ink-400 truncate">{job.postedBy?.email}</p>
              </div>
            </div>
          </Card>

          {/* Quick Checklist */}
          <Card className="space-y-3 text-xs">
            <h3 className="font-bold text-ink-900 dark:text-white font-display">Application Checklist</h3>
            <ul className="space-y-2.5 text-ink-600 dark:text-ink-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-hired shrink-0" />
                <span>Updated Resume (PDF / Doc)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-hired shrink-0" />
                <span>Verified Contact Email</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-hired shrink-0" />
                <span>Optional Cover Statement</span>
              </li>
            </ul>
          </Card>
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

export default JobDetailPage;
