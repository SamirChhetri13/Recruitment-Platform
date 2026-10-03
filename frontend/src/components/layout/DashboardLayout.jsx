import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Layers, FileText, LogOut, Search,
  ChevronRight as BreadcrumbSeparator, Home, Menu, X, Settings, Shield, Bookmark, Bell, Command
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '../common/ThemeToggle';
import { Avatar, Dropdown, DropdownItem, DropdownDivider, Modal } from '../ui';

export const DashboardLayout = () => {
  const { user, isRecruiter, isCandidate, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getBreadcrumbTitle = () => {
    if (location.pathname.includes('/recruiter/dashboard')) return 'Recruiter Portal';
    if (location.pathname.includes('/my-applications')) return 'Candidate Workspace';
    if (location.pathname.includes('/jobs')) return 'Job Openings';
    if (location.pathname.includes('/settings')) return 'Profile Settings';
    if (location.pathname.includes('/admin')) return 'Admin Dashboard';
    if (location.pathname.includes('/saved-jobs')) return 'Saved Vacancies';
    return 'Dashboard';
  };

  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  const quickLinks = [
    { label: 'Explore Job Openings', path: '/jobs', icon: Search },
    { label: 'Profile & Resume Settings', path: '/settings', icon: Settings },
    ...(isRecruiter ? [{ label: 'Recruiter ATS & Kanban', path: '/recruiter/dashboard', icon: Layers }] : []),
    ...(isCandidate ? [{ label: 'My Job Applications', path: '/my-applications', icon: FileText }] : []),
    ...(isAdmin ? [{ label: 'Admin Management Console', path: '/admin/dashboard', icon: Shield }] : []),
  ];

  const filteredLinks = quickLinks.filter((link) =>
    link.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-surface-muted dark:bg-surface-dark-muted text-ink-800 dark:text-ink-100 antialiased font-sans">
      
      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onLogout={handleLogout}
      />

      {/* Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-ink-950/60 backdrop-blur-sm"
            onClick={closeMobileDrawer}
          />
          <aside className="relative w-72 bg-white dark:bg-ink-900 border-r border-ink-100 dark:border-ink-800 p-4 flex flex-col justify-between z-10 shadow-lift animate-fade-up">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-ink-100 dark:border-ink-800 pb-3">
                <Link to="/" onClick={closeMobileDrawer} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0 shadow-sm">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-extrabold text-lg text-ink-900 dark:text-white font-display">
                    Talent<span className="text-brand-600 dark:text-brand-300">Pulse</span>
                  </span>
                </Link>
                <button
                  onClick={closeMobileDrawer}
                  aria-label="Close navigation drawer"
                  type="button"
                  className="p-2 rounded-xl text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile User Card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted dark:bg-surface-dark-muted border border-ink-100 dark:border-ink-800">
                <Avatar name={user?.name} size="sm" />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-ink-900 dark:text-white truncate">{user?.name}</p>
                  <span className="text-2xs text-brand-600 dark:text-brand-300 font-semibold capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Drawer Links */}
              <nav className="space-y-1 pt-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobileDrawer}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 min-h-[44px]"
                  >
                    <link.icon className="w-5 h-5 text-brand-600 dark:text-brand-300" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
              <button
                onClick={() => {
                  closeMobileDrawer();
                  handleLogout();
                }}
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-status-rejected bg-status-rejected/10 hover:bg-status-rejected/20 min-h-[44px]"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 sticky top-0 z-20 border-b border-ink-100 dark:border-ink-800 bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open mobile navigation"
              type="button"
              className="md:hidden p-2 rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 border border-ink-200 dark:border-ink-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-ink-500 dark:text-ink-400 overflow-hidden">
              <Link to="/" className="hover:text-ink-900 dark:hover:text-white flex items-center gap-1 shrink-0">
                <Home className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <BreadcrumbSeparator className="w-3.5 h-3.5 text-ink-300 dark:text-ink-600 shrink-0" />
              <span className="font-bold text-ink-900 dark:text-white truncate">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          {/* Center Command Palette Quick Search Button */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            type="button"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-ink-200 dark:border-ink-700 bg-surface-muted dark:bg-surface-dark-muted text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition-colors text-xs font-medium"
          >
            <Search className="w-3.5 h-3.5 text-ink-400" />
            <span>Search platform...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-2xs font-mono rounded bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 shadow-2xs">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* User Profile Dropdown, Notifications Bell & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              type="button"
              onClick={() => alert("No unread notifications.")}
              aria-label="Notifications"
              className="relative p-2 rounded-xl text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-status-shortlisted ring-2 ring-white dark:ring-ink-900" />
            </button>

            <ThemeToggle />

            {/* Profile Dropdown */}
            <Dropdown
              trigger={
                <button
                  type="button"
                  aria-label="User account menu"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 transition-all focus-visible:shadow-focus min-h-[44px] cursor-pointer shadow-sm"
                >
                  <Avatar name={user?.name} size="xs" />
                  <span className="text-xs font-bold text-ink-900 dark:text-white hidden sm:inline truncate max-w-[120px]">
                    {user?.name}
                  </span>
                </button>
              }
            >
              <div className="px-4 py-2 border-b border-ink-100 dark:border-ink-800">
                <p className="text-2xs font-semibold text-ink-400 uppercase tracking-wider">Signed in as</p>
                <p className="text-xs font-bold text-ink-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-2xs text-brand-600 dark:text-brand-300 capitalize font-medium">{user?.role}</p>
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
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-up">
          <Outlet />
        </main>
        
        <Footer />
      </div>

      {/* Command / Search Palette Modal */}
      <Modal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        title="Quick Command & Navigation"
        subtitle="Type to search pages, portals and tools (Cmd + K)"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages or shortcuts..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-white focus:outline-none focus:shadow-focus"
              autoFocus
            />
          </div>

          <div className="space-y-1">
            {filteredLinks.length > 0 ? (
              filteredLinks.map((link) => (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => {
                    setCommandPaletteOpen(false);
                    navigate(link.path);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 dark:hover:text-brand-300 transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-4 h-4 text-ink-400" />
                    <span>{link.label}</span>
                  </div>
                  <kbd className="text-2xs font-mono text-ink-400">{link.path}</kbd>
                </button>
              ))
            ) : (
              <p className="text-xs text-center text-ink-400 py-4">No matching navigation links found.</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardLayout;
