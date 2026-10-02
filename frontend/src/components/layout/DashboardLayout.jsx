import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Layers, FileText, PlusCircle, LogOut, ChevronLeft, ChevronRight, 
  User, Bell, ChevronRight as BreadcrumbSeparator, Home, Menu, X, Settings, Shield, Bookmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Footer } from './Footer';
import { ThemeToggle } from '../common/ThemeToggle';

export const DashboardLayout = () => {
  const { user, isRecruiter, isCandidate, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBreadcrumbTitle = () => {
    if (location.pathname.includes('/recruiter/dashboard')) return 'Recruiter Portal';
    if (location.pathname.includes('/my-applications')) return 'Candidate Workspace';
    if (location.pathname.includes('/jobs')) return 'Job Openings';
    if (location.pathname.includes('/settings')) return 'Profile Settings';
    if (location.pathname.includes('/admin')) return 'Admin Dashboard';
    if (location.pathname.includes('/saved-jobs')) return 'Saved Jobs';
    return 'Dashboard';
  };

  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  return (
    <div className="min-h-screen flex app-bg">
      
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl sticky top-0 h-screen z-30 shrink-0"
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-extrabold text-lg text-white tracking-tight truncate">
                Talent<span className="gradient-text">Pulse</span>
              </span>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Mini Info */}
        {!collapsed && (
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-100 truncate">{user?.name}</p>
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {isAdmin && (
            <>
              <p className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 ${collapsed ? 'text-center' : ''}`}>
                {collapsed ? '•••' : 'Administration'}
              </p>
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/admin/dashboard'
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Shield className="w-4 h-4 shrink-0 text-indigo-400" />
                {!collapsed && <span>Admin Console</span>}
              </Link>
            </>
          )}

          {isRecruiter && (
            <>
              <p className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 ${collapsed ? 'text-center' : ''}`}>
                {collapsed ? '•••' : 'Management'}
              </p>

              <Link
                to="/recruiter/dashboard"
                className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/recruiter/dashboard'
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0 text-indigo-400" />
                {!collapsed && <span>Recruiter Portal & ATS</span>}
              </Link>
            </>
          )}

          {isCandidate && (
            <>
              <p className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 ${collapsed ? 'text-center' : ''}`}>
                {collapsed ? '•••' : 'Workspace'}
              </p>

              <Link
                to="/my-applications"
                className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/my-applications'
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0 text-indigo-400" />
                {!collapsed && <span>My Applications</span>}
              </Link>

              <Link
                to="/saved-jobs"
                className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/saved-jobs'
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Bookmark className="w-4 h-4 shrink-0 text-indigo-400" />
                {!collapsed && <span>Saved Vacancies</span>}
              </Link>
            </>
          )}

          <p className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? '•••' : 'Discovery & Settings'}
          </p>

          <Link
            to="/jobs"
            className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
              location.pathname === '/jobs'
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0 text-indigo-400" />
            {!collapsed && <span>Public Job Feed</span>}
          </Link>

          <Link
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
              location.pathname === '/settings'
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0 text-indigo-400" />
            {!collapsed && <span>Profile Settings</span>}
          </Link>
        </nav>

        {/* Logout bottom CTA */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Drawer Navigation (Slide-in) */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileDrawer}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 z-50 p-4 flex flex-col justify-between shadow-2xl md:hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <Link to="/" onClick={closeMobileDrawer} className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center shrink-0 shadow">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-lg text-white">
                      Talent<span className="gradient-text">Pulse</span>
                    </span>
                  </Link>
                  <button
                    onClick={closeMobileDrawer}
                    aria-label="Close navigation drawer"
                    className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile User Card */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-100 truncate">{user?.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize bg-indigo-500/20 text-indigo-300">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1.5 pt-2">
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={closeMobileDrawer}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
                    >
                      <Shield className="w-5 h-5 text-indigo-400" />
                      Admin Console
                    </Link>
                  )}

                  {isRecruiter && (
                    <Link
                      to="/recruiter/dashboard"
                      onClick={closeMobileDrawer}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
                    >
                      <Layers className="w-5 h-5 text-indigo-400" />
                      Recruiter Portal & ATS
                    </Link>
                  )}

                  {isCandidate && (
                    <>
                      <Link
                        to="/my-applications"
                        onClick={closeMobileDrawer}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
                      >
                        <FileText className="w-5 h-5 text-indigo-400" />
                        My Applications
                      </Link>
                      <Link
                        to="/saved-jobs"
                        onClick={closeMobileDrawer}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
                      >
                        <Bookmark className="w-5 h-5 text-indigo-400" />
                        Saved Vacancies
                      </Link>
                    </>
                  )}

                  <Link
                    to="/jobs"
                    onClick={closeMobileDrawer}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                    Public Job Feed
                  </Link>

                  <Link
                    to="/settings"
                    onClick={closeMobileDrawer}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <Settings className="w-5 h-5 text-indigo-400" />
                    Profile Settings
                  </Link>
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    closeMobileDrawer();
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Hamburger Trigger for Mobile */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open mobile navigation"
              className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 overflow-hidden">
              <Link to="/" className="hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1 shrink-0">
                <Home className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <BreadcrumbSeparator className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{getBreadcrumbTitle()}</span>
            </div>
          </div>
          {/* User Profile Dropdown & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User account menu"
                className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-full glass-panel hover:border-slate-300 dark:hover:border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline truncate max-w-[120px]">{user?.name}</span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-52 rounded-2xl glass-panel bg-slate-900 shadow-2xl border border-slate-800 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-[11px] text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-indigo-400 capitalize truncate">{user?.name}</p>
                    </div>

                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 font-medium min-h-[44px]"
                    >
                      <Settings className="w-4 h-4 text-indigo-400" />
                      Profile Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      aria-label="Sign out"
                      className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-medium min-h-[44px]"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

