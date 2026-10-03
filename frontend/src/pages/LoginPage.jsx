import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { loginSchema } from '../schemas/authSchemas';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Avatar } from '../components/ui';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

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
      // Toast notification is fired by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-card overflow-hidden min-h-[580px]">
        
        {/* Left Visual Brand Pane - 5 cols */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-brand-gradient text-white relative overflow-hidden bg-hero-mesh">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sun-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-sun-300" />
              <span>Modern Recruitment Platform</span>
            </div>
            
            <h2 className="text-3xl font-extrabold font-display leading-tight">
              Smarter hiring & career growth, simplified.
            </h2>
            <p className="text-sm text-brand-100/90 leading-relaxed font-sans">
              Join thousands of candidates and recruiters connecting through real-time applicant tracking and instant job matching.
            </p>

            <div className="space-y-3 pt-2 text-xs font-medium text-brand-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sun-300 shrink-0" />
                <span>Real-time candidate status funnel</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sun-300 shrink-0" />
                <span>One-click application management</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sun-300 shrink-0" />
                <span>Verified remote & on-site positions</span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="p-4 rounded-2xl bg-brand-950/40 backdrop-blur-md border border-white/10 text-xs space-y-2 relative z-10">
            <p className="text-brand-100 italic font-medium leading-relaxed">
              "TalentPulse accelerated our technical hiring from 3 weeks down to 5 days with zero friction."
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <Avatar name="Priya Sharma" size="xs" />
              <div>
                <p className="font-bold text-white text-xs">Priya Sharma</p>
                <p className="text-brand-300 text-2xs">Head of Talent, TechScale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Pane - 7 cols */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white font-display tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              Enter your credentials to access your account dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              leftIcon={Mail}
              error={errors.email?.message}
              autoFocus
              {...register('email')}
            />

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-ink-700 dark:text-ink-300 tracking-wide uppercase">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                leftIcon={Lock}
                isPasswordToggleable
                error={errors.password?.message}
                onKeyDown={handleKeyDown}
                {...register('password')}
              />
              {capsLockOn && (
                <div className="flex items-center gap-1 text-2xs text-sun-600 dark:text-sun-400 font-semibold mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Caps Lock is ON</span>
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500 dark:border-ink-700 dark:bg-ink-800"
                />
                <span className="text-xs text-ink-600 dark:text-ink-300 font-medium">Remember me on this device</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <Button
              type="submit"
              variant="accent"
              isLoading={loading}
              className="w-full mt-2"
              rightIcon={ArrowRight}
            >
              Sign In to Account
            </Button>
          </form>

          {/* Social login buttons placeholder */}
          <div className="space-y-3 pt-2 border-t border-ink-100 dark:border-ink-800">
            <p className="text-2xs font-semibold text-center text-ink-400 dark:text-ink-500 uppercase tracking-wider">
              Or continue with
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => alert("Google Single Sign-On demo placeholder")}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => alert("LinkedIn Single Sign-On demo placeholder")}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              >
                <svg className="w-4 h-4" style={{ fill: '#0A66C2' }} viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-ink-500 dark:text-ink-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
