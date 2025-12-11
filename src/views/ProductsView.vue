<script setup>
import ProductCard from '@/components/ProductCard.vue'
import { products } from '@/data/products' 
import { ref, computed } from 'vue'

const availableCategories = ['Anillos', 'Collares', 'Pendientes', 'Pulseras']
const selectedCategory = ref('Todos')

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Todos') {
    return products
  }
  return products.filter(p => p.category === selectedCategory.value)
})

const changeCategory = (category) => {
  selectedCategory.value = category
}
</script>

<template>
  <div class="bg-brand-black py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-serif-elegant text-brand-white text-center mb-10">
        Colección de Esmeraldas Finas
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <aside class="lg:col-span-1 p-6 bg-brand-black shadow-2xl rounded-lg h-fit sticky top-20 border border-brand-gold/20">
          <h2 class="text-xl font-serif-elegant text-brand-gold mb-4 border-b border-brand-gold/30 pb-2">
            Filtrar por Categoría
          </h2>
          <ul class="space-y-3">
            <li>
              <button @click="changeCategory('Todos')" 
                      :class="{'font-bold text-brand-primary': selectedCategory === 'Todos'}"
                      class="text-brand-white hover:text-brand-gold transition-colors font-sans-luxury">
                Todas las Joyas
              </button>
            </li>
            <li v-for="category in availableCategories" :key="category">
              <button @click="changeCategory(category)" 
                      :class="{'font-bold text-brand-primary': selectedCategory === category}"
                      class="text-brand-white hover:text-brand-gold transition-colors font-sans-luxury">
                {{ category }}
              </button>
            </li>
          </ul>
        </aside>

        <section class="lg:col-span-3">
          <div v-if="filteredProducts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id" 
              :product="product" 
            />
          </div>
          <div v-else class="text-center p-10 bg-brand-black/50 border border-brand-gold/20 rounded-lg">
            <p class="text-xl text-brand-white/70">No se encontraron joyas en esta categoría.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>