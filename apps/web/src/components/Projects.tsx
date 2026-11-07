import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Eye, ArrowUpRight, Sparkles, Cpu, Layers } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { portfolioApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface ProjectsProps {
  projectsList: any[];
}

export const Projects: React.FC<ProjectsProps> = ({ projectsList }) => {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Identify flagship project and standard projects
  const flagshipProject = projectsList.find((p) => p.isFlagship || p.slug?.includes('quantum') || p.id === 'p1') || projectsList[0];
  const standardProjects = projectsList.filter((p) => p.id !== flagshipProject?.id);

  const handleOpenProject = (project: any) => {
    portfolioApi.recordEvent('PROJECT_VIEW', project.slug || project.title);
    setSelectedProject(project);
  };

  const handleLinkClick = (project: any) => {
    portfolioApi.recordEvent('PROJECT_VIEW', project.slug || project.title);
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto relative scroll-mt-28">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} mb-3`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
          <span className={`font-pixel text-[10px] sm:text-[11px] ${theme.badgeText} tracking-wider`}>
            PROJECTS // SHOWCASE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading tracking-tight">
          Featured Engineering &amp; <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.primaryGradient}`}>Research</span>
        </h2>
        <div className={`h-0.5 w-16 bg-gradient-to-r ${theme.cardTopLine} rounded-full mx-auto mt-3`}></div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-3 font-sans">
          Deep learning pipelines, hybrid quantum-classical artificial intelligence, and scalable full-stack web applications.
        </p>
      </motion.div>

      {/* 1. FLAGSHIP PROJECT SHOWCASE (QAI-OLI) */}
      {flagshipProject && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 relative rounded-3xl p-6 sm:p-10 cyber-card overflow-hidden border border-cyan-500/40 shadow-glow-card group"
        >
          {/* Top Glowing Cyan/Emerald Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500"></div>

          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Flagship Badge & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-200 border border-cyan-400/50 shadow-glow-cyan">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                FLAGSHIP RESEARCH PROJECT
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-space-950/80 text-teal-300 border border-teal-500/30">
                {flagshipProject.category || 'Quantum-Classical AI'}
              </span>
            </div>

            <span className="font-pixel text-[10px] text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              CURRENT MAJOR PROJECT &bull; IN-PROGRESS
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2 mb-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white group-hover:text-cyan-200 transition-colors tracking-tight leading-tight">
              {flagshipProject.title}
            </h3>
            <p className="text-sm sm:text-base font-medium text-cyan-300/90 font-mono">
              {flagshipProject.subtitle || 'Quantum-Classical Hybrid Machine Learning for Early Risk Stratification'}
            </p>
          </div>

          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-4xl">
            {flagshipProject.description}
          </p>

          {/* Reported Performance Benchmarks Grid */}
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-space-950/80 border border-cyan-900/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Project-Reported Evaluation Metrics (Test Datasets)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">Rigorous Dual-Backbone Pipeline</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-xl bg-space-900/90 border border-slate-800 text-center">
                <div className="text-lg sm:text-2xl font-extrabold font-mono text-cyan-300">98.40%</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">Binary Screening Triage</div>
              </div>
              <div className="p-3.5 rounded-xl bg-space-900/90 border border-slate-800 text-center">
                <div className="text-lg sm:text-2xl font-extrabold font-mono text-teal-300">83.77%</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">Four-Class Accuracy</div>
              </div>
              <div className="p-3.5 rounded-xl bg-space-900/90 border border-slate-800 text-center">
                <div className="text-lg sm:text-2xl font-extrabold font-mono text-emerald-300">89.40%</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">Malignancy Sens. F1</div>
              </div>
              <div className="p-3.5 rounded-xl bg-space-900/90 border border-slate-800 text-center">
                <div className="text-lg sm:text-2xl font-extrabold font-mono text-sky-300">82.90%</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">Macro F1 (All Classes)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-space-900/90 border border-slate-800 text-center col-span-2 sm:col-span-1">
                <div className="text-lg sm:text-2xl font-extrabold font-mono text-amber-300">&lt; 2.5s</div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">End-to-End Latency</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-mono mt-3 italic text-center sm:text-left">
              * Project-reported evaluation metrics on test datasets; not a substitute for clinical diagnosis or regulatory approval.
            </p>
          </div>

          {/* Key Tech Stack Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Stack:
            </span>
            {(flagshipProject.technologies || []).map((tech: string, i: number) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-space-950/60 text-slate-300 border border-slate-800"
              >
                {typeof tech === 'string' ? tech : (tech as any).name}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800/80">
            {flagshipProject.liveUrl && (
              <a
                href={flagshipProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(flagshipProject)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-400 hover:to-emerald-500 text-slate-950 font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-cyan transition-all duration-200"
              >
                <Eye className="w-4 h-4" />
                <span>View Live Demo</span>
              </a>
            )}

            {flagshipProject.githubUrl && (
              <a
                href={flagshipProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(flagshipProject)}
                className="px-5 py-2.5 rounded-full bg-space-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 text-xs font-mono flex items-center gap-2 transition-all duration-200"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}

            <button
              onClick={() => handleOpenProject(flagshipProject)}
              className="px-5 py-2.5 rounded-full bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition-all duration-200 ml-auto"
            >
              <span>Explore Full Architecture</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* 2. SECONDARY PROJECTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {standardProjects.map((project, idx) => (
          <motion.div
            key={project.id || idx}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="cyber-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
                  {project.category || 'Project'}
                </span>

                <span className="font-pixel text-[10px] tracking-wider text-teal-400">
                  {project.status === 'COMPLETED' ? 'COMPLETED' : 'IN-PROGRESS'}
                </span>
              </div>

              {/* Project Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight mb-2">
                {project.title}
              </h3>

              {/* Subtitle */}
              {project.subtitle && (
                <p className="text-xs font-medium text-cyan-300/80 mb-3 font-mono">
                  {project.subtitle}
                </p>
              )}

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Technology Stack Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {(project.technologies || []).map((tech: any, tIdx: number) => {
                  const techName = typeof tech === 'string' ? tech : tech.name;
                  return (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-space-950/70 text-slate-400 border border-slate-800"
                    >
                      {techName}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(project)}
                  className="px-4 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Live</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(project)}
                  className="px-4 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-700/60"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}

              <button
                onClick={() => handleOpenProject(project)}
                className="px-4 py-1.5 rounded-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 text-xs font-mono flex items-center gap-1 transition-colors ml-auto border border-cyan-500/30"
              >
                <span>Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
