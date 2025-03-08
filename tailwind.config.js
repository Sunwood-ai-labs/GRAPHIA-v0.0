/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F2D22E',
        secondary: '#F2A922',
        accent: '#F27F1B',
        warning: '#F26A1B',
        dark: '#59200B',
      },
      fontFamily: {
        kaisei: ['Kaisei Decol', 'serif'],
        yomogi: ['Yomogi', 'cursive'],
        zen: ['Zen Kurenaido', 'sans-serif'],
      },
      maxWidth: {
        '12xl': '160rem',
      },
    },
  },
  plugins: [],
};