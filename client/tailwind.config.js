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
        espresso: '#2B1A12',
        'espresso-50': '#FAF6F0',
        'espresso-100': '#F5E9DD',
        'espresso-800': '#3D2519',
        'espresso-900': '#2B1A12',
        'espresso-950': '#1A0F0A',
        cocoa: '#3D2519',
        'cocoa-light': '#4A2F21',
        'cocoa-dark': '#2A180F',
        walnut: '#5A3A28',
        'walnut-light': '#6E4833',
        cream: '#FFF8F1',
        'cream-50': '#FFFAF5',
        'cream-100': '#FFF8F1',
        'cream-200': '#FDEEE0',
        sand: '#F5E9DD',
        'sand-50': '#FAF4ED',
        'sand-100': '#F5E9DD',
        'sand-200': '#E8D7C5',
        'sand-300': '#D5BEAA',
        orange: '#F97316',
        'orange-50': '#FFF7ED',
        'orange-100': '#FFEDD5',
        'orange-200': '#FED7AA',
        'orange-300': '#FDBA74',
        'orange-400': '#FB923C',
        'orange-500': '#F97316',
        'orange-600': '#EA580C',
        'orange-700': '#C2410C',
        'orange-dark': '#C2410C',
        bodyText: '#2B1A12',
        bodyMuted: '#5A3A28',
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
        'elevated': '0 16px 40px -6px rgba(43, 26, 18, 0.25), 0 4px 14px -2px rgba(43, 26, 18, 0.1)',
        'glow-orange': '0 0 32px -4px rgba(249, 115, 22, 0.45)',
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
