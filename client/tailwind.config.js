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
        // Warm Coffee Mocha & Roasted Espresso Tokens (Replaces cold slate)
        ink: {
          DEFAULT: '#170C08',
          50: '#FAF6F0', // Soft warm cream surface
          100: '#F3EBE1', // Warm sand background
          200: '#E5D8CC', // Warm border
          300: '#CBB8A8',
          400: '#988170',
          500: '#6E5A4B',
          600: '#544336', // Warm deep mocha body text
          700: '#3E3025',
          800: '#2B1D15', // Dark mocha border
          900: '#1E120B', // Dark roasted surface
          950: '#140A06', // Pure deep espresso base
        },
        // Rich Orange & Spiced Ember Palette
        ember: {
          start: '#FF7A1A',
          end: '#D9480F',
          50: '#FFF8F1',
          100: '#FEEDDC',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF7A1A', // Radiant saffron orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          DEFAULT: '#FF7A1A',
        },
        // Earthy Spiced Browns
        brown: {
          50: '#FBF9F7',
          100: '#F5EFEB',
          200: '#E8DCD4',
          300: '#D4C1B3',
          400: '#A78672',
          500: '#7D5B46',
          600: '#5E402D',
          700: '#462E1F',
          800: '#311F15',
          900: '#22140D',
          950: '#170C08',
          DEFAULT: '#5E402D',
        },
        // Warm Cream / Linen
        cream: {
          50: '#FDFBF8',
          100: '#FAF6F0',
          200: '#F3EBE1',
          300: '#EADCCE',
          DEFAULT: '#FAF6F0',
        },
        // Secondary Warm Indigo
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
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
        'soft': '0 1px 3px 0 rgba(23, 12, 8, 0.06), 0 1px 2px -1px rgba(23, 12, 8, 0.04)',
        'card': '0 4px 16px -2px rgba(23, 12, 8, 0.08), 0 2px 6px -1px rgba(23, 12, 8, 0.04)',
        'elevated': '0 12px 32px -4px rgba(23, 12, 8, 0.12), 0 4px 12px -2px rgba(23, 12, 8, 0.06)',
        'glow-ember': '0 0 28px -2px rgba(255, 122, 26, 0.4)',
        'glow-brown': '0 0 28px -2px rgba(94, 64, 45, 0.3)',
      },
      maxWidth: {
        'container': '1200px',
      },
      borderRadius: {
        'card': '14px',
      },
      backgroundImage: {
        'gradient-ember': 'linear-gradient(135deg, #FF7A1A 0%, #D9480F 100%)',
        'gradient-ink-hero': 'radial-gradient(ellipse at top, rgba(255, 122, 26, 0.2) 0%, rgba(94, 64, 45, 0.12) 50%, transparent 80%)',
        'gradient-dark-band': 'linear-gradient(180deg, #170C08 0%, #26150E 100%)',
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
