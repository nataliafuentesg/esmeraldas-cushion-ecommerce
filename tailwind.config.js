/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    // Dejamos extend vacío, moveremos todo al CSS Global (Paso 4)
    extend: {}, 
  },
  plugins: [],
};