<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import ProductCard from '../components/ProductCard.vue'; // Reutilizamos lo que funciona

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(true);

// Categorías reales en tu Base de Datos
const realCategories = ['Piedras Sueltas', 'Anillos', 'Aretes', 'Collares', 'Pulseras'];
// Categorías para el menú (incluimos "Todas" y "Joyas" como conceptos visuales)
const filterMenu = ['Todas', 'Joyas', 'Piedras Sueltas', 'Anillos', 'Aretes', 'Collares', 'Pulseras'];

const selectedCategory = ref('Todas');

const loadData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/products');
    products.value = response.data;
    applyUrlFilter();
  } catch (error) {
    console.error("Error al cargar la colección:", error);
  } finally {
    loading.value = false;
  }
};

// --- LÓGICA DE FILTRADO MEJORADA ---
const applyUrlFilter = () => {
  const urlParam = route.params.category?.toLowerCase();
  
  if (!urlParam) {
    selectedCategory.value = 'Todas';
    return;
  }

  if (urlParam === 'esmeraldas') {
    selectedCategory.value = 'Piedras Sueltas';
  } else if (urlParam === 'joyas') {
    selectedCategory.value = 'Joyas';
  } else {
    // Busca coincidencia exacta (ej: anillos, collares)
    const match = filterMenu.find(cat => cat.toLowerCase() === urlParam);
    selectedCategory.value = match || 'Todas';
  }
};

const setCategory = (cat) => {
  selectedCategory.value = cat;
  // Actualizamos la URL para que el usuario pueda compartir el link filtrado
  if (cat === 'Todas') router.replace('/coleccion');
  else if (cat === 'Piedras Sueltas') router.replace('/coleccion/esmeraldas');
  else if (cat === 'Joyas') router.replace('/coleccion/joyas');
  else router.replace(`/coleccion/${cat.toLowerCase()}`);
};

// --- EL FILTRO INTELIGENTE ---
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Todas') {
    return products.value;
  }
  
  if (selectedCategory.value === 'Joyas') {
    // EXCLUYE Piedras Sueltas, incluye el resto
    return products.value.filter(p => p.category !== 'Piedras Sueltas');
  }

  // Filtro por categoría exacta
  return products.value.filter(p => p.category === selectedCategory.value);
});

watch(() => route.params.category, applyUrlFilter);
onMounted(loadData);
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-10 pb-20">
    <header class="container mx-auto px-4 text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-serif-elegant text-brand-white mb-4 tracking-[0.2em] uppercase">
        <span v-if="selectedCategory === 'Todas'">Nuestra Colección</span>
        <span v-else-if="selectedCategory === 'Piedras Sueltas'">Esmeraldas</span>
        <span v-else>{{ selectedCategory }}</span>
      </h1>
      <div class="h-[1px] w-20 bg-brand-gold mx-auto mb-6"></div>
    </header>

    <div v-if="loading" class="text-center py-20">
      <p class="text-brand-gold animate-pulse font-sans-luxury tracking-[0.3em] uppercase text-[10px]">
        Cargando Tesoros...
      </p>
    </div>

    <template v-else>
      <section class="container mx-auto px-4 mb-16 overflow-x-auto">
        <div class="flex justify-center gap-8 min-w-max pb-4 border-b border-brand-white/10">
          <button 
            v-for="cat in filterMenu" 
            :key="cat"
            @click="setCategory(cat)"
            class="filter-btn"
            :class="{ 'active': selectedCategory === cat }"
          >
            {{ cat }}
          </button>
        </div>
      </section>

      <main class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="filteredProducts.length === 0" class="empty-state">
           <p>No se encontraron piezas en esta selección.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.id"
            :product="product" 
          />
        </div>
      </main>
    </template>
  </div>
</template>

<style scoped>
@reference "../assets/main.css";

.filter-btn {
  @apply text-[10px] uppercase tracking-[0.2em] transition-all duration-300 text-brand-white/40 pb-2 border-b border-transparent;
}

.filter-btn:hover {
  @apply text-brand-gold;
}

.filter-btn.active {
  @apply text-brand-gold border-brand-gold;
}

.empty-state {
  @apply text-center py-20 border border-brand-white/5 bg-brand-white/[0.02] 
         text-brand-white/30 font-sans-luxury text-[10px] uppercase tracking-widest;
}

/* Animación de entrada de la grilla */
.grid {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>