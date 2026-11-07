/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#020617',
          900: '#050b18',
          850: '#091326',
          800: '#0e1c36',
          700: '#172b4f',
        },
        cyber: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          emerald: '#10b981',
          sky: '#38bdf8',
          indigo: '#6366f1',
          amber: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        tech: ['Space Grotesk', 'sans-serif'],
        cyber: ['Space Grotesk', 'sans-serif'],
        pixel: ['Space Grotesk', 'JetBrains Mono', 'sans-serif'],
        role: ['Orbitron', 'Syne', 'Space Grotesk', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.4)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.4)',
        'glow-card': '0 10px 30px -5px rgba(2, 6, 23, 0.8), 0 0 20px -3px rgba(6, 182, 212, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
