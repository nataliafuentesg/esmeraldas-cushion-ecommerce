<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import { v4 as uuidv4 } from 'uuid';
import { useProductsStore } from '@/stores/products';
import { useLocaleStore } from '@/stores/locale';
import { useAuthStore } from '@/stores/auth';
import { useAnalytics } from '@/composables/useAnalytics';
import { getAttribution } from '@/utils/utm';
import api from '@/api/axios';

const route = useRoute();
const productsStore = useProductsStore();
const L = useLocaleStore();
const authStore = useAuthStore();
const { trackWhatsAppClick } = useAnalytics();

const WA_NUMBER = '573136133822';

// ¿Estamos en el detalle de una pieza?
const isProductPage = computed(() => route.name === 'product-detail');

// Pieza actual: se busca en el cache del store por el slug de la ruta (sin pedir nada)
const currentProduct = computed(() => {
  if (!isProductPage.value) return null;
  const slug = route.params.slug;
  return productsStore.products.find((p) => p.slug === slug) || null;
});

// Enlace de WhatsApp con mensaje según el contexto
const waLink = computed(() => {
  let msg;
  if (isProductPage.value) {
    const url = `https://cushionjewelry.com/producto/${route.params.slug}`;
    const name = currentProduct.value?.name;
    msg = name
      ? `Hola Cushion 💚 me interesa esta pieza: *${name}*\n${url}\n¿Me dan más información?`
      : `Hola Cushion 💚 me interesa esta pieza:\n${url}\n¿Me dan más información?`;
  } else {
    msg = 'Hola Cushion 💚 quiero más información sobre sus joyas y esmeraldas.';
  }
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
});

const label = computed(() =>
  isProductPage.value ? L.t('dock.askAboutPiece') : L.t('dock.askInfo')
);

// Medición COMPLETA (igual que el botón del detalle): Pixel + GA + guardado en
// backend (→ Telegram + CAPI Contact + pestaña de Consultas WhatsApp del admin).
const onClick = () => {
  const eventId = 'contact_' + uuidv4(); // dedup Pixel ↔ CAPI
  const product = currentProduct.value;

  // 1. dataLayer + Meta Pixel Contact
  try { trackWhatsAppClick(product || undefined, eventId); } catch (e) { /* noop */ }

  // 2. Registrar la consulta en el backend (fire & forget)
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
  }).catch(() => {}); // silencioso — no interrumpir la apertura del chat
};
</script>

<template>
  <!-- Dock solo en móvil (md:hidden). Fijo abajo, verde WhatsApp. -->
  <a
    :href="waLink"
    target="_blank"
    rel="noopener"
    @click="onClick"
    class="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-center gap-2.5
           bg-[#25D366] text-white py-3.5 px-4 text-sm font-bold tracking-wide
           shadow-[0_-4px_20px_rgba(0,0,0,0.28)] active:brightness-95 transition-[filter]"
    style="padding-bottom: calc(0.875rem + env(safe-area-inset-bottom));"
    aria-label="WhatsApp"
  >
    <Icon icon="simple-icons:whatsapp" class="w-5 h-5" />
    {{ label }}
  </a>
</template>
