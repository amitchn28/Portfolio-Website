import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Save, Loader2, ExternalLink, Check } from 'lucide-react';

export const AppearanceView: React.FC = () => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fontMode, setFontMode] = useState<'modern' | 'pixel'>('modern');

  const [form, setForm] = useState({
    siteName: 'Amit Chauhan',
    siteTagline: 'Software Engineer & AI Developer',
    contactEmail: 'amitchn28@gmail.com',
    isMaintenance: false,
    allowMessages: true,
    theme: 'sapphire-glow',
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAdminSettings();
      if (data?.website) {
        const rawTheme = data.website.theme || 'sapphire-glow';
        let activeTheme = rawTheme;
        let activeFontMode: 'modern' | 'pixel' = 'modern';

        if (rawTheme.includes('::')) {
          const parts = rawTheme.split('::');
          activeTheme = parts[0];
          activeFontMode = parts[1] === 'pixel' ? 'pixel' : 'modern';
        }

        setForm({
          siteName: data.website.siteName || 'Amit Chauhan',
          siteTagline: data.website.siteTagline || 'Software Engineer & AI Developer',
          contactEmail: data.website.contactEmail || 'amitchn28@gmail.com',
          isMaintenance: data.website.isMaintenance || false,
          allowMessages: data.website.allowMessages !== false,
          theme: activeTheme,
        });
        setFontMode(activeFontMode);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load website settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const themePayload = fontMode === 'pixel' ? `${form.theme}::pixel` : form.theme;
      await adminApi.updateWebsiteSettings({
        ...form,
        theme: themePayload,
      });
      success('Website appearance & typography preferences updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to update website settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading Appearance Settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Website Appearance &amp; Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure system themes, branding accents, and global public availability toggles.
          </p>
        </div>

        <a
          href={import.meta.env.VITE_SITE_URL || 'https://amiiit-portfolio.vercel.app'}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-space-900 hover:bg-space-850 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <span>Open Public Portfolio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-space-900/80 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Site Brand Name</label>
              <input
                type="text"
                required
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Public Contact Email</label>
              <input
                type="email"
                required
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">Global Site Tagline</label>
            <input
              type="text"
              required
              value={form.siteTagline}
              onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
            />
          </div>

          {/* Theme Palette Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-medium">
                Active Website Theme &amp; Color Scheme
              </label>
              <span className="text-[11px] font-mono text-purple-400">
                Live Dynamic Sync &bull; Updates Public Site
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 0. Coastal Twilight (Profile Blend) */}
              <div
                onClick={() => setForm({ ...form, theme: 'mumbai-twilight' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.theme === 'mumbai-twilight'
                    ? 'border-amber-400 bg-space-950 shadow-glow-card ring-1 ring-amber-400/50'
                    : 'border-slate-800 bg-space-900/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white font-cyber uppercase tracking-wider">
                    Coastal Twilight (Profile)
                  </span>
                  {form.theme === 'mumbai-twilight' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#e2b17a] shadow-sm" title="Sunset Amber"></div>
                  <div className="w-6 h-6 rounded-full bg-[#385472] shadow-sm" title="Arabian Sea Slate"></div>
                  <div className="w-6 h-6 rounded-full bg-[#8fa5be] shadow-sm" title="Skyline Mist"></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Bespoke profile blend: warm sunset amber, sea slate &amp; skyline mist.
                </p>
              </div>

              {/* 1. Cyber Dark / Quantum Neon */}
              <div
                onClick={() => setForm({ ...form, theme: 'cyber-dark' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.theme === 'cyber-dark'
                    ? 'border-purple-500 bg-space-950 shadow-glow-card ring-1 ring-purple-500/50'
                    : 'border-slate-800 bg-space-900/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white font-cyber uppercase tracking-wider">
                    Quantum Neon
                  </span>
                  {form.theme === 'cyber-dark' && <Check className="w-4 h-4 text-purple-400" />}
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#d946ef] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#8b5cf6] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#06b6d4] shadow-sm"></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  High-energy cyberpunk violet, hot magenta &amp; electric cyan.
                </p>
              </div>

              {/* 2. Vibrant Aurora */}
              <div
                onClick={() => setForm({ ...form, theme: 'vibrant-aurora' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.theme === 'vibrant-aurora'
                    ? 'border-cyan-500 bg-space-950 shadow-glow-card ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-space-900/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white font-cyber uppercase tracking-wider">
                    Vibrant Aurora
                  </span>
                  {form.theme === 'vibrant-aurora' && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#22d3ee] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#10b981] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#818cf8] shadow-sm"></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Bright luminous cyan, radiant emerald &amp; electric indigo.
                </p>
              </div>

              {/* 3. Sunset Blaze */}
              <div
                onClick={() => setForm({ ...form, theme: 'sunset-blaze' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.theme === 'sunset-blaze'
                    ? 'border-orange-500 bg-space-950 shadow-glow-card ring-1 ring-orange-500/50'
                    : 'border-slate-800 bg-space-900/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white font-cyber uppercase tracking-wider">
                    Sunset Blaze
                  </span>
                  {form.theme === 'sunset-blaze' && <Check className="w-4 h-4 text-orange-400" />}
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#f97316] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#f43f5e] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#fbbf24] shadow-sm"></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Warm solar amber, crimson rose &amp; radiant gold flare.
                </p>
              </div>

              {/* 4. Sapphire Glow */}
              <div
                onClick={() => setForm({ ...form, theme: 'sapphire-glow' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.theme === 'sapphire-glow'
                    ? 'border-blue-500 bg-space-950 shadow-glow-card ring-1 ring-blue-500/50'
                    : 'border-slate-800 bg-space-900/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white font-cyber uppercase tracking-wider">
                    Electric Sapphire
                  </span>
                  {form.theme === 'sapphire-glow' && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#3b82f6] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#38bdf8] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#6366f1] shadow-sm"></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Brilliant royal blue, electric azure &amp; ice-cyan waves.
                </p>
              </div>

              {/* 5. Emerald Matrix */}
              <div
                onClick={() => setForm({ ...form, theme: 'emerald-matrix' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.theme === 'emerald-matrix'
                    ? 'border-emerald-500 bg-space-950 shadow-glow-card ring-1 ring-emerald-500/50'
                    : 'border-slate-800 bg-space-900/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white font-cyber uppercase tracking-wider">
                    Emerald Matrix
                  </span>
                  {form.theme === 'emerald-matrix' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#10b981] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#06b6d4] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#84cc16] shadow-sm"></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Quantum bio-tech luminous jade, mint &amp; lime glow.
                </p>
              </div>

              {/* 6. Minimalist Dark */}
              <div
                onClick={() => setForm({ ...form, theme: 'dark' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.theme === 'dark'
                    ? 'border-indigo-500 bg-space-950 shadow-glow-card ring-1 ring-indigo-500/50'
                    : 'border-slate-800 bg-space-900/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white font-cyber uppercase tracking-wider">
                    Classic Minimal
                  </span>
                  {form.theme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#6366f1] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#06b6d4] shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-[#a855f7] shadow-sm"></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Refined sleek cyber palette with indigo &amp; cyan highlights.
                </p>
              </div>
            </div>
          </div>

          {/* Accent Typography Style Switcher (Modern Tech vs Retro Cyber Pixel) */}
          <div className="p-6 rounded-2xl bg-space-950/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-cyber uppercase tracking-wider flex items-center gap-2">
                  <span>Accent Typography Style</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Live Toggle
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose whether section badges, role indicators, and cyber labels appear in normalized modern tech font or 8-bit retro pixel font.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Option 1: Modern Tech */}
              <div
                onClick={() => setFontMode('modern')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  fontMode === 'modern'
                    ? 'border-purple-500 bg-space-900 shadow-glow-card ring-1 ring-purple-500/50'
                    : 'border-slate-800 bg-space-900/40 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                  fontMode === 'modern' ? 'border-purple-400 bg-purple-500' : 'border-slate-600'
                }`}>
                  {fontMode === 'modern' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Normalized Modern Tech (Space Grotesk)
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Clean, elegant geometric typography matching modern developer aesthetics.
                  </p>
                  <div className="pt-2 text-[11px] text-cyan-300 font-mono font-semibold tracking-wider">
                    PREVIEW: SOFTWARE ENGINEER // CS STUDENT
                  </div>
                </div>
              </div>

              {/* Option 2: Retro Cyber Pixel */}
              <div
                onClick={() => setFontMode('pixel')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  fontMode === 'pixel'
                    ? 'border-amber-400 bg-space-900 shadow-glow-card ring-1 ring-amber-400/50'
                    : 'border-slate-800 bg-space-900/40 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                  fontMode === 'pixel' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
                }`}>
                  {fontMode === 'pixel' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
                    Retro Cyber Pixel (Silkscreen 8-Bit)
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Nostalgic cyberpunk pixelated lettering for badges and chosen key headers.
                  </p>
                  <div 
                    className="pt-2 text-[11px] text-amber-300 tracking-wider"
                    style={{ fontFamily: "'Silkscreen', monospace" }}
                  >
                    PREVIEW: SOFTWARE ENGINEER // CS STUDENT
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Toggles */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between p-4 rounded-xl bg-space-950 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white">Accept Public Contact Inquiries</span>
                <p className="text-[11px] text-slate-400">
                  When enabled, visitors can submit messages through the contact form on your portfolio.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.allowMessages}
                onChange={(e) => setForm({ ...form, allowMessages: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-space-950 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white">Maintenance Mode</span>
                <p className="text-[11px] text-slate-400">
                  Temporarily display a maintenance banner on the public portfolio while performing major updates.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.isMaintenance}
                onChange={(e) => setForm({ ...form, isMaintenance: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>
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
                <span>Save Appearance Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
