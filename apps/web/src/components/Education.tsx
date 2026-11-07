import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Building2, School, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface EducationProps {
  educationList: any[];
}

export const Education: React.FC<EducationProps> = ({ educationList }) => {
  const { theme } = useTheme();

  return (
    <section id="education" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative scroll-mt-28">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} mb-3`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
          <span className={`font-pixel text-[10px] sm:text-[11px] ${theme.badgeText} tracking-wider`}>
            ACADEMICS // TIMELINE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading tracking-tight">
          Education &amp; <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.primaryGradient}`}>Academic Background</span>
        </h2>
        <div className={`h-0.5 w-16 bg-gradient-to-r ${theme.cardTopLine} rounded-full mx-auto mt-3`}></div>
      </motion.div>

      {/* Cards List */}
      <div className="space-y-6">
        {educationList && educationList.length > 0 ? (
          educationList.map((edu, idx) => {
            const hasArmiet = edu.institution?.toUpperCase().includes('ARMIET');
            const collegeName = hasArmiet
              ? edu.institution
              : 'ARMIET (Alamuri Ratnamala Institute of Engineering and Technology)';
            const universityName = 'University of Mumbai';

            return (
              <motion.div
                key={edu.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative rounded-3xl p-6 sm:p-9 bg-space-900/90 border border-slate-800/80 ${theme.cardGlow} overflow-hidden group hover:border-slate-700 transition-all duration-300`}
              >
                {/* Top Glowing Dynamic Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.cardTopLine}`}></div>

                {/* Left Vertical Accent Line */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b ${theme.cardTopLine}`}></div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3.5 flex-1">
                    {/* Status Pill & Academic Years */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{(edu.academicStatus || 'Undergraduate Candidate').replace(/fourth\s*year/gi, 'Undergraduate').trim()}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-space-950 text-slate-300 border border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{edu.startYear || 2023} — {edu.endYear || 2027}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-space-950 text-slate-400 border border-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mumbai, Maharashtra</span>
                      </span>
                    </div>

                    {/* Degree Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-heading tracking-tight">
                        {edu.degree || 'B.E. Computer Engineering'}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
                        Department of {edu.fieldOfStudy || 'Computer Engineering'}
                      </p>
                    </div>

                    {/* Prominent College & University Credentials */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {/* 1. College Details */}
                      <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800/90 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                          <School className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                            Engineering College
                          </span>
                          <div className="text-xs sm:text-sm font-semibold text-white leading-snug">
                            {collegeName}
                          </div>
                        </div>
                      </div>

                      {/* 2. Affiliated University */}
                      <div className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800/90 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                            Affiliated University
                          </span>
                          <div className="text-xs sm:text-sm font-semibold text-white leading-snug">
                            {universityName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Icon Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-space-950 to-slate-900 border border-slate-700/60 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg hidden md:flex">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                </div>

                {/* Coursework & Narrative Description */}
                {edu.description && (
                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {edu.description}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500 font-mono text-sm">
            Academic records are actively synchronized through the database.
          </div>
        )}
      </div>
    </section>
  );
};
