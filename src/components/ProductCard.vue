<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  product: { 
    type: Object, 
    required: true 
  }
});
const mainImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    return props.product.images[0].imageUrl;
  }
  return 'https://images.unsplash.com/photo-1588444837495-c6cfaf50c8a9?q=80&w=800'; 
});

const hoverImage = computed(() => {
  if (props.product.images && props.product.images.length > 1) {
    return props.product.images[1].imageUrl;
  }
  return null;
});
</script>

<template>
  <RouterLink 
    :to="{ name: 'product-detail', params: { slug: product.slug } }"
    class="group block bg-brand-black text-brand-white transition-all duration-500"
  >
    <div class="aspect-square overflow-hidden relative bg-brand-white/5">
      
      <img 
        :src="mainImage" 
        :alt="product.name" 
        class="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
        :class="{ 'group-hover:opacity-0': hoverImage }"
      />

      <img 
        v-if="hoverImage"
        :src="hoverImage" 
        :alt="product.name + ' vista alternativa'" 
        class="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
      />
      
      <span 
        v-if="product.featured" 
        class="absolute top-4 left-4 bg-brand-gold/90 text-brand-black px-3 py-1 text-[10px] font-bold uppercase tracking-tighter z-10"
      >
        Exclusivo
      </span>
    </div>

    <div class="p-6 text-center">
      <p class="text-[10px] text-brand-gold uppercase tracking-[0.2em] mb-1">
        {{ product.category }}
      </p>
      <h3 class="font-serif-elegant text-lg tracking-wider mb-2 group-hover:text-brand-gold transition-colors duration-300">
        {{ product.name }}
      </h3>
      <p class="font-sans-luxury text-brand-white/70 text-sm tracking-widest">
        $ {{ product.price.toLocaleString() }}
      </p>
    </div>
  </RouterLink>
</template>

<style scoped>
.group:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
</style>