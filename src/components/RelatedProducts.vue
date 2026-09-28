<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const props = defineProps({
  relatedProducts: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// Solo mostramos las que tienen stock
const availableRelatedProducts = computed(() => {
  if (!props.relatedProducts) return [];
  return props.relatedProducts.filter((product) => product.stock > 0);
});

const modules = [Pagination, Autoplay];
const swiperBreakpoints = {
  320:  { slidesPerView: 2.15, spaceBetween: 12 },
  640:  { slidesPerView: 3.2,  spaceBetween: 18 },
  1024: { slidesPerView: 4.2,  spaceBetween: 24 },
  1440: { slidesPerView: 5,    spaceBetween: 28 },
};
</script>

<template>
  <section v-if="availableRelatedProducts.length > 0" class="related-products-section">
    <div class="flex justify-between items-end mb-10 border-b border-brand-white/10 pb-6">
      <h3 class="font-serif-elegant text-brand-white text-2xl tracking-wide">
        Joyas <span class="text-brand-gold">Relacionadas</span>
      </h3>
      <RouterLink
        to="/coleccion"
        class="text-brand-gold text-[10px] tracking-wide hover:opacity-70 transition-opacity whitespace-nowrap"
      >
        Ver toda la colección
      </RouterLink>
    </div>

    <swiper
      :modules="modules"
      :slides-per-view="4"
      :space-between="32"
      :breakpoints="swiperBreakpoints"
      :loop="availableRelatedProducts.length > 4"
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
      :grab-cursor="true"
      :pagination="{ type: 'progressbar' }"
      class="rel-swiper pb-2"
    >
      <swiper-slide
        v-for="product in availableRelatedProducts"
        :key="product.id"
        class="h-auto !flex !items-stretch py-2"
      >
        <ProductCard :product="product" class="h-full w-full" />
      </swiper-slide>
    </swiper>
  </section>

  <div v-else class="py-20 text-center border-t border-brand-white/5">
    <p class="text-brand-white/30 text-[10px] tracking-[0.3em]">
      Explora más piezas exclusivas en nuestra colección completa
    </p>
  </div>
</template>

<style scoped>
.related-products-section {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Barra de progreso dorada (distinta a los puntos del home) */
.rel-swiper :deep(.swiper-pagination-progressbar) {
  position: relative;
  top: auto;
  left: 0;
  margin-top: 26px;
  height: 2px;
  background: rgba(197, 168, 128, 0.18);
  border-radius: 2px;
}
.rel-swiper :deep(.swiper-pagination-progressbar .swiper-pagination-progressbar-fill) {
  background: #c5a880;
  border-radius: 2px;
}
</style>
