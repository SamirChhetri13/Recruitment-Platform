import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, LogOut, PlusCircle, Search, Menu, X, ChevronDown, Layers, FileText, Settings, Shield, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';

export const Navbar = () => {
  const { user, isAuthenticated, isRecruiter, isCandidate, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Talent<span className="gradient-text">Pulse</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-wider -mt-1 uppercase">Recruitment Hub</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <Link
            to="/jobs"
            className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl transition-all ${
              isActive('/jobs')
                ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4" />
            Explore Jobs
          </Link>

          {isAuthenticated && isCandidate && (
            <>
              <Link
                to="/my-applications"
                className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl transition-all ${
                  isActive('/my-applications')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4" />
                My Applications
              </Link>
              <Link
                to="/saved-jobs"
                className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl transition-all ${
                  isActive('/saved-jobs')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Saved Jobs
              </Link>
            </>
          )}

          {isAuthenticated && isRecruiter && (
            <Link
              to="/recruiter/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl transition-all ${
                isActive('/recruiter/dashboard')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              Recruiter Portal
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl transition-all ${
                isActive('/admin/dashboard')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right CTA / User Action area */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User navigation menu"
                className="flex items-center gap-3 px-3 py-1.5 min-h-[44px] rounded-full glass-panel hover:border-slate-300 dark:hover:border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">{user?.name}</span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 capitalize font-medium">{user?.role}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel bg-white dark:bg-slate-900/95 shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[44px]"
                  >
                    <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Profile Settings
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[44px]"
                    >
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Admin Console
                    </Link>
                  )}

                  {isRecruiter && (
                    <Link
                      to="/recruiter/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[44px]"
                    >
                      <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Manage Vacancies
                    </Link>
                  )}

                  {isCandidate && (
                    <>
                      <Link
                        to="/my-applications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[44px]"
                      >
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Tracked Applications
                      </Link>
                      <Link
                        to="/saved-jobs"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[44px]"
                      >
                        <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Saved Vacancies
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    aria-label="Sign out"
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-slate-200 dark:border-slate-800 mt-1 min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[44px] flex items-center"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white gradient-bg-primary rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[44px] flex items-center"
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
            aria-label="Toggle main menu"
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
          >
            <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Explore Jobs
          </Link>

          {isAuthenticated && isCandidate && (
            <>
              <Link
                to="/my-applications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
              >
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                My Applications
              </Link>
              <Link
                to="/saved-jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
              >
                <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Saved Jobs
              </Link>
            </>
          )}

          {isAuthenticated && isRecruiter && (
            <Link
              to="/recruiter/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
            >
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Recruiter Portal
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
            >
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Admin Portal
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
            >
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Profile Settings
            </Link>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 capitalize font-medium">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  aria-label="Sign out"
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 min-h-[44px]"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl min-h-[44px] flex items-center justify-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white gradient-bg-primary rounded-xl min-h-[44px] flex items-center justify-center"
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

