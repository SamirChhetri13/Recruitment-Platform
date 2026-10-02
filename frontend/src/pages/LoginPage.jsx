import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Briefcase, ArrowRight, UserCheck, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { loginSchema } from '../schemas/authSchemas';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/jobs';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const user = await login(data);
      if (user.role === 'recruiter' || user.role === 'admin') {
        navigate('/recruiter/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Axios interceptor will show toast error automatically
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl overflow-hidden min-h-[540px]">
        
        {/* Left Visual Hero Pane */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-teal-600/10 dark:from-blue-950/50 dark:via-indigo-950/40 dark:to-slate-900 relative overflow-hidden border-r border-slate-200 dark:border-slate-800">
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Branding */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                Talent<span className="gradient-text">Pulse</span>
              </span>
            </div>
          </div>

          {/* Middle Value Props */}
          <div className="space-y-6 relative z-10">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Enterprise Recruitment Platform
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Streamline Your Career & Hiring Pipeline
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect candidates and hiring managers with automated applicant tracking, real-time application updates, and verified job postings.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Encrypted JWT Authentication & Role Guards</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Interactive ATS Kanban Pipeline</span>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial badge */}
          <div className="glass-panel p-4 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1 relative z-10">
            <p className="text-slate-700 dark:text-slate-300 italic font-medium">"TalentPulse cut our developer hiring cycle from weeks down to days."</p>
            <p className="text-[11px] text-slate-500 font-bold">— Engineering Hiring Lead</p>
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6 relative z-10">
          
          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sign in to TalentPulse</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enter your credentials to access your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white gradient-bg-primary shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
