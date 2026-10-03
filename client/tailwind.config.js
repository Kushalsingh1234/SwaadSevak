/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f25c05', // Core Swaad Sevak Warm Saffron
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: '#f25c05',
        },
        ink: {
          900: '#0b1020', // Deep ink dark surfaces
          800: '#0f172a', // Primary ink text
          700: '#1e293b',
          600: '#334155',
          500: '#64748b', // Muted text
          400: '#94a3b8', // Subtle text & borders
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        surface: {
          bg: '#fafaf9',      // Warm stone/slate page background
          card: '#ffffff',    // Clean white surface
          elevated: '#ffffff',
          dark: '#0b1020',    // Sidebar & dark showcase cards
          'dark-card': '#131a2e',
        },
        status: {
          incoming: {
            bg: '#fef3c7',
            text: '#92400e',
            border: '#fde68a',
            dot: '#f59e0b',
          },
          cooking: {
            bg: '#dbeafe',
            text: '#1e40af',
            border: '#bfdbfe',
            dot: '#3b82f6',
          },
          ready: {
            bg: '#d1fae5',
            text: '#065f46',
            border: '#a7f3d0',
            dot: '#10b981',
          },
          settled: {
            bg: '#f1f5f9',
            text: '#475569',
            border: '#e2e8f0',
            dot: '#94a3b8',
          },
          alert: {
            bg: '#fee2e2',
            text: '#991b1b',
            border: '#fecaca',
            dot: '#ef4444',
          }
        },
        spice: {
          green: '#15803d', // Pure Veg indicator
          red: '#b91c1c',   // Non-veg indicator
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'elevated': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'dropdown': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'glow-brand': '0 0 24px -4px rgba(242, 92, 5, 0.25)',
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
  plugins: [],
}
