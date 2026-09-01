<script setup>
import { computed, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/FooterApp.vue';
import CartOffCanvas from '@/components/CartOffCanvas.vue';
import MobileWhatsAppDock from '@/components/MobileWhatsAppDock.vue';
import { useCartStore } from '@/stores/cart';
import { useHead } from '@unhead/vue';

const route = useRoute();
const isAdminRoute = computed(() => route.path.startsWith('/admin'));
const cartStore = useCartStore();

// OG tags base — se aplican a todas las páginas como fallback.
// ProductDetail.vue las sobrescribe con datos del producto específico.
useHead({
  title: () => route.meta.title || 'Cushion | Alta Joyería',
  meta: [
    {
      property: 'og:title',
      content: () => route.meta.title || 'Cushion Jewelry | Alta Joyería & Esmeraldas'
    },
    {
      property: 'og:description',
      content: 'Descubre la colección exclusiva de Cushion. Alta joyería con esmeraldas colombianas certificadas, diseñadas en Bogotá.'
    },
    {
      property: 'og:image',
      content: 'https://cushionjewelry.com/images/og-cushion.png'
    },
    {
      property: 'og:url',
      content: () => `https://cushionjewelry.com${route.path}`
    },
    {
      name: 'twitter:title',
      content: () => route.meta.title || 'Cushion Jewelry | Alta Joyería'
    },
    {
      name: 'twitter:description',
      content: 'Alta joyería con esmeraldas colombianas certificadas. Piezas exclusivas diseñadas en Bogotá.'
    },
    {
      name: 'twitter:image',
      content: 'https://cushionjewelry.com/images/og-cushion.png'
    },
  ]
});

onMounted(() => {
  cartStore.initSession();
});
</script>

<template>
  <div class="bg-brand-black min-h-screen font-sans-luxury flex flex-col">

    <Header v-if="!isAdminRoute" />

    <main class="flex-grow relative" :class="{ 'pb-16 md:pb-0': !isAdminRoute }">
      <RouterView v-slot="{ Component }">
        <transition name="fade-page">
          <KeepAlive :include="['CollectionView']">
            <component :is="Component" />
          </KeepAlive>
        </transition>
      </RouterView>
    </main>

    <Footer v-if="!isAdminRoute" />
    <CartOffCanvas v-if="!isAdminRoute" />

    <!-- Dock móvil de WhatsApp (contextual: pieza en detalle, info general en el resto) -->
    <MobileWhatsAppDock v-if="!isAdminRoute" />

  </div>
</template>

<style>
.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.fade-page-enter-from,
.fade-page-leave-to {
  opacity: 0;
}
</style>
