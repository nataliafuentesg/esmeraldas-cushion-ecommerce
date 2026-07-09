<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import ProductCard from './ProductCard.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const productsStore = useProductsStore();

// Recién llegados = los últimos agregados. Ordenamos por ID descendente
// (el ID es secuencial, así que el más alto es el más nuevo). Cuando los
// productos tengan createdAt, este orden sigue reflejando la recencia.
const newArrivals = computed(() => {
  return [...productsStore.products]
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
      return (b.id || 0) - (a.id || 0);
    })
    .slice(0, 8);
});

const loading = computed(() => productsStore.loading && !productsStore.loaded);

onMounted(async () => {
  await productsStore.fetchProducts();
});

const modules = [Pagination, Autoplay];
const swiperBreakpoints = {
  320:  { slidesPerView: 1.1, spaceBetween: 20 },
  768:  { slidesPerView: 2.2, spaceBetween: 30 },
  1024: { slidesPerView: 3.2, spaceBetween: 40 },
  1440: { slidesPerView: 4,   spaceBetween: 40 },
};
</script>

<template>
  <section class="bg-brand-black py-20 md:py-24 border-t border-brand-white/5">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <header class="mb-14 text-center">
        <p class="text-brand-gold text-[10px] tracking-[0.5em] font-bold mb-3">✦ Novedades</p>
        <h2 class="text-3xl md:text-5xl text-brand-white font-serif-elegant tracking-[0.2em]">
          Nuevas Piezas
        </h2>
        <div class="h-[1px] w-16 bg-brand-gold mx-auto mt-5"></div>
        <p class="text-brand-white/50 font-sans-luxury text-sm mt-4 max-w-md mx-auto">
          Las piezas más recientes de nuestra colección.
        </p>
      </header>

      <!-- Skeleton -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="aspect-square bg-brand-white/[0.04] border border-brand-white/5 w-full"></div>
          <div class="p-4 space-y-3">
            <div class="h-2 bg-brand-white/10 w-1/3 mx-auto"></div>
            <div class="h-3 bg-brand-white/10 w-2/3 mx-auto"></div>
            <div class="h-2 bg-brand-gold/10 w-1/4 mx-auto mt-3"></div>
          </div>
        </div>
      </div>

      <swiper
        v-else
        :modules="modules"
        :space-between="40"
        :slides-per-view="4"
        :breakpoints="swiperBreakpoints"
        :loop="newArrivals.length > 4"
        :autoplay="{ delay: 4500, disableOnInteraction: false }"
        :pagination="{ clickable: true, dynamicBullets: true, dynamicMainBullets: 3 }"
        class="na-swiper pb-4"
      >
        <swiper-slide v-for="product in newArrivals" :key="product.id" class="py-4 h-auto !flex !items-stretch">
          <div class="w-full flex flex-col bg-brand-black/40 border border-brand-white/5">
            <ProductCard :product="product" class="h-full" />
          </div>
        </swiper-slide>
      </swiper>

      <div class="text-center mt-8">
        <RouterLink to="/coleccion"
          class="inline-block px-12 py-4 border border-brand-gold/30 text-brand-gold text-[10px] font-bold tracking-[0.3em] hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-all duration-500">
          Ver Toda la Colección
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * Paginación "dynamic bullets": swiper muestra solo un grupo compacto de puntos
 * que se encogen hacia los bordes, así nunca se amontonan en móvil aunque haya
 * 8 piezas. Los dejamos dorados y con el activo alargado tipo cápsula (más
 * sofisticado que un simple círculo).
 */
.na-swiper :deep(.swiper-pagination) {
  position: relative;
  bottom: auto !important;
  margin-top: 24px;
  height: 12px;
  line-height: 12px;
}
.na-swiper :deep(.swiper-pagination-bullet) {
  width: 6px;
  height: 6px;
  margin: 0 5px !important;
  background: transparent;
  border: 1px solid #c5a880;
  opacity: 0.45;
  border-radius: 999px;
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
/* El punto activo se convierte en una cápsula dorada sólida */
.na-swiper :deep(.swiper-pagination-bullet-active) {
  width: 22px;
  background: #c5a880;
  border-color: #c5a880;
  opacity: 1;
}
/* Los puntos vecinos (que dynamicBullets encoge) quedan tenues y sin borde duro */
.na-swiper :deep(.swiper-pagination-bullet-active-prev),
.na-swiper :deep(.swiper-pagination-bullet-active-next) {
  opacity: 0.6;
}
.na-swiper :deep(.swiper-pagination-bullet-active-prev-prev),
.na-swiper :deep(.swiper-pagination-bullet-active-next-next) {
  opacity: 0.3;
}
</style>
