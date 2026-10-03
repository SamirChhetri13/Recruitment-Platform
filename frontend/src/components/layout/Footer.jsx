import React from 'react';
import { Briefcase, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full glass-panel border-t border-[var(--border)] text-[var(--text-muted)] mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-[var(--text)]">
                Talent<span className="gradient-text">Pulse</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Empowering global teams with seamless hiring pipelines and automated talent matching.
            </p>
          </div>

          {/* Candidates */}
          <div>
            <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider mb-4">Candidates</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Browse Job Openings</Link></li>
              <li><Link to="/my-applications" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Track Submitted Applications</Link></li>
              <li><Link to="/saved-jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Saved Vacancies</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider mb-4">Employers</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/recruiter/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Post Vacancies</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Applicant Tracking System</Link></li>
            </ul>
          </div>

          {/* Security & Badges */}
          <div>
            <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider mb-4">Platform Trust</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Encrypted JWT Auth</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                <Zap className="w-4 h-4" />
                <span>Real-time Status Pipeline</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-subtle)]">
          <p>© {new Date().getFullYear()} TalentPulse Recruitment Portal. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed with precision for modern tech hiring</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
