/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design Token mappings (Saffron Cream default with CSS variable support)
        theme: {
          bg: 'var(--bg)',
          'bg-alt': 'var(--bg-alt)',
          surface: 'var(--surface)',
          ink: 'var(--ink)',
          muted: 'var(--muted)',
          brand: 'var(--brand)',
          'brand-deep': 'var(--brand-deep)',
          turmeric: 'var(--turmeric)',
          cardamom: 'var(--cardamom)',
          masala: 'var(--masala)',
          line: 'var(--line)',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f25c05', // Core Swaad Sevak Warm Saffron
          600: '#ea580c',
          700: '#c2410c', // Brand Deep
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: '#f25c05',
        },
        masala: {
          DEFAULT: '#1B1226',
          950: '#140c1d',
          900: '#1B1226', // Deep aubergine-black
          800: '#261b36',
          700: '#38284f',
        },
        cardamom: {
          DEFAULT: '#1F7A5C',
          50: '#e8f5f0',
          100: '#cbe7dd',
          500: '#1F7A5C',
          600: '#19634a',
          700: '#124c39',
        },
        turmeric: {
          DEFAULT: '#F5B83D',
          50: '#fef9ee',
          100: '#fdf1d3',
          500: '#F5B83D',
          600: '#e09e24',
        },
        espresso: {
          DEFAULT: '#2B1A12',
          950: '#140c08',
          900: '#1B120C',
          800: '#251A12',
          700: '#2B1A12',
          600: '#3D281C',
        },
        sand: {
          50: '#FAF8F5',
          100: '#FAF4ED',
          200: '#E5D7CA',
          300: '#D5C3B2',
          400: '#B8A796',
          500: '#9E8D7C',
        },
        walnut: {
          DEFAULT: '#3D281C',
          light: '#4E3525',
          dark: '#251A12',
        },
        cocoa: {
          DEFAULT: '#3D281C',
          light: '#4E3525',
          dark: '#2B1A12',
        },
        status: {
          incoming: {
            bg: '#fef3c7',
            text: '#92400e',
            border: '#fde68a',
            dot: '#f5b83d', // Turmeric dot
          },
          cooking: {
            bg: '#eef2ff',
            text: '#3730a3',
            border: '#c7d2fe',
            dot: '#4f46e5',
          },
          ready: {
            bg: '#e8f5f0',
            text: '#1f7a5c', // Cardamom text
            border: '#b7e2d3',
            dot: '#1f7a5c',
          },
          settled: {
            bg: '#f5f2ef',
            text: '#6b5b52', // Muted warm
            border: '#e8e1dc',
            dot: '#9e9087',
          },
          alert: {
            bg: '#fee2e2',
            text: '#991b1b',
            border: '#fecaca',
            dot: '#dc2626',
          }
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(30, 20, 16, 0.04)',
        'card': '0 2px 8px -2px rgba(30, 20, 16, 0.06), 0 1px 4px -1px rgba(30, 20, 16, 0.04)',
        'elevated': '0 8px 24px -4px rgba(30, 20, 16, 0.08), 0 4px 12px -2px rgba(30, 20, 16, 0.05)',
        'dropdown': '0 12px 32px -4px rgba(30, 20, 16, 0.12)',
        'glow-brand': '0 0 24px -4px rgba(242, 92, 5, 0.28)',
      },
      borderRadius: {
        'card': '14px',
      }
    },
  },
  plugins: [],
}
