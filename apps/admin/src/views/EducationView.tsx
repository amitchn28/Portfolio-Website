import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  GraduationCap, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Building, 
  Loader2, 
  X 
} from 'lucide-react';

export const EducationView: React.FC = () => {
  const { success, error } = useToast();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Confirm delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form
  const [form, setForm] = useState({
    degree: '',
    fieldOfStudy: '',
    institution: '',
    academicStatus: 'Fourth Year',
    startYear: 2023,
    endYear: 2027,
    isCurrent: true,
    grade: '',
    description: '',
    order: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getEducation();
      setList(data || []);
    } catch (err: any) {
      error(err.message || 'Failed to load education');
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
      degree: '',
      fieldOfStudy: '',
      institution: '',
      academicStatus: 'Fourth Year',
      startYear: 2023,
      endYear: 2027,
      isCurrent: true,
      grade: '',
      description: '',
      order: list.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setForm({
      degree: item.degree || '',
      fieldOfStudy: item.fieldOfStudy || '',
      institution: item.institution || '',
      academicStatus: item.academicStatus || '',
      startYear: item.startYear || 2023,
      endYear: item.endYear || 2027,
      isCurrent: item.isCurrent !== false,
      grade: item.grade || '',
      description: item.description || '',
      order: item.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (editingItem) {
        await adminApi.updateEducation(editingItem.id, form);
        success('Education record updated in database');
      } else {
        await adminApi.createEducation(form);
        success('Education record created successfully');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save education record');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.deleteEducation(deleteTargetId);
      success('Education record deleted');
      setDeleteTargetId(null);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to delete record');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Education Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain verified academic credentials and degree programs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Record</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading Academic Records...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-space-900 border border-slate-800 text-slate-400 space-y-2">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm">No education records found in the database.</p>
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
                    {item.academicStatus || 'Active Program'}
                  </span>
                  {item.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      Current
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {item.degree}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    {item.institution}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-purple-300">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {item.startYear} — {item.endYear || 'Present'}
                  </span>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed pt-1">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-xl bg-space-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Edit Record"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(item.id)}
                  className="p-2 rounded-xl bg-space-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-space-900 border border-purple-500/40 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Education Record' : 'Add Education Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Degree Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.E. Computer Engineering"
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Field of Study</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Engineering"
                    value={form.fieldOfStudy}
                    onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Institution</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. University of Mumbai (ARMIET)"
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Academic Standing</label>
                  <input
                    type="text"
                    placeholder="e.g. Fourth Year"
                    value={form.academicStatus}
                    onChange={(e) => setForm({ ...form, academicStatus: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Start Year</label>
                  <input
                    type="number"
                    required
                    value={form.startYear}
                    onChange={(e) => setForm({ ...form, startYear: parseInt(e.target.value, 10) || 2023 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">End Year</label>
                  <input
                    type="number"
                    value={form.endYear}
                    onChange={(e) => setForm({ ...form, endYear: parseInt(e.target.value, 10) || 2027 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Academic Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Specialized coursework, focus areas, algorithms..."
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={form.isCurrent}
                  onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isCurrent" className="text-xs text-slate-300 font-mono">
                  Currently Enrolled Program
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
                  {modalLoading ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Education Record?"
        message="Are you sure you want to permanently remove this academic record from PostgreSQL?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
