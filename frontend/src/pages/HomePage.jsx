import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Users, ShieldCheck, ArrowRight, Sparkles, Layers, Zap, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { isAuthenticated, isRecruiter, isCandidate } = useAuth();

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <div className="glass-panel p-10 md:p-16 rounded-3xl border border-slate-800 bg-slate-900/90 relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Modern Recruitment & Automated ATS Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Accelerate Your Hiring & <span className="gradient-text">Land Dream Roles</span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Connecting ambitious candidates with industry-leading technology teams. Streamlined applicant tracking, real-time application status pipelines, and instant vacancies management.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/jobs"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white gradient-bg-primary shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Explore Open Vacancies
            <ArrowRight className="w-4 h-4" />
          </Link>

          {!isAuthenticated && (
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-slate-200 glass-panel hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Post a Vacancy as Recruiter
            </Link>
          )}

          {isAuthenticated && isRecruiter && (
            <Link
              to="/recruiter/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Go to Recruiter Portal
            </Link>
          )}
        </div>

        {/* Trust metrics */}
        <div className="pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
          <div>
            <p className="text-2xl font-extrabold text-white">100%</p>
            <p className="text-xs text-slate-400">Verified Openings</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-indigo-400">JWT</p>
            <p className="text-xs text-slate-400">Secure Auth</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">Real-time</p>
            <p className="text-xs text-slate-400">ATS Pipeline</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-indigo-400">0s</p>
            <p className="text-xs text-slate-400">Status Delays</p>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel glass-panel-hover p-8 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Smart Job Discovery</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Search active openings by job type, experience level, salary range, and specific tech stack skills.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover p-8 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Applicant Tracking System</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Recruiters manage candidate pipelines through intuitive Table and Kanban board views with instant status updates.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover p-8 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Role-Based Access</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strict authorization guards separating Candidate application submission from Recruiter management workflows.
          </p>
        </div>
      </div>
    </div>
  );
};
