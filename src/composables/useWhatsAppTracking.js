import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { useProductsStore } from '@/stores/products';
import { useAuthStore } from '@/stores/auth';
import { useAnalytics } from '@/composables/useAnalytics';
import { getAttribution } from '@/utils/utm';
import api from '@/api/axios';

/**
 * Mide CUALQUIER interacción de WhatsApp del sitio, venga de donde venga.
 *
 * Escucha (a nivel documento) los clics en enlaces wa.me / api.whatsapp.com y
 * dispara la medición completa — igual que el botón del detalle:
 *   1. dataLayer (GA4) + Meta Pixel Contact (con event_id para dedup)
 *   2. Registro en el backend (/product-inquiries) → Telegram + Meta CAPI Contact
 *      + pestaña "Consultas WhatsApp" del admin.
 *
 * Si el clic ocurre en el detalle de una pieza, adjunta la pieza (desde el
 * cache del store por el slug). En el resto, se registra como consulta general.
 *
 * Nota: los botones que abren WhatsApp con window.open (ej. el detalle de
 * producto y el formulario de esmeraldas) ya miden por su cuenta y NO son
 * enlaces <a>, así que este listener no los duplica.
 */
export function useWhatsAppTracking() {
  const route = useRoute();
  const productsStore = useProductsStore();
  const authStore = useAuthStore();
  const { trackWhatsAppClick } = useAnalytics();

  const measure = () => {
    const eventId = 'contact_' + uuidv4(); // mismo id en Pixel y CAPI (dedup)

    // Contexto: en el detalle de una pieza, adjuntamos la pieza
    let product = null;
    if (route.name === 'product-detail') {
      product = productsStore.products.find((p) => p.slug === route.params.slug) || null;
    }

    // 1. dataLayer + Meta Pixel Contact
    try { trackWhatsAppClick(product || undefined, eventId); } catch (e) { /* noop */ }

    // 2. Backend (fire & forget)
    const attribution = getAttribution() || {};
    api.post('/product-inquiries', {
      productSlug:  product?.slug || null,
      productName:  product?.name || 'Consulta general',
      channel:      'WHATSAPP',
      clientEmail:  authStore.user?.email || null,
      eventId:      eventId,
      utmSource:    attribution.utm_source || null,
      utmMedium:    attribution.utm_medium || null,
      utmCampaign:  attribution.utm_campaign || null,
    }).catch(() => {});
  };

  const handler = (e) => {
    // No medir clics de WhatsApp dentro del admin (contacto interno a clientes)
    if ((route.path || '').startsWith('/admin')) return;
    const a = e.target?.closest?.('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
    if (a) measure();
  };

  onMounted(() => document.addEventListener('click', handler, true));
  onUnmounted(() => document.removeEventListener('click', handler, true));
}
