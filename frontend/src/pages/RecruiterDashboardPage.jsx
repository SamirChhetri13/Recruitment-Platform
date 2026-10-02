import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Layers, PlusCircle, Users, CheckCircle2, Briefcase, Eye, Edit3, Trash2, 
  ToggleLeft, ToggleRight, LayoutGrid, Table as TableIcon, RefreshCw, Copy, Sparkles, TrendingUp, PieChart as PieIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { getMyJobs, createJob, updateJob, deleteJob } from '../api/jobs.api';
import { getApplicationsForJob, updateApplicationStatus } from '../api/applications.api';
import { JobWizardModal } from '../components/recruiter/JobWizardModal';
import { ApplicantDrawer } from '../components/recruiter/ApplicantDrawer';
import { ApplicantTable } from '../components/recruiter/ApplicantTable';
import { ApplicantKanban } from '../components/recruiter/ApplicantKanban';
import { Badge } from '../components/common/Badge';
import { StatCardSkeleton } from '../components/common/Skeleton';
import { toast } from 'react-hot-toast';

export const RecruiterDashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected job for ATS inspection
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [atsViewMode, setAtsViewMode] = useState('kanban'); // 'kanban' | 'table'

  // Modals & Drawers state
  const [isWizardModalOpen, setIsWizardModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [selectedCandidateApp, setSelectedCandidateApp] = useState(null);

  const fetchRecruiterJobs = async () => {
    try {
      setLoading(true);
      const res = await getMyJobs();
      if (res.success && res.data) {
        const fetchedJobs = res.data.jobs || [];
        setJobs(fetchedJobs);
        if (fetchedJobs.length > 0 && !selectedJob) {
          handleSelectJobForATS(fetchedJobs[0]);
        }
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const handleSelectJobForATS = async (job) => {
    setSelectedJob(job);
    try {
      setLoadingApps(true);
      const res = await getApplicationsForJob(job._id);
      if (res.success && res.data) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleToggleJobStatus = async (job) => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      await updateJob(job._id, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j)));
      if (selectedJob?._id === job._id) {
        setSelectedJob((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      // Toast shown by interceptor
    }
  };

  const handleCloneJob = async (job) => {
    try {
      const clonedData = {
        title: `${job.title} (Copy)`,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        description: job.description,
        skills: job.skills,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        status: 'open',
      };
      await createJob(clonedData);
      toast.success('Job vacancy cloned successfully!');
      fetchRecruiterJobs();
    } catch (err) {
      // Toast shown by interceptor
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this vacancy and all associated applications?')) {
      return;
    }
    try {
      await deleteJob(jobId);
      const remaining = jobs.filter((j) => j._id !== jobId);
      setJobs(remaining);
      if (selectedJob?._id === jobId) {
        if (remaining.length > 0) {
          handleSelectJobForATS(remaining[0]);
        } else {
          setSelectedJob(null);
          setApplications([]);
        }
      }
    } catch (err) {
      // Toast shown by interceptor
    }
  };

  const handleStatusChangeInATS = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      // Toast shown by interceptor
    }
  };

  // Metrics summary
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'open').length;
  const totalApplicants = applications.length;
  const hiredCount = applications.filter((a) => a.status === 'hired').length;

  // Recharts Data
  const funnelData = [
    { name: 'Applied', count: applications.filter((a) => a.status === 'applied').length, fill: '#818cf8' },
    { name: 'Shortlisted', count: applications.filter((a) => a.status === 'shortlisted').length, fill: '#c084fc' },
    { name: 'Hired', count: applications.filter((a) => a.status === 'hired').length, fill: '#34d399' },
    { name: 'Rejected', count: applications.filter((a) => a.status === 'rejected').length, fill: '#f87171' },
  ];

  const timelineMap = {};
  (applications || []).forEach((app) => {
    const dateStr = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    timelineMap[dateStr] = (timelineMap[dateStr] || 0) + 1;
  });

  const applicationsOverTimeData =
    Object.keys(timelineMap).length > 0
      ? Object.keys(timelineMap).map((date) => ({ date, applications: timelineMap[date] }))
      : [
          { date: 'Mon', applications: 2 },
          { date: 'Tue', applications: 5 },
          { date: 'Wed', applications: 3 },
          { date: 'Thu', applications: 8 },
          { date: 'Fri', applications: 12 },
          { date: 'Sat', applications: 6 },
          { date: 'Sun', applications: 9 },
        ];

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Recruiter Portal & ATS Dashboard | TalentPulse</title>
        <meta name="description" content="Recruiter ATS pipeline, job publishing wizard, and recruitment analytics." />
      </Helmet>
      
      {/* Recruiter Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Recruiter Control Center
          </h1>
          <p className="text-xs text-slate-400">
            Multi-step wizard publishing, interactive ATS Kanban pipeline, and candidate resume drawers
          </p>
        </div>

        <button
          onClick={() => {
            setJobToEdit(null);
            setIsWizardModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white gradient-bg-primary shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
        >
          <PlusCircle className="w-4 h-4" />
          Job Creation Wizard
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2 }} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Vacancies</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalJobs}</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{activeJobs}</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Selected Applicants</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalApplicants}</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Hired Candidates</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{hiredCount}</p>
        </motion.div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applications Over Time AreaChart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Applications Over Time
            </h3>
            <span className="text-[11px] text-slate-400">Recent volume</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationsOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="appColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#appColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Candidate Status Funnel BarChart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              Candidate Status Funnel
            </h3>
            <span className="text-[11px] text-slate-400">Applied → Hired</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Vacancies List, Right ATS Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Recruiter Jobs Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200">Posted Job Vacancies</h3>
            <button
              onClick={fetchRecruiterJobs}
              className="p-1 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 glass-panel rounded-xl animate-pulse bg-slate-800/40" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No job vacancies created yet.</p>
              <button
                onClick={() => {
                  setJobToEdit(null);
                  setIsWizardModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
              >
                Launch Job Wizard
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {jobs.map((job) => {
                const isSelected = selectedJob?._id === job._id;

                return (
                  <div
                    key={job._id}
                    onClick={() => handleSelectJobForATS(job)}
                    className={`glass-panel p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{job.title}</h4>
                        <p className="text-[11px] text-slate-400">{job.company} • {job.location}</p>
                      </div>
                      <Badge variant={job.status === 'open' ? 'success' : 'default'} className="capitalize shrink-0">
                        {job.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                      <span className="capitalize">{job.jobType}</span>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleJobStatus(job)}
                          title="Toggle Status (Open/Closed)"
                          className="p-1 rounded text-slate-400 hover:text-indigo-400"
                        >
                          {job.status === 'open' ? (
                            <ToggleRight className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCloneJob(job)}
                          title="Clone Vacancy"
                          className="p-1 rounded text-slate-400 hover:text-indigo-400"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setJobToEdit(job);
                            setIsWizardModalOpen(true);
                          }}
                          title="Edit Vacancy"
                          className="p-1 rounded text-slate-400 hover:text-indigo-400"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          title="Delete Vacancy"
                          className="p-1 rounded text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Applicant Tracking System (ATS Pipeline) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                ATS Candidate Pipeline {selectedJob ? `— ${selectedJob.title}` : ''}
              </h3>
              <p className="text-[11px] text-slate-400">
                {applications.length} candidate(s) in active pipeline
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 glass-panel p-1 rounded-xl bg-slate-900">
              <button
                onClick={() => setAtsViewMode('kanban')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  atsViewMode === 'kanban'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Kanban Stage Board
              </button>

              <button
                onClick={() => setAtsViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  atsViewMode === 'table'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                Table View
              </button>
            </div>
          </div>

          {/* ATS Pipeline view */}
          {loadingApps ? (
            <div className="h-64 glass-panel rounded-2xl animate-pulse bg-slate-800/40" />
          ) : !selectedJob ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
              Select a job vacancy on the left to inspect candidate pipeline.
            </div>
          ) : atsViewMode === 'kanban' ? (
            <ApplicantKanban
              applications={applications}
              onSelectCandidate={(app) => setSelectedCandidateApp(app)}
              onStatusChange={handleStatusChangeInATS}
            />
          ) : (
            <ApplicantTable
              applications={applications}
              onSelectCandidate={(app) => setSelectedCandidateApp(app)}
              onStatusChange={handleStatusChangeInATS}
            />
          )}
        </div>
      </div>

      {/* Modals & Drawers */}
      <JobWizardModal
        isOpen={isWizardModalOpen}
        onClose={() => setIsWizardModalOpen(false)}
        jobToEdit={jobToEdit}
        onSuccess={() => {
          fetchRecruiterJobs();
        }}
      />

      {selectedCandidateApp && (
        <ApplicantDrawer
          isOpen={Boolean(selectedCandidateApp)}
          onClose={() => setSelectedCandidateApp(null)}
          application={selectedCandidateApp}
          onStatusUpdate={(appId, newStatus) => {
            setApplications((prev) =>
              prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
            );
          }}
        />
      )}
    </div>
  );
};
