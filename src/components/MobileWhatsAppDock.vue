<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useProductsStore } from '@/stores/products';
import { useLocaleStore } from '@/stores/locale';

const route = useRoute();
const productsStore = useProductsStore();
const L = useLocaleStore();

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

// La medición la hace el listener global de WhatsApp (useWhatsAppTracking),
// que capta cualquier clic a un enlace wa.me — incluido este dock.
</script>

<template>
  <!-- Botón flotante de WhatsApp (solo móvil), vidrio esmeralda con pulso sutil. -->
  <a
    :href="waLink"
    target="_blank"
    rel="noopener"
    data-wa-source="dock"
    class="md:hidden fixed right-5 z-40 active:scale-95 transition-transform"
    style="bottom: calc(1.1rem + env(safe-area-inset-bottom));"
    :aria-label="label"
    :title="label"
  >
    <span class="relative flex items-center justify-center w-14 h-14 rounded-full
                 bg-brand-primary/85 backdrop-blur-md text-white
                 border border-white/25 ring-1 ring-brand-gold/40
                 shadow-[0_12px_30px_-6px_rgba(0,0,0,0.45)]">
      <span class="pointer-events-none absolute inset-0 rounded-full bg-brand-primary/40 dock-pulse"></span>
      <Icon icon="simple-icons:whatsapp" class="relative w-6 h-6" />
    </span>
  </a>
</template>

<style scoped>
@keyframes dockPulse {
  0%   { transform: scale(1);   opacity: .55; }
  70%  { transform: scale(1.7); opacity: 0; }
  100% { transform: scale(1.7); opacity: 0; }
}
.dock-pulse { animation: dockPulse 2.8s ease-out infinite; }
@media (prefers-reduced-motion: reduce) { .dock-pulse { animation: none; } }
</style>
