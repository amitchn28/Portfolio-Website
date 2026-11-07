import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Github, 
  Sparkles, 
  Loader2, 
  X
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { success, error } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Confirm delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    content: '',
    category: 'Quantum-Classical AI',
    status: 'IN_PROGRESS',
    featured: false,
    published: true,
    liveUrl: '',
    githubUrl: '',
    technologies: [] as string[],
    techInput: '',
    order: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProjects({ includeUnpublished: true });
      setProjects(data || []);
    } catch (err: any) {
      error(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm({
      title: '',
      subtitle: '',
      description: '',
      content: '',
      category: 'Deep Learning',
      status: 'IN_PROGRESS',
      featured: false,
      published: true,
      liveUrl: '',
      githubUrl: '',
      technologies: [],
      techInput: '',
      order: projects.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProject(p);
    const techList = (p.technologies || []).map((t: any) =>
      typeof t === 'string' ? t : t.name
    );

    setForm({
      title: p.title || '',
      subtitle: p.subtitle || '',
      description: p.description || '',
      content: p.content || '',
      category: p.category || 'Quantum-Classical AI',
      status: p.status || 'IN_PROGRESS',
      featured: p.featured !== false,
      published: p.published !== false,
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      technologies: techList,
      techInput: '',
      order: p.order || 0,
    });
    setIsModalOpen(true);
  };

  const addTechBadge = () => {
    if (!form.techInput.trim()) return;
    if (!form.technologies.includes(form.techInput.trim())) {
      setForm({
        ...form,
        technologies: [...form.technologies, form.techInput.trim()],
        techInput: '',
      });
    }
  };

  const removeTechBadge = (name: string) => {
    setForm({
      ...form,
      technologies: form.technologies.filter((t) => t !== name),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        content: form.content,
        category: form.category,
        status: form.status,
        featured: form.featured,
        published: form.published,
        liveUrl: form.liveUrl || null,
        githubUrl: form.githubUrl || null,
        technologies: form.technologies,
        order: form.order,
      };

      if (editingProject) {
        await adminApi.updateProject(editingProject.id, payload);
        success('Project updated in PostgreSQL database');
      } else {
        await adminApi.createProject(payload);
        success('New project created and published');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save project');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.deleteProject(deleteTargetId);
      success('Project removed successfully');
      setDeleteTargetId(null);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to delete project');
    }
  };

  const togglePublish = async (p: any) => {
    try {
      await adminApi.updateProject(p.id, { published: !p.published });
      success(p.published ? 'Project unpublished (Draft)' : 'Project published to public site');
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Projects Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain your research engineering projects, live deployments, and architecture case studies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading Projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-space-900 border border-slate-800 text-slate-400">
          No projects configured in database.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => {
            const isFlagship = p.slug?.includes('quantum') || p.title?.includes('Quantum');

            return (
              <div
                key={p.id}
                className={`p-6 rounded-2xl bg-space-900/80 border transition-all ${
                  isFlagship
                    ? 'border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.15)]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2.5 max-w-4xl">
                    <div className="flex flex-wrap items-center gap-2">
                      {isFlagship && (
                        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-900/60 text-purple-200 border border-purple-500/40">
                          <Sparkles className="w-3 h-3 text-purple-300" />
                          FLAGSHIP RESEARCH
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-space-950 text-slate-300 border border-slate-800">
                        {p.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                        p.published
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                      }`}>
                        {p.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Status: {p.status}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {p.title}
                    </h3>

                    {p.subtitle && (
                      <p className="text-xs font-mono text-purple-300/80">
                        {p.subtitle}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                      {p.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {(p.technologies || []).map((tech: any, idx: number) => {
                        const name = typeof tech === 'string' ? tech : tech.name;
                        return (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-space-950 text-slate-400 border border-slate-800"
                          >
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-start pt-2 lg:pt-0">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-space-950 hover:bg-purple-950/40 text-purple-400 border border-slate-800 hover:border-purple-500/40 transition-colors"
                        title="View Live Demo"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}

                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-space-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                        title="View GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => togglePublish(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-colors ${
                        p.published
                          ? 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-950/60'
                          : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60'
                      }`}
                    >
                      {p.published ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 rounded-xl bg-space-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Edit Project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTargetId(p.id)}
                      className="p-2 rounded-xl bg-space-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-space-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-space-900 border border-purple-500/40 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? 'Edit Project Details' : 'Create New Project'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oral Lesion Image Classification Using Hybrid Quantum AI"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Subtitle / Tagline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantum-Classical Hybrid Machine Learning for Early Risk Stratification"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quantum-Classical AI, Computer Vision"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  >
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://qai-oli.vercel.app/"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/amitchn28/qai-oli"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Technologies Badges */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Technologies Employed</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add technology (e.g. PyTorch, ConvNeXt-V2, PennyLane)..."
                    value={form.techInput}
                    onChange={(e) => setForm({ ...form, techInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechBadge();
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTechBadge}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium shrink-0"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-space-950 text-purple-300 border border-purple-500/30 flex items-center gap-1.5"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => removeTechBadge(t)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Short Summary</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Concise overview displayed on the project card..."
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Full Architecture Case Study Markdown */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">
                  Full Architecture &amp; Case Study (Markdown)
                </label>
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="### Six-Stage Architecture&#10;1. Pre-Flight Quality Gate...&#10;&#10;### Benchmarks&#10;- 98.40% Binary Screening Triage..."
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none resize-none font-mono"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isFeatured" className="text-xs text-slate-300 font-mono">
                    Featured Project
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isPublished" className="text-xs text-slate-300 font-mono">
                    Published (Visible on Portfolio)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-space-950 text-xs text-slate-300 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs text-white font-medium shadow-glow-purple"
                >
                  {modalLoading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Project?"
        message="Are you sure you want to permanently remove this project and its linked records from PostgreSQL?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
