import React from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, Layers, FileText, PlusCircle, User, Settings, CheckCircle2, Clock, Bookmark, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ onOpenJobModal }) => {
  const { isRecruiter, isCandidate, isAdmin, user } = useAuth();

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 glass-panel rounded-2xl p-5 border border-slate-800 space-y-6">
        
        {/* User Quick Info */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-100 truncate">{user?.name}</h4>
            <span className="inline-block text-[11px] px-2 py-0.5 rounded-full font-medium capitalize bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {user?.role} Portal
            </span>
          </div>
        </div>

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2">
              Administration
            </p>
            <nav className="space-y-1">
              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                Admin Console
              </NavLink>
            </nav>
          </div>
        )}

        {/* Recruiter Navigation */}
        {isRecruiter && (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2">
              Recruiter Management
            </p>

            <button
              onClick={onOpenJobModal}
              aria-label="Post new vacancy"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 min-h-[44px] rounded-xl font-semibold text-xs text-white gradient-bg-primary shadow-lg shadow-indigo-500/25 hover:scale-[1.02] transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <PlusCircle className="w-4 h-4" />
              Post New Vacancy
            </button>

            <nav className="space-y-1 pt-2">
              <NavLink
                to="/recruiter/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Layers className="w-4 h-4" />
                Vacancies & ATS Pipeline
              </NavLink>

              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Briefcase className="w-4 h-4" />
                Public Jobs Feed
              </NavLink>
            </nav>
          </div>
        )}

        {/* Candidate Navigation */}
        {isCandidate && (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2">
              Candidate Workspace
            </p>

            <nav className="space-y-1">
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Briefcase className="w-4 h-4" />
                Search Vacancies
              </NavLink>

              <NavLink
                to="/my-applications"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <FileText className="w-4 h-4" />
                My Applications
              </NavLink>

              <NavLink
                to="/saved-jobs"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Bookmark className="w-4 h-4" />
                Saved Vacancies
              </NavLink>
            </nav>
          </div>
        )}

        {/* General Settings */}
        <div className="pt-2 border-t border-slate-800 space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            Profile Settings
          </NavLink>
        </div>

      </div>
    </aside>
  );
};

