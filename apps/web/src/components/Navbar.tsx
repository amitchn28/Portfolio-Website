import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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

const MOBILE_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const isClickScrolling = useRef(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!isClickScrolling.current) {
            if (window.scrollY < 100) {
              setActiveSection('home');
            } else if (
              window.innerHeight + window.scrollY >=
              document.documentElement.scrollHeight - 60
            ) {
              setActiveSection('contact');
            } else {
              const viewportTarget = window.innerHeight * 0.35;
              let bestSection = 'home';
              let smallestDistance = Infinity;

              for (const item of NAV_ITEMS) {
                const el = document.getElementById(item.id);
                if (el) {
                  const rect = el.getBoundingClientRect();
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
    setActiveSection(id);
    isClickScrolling.current = true;

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  };

  return (
    <>
      {/* ================= DESKTOP NAVIGATION: Top Centered Floating Spring Pill ================= */}
      <header className="hidden sm:block fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
        <div className="flex justify-center pt-5 px-6 pointer-events-auto">
          <nav className="nav-pill rounded-full px-6 py-2 flex items-center justify-center gap-2 transition-all duration-300 shadow-2xl">
            <div className="flex items-center gap-1.5 relative">
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
                    {isActive && (
                      <motion.div
                        layoutId="activeNavTile"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className={`absolute inset-0 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} shadow-lg -z-10`}
                      >
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
      </header>

      {/* ================= MOBILE NAVIGATION: Bottom Floating Dock (Screen Ke Niche) ================= */}
      <div className="sm:hidden fixed bottom-5 inset-x-0 z-50 pointer-events-none flex justify-center px-4 pb-[env(safe-area-inset-bottom)]">
        <nav className="nav-pill pointer-events-auto rounded-full px-3 py-1.5 flex items-center justify-center gap-1 shadow-2xl shadow-black/90 border border-slate-700/80 bg-slate-950/90 backdrop-blur-xl">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 z-10 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileNavTile"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className={`absolute inset-0 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} shadow-lg -z-10`}
                  >
                    <span
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: theme.cursorColor,
                        boxShadow: `0 0 8px ${theme.cursorColor}`,
                      }}
                    />
                  </motion.div>
                )}
                <span className="relative z-10 flex items-center gap-1">
                  {item.id === 'home' && isActive && (
                    <span className="text-[10px] text-amber-400">✦</span>
                  )}
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
