import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  Globe, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  X, 
  Linkedin, 
  Github 
} from 'lucide-react';

export const SocialsView: React.FC = () => {
  const { success, error } = useToast();
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Confirm delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    platform: '',
    url: '',
    username: '',
    icon: 'Globe',
    isActive: true,
    order: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSocialLinks();
      setLinks(data || []);
    } catch (err: any) {
      error(err.message || 'Failed to load social profiles');
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
      platform: '',
      url: '',
      username: '',
      icon: 'Globe',
      isActive: true,
      order: links.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setForm({
      platform: item.platform || '',
      url: item.url || '',
      username: item.username || '',
      icon: item.icon || 'Globe',
      isActive: item.isActive !== false,
      order: item.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (editingItem) {
        await adminApi.updateSocialLink(editingItem.id, form);
        success('Social link updated');
      } else {
        await adminApi.createSocialLink(form);
        success('Social link added');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save social link');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.deleteSocialLink(deleteTargetId);
      success('Social link deleted');
      setDeleteTargetId(null);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to delete social link');
    }
  };

  const toggleActive = async (item: any) => {
    try {
      await adminApi.updateSocialLink(item.id, { isActive: !item.isActive });
      success(`Profile ${!item.isActive ? 'activated' : 'deactivated'}`);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to toggle status');
    }
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return <Linkedin className="w-5 h-5 text-blue-400" />;
    if (p.includes('github')) return <Github className="w-5 h-5 text-white" />;
    if (p.includes('leetcode')) return <span className="text-amber-400 font-bold font-mono text-sm">LC</span>;
    if (p.includes('hackerrank')) return <span className="text-emerald-400 font-bold font-mono text-sm">HR</span>;
    return <Globe className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Social Links &amp; Profiles Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain your verified LinkedIn, GitHub, and professional coding profiles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Profile</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading Social Profiles...</p>
        </div>
      ) : links.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-space-900 border border-slate-800 text-slate-400 space-y-2">
          <Globe className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm">No social profiles recorded in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-space-900/80 border border-slate-800 flex items-center justify-between gap-4 group hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-center shrink-0">
                  {getPlatformIcon(item.platform)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{item.platform}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      item.isActive
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      {item.isActive ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-300/80 hover:text-purple-300 font-mono flex items-center gap-1 line-clamp-1"
                  >
                    <span>{item.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => toggleActive(item)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-colors ${
                    item.isActive
                      ? 'bg-space-950 text-slate-400 border-slate-800 hover:text-white'
                      : 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {item.isActive ? 'Hide' : 'Show'}
                </button>
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
                {editingItem ? 'Edit Social Link' : 'Add Social Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Platform Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LinkedIn, GitHub, LeetCode, HackerRank"
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Full Profile URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Display Username / Handle</label>
                <input
                  type="text"
                  placeholder="e.g. amitchn28"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="linkActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="linkActive" className="text-xs text-slate-300 font-mono">
                  Display Link on Public Portfolio
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
                  {modalLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Social Profile?"
        message="Are you sure you want to remove this social link?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
