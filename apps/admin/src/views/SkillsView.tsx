import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Loader2, 
  X, 
  Layers
} from 'lucide-react';

export const SkillsView: React.FC = () => {
  const { success, error } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Confirm delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    featured: true,
    order: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSkills();
      setCategories(data || []);
    } catch (err: any) {
      error(err.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    const defaultCatId = categories[0]?.id || '';
    setForm({
      name: '',
      categoryId: defaultCatId,
      featured: true,
      order: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: any, categoryId: string) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name || '',
      categoryId: skill.categoryId || categoryId,
      featured: skill.featured !== false,
      order: skill.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (editingSkill) {
        await adminApi.updateSkill(editingSkill.id, form);
        success('Skill updated in database');
      } else {
        await adminApi.createSkill(form);
        success('Skill added to category');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save skill');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.deleteSkill(deleteTargetId);
      success('Skill deleted successfully');
      setDeleteTargetId(null);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to delete skill');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Technical Skills Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain verified programming languages, frameworks, databases, and development tooling.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technical Skill</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading Technical Skills...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-space-900 border border-slate-800 text-slate-400">
          No skills or categories configured in database.
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-2xl bg-space-900/80 border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-space-950 text-slate-400 border border-slate-800">
                    {(cat.skills || []).length} Skills
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {(cat.skills || []).map((skill: any) => (
                  <div
                    key={skill.id}
                    className="p-3.5 rounded-xl bg-space-950/80 border border-slate-800/80 hover:border-purple-500/40 flex flex-col justify-between gap-3 group transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {skill.name}
                      </span>
                      {skill.featured && (
                        <span title="Featured Skill">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => openEditModal(skill, cat.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(skill.id)}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-space-900 border border-purple-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingSkill ? 'Edit Skill' : 'Add Technical Skill'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, React.js, C++"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Category</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredSkill"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="featuredSkill" className="text-xs text-slate-300 font-mono">
                  Display as Featured Skill
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs text-white font-medium shadow-glow-purple"
                >
                  {modalLoading ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Skill?"
        message="Are you sure you want to remove this skill from the technical skills matrix?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
