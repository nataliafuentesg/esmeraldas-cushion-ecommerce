<script setup>
import { ref, watch } from 'vue';
import { cloudinaryOptimize } from '@/utils/cloudinary';

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  productName: {
    type: String,
    required: true,
    default: 'Joya Cushion'
  }
});

const activeImage = ref('');
const activeImgLoaded = ref(false);
const fallbackImage = 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1774902043/2U5A4648_rr9snu.jpg';

watch(() => props.images, (newImages) => {
  if (newImages && newImages.length > 0) {
    activeImage.value = newImages[0].imageUrl;
  } else {
    activeImage.value = fallbackImage;
  }
}, { immediate: true });

// Reset skeleton al cambiar de imagen activa
watch(activeImage, () => { activeImgLoaded.value = false; });

const setActiveImage = (image) => {
  activeImage.value = image.imageUrl;
};

// --- ✨ LA MAGIA DEL ZOOM NATIVO ✨ ---
const isZooming = ref(false);
const zoomStyle = ref({});

// Esta función calcula dónde está tu mouse y mueve la imagen
const handleMouseMove = (event) => {
  // Obtenemos las dimensiones de la caja de la foto
  const { left, top, width, height } = event.target.getBoundingClientRect();
  
  // Calculamos el porcentaje X y Y donde está el mouse
  const x = ((event.clientX - left) / width) * 100;
  const y = ((event.clientY - top) / height) * 100;
  
  // Aplicamos el zoom y el origen del movimiento
  zoomStyle.value = {
    transformOrigin: `${x}% ${y}%`,
    transform: 'scale(2.5)' // Nivel de aumento (250%). ¡Puedes subirlo a 3 o bajarlo a 2!
  };
};

const handleMouseEnter = () => {
  isZooming.value = true;
};

const handleMouseLeave = () => {
  isZooming.value = false;
  // Reiniciamos la foto a su estado normal
  zoomStyle.value = {
    transformOrigin: 'center center',
    transform: 'scale(1)'
  };
};
</script>

<template>
  <div class="flex flex-col-reverse lg:flex-row gap-4">
    
    <div v-if="images && images.length > 1" class="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
      <div v-for="(image, index) in images" :key="index"
           @click="setActiveImage(image)"
           class="flex-shrink-0 w-20 h-20 border cursor-pointer transition-all duration-200"
           :class="{'border-brand-gold': activeImage === image.imageUrl, 'border-brand-white/20': activeImage !== image.imageUrl}">
        <img
          :src="cloudinaryOptimize(image.imageUrl, { width: 200 })"
          :alt="`${productName} - vista ${index + 1}`"
          loading="lazy"
          class="w-full h-full object-cover"
        >
      </div>
    </div>
    
    <div class="relative flex-1 bg-brand-black/5 aspect-square overflow-hidden border border-brand-white/10 cursor-crosshair"
         @mousemove="handleMouseMove"
         @mouseenter="handleMouseEnter"
         @mouseleave="handleMouseLeave">

        <!-- Skeleton shimmer mientras carga la imagen activa -->
        <div v-if="!activeImgLoaded" class="absolute inset-0 z-10 gallery-skeleton pointer-events-none"></div>

        <img
          :src="cloudinaryOptimize(activeImage, { width: 1200, quality: 'auto:best' })"
          :alt="productName"
          fetchpriority="high"
          class="w-full h-full object-cover transition-all duration-500 ease-out"
          :class="activeImgLoaded ? 'opacity-100' : 'opacity-0'"
          :style="isZooming ? zoomStyle : {}"
          @load="activeImgLoaded = true"
        />

        <div class="absolute bottom-4 right-4 bg-brand-black/80 p-3 rounded-full border border-brand-white/10 text-brand-gold transition-opacity duration-300 pointer-events-none"
             :class="(isZooming || !activeImgLoaded) ? 'opacity-0' : 'opacity-100'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
        </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.07) 40%,
    rgba(255, 255, 255, 0.03) 100%
  );
  background-size: 200% 100%;
  animation: gallery-shimmer 1.6s ease-in-out infinite;
}

@keyframes gallery-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>