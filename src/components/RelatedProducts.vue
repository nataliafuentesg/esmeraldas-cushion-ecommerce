<script setup>
import { defineProps } from 'vue';
import ProductCard from '@/components/ProductCard.vue';

const props = defineProps({
  // Cambiamos el nombre a 'products' para que sea más genérico o 
  // asegúrate de que en ProductDetail.vue lo pases como :relatedProducts
  relatedProducts: {
    type: Array,
    required: true,
    default: () => [] // Si falla el back, llega un array vacío y no se rompe
  }
});
</script>

<template>
  <section v-if="relatedProducts && relatedProducts.length > 0" class="related-products-section">
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
        v-for="product in relatedProducts" 
        :key="product.id" 
        :product="product"
      />
    </div>
  </section>

  <div v-else class="py-20 text-center border-t border-brand-white/5">
    <p class="text-brand-white/30 uppercase text-[10px] tracking-[0.3em]">
      Explora piezas exclusivas en nuestra colección completa
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