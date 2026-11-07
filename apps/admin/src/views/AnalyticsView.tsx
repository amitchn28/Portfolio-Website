import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Eye,
  FileDown,
  FolderGit2,
  Activity,
  ShieldCheck,
  Loader2
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { error } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAnalyticsOverview();
      setData(res);
    } catch (err: any) {
      error(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const metrics = data?.metrics || {
    totalEvents: 0,
    totalPageViews: 0,
    totalProjectViews: 0,
    totalResumeDownloads: 0,
  };

  const recentEvents = data?.recentEvents || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Privacy-Conscious Telemetry &amp; Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Zero-tracker, self-hosted analytics telemetry persisted strictly in your PostgreSQL instance.
        </p>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-xl bg-space-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-white">Strict Data Integrity &amp; Privacy Policy</span>
          <p className="text-slate-400 leading-relaxed">
            All metrics displayed below originate from authentic events captured on your server. We do not use third-party trackers, invasive cookies, or fabricated chart visualizations.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-space-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TOTAL TELEMETRY EVENTS</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {metrics.totalEvents}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Aggregated database logs</p>
        </div>

        <div className="p-5 rounded-2xl bg-space-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>PAGE VIEWS</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300">
            {metrics.totalPageViews}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Page navigation hits</p>
        </div>

        <div className="p-5 rounded-2xl bg-space-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>PROJECT ENGAGEMENT</span>
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
            {metrics.totalProjectViews}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Modal case study opens</p>
        </div>

        <div className="p-5 rounded-2xl bg-space-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RESUME DOWNLOADS</span>
            <FileDown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">
            {metrics.totalResumeDownloads}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Curriculum vitae downloads</p>
        </div>
      </div>

      {/* Recent Telemetry Stream */}
      <div className="p-6 rounded-2xl bg-space-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Recent Analytics Event Stream
          </h3>
          <span className="text-xs text-slate-500 font-mono">Real-time Stream</span>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400 mx-auto" />
            <p className="text-xs font-mono text-slate-400">Loading Stream...</p>
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500 font-mono">
            No visitor events recorded in database yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentEvents.map((ev: any) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl bg-space-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
                    {ev.eventType}
                  </span>
                  <span className="font-mono text-slate-200">{ev.path}</span>
                </div>

                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-3">
                  <span>{new Date(ev.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
