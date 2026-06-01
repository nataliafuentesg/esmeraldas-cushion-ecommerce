/**
 * useAnalytics.js
 * Composable central de medición para Cushion.
 *
 * Arquitectura DUAL:
 *  - window.dataLayer (estándar GTM) → GA4, TikTok, etc.
 *  - Meta Pixel directo (fbq)        → con event_id para deduplicar contra
 *                                       la Conversions API del servidor.
 *
 * Deduplicación Meta: los eventos que también envía el backend (Purchase,
 * Contact, Lead) se disparan con el MISMO event_id en navegador y servidor,
 * para que Meta los cuente una sola vez.
 *
 * Eventos implementados:
 *  - view_item          → vista de producto        → fbq ViewContent
 *  - add_to_cart        → producto añadido          → fbq AddToCart
 *  - begin_checkout     → inicio de pago            → fbq InitiateCheckout
 *  - purchase           → orden completada          → fbq Purchase (dedup)
 *  - whatsapp_click     → clic en WhatsApp          → fbq Contact (dedup)
 *  - generate_lead      → formulario esmeralda      → fbq Lead (dedup)
 *  - search             → búsqueda realizada        → fbq Search
 */
export function useAnalytics() {

  /** Push base al dataLayer — nunca falla si GTM no está cargado */
  const push = (payload) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  };

  /**
   * Dispara un evento al Meta Pixel de forma segura.
   * @param {string} eventName   Nombre del evento estándar de Meta
   * @param {object} params      Parámetros (value, currency, content_ids, etc.)
   * @param {string} [eventId]   ID para deduplicar contra la Conversions API
   */
  const fbqTrack = (eventName, params = {}, eventId = null) => {
    if (typeof window.fbq !== 'function') return; // Pixel no cargado aún
    if (eventId) {
      window.fbq('track', eventName, params, { eventID: eventId });
    } else {
      window.fbq('track', eventName, params);
    }
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
    // Meta Pixel — ViewContent (solo navegador, no lo envía el backend)
    fbqTrack('ViewContent', {
      content_type: 'product',
      content_ids: [String(product.id)],
      content_name: product.name,
      content_category: product.category,
      value: product.price,
      currency: 'COP',
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
    // Meta Pixel — AddToCart (solo navegador)
    fbqTrack('AddToCart', {
      content_type: 'product',
      content_ids: [String(product.id)],
      content_name: product.name,
      value: product.price * quantity,
      currency: 'COP',
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
    // Meta Pixel — InitiateCheckout (solo navegador)
    fbqTrack('InitiateCheckout', {
      content_type: 'product',
      content_ids: items.map(i => String((i.product || i).id)),
      num_items: items.reduce((sum, i) => sum + (i.quantity || 1), 0),
      value: total,
      currency: 'COP',
    });
  };

  /**
   * Compra completada.
   * @param {string} orderNumber  Nº de pedido — se usa como event_id para
   *                              deduplicar contra el Purchase del backend (CAPI).
   */
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
    // Meta Pixel — Purchase con dedup (mismo event_id que el servidor = orderNumber)
    fbqTrack('Purchase', {
      content_type: 'product',
      content_ids: items.map(i => String((i.product || i).id)),
      num_items: items.reduce((sum, i) => sum + (i.quantity || 1), 0),
      value: total,
      currency: 'COP',
      order_id: orderNumber,
    }, orderNumber);
  };

  // ─────────────────────────────────────────
  // ENGAGEMENT EVENTS
  // ─────────────────────────────────────────

  /**
   * Clic en botón WhatsApp desde página de producto.
   * @param {object} product
   * @param {string} [eventId]  ID compartido con el backend para deduplicar el Contact.
   */
  const trackWhatsAppClick = (product, eventId = null) => {
    push({
      event: 'whatsapp_click',
      product_name: product?.name || '',
      product_id:   product?.id   || '',
      product_slug: product?.slug || '',
      value:        product?.price || 0,
      currency:     'COP',
    });
    // Meta Pixel — Contact con dedup contra CAPI
    fbqTrack('Contact', {
      content_name: product?.name || '',
      content_ids:  product?.id ? [String(product.id)] : [],
      value:        product?.price || 0,
      currency:     'COP',
    }, eventId);
  };

  /**
   * Envío del formulario de esmeralda personalizada.
   * @param {string} method      'FORMULARIO' | 'WHATSAPP'
   * @param {string} [eventId]   ID compartido con el backend para deduplicar el Lead.
   */
  const trackEmeraldForm = (method, eventId = null) => {
    push({
      event: 'generate_lead',
      lead_source: 'esmeraldas_form',
      contact_method: method,
    });
    // Meta Pixel — Lead con dedup contra CAPI
    fbqTrack('Lead', {
      content_name: 'Esmeralda personalizada',
      content_category: method,
    }, eventId);
  };

  /** Búsqueda realizada */
  const trackSearch = (term) => {
    push({ event: 'search', search_term: term });
    // Meta Pixel — Search (solo navegador)
    fbqTrack('Search', { search_string: term });
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
