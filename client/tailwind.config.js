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
          50: '#fff8ed',
          100: '#ffefd5',
          200: '#fed7aa',
          300: '#fdb06a',
          400: '#f97316', // Vibrant Saffron / Warm Orange
          500: '#ea580c',
          600: '#c2410c',
          700: '#9a3412',
          800: '#7c2d12',
          900: '#431407',
          DEFAULT: '#ea580c',
        },
        spice: {
          green: '#15803d', // Pure Veg indicator
          red: '#b91c1c',   // Non-veg indicator
          gold: '#d97706',
          dark: '#0f172a',
          surface: '#f8fafc',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 8px 16px -4px rgba(15, 23, 42, 0.04)',
        'elevated': '0 12px 32px -8px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
        'glow': '0 0 25px -5px rgba(234, 88, 12, 0.35)',
      }
    },
  },
  plugins: [],
}
