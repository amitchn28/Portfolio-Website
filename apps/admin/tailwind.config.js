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
          950: '#060a12', // deep marine oceanic void
          900: '#0a101d', // coastal twilight charcoal
          850: '#10192a', // deep Arabian sea slate
          800: '#172338', // steel twilight border/card
          700: '#23344e', // coastal ridge hover
        },
        cyber: {
          amber: '#e2b17a',
          slate: '#385472',
          mist: '#8fa5be',
          purple: '#a855f7',
          violet: '#8b5cf6',
          fuchsia: '#d946ef',
          cyan: '#06b6d4',
          emerald: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        cyber: ['Syne', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-amber': '0 0 25px -5px rgba(226, 177, 122, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(226, 177, 122, 0.35)', // map legacy glow-purple to warm amber glow
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45), 0 0 20px -3px rgba(226, 177, 122, 0.15)',
      },
    },
  },
  plugins: [],
};
