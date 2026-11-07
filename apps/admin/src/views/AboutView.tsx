import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Eye, Save, Loader2, Sparkles } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [aboutData, setAboutData] = useState({
    fullBio: '',
    shortBio: '',
    headline: '',
    tagline: '',
  });

  useEffect(() => {
    async function loadAbout() {
      try {
        const data = await adminApi.getAbout();
        if (data) {
          setAboutData({
            fullBio: data.fullBio || '',
            shortBio: data.shortBio || '',
            headline: data.headline || '',
            tagline: data.tagline || '',
          });
        }
      } catch (err: any) {
        error(err.message || 'Failed to load about data');
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, [error]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateAbout(aboutData);
      success('About section updated and published to PostgreSQL database!');
    } catch (err: any) {
      error(err.message || 'Failed to update about section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading About Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            About Section Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Edit the narrative, academic background, and personal philosophy displayed in the About Me section.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-space-900 hover:bg-space-850 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-purple-400" />
          <span>{showPreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
        </button>
      </div>

      {/* Live Preview Panel if Toggled */}
      {showPreview && (
        <div className="p-6 sm:p-8 rounded-3xl bg-space-900 border border-purple-500/40 shadow-glow-card space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Public Website Preview</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            About Me — <span className="cyber-accent font-cyber">BEHIND THE CODE!</span>
          </div>
          <div className="space-y-4 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {aboutData.fullBio || 'No biography written yet.'}
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-space-900/80 border border-slate-800 space-y-6">
          {/* Tagline / Academic Context */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">Academic Context</label>
            <input
              type="text"
              value={aboutData.tagline}
              onChange={(e) => setAboutData({ ...aboutData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
            />
          </div>

          {/* Full Biography */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">
              Full Narrative &amp; Mindset (Displayed on Public Portfolio)
            </label>
            <textarea
              rows={8}
              required
              value={aboutData.fullBio}
              onChange={(e) => setAboutData({ ...aboutData, fullBio: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none resize-none leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 font-mono">
              Captures your passion for problem-solving, continuous learning, and hybrid AI/ML research.
            </p>
          </div>

          {/* Short Bio summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">Quick Summary Snippet</label>
            <textarea
              rows={3}
              value={aboutData.shortBio}
              onChange={(e) => setAboutData({ ...aboutData, shortBio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-purple transition-all disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish About Section</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
