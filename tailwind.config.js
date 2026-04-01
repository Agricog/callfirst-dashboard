/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#f0f4f8', 100: '#d9e2ec', 200: '#bcccdc', 700: '#1B2E4A', 800: '#142236', 900: '#0B1121' },
        action: { DEFAULT: '#FF6B35', dark: '#e55a25' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
