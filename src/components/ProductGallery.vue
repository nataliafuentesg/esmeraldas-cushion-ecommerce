<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  }
});

const activeImage = ref(props.images[0]?.src || '');
const activeAlt = ref(props.images[0]?.alt || '');
// Estado para controlar el overlay de zoom
const isZoomed = ref(false); 

const setActiveImage = (image) => {
    activeImage.value = image.src;
    activeAlt.value = image.alt;
};

// Función que abre y cierra el overlay de zoom
const toggleZoom = () => {
    isZoomed.value = !isZoomed.value;
};
</script>

<template>
  <div class="flex flex-col-reverse lg:flex-row gap-4">
    
    <div class="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
      <div v-for="image in images" :key="image.id" 
           @click="setActiveImage(image)"
           class="flex-shrink-0 w-20 h-20 border cursor-pointer transition-all duration-200"
           :class="{'border-brand-gold': activeImage === image.src, 'border-brand-white/20': activeImage !== image.src}">
        <img :src="`/src/assets/images/products/${image.src}`" 
             :alt="image.alt" 
             class="w-full h-full object-cover">
      </div>
    </div>
    
    <div class="relative flex-1 bg-brand-white/5 aspect-square">
        <img :src="`/src/assets/images/products/${activeImage}`" 
             :alt="productName + ' - ' + activeAlt" 
             class="w-full h-full object-contain transition-transform duration-500">
        
        <button @click="toggleZoom" 
                class="absolute bottom-4 right-4 p-3 bg-brand-black/70 rounded-full 
                       text-brand-white hover:bg-brand-gold transition-colors duration-300 z-10">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </button>
    </div>
  </div>
    
  <div v-if="isZoomed" @click="toggleZoom" 
       class="fixed inset-0 bg-brand-black/95 z-50 flex justify-center items-center cursor-zoom-out p-4">
      <div class="relative max-w-5xl max-h-full">
          <img :src="`/src/assets/images/products/${activeImage}`" 
               :alt="productName + ' - Zoom'" 
               class="w-full h-auto max-h-[90vh] object-contain shadow-2xl border border-brand-gold/50"
          >
          <button @click.stop="toggleZoom" class="absolute top-4 right-4 text-brand-white hover:text-brand-gold text-4xl font-light leading-none">
              &times;
          </button>
          <p class="text-center text-brand-white/70 mt-4 text-sm font-sans-luxury">
             Clic en cualquier parte para cerrar. (Aquí iría la imagen de alta resolución para inspección).
          </p>
      </div>
  </div>
</template>