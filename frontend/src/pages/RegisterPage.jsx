import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Briefcase, UserCheck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { registerSchema } from '../schemas/authSchemas';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'candidate',
    },
  });

  const selectedRole = watch('role');
  const passwordValue = watch('password');

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-700' };
    if (pwd.length < 6) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (pwd.length < 10) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { confirmPassword, ...payload } = data;
      const user = await registerAuth(payload);
      if (user.role === 'recruiter' || user.role === 'admin') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      // Axios interceptor handles toast error automatically
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl glass-panel border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden min-h-[620px]">
        
        {/* Left Hero Pane */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-purple-900/40 via-indigo-900/20 to-slate-900 relative overflow-hidden border-r border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Talent<span className="gradient-text">Pulse</span>
              </span>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Join the Recruitment Network
              </span>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Empowering Top Talent & Employers
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create your account in seconds to post vacancies, manage applications, or apply for verified remote & on-site positions.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Candidate Profile & One-Click CV Applications</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Recruiter Job Publishing & Multi-Step Wizard</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time ATS Pipeline Stage Drag-and-Drop</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 relative z-10">
            <p className="text-slate-300 font-bold">Trusted by hiring managers worldwide</p>
            <p className="text-[11px] text-slate-500">Fast authentication powered by JWT tokens</p>
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-5 relative z-10">
          
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Create your account</h2>
            <p className="text-xs text-slate-400">Select your account type to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            
            {/* Role selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue('role', 'candidate')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    selectedRole === 'candidate'
                      ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500 shadow-sm'
                      : 'glass-panel text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Candidate / Job Seeker
                </button>

                <button
                  type="button"
                  onClick={() => setValue('role', 'recruiter')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    selectedRole === 'recruiter'
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500 shadow-sm'
                      : 'glass-panel text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Recruiter / Employer
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Alex Morgan"
                  className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-400">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2 rounded-xl glass-input text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Strength bar */}
              {passwordValue && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${strength.color}`} style={{ width: `${(strength.score / 3) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{strength.label}</span>
                </div>
              )}
              {errors.password && <p className="text-[11px] text-rose-400">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
                />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-rose-400">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white gradient-bg-primary shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-1">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
              Sign in instead
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
