<script setup>
import { defineProps, computed } from 'vue';
import ProductCard from '@/components/ProductCard.vue';

const props = defineProps({
  relatedProducts: {
    type: Array,
    required: true,
    default: () => [] 
  }
});

// ✨ EL FILTRO INTELIGENTE ✨
// Interceptamos los productos que llegan y descartamos los agotados
const availableRelatedProducts = computed(() => {
  if (!props.relatedProducts) return [];
  // Solo devolvemos los que tienen al menos 1 unidad en stock
  return props.relatedProducts.filter(product => product.stock > 0);
});
</script>

<template>
  <section v-if="availableRelatedProducts.length > 0" class="related-products-section">
    <div class="flex justify-between items-end mb-12 border-b border-brand-white/10 pb-6">
      <h3 class="font-serif-elegant text-brand-white text-2xl uppercase tracking-widest">
        Joyas <span class="text-brand-gold">Relacionadas</span>
      </h3>
      <RouterLink 
        to="/coleccion" 
        class="text-brand-gold uppercase text-[10px] tracking-[0.2em] hover:opacity-70 transition-opacity"
      >
        Ver toda la colección
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      <ProductCard 
        v-for="product in availableRelatedProducts" 
        :key="product.id" 
        :product="product"
      />
    </div>
  </section>

  <div v-else class="py-20 text-center border-t border-brand-white/5">
    <p class="text-brand-white/30 uppercase text-[10px] tracking-[0.3em]">
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
</style>