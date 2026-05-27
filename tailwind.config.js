/** @type {import('tailwindcss').Config} */
// TAILWIND v4: Los tokens de diseño (fuentes, colores) se definen en src/assets/main.css
// dentro del bloque @theme. Este archivo solo define el contenido a escanear.
// Para cambiar fuentes o colores de la marca, editar ÚNICAMENTE main.css → @theme { ... }
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  plugins: [],
}
