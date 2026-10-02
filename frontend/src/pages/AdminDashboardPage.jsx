import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Users, Briefcase, Search, RefreshCw, CheckCircle2, XCircle, AlertCircle, Edit } from 'lucide-react';
import { getAdminUsers, updateAdminUserStatus, getAdminJobs, moderateAdminJobStatus } from '../api/admin.api';
import { Badge } from '../components/common/Badge';
import { formatDateAgo } from '../utils/helpers';
import toast from 'react-hot-toast';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'jobs'
  
  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobSearch, setJobSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await getAdminUsers({ search: userSearch });
      if (res.success && res.data) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const res = await getAdminJobs({ search: jobSearch });
      if (res.success && res.data) {
        setJobs(res.data.jobs || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'jobs') fetchJobs();
  }, [activeTab]);

  const handleToggleUserActive = async (user) => {
    try {
      const newActive = !user.isActive;
      const res = await updateAdminUserStatus(user._id, { isActive: newActive });
      if (res.success) {
        toast.success(`User ${user.name} is now ${newActive ? 'active' : 'disabled'}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: newActive } : u))
        );
      }
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const handleChangeRole = async (user, newRole) => {
    try {
      const res = await updateAdminUserStatus(user._id, { role: newRole });
      if (res.success) {
        toast.success(`Role updated for ${user.name}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      toast.error('Failed to change role');
    }
  };

  const handleToggleJobStatus = async (job) => {
    try {
      const newStatus = job.status === 'open' ? 'closed' : 'open';
      const res = await moderateAdminJobStatus(job._id, { status: newStatus });
      if (res.success) {
        toast.success(`Vacancy status changed to ${newStatus}`);
        setJobs((prev) =>
          prev.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j))
        );
      }
    } catch (err) {
      toast.error('Failed to moderate job');
    }
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Admin Moderation Console | TalentPulse</title>
        <meta name="description" content="Admin dashboard for managing platform users and moderating job postings." />
      </Helmet>

      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-400" />
            Admin Moderation Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform governance, user account status controls, and job vacancy moderation.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 shrink-0">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 min-h-[44px] ${
              activeTab === 'users'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 min-h-[44px] ${
              activeTab === 'jobs'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Job Moderation ({jobs.length})
          </button>
        </div>
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs min-h-[44px]"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold glass-panel hover:bg-slate-800 text-slate-300 flex items-center gap-1.5 min-h-[44px]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              Refresh
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Joined</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {usersLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No user accounts found
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold text-slate-100 truncate">{u.name}</p>
                              <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-slate-200 text-[11px] py-1 px-2 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 capitalize"
                          >
                            <option value="candidate">candidate</option>
                            <option value="recruiter">recruiter</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              u.isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {u.isActive ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" /> Disabled
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {formatDateAgo(u.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleUserActive(u)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                              u.isActive
                                ? 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/20'
                                : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20'
                            }`}
                          >
                            {u.isActive ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JOB MODERATION */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs min-h-[44px]"
              />
            </div>
            <button
              onClick={fetchJobs}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold glass-panel hover:bg-slate-800 text-slate-300 flex items-center gap-1.5 min-h-[44px]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              Refresh
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4">Vacancy Title</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Posted By</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {jobsLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Loading vacancies...
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No job vacancies found
                      </td>
                    </tr>
                  ) : (
                    jobs.map((j) => (
                      <tr key={j._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-100">{j.title}</td>
                        <td className="py-3.5 px-4 text-slate-300">{j.company}</td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {j.postedBy?.name || 'Recruiter'}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={j.status === 'open' ? 'success' : 'default'} className="capitalize">
                            {j.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleJobStatus(j)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                              j.status === 'open'
                                ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/20'
                                : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20'
                            }`}
                          >
                            {j.status === 'open' ? 'Close Vacancy' : 'Reopen Vacancy'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
