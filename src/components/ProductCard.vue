<script setup>
import { defineProps, computed, ref, watch } from 'vue';
import { cloudinaryOptimize } from '@/utils/cloudinary';
import { useProductsStore } from '@/stores/products';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const productsStore = useProductsStore();

const isOutOfStock = computed(() => props.product.stock === 0);

// Recién agregado: está entre los 8 más nuevos → badge "NUEVO" para distinguirlo
const isNew = computed(() => productsStore.newArrivalIds.includes(props.product.id));

// Marca de metal compacta para la tarjeta: "Oro amarillo 18K" → "Oro 18K"
const metalBadge = computed(() => {
  const m = (props.product.metalType || '').trim();
  if (!m) return null;
  const karat = m.match(/(\d{1,2})\s*k/i);
  return karat ? `Oro ${karat[1]}K` : m;
});

const mainImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    const thumb = props.product.images.find(img => img.isThumbnail);
    return thumb ? thumb.imageUrl : props.product.images[0].imageUrl;
  }
  return null;
});

const hoverImage = computed(() => {
  if (props.product.images && props.product.images.length > 1) {
    const nonThumb = props.product.images.find(img => !img.isThumbnail);
    return nonThumb ? nonThumb.imageUrl : props.product.images[1]?.imageUrl || null;
  }
  return null;
});

const mainImageFailed = ref(false);
const imgLoaded = ref(false);

const onMainImageError = () => { mainImageFailed.value = true; };
const onMainImageLoad  = () => { imgLoaded.value = true; };

// Si el producto cambia (reutilización del componente), reset del estado de carga
watch(mainImage, () => {
  imgLoaded.value = false;
  mainImageFailed.value = false;
});
</script>

<template>
  <RouterLink
    :to="{ name: 'product-detail', params: { slug: product.slug } }"
    class="product-card group flex flex-col h-full w-full bg-brand-black/40 border border-brand-white/5 text-brand-white relative overflow-hidden"
  >
    <!-- Shimmer de lujo en hover -->
    <div class="card-shimmer absolute inset-0 z-10 pointer-events-none"></div>

    <div class="aspect-square overflow-hidden relative bg-brand-white/[0.02] border-b border-brand-white/5">

      <!-- Placeholder sin imagen -->
      <div v-if="!mainImage || mainImageFailed"
           class="w-full h-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2.5 5 5.5.8-4 3.9.9 5.3L12 15.4l-4.9 2.6.9-5.3L4 8.8l5.5-.8z"/>
        </svg>
      </div>

      <!-- Skeleton shimmer mientras carga la imagen -->
      <div
        v-if="mainImage && !mainImageFailed && !imgLoaded"
        class="absolute inset-0 z-[2] skeleton-shimmer"
      ></div>

      <!-- Imagen principal — desaturada si agotado, fade-in al cargar -->
      <img
        v-if="mainImage && !mainImageFailed"
        :src="cloudinaryOptimize(mainImage, { width: 600 })"
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.06]"
        :class="[
          imgLoaded ? 'opacity-100' : 'opacity-0',
          { 'group-hover:opacity-0': hoverImage && !isOutOfStock }
        ]"
        @load="onMainImageLoad"
        @error="onMainImageError"
      />

      <!-- Imagen en hover (solo si hay stock) -->
      <img
        v-if="hoverImage && !mainImageFailed && !isOutOfStock"
        :src="cloudinaryOptimize(hoverImage, { width: 600 })"
        :alt="product.name + ' vista alternativa'"
        loading="lazy"
        class="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.06]"
      />

      <!-- Badge BAJO PEDIDO (agotado pero se fabrica) -->
      <span
        v-if="isOutOfStock"
        class="absolute top-4 left-4 bg-brand-gold text-brand-black px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] z-10 shadow-lg"
      >
        BAJO PEDIDO
      </span>

      <!-- Badge Exclusivo (solo si hay stock) -->
      <span
        v-else-if="product.featured"
        class="absolute top-4 left-4 bg-brand-black/80 backdrop-blur-md text-brand-gold border border-brand-gold/30 px-2.5 py-1 text-[8px] font-bold tracking-wide z-10"
      >
        Exclusivo
      </span>

      <!-- Marca de metal (Oro 18K) -->
      <span
        v-if="metalBadge"
        class="absolute top-4 right-4 inline-flex items-center gap-1 bg-brand-black/70 backdrop-blur-sm text-brand-gold border border-brand-gold/30 px-2.5 py-1 text-[8px] font-bold tracking-[0.15em] z-10"
      >
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.8L12 17l-5.5 3 1-6.8L3 8.9 9 8z"/></svg>
        {{ metalBadge }}
      </span>

      <!-- Overlay hover -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4 z-10 bg-brand-black/20">
        <span class="font-sans-luxury text-brand-white/80 text-[9px] tracking-[0.3em] translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          Ver pieza
        </span>
      </div>
    </div>

    <div class="p-5 md:p-6 text-center flex-1 flex flex-col justify-between gap-4">

      <div>
        <p class="text-[9px] tracking-[0.3em] mb-2 font-bold opacity-80 transition-opacity duration-300 group-hover:opacity-100">
          <span class="text-brand-gold">{{ product.category }}</span>
          <!-- Marca discreta de pieza nueva: texto, no badge sobre la foto -->
          <span v-if="isNew" class="text-brand-primary">&nbsp;✦ Nuevo</span>
        </p>
        <h3 class="font-serif-elegant text-base md:text-lg tracking-wide line-clamp-2 min-h-[3rem] flex items-center justify-center transition-colors duration-300 group-hover:text-brand-gold">
          {{ product.name }}
        </h3>
      </div>

      <div class="pt-3 border-t border-brand-white/5 group-hover:border-brand-gold/20 transition-colors duration-500">
        <p class="font-sans-luxury text-brand-white/90 text-sm tracking-wide font-medium group-hover:text-brand-gold transition-colors duration-300">
          $ {{ product.price.toLocaleString() }}
        </p>
        <!-- Agotado: nota invitadora de fabricación bajo pedido -->
        <p v-if="isOutOfStock" class="font-sans-luxury text-brand-gold/80 text-[9px] tracking-[0.15em] mt-1.5">
          ✦ Se fabrica bajo pedido · 10 días hábiles
        </p>
      </div>

    </div>
  </RouterLink>
</template>

<style scoped>
@reference "../assets/main.css";

.product-card {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              border-color 0.4s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(184, 155, 106, 0.12),
              0 8px 16px rgba(0, 0, 0, 0.3);
  border-color: rgba(184, 155, 106, 0.25);
}

.card-shimmer {
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(184, 155, 106, 0.04) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  transition: background-position 0.6s ease;
  background-position: 200% 0;
}

.product-card:hover .card-shimmer {
  background-position: -200% 0;
}

/* Skeleton shimmer mientras carga la imagen */
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.07) 40%,
    rgba(255, 255, 255, 0.03) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-move 1.6s ease-in-out infinite;
}

@keyframes skeleton-move {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
