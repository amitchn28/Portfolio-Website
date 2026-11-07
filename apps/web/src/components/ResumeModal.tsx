import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { portfolioApi } from '../services/api';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl?: string;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, resumeUrl }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-space-950/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl bg-space-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Curriculum Vitae</h3>
                <p className="text-xs text-slate-400 font-mono">Amit Chauhan &bull; CS Student</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Preview Box */}
          <div className="p-6 rounded-2xl bg-space-950/80 border border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <h4 className="text-base font-semibold text-white">
              Amit Chauhan — Software Engineer &amp; AI Developer CV
            </h4>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Featuring verified academic coursework, research in Hybrid Quantum Artificial Intelligence, Medical Image Processing (CNN), and scalable full-stack web development.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Current Status: Undergraduate Student</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500 font-mono">
              Dynamic CV synchronization enabled
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>

              <a
                href={resumeUrl || '#contact'}
                onClick={() => portfolioApi.recordEvent('RESUME_DOWNLOAD', '/resume')}
                target={resumeUrl ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-400 hover:to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{resumeUrl ? 'Download PDF' : 'Request Resume PDF'}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
