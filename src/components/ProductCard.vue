<script setup>
import { defineProps, computed, ref, watch, onMounted } from 'vue';
import { cloudinaryOptimize } from '@/utils/cloudinary';
import { useProductsStore } from '@/stores/products';
import { useFxStore } from '@/stores/fx';
import { useLocaleStore } from '@/stores/locale';

const L = useLocaleStore();

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const productsStore = useProductsStore();
const fx = useFxStore();
onMounted(() => fx.fetchRate());

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
    class="product-card group flex flex-col h-full w-full bg-brand-black/40 border border-brand-white/5 text-brand-white relative overflow-hidden rounded-xl"
  >
    <!-- Shimmer de lujo en hover -->
    <div class="card-shimmer absolute inset-0 z-10 pointer-events-none"></div>

    <div class="aspect-[3/4] overflow-hidden relative bg-brand-white/[0.02] border-b border-brand-white/5">

      <!-- Acento de esquina para piezas nuevas: marca al vistazo sin encajonar -->
      <span v-if="isNew" class="new-corner" aria-hidden="true"></span>

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

      <!-- Badge BAJO PEDIDO: abajo a la izquierda, para no chocar con "Oro 18K" (arriba) -->
      <span
        v-if="isOutOfStock"
        class="absolute bottom-4 left-4 uppercase bg-brand-gold text-brand-black px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] z-10 shadow-lg"
      >
        {{ L.t('card.onOrder') }}
      </span>

      <!-- Badge Exclusivo (solo si hay stock) -->
      <span
        v-else-if="product.featured"
        class="absolute top-4 left-4 bg-brand-black/80 backdrop-blur-md text-brand-gold border border-brand-gold/30 px-2.5 py-1 text-[8px] font-bold tracking-wide z-10"
      >
        {{ L.t('card.exclusive') }}
      </span>

      <!-- Marca de metal (Oro 18K) -->
      <span
        v-if="metalBadge"
        class="absolute top-4 right-4 inline-flex items-center gap-1 bg-brand-black/70 backdrop-blur-sm text-brand-gold border border-brand-gold/30 px-2.5 py-1 text-[8px] font-bold tracking-[0.15em] z-10"
      >
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.8L12 17l-5.5 3 1-6.8L3 8.9 9 8z"/></svg>
        {{ metalBadge }}
      </span>

      <!-- Overlay hover sutil (solo un leve oscurecido al pasar) -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-brand-black/10 z-[5] pointer-events-none"></div>
    </div>

    <!-- Info LIMPIA debajo de la foto: flex-col para que el precio quede abajo
         y todas las fichas queden a la MISMA altura. -->
    <div class="p-3 md:p-4 text-center flex-1 flex flex-col justify-between">
      <div>
        <p class="text-[8px] md:text-[9px] text-brand-gold tracking-[0.3em] font-bold uppercase mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          {{ product.category }}
        </p>
        <h3 class="font-serif-elegant text-brand-white text-[13px] md:text-base tracking-wide leading-snug line-clamp-2 min-h-[2.1rem] md:min-h-[2.6rem] flex items-center justify-center transition-colors duration-300 group-hover:text-brand-gold">
          {{ product.name }}
        </h3>
      </div>
      <div class="mt-2 pt-2.5 border-t border-brand-white/10 group-hover:border-brand-gold/25 transition-colors duration-500">
        <template v-if="!isOutOfStock">
          <p class="font-sans-luxury text-brand-gold text-sm md:text-base tracking-[0.05em] font-semibold">
            $ {{ product.price.toLocaleString() }}
          </p>
          <p v-if="fx.formatUsd(product.price)" class="font-sans-luxury text-brand-white/45 text-[10px] tracking-wide mt-0.5">
            {{ fx.formatUsd(product.price) }}
          </p>
        </template>
        <p v-else class="font-sans-luxury text-brand-gold text-sm md:text-base tracking-wide font-semibold">
          {{ L.t('card.consultPrice') }}
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

/* Pieza nueva: acento de esquina esmeralda (dos trazos finos en L).
   Marca al vistazo sin encajonar la joya → conserva el minimalismo limpio. */
.new-corner {
  position: absolute;
  top: 0;
  left: 0;
  width: 22px;
  height: 22px;
  border-top: 2px solid #4C7F62;
  border-left: 2px solid #4C7F62;
  z-index: 15;
  pointer-events: none;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* En hover, la esquina se estira sutilmente (detalle vivo, no invasivo) */
.product-card:hover .new-corner {
  width: 30px;
  height: 30px;
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
