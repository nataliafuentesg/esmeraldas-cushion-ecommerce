/**
 * GUÍA DE INTEGRACIÓN — Google Merchant Center ID: 5797017548
 * ─────────────────────────────────────────────────────────────
 *
 * ARQUITECTURA
 * ─────────────
 * Este archivo documenta los dos métodos de integración con Google Merchant Center.
 * El frontend ya hace su parte (JSON-LD en cada página de producto).
 * El backend (api.cushionjewelry.com) debe implementar el endpoint del feed.
 *
 *
 * ═══════════════════════════════════════════════════════════════
 * MÉTODO 1 — FEED XML (recomendado para el inventario completo)
 * ═══════════════════════════════════════════════════════════════
 *
 * El backend expone una URL que Google Merchant Center fetcha periódicamente.
 * En Merchant Center: Productos > Feeds > Agregar feed > Fetch programado
 * URL del feed: https://api.cushionjewelry.com/api/feed/google-merchant
 *
 * Implementación en Node.js / Express (api.cushionjewelry.com):
 *
 *   app.get('/api/feed/google-merchant', async (req, res) => {
 *     const products = await Product.findAll({ where: { active: true } });
 *
 *     const items = products.map(p => `
 *       <item>
 *         <g:id>${p.id}</g:id>
 *         <g:title><![CDATA[${p.name}]]></g:title>
 *         <g:description><![CDATA[${p.description?.substring(0, 5000)}]]></g:description>
 *         <g:link>https://cushionjewelry.com/producto/${p.slug}</g:link>
 *         <g:image_link>${p.images?.[0]?.imageUrl}</g:image_link>
 *         ${p.images?.slice(1).map(img => `<g:additional_image_link>${img.imageUrl}</g:additional_image_link>`).join('\n')}
 *         <g:availability>${p.stock > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
 *         <g:price>${p.price} COP</g:price>
 *         <g:brand>Cushion Jewelry</g:brand>
 *         <g:condition>new</g:condition>
 *         <g:google_product_category>${getGoogleCategory(p.category)}</g:google_product_category>
 *         <g:product_type>${p.category}</g:product_type>
 *         ${p.metalType ? `<g:material>${p.metalType}</g:material>` : ''}
 *         ${p.gemstoneType ? `<g:material>${p.gemstoneType}</g:material>` : ''}
 *         <g:shipping>
 *           <g:country>CO</g:country>
 *           <g:price>0 COP</g:price>
 *         </g:shipping>
 *         <g:return_policy_label>default</g:return_policy_label>
 *         <g:identifier_exists>false</g:identifier_exists>
 *       </item>
 *     `).join('\n');
 *
 *     const xml = `<?xml version="1.0" encoding="UTF-8"?>
 *       <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
 *         <channel>
 *           <title>Cushion Jewelry</title>
 *           <link>https://cushionjewelry.com</link>
 *           <description>Alta Joyería & Esmeraldas Colombianas</description>
 *           ${items}
 *         </channel>
 *       </rss>`;
 *
 *     res.set('Content-Type', 'application/xml');
 *     res.send(xml);
 *   });
 *
 *   // Mapeo de categorías al ID numérico de Google
 *   function getGoogleCategory(category) {
 *     const map = {
 *       'Anillos':        '204',  // Jewelry > Rings
 *       'Collares':       '201',  // Jewelry > Necklaces
 *       'Gargantillas':   '201',
 *       'Aretes':         '200',  // Jewelry > Earrings
 *       'Pulseras':       '188',  // Jewelry > Bracelets
 *       'Dijes':          '194',  // Jewelry > Charms & Pendants
 *       'Piedras Sueltas':'54',   // Gemstones
 *     };
 *     return map[category] || '188';
 *   }
 *
 *
 * ═══════════════════════════════════════════════════════════════
 * MÉTODO 2 — GOOGLE CONTENT API (sincronización en tiempo real)
 * ═══════════════════════════════════════════════════════════════
 *
 * PASOS DE CONFIGURACIÓN (solo se hacen una vez):
 *
 * 1. Google Cloud Console → Nuevo proyecto → Habilitar "Content API for Shopping"
 *    https://console.cloud.google.com/apis/library/shoppingcontent.googleapis.com
 *
 * 2. IAM & Admin → Cuentas de servicio → Crear cuenta → Descargar JSON de credenciales
 *    Guardar el JSON como: /config/google-service-account.json (NUNCA commitear)
 *
 * 3. Google Merchant Center → Configuración → Usuarios → Agregar usuario:
 *    Email: el del service account (ej: cushion-feed@proyecto.iam.gserviceaccount.com)
 *    Rol: Administrador o Gerente de feed
 *
 * 4. Instalar en el backend:
 *    npm install googleapis
 *
 * 5. Implementación en Node.js (api.cushionjewelry.com):
 *
 *   const { google } = require('googleapis');
 *   const MERCHANT_ID = '5797017548';
 *
 *   async function getMerchantClient() {
 *     const auth = new google.auth.GoogleAuth({
 *       keyFile: './config/google-service-account.json',
 *       scopes: ['https://www.googleapis.com/auth/content'],
 *     });
 *     return google.content({ version: 'v2.1', auth: await auth.getClient() });
 *   }
 *
 *   // Insertar/actualizar un producto en Merchant Center
 *   async function upsertProduct(product) {
 *     const content = await getMerchantClient();
 *     return content.products.insert({
 *       merchantId: MERCHANT_ID,
 *       requestBody: {
 *         offerId:         String(product.id),
 *         title:           product.name,
 *         description:     product.description?.substring(0, 5000),
 *         link:            `https://cushionjewelry.com/producto/${product.slug}`,
 *         imageLink:       product.images?.[0]?.imageUrl,
 *         additionalImageLinks: product.images?.slice(1).map(i => i.imageUrl),
 *         availability:    product.stock > 0 ? 'in_stock' : 'out_of_stock',
 *         price:           { value: String(product.price), currency: 'COP' },
 *         brand:           'Cushion Jewelry',
 *         condition:       'new',
 *         targetCountry:   'CO',
 *         contentLanguage: 'es',
 *         channel:         'online',
 *         googleProductCategory: '188',
 *         productTypes:    [product.category],
 *         material:        [product.metalType, product.gemstoneType].filter(Boolean).join(', '),
 *         identifierExists: false,
 *         shipping: [{
 *           country: 'CO',
 *           price: { value: '0', currency: 'COP' },
 *         }],
 *       },
 *     });
 *   }
 *
 *   // Llamar después de crear/actualizar un producto en la DB
 *   router.post('/products', async (req, res) => {
 *     const product = await Product.create(req.body);
 *     await upsertProduct(product).catch(console.error); // fire & forget
 *     res.json(product);
 *   });
 *
 *   router.put('/products/:slug', async (req, res) => {
 *     const product = await Product.update(req.body, { where: { slug: req.params.slug } });
 *     await upsertProduct(product).catch(console.error);
 *     res.json(product);
 *   });
 *
 *
 * ═══════════════════════════════════════════════════════════════
 * CONFIGURACIÓN EN GOOGLE MERCHANT CENTER
 * ═══════════════════════════════════════════════════════════════
 *
 * URL de verificación del sitio ya configurada en index.html (Google Site Verification).
 *
 * En Merchant Center:
 * 1. Información del negocio → URL del sitio: https://cushionjewelry.com
 * 2. Reclamar y verificar el sitio → seleccionar "Meta tag" (ya está en el HTML)
 * 3. Envíos → Configurar tarifas de envío para Colombia (0 COP / 2 días hábiles)
 * 4. Política de devoluciones → 2 días hábiles, reembolso completo menos envío
 * 5. Feeds → Agregar feed (Método 1) o usar Content API (Método 2)
 *
 * Herramienta de prueba del rich result:
 * https://search.google.com/test/rich-results
 *
 * Para validar el feed XML antes de subir a Merchant Center:
 * https://merchants.google.com/mc/feeds/diagnostics/
 */

// Utilidad auxiliar para el frontend — mapeo de categorías para referencia
export const GOOGLE_CATEGORY_IDS = {
  'Anillos':        '204',
  'Collares':       '201',
  'Gargantillas':   '201',
  'Aretes':         '200',
  'Pulseras':       '188',
  'Dijes':          '194',
  'Piedras Sueltas': '54',
};
