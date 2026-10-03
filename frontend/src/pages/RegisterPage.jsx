import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, UserCheck, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { registerSchema } from '../schemas/authSchemas';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Avatar } from '../components/ui';

export const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

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

  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-ink-300' };
    if (pwd.length < 6) return { score: 1, label: 'Weak', color: 'bg-status-rejected' };
    if (pwd.length < 10) return { score: 2, label: 'Fair', color: 'bg-status-shortlisted' };
    return { score: 3, label: 'Strong', color: 'bg-status-hired' };
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
      // Handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-card overflow-hidden min-h-[620px]">
        
        {/* Left Visual Brand Pane - 5 cols */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-brand-gradient text-white relative overflow-hidden bg-hero-mesh">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sun-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-sun-300" />
              <span>Join TalentPulse Today</span>
            </div>

            <h2 className="text-3xl font-extrabold font-display leading-tight">
              Empowering candidates & hiring teams alike.
            </h2>
            <p className="text-sm text-brand-100/90 leading-relaxed font-sans">
              Create an account to post job vacancies, manage candidate pipelines, or apply for verified positions in seconds.
            </p>

            <div className="space-y-3 pt-2 text-xs font-medium text-brand-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sun-300 shrink-0" />
                <span>Candidate Profile & Drag-and-Drop CV upload</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sun-300 shrink-0" />
                <span>Recruiter Vacancy Wizard & Kanban Board</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sun-300 shrink-0" />
                <span>Automated application status tracking</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-950/40 backdrop-blur-md border border-white/10 text-xs space-y-1 relative z-10">
            <p className="text-brand-100 font-bold">Enterprise ATS Engine</p>
            <p className="text-brand-200 text-2xs">Trusted by recruiters & developers worldwide</p>
          </div>
        </div>

        {/* Right Form Pane - 7 cols */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white font-display tracking-tight">
              Create your account
            </h1>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              Select your role to get tailored dashboard tools
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Account-type cards */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-700 dark:text-ink-300 tracking-wide uppercase">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'candidate')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 focus:outline-none focus:shadow-focus cursor-pointer ${
                    selectedRole === 'candidate'
                      ? 'border-brand-600 bg-brand-50/80 dark:bg-brand-950/50 dark:border-brand-400 ring-1 ring-brand-600'
                      : 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 hover:bg-ink-50 dark:hover:bg-ink-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${selectedRole === 'candidate' ? 'bg-brand-600 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300'}`}>
                      <UserCheck className="w-4 h-4" />
                    </div>
                    {selectedRole === 'candidate' && (
                      <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink-900 dark:text-white">I'm looking for a job</h4>
                    <p className="text-2xs text-ink-500 dark:text-ink-400 mt-0.5">Explore & apply for vacancies</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('role', 'recruiter')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 focus:outline-none focus:shadow-focus cursor-pointer ${
                    selectedRole === 'recruiter'
                      ? 'border-sun-500 bg-sun-50/80 dark:bg-sun-950/50 dark:border-sun-400 ring-1 ring-sun-500'
                      : 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 hover:bg-ink-50 dark:hover:bg-ink-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${selectedRole === 'recruiter' ? 'bg-sun-500 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300'}`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    {selectedRole === 'recruiter' && (
                      <CheckCircle2 className="w-4 h-4 text-sun-500 dark:text-sun-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink-900 dark:text-white">I'm hiring candidates</h4>
                    <p className="text-2xs text-ink-500 dark:text-ink-400 mt-0.5">Post jobs & manage Kanban ATS</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Morgan"
              leftIcon={User}
              error={errors.name?.message}
              autoFocus
              {...register('name')}
            />

            {/* Email Address */}
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@company.com"
              leftIcon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password */}
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                leftIcon={Lock}
                isPasswordToggleable
                error={errors.password?.message}
                onKeyDown={handleKeyDown}
                {...register('password')}
              />

              {/* Password strength meter */}
              {passwordValue && (
                <div className="flex items-center gap-2 pt-1 animate-fade-up">
                  <div className="flex-1 h-1.5 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-200 ${strength.color}`} style={{ width: `${(strength.score / 3) * 100}%` }} />
                  </div>
                  <span className="text-2xs font-semibold text-ink-500 dark:text-ink-400">{strength.label}</span>
                </div>
              )}

              {capsLockOn && (
                <div className="flex items-center gap-1 text-2xs text-sun-600 dark:text-sun-400 font-semibold mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Caps Lock is ON</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              leftIcon={ShieldCheck}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Register CTA */}
            <Button
              type="submit"
              variant="accent"
              isLoading={loading}
              className="w-full mt-2"
              rightIcon={ArrowRight}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-ink-500 dark:text-ink-400 pt-1 border-t border-ink-100 dark:border-ink-800">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
