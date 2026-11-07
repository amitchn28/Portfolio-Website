import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getAssetUrl } from '../utils/assetUrl';
import { portfolioApi } from '../services/api';
import { 
  ArrowRight, 
  FileText, 
  Mail, 
  Github, 
  Linkedin, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface HeroProps {
  profileData?: any;
  onOpenResume?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profileData }) => {
  const { theme } = useTheme();
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const rawAvatar = profileData?.avatarUrl;
  const avatarUrl = getAssetUrl(rawAvatar) || '/avatar.webp';

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center pt-20 sm:pt-24 pb-20 sm:pb-16 px-4 sm:px-6 scroll-mt-28">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-7 z-10">
        {/* Avatar Circle with Photo Support */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <div className="relative group">
            {/* Pulsing Luminous Dynamic Theme Ring */}
            <div className={`absolute -inset-1.5 bg-gradient-to-r ${theme.cardTopLine} rounded-full blur-md opacity-85 group-hover:opacity-100 transition duration-500 animate-pulse-slow`}></div>
            
            {/* Avatar Container */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-white/20 bg-space-900 shadow-2xl flex items-center justify-center">
              <img
                src={avatarUrl}
                alt={profileData?.name || 'Amit Chauhan'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/avatar.webp';
                }}
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Online status indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-space-950 rounded-full p-0.5 border border-white/20">
              <div className="w-full h-full bg-emerald-400 rounded-full animate-ping"></div>
            </div>
          </div>
        </motion.div>

        {/* Academic Status Badge (CS Student, Dynamic Theme) */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} text-xs ${theme.badgeText} backdrop-blur-md shadow-sm`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-pixel text-[10px] sm:text-xs tracking-wider uppercase">
            {(profileData?.currentStatus || 'CS STUDENT')
              .replace(/\s*[•&bull;\-–—/|]?\s*fourth\s*year/gi, '')
              .replace(/fourth\s*year/gi, '')
              .trim() || 'CS STUDENT'}
          </span>
        </motion.div>

        {/* Stylized Modern Name & Title (Refined, Non-Bulky, Tasteful) */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono text-slate-400 tracking-wider">
            <span>Hello World, I'm</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight text-white">
            Amit <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.primaryGradient}`}>Chauhan</span>
          </h1>

          <div className="inline-block pt-1">
            <span className={`font-pixel text-xs sm:text-sm ${theme.headerAccent} tracking-wider`}>
              SOFTWARE ENGINEER &bull; AI DEVELOPER
            </span>
          </div>
        </motion.div>

        {/* Professional Description */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans"
        >
          Building intelligent systems, scalable full-stack web applications, and hybrid AI solutions.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2"
        >
          <button
            onClick={() => scrollTo('projects')}
            className={`group px-6 py-2.5 rounded-full bg-gradient-to-r ${theme.accentGradient} text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
          >
            <span>View My Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href={profileData?.resumeUrl || '/Amit_Chauhan_Resume.pdf'}
            download="Amit_Chauhan_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => portfolioApi.recordEvent('RESUME_DOWNLOAD', '/resume')}
            className="px-6 py-2.5 rounded-full bg-space-900 hover:bg-space-850 text-slate-200 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-2 border border-slate-700/80 hover:border-cyan-500/50 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Download Resume</span>
          </a>

          <button
            onClick={() => scrollTo('contact')}
            className="px-6 py-2.5 rounded-full bg-space-900/60 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 font-medium text-xs sm:text-sm flex items-center gap-2 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200"
          >
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Contact Me</span>
          </button>
        </motion.div>

        {/* Refined Symmetrical Social Connect Capsule (Clean & Even) */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center pt-3"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-space-900/90 border border-slate-800 backdrop-blur-md shadow-sm">
            <span className="font-pixel text-[10px] text-slate-500 tracking-wider">
              CONNECT:
            </span>
            <a
              href="https://www.linkedin.com/in/amit-chauhan-613833329"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-space-950 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-all group"
            >
              <Linkedin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-xs">LinkedIn</span>
            </a>
            <a
              href="https://github.com/amitchn28"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-space-950 border border-slate-800 hover:border-emerald-400 text-slate-300 hover:text-emerald-300 transition-all group"
            >
              <Github className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-xs">GitHub</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Down indicator */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-600 hover:text-cyan-400 transition-colors animate-bounce cursor-pointer p-2" 
        onClick={() => scrollTo('about')}
      >
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
};
