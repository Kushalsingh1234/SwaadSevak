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
        // Ink & Ember Design Tokens
        ink: {
          DEFAULT: '#0B1220',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569', // Body text
          700: '#334155',
          800: '#1E293B', // Dark border
          900: '#111A2E', // Dark surface
          950: '#0B1220', // Pure Ink Base
        },
        // Ember Orange Action Palette
        ember: {
          start: '#FF7A1A',
          end: '#F04E23',
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#FF7A1A',
          600: '#F04E23',
          700: '#C2410C',
          DEFAULT: '#FF7A1A',
        },
        // Secondary Indigo
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          400: '#818CF8', // Dark mode accent
          500: '#6366F1',
          600: '#4F46E5', // Product UI accent
          700: '#4338CA',
          DEFAULT: '#4F46E5',
        },
        // Functional System Colors
        success: {
          50: '#F0FDF4',
          500: '#22C55E',
          600: '#16A34A',
          DEFAULT: '#16A34A',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          DEFAULT: '#F59E0B',
        },
        danger: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
          DEFAULT: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(11, 18, 32, 0.05), 0 1px 2px -1px rgba(11, 18, 32, 0.03)',
        'card': '0 4px 16px -2px rgba(11, 18, 32, 0.06), 0 2px 6px -1px rgba(11, 18, 32, 0.03)',
        'elevated': '0 12px 32px -4px rgba(11, 18, 32, 0.08), 0 4px 12px -2px rgba(11, 18, 32, 0.04)',
        'glow-ember': '0 0 28px -4px rgba(255, 122, 26, 0.35)',
        'glow-indigo': '0 0 28px -4px rgba(79, 70, 229, 0.25)',
      },
      maxWidth: {
        'container': '1200px',
      },
      borderRadius: {
        'card': '14px',
      },
      backgroundImage: {
        'gradient-ember': 'linear-gradient(135deg, #FF7A1A 0%, #F04E23 100%)',
        'gradient-ink-hero': 'radial-gradient(ellipse at top, rgba(255, 122, 26, 0.12) 0%, rgba(79, 70, 229, 0.08) 50%, transparent 80%)',
        'gradient-dark-band': 'linear-gradient(180deg, #0B1220 0%, #111A2E 100%)',
      },
      keyframes: {
        'order-drop': {
          '0%': { transform: 'translateY(-16px) scale(0.97)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'order-drop': 'order-drop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2.5s infinite',
        'marquee': 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}
