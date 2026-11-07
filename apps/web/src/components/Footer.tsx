import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-800/80 bg-space-950/80 backdrop-blur-md pt-14 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pb-10">
        {/* Brand & Tagline */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-base text-white tracking-wider">
              AMIT CHAUHAN
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Software Engineer &amp; AI Developer &bull; CS Student. Building intelligent systems, scalable web applications, and hybrid AI solutions.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
          <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
          <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
          <a href="#education" className="hover:text-cyan-400 transition-colors">Education</a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
          <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
          <a href="#profiles" className="hover:text-cyan-400 transition-colors">Profiles</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>

        {/* Social Icons & Back to Top */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/amit-chauhan-613833329"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-9 h-9 rounded-full bg-space-900 border border-slate-800 hover:border-cyan-500 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <a
            href="https://github.com/amitchn28"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-9 h-9 rounded-full bg-space-900 border border-slate-800 hover:border-emerald-500 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href="#contact"
            aria-label="Send a Message"
            className="w-9 h-9 rounded-full bg-space-900 border border-slate-800 hover:border-cyan-500 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>

          <button
            onClick={scrollToTop}
            aria-label="Scroll to Top"
            className="w-9 h-9 rounded-full bg-cyan-600/20 border border-cyan-500/30 hover:bg-cyan-600/40 flex items-center justify-center text-cyan-300 hover:text-white transition-colors ml-2"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div>
          &copy; {new Date().getFullYear()} Amit Chauhan. All rights reserved.
        </div>
        <div className="font-mono text-slate-500">
          Designed with React, TypeScript &amp; Tailwind CSS &bull; Localhost Portfolio
        </div>
      </div>
    </footer>
  );
};
