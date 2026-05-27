/**
 * useAnalytics.js
 * Composable central de medición para Cushion.
 *
 * Arquitectura:
 *  - Todo pasa por window.dataLayer (estándar GTM)
 *  - GTM distribuye los eventos a GA4, Meta Pixel y TikTok desde su dashboard
 *  - Para activar: reemplaza GTM-XXXXXXX en index.html con tu ID real
 *
 * Eventos implementados:
 *  - view_item          → vista de producto
 *  - add_to_cart        → producto añadido al carrito
 *  - begin_checkout     → inicio de pago
 *  - purchase           → orden completada
 *  - whatsapp_click     → clic en botón WhatsApp (producto o general)
 *  - generate_lead      → formulario esmeralda enviado
 *  - search             → búsqueda realizada
 */
export function useAnalytics() {

  /** Push base al dataLayer — nunca falla si GTM no está cargado */
  const push = (payload) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  };

  // ─────────────────────────────────────────
  // ECOMMERCE EVENTS (formato GA4 estándar)
  // ─────────────────────────────────────────

  const trackViewProduct = (product) => {
    push({ ecommerce: null }); // limpiar ecommerce previo
    push({
      event: 'view_item',
      ecommerce: {
        currency: 'COP',
        value: product.price,
        items: [buildItem(product, 1)],
      },
    });
  };

  const trackAddToCart = (product, quantity = 1) => {
    push({ ecommerce: null });
    push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'COP',
        value: product.price * quantity,
        items: [buildItem(product, quantity)],
      },
    });
  };

  const trackBeginCheckout = (items, total) => {
    push({ ecommerce: null });
    push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'COP',
        value: total,
        items: items.map(i => buildItem(i.product || i, i.quantity || 1)),
      },
    });
  };

  const trackPurchase = ({ orderNumber, total, items = [] }) => {
    push({ ecommerce: null });
    push({
      event: 'purchase',
      ecommerce: {
        transaction_id: orderNumber,
        currency: 'COP',
        value: total,
        items: items.map(i => buildItem(i.product || i, i.quantity || 1)),
      },
    });
  };

  // ─────────────────────────────────────────
  // ENGAGEMENT EVENTS
  // ─────────────────────────────────────────

  /** Clic en botón WhatsApp desde página de producto */
  const trackWhatsAppClick = (product) => {
    push({
      event: 'whatsapp_click',
      product_name: product?.name || '',
      product_id:   product?.id   || '',
      product_slug: product?.slug || '',
      value:        product?.price || 0,
      currency:     'COP',
    });
  };

  /** Envío del formulario de esmeralda personalizada */
  const trackEmeraldForm = (method) => {
    push({
      event: 'generate_lead',
      lead_source: 'esmeraldas_form',
      contact_method: method, // 'FORMULARIO' | 'WHATSAPP'
    });
  };

  /** Búsqueda realizada */
  const trackSearch = (term) => {
    push({ event: 'search', search_term: term });
  };

  // ─────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────

  function buildItem(product, quantity) {
    return {
      item_id:       String(product?.id   || ''),
      item_name:     product?.name        || '',
      item_category: product?.category    || '',
      price:         product?.price       || 0,
      quantity,
    };
  }

  return {
    push,
    trackViewProduct,
    trackAddToCart,
    trackBeginCheckout,
    trackPurchase,
    trackWhatsAppClick,
    trackEmeraldForm,
    trackSearch,
  };
}
