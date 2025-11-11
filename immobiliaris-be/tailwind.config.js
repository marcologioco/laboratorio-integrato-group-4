/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/main/resources/static/**/*.{html,js}", 
  ],
  theme: {
    extend: {
      colors: {
        // La tua palette personalizzata
        'my-green-dark': '#274239', // Verde Scuro (Per testo, sfondo CTA e dettagli)
        'my-green-light': '#809074', // Verde Chiaro (Per sfondi secondari o barra del prezzo)
        'my-black-dark': '#111A19', // Nero (Per testo principale o elementi scuri)
        'my-orange': '#BA6830', // Arancione (Per accenti e frecce del carosello)
        'my-cream': '#F9F2E8', // Crema (Per sfondi molto chiari)
      },
      fontFamily: {
        'cinzel-decorative': ['Cinzel Decorative', 'serif'],
        'cinzel': ['Cinzel', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}