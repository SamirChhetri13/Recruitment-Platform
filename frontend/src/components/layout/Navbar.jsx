import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, LogOut, Search, Menu, X, ChevronDown, 
  Layers, FileText, Settings, Shield, Bookmark, ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/Dropdown';

export const Navbar = () => {
  const { user, isAuthenticated, isRecruiter, isCandidate, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  // Minimal Header for Auth Pages
  if (isAuthPage) {
    return (
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-ink-900/80 backdrop-blur-md border-b border-ink-100 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:shadow-focus rounded-xl p-1">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-lift group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-ink-900 dark:text-white font-display">
                Talent<span className="text-brand-600 dark:text-brand-300">Pulse</span>
              </span>
              <span className="text-[10px] text-ink-400 dark:text-ink-400 font-semibold tracking-wider -mt-1 uppercase">Recruitment Hub</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/jobs"
              className="flex items-center gap-1.5 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to jobs</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border-b border-ink-100 dark:border-ink-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:shadow-focus rounded-xl p-1">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-lift group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-ink-900 dark:text-white font-display">
              Talent<span className="text-brand-600 dark:text-brand-300">Pulse</span>
            </span>
            <span className="text-[10px] text-ink-400 dark:text-ink-400 font-semibold tracking-wider -mt-1 uppercase">Recruitment Hub</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          <Link
            to="/jobs"
            className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl transition-all focus-visible:outline-none focus-visible:shadow-focus ${
              isActive('/jobs')
                ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 font-semibold'
                : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100/60 dark:hover:bg-ink-800/60'
            }`}
          >
            <Search className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Explore Jobs
          </Link>

          {isAuthenticated && isCandidate && (
            <>
              <Link
                to="/my-applications"
                className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl transition-all focus-visible:outline-none focus-visible:shadow-focus ${
                  isActive('/my-applications')
                    ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 font-semibold'
                    : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100/60 dark:hover:bg-ink-800/60'
                }`}
              >
                <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                My Applications
              </Link>
              <Link
                to="/saved-jobs"
                className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl transition-all focus-visible:outline-none focus-visible:shadow-focus ${
                  isActive('/saved-jobs')
                    ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 font-semibold'
                    : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100/60 dark:hover:bg-ink-800/60'
                }`}
              >
                <Bookmark className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Saved Vacancies
              </Link>
            </>
          )}

          {isAuthenticated && isRecruiter && (
            <Link
              to="/recruiter/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl transition-all focus-visible:outline-none focus-visible:shadow-focus ${
                isActive('/recruiter/dashboard')
                  ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 font-semibold'
                  : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100/60 dark:hover:bg-ink-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Recruiter ATS Portal
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl transition-all focus-visible:outline-none focus-visible:shadow-focus ${
                isActive('/admin/dashboard')
                  ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 font-semibold'
                  : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100/60 dark:hover:bg-ink-800/60'
              }`}
            >
              <Shield className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Admin Console
            </Link>
          )}
        </nav>

        {/* Right Nav CTA / Profile Dropdown */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <Dropdown
              trigger={
                <button
                  type="button"
                  aria-label="User profile options"
                  className="flex items-center gap-2.5 px-3 py-1.5 min-h-[44px] rounded-full border border-ink-200 dark:border-ink-700 bg-surface dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 transition-all focus-visible:outline-none focus-visible:shadow-focus cursor-pointer shadow-sm"
                >
                  <Avatar name={user?.name} size="xs" />
                  <div className="flex flex-col text-left pr-1">
                    <span className="text-xs font-bold text-ink-900 dark:text-white leading-none">{user?.name}</span>
                    <span className="text-[10px] text-brand-600 dark:text-brand-300 font-semibold capitalize mt-0.5">{user?.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
                </button>
              }
            >
              <div className="px-4 py-2 border-b border-ink-100 dark:border-ink-800">
                <p className="text-2xs font-semibold text-ink-400 uppercase tracking-wider">Signed in as</p>
                <p className="text-xs font-bold text-ink-900 dark:text-white truncate">{user?.email}</p>
              </div>

              <DropdownItem icon={Settings} onClick={() => navigate('/settings')}>
                Profile Settings
              </DropdownItem>

              {isAdmin && (
                <DropdownItem icon={Shield} onClick={() => navigate('/admin/dashboard')}>
                  Admin Console
                </DropdownItem>
              )}

              {isRecruiter && (
                <DropdownItem icon={Layers} onClick={() => navigate('/recruiter/dashboard')}>
                  Recruiter ATS
                </DropdownItem>
              )}

              {isCandidate && (
                <>
                  <DropdownItem icon={FileText} onClick={() => navigate('/my-applications')}>
                    Tracked Applications
                  </DropdownItem>
                  <DropdownItem icon={Bookmark} onClick={() => navigate('/saved-jobs')}>
                    Saved Vacancies
                  </DropdownItem>
                </>
              )}

              <DropdownDivider />
              <DropdownItem icon={LogOut} danger onClick={handleLogout}>
                Sign Out
              </DropdownItem>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-ink-700 dark:text-ink-200 hover:text-ink-900 dark:hover:text-white transition-colors min-h-[44px] flex items-center rounded-xl focus-visible:shadow-focus"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-bold text-white bg-sun-gradient shadow-cta hover:brightness-105 rounded-xl transition-all min-h-[44px] flex items-center focus-visible:shadow-focus"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            type="button"
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 focus-visible:shadow-focus rounded-xl border border-ink-200 dark:border-ink-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 pt-2 pb-6 space-y-3 animate-fade-up">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-ink-800 dark:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 min-h-[44px] font-medium text-sm"
          >
            <Search className="w-4 h-4 text-brand-600 dark:text-brand-300" />
            Explore Jobs
          </Link>

          {isAuthenticated && isCandidate && (
            <>
              <Link
                to="/my-applications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-ink-800 dark:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 min-h-[44px] font-medium text-sm"
              >
                <FileText className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                My Applications
              </Link>
              <Link
                to="/saved-jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-ink-800 dark:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 min-h-[44px] font-medium text-sm"
              >
                <Bookmark className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                Saved Vacancies
              </Link>
            </>
          )}

          {isAuthenticated && isRecruiter && (
            <Link
              to="/recruiter/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-ink-800 dark:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 min-h-[44px] font-medium text-sm"
            >
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-300" />
              Recruiter ATS Portal
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-ink-800 dark:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 min-h-[44px] font-medium text-sm"
            >
              <Shield className="w-4 h-4 text-brand-600 dark:text-brand-300" />
              Admin Console
            </Link>
          )}

          <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar name={user?.name} size="sm" />
                  <div>
                    <div className="text-sm font-bold text-ink-900 dark:text-white">{user?.name}</div>
                    <div className="text-xs text-brand-600 dark:text-brand-300 font-semibold capitalize">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  type="button"
                  aria-label="Sign out"
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-status-rejected hover:bg-status-rejected/10 font-semibold min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-xs font-semibold text-ink-700 dark:text-ink-200 border border-ink-200 dark:border-ink-700 rounded-xl min-h-[44px] flex items-center justify-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-xs font-bold text-white bg-sun-gradient shadow-cta rounded-xl min-h-[44px] flex items-center justify-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
