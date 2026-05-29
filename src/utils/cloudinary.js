/**
 * Aplica transformaciones de Cloudinary para reducir el peso de las imágenes
 * y servir el formato óptimo según el navegador (WebP / AVIF automático).
 *
 * Reduce los JPEGs originales (2-5 MB) hasta un 80-90% dependiendo del dispositivo.
 *
 * @param {string} url        - URL original de Cloudinary
 * @param {object} [options]
 * @param {number} [options.width=800]            - Ancho máximo en px
 * @param {string} [options.quality='auto:good']  - Calidad (auto:eco | auto:good | auto:best)
 */
export function cloudinaryOptimize(url, { width = 800, quality = 'auto:good' } = {}) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  // Inserta las transformaciones justo después de /upload/ sin alterar la ruta del asset
  return url.replace('/upload/', `/upload/f_auto,q_${quality},w_${width}/`);
}
