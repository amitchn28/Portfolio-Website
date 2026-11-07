import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  KeyRound,
  Laptop,
  Save,
  Loader2,
  Smartphone
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const loadSessions = async () => {
    setSessionLoading(true);
    try {
      const data = await adminApi.getSessions();
      setSessions(data?.sessions || []);
      setCurrentSessionId(data?.currentSessionId || null);
    } catch (err: any) {
      error(err.message || 'Failed to load active sessions');
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('New password and confirmation do not match');
      return;
    }

    if (newPassword.length < 8) {
      error('New password must be at least 8 characters long');
      return;
    }

    setPassLoading(true);
    try {
      await adminApi.changePassword({ currentPassword, newPassword });
      success('Password updated successfully using Argon2id!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      loadSessions();
    } catch (err: any) {
      error(err.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await adminApi.revokeSession(sessionId);
      success('Session revoked successfully');
      loadSessions();
    } catch (err: any) {
      error(err.message || 'Failed to revoke session');
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Administrator Account &amp; Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your credentials, active browser sessions, and access security.
        </p>
      </div>

      {/* Admin Profile Overview */}
      <div className="p-6 rounded-2xl bg-space-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-cyber font-bold text-lg">
            AC
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{user?.name || 'Amit Chauhan'}</h3>
            <p className="text-xs font-mono text-slate-400">{user?.email || 'amitchn28@gmail.com'}</p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
            {user?.role || 'SUPER_ADMIN'}
          </span>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="p-6 rounded-2xl bg-space-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
          <KeyRound className="w-4 h-4 text-purple-400" />
          <span>Update Administrator Password</span>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">New Password (min 8 characters)</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
            />
          </div>

          <p className="text-[11px] text-slate-500 font-mono">
            * Passwords are encrypted with state-of-the-art Argon2id cryptographic hashing (m=64MB, t=3).
          </p>

          <button
            type="submit"
            disabled={passLoading}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-purple transition-all disabled:opacity-60"
          >
            {passLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Rehashing Credentials...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Active Sessions Card */}
      <div className="p-6 rounded-2xl bg-space-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>Active Administrator Sessions</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">{sessions.length} sessions active</span>
        </div>

        {sessionLoading ? (
          <div className="py-8 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400 mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading Sessions...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((sess) => {
              const isCurrent = sess.id === currentSessionId;

              return (
                <div
                  key={sess.id}
                  className={`p-4 rounded-xl bg-space-950 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isCurrent ? 'border-purple-500/50' : 'border-slate-800'
                    }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">
                        {sess.ipAddress || '127.0.0.1'}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-500/30">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono line-clamp-1">
                      {sess.userAgent || 'Web Browser'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Signed in: {new Date(sess.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      className="self-end sm:self-auto px-3 py-1.5 rounded-lg bg-space-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-mono transition-colors"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two-Factor Authentication Architecture Overview */}
      <div className="p-6 rounded-2xl bg-space-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Smartphone className="w-4 h-4 text-purple-400" />
          <span>Two-Factor Authentication (2FA) Architecture</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The authentication system is prepared with session token validation and Argon2id encryption. TOTP authenticator app support (Google Authenticator / Authy) can be seamlessly layered on top of this architecture without altering the database schema.
        </p>
      </div>
    </div>
  );
};
