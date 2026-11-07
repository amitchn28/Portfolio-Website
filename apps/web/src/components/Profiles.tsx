import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getAssetUrl } from '../utils/assetUrl';

interface ProfilesProps {
  profileData?: any;
  socialsList?: any[];
}

export const Profiles: React.FC<ProfilesProps> = ({ profileData, socialsList }) => {
  const { theme } = useTheme();
  // Find social links if available from database API
  const linkedinUrl = 
    socialsList?.find(s => s.platform?.toLowerCase() === 'linkedin')?.url ||
    'https://www.linkedin.com/in/amit-chauhan-613833329';
  const githubUrl = 
    socialsList?.find(s => s.platform?.toLowerCase() === 'github')?.url ||
    'https://github.com/amitchn28';

  const rawAvatar = profileData?.avatarUrl;
  const avatarUrl = getAssetUrl(rawAvatar) || '/avatar.webp';

  return (
    <section id="profiles" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto relative text-center scroll-mt-28">
      {/* Avatar with Luminous Cyan/Emerald Halo and Photo Support */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex justify-center mb-4"
      >
        <div className="relative group">
          {/* Outer Glowing Ring */}
          <div className={`absolute -inset-2 bg-gradient-to-r ${theme.cardTopLine} rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-slow`}></div>
          
          {/* Avatar Container */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/20 bg-space-900 flex items-center justify-center text-white shadow-xl">
            <img
              src={avatarUrl}
              alt={profileData?.name || 'Amit Chauhan'}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/avatar.webp';
              }}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Retro-Tech Handle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <span className="font-pixel text-xs sm:text-sm text-cyan-400 tracking-wider">
          @{profileData?.name ? profileData.name.replace(/\s+/g, '').toUpperCase() : 'AMITCHAUHAN'}
        </span>
      </motion.div>

      {/* Grid of Verified Profile Cards (LinkedIn & GitHub) */}
      <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* 1. LinkedIn */}
        <motion.a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl p-6 sm:p-7 bg-space-900/80 border border-slate-800/80 hover:border-cyan-500/60 flex flex-col items-center justify-center gap-3.5 group hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
            <Linkedin className="w-6 h-6 fill-current" />
          </div>
          <div className="text-center">
            <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              LinkedIn
            </h4>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              CONNECT
            </span>
          </div>
        </motion.a>

        {/* 2. GitHub */}
        <motion.a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="rounded-2xl p-6 sm:p-7 bg-space-900/80 border border-slate-800/80 hover:border-emerald-500/60 flex flex-col items-center justify-center gap-3.5 group hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
            <Github className="w-6 h-6 fill-current" />
          </div>
          <div className="text-center">
            <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              GitHub
            </h4>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              CODE &amp; REPOS
            </span>
          </div>
        </motion.a>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-xs sm:text-sm text-slate-400 mt-8 font-sans tracking-wide"
      >
        Connect with me on LinkedIn or explore my latest open-source repositories on GitHub.
      </motion.p>
    </section>
  );
};
