/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        liga1: {
          red: '#C8102E',
          gold: '#D4AF37',
          dark: '#0F172A',
          card: '#1E293B'
        }
      }
    },
  },
  plugins: [],
}
