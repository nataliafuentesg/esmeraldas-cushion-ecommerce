<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import ProductCard from '@/components/ProductCard.vue';
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(true);

// Estados para Paginación y Scroll
const displayLimit = ref(12);
const showBackToTop = ref(false);

const selectedCategory = ref('Todas');

// --- MENÚS DE FILTRADO DINÁMICOS ---
// Extrae categorías únicas directamente de los productos cargados
const typeFilters = computed(() => {
  const cats = products.value.map(p => p.category).filter(Boolean);
  const uniqueCats = [...new Set(cats)].sort();
  // 'Todas' y 'Joyas' siempre irán de primeras por diseño
  return ['Todas', 'Joyas', ...uniqueCats.filter(c => c !== 'Piedras Sueltas'), 'Piedras Sueltas'];
});

// Extrae colecciones/ocasiones únicas de los arreglos de ocasiones
const occasionFilters = computed(() => {
  const occs = products.value.flatMap(p => p.occasions || []).filter(Boolean);
  return [...new Set(occs)].sort();
});

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

const applyUrlFilter = () => {
  const urlParam = route.params.category?.toLowerCase();
  
  if (!urlParam) {
    selectedCategory.value = 'Todas';
    return;
  }

  if (urlParam === 'esmeraldas') {
    selectedCategory.value = 'Piedras Sueltas';
  } else {
    // Busca en los filtros dinámicos
    const allFilters = [...typeFilters.value, ...occasionFilters.value];
    const match = allFilters.find(cat => cat.toLowerCase() === urlParam);
    selectedCategory.value = match || 'Todas';
  }
};

const setCategory = (cat) => {
  selectedCategory.value = cat;
  displayLimit.value = 12; // Reiniciar el límite al cambiar de categoría
  
  if (cat === 'Todas') router.replace('/coleccion');
  else if (cat === 'Piedras Sueltas') router.replace('/coleccion/esmeraldas');
  else router.replace(`/coleccion/${cat.toLowerCase()}`);
};

// --- MOTOR DE FILTRADO ---
const filteredProducts = computed(() => {
  const inStock = products.value.filter(p => p.stock > 0);

  if (selectedCategory.value === 'Todas') return inStock;
  
  if (selectedCategory.value === 'Joyas') {
    return inStock.filter(p => p.category !== 'Piedras Sueltas');
  }

  if (occasionFilters.value.includes(selectedCategory.value)) {
    return inStock.filter(p => p.occasions && p.occasions.includes(selectedCategory.value));
  }

  return inStock.filter(p => p.category && p.category.toLowerCase() === selectedCategory.value.toLowerCase());
});

// --- MOTOR DE PAGINACIÓN ---
const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayLimit.value);
});

const loadMore = () => {
  displayLimit.value += 12;
};

// --- LÓGICA DE SCROLL ---
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 400;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch(() => route.params.category, () => {
  applyUrlFilter();
  displayLimit.value = 12; // Al navegar por URL, volver a 12 items
});

onMounted(() => {
  loadData();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-10 pb-20 font-sans relative">
    
    <header class="container mx-auto px-4 text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-serif-elegant text-brand-white mb-4 tracking-[0.2em] uppercase">
        <span v-if="selectedCategory === 'Todas'">Nuestra Colección</span>
        <span v-else-if="selectedCategory === 'Piedras Sueltas'">Esmeraldas Sueltas</span>
        <span v-else>{{ selectedCategory }}</span>
      </h1>
      <div class="h-[1px] w-20 bg-brand-gold mx-auto mb-6"></div>
      <p class="text-brand-white/40 font-sans-luxury text-xs uppercase tracking-widest max-w-xl mx-auto">
        Alta joyería diseñada en Bogotá. Piezas exclusivas forjadas con la pureza de las montañas colombianas.
      </p>
    </header>

    <div class="container mx-auto px-4 lg:px-8">
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-32">
        <Icon icon="line-md:loading-twotone-loop" class="text-brand-gold w-12 h-12 mb-4" />
        <p class="text-brand-gold font-sans-luxury tracking-[0.3em] uppercase text-[10px]">Accediendo a Bóveda...</p>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-12 xl:gap-20">
        
        <aside class="w-full lg:w-64 lg:shrink-0 lg:sticky lg:top-24 h-fit">
          
          <div class="mb-10">
            <h3 class="text-brand-white font-serif-elegant text-lg uppercase tracking-widest mb-6 border-b border-brand-white/10 pb-4">Tipo de Pieza</h3>
            <ul class="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
              <li v-for="cat in [...new Set(typeFilters)]" :key="cat" class="shrink-0">
                <button 
                  @click="setCategory(cat)" 
                  class="text-[10px] uppercase tracking-[0.2em] transition-all duration-300 w-full text-left flex items-center group"
                  :class="selectedCategory === cat ? 'text-brand-gold font-bold' : 'text-brand-white/50 hover:text-brand-white'"
                >
                  <span v-if="selectedCategory === cat" class="w-1.5 h-1.5 bg-brand-gold rounded-full mr-2 shrink-0"></span>
                  <span v-else class="w-1.5 h-1.5 bg-transparent rounded-full mr-2 group-hover:bg-brand-white/30 transition-colors shrink-0"></span>
                  {{ cat }}
                </button>
              </li>
            </ul>
          </div>

          <div v-if="occasionFilters.length > 0">
            <h3 class="text-brand-white font-serif-elegant text-lg uppercase tracking-widest mb-6 border-b border-brand-white/10 pb-4">Colecciones</h3>
            <ul class="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
              <li v-for="occ in occasionFilters" :key="occ" class="shrink-0">
                <button 
                  @click="setCategory(occ)" 
                  class="text-[10px] uppercase tracking-[0.2em] transition-all duration-300 w-full text-left flex items-center group"
                  :class="selectedCategory === occ ? 'text-brand-gold font-bold' : 'text-brand-white/50 hover:text-brand-white'"
                >
                  <span v-if="selectedCategory === occ" class="w-1 h-1 bg-brand-gold transform rotate-45 mr-2 shrink-0"></span>
                  <span v-else class="w-1 h-1 border border-brand-white/30 transform rotate-45 mr-2 group-hover:border-brand-white transition-colors shrink-0"></span>
                  {{ occ }}
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <main class="flex-1">
          <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center text-center py-20 border border-brand-white/5 bg-brand-white/[0.01]">
            <Icon icon="lucide:gem" class="w-12 h-12 text-brand-white/10 mb-4" />
            <p class="text-brand-white/40 font-sans-luxury text-xs uppercase tracking-widest">
              Las piezas de esta colección están actualmente agotadas o en producción.
            </p>
            <button @click="setCategory('Todas')" class="mt-6 border border-brand-gold text-brand-gold px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-gold hover:text-black transition-colors">
              Ver Catálogo Completo
            </button>
          </div>
          
          <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 fadeIn">
              <ProductCard 
                v-for="product in displayedProducts" 
                :key="product.id"
                :product="product" 
              />
            </div>

            <div v-if="displayedProducts.length < filteredProducts.length" class="mt-20 flex justify-center">
              <button 
                @click="loadMore"
                class="border border-brand-gold/50 text-brand-gold px-10 py-3 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-brand-gold hover:text-brand-black transition-colors duration-300"
              >
                Explorar más piezas ({{ filteredProducts.length - displayedProducts.length }} restantes)
              </button>
            </div>
          </div>
        </main>

      </div>
    </div>

    <Transition name="fade">
      <button 
        v-if="showBackToTop" 
        @click="scrollToTop" 
        class="fixed bottom-8 right-8 z-40 bg-brand-black border border-brand-gold text-brand-gold p-3 shadow-lg shadow-black/50 hover:bg-brand-gold hover:text-brand-black transition-all duration-300 group"
        aria-label="Volver arriba"
      >
        <Icon icon="lucide:arrow-up" class="w-5 h-5 transform group-hover:-translate-y-1 transition-transform" />
      </button>
    </Transition>

  </div>
</template>

<style scoped>
@reference "../assets/main.css";

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fadeIn {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Transición suave para el botón flotante */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>