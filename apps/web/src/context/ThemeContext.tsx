import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { portfolioApi } from '../services/api';

export interface ThemeConfig {
  id: string;
  name: string;
  tagline: string;
  canvasOrbs: {
    orb1: string;
    orb2: string;
    orb3: string;
  };
  primaryGradient: string;
  accentGradient: string;
  accentText: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  cursorColor: string;
  cursorRing: string;
  cardBorderHover: string;
  cardGlow: string;
  cardTopLine: string;
  headerAccent: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  'mumbai-twilight': {
    id: 'mumbai-twilight',
    name: 'Coastal Twilight (Profile Blend)',
    tagline: 'Deep Ocean Slate, Coastal Skyline Mist & Warm Sunset Amber',
    canvasOrbs: {
      orb1: '#e2b17a', // Warm Sunset Amber Haze (from cloud golden break)
      orb2: '#385472', // Arabian Sea Slate Blue (from coastal water)
      orb3: '#8fa5be', // Muted Marine Mist (from distant skyline)
    },
    primaryGradient: 'from-amber-200 via-sky-100 to-amber-300',
    accentGradient: 'from-amber-500 via-orange-400 to-sky-600',
    accentText: 'text-amber-300',
    badgeBg: 'bg-slate-900/80',
    badgeBorder: 'border-amber-400/40',
    badgeText: 'text-amber-200',
    cursorColor: '#e2b17a',
    cursorRing: '#5b7a9c',
    cardBorderHover: 'hover:border-amber-400/50',
    cardGlow: 'shadow-[0_0_35px_rgba(226,177,122,0.18)]',
    cardTopLine: 'from-amber-400 via-sky-400 to-amber-300',
    headerAccent: 'text-amber-300',
  },
  'cyber-dark': {
    id: 'cyber-dark',
    name: 'Quantum Neon',
    tagline: 'Vivid Cyberpunk & Electric Violet Aura',
    canvasOrbs: {
      orb1: '#d946ef', // Hot Magenta
      orb2: '#8b5cf6', // Electric Violet
      orb3: '#06b6d4', // Neon Cyan
    },
    primaryGradient: 'from-fuchsia-400 via-purple-300 to-cyan-300',
    accentGradient: 'from-purple-500 to-pink-500',
    accentText: 'text-purple-400',
    badgeBg: 'bg-purple-950/50',
    badgeBorder: 'border-purple-500/40',
    badgeText: 'text-purple-300',
    cursorColor: '#d946ef',
    cursorRing: '#8b5cf6',
    cardBorderHover: 'hover:border-purple-500/60',
    cardGlow: 'shadow-[0_0_35px_rgba(168,85,247,0.22)]',
    cardTopLine: 'from-fuchsia-500 via-purple-500 to-cyan-400',
    headerAccent: 'text-fuchsia-400',
  },
  'vibrant-aurora': {
    id: 'vibrant-aurora',
    name: 'Vibrant Aurora',
    tagline: 'Luminous Cyan, Teal & Emerald Borealis',
    canvasOrbs: {
      orb1: '#22d3ee', // Bright Cyan
      orb2: '#10b981', // Radiant Emerald
      orb3: '#818cf8', // Electric Indigo
    },
    primaryGradient: 'from-cyan-300 via-teal-200 to-emerald-300',
    accentGradient: 'from-cyan-500 to-emerald-500',
    accentText: 'text-cyan-400',
    badgeBg: 'bg-cyan-950/50',
    badgeBorder: 'border-cyan-500/40',
    badgeText: 'text-cyan-300',
    cursorColor: '#22d3ee',
    cursorRing: '#34d399',
    cardBorderHover: 'hover:border-cyan-500/60',
    cardGlow: 'shadow-[0_0_35px_rgba(6,182,212,0.22)]',
    cardTopLine: 'from-cyan-400 via-teal-400 to-emerald-400',
    headerAccent: 'text-cyan-400',
  },
  'sunset-blaze': {
    id: 'sunset-blaze',
    name: 'Sunset Blaze',
    tagline: 'Warm Solar Amber, Coral Rose & Golden Flare',
    canvasOrbs: {
      orb1: '#f97316', // Solar Orange
      orb2: '#f43f5e', // Crimson Rose
      orb3: '#fbbf24', // Amber Gold
    },
    primaryGradient: 'from-amber-300 via-orange-300 to-rose-400',
    accentGradient: 'from-orange-500 to-rose-500',
    accentText: 'text-orange-400',
    badgeBg: 'bg-orange-950/50',
    badgeBorder: 'border-orange-500/40',
    badgeText: 'text-orange-300',
    cursorColor: '#f97316',
    cursorRing: '#fbbf24',
    cardBorderHover: 'hover:border-orange-500/60',
    cardGlow: 'shadow-[0_0_35px_rgba(249,115,22,0.22)]',
    cardTopLine: 'from-amber-400 via-orange-500 to-rose-500',
    headerAccent: 'text-orange-400',
  },
  'sapphire-glow': {
    id: 'sapphire-glow',
    name: 'Electric Sapphire',
    tagline: 'High-Tech Royal Blue, Azure & Ice Cyan',
    canvasOrbs: {
      orb1: '#3b82f6', // Electric Royal Blue
      orb2: '#38bdf8', // Ice Cyan
      orb3: '#6366f1', // Neon Indigo
    },
    primaryGradient: 'from-blue-300 via-sky-300 to-indigo-300',
    accentGradient: 'from-blue-500 to-cyan-500',
    accentText: 'text-sky-400',
    badgeBg: 'bg-blue-950/50',
    badgeBorder: 'border-blue-500/40',
    badgeText: 'text-sky-300',
    cursorColor: '#38bdf8',
    cursorRing: '#3b82f6',
    cardBorderHover: 'hover:border-blue-500/60',
    cardGlow: 'shadow-[0_0_35px_rgba(59,130,246,0.22)]',
    cardTopLine: 'from-blue-500 via-sky-400 to-indigo-400',
    headerAccent: 'text-sky-400',
  },
  'emerald-matrix': {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    tagline: 'Bio-Tech Luminous Jade, Mint & Golden Lime',
    canvasOrbs: {
      orb1: '#10b981', // Matrix Emerald
      orb2: '#06b6d4', // Cyan
      orb3: '#84cc16', // Neon Lime
    },
    primaryGradient: 'from-emerald-300 via-teal-200 to-lime-300',
    accentGradient: 'from-emerald-500 to-teal-500',
    accentText: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/50',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300',
    cursorColor: '#10b981',
    cursorRing: '#84cc16',
    cardBorderHover: 'hover:border-emerald-500/60',
    cardGlow: 'shadow-[0_0_35px_rgba(16,185,129,0.22)]',
    cardTopLine: 'from-emerald-400 via-teal-400 to-lime-400',
    headerAccent: 'text-emerald-400',
  },
  'dark': {
    id: 'dark',
    name: 'Cyber Space Minimal',
    tagline: 'Classic Minimalist Cyber Violet & Cyan',
    canvasOrbs: {
      orb1: '#6366f1',
      orb2: '#06b6d4',
      orb3: '#a855f7',
    },
    primaryGradient: 'from-cyan-300 via-indigo-300 to-purple-300',
    accentGradient: 'from-cyan-500 to-purple-600',
    accentText: 'text-cyan-400',
    badgeBg: 'bg-slate-900/60',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-300',
    cursorColor: '#06b6d4',
    cursorRing: '#a855f7',
    cardBorderHover: 'hover:border-cyan-500/50',
    cardGlow: 'shadow-[0_0_35px_rgba(99,102,241,0.2)]',
    cardTopLine: 'from-cyan-500 via-indigo-500 to-purple-500',
    headerAccent: 'text-cyan-400',
  },
};

interface ThemeContextType {
  theme: ThemeConfig;
  setThemeById: (id: string) => void;
  fontMode: 'modern' | 'pixel';
  setFontMode: (mode: 'modern' | 'pixel') => void;
  fontChoice: string;
  setFontChoice: (choice: string) => void;
  siteSettings: any;
  refreshSettings: () => Promise<void>;
}

const getInitialTheme = (): string => {
  try {
    const cached = localStorage.getItem('amit_site_theme');
    if (cached && THEMES[cached]) return cached;
  } catch {}
  return 'sapphire-glow'; // Matches active production theme to eliminate initial flicker
};

const getInitialFontMode = (): 'modern' | 'pixel' => {
  try {
    const cached = localStorage.getItem('amit_font_mode');
    if (cached === 'pixel' || cached === 'modern') return cached;
  } catch {}
  return 'modern';
};

const getInitialFontChoice = (): string => {
  try {
    const cached = localStorage.getItem('amit_font_choice');
    if (cached) return cached;
  } catch {}
  return 'outfit';
};

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES['sapphire-glow'],
  setThemeById: () => {},
  fontMode: 'modern',
  setFontMode: () => {},
  fontChoice: 'outfit',
  setFontChoice: () => {},
  siteSettings: null,
  refreshSettings: async () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<string>(getInitialTheme);
  const [fontMode, setFontMode] = useState<'modern' | 'pixel'>(getInitialFontMode);
  const [fontChoice, setFontChoice] = useState<string>(getInitialFontChoice);
  const [siteSettings, setSiteSettings] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('amit_cached_settings');
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });

  // Keep document attributes and localStorage in immediate sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    document.documentElement.setAttribute('data-font-mode', fontMode);
    document.documentElement.setAttribute('data-font-choice', fontChoice);
    try {
      localStorage.setItem('amit_site_theme', themeId);
      localStorage.setItem('amit_font_mode', fontMode);
      localStorage.setItem('amit_font_choice', fontChoice);
    } catch {}
  }, [themeId, fontMode, fontChoice]);

  const refreshSettings = async () => {
    try {
      const data = await portfolioApi.getSettings();
      if (data?.website) {
        setSiteSettings(data.website);
        try {
          localStorage.setItem('amit_cached_settings', JSON.stringify(data.website));
        } catch {}

        const rawTheme = data.website.theme || 'sapphire-glow';
        let targetTheme = 'sapphire-glow';
        let targetFontMode: 'modern' | 'pixel' = 'modern';
        let targetFontChoice = 'outfit';

        if (rawTheme.includes('::')) {
          const parts = rawTheme.split('::');
          targetTheme = parts[0] || 'sapphire-glow';
          for (let i = 1; i < parts.length; i++) {
            const p = parts[i];
            if (p.startsWith('font:')) {
              targetFontChoice = p.replace('font:', '');
            } else if (p === 'pixel' || p === 'modern') {
              targetFontMode = p;
            }
          }
        } else {
          targetTheme = rawTheme;
        }

        if (THEMES[targetTheme]) {
          setThemeId(targetTheme);
          try {
            localStorage.setItem('amit_site_theme', targetTheme);
          } catch {}
        }

        setFontMode(targetFontMode);
        setFontChoice(targetFontChoice);
        try {
          localStorage.setItem('amit_font_mode', targetFontMode);
          localStorage.setItem('amit_font_choice', targetFontChoice);
        } catch {}
      }
    } catch {
      // Fallback preserves initial synchronous state
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const currentTheme = THEMES[themeId] || THEMES['sapphire-glow'];

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setThemeById: (id: string) => {
          if (THEMES[id]) {
            setThemeId(id);
            try {
              localStorage.setItem('amit_site_theme', id);
            } catch {}
          }
        },
        fontMode,
        setFontMode: (mode: 'modern' | 'pixel') => {
          setFontMode(mode);
          try {
            localStorage.setItem('amit_font_mode', mode);
          } catch {}
        },
        fontChoice,
        setFontChoice: (choice: string) => {
          setFontChoice(choice);
          try {
            localStorage.setItem('amit_font_choice', choice);
          } catch {}
        },
        siteSettings,
        refreshSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

