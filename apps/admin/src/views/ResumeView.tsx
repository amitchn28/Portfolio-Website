import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Loader2, 
  Calendar
} from 'lucide-react';

export const ResumeView: React.FC = () => {
  const { success, error } = useToast();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form for new upload/link
  const [form, setForm] = useState({
    title: 'Amit Chauhan — Software Developer & AI/ML Resume',
    version: '2026.1',
    fileUrl: '',
    isPrimary: true,
  });

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllResumes();
      setResumes(data || []);
    } catch (err: any) {
      error(err.message || 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      error('Only PDF documents are allowed for curriculum vitae');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      error('File size must not exceed 10MB');
      return;
    }

    setUploading(true);
    try {
      const res = await adminApi.uploadFile(file, 'resume');
      const uploadedUrl = res?.url;
      setForm((prev) => ({ ...prev, fileUrl: uploadedUrl }));
      success('File uploaded to storage! Click "Save Resume Record" below to activate it.');
    } catch (err: any) {
      error(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fileUrl.trim()) {
      error('Please upload a PDF file or provide a valid file URL');
      return;
    }

    try {
      await adminApi.createResume({
        title: form.title,
        version: form.version,
        fileUrl: form.fileUrl.trim(),
        isPrimary: form.isPrimary,
      });
      success('Resume saved and published as primary download!');
      setForm({
        title: 'Amit Chauhan — Software Developer Resume',
        version: '2026.2',
        fileUrl: '',
        isPrimary: true,
      });
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save resume record');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.deleteResume(deleteTargetId);
      success('Resume removed from database');
      setDeleteTargetId(null);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to delete resume');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Resume Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Upload and manage your official CV / Resume PDF served to recruiters and hiring managers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form (Left Column) */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-space-900/80 border border-slate-800 space-y-4 h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Upload New Resume Version</span>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Document Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Version Tag</label>
              <input
                type="text"
                required
                placeholder="e.g. 2026.1"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
              />
            </div>

            {/* File Drop / Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Select PDF File</label>
              <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-purple-500/50 bg-space-950/60 cursor-pointer transition-colors group">
                <FileText className="w-8 h-8 text-slate-500 group-hover:text-purple-400 transition-colors mb-2" />
                <span className="text-xs font-medium text-slate-300 text-center">
                  {uploading ? 'Uploading to Server...' : 'Click to Browse PDF'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-1">PDF up to 10MB</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct URL input if hosting externally */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Or File URL / Path</label>
              <input
                type="text"
                placeholder="https://... or /uploads/resume.pdf"
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isPrimary"
                checked={form.isPrimary}
                onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="isPrimary" className="text-xs text-slate-300 font-mono">
                Set as Primary Download on Website
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading || !form.fileUrl}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-purple transition-all disabled:opacity-50"
            >
              <span>Save Resume Record</span>
            </button>
          </form>
        </div>

        {/* Existing Resumes List (Right Column) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Saved Resume Versions
            </h3>
            <span className="text-xs text-slate-500 font-mono">{resumes.length} records</span>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
              <p className="text-xs font-mono text-slate-400">Loading Resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-space-900 border border-slate-800 text-slate-400 space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">No resume uploaded to PostgreSQL yet.</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Use the upload form on the left to upload your genuine PDF.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((r) => (
                <div
                  key={r.id}
                  className={`p-5 rounded-2xl bg-space-900/80 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    r.isPrimary ? 'border-purple-500/50 shadow-glow-card' : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-300">
                        v{r.version}
                      </span>
                      {r.isPrimary && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          PRIMARY RESUME
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white">{r.title}</h4>

                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Updated: {new Date(r.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-space-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-purple-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>

                    <button
                      onClick={() => setDeleteTargetId(r.id)}
                      className="p-2 rounded-xl bg-space-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Resume?"
        message="Are you sure you want to delete this resume record?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
