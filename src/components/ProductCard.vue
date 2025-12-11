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
    <RouterLink 
        :to="{ name: 'product-detail', params: { slug: product.slug } }"
        class="group block bg-brand-black text-brand-white transition-shadow duration-300 relative overflow-hidden"
    >
        <div class="w-full aspect-square relative overflow-hidden">
            <img 
                :src="`/src/assets/images/products/${product.mainImage}`" 
                :alt="product.name" 
                class="w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
            />
            <img 
                :src="`/src/assets/images/products/${product.hoverImage}`" 
                :alt="product.name + ' - Vista alternativa'" 
                class="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
            />
        </div>

        <div class="p-4 text-center">
            <h3 class="text-xl font-serif-elegant mb-1 tracking-wider group-hover:text-brand-gold transition-colors duration-300">
                {{ product.name }}
            </h3>
            <p class="text-lg font-sans-luxury text-brand-white/70">
                $ {{ product.price.toLocaleString() }}
            </p>
        </div>
        
    </RouterLink>
</template>