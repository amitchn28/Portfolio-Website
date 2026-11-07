import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import {
  FolderGit2,
  Mail,
  Eye,
  FileDown,
  Clock,
  Activity,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

interface OverviewProps {
  onNavigate: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDashboardOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const stats = data?.stats || {
    totalProjects: 0,
    publishedProjects: 0,
    unreadMessages: 0,
    totalMessages: 0,
    totalSkills: 0,
    totalArticles: 0,
    totalVisitors: 0,
    resumeDownloads: 0,
  };

  const recentMessages = data?.recentMessages || [];
  const recentAuditLogs = data?.recentAuditLogs || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Real-time telemetry and database-backed records for Amit Chauhan Portfolio &amp; CMS.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-space-900 hover:bg-space-850 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Main KPI Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Visitors */}
        <div className="rounded-2xl p-5 sm:p-6 bg-space-900/80 border border-slate-800 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Visitors</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.totalVisitors}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Recorded page view events</p>
          </div>
        </div>

        {/* Projects Active */}
        <div
          onClick={() => onNavigate('projects')}
          className="rounded-2xl p-5 sm:p-6 bg-space-900/80 border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Projects (Live)</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.publishedProjects} <span className="text-sm font-sans text-slate-500 font-normal">/ {stats.totalProjects}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Flagship QAI-OLI featured</p>
          </div>
        </div>

        {/* Unread Messages */}
        <div
          onClick={() => onNavigate('contact')}
          className="rounded-2xl p-5 sm:p-6 bg-space-900/80 border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Unread Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
              {stats.unreadMessages}
              {stats.unreadMessages > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  New
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{stats.totalMessages} total received</p>
          </div>
        </div>

        {/* Resume Downloads */}
        <div
          onClick={() => onNavigate('resume')}
          className="rounded-2xl p-5 sm:p-6 bg-space-900/80 border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Resume Downloads</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.resumeDownloads}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Verified download events</p>
          </div>
        </div>
      </div>

      {/* Flagship Project Alert Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-space-900 to-space-900 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wide">
              Flagship Project Synchronized
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Oral Lesion Image Classification and Risk Evaluation (QAI-OLI)
          </h3>
          <p className="text-xs text-slate-400">
            Current major fourth-year research deployment live at <strong className="text-purple-300">qai-oli.vercel.app</strong> with dual backbones &amp; 8-qubit VQC.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://qai-oli.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all"
          >
            <span>Live Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => onNavigate('projects')}
            className="px-4 py-2 rounded-xl bg-space-950 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors"
          >
            Manage Project
          </button>
        </div>
      </div>

      {/* Two Columns: Recent Inquiries & Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="rounded-2xl bg-space-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Inquiries
              </h3>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No contact inquiries submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg: any) => (
                <div
                  key={msg.id}
                  onClick={() => onNavigate('contact')}
                  className="p-3.5 rounded-xl bg-space-950/70 border border-slate-800/80 hover:border-purple-500/30 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{msg.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${msg.status === 'UNREAD'
                        ? 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">{msg.message}</p>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                    <span>{msg.email}</span>
                    <span>&bull;</span>
                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Log Activity Timeline */}
        <div className="rounded-2xl bg-space-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent System Activity
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Audit Logs</span>
          </div>

          {recentAuditLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No audit log records recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAuditLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-space-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-200">
                      <span className="text-purple-400 font-mono text-[11px] mr-1.5">{log.action}</span>
                      <span className="text-slate-400 text-[11px]">on {log.entity}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {log.user?.name || 'Administrator'} &bull; {new Date(log.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
