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
          bg: '#070B14',
          surface: '#0F172A',
          card: '#111827',
          border: '#1E293B',
          accent: '#06B6D4',
          cyan: '#06B6D4',
          emerald: '#22C55E',
          amber: '#F59E0B',
          crimson: '#EF4444',
          muted: '#94A3B8',
          panel: '#0F172A'
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
