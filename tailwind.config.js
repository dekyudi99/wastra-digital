/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        wastra: {
          // Clean brown palette - professional tones
          'brown-50': '#FAF8F6',
          'brown-100': '#F5F1EB',
          'brown-200': '#E8E0D5',
          'brown-300': '#D4C4B0',
          'brown-400': '#B8A082',
          'brown-500': '#8B6F47',
          'brown-600': '#6B5438',
          'brown-700': '#4A3A26',
          'brown-800': '#2E2418',
          'brown-900': '#1A130D',
          // Purple for brand
          'purple-500': '#7C3AED',
          'purple-600': '#6D28D9',
          'purple-700': '#5B21B6',
          // Pink for accents
          'pink-500': '#EC4899',
          'pink-600': '#DB2777',
          // Legacy aliases
          gold: '#8B6F47',
          red: '#6B5438',
          blue: '#4A3A26',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true, // Disable Tailwind's base styles to avoid conflicts with Ant Design
  },
}

