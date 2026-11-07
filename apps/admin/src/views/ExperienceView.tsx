import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar, 
  Loader2, 
  X, 
  Info 
} from 'lucide-react';

export const ExperienceView: React.FC = () => {
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
    company: '',
    role: '',
    employmentType: 'INTERNSHIP',
    location: '',
    locationType: 'REMOTE',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievements: '',
    order: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getExperience();
      setList(data || []);
    } catch (err: any) {
      error(err.message || 'Failed to load experience');
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
      company: '',
      role: '',
      employmentType: 'INTERNSHIP',
      location: '',
      locationType: 'REMOTE',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isCurrent: false,
      description: '',
      achievements: '',
      order: list.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setForm({
      company: item.company || '',
      role: item.role || '',
      employmentType: item.employmentType || 'INTERNSHIP',
      location: item.location || '',
      locationType: item.locationType || 'REMOTE',
      startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
      isCurrent: item.isCurrent || false,
      description: item.description || '',
      achievements: item.achievements || '',
      order: item.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (editingItem) {
        await adminApi.updateExperience(editingItem.id, form);
        success('Experience record updated');
      } else {
        await adminApi.createExperience(form);
        success('Experience record added');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save experience');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.deleteExperience(deleteTargetId);
      success('Experience record deleted');
      setDeleteTargetId(null);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to delete experience');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Professional Experience Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain future internships, software development engagements, and research positions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* High-Integrity Notice Banner */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3 text-xs text-purple-200">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Academic Integrity Policy Active</p>
          <p className="text-slate-300 leading-relaxed">
            As a fourth-year engineering candidate, you currently do not have professional work history or corporate internships. To preserve absolute authenticity, this table is maintained with zero fake records and is hidden on the public portfolio until you add genuine career positions.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading Experience Records...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-space-900 border border-slate-800 text-slate-400 space-y-3">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">No Experience Records Added Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Whenever you secure an internship, research role, or developer position, click "Add Experience" above to log it into PostgreSQL.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-space-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-purple-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-950 text-purple-300 border border-purple-500/30">
                    {item.employmentType}
                  </span>
                  {item.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      Present
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {item.role} &bull; <span className="text-slate-400 font-normal">{item.company}</span>
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-purple-300">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {new Date(item.startDate).toLocaleDateString()} — {item.isCurrent ? 'Present' : item.endDate ? new Date(item.endDate).toLocaleDateString() : ''}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location} ({item.locationType})
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-xl bg-space-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(item.id)}
                  className="p-2 rounded-xl bg-space-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-space-900 border border-purple-500/40 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Experience' : 'Add Experience Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Organization / Company</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Position / Title</label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Type</label>
                  <select
                    value={form.employmentType}
                    onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  >
                    <option value="INTERNSHIP">Internship</option>
                    <option value="RESEARCH">Research</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Start Date</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">End Date</label>
                  <input
                    type="date"
                    disabled={form.isCurrent}
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="expCurrent"
                  checked={form.isCurrent}
                  onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="expCurrent" className="text-xs text-slate-300 font-mono">
                  Currently Working in this Role
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Responsibilities &amp; Impact</label>
                <textarea
                  rows={3}
                  required
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
                  {modalLoading ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Experience?"
        message="Are you sure you want to remove this experience record?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
