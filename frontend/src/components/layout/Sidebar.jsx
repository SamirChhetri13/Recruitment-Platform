import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Briefcase, Layers, FileText, LogOut, ChevronLeft, ChevronRight, 
  Settings, Shield, Bookmark, HelpCircle, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Tooltip } from '../ui';

export const Sidebar = ({ collapsed, onToggleCollapse, onLogout }) => {
  const { user, isRecruiter, isCandidate, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const renderNavLink = (to, label, Icon, sectionBadge = null) => {
    const active = isActive(to);

    const linkContent = (
      <Link
        to={to}
        className={`
          relative flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all select-none
          ${active 
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 font-bold shadow-sm' 
            : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100/60 dark:hover:bg-ink-800/60'}
        `}
      >
        {active && (
          <span className="absolute left-0 top-2 bottom-2 w-1 bg-brand-600 dark:bg-brand-400 rounded-r-full" />
        )}
        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-600 dark:text-brand-300' : 'text-ink-400 dark:text-ink-400'}`} />
        
        {!collapsed && (
          <span className="truncate flex-1">{label}</span>
        )}

        {!collapsed && sectionBadge && (
          <span className="px-1.5 py-0.5 text-2xs rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
            {sectionBadge}
          </span>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={to} content={label} position="right">
          {linkContent}
        </Tooltip>
      );
    }

    return <React.Fragment key={to}>{linkContent}</React.Fragment>;
  };

  return (
    <aside
      className={`
        hidden md:flex flex-col border-r border-ink-100 dark:border-ink-800 
        bg-white dark:bg-ink-900 
        sticky top-0 h-screen z-30 shrink-0 transition-all duration-200
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Top Header & Logo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-ink-100 dark:border-ink-800">
        <Link 
          to="/" 
          className="flex items-center gap-2.5 overflow-hidden focus-visible:outline-none focus-visible:shadow-focus rounded-xl p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0 shadow-sm">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-lg text-ink-900 dark:text-white font-display tracking-tight truncate select-none">
              Talent<span className="text-brand-600 dark:text-brand-300">Pulse</span>
            </span>
          )}
        </Link>

        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
          className="p-2 rounded-xl text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors focus-visible:shadow-focus cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto custom-scrollbar">
        {/* Admin Section */}
        {isAdmin && (
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-2xs font-bold uppercase tracking-wider text-ink-400 px-3 py-1">
                Administration
              </p>
            )}
            {renderNavLink('/admin/dashboard', 'Admin Console', Shield)}
          </div>
        )}

        {/* Recruiter Management */}
        {isRecruiter && (
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-2xs font-bold uppercase tracking-wider text-ink-400 px-3 py-1">
                Recruitment ATS
              </p>
            )}
            {renderNavLink('/recruiter/dashboard', 'Recruiter Dashboard', Layers)}
          </div>
        )}

        {/* Candidate Workspace */}
        {isCandidate && (
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-2xs font-bold uppercase tracking-wider text-ink-400 px-3 py-1">
                Candidate Workspace
              </p>
            )}
            {renderNavLink('/my-applications', 'My Applications', FileText)}
            {renderNavLink('/saved-jobs', 'Saved Vacancies', Bookmark)}
          </div>
        )}

        {/* Discovery & Settings */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="text-2xs font-bold uppercase tracking-wider text-ink-400 px-3 py-1">
              Discovery & Settings
            </p>
          )}
          {renderNavLink('/jobs', 'Explore Job Feed', Search)}
          {renderNavLink('/settings', 'Profile Settings', Settings)}
        </div>
      </nav>

      {/* User Profile Card & Help Footer */}
      <div className="p-3 border-t border-ink-100 dark:border-ink-800 space-y-2 bg-surface-muted dark:bg-surface-dark-muted">
        {!collapsed && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-sm">
            <Avatar name={user?.name} size="xs" />
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-ink-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-2xs text-brand-600 dark:text-brand-300 font-semibold capitalize truncate">{user?.role}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => alert("TalentPulse Support & Documentation")}
            className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-ink-500 hover:text-ink-900 dark:hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Help & Docs</span>}
          </button>

          <button
            onClick={onLogout}
            aria-label="Sign out"
            type="button"
            className="p-2 rounded-xl text-status-rejected hover:bg-status-rejected/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
