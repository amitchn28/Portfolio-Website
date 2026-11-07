import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'profiles', label: 'Profiles' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);

          // If currently in a programmatic click-scroll, avoid overriding
          if (!isClickScrolling.current) {
            // Check top / bottom boundaries
            if (window.scrollY < 100) {
              setActiveSection('home');
            } else if (
              window.innerHeight + window.scrollY >=
              document.documentElement.scrollHeight - 60
            ) {
              setActiveSection('contact');
            } else {
              // Calculate which section is closest to viewport reading center (35% from top)
              const viewportTarget = window.innerHeight * 0.35;
              let bestSection = 'home';
              let smallestDistance = Infinity;

              for (const item of NAV_ITEMS) {
                const el = document.getElementById(item.id);
                if (el) {
                  const rect = el.getBoundingClientRect();
                  // Check if section is currently overlapping the reading zone
                  if (rect.top <= viewportTarget + 180 && rect.bottom >= viewportTarget - 60) {
                    const distance = Math.abs(rect.top - viewportTarget);
                    if (distance < smallestDistance) {
                      smallestDistance = distance;
                      bestSection = item.id;
                    }
                  }
                }
              }
              setActiveSection(bestSection);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    isClickScrolling.current = true;

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    // Release programmatic scroll lock after smooth scroll settles
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
      {/* Top ambient gradient mask: smoothly dissolves content on scroll */}
      <div
        className={`absolute inset-0 h-20 sm:h-24 bg-gradient-to-b from-[#020617] via-[#020617]/85 to-transparent pointer-events-none transition-opacity duration-300 ${
          isScrolled ? 'opacity-95 backdrop-blur-md' : 'opacity-0'
        }`}
      />

      {/* ================= MOBILE NAVIGATION: Corner Floating Minimal Menu Button ================= */}
      <div className="sm:hidden fixed top-4 right-4 z-50 pointer-events-auto">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-amber-500/35 hover:border-amber-400/60 text-slate-200 hover:text-white shadow-xl shadow-black/80 active:scale-95 transition-all duration-200 group ${
            mobileMenuOpen ? 'ring-2 ring-amber-500/40 bg-slate-900' : ''
          }`}
          aria-label="Toggle Navigation Menu"
        >
          {/* Glowing amber status dot matching avatar halo */}
          <span
            className="w-2 h-2 rounded-full animate-pulse shadow-sm"
            style={{
              backgroundColor: theme.cursorColor || '#f59e0b',
              boxShadow: `0 0 8px ${theme.cursorColor || '#f59e0b'}`,
            }}
          />
          <span className="text-xs font-semibold tracking-wide text-slate-200 group-hover:text-amber-300 font-mono">
            Menu
          </span>
          {mobileMenuOpen ? (
            <X className="w-3.5 h-3.5 text-amber-400 transition-transform duration-200" />
          ) : (
            <Menu className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* ================= DESKTOP NAVIGATION: Centered Floating Spring Pill ================= */}
      <div className="hidden sm:flex justify-center p-3 sm:p-5 pointer-events-auto">
        <nav className="nav-pill rounded-full px-6 py-2 flex items-center justify-center gap-2 transition-all duration-300 shadow-2xl">
          <div className="flex items-center gap-1 relative">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 z-10 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  {/* Gliding Active Pill Tile (Framer Motion Spring Physics) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTile"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className={`absolute inset-0 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} shadow-lg -z-10`}
                    >
                      {/* Active bottom glow bead */}
                      <span
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: theme.cursorColor,
                          boxShadow: `0 0 10px ${theme.cursorColor}`,
                        }}
                      />
                    </motion.div>
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* ================= MOBILE OVERLAY & DROPDOWN DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop blur click-away dismisser */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm pointer-events-auto"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Corner-aligned sleek floating navigation drawer */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="sm:hidden fixed top-16 right-4 w-60 bg-slate-950/95 backdrop-blur-2xl border border-amber-500/35 rounded-2xl p-3.5 shadow-2xl shadow-black/90 z-50 flex flex-col gap-1.5 pointer-events-auto"
            >
              <div className="flex items-center justify-between px-2 py-1 pb-2 border-b border-slate-800/80 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Sparkles className="w-3 h-3" /> Navigation
                </span>
                <span className="text-[10px] text-slate-500">
                  {NAV_ITEMS.findIndex((i) => i.id === activeSection) + 1} / {NAV_ITEMS.length}
                </span>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: theme.cursorColor || '#f59e0b',
                            boxShadow: `0 0 6px ${theme.cursorColor || '#f59e0b'}`,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
