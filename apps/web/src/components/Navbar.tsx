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

export const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const isClickScrolling = useRef(false);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Auto-scroll the active tab into view on mobile when user scrolls sections
  useEffect(() => {
    if (activeSection && itemRefs.current[activeSection]) {
      itemRefs.current[activeSection]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeSection]);

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

      <div className="relative flex justify-center p-2.5 sm:p-5 pointer-events-auto">
        <nav
          className="nav-pill rounded-full px-2 sm:px-6 py-1.5 sm:py-2 flex items-center justify-center max-w-[96vw] sm:max-w-none transition-all duration-300 shadow-2xl"
        >
          {/* Silky Gliding Interactive Tabs for both Mobile & Desktop */}
          <div className="flex items-center gap-1 sm:gap-1.5 relative overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-1 max-w-full">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-200 z-10 ${
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
    </header>
  );
};
