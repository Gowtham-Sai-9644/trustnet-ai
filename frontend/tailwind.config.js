/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#050811',
          surface: '#0B1220',
          card: '#111827',
          border: '#1E293B',
          accent: '#00E5FF',
          cyan: '#00E5FF',
          emerald: '#22C55E',
          amber: '#F59E0B',
          crimson: '#EF4444',
          muted: '#94A3B8',
          panel: '#0B1220'
        }
      },
      fontFamily: {
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        saas: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'saas-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px'
      }
    },
  },
  plugins: [],
}
