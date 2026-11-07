import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Save, Loader2, Globe } from 'lucide-react';

export const SeoView: React.FC = () => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    canonicalUrl: '',
    robots: 'index, follow',
  });

  const loadSeo = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAdminSettings();
      if (data?.seo) {
        setForm({
          metaTitle: data.seo.metaTitle || 'Amit Chauhan — Software Engineer & AI Developer',
          metaDescription: data.seo.metaDescription || 'Personal portfolio of Amit Chauhan, Software Engineer & AI Developer specializing in scalable full-stack web applications, distributed architectures, and hybrid AI solutions.',
          metaKeywords: data.seo.metaKeywords || 'Amit Chauhan, Portfolio, Computer Engineering, Software Engineer, AI, ML, React, TypeScript, Node.js',
          ogImage: data.seo.ogImage || '',
          twitterCard: data.seo.twitterCard || 'summary_large_image',
          canonicalUrl: data.seo.canonicalUrl || '',
          robots: data.seo.robots || 'index, follow',
        });
      }
    } catch (err: any) {
      error(err.message || 'Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSeoSettings(form);
      success('SEO & Search Indexing metadata saved to PostgreSQL!');
    } catch (err: any) {
      error(err.message || 'Failed to update SEO settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading SEO Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Search Engine Optimization (SEO) &amp; Metadata
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure search engine indexing, social card snippets, and canonical routing for your portfolio.
        </p>
      </div>

      {/* Google Search Result Preview Simulation */}
      <div className="p-6 rounded-2xl bg-space-900 border border-slate-800 space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          <span>SERP Preview Simulation</span>
        </span>
        <div className="pt-2 space-y-1">
          <div className="text-xs text-slate-400 font-mono">
            {form.canonicalUrl || 'https://your-portfolio.vercel.app'}
          </div>
          <div className="text-base sm:text-lg text-blue-400 font-medium hover:underline cursor-pointer">
            {form.metaTitle || 'Amit Chauhan — Software Engineer & AI Developer'}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {form.metaDescription || 'Personal portfolio of Amit Chauhan, Software Engineer & AI Developer specializing in scalable full-stack web applications, distributed architectures, and hybrid AI solutions.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-space-900/80 border border-slate-800 space-y-6">
          {/* Meta Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-medium">Global Meta Title</label>
              <span className={`text-[10px] font-mono ${form.metaTitle.length > 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                {form.metaTitle.length} / 60 recommended
              </span>
            </div>
            <input
              type="text"
              required
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-medium">Meta Description</label>
              <span className={`text-[10px] font-mono ${form.metaDescription.length > 160 ? 'text-amber-400' : 'text-slate-500'}`}>
                {form.metaDescription.length} / 160 recommended
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Meta Keywords */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">Meta Keywords (Comma separated)</label>
            <input
              type="text"
              value={form.metaKeywords}
              onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Canonical URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Canonical Public Domain</label>
              <input
                type="url"
                required
                value={form.canonicalUrl}
                onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none font-mono text-xs"
              />
            </div>

            {/* Robots Header */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Robots Directive</label>
              <select
                value={form.robots}
                onChange={(e) => setForm({ ...form, robots: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none font-mono text-xs"
              >
                <option value="index, follow">index, follow (Standard Production)</option>
                <option value="noindex, nofollow">noindex, nofollow (Private/Staging)</option>
                <option value="noindex, follow">noindex, follow</option>
              </select>
            </div>
          </div>

          {/* Open Graph Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">
              Open Graph Preview Image URL (og:image)
            </label>
            <input
              type="text"
              placeholder="https://your-portfolio.vercel.app/og-preview.png"
              value={form.ogImage}
              onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end">
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
                <span>Save SEO Directives</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
