import fs from 'fs';

// Ajusta estas constantes a tu entorno
const API_URL = 'https://api.cushionjewelry.com/api/products'; // La URL real de tu backend
const DOMAIN = 'https://cushionjewelry.com'; // El dominio de tu joyería

async function generateSitemap() {
  console.log('🔄 Extrayendo inventario de joyas desde la base de datos...');
  
  try {
    // Llamamos a tu API para traer los 141+ productos
    const response = await fetch(API_URL);
    const products = await response.json();

    // Empezamos a armar el XML con las rutas estáticas
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/coleccion</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${DOMAIN}/buscar</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // Recorremos cada joya y la inyectamos en el sitemap
    products.forEach((product) => {
      // Validamos que la joya tenga el slug antes de agregarla
      if(product.slug) {
        xml += `
  <url>
    <loc>${DOMAIN}/producto/${product.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    });

    xml += `\n</urlset>`;

    fs.writeFileSync('./public/sitemap.xml', xml, 'utf8');
    console.log(`✅ Sitemap generado exitosamente con ${products.length} productos.`);
    
  } catch (error) {
    console.error('❌ Error al generar el sitemap:', error);
  }
}

generateSitemap();