import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, 
  Code2, 
  Cpu, 
  Building
} from 'lucide-react';

interface AboutProps {
  profileData?: any;
}

const DEFAULT_ROLES = ['DEVELOPER', 'PROGRAMMER', 'GAMER', 'CODER'];

interface AboutHighlights {
  degree: string;
  college: string;
  majorDomain: string;
  specialization: string;
}

const DEFAULT_HIGHLIGHTS: AboutHighlights = {
  degree: 'B.E. Computer Eng.',
  college: 'ARMIET, Mumbai Univ.',
  majorDomain: 'Full-Stack Development',
  specialization: 'AI • Deep Learning',
};

export const About: React.FC<AboutProps> = ({ profileData }) => {
  const { theme } = useTheme();
  const bio = profileData?.fullBio;
  const rawRoles = profileData?.shortBio;
  const rawTagline = profileData?.tagline;

  const highlights = React.useMemo(() => {
    if (profileData?.bannerUrl) {
      try {
        const raw = profileData.bannerUrl;
        if (typeof raw === 'string' && raw.trim().startsWith('{')) {
          const parsed = JSON.parse(raw);
          return {
            degree: parsed.degree || DEFAULT_HIGHLIGHTS.degree,
            college: parsed.college || DEFAULT_HIGHLIGHTS.college,
            majorDomain: parsed.majorDomain || DEFAULT_HIGHLIGHTS.majorDomain,
            specialization: parsed.specialization || DEFAULT_HIGHLIGHTS.specialization,
          };
        }
      } catch {}
    }
    return DEFAULT_HIGHLIGHTS;
  }, [profileData?.bannerUrl]);

  const disciplineText = React.useMemo(() => {
    if (
      typeof rawTagline === 'string' &&
      rawTagline.trim().length > 0 &&
      rawTagline.length <= 45 &&
      !rawTagline.toLowerCase().includes('building intelligent')
    ) {
      return rawTagline.trim();
    }
    return 'Computer Science';
  }, [rawTagline]);

  // Extract roles from admin-configured shortBio (comma/slash/bullet separated)
  const rolesList: string[] = React.useMemo(() => {
    if (typeof rawRoles === 'string' && rawRoles.trim().length > 0) {
      // If it's a long paragraph without commas (legacy bio), fallback to defaults
      const items = rawRoles.split(/[,•|/]/).map((r) => r.trim()).filter(Boolean);
      if (items.length > 0 && !(items.length === 1 && items[0].length > 40)) {
        return items.map((item) => item.toUpperCase());
      }
    }
    return DEFAULT_ROLES;
  }, [rawRoles]);

  const [roleIndex, setRoleIndex] = useState(0);

  // Smoothly rotate between configured roles
  useEffect(() => {
    if (rolesList.length <= 1) return;
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % rolesList.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [rolesList.length]);

  const safeIndex = roleIndex % rolesList.length;

  return (
    <section id="about" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative scroll-mt-28">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} mb-3`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
          <span className={`font-tech text-xs font-semibold ${theme.badgeText} tracking-wider uppercase`}>
            ABOUT // PROFILE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading tracking-tight">
          About Me — <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.primaryGradient}`}>Behind The Code</span>
        </h2>
        <div className={`h-0.5 w-16 bg-gradient-to-r ${theme.cardTopLine} rounded-full mx-auto mt-3`}></div>
      </motion.div>

      {/* Main About Card with Glowing Border Line */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={`relative rounded-3xl p-8 sm:p-12 bg-space-900/90 border border-slate-800/80 ${theme.cardGlow} overflow-hidden`}
      >
        {/* Top Glowing Border Line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${theme.cardTopLine}`}></div>

        {/* Ambient Subtle Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Body Paragraphs */}
        <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base font-sans">
          <p>
            {bio || `I am someone who thrives on learning, problem-solving, and continuous growth. My personality blends curiosity, adaptability, and persistence, which helps me approach challenges with optimism and clarity. I value collaboration and clear communication, but I am equally comfortable taking initiative and working independently.`}
          </p>

          <p>
            Currently pursuing my <strong className="text-white font-semibold">{highlights.degree} at {highlights.college}</strong>, my core engineering focus spans <strong className="text-cyan-300 font-semibold">{highlights.majorDomain}</strong>, high-throughput backend microservices, modern distributed web systems, and applied machine learning research in <strong className="text-emerald-300 font-semibold">{highlights.specialization}</strong>.
          </p>

          <p className="text-slate-400 text-xs sm:text-sm italic border-l-2 border-cyan-500/80 pl-4 py-2 bg-cyan-950/20 rounded-r-xl">
            "At my core, I am driven by a desire to make an impact, stay open to new perspectives, and keep evolving both personally and professionally."
          </p>
        </div>

        {/* Highlights Grid with Software Development First, College & Specialization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Degree</div>
              <div className="text-xs font-semibold text-white">{highlights.degree}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">College</div>
              <div className="text-xs font-semibold text-white">{highlights.college}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Major Domain</div>
              <div className="text-xs font-semibold text-sky-300">{highlights.majorDomain}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Specialization</div>
              <div className="text-xs font-semibold text-emerald-300">{highlights.specialization}</div>
            </div>
          </div>
        </div>

        {/* Large Classy Showcase (Developer -> Programmer -> Gamer -> Coder) Positioned at Bottom */}
        <div className="mt-12 pt-10 border-t border-slate-800/80 text-center relative overflow-hidden space-y-2">
          {/* Top Line: The Portfolio Website of The */}
          <div className="inline-flex items-center gap-2 mb-1 text-center">
            <span className="text-cyan-400 font-mono text-xs">✦</span>
            <span className="font-tech text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-300">
              The Portfolio Website of The
            </span>
            <span className="text-cyan-400 font-mono text-xs">✦</span>
          </div>

          {/* Giant Animated Rotating Title (Classy Modern Heading Font) */}
          <div className="h-20 sm:h-28 md:h-32 flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={safeIndex}
                initial={{ y: 22, opacity: 0, filter: 'blur(6px)', scale: 0.96 }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ y: -22, opacity: 0, filter: 'blur(6px)', scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <h3 className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading font-showcase tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r ${theme.primaryGradient} select-none drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]`}>
                  {rolesList[safeIndex]}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Line: Name & Engineering Discipline */}
          <div className="pt-1 flex items-center justify-center gap-2 text-sm sm:text-base text-slate-300">
            <span className="text-white font-heading font-bold text-base sm:text-lg tracking-wide">
              {profileData?.name || 'Amit Chauhan'}
            </span>
            <span className="text-slate-600 font-mono text-xs">|</span>
            <span className={`font-tech text-xs sm:text-sm font-semibold uppercase tracking-wider ${theme.accentText}`}>
              {disciplineText}
            </span>
          </div>

          {/* Subtle pill indicator dots showing cycling progress */}
          {rolesList.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-3">
              {rolesList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setRoleIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === safeIndex 
                      ? 'w-7 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Jump to role ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
