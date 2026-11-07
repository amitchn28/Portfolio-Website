import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SkillsProps {
  skillsList: any[];
}

interface SkillItem {
  id: string;
  name: string;
  category: string;
  categorySlug?: string;
  icon?: string;
}

const SKILL_URLS: Record<string, string> = {
  'c++': 'https://isocpp.org',
  'cpp': 'https://isocpp.org',
  'java': 'https://dev.java',
  'python': 'https://www.python.org',
  'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'typescript': 'https://www.typescriptlang.org',
  'react.js': 'https://react.dev',
  'react': 'https://react.dev',
  'next.js': 'https://nextjs.org',
  'html': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  'css': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  'node.js': 'https://nodejs.org',
  'node': 'https://nodejs.org',
  'express.js': 'https://expressjs.com',
  'fastapi': 'https://fastapi.tiangolo.com',
  'tailwind css': 'https://tailwindcss.com',
  'three.js': 'https://threejs.org',
  'mongodb': 'https://www.mongodb.com',
  'sql': 'https://www.postgresql.org',
  'postgresql': 'https://www.postgresql.org',
  'git': 'https://git-scm.com',
  'github': 'https://github.com',
};

export const Skills: React.FC<SkillsProps> = ({ skillsList }) => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Filter tabs
  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'languages', label: 'Languages' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'databases', label: 'Databases' },
    { id: 'tools', label: 'Tools' },
  ];

  // Helper to match skill to category tab
  const matchesFilter = (skill: any, filterId: string) => {
    if (filterId === 'all') return true;
    const cat = (skill.category?.name || skill.category || skill.categorySlug || '').toLowerCase();
    const name = (skill.name || '').toLowerCase();

    if (filterId === 'languages') {
      return cat.includes('language') || ['c++', 'java', 'python', 'javascript', 'typescript'].includes(name);
    }
    if (filterId === 'frontend') {
      return cat.includes('frontend') || ['react.js', 'react', 'html', 'css', 'next.js', 'tailwind css', 'three.js'].includes(name);
    }
    if (filterId === 'backend') {
      return cat.includes('backend') || ['node.js', 'node', 'express.js', 'fastapi'].includes(name);
    }
    if (filterId === 'databases') {
      return cat.includes('database') || ['mongodb', 'sql', 'postgresql'].includes(name);
    }
    if (filterId === 'tools') {
      return cat.includes('tool') || ['git', 'github'].includes(name);
    }
    return false;
  };

  const filteredSkills = (skillsList || []).filter((s) => matchesFilter(s, selectedFilter));

  const getSkillUrl = (name: string): string => {
    const key = name.toLowerCase().trim();
    return SKILL_URLS[key] || `https://www.google.com/search?q=${encodeURIComponent(name + ' official documentation')}`;
  };

  // Render authentic technology icon
  const renderSkillIcon = (name: string) => {
    const n = name.toLowerCase();

    // C++
    if (n.includes('c++')) {
      return (
        <svg className="w-10 h-10" viewBox="0 0 128 128" fill="none">
          <path d="M115.4 30.7L66.7 2.6C65-.4 62.1-.4 60.4 2.6L12.6 30.2C10.9 31.2 10 32.8 10 34.7v58.6c0 1.9.9 3.5 2.6 4.5l47.8 27.6c1.7 1 4.6 1 6.3 0l48.7-28.1c1.7-1 2.6-2.6 2.6-4.5V35.2c0-1.9-.9-3.5-2.6-4.5z" fill="#00599C"/>
          <path d="M114.7 32L65.7 3.7c-1.1-.6-2.9-.6-4 0L14 31.5c-1.1.6-1.7 1.7-1.7 3v59c0 1.3.6 2.4 1.7 3l47.7 27.8c1.1.6 2.9.6 4 0l49-28.3c1.1-.6 1.7-1.7 1.7-3V35c0-1.3-.6-2.4-1.7-3z" fill="#004482"/>
          <path d="M78 60.8v-7.6h7.6v-6.3H78v-7.6h-6.3v7.6h-7.6v6.3h7.6v7.6H78zm23.6 0v-7.6h7.6v-6.3h-7.6v-7.6h-6.3v7.6H87.7v6.3h7.6v7.6h6.3z" fill="#fff"/>
          <path d="M60.6 78.4c-9.1 0-16.5-7.4-16.5-16.5s7.4-16.5 16.5-16.5c5.3 0 10.1 2.5 13.1 6.5l7.9-6.3c-5.2-6.6-13.1-10.7-21-10.7-15.1 0-27.4 12.3-27.4 27.4S45.5 89.8 60.6 89.8c7.9 0 15.8-4.2 21-10.7l-7.9-6.3c-3 4.1-7.8 6.6-13.1 6.6z" fill="#fff"/>
        </svg>
      );
    }

    // Java
    if (n.includes('java') && !n.includes('script')) {
      return (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
          <path d="M9.1 19.3c3.8.3 6.9-.2 9.5-.7.7-.1 1.4.3 1.5 1 .1.7-.3 1.4-1 1.5-2.8.6-6.3 1.1-10.5.8-3.9-.3-6.5-1.5-6.5-2.8 0-1 1.6-2 4.4-2.6.7-.1 1.4.3 1.5 1 .1.7-.3 1.4-1 1.5-2.1.5-3.3 1.1-3.3 1.6 0 .5 1.7 1.2 4.9 1.4z" fill="#E76F00"/>
          <path d="M8.2 16.4c3.4.3 6.5-.2 9.1-.7.7-.1 1.4.3 1.5 1 .1.7-.3 1.4-1 1.5-2.8.6-6.2 1.1-10.1.8-3.6-.3-6-1.5-6-2.7 0-1 1.5-1.9 4.1-2.5.7-.2 1.4.3 1.5.9.2.7-.3 1.4-.9 1.5-2 .5-3.1 1-3.1 1.5 0 .5 1.5 1.1 4.4 1.3z" fill="#E76F00"/>
          <path d="M12.9 8.2c1.2 1.3 1.8 2.7 1 4.5-.6 1.4-1.8 2.3-3.1 3.5-.4.3-.7.7-.9 1.1-.3.5-.2 1.1.2 1.5.4.4 1 .4 1.5.1 1.1-.8 2.1-1.6 2.9-2.7 1.5-2 1.9-4.2.3-6.2-1.3-1.6-1.2-3-.3-4.6.4-.6.2-1.4-.4-1.8-.6-.4-1.4-.2-1.8.4-1.4 2.1-1.1 4.2.6 6.3z" fill="#5382A1"/>
          <path d="M15.5 10.6c.9 1 1.2 2 .6 3.2-.5.9-1.2 1.6-2 2.4-.4.4-.6.9-.5 1.4.1.6.6 1 1.2 1 .3 0 .7-.1 1-.4.9-.8 1.8-1.7 2.3-2.8.9-1.8.7-3.6-.6-5.1-1.1-1.3-1-2.4-.3-3.7.3-.6.1-1.4-.5-1.7-.6-.3-1.4-.1-1.7.5-1.1 1.7-.9 3.5.5 5.2z" fill="#E76F00"/>
        </svg>
      );
    }

    // Python
    if (n.includes('python')) {
      return (
        <svg className="w-10 h-10" viewBox="0 0 128 128">
          <linearGradient id="pyA" x1="18.9" y1="18.9" x2="74.4" y2="74.4" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#387EB8"/>
            <stop offset="100%" stopColor="#366994"/>
          </linearGradient>
          <linearGradient id="pyB" x1="53.6" y1="53.6" x2="108.9" y2="108.9" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE873"/>
            <stop offset="100%" stopColor="#FFD43B"/>
          </linearGradient>
          <path d="M63.5 8C34.4 8 36.2 20.6 36.2 20.6l.1 13h27.8v3.9H23.5S8 35.8 8 65c0 29.2 13.5 28.1 13.5 28.1h8.1V80.3s-.4-15.4 15.2-15.4h26.4s14.8.2 14.8-14.4V22.8S89.5 8 63.5 8zm-14.8 8.6c2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1-5.1-2.3-5.1-5.1 2.3-5.1 5.1-5.1z" fill="url(#pyA)"/>
          <path d="M64.5 120c29.1 0 27.3-12.6 27.3-12.6l-.1-13H63.9v-3.9h40.6S120 92.2 120 63c0-29.2-13.5-28.1-13.5-28.1h-8.1v12.8s.4 15.4-15.2 15.4H56.8S42 102.9 42 117.5v27.7S38.5 120 64.5 120zm14.8-8.6c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1 5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1z" fill="url(#pyB)"/>
        </svg>
      );
    }

    // JavaScript
    if (n.includes('javascript') || n === 'js') {
      return (
        <div className="w-10 h-10 rounded bg-[#F7DF1E] flex items-center justify-center font-bold text-black font-sans text-lg shadow-sm">
          JS
        </div>
      );
    }

    // TypeScript
    if (n.includes('typescript') || n === 'ts') {
      return (
        <div className="w-10 h-10 rounded bg-[#3178C6] flex items-center justify-center font-bold text-white font-sans text-lg shadow-sm">
          TS
        </div>
      );
    }

    // React
    if (n.includes('react')) {
      return (
        <svg className="w-10 h-10 animate-spin-slow" viewBox="0 0 115.3 100" fill="#61DAFB">
          <ellipse cx="57.6" cy="50" rx="16.5" ry="46.3" transform="matrix(.866 .5 -.5 .866 32.72 -20.93)" fill="none" stroke="#61DAFB" strokeWidth="4.5"/>
          <ellipse cx="57.6" cy="50" rx="16.5" ry="46.3" transform="matrix(-.866 .5 -.5 -.866 132.72 69.07)" fill="none" stroke="#61DAFB" strokeWidth="4.5"/>
          <ellipse cx="57.6" cy="50" rx="46.3" ry="16.5" fill="none" stroke="#61DAFB" strokeWidth="4.5"/>
          <circle cx="57.6" cy="50" r="10"/>
        </svg>
      );
    }

    // HTML
    if (n.includes('html')) {
      return (
        <svg className="w-10 h-10" viewBox="0 0 512 512">
          <path fill="#E44D26" d="M71 460L30 0h452l-41 460-185 52z"/>
          <path fill="#F16529" d="M256 472l149-41 35-394H256z"/>
          <path fill="#EBEBEB" d="M256 208h-74l-5-57h79V95H112l15 169h129zm0 167l-72-19-5-53h-56l9 101 124 34z"/>
          <path fill="#FFF" d="M256 208h74l-7 78-67 18v57l124-34 17-194H256zm0-113v56h138l5-56z"/>
        </svg>
      );
    }

    // CSS
    if (n.includes('css')) {
      return (
        <svg className="w-10 h-10" viewBox="0 0 512 512">
          <path fill="#264DE4" d="M71 460L30 0h452l-41 460-185 52z"/>
          <path fill="#2965F1" d="M256 472l149-41 35-394H256z"/>
          <path fill="#EBEBEB" d="M256 208h-74l-5-57h79V95H112l15 169h129zm0 167l-72-19-5-53h-56l9 101 124 34z"/>
          <path fill="#FFF" d="M256 208h74l-7 78-67 18v57l124-34 17-194H256zm0-113v56h138l5-56z"/>
        </svg>
      );
    }

    // Node.js
    if (n.includes('node')) {
      return (
        <svg className="w-10 h-10" viewBox="0 0 128 128">
          <path d="M64 4l52 30v60L64 124 12 94V34L64 4z" fill="#339933"/>
          <path d="M64 124l52-30V34L64 4v120z" fill="#43853D"/>
          <path d="M68 64c0 14-8 18-20 18-8 0-14-3-14-3l3-8s5 2 11 2c6 0 9-2 9-8V40h11v24zm18-24h11v42H86V40z" fill="#FFF"/>
        </svg>
      );
    }

    // Express.js
    if (n.includes('express')) {
      return (
        <div className="w-10 h-10 rounded-full border border-slate-700 bg-space-950 flex items-center justify-center font-mono font-bold text-white text-sm">
          ex
        </div>
      );
    }

    // MongoDB
    if (n.includes('mongo')) {
      return (
        <svg className="w-10 h-10" viewBox="0 0 128 128">
          <path d="M64.6 2.6c-2.3 3.6-11.8 17.5-17.7 27.5-9.3 15.7-14.7 34.3-12.7 52.8 2.2 20.4 14.8 38.6 30.4 42.5 0 0-2.4-7.5-1.9-12.2.5-4.4 2.8-7.7 2.8-7.7s-10.3-6.6-11.8-19.1c-1.6-13.8 6.4-25.3 11.1-30.8 1.4-1.6 3-3.2 4.1-4.8 1.4 3 2.9 6.1 4.5 9.1 5.9 10.9 13.9 20.8 13.9 33.5 0 9.7-5.9 16.5-10.7 20 0 0 2.2 4 2.5 8.1.3 4.8-1.5 11.2-1.5 11.2 16.5-3.9 29.8-22.3 31.9-42.5 2.1-19.8-4-39.7-14.3-56.1-5.7-9.3-17.2-27.9-20.6-31.5z" fill="#47A248"/>
        </svg>
      );
    }

    // SQL / PostgreSQL
    if (n.includes('sql')) {
      return (
        <svg className="w-10 h-10" viewBox="0 0 128 128">
          <path d="M96.7 54.4c.7-6.5-3.7-12.4-10-13.4-6.3-1-12.2 3.4-13.2 9.9-.4 2.6-.1 5.3.9 7.7-6.2 3.4-13.2 5.5-20.4 6.2-7.2.7-14.4-.1-21.2-2.3 2.3-5.2 6.3-9.5 11.5-12.2 5.2-2.7 11.2-3.7 17-2.9 1.8.2 3.6.7 5.3 1.3 2.2-4.1 5.6-7.5 9.8-9.7-4.5-2.2-9.4-3.5-14.4-4-5-.5-10.1-.1-15 1.2-10 2.6-18.7 8.7-24.6 17.2-5.9 8.5-8.5 18.9-7.4 29.3 1.1 10.4 6.1 20 14 26.9 7.9 6.9 18 10.7 28.5 10.7 3.6 0 7.2-.5 10.6-1.5 10.5-3.1 19.3-10.2 24.8-19.7 5.5-9.5 7.1-20.8 4.4-31.4z" fill="#336791"/>
        </svg>
      );
    }

    // Git
    if (n.includes('git') && !n.includes('hub')) {
      return (
        <svg className="w-10 h-10" viewBox="0 0 128 128">
          <path d="M124.6 57.2L70.8 3.4c-4.5-4.5-11.9-4.5-16.4 0L42.8 15l15.1 15.1c4.8-1.6 10.4-.6 14.3 3.3 3.9 3.9 4.9 9.5 3.3 14.3l14.6 14.6c4.8-1.6 10.4-.6 14.3 3.3 5.4 5.4 5.4 14.2 0 19.6s-14.2 5.4-19.6 0c-4.1-4.1-5.1-10.1-3-15l-13.6-13.6v35.8c1.8 1 3.4 2.4 4.6 4.2 4.1 6.1 2.5 14.4-3.6 18.5s-14.4 2.5-18.5-3.6c-4.1-6.1-2.5-14.4 3.6-18.5 2.1-1.4 4.5-2.2 7-2.3V50.8c-2.5-.1-4.9-.9-7-2.3-4.3-2.9-6.4-7.8-5.7-12.7L33.7 22.1 3.4 52.4c-4.5 4.5-4.5 11.9 0 16.4l53.8 53.8c4.5 4.5 11.9 4.5 16.4 0l51-51c4.5-4.5 4.5-11.9 0-14.4z" fill="#F05032"/>
        </svg>
      );
    }

    // GitHub
    if (n.includes('github')) {
      return (
        <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      );
    }

    // Fallback Icon
    return (
      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-purple-300 text-sm">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto relative scroll-mt-28">
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
          <span className={`font-pixel text-[10px] sm:text-[11px] ${theme.badgeText} tracking-wider`}>
            SKILLS // TOOLKIT
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading tracking-tight">
          Technical Skills &amp; <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.primaryGradient}`}>Ecosystem</span>
        </h2>
        <div className={`h-0.5 w-16 bg-gradient-to-r ${theme.cardTopLine} rounded-full mx-auto mt-3`}></div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-3 font-sans">
          Click on any technology to explore its official documentation &amp; ecosystem.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-5 py-2 rounded-full text-xs transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${theme.accentGradient} text-white font-bold scale-105 shadow-md`
                    : 'bg-space-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 font-medium'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Grid of Clickable Skill Cards */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 mt-8"
      >
        {filteredSkills.map((skill: SkillItem, idx: number) => {
          const destinationUrl = getSkillUrl(skill.name);

          return (
            <motion.a
              layout
              key={skill.id || skill.name || idx}
              href={destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              title={`Visit official ${skill.name} website`}
              className="group relative rounded-2xl p-6 bg-space-900/70 border border-slate-800/90 hover:border-cyan-500/80 transition-all duration-300 flex flex-col items-center justify-center gap-3.5 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:-translate-y-1 text-center cursor-pointer"
            >
              {/* External Link Indicator on Hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-cyan-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>

              {/* Top Subtle Cyan Hover Line */}
              <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon Container */}
              <div className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                {renderSkillIcon(skill.name)}
              </div>

              {/* Skill Name */}
              <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors tracking-wide">
                {skill.name}
              </span>
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
};
