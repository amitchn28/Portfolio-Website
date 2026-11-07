import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Github, 
  Layers, 
  Cpu, 
  ShieldAlert, 
  Eye, 
  Binary
} from 'lucide-react';

interface ProjectModalProps {
  project: any | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const isQaiOli = project.slug?.includes('quantum') || project.id === 'p1' || project.isFlagship;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-space-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-space-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {project.category || 'AI / ML'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                  project.status === 'COMPLETED'
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                    : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                }`}>
                  {project.status === 'COMPLETED' ? 'COMPLETED' : 'CURRENT MAJOR PROJECT &bull; IN-PROGRESS'}
                </span>
                {isQaiOli && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-teal-950 text-teal-300 border border-teal-500/40">
                    Flagship Research
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white pt-1 leading-snug">
                {project.title}
              </h3>

              {project.subtitle && (
                <p className="text-xs sm:text-sm text-cyan-300 font-medium font-mono">
                  {project.subtitle}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors shrink-0"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-400 hover:to-emerald-500 text-slate-950 font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-cyan transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Open Live Deployment</span>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-space-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 text-xs font-mono flex items-center gap-2 transition-all"
              >
                <Github className="w-4 h-4" />
                <span>Source Repository</span>
              </a>
            )}
          </div>

          {/* Main Description */}
          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>{project.description}</p>
          </div>

          {/* SECTION FOR QAI-OLI: 6-STAGE ARCHITECTURE PIPELINE */}
          {isQaiOli && (
            <div className="space-y-6 pt-2">
              {/* Architecture Stages */}
              <div className="p-6 rounded-2xl bg-space-950/70 border border-cyan-900/40 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <Binary className="w-4 h-4 text-cyan-400" />
                  <span>Six-Stage Technical Architecture</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[11px] flex items-center justify-center">01</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide">Pre-Flight Image Quality Gate</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Evaluates Laplacian variance motion blur, illumination variance, specular glare, and color interference before allowing image processing. Sub-optimal samples are routed for recapture.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-300 font-mono font-bold text-[11px] flex items-center justify-center">02</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide">Dual Deep Feature Extraction</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      ConvNeXt-V2 captures macro-structural lesion architectures and tissue context, while DenseNet-121 captures dense cellular morphology and fine boundary transition gradients.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] flex items-center justify-center">03</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide">Feature Fusion &amp; 8-D PCA</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Concatenates deep representations and applies Principal Component Analysis (PCA) to project high-dimensional embeddings into an 8-dimensional quantum latent state vector.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-300 font-mono font-bold text-[11px] flex items-center justify-center">04</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide">8-Qubit Variational Quantum Circuit</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Encodes the 8 latent features into quantum states using angle embedding, followed by parameterized rotation gates and entangling CNOT layers evaluated via PennyLane &amp; Qiskit Aer.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[11px] flex items-center justify-center">05</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide">Explainable AI (Grad-CAM)</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Generates gradient-weighted class activation heatmaps highlighting histological tissue regions that guided the classification decisions for transparent verification.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] flex items-center justify-center">06</span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide">Clinical Triage Stratification</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Maps quantum expectation values to four clinical triage classes: OCA (Carcinoma), OPMD (Potentially Malignant Disorders), BSore (Benign Sore), and HLT (Healthy Tissue).
                    </p>
                  </div>
                </div>
              </div>

              {/* Reported Benchmarks Card */}
              <div className="p-6 rounded-2xl bg-space-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Project-Reported Performance Benchmarks</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">Test Dataset Evaluation</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 text-center">
                    <div className="text-xl font-extrabold font-mono text-cyan-300">98.40%</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">Binary Screening Triage</div>
                  </div>
                  <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 text-center">
                    <div className="text-xl font-extrabold font-mono text-teal-300">83.77%</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">Four-Class Accuracy</div>
                  </div>
                  <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 text-center">
                    <div className="text-xl font-extrabold font-mono text-emerald-300">89.40%</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">Malignancy Sens. F1</div>
                  </div>
                  <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 text-center">
                    <div className="text-xl font-extrabold font-mono text-sky-300">82.90%</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">Macro F1 (All Classes)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 text-center col-span-2 sm:col-span-1">
                    <div className="text-xl font-extrabold font-mono text-amber-300">&lt; 2.5s</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">End-to-End Latency</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200/90">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Academic &amp; Research Disclaimer:</strong> Project-reported evaluation metrics on test datasets; not a substitute for clinical diagnosis or regulatory approval.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content from other projects */}
          {!isQaiOli && project.content && (
            <div className="p-5 rounded-2xl bg-space-950/70 border border-slate-800/80 space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <Cpu className="w-4 h-4" />
                <span>Architecture &amp; Implementation Details</span>
              </div>
              <div className="whitespace-pre-line space-y-3 font-sans text-slate-300 leading-relaxed">
                {project.content}
              </div>
            </div>
          )}

          {/* Technologies Stack */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Technologies &amp; Libraries</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(project.technologies || []).map((t: any, idx: number) => {
                const name = typeof t === 'string' ? t : t.name;
                return (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-space-950 text-slate-300 border border-slate-800"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
