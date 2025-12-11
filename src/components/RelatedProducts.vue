<script setup>
import { defineProps } from 'vue';
import ProductCard from '@/components/ProductCard.vue'; // Reutilizar la tarjeta de producto

const props = defineProps({
  relatedProducts: {
    type: Array,
    required: true,
  }
});
</script>

<template>
  <div v-if="relatedProducts.length > 0">
    <h2 class="text-3xl font-serif-elegant text-brand-white text-center mb-10 border-b border-brand-gold/50 pb-4 uppercase tracking-widest">
      Quizá Te Interese
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <ProductCard 
        v-for="product in relatedProducts" 
        :key="product.id" 
        :product="product"
      />
    </div>
  </div>
</template>