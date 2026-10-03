import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Layers, PlusCircle, Users, CheckCircle2, Briefcase, Eye, Edit3, Trash2, 
  ToggleLeft, ToggleRight, LayoutGrid, Table as TableIcon, RefreshCw, Copy, Sparkles, TrendingUp, PieChart as PieIcon, ArrowUpRight, AlertCircle
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
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { getMyJobs, createJob, updateJob, deleteJob } from '../api/jobs.api';
import { getApplicationsForJob, updateApplicationStatus } from '../api/applications.api';
import { JobWizardModal } from '../components/recruiter/JobWizardModal';
import { ApplicantDrawer } from '../components/recruiter/ApplicantDrawer';
import { ApplicantTable } from '../components/recruiter/ApplicantTable';
import { ApplicantKanban } from '../components/recruiter/ApplicantKanban';
import { Button, Card, Badge, Tabs, EmptyState, Modal, StatCardSkeleton } from '../components/ui';
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
  const [jobToDelete, setJobToDelete] = useState(null);

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
      toast.success(`Job marked as ${newStatus}`);
    } catch (err) {
      // Toast handled by interceptor
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
      // Toast handled by interceptor
    }
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete._id);
      toast.success('Vacancy deleted');
      const remaining = jobs.filter((j) => j._id !== jobToDelete._id);
      setJobs(remaining);
      if (selectedJob?._id === jobToDelete._id) {
        if (remaining.length > 0) {
          handleSelectJobForATS(remaining[0]);
        } else {
          setSelectedJob(null);
          setApplications([]);
        }
      }
      setJobToDelete(null);
    } catch (err) {
      // Toast handled by interceptor
    }
  };

  const handleStatusChangeInATS = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      // Toast handled by interceptor
    }
  };

  // Metrics summary
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'open').length;
  const totalApplicants = applications.length;
  const hiredCount = applications.filter((a) => a.status === 'hired').length;

  // Recharts Data
  const funnelData = [
    { name: 'Applied', count: applications.filter((a) => a.status === 'applied').length, fill: '#3B82C4' },
    { name: 'Shortlisted', count: applications.filter((a) => a.status === 'shortlisted').length, fill: '#F99F25' },
    { name: 'Hired', count: applications.filter((a) => a.status === 'hired').length, fill: '#1FA67A' },
    { name: 'Rejected', count: applications.filter((a) => a.status === 'rejected').length, fill: '#E0526A' },
  ];

  const timelineMap = {};
  (applications || []).forEach((app) => {
    const dateStr = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    timelineMap[dateStr] = (timelineMap[dateStr] || 0) + 1;
  });

  const applicationsOverTimeData = Object.keys(timelineMap).map((date) => ({
    date,
    applications: timelineMap[date],
  }));

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Recruiter Portal & ATS Dashboard | TalentPulse</title>
        <meta name="description" content="Recruiter ATS pipeline, job publishing wizard, and recruitment analytics." />
      </Helmet>
      
      {/* Recruiter Header */}
      <div className="p-8 rounded-3xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white font-display tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <span>Recruiter Control Center</span>
          </h1>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Publish vacancies, track candidates in real-time Kanban pipelines, and manage hires.
          </p>
        </div>

        {/* SINGLE SAFFRON HIGHLIGHT CTA PER VIEWPORT */}
        <Button
          variant="accent"
          onClick={() => {
            setJobToEdit(null);
            setIsWizardModalOpen(true);
          }}
          leftIcon={PlusCircle}
        >
          Post a Job
        </Button>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hoverEffect padding="sm" className="space-y-1 cursor-pointer">
          <div className="flex items-center justify-between text-ink-500 dark:text-ink-400">
            <span className="text-xs font-semibold">Total Vacancies</span>
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-ink-900 dark:text-white font-display">{totalJobs}</p>
          <p className="text-2xs text-status-hired font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12% vs last month
          </p>
        </Card>

        <Card hoverEffect padding="sm" className="space-y-1 cursor-pointer">
          <div className="flex items-center justify-between text-ink-500 dark:text-ink-400">
            <span className="text-xs font-semibold">Active Openings</span>
            <div className="p-1.5 rounded-lg bg-status-hired/10 text-status-hired">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-ink-900 dark:text-white font-display">{activeJobs}</p>
          <p className="text-2xs text-ink-400 font-medium">Published & hiring</p>
        </Card>

        <Card hoverEffect padding="sm" className="space-y-1 cursor-pointer">
          <div className="flex items-center justify-between text-ink-500 dark:text-ink-400">
            <span className="text-xs font-semibold">Active Applicants</span>
            <div className="p-1.5 rounded-lg bg-status-applied/10 text-status-applied">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-ink-900 dark:text-white font-display">{totalApplicants}</p>
          <p className="text-2xs text-status-applied font-semibold">In selected pipeline</p>
        </Card>

        <Card hoverEffect padding="sm" className="space-y-1 cursor-pointer">
          <div className="flex items-center justify-between text-ink-500 dark:text-ink-400">
            <span className="text-xs font-semibold">Successful Hires</span>
            <div className="p-1.5 rounded-lg bg-status-shortlisted/10 text-status-shortlisted">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-ink-900 dark:text-white font-display">{hiredCount}</p>
          <p className="text-2xs text-status-hired font-semibold">Hired candidates</p>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applications Over Time AreaChart */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ink-100 dark:border-ink-800">
            <h3 className="text-sm font-bold text-ink-900 dark:text-white font-display flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-300" />
              <span>Applications Over Time</span>
            </h3>
            <span className="text-2xs text-ink-400">Real submission volume</span>
          </div>

          {applicationsOverTimeData.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No applications recorded yet"
              description="Share your vacancy link with candidates to start seeing real submission trends here."
            />
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={applicationsOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="appColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#279490" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#279490" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(143,153,171,0.2)" />
                  <XAxis dataKey="date" stroke="#8F99AB" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8F99AB" fontSize={11} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#181C25',
                      borderColor: '#2A303B',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#FFFFFF',
                    }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#279490" strokeWidth={2.5} fillOpacity={1} fill="url(#appColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Candidate Status Funnel BarChart */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ink-100 dark:border-ink-800">
            <h3 className="text-sm font-bold text-ink-900 dark:text-white font-display flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-sun-500" />
              <span>Candidate Status Funnel</span>
            </h3>
            <span className="text-2xs text-ink-400">Applied → Hired</span>
          </div>

          {totalApplicants === 0 ? (
            <EmptyState
              icon={PieIcon}
              title="Pipeline is currently empty"
              description="Select a job with active candidate submissions to inspect funnel conversion counts."
            />
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(143,153,171,0.2)" />
                  <XAxis dataKey="name" stroke="#8F99AB" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8F99AB" fontSize={11} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#181C25',
                      borderColor: '#2A303B',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#FFFFFF',
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
          )}
        </Card>
      </div>

      {/* Main Grid: Left Vacancies List, Right ATS Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Recruiter Jobs Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ink-100 dark:border-ink-800">
            <h3 className="text-sm font-bold text-ink-900 dark:text-white font-display">Posted Job Vacancies</h3>
            <button
              onClick={fetchRecruiterJobs}
              className="p-1.5 rounded-lg text-ink-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
              title="Refresh jobs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-ink-100 dark:bg-ink-800 animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No job vacancies yet"
              description="Create your first job posting to start gathering candidate applications."
              actionLabel="Create First Job"
              onAction={() => {
                setJobToEdit(null);
                setIsWizardModalOpen(true);
              }}
            />
          ) : (
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
              {jobs.map((job) => {
                const isSelected = selectedJob?._id === job._id;

                return (
                  <div
                    key={job._id}
                    onClick={() => handleSelectJobForATS(job)}
                    className={`
                      p-4 rounded-2xl border transition-all duration-150 cursor-pointer space-y-3
                      ${isSelected
                        ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/60 dark:border-brand-400 shadow-lift'
                        : 'border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-ink-300 dark:hover:border-ink-700 shadow-card'}
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-ink-900 dark:text-white">{job.title}</h4>
                        <p className="text-2xs text-ink-500 dark:text-ink-400">{job.company} • {job.location}</p>
                      </div>
                      <Badge variant={job.status === 'open' ? 'hired' : 'neutral'} className="capitalize shrink-0">
                        {job.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-2xs text-ink-500 dark:text-ink-400 pt-2 border-t border-ink-100 dark:border-ink-800">
                      <span className="capitalize font-medium">{job.jobType}</span>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleJobStatus(job)}
                          title="Toggle Status (Open/Closed)"
                          className="p-1 rounded text-ink-400 hover:text-brand-600 dark:hover:text-brand-300"
                        >
                          {job.status === 'open' ? (
                            <ToggleRight className="w-4 h-4 text-status-hired" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-ink-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCloneJob(job)}
                          title="Clone Vacancy"
                          className="p-1 rounded text-ink-400 hover:text-brand-600 dark:hover:text-brand-300"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setJobToEdit(job);
                            setIsWizardModalOpen(true);
                          }}
                          title="Edit Vacancy"
                          className="p-1 rounded text-ink-400 hover:text-brand-600 dark:hover:text-brand-300"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setJobToDelete(job)}
                          title="Delete Vacancy"
                          className="p-1 rounded text-ink-400 hover:text-status-rejected"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-ink-100 dark:border-ink-800">
            <div>
              <h3 className="text-sm font-bold text-ink-900 dark:text-white font-display flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                <span>ATS Pipeline {selectedJob ? `— ${selectedJob.title}` : ''}</span>
              </h3>
              <p className="text-2xs text-ink-500 dark:text-ink-400">
                {applications.length} candidate(s) in active pipeline
              </p>
            </div>

            {/* Segmented Control View Toggle */}
            <Tabs
              tabs={[
                { id: 'kanban', label: 'Kanban Board', icon: LayoutGrid },
                { id: 'table', label: 'Table View', icon: TableIcon },
              ]}
              activeTab={atsViewMode}
              onChange={setAtsViewMode}
              variant="segmented"
            />
          </div>

          {/* ATS Pipeline view */}
          {loadingApps ? (
            <div className="h-64 rounded-2xl bg-ink-100 dark:bg-ink-800 animate-pulse border border-ink-200 dark:border-ink-700" />
          ) : !selectedJob ? (
            <EmptyState
              icon={Users}
              title="Select a job vacancy"
              description="Choose a job posting from the left sidebar to view its candidate pipeline."
            />
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(jobToDelete)}
        onClose={() => setJobToDelete(null)}
        title="Confirm Delete Vacancy"
        subtitle="This action cannot be undone."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-status-rejected/10 border border-status-rejected/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-status-rejected shrink-0 mt-0.5" />
            <p className="text-xs text-ink-700 dark:text-ink-200">
              Are you sure you want to permanently delete <strong>"{jobToDelete?.title}"</strong>? All associated applicant submissions will be removed.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setJobToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteJob}>
              Delete Vacancy
            </Button>
          </div>
        </div>
      </Modal>

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

export default RecruiterDashboardPage;
