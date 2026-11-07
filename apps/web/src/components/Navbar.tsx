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
      {/* Ambient top gradient mask & soft blur: smoothly dissolves content passing under the navbar */}
      <div
        className={`absolute inset-0 h-20 sm:h-24 bg-gradient-to-b from-[#020617] via-[#020617]/85 to-transparent pointer-events-none transition-opacity duration-300 ${
          isScrolled ? 'opacity-95 backdrop-blur-md' : 'opacity-0'
        }`}
      />

      <div className="relative flex justify-center p-3 sm:p-5 pointer-events-auto">
        <nav
          className="nav-pill rounded-full px-4 sm:px-6 py-2 flex items-center justify-between sm:justify-center gap-1 sm:gap-2 transition-all duration-300 shadow-2xl"
        >
          {/* Mobile Brand / Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: theme.cursorColor }}
            />
            <span className={`text-xs font-semibold tracking-wider font-cyber ${theme.accentText}`}>
              AMIT CHAUHAN
            </span>
          </div>

          {/* Desktop Nav Items with Silky Spring Gliding Tile */}
          <div className="hidden sm:flex items-center gap-1 relative">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 rounded-full text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/50 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden fixed inset-x-4 top-20 bg-space-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 shadow-2xl z-50 flex flex-col gap-2 pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Navigation
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Portfolio</span>
            </div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeSection === item.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border-l-2 border-cyan-400'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
