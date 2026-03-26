<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'; // <--- IMPORTANTE
import { useCartStore } from '@/stores/cart';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const route = useRoute(); // Para acceder a /coleccion/:category
const cartStore = useCartStore();

const products = ref([]);
const loading = ref(true);
const selectedCategory = ref('Todas');

// Categorías para los botones de filtro interno
const categories = ['Todas', 'Piedras Sueltas', 'Anillos', 'Aretes', 'Collares'];

// Función para cargar productos
const loadData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/products');
    let allProducts = response.data;

    // LÓGICA DE FILTRADO POR URL:
    // Si la URL es /coleccion/esmeraldas, filtramos solo esmeraldas
    const urlCategory = route.params.category?.toLowerCase();
    
    if (urlCategory === 'esmeraldas') {
      products.value = allProducts.filter(p => p.category.toLowerCase().includes('esmeralda') || p.category === 'Piedras Sueltas');
    } else if (urlCategory === 'joyas') {
      products.value = allProducts.filter(p => p.category !== 'Piedras Sueltas');
    } else {
      products.value = allProducts;
    }
  } catch (error) {
    console.error("Error al cargar la colección:", error);
  } finally {
    loading.value = false;
  }
};

// Re-cargar datos si el parámetro de la URL cambia
watch(() => route.params.category, () => {
  selectedCategory.value = 'Todas'; // Resetear filtro interno
  loadData();
});

onMounted(loadData);

const getProductImage = (product) => {
  return product.images && product.images.length > 0 
    ? product.images[0].imageUrl 
    : 'https://via.placeholder.com/400x500?text=Cushion+Jewelry';
};

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Todas') return products.value;
  return products.value.filter(p => p.category === selectedCategory.value);
});

const addToCart = (product) => {
  const productWithImage = { ...product, mainImage: getProductImage(product) };
  cartStore.addItem(productWithImage, 1);
};
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-10 pb-20">
    <header class="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-serif-elegant text-brand-white mb-4 tracking-widest uppercase">
  {{ route.params.category ? route.params.category : 'Nuestra Colección' }}
</h1>
      <p class="text-brand-white/60 font-sans-luxury max-w-2xl mx-auto uppercase text-xs tracking-[0.3em]">
        Selección curada de las esmeraldas colombianas más finas y joyería artesanal.
      </p>
    </header>

    <div v-if="loading" class="text-center py-20">
      <p class="text-brand-gold animate-pulse font-sans-luxury tracking-[0.3em] uppercase text-xs">
        Cargando Tesoros...
      </p>
    </div>

    <template v-else>
      <section class="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 border-b border-brand-white/10 pb-8">
        <div class="flex flex-wrap justify-center gap-8">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            class="text-xs uppercase tracking-[0.2em] transition-colors duration-300"
            :class="selectedCategory === cat ? 'text-brand-gold border-b border-brand-gold pb-1' : 'text-brand-white/50 hover:text-brand-gold'"
          >
            {{ cat }}
          </button>
        </div>
      </section>

      <main class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            class="group relative"
          >
            <div class="aspect-[3/4] overflow-hidden bg-brand-white/5 relative border border-brand-white/5">
              <img 
                :src="getProductImage(product)" 
                :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <span v-if="product.featured" class="absolute top-4 left-4 bg-brand-gold/90 text-brand-black px-3 py-1 text-[10px] uppercase font-bold tracking-tighter">
                Exclusivo
              </span>

              <div class="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button 
                  @click="addToCart(product)"
                  class="bg-brand-white text-brand-black px-6 py-3 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-brand-gold transition-colors duration-300 flex items-center space-x-2"
                >
                  <Icon icon="lucide:shopping-bag" class="w-4 h-4" />
                  <span>Añadir al Carrito</span>
                </button>
              </div>
            </div>

            <div class="mt-6 text-center">
              <p class="text-[10px] text-brand-gold uppercase tracking-[0.2em] mb-1">{{ product.category }}</p>
              <h3 class="text-brand-white font-serif-elegant text-lg tracking-wider mb-2 group-hover:text-brand-gold transition-colors">
                {{ product.name }}
              </h3>
              <p class="text-brand-white/80 font-sans-luxury text-sm tracking-widest">
                ${{ product.price.toLocaleString() }}
              </p>
            </div>

            <RouterLink :to="`/producto/${product.slug}`" class="absolute inset-x-0 top-0 h-[80%] z-0" />
          </div>
        </div>
      </main>
    </template>
  </div>
</template>

<style scoped>
.group {
  transition: all 0.4s ease-in-out;
}
</style>