import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { portfolioApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export const Contact: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMsg('Please enter a message of at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      await portfolioApi.submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });

      // Record telemetry in PostgreSQL
      portfolioApi.recordEvent('CONTACT_SUBMISSION', 'portfolio_form');

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto relative scroll-mt-28">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} mb-3`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
          <span className={`font-tech text-xs font-semibold ${theme.badgeText} tracking-wider uppercase`}>
            CONTACT // INBOX
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading tracking-tight">
          Get In Touch &bull; <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.primaryGradient}`}>Let's Connect</span>
        </h2>
        <div className={`h-0.5 w-16 bg-gradient-to-r ${theme.cardTopLine} rounded-full mx-auto mt-3`}></div>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto mt-3 font-sans leading-relaxed">
          Ready to collaborate or discuss an opportunity?<br />
          I'm always open to discussing new projects, research ideas, and tech challenges.
        </p>
      </motion.div>

      {/* Contact Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={`relative rounded-3xl p-8 sm:p-12 bg-space-900/90 border border-slate-800/80 ${theme.cardGlow} max-w-2xl mx-auto overflow-hidden`}
      >
        {/* Top Glowing Gradient Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${theme.cardTopLine}`}></div>

        {/* Ambient Subtle Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none"></div>

        {success ? (
          <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Message Transmitted!</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              Thank you for reaching out, Amit will review your inquiry and respond directly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 px-6 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 flex items-center gap-2.5 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="relative group">
              <div className="flex items-center border-b border-slate-800 group-focus-within:border-cyan-400 transition-colors py-2.5">
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                  required
                />
                <User className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors shrink-0 ml-2" />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <div className="flex items-center border-b border-slate-800 group-focus-within:border-cyan-400 transition-colors py-2.5">
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors shrink-0 ml-2" />
              </div>
            </div>

            {/* Message Input */}
            <div className="relative group">
              <div className="flex items-start border-b border-slate-800 group-focus-within:border-cyan-400 transition-colors py-2.5">
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none resize-none"
                  required
                />
                <MessageSquare className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors shrink-0 mt-1 ml-2" />
              </div>
            </div>

            {/* Send Message Capsule Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-full bg-gradient-to-r ${theme.accentGradient} text-white font-cyber font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>TRANSMITTING...</span>
                  </>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <Send className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </section>
  );
};
