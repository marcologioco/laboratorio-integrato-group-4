/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.js",
    "./src/main/resources/static/**/*.{html,js}",
  
    "./**/*.html" 
  ],
  safelist: [
    'text-my-green-dark',
    'text-my-green-light',
    'text-my-black-dark',
    'text-my-orange',
    'text-my-cream',
    'bg-my-green-dark',
    'bg-my-green-light',
    'bg-my-black-dark',
    'bg-my-orange',
    'bg-my-cream',
  ],
  theme: {
    extend: {
      fontFamily: {
        'cinzel-dec': ['"Cinzel Decorative"', 'cursive'],
        'cinzel': ['"Cinzel"', 'serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
      
      colors: {
        'my-green-dark': '#274239',
        'my-green-light': '#809074',
        'my-black-dark': '#111A19',
        'my-orange': '#BA6830',
        'my-cream': '#F9F2E8',
      },
    },
  },
  plugins: [],
}