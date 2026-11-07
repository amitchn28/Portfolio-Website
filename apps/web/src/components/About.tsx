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
  profileData: any;
}

const ROLES = ['Programmer', 'Gamer', 'Coder'];

export const About: React.FC<AboutProps> = ({ profileData }) => {
  const { theme } = useTheme();
  const bio = profileData?.fullBio;
  const [roleIndex, setRoleIndex] = useState(0);

  // Smoothly rotate between Programmer -> Gamer -> Coder
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative scroll-mt-28">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
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

      {/* Unique Dynamic Handwritten Role Ribbon (Programmer -> Gamer -> Coder) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-3 mb-12 text-center"
      >
        <span className="text-xs sm:text-sm font-tech text-slate-400 uppercase tracking-widest font-medium">
          Driven by passion as a
        </span>
        <div className="relative inline-flex items-center justify-center min-w-[140px] sm:min-w-[170px] h-10 sm:h-12 px-4 py-1 rounded-2xl bg-slate-900/90 border border-amber-500/35 backdrop-blur-xl shadow-xl shadow-amber-500/10">
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ y: 14, opacity: 0, rotate: -4, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: -14, opacity: 0, rotate: 4, scale: 0.9 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="font-handwriting text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] select-none"
            >
              {ROLES[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
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
            Currently pursuing my <strong className="text-white font-semibold">B.E. in Computer Engineering at ARMIET, University of Mumbai</strong>, my core engineering focus spans <strong className="text-cyan-300 font-semibold">full-stack software development</strong>, high-throughput backend microservices, modern distributed web systems, and applied machine learning research.
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
              <div className="text-xs font-semibold text-white">B.E. Computer Eng.</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">College</div>
              <div className="text-xs font-semibold text-white">ARMIET, Mumbai Univ.</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Major Domain</div>
              <div className="text-xs font-semibold text-sky-300">Full-Stack Development</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-space-950/70 border border-slate-800/90 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Specialization</div>
              <div className="text-xs font-semibold text-emerald-300">AI &bull; Deep Learning</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
