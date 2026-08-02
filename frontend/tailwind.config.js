/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: 'var(--theme-bg)',
          card: 'var(--theme-card)',
          text: 'var(--theme-text)',
          muted: 'var(--theme-text-muted)',
          border: 'var(--theme-border)',
          'accent-start': 'var(--theme-accent-start)',
          'accent-end': 'var(--theme-accent-end)',
          'btn-bg': 'var(--theme-btn-bg)',
          'btn-text': 'var(--theme-btn-text)',
          'nav-bg': 'var(--theme-nav-bg)',
        },
        landing: {
          bg: 'rgb(var(--landing-bg) / <alpha-value>)',
          surface: 'rgb(var(--landing-surface) / <alpha-value>)',
          text: 'rgb(var(--landing-text) / <alpha-value>)',
          muted: 'rgb(var(--landing-muted) / <alpha-value>)',
          border: 'rgb(var(--landing-border) / <alpha-value>)',
          card: 'rgb(var(--landing-card) / <alpha-value>)',
          accent: 'rgb(var(--landing-accent) / <alpha-value>)',
        },
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
        display: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
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
