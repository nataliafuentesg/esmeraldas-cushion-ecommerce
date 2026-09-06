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
  <!-- Dock solo en móvil (md:hidden). Fijo abajo, en verde esmeralda de la marca. -->
  <a
    :href="waLink"
    target="_blank"
    rel="noopener"
    data-wa-source="dock"
    class="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-center gap-3
           bg-brand-primary text-white py-4 px-4 text-[11px] font-bold uppercase tracking-[0.25em]
           border-t border-brand-gold/50 shadow-[0_-6px_24px_rgba(0,0,0,0.35)]
           active:brightness-95 transition-[filter]"
    style="padding-bottom: calc(1rem + env(safe-area-inset-bottom));"
    aria-label="WhatsApp"
  >
    <span class="flex items-center justify-center w-6 h-6 rounded-full bg-white/15 shrink-0">
      <Icon icon="simple-icons:whatsapp" class="w-3.5 h-3.5" />
    </span>
    <span class="text-brand-gold">✦</span>
    {{ label }}
  </a>
</template>
