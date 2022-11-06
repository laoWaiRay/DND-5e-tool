/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        hideScroll: {
          '0%, 100%': { overflow: 'hidden' },
        }
      },
      animation: {
        'spin-fast': 'spin 1s ease-in-out infinite',
        hideScroll: 'hideScroll 1.2s backwards'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
