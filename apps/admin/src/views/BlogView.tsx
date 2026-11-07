import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  X,
  BookOpen
} from 'lucide-react';

export const BlogView: React.FC = () => {
  const { success, error } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Confirm delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featuredImage: '',
    tags: [] as string[],
    tagInput: '',
    published: false,
    seoTitle: '',
    seoDescription: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getBlogPosts({ includeUnpublished: true });
      setPosts(data || []);
    } catch (err: any) {
      error(err.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      featuredImage: '',
      tags: [],
      tagInput: '',
      published: false,
      seoTitle: '',
      seoDescription: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingPost(p);
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      summary: p.summary || '',
      content: p.content || '',
      featuredImage: p.featuredImage || '',
      tags: p.tags || [],
      tagInput: '',
      published: p.published || false,
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
    });
    setIsModalOpen(true);
  };

  const addTagBadge = () => {
    if (!form.tagInput.trim()) return;
    if (!form.tags.includes(form.tagInput.trim())) {
      setForm({
        ...form,
        tags: [...form.tags, form.tagInput.trim()],
        tagInput: '',
      });
    }
  };

  const removeTagBadge = (tag: string) => {
    setForm({
      ...form,
      tags: form.tags.filter((t) => t !== tag),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        summary: form.summary,
        content: form.content,
        featuredImage: form.featuredImage || null,
        tags: form.tags,
        published: form.published,
        seoTitle: form.seoTitle || form.title,
        seoDescription: form.seoDescription || form.summary,
      };

      if (editingPost) {
        await adminApi.updateBlogPost(editingPost.id, payload);
        success('Article updated successfully');
      } else {
        await adminApi.createBlogPost(payload);
        success('New article created');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to save article');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.deleteBlogPost(deleteTargetId);
      success('Article deleted');
      setDeleteTargetId(null);
      loadData();
    } catch (err: any) {
      error(err.message || 'Failed to delete article');
    }
  };

  const togglePublish = async (p: any) => {
    try {
      await adminApi.updateBlogPost(p.id, { published: !p.published });
      success(p.published ? 'Article saved as draft' : 'Article published live');
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
            Blog &amp; Technical Articles CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Author and publish research notes, AI writeups, and engineering articles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading Blog Posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-space-900 border border-slate-800 text-slate-400 space-y-2">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Blog Articles Published Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Zero fake articles are generated. When you write an engineering breakdown or quantum AI tutorial, draft and publish it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-space-900/80 border border-slate-800 hover:border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${p.published
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                    }`}>
                    {p.published ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Views: {p.viewCount || 0}
                  </span>
                  {p.publishedAt && (
                    <span className="text-[10px] font-mono text-slate-500">
                      &bull; {new Date(p.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white hover:text-purple-300 transition-colors">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {p.summary}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {(p.tags || []).map((t: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-space-950 text-purple-300 border border-slate-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => togglePublish(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-colors ${p.published
                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    }`}
                >
                  {p.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => openEditModal(p)}
                  className="p-2 rounded-xl bg-space-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(p.id)}
                  className="p-2 rounded-xl bg-space-950 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-space-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-space-900 border border-purple-500/40 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingPost ? 'Edit Article' : 'Compose New Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building Hybrid Quantum-Classical Classifiers with PennyLane"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Slug (URL identifier)</label>
                <input
                  type="text"
                  placeholder="leave empty to automatically generate from title"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Summary / Abstract</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Concise overview displayed in article lists and search cards..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Article Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. quantum-computing, deep-learning, pytorch..."
                    value={form.tagInput}
                    onChange={(e) => setForm({ ...form, tagInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTagBadge();
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTagBadge}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium shrink-0"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-space-950 text-purple-300 border border-purple-500/30 flex items-center gap-1.5"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => removeTagBadge(t)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Full Content */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Article Content (Markdown)</label>
                <textarea
                  rows={8}
                  required
                  placeholder="### Introduction&#10;Write your deep dive engineering analysis..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none resize-none font-mono"
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="postPublish"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="postPublish" className="text-xs text-slate-300 font-mono">
                  Publish Live (Uncheck to keep as private draft)
                </label>
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
                  {modalLoading ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Article?"
        message="Are you sure you want to permanently delete this article?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
