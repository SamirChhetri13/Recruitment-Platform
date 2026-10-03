import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { forgotPassword } from '../api/auth.api';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError('');
      setMessage('');
      setDevResetUrl('');

      const res = await forgotPassword(email);
      setMessage(res.message || 'Password reset instructions sent to your email.');
      if (res.resetUrl) {
        setDevResetUrl(res.resetUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-[var(--border)] space-y-6 bg-[var(--bg-elevated)] shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">
            Forgot Password?
          </h2>
          <p className="text-xs text-[var(--text-subtle)]">
            Enter your account email and we'll send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-[var(--danger-bg)] border border-[var(--danger)]/30 flex items-start gap-3 text-[var(--danger)] text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-4 rounded-xl bg-[var(--success-bg)] border border-[var(--success)]/30 space-y-2 text-[var(--success)] text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
            {devResetUrl && (
              <div className="pt-2 border-t border-[var(--success)]/20 text-[11px] text-[var(--text-muted)]">
                <span className="font-bold text-[var(--warning)]">Dev Mode Link:</span>{' '}
                <a href={devResetUrl} className="text-[var(--primary)] underline break-all hover:opacity-80">
                  {devResetUrl}
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-subtle)] pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-[var(--text)] min-h-[44px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white gradient-bg-primary shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-subtle)] hover:text-[var(--primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-lg p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
