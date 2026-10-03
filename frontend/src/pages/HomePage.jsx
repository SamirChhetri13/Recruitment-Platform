import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, ArrowRight, Sparkles, Layers, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge } from '../components/ui';

export const HomePage = () => {
  const { isAuthenticated, isRecruiter } = useAuth();

  return (
    <div className="space-y-12 sm:space-y-16 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <Card className="p-6 sm:p-10 md:p-16 relative overflow-hidden text-center space-y-6 bg-hero-mesh border-ink-100 dark:border-ink-800">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-sun-500" />
          <span>Enterprise Recruitment & Hiring Hub</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto text-ink-900 dark:text-white font-display leading-tight">
          Accelerate your hiring & <span className="text-brand-600 dark:text-brand-300">land your next role</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-ink-500 dark:text-ink-400 max-w-2xl mx-auto leading-relaxed font-sans">
          Connecting top talent with industry-leading teams through real-time applicant tracking, instant status pipelines, and verified remote openings.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 w-full max-w-md mx-auto sm:max-w-none">
          {/* SINGLE SAFFRON HIGHLIGHT CTA PER VIEWPORT */}
          <Link to="/jobs" className="w-full sm:w-auto">
            <Button
              variant="accent"
              size="lg"
              className="w-full sm:w-auto"
              leftIcon={Search}
              rightIcon={ArrowRight}
            >
              Explore Vacancies
            </Button>
          </Link>

          {!isAuthenticated && (
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={Building2}
              >
                Post a Job as Employer
              </Button>
            </Link>
          )}

          {isAuthenticated && isRecruiter && (
            <Link to="/recruiter/dashboard" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={Layers}
              >
                Go to Recruiter ATS
              </Button>
            </Link>
          )}
        </div>

        {/* Key Trust Metrics */}
        <div className="pt-8 sm:pt-10 border-t border-ink-100 dark:border-ink-800 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto text-center">
          <div className="p-3 rounded-2xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800">
            <p className="text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-white font-display">100%</p>
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400">Verified Openings</p>
          </div>
          <div className="p-3 rounded-2xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800">
            <p className="text-xl sm:text-2xl font-extrabold text-brand-600 dark:text-brand-300 font-display">Instant</p>
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400">Pipeline Sync</p>
          </div>
          <div className="p-3 rounded-2xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800">
            <p className="text-xl sm:text-2xl font-extrabold text-ink-900 dark:text-white font-display">Real-time</p>
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400">ATS Kanban</p>
          </div>
          <div className="p-3 rounded-2xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800">
            <p className="text-xl sm:text-2xl font-extrabold text-brand-600 dark:text-brand-300 font-display">1-Click</p>
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400">CV Applications</p>
          </div>
        </div>
      </Card>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card hoverEffect className="space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-ink-900 dark:text-white font-display">Smart Job Discovery</h3>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
            Search active openings by job type, experience level, salary range, and specific tech stack skills.
          </p>
        </Card>

        <Card hoverEffect className="space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sun-50 dark:bg-sun-950 text-sun-600 dark:text-sun-300 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-ink-900 dark:text-white font-display">ATS Kanban Board</h3>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
            Recruiters manage candidate pipelines through drag-and-drop Kanban columns with instant toast updates and undo actions.
          </p>
        </Card>

        <Card hoverEffect className="space-y-3 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-ink-900 dark:text-white font-display">Tailored Dashboards</h3>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
            Dedicated portals for Job Seekers to track applications and Employers to manage job vacancies efficiently.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
