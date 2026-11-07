import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  Mail, 
  Trash2, 
  Reply, 
  Search, 
  Loader2, 
  X, 
  Send,
  AlertCircle
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { success, error } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected message for details / reply
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getContactMessages({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      setMessages(data?.messages || []);
      setUnreadCount(data?.unreadCount || 0);
    } catch (err: any) {
      error(err.message || 'Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [statusFilter]);

  const toggleStatus = async (msg: any, newStatus: string) => {
    try {
      await adminApi.updateContactStatus(msg.id, newStatus);
      success(`Message marked as ${newStatus}`);
      loadMessages();
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleOpenReply = (msg: any) => {
    setSelectedMessage(msg);
    setReplySubject(`Re: ${msg.subject || 'Portfolio Inquiry'}`);
    setReplyBody(`Hi ${msg.name},\n\nThank you for reaching out via my portfolio website.\n\nBest regards,\nAmit Chauhan`);
    setReplyOpen(true);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;

    setReplyLoading(true);
    try {
      await adminApi.replyContactMessage(selectedMessage.id, {
        replyMessage: replyBody,
        replySubject,
      });
      success(`Reply successfully dispatched to ${selectedMessage.email}!`);
      setReplyOpen(false);
      loadMessages();
    } catch (err: any) {
      // Per security instruction: never show fake sent confirmation if email provider is unconfigured
      error(err.message || 'Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.deleteContactMessage(deleteTargetId);
      success('Message deleted permanently');
      setDeleteTargetId(null);
      if (selectedMessage?.id === deleteTargetId) {
        setSelectedMessage(null);
      }
      loadMessages();
    } catch (err: any) {
      error(err.message || 'Failed to delete message');
    }
  };

  // Filter messages by search term
  const filteredMessages = messages.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.message?.toLowerCase().includes(term) ||
      m.subject?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Contact Messages Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real incoming inquiries submitted via the public portfolio contact form.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>{unreadCount} Unread Inquiries</span>
          </div>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages by sender name, email, or message content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-space-900 border border-slate-800 focus:border-purple-500 text-xs sm:text-sm text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'UNREAD', 'READ', 'REPLIED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                statusFilter === st
                  ? 'bg-purple-600 text-white font-semibold shadow-glow-purple'
                  : 'bg-space-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Messages List (3 Columns on Large) */}
        <div className="lg:col-span-3 space-y-3">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
              <p className="text-xs font-mono text-slate-400">Loading Inquiries...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-space-900 border border-slate-800 text-slate-400 space-y-2">
              <Mail className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm">No messages match the current filter.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;

              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === 'UNREAD') {
                      toggleStatus(msg, 'READ');
                    }
                  }}
                  className={`p-5 rounded-2xl bg-space-900/80 border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-purple-500 shadow-glow-card'
                      : msg.status === 'UNREAD'
                      ? 'border-amber-500/40 bg-space-900'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{msg.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        msg.status === 'UNREAD'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          : msg.status === 'REPLIED'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : 'bg-space-950 text-slate-400 border-slate-800'
                      }`}>
                        {msg.status}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-purple-300/80">
                    {msg.email}
                  </p>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Message Reader (2 Columns on Large) */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="p-6 rounded-2xl bg-space-900/90 border border-slate-800 space-y-5 sticky top-24">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">{selectedMessage.name}</h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs font-mono text-purple-400 hover:underline block"
                  >
                    {selectedMessage.email}
                  </a>
                  <span className="text-[10px] font-mono text-slate-500">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedMessage.subject && (
                <div className="text-xs font-semibold text-slate-200">
                  Subject: <span className="text-white font-normal">{selectedMessage.subject}</span>
                </div>
              )}

              {/* Message Body */}
              <div className="p-4 rounded-xl bg-space-950 border border-slate-800/80 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto">
                {selectedMessage.message}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleOpenReply(selectedMessage)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-purple transition-all"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </button>

                {selectedMessage.status !== 'READ' && (
                  <button
                    onClick={() => toggleStatus(selectedMessage, 'READ')}
                    className="px-3 py-2 rounded-xl bg-space-950 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono"
                  >
                    Mark Read
                  </button>
                )}

                <button
                  onClick={() => setDeleteTargetId(selectedMessage.id)}
                  className="p-2 rounded-xl bg-space-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 ml-auto transition-colors"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center rounded-2xl bg-space-900/40 border border-dashed border-slate-800 text-slate-500 text-xs font-mono">
              Select an inquiry on the left to read full contents and dispatch replies.
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {replyOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-space-900 border border-purple-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Reply className="w-4 h-4 text-purple-400" />
                <span>Reply to {selectedMessage.name}</span>
              </div>
              <button onClick={() => setReplyOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Recipient Email</label>
                <input
                  type="text"
                  disabled
                  value={selectedMessage.email}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 text-xs text-slate-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Email Subject</label>
                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Reply Body</label>
                <textarea
                  rows={6}
                  required
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-xs text-white focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-950/25 border border-purple-500/30 flex items-start gap-2 text-[11px] text-purple-200">
                <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  Dispatches outgoing email through your configured SMTP mail server. If SMTP is not yet configured, the system cleanly reports missing credentials.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReplyOpen(false)}
                  className="px-4 py-2 rounded-xl bg-space-950 text-xs text-slate-300 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replyLoading}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs text-white font-medium shadow-glow-purple flex items-center gap-1.5"
                >
                  {replyLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reply</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Contact Inquiry?"
        message="Are you sure you want to permanently delete this inquiry record from PostgreSQL?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
