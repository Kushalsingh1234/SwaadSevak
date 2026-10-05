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
        // Espresso & Saffron System Tokens
        espresso: {
          DEFAULT: '#2B1A12', // Dark sections & headings
          50: '#FAF6F0',
          100: '#F5E9DD', // Sand
          800: '#3D2519', // Cocoa
          900: '#2B1A12', // Espresso main
          950: '#1A0F0A', // Darkest espresso
        },
        cocoa: {
          DEFAULT: '#3D2519', // Cards on dark
          light: '#4A2F21',
          dark: '#2A180F',
        },
        walnut: {
          DEFAULT: '#5A3A28', // Borders on dark
          light: '#6E4833',
        },
        cream: {
          DEFAULT: '#FFF8F1', // Light sections
          50: '#FFFAF5',
          100: '#FFF8F1',
          200: '#FDEEE0',
        },
        sand: {
          DEFAULT: '#F5E9DD',
          50: '#FAF4ED',
          100: '#F5E9DD',
          200: '#E8D7C5',
          300: '#D5BEAA',
        },
        orange: {
          DEFAULT: '#F97316', // Primary Action
          hover: '#EA580C',
          darkText: '#C2410C', // High-contrast orange text on white
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        bodyText: '#3D2519', // Rich dark brown for maximum contrast & crisp readability on light
        bodyMuted: '#6B5444', // Secondary muted text on light
        success: '#16A34A',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(43, 26, 18, 0.08), 0 1px 4px -1px rgba(43, 26, 18, 0.04)',
        'card': '0 8px 24px -4px rgba(43, 26, 18, 0.1), 0 2px 8px -2px rgba(43, 26, 18, 0.05)',
        'elevated': '0 16px 40px -6px rgba(43, 26, 18, 0.2), 0 4px 14px -2px rgba(43, 26, 18, 0.08)',
        'glow-orange': '0 0 32px -4px rgba(249, 115, 22, 0.4)',
        'glow-hero': '0 0 80px -10px rgba(249, 115, 22, 0.25)',
      },
      maxWidth: {
        'container': '1200px',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
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
        'float-slow': 'float-slow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'marquee': 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
}
