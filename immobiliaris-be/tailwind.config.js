/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.js",
    "./src/main/resources/static/**/*.{html,js}", 
  ],
  safelist: [
    'text-my-green-dark',
    'text-my-green-light',
    'text-my-black-dark',
    'text-my-orange',
    'text-my-cream'
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        cinzel: ["Cinzel", "serif"],
        'cinzel-decorative': ["Cinzel Decorative", "Cinzel", "serif"],
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
