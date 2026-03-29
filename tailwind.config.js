/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000', // Tu negro profundo
        'brand-white': '#FFFFFF', // Blanco puro
        'brand-gold': '#B89B6A',  // El dorado de las esmeraldas
      },
      fontFamily: {
        'serif-elegant': ['Playfair Display', 'serif'], // Si usas alguna fuente especial
        'sans-luxury': ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}