import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminApi } from '../services/api';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2, KeyRound, ArrowRight, X } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  // Reset password modal state
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login({ email: email.trim(), password });
      success('Welcome back, Administrator!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid administrator credentials');
      error(err.message || 'Authentication rejected');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      const res = await adminApi.forgotPassword(forgotEmail.trim());
      setForgotMsg(res.message);
      if (res.debugToken) {
        setResetToken(res.debugToken);
        setShowResetForm(true);
      }
    } catch (err: any) {
      setForgotMsg(err.message || 'Password reset request failed');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await adminApi.resetPassword({ token: resetToken.trim(), newPassword });
      success('Password reset successfully. You can now log in.');
      setShowForgotModal(false);
      setShowResetForm(false);
    } catch (err: any) {
      error(err.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-950 flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-amber-500 selection:text-slate-950">
      {/* Background Coastal Twilight Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-sky-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-space-900/90 border border-amber-400/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl z-10 overflow-hidden">
        {/* Top Glowing Amber & Ocean Sky Border Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-sky-400 to-amber-300"></div>

        {/* Branding Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto shadow-glow-amber">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
              Administrator Access
            </h1>
            <p className="text-xs font-mono text-amber-300 mt-1">
              Admin &bull; Private CMS
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email / Admin ID Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300 font-medium">
              Administrator ID / Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amitchn28@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-space-950/80 border border-slate-800 focus:border-amber-400 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-slate-300 font-medium">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] font-mono text-amber-300 hover:text-amber-200 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-space-950/80 border border-slate-800 focus:border-amber-400 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 hover:brightness-110 text-slate-950 font-cyber font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            Authorized Personnel Only &bull; Argon2id Hash Protected
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-space-900 border border-purple-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <KeyRound className="w-4 h-4 text-purple-400" />
                <span>Password Recovery</span>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setShowResetForm(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!showResetForm ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your administrator email to receive single-use password reset instructions.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="amitchn28@gmail.com or admin"
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>

                {forgotMsg && (
                  <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200">
                    {forgotMsg}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl bg-space-950 text-xs text-slate-300 border border-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs text-white font-medium"
                  >
                    {forgotLoading ? 'Processing...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-slate-300">
                  Verification verified. Set your new administrative password.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">New Password (min 8 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs text-white font-medium"
                  >
                    {forgotLoading ? 'Resetting...' : 'Save New Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

