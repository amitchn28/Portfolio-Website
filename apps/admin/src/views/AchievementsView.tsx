import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  Trophy, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  X, 
  Building2 
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { success, error } = useToast();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Confirm delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
    badgeUrl: '',
    order: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAchievements();
      setList(data || []);
    } catch (err: any) {
      error(err.message || 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      title: '',
      organization: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      badgeUrl: '',
      order: list.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      organization: item.organization || '',
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      description: item.description || '',
      badgeUrl: item.badgeUrl || '',
      order: item.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (editingItem) {
        await adminApi.updateAchievement(editingItem.id, form);
        success('Achievement updated');
      } else {
        await adminApi.createAchievement(form);
        success('Achievement logged successfully');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save achievement');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.deleteAchievement(deleteTargetId);
      success('Achievement record deleted');
      setDeleteTargetId(null);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to delete achievement');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Achievements &amp; Honors Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain verified hackathons, competitions, academic honors, and technological awards.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading Achievements...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-space-900 border border-slate-800 text-slate-400 space-y-2">
          <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Honors or Awards Recorded Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Zero fake achievements are fabricated. When you participate in a hackathon, win a coding contest, or earn academic recognition, record it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-space-900/80 border border-slate-800 flex flex-col justify-between gap-3 group hover:border-purple-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {item.organization && (
                    <span className="text-[11px] font-mono text-purple-300 font-semibold uppercase flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {item.organization}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg bg-space-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(item.id)}
                  className="p-1.5 rounded-lg bg-space-950 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-space-900 border border-purple-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingItem ? 'Edit Achievement' : 'Log New Achievement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Award / Competition Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart India Hackathon Finalist"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Organizing Body</label>
                  <input
                    type="text"
                    placeholder="e.g. Ministry of Education"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Date Received</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Description &amp; Highlights</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Problem tackled, team role, technical highlights..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none resize-none"
                />
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
                  {modalLoading ? 'Saving...' : 'Save Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Achievement?"
        message="Are you sure you want to remove this achievement from PostgreSQL?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
