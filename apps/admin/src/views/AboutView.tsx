import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Eye, Save, Loader2, Sparkles, GraduationCap, Building, Code2, Cpu } from 'lucide-react';

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

  const [highlights, setHighlights] = useState({
    degree: 'B.E. Computer Eng.',
    college: 'ARMIET, Mumbai Univ.',
    majorDomain: 'Full-Stack Development',
    specialization: 'AI • Deep Learning',
  });

  useEffect(() => {
    async function loadAbout() {
      try {
        const data = await adminApi.getAbout();
        if (data) {
          setAboutData({
            fullBio: data.fullBio || '',
            shortBio: (data.shortBio && data.shortBio.length < 80) ? data.shortBio : 'Developer, Programmer, Gamer, Coder',
            headline: data.headline || '',
            tagline: (data.tagline && data.tagline.length <= 40 && !data.tagline.toLowerCase().includes('building intelligent')) ? data.tagline : 'Computer Science',
          });

          if (data.bannerUrl) {
            try {
              const parsed = JSON.parse(data.bannerUrl);
              setHighlights({
                degree: parsed.degree || 'B.E. Computer Eng.',
                college: parsed.college || 'ARMIET, Mumbai Univ.',
                majorDomain: parsed.majorDomain || 'Full-Stack Development',
                specialization: parsed.specialization || 'AI • Deep Learning',
              });
            } catch {}
          }
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
      const bannerUrl = JSON.stringify(highlights);
      await adminApi.updateAbout({
        ...aboutData,
        bannerUrl,
      });

      // Synchronize with Profile route as well to ensure dual persistence
      try {
        await adminApi.updateProfile({ bannerUrl });
      } catch {}

      success('About section & 4 highlight metrics updated and published to PostgreSQL database!');
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
          {/* Showcase Subtitle / Discipline */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-medium">
                Showcase Subtitle / Discipline (Next to Name)
              </label>
              <span className="text-[10px] font-mono text-cyan-400">e.g. Computer Science</span>
            </div>
            <input
              type="text"
              placeholder="Computer Science"
              value={aboutData.tagline}
              onChange={(e) => setAboutData({ ...aboutData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
            />
            <p className="text-[11px] text-slate-500">
              Displayed next to your name at the bottom of the About section (e.g. Amit Chauhan | {aboutData.tagline || 'Computer Science'}).
            </p>
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

          {/* Rotating Roles / Titles (Giant Typography at Bottom of About) */}
          <div className="space-y-2 p-5 rounded-2xl bg-space-950/90 border border-amber-500/30 shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-amber-300 font-bold flex items-center gap-2">
                <span>✦ Rotating Roles / Titles (Giant Animated Typography)</span>
              </label>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                Comma-separated
              </span>
            </div>
            <input
              type="text"
              placeholder="Developer, Programmer, Gamer, Coder"
              value={aboutData.shortBio}
              onChange={(e) => setAboutData({ ...aboutData, shortBio: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-space-900 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-tech text-white focus:outline-none tracking-wide"
            />
            <p className="text-[11px] text-slate-400">
              These cycle continuously in giant, classy display typography at the bottom of the About section (below the 4 highlight cards). Separate each role with a comma.
            </p>
            {/* Live Role Badges Preview */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-slate-400">Live Preview:</span>
              {(aboutData.shortBio || 'Developer, Programmer, Gamer, Coder')
                .split(/[,•|/]/)
                .map((r) => r.trim())
                .filter(Boolean)
                .map((role, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-tech font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30"
                  >
                    {role}
                  </span>
                ))}
            </div>
          </div>

          {/* 4 About Highlight Cards (Degree, College, Major Domain, Specialization) */}
          <div className="p-6 rounded-2xl bg-space-950/90 border border-cyan-500/30 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white font-cyber uppercase tracking-wider flex items-center gap-2">
                  <span>✦ About Highlight Cards (4 Key Metrics)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Live Public Cards
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Customize the 4 highlight boxes displayed at the bottom of the About card (Degree, College, Major Domain &amp; Specialization).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Degree */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-space-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>1. Degree Title</span>
                </div>
                <input
                  type="text"
                  placeholder="B.E. Computer Eng."
                  value={highlights.degree}
                  onChange={(e) => setHighlights({ ...highlights, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-space-950 border border-slate-700/80 focus:border-cyan-400 text-xs text-white focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">e.g. B.E. Computer Eng.</span>
              </div>

              {/* College */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-space-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Building className="w-4 h-4 text-teal-400" />
                  <span>2. College / University</span>
                </div>
                <input
                  type="text"
                  placeholder="ARMIET, Mumbai Univ."
                  value={highlights.college}
                  onChange={(e) => setHighlights({ ...highlights, college: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-space-950 border border-slate-700/80 focus:border-teal-400 text-xs text-white focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">e.g. ARMIET, Mumbai Univ.</span>
              </div>

              {/* Major Domain */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-space-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Code2 className="w-4 h-4 text-sky-400" />
                  <span>3. Major Domain</span>
                </div>
                <input
                  type="text"
                  placeholder="Full-Stack Development"
                  value={highlights.majorDomain}
                  onChange={(e) => setHighlights({ ...highlights, majorDomain: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-space-950 border border-slate-700/80 focus:border-sky-400 text-xs text-sky-300 focus:outline-none font-medium"
                />
                <span className="text-[10px] text-slate-500 font-mono">e.g. Full-Stack Development</span>
              </div>

              {/* Specialization */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-space-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>4. Specialization</span>
                </div>
                <input
                  type="text"
                  placeholder="AI • Deep Learning"
                  value={highlights.specialization}
                  onChange={(e) => setHighlights({ ...highlights, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-space-950 border border-slate-700/80 focus:border-emerald-400 text-xs text-emerald-300 focus:outline-none font-medium"
                />
                <span className="text-[10px] text-slate-500 font-mono">e.g. AI • Deep Learning</span>
              </div>
            </div>

            {/* Live Visual Card Preview */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-400 mb-2">Live Highlight Cards Preview:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Degree</div>
                    <div className="text-xs font-semibold text-white truncate">{highlights.degree || 'B.E. Computer Eng.'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">College</div>
                    <div className="text-xs font-semibold text-white truncate">{highlights.college || 'ARMIET, Mumbai Univ.'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Major Domain</div>
                    <div className="text-xs font-semibold text-sky-300 truncate">{highlights.majorDomain || 'Full-Stack Development'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Specialization</div>
                    <div className="text-xs font-semibold text-emerald-300 truncate">{highlights.specialization || 'AI • Deep Learning'}</div>
                  </div>
                </div>
              </div>
            </div>
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
