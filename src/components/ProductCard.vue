<script setup>
import { defineProps, ref, computed } from 'vue';
import { RouterLink } from 'vue-router'; // Necesario para la navegación

const props = defineProps({
  product: {
    type: Object,
    required: true,
  }
});

// Estado para manejar si el ratón está sobre la tarjeta
const isHovering = ref(false);

// La imagen actual mostrada depende del estado de hover
const currentImage = computed(() => {
    // Si isHovering es true Y existe una hoverImage, la mostramos. De lo contrario, mainImage.
    return isHovering.value && props.product.hoverImage 
        ? props.product.hoverImage 
        : props.product.mainImage;
});

</script>

<template>
  <RouterLink :to="`/detalle/${product.slug}`" 
      class="block bg-brand-black group overflow-hidden relative shadow-lg 
             border border-brand-primary/10 transition-shadow duration-300"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false">
      
      <div class="aspect-square relative overflow-hidden bg-brand-white/5">
          <img 
              :src="`/src/assets/images/products/${currentImage}`" 
              :alt="product.name" 
              class="w-full h-full object-cover transition-transform duration-500 
                     group-hover:scale-105"
          />
      </div>

      <div class="p-4 text-center">
          <h3 class="text-sm uppercase font-sans-luxury text-brand-white 
                     group-hover:text-brand-gold transition-colors duration-300">
              {{ product.name }}
          </h3>
          <p class="text-lg font-serif-elegant text-brand-gold mt-1">
              $ {{ product.price.toLocaleString() }}
          </p>
      </div>
  </RouterLink>
</template>