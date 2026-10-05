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
        // Saffron / Turmeric Action Palette
        saffron: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#E57A1F', // Primary Saffron Action
          600: '#D46714',
          700: '#B8500D',
          800: '#943E0E',
          900: '#78330F',
          DEFAULT: '#E57A1F',
        },
        // Deep Masala Maroon Headings and Dark Sections
        maroon: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F9D1D9',
          300: '#F3AAB8',
          400: '#E8758D',
          500: '#D54466',
          600: '#BC2C4E',
          700: '#971F3B',
          800: '#681729',
          900: '#4A151B', // Deep Masala
          950: '#2E0A0E', // Darkest Masala Ink
          DEFAULT: '#4A151B',
        },
        // Warm Cream Backgrounds
        cream: {
          50: '#FDFBF7',
          100: '#F8F4EC',
          200: '#F1E9DB',
          300: '#E8DCB7',
          DEFAULT: '#F8F4EC',
        },
        // Soft Paper White Cards
        paper: {
          light: '#FFFFFF',
          DEFAULT: '#FCFBF9',
          muted: '#F6F3ED',
          dark: '#1C1518',
        },
        // Curry Leaf Green Success / Live status
        curry: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#1E7B4D', // Curry-leaf green
          600: '#15803D',
          700: '#166534',
          800: '#14532D',
          DEFAULT: '#1E7B4D',
        },
        // Thermal / Receipt Ink
        receipt: {
          ink: '#1A1817',
          faint: '#7A736E',
          divider: '#E4DDD3',
          yellow: '#FEF9C3',
          pink: '#FFE4E6',
          blue: '#E0F2FE',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Instrument Serif', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        hindi: ['Hind', 'Noto Sans Devanagari', 'sans-serif'],
        mono: ['Courier Prime', 'Space Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'receipt': '0 4px 20px -2px rgba(46, 10, 14, 0.08), 0 2px 6px -1px rgba(46, 10, 14, 0.04)',
        'receipt-lg': '0 12px 36px -4px rgba(46, 10, 14, 0.12), 0 4px 14px -2px rgba(46, 10, 14, 0.06)',
        'saffron-glow': '0 0 24px -2px rgba(229, 122, 31, 0.35)',
      },
      maxWidth: {
        'container': '1200px',
      },
      borderRadius: {
        'card': '18px',
      },
      keyframes: {
        'ticket-drop': {
          '0%': { transform: 'translateY(-30px) scale(0.96)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'ticket-drop': 'ticket-drop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'scroll-left': 'scroll-left 25s linear infinite',
      },
    },
  },
  plugins: [],
}
