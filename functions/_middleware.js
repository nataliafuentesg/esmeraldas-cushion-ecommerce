/**
 * Cloudflare Pages Function (middleware) — OG tags para compartir en redes.
 *
 * Problema:
 *   El sitio es una SPA (Vue). Los rastreadores de WhatsApp/Facebook/Twitter NO
 *   ejecutan JavaScript, así que al compartir un link de producto solo ven el
 *   index.html genérico (OG del home) → aparece el home en vez de la joya.
 *
 * Solución:
 *   Esta función corre en el edge de Cloudflare ANTES de servir el sitio.
 *   Para peticiones a /producto/* que vienen de un BOT, busca el producto en la
 *   API y devuelve HTML con los OG tags correctos (foto + nombre + descripción).
 *   Los usuarios reales pasan directo a la SPA normal (context.next()).
 *
 * Se despliega solo:
 *   Cloudflare Pages detecta la carpeta /functions automáticamente en el próximo
 *   deploy. No hay que configurar rutas ni nada manual.
 *
 * Verificar después de desplegar:
 *   https://developers.facebook.com/tools/debug/  → pega el link de un producto
 *   (si dice datos viejos, usa "Scrape Again" para refrescar la caché de Meta)
 */

const API = 'https://api.cushionjewelry.com/api';

// Rastreadores que generan la vista previa al compartir un link
const BOT_UA = /facebookexternalhit|facebot|twitterbot|whatsapp|telegram|linkedinbot|pinterest|slackbot|discordbot|embedly|redditbot|skypeuripreview|vkshare|googlebot|bingbot|applebot|line-poker|x-bufferbot/i;

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const ua = request.headers.get('user-agent') || '';

  // Solo intervenimos en /producto/* y solo para bots. El resto sigue normal.
  if (!url.pathname.startsWith('/producto/') || !BOT_UA.test(ua)) {
    return next();
  }

  const slug = url.pathname.replace('/producto/', '').split('/')[0].split('?')[0];

  let product = null;
  try {
    const res = await fetch(`${API}/products/${encodeURIComponent(slug)}`);
    if (res.ok) product = await res.json();
  } catch (e) {
    // Si la API falla, devolvemos OG genéricos (no rompemos el preview)
  }

  const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const title = product ? `${product.name} | Cushion Joyería` : 'Cushion | Alta Joyería';
  const description = product?.description
    ? product.description.replace(/\s+/g, ' ').trim().slice(0, 200)
    : 'Alta joyería con esmeraldas colombianas certificadas. Diseñado en Bogotá.';

  // Imagen de portada (isThumbnail) o la primera como respaldo → optimizada 1200px
  const cover = product?.images?.find(i => i.isThumbnail) || product?.images?.[0];
  const rawImg = cover?.imageUrl;
  const image = rawImg && rawImg.includes('res.cloudinary.com')
    ? rawImg.replace('/upload/', '/upload/f_auto,q_auto:best,w_1200/')
    : (rawImg || 'https://cushionjewelry.com/images/og-cushion.png');

  const pageUrl = `https://cushionjewelry.com/producto/${slug}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="product">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${pageUrl}">
<meta property="og:site_name" content="Cushion Jewelry">
${product ? `<meta property="product:price:amount" content="${product.price}">
<meta property="product:price:currency" content="COP">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<link rel="canonical" href="${pageUrl}">
</head>
<body>
<h1>${esc(title)}</h1>
<p>${esc(description)}</p>
<img src="${esc(image)}" alt="${esc(title)}" width="1200">
<p><a href="${pageUrl}">Ver en Cushion</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=600',
    },
  });
}
