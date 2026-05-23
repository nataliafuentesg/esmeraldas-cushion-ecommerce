<script>
export default {
  name: 'CollectionView'
}
</script>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, onActivated } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import api from '@/api/axios';
import ProductCard from '@/components/ProductCard.vue';
import OccasionBadges from '@/components/OccasionBadges.vue';
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(true); 

const displayLimit = ref(12);
const showBackToTop = ref(false);
const selectedCategory = ref('Todas');

const maxPriceRange = ref(50000000); 
const selectedMaxPrice = ref(50000000);
const sortBy = ref('default'); 

const lastViewedProductId = ref(null);

const restoreScrollSafely = () => {
  const savedState = sessionStorage.getItem('collection_state');
  const cameFromCollection = sessionStorage.getItem('came_from_collection') === 'true';

  if (cameFromCollection && savedState) {
    const { scrollPosition } = JSON.parse(savedState);
    
    window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    
    setTimeout(() => { 
      window.scrollTo({ top: scrollPosition, behavior: 'instant' }); 
    }, 40);
    
    setTimeout(() => {
      window.scrollTo({ top: scrollPosition, behavior: 'instant' });
      sessionStorage.removeItem('collection_state');
      sessionStorage.removeItem('came_from_collection');
    }, 120);
  }
};

onActivated(() => {
  const savedLastViewed = sessionStorage.getItem('last_viewed_product_id');
  if (savedLastViewed) {
    lastViewedProductId.value = parseInt(savedLastViewed);
    setTimeout(() => {
      lastViewedProductId.value = null;
      sessionStorage.removeItem('last_viewed_product_id');
    }, 5000);
  }
  
  if (!loading.value) {
    restoreScrollSafely();
  }
});

onBeforeRouteLeave((to, from) => {
  if (to.name === 'product-detail') {
    const sessionState = {
      scrollPosition: window.scrollY,
      selectedCategory: selectedCategory.value,
      displayLimit: displayLimit.value,
      selectedMaxPrice: selectedMaxPrice.value,
      sortBy: sortBy.value
    };
    sessionStorage.setItem('collection_state', JSON.stringify(sessionState));
    sessionStorage.setItem('came_from_collection', 'true');
    
    const targetedProduct = products.value.find(p => p.slug === to.params.slug);
    if (targetedProduct) {
      sessionStorage.setItem('last_viewed_product_id', targetedProduct.id);
    }
  } else {
    clearCollectionSession();
  }
});

const clearCollectionSession = () => {
  sessionStorage.removeItem('collection_state');
  sessionStorage.removeItem('last_viewed_product_id');
  sessionStorage.removeItem('came_from_collection');
};

const typeFilters = computed(() => {
  const cats = products.value.map(p => p.category).filter(Boolean);
  const uniqueCats = [...new Set(cats)].sort();
  return ['Todas', 'Joyas', ...uniqueCats.filter(c => c !== 'Piedras Sueltas'), 'Piedras Sueltas'];
});

const occasionFilters = computed(() => {
  const occs = products.value.flatMap(p => p.occasions || []).filter(Boolean);
  return [...new Set(occs)].sort();
});

const loadData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/products');
    products.value = response.data;

    if (products.value.length > 0) {
      const highestPrice = Math.max(...products.value.map(p => p.price));
      maxPriceRange.value = highestPrice;
    }
    
    const savedState = sessionStorage.getItem('collection_state');
    if (savedState && sessionStorage.getItem('came_from_collection') === 'true') {
      const state = JSON.parse(savedState);
      selectedCategory.value = state.selectedCategory;
      displayLimit.value = state.displayLimit;
      selectedMaxPrice.value = state.selectedMaxPrice <= maxPriceRange.value ? state.selectedMaxPrice : maxPriceRange.value;
      sortBy.value = state.sortBy || 'default';
    } else {
      selectedMaxPrice.value = maxPriceRange.value;
      readCategoryFromUrl(); 
    }

  } catch (error) {
    console.error("Error al cargar la colección:", error);
  } finally {
    loading.value = false; 
    setTimeout(() => {
      restoreScrollSafely();
    }, 20);
  }
};

const readCategoryFromUrl = () => {
  const urlParam = route.params.category?.toLowerCase();
  if (!urlParam) {
    selectedCategory.value = 'Todas';
    return;
  }
  if (urlParam === 'esmeraldas') {
    selectedCategory.value = 'Piedras Sueltas';
  } else {
    const allFilters = [...typeFilters.value, ...occasionFilters.value];
    const match = allFilters.find(cat => cat.toLowerCase() === urlParam);
    selectedCategory.value = match || 'Todas';
  }
};

const setCategory = (cat) => {
  selectedCategory.value = cat;
  displayLimit.value = 12; 

  let newPath = '/coleccion';
  if (cat !== 'Todas') {
    newPath = cat === 'Piedras Sueltas' ? '/coleccion/esmeraldas' : `/coleccion/${cat.toLowerCase()}`;
  }
  
  router.replace(newPath).catch(err => {
    if (err.name !== 'NavigationDuplicated') console.error(err);
  });
};

const filteredProducts = computed(() => {
  let list = products.value.filter(p => p.stock > 0 && p.price <= selectedMaxPrice.value);

  if (selectedCategory.value !== 'Todas') {
    if (selectedCategory.value === 'Joyas') {
      list = list.filter(p => p.category !== 'Piedras Sueltas');
    } else if (occasionFilters.value.includes(selectedCategory.value)) {
      list = list.filter(p => p.occasions && p.occasions.includes(selectedCategory.value));
    } else {
      list = list.filter(p => p.category && p.category.toLowerCase() === selectedCategory.value.toLowerCase());
    }
  }

  if (sortBy.value === 'price-asc') return list.sort((a, b) => a.price - b.price); 
  if (sortBy.value === 'price-desc') return list.sort((a, b) => b.price - a.price); 

  return list; 
});

const displayedProducts = computed(() => filteredProducts.value.slice(0, displayLimit.value));
const loadMore = () => { displayLimit.value += 12; };
const handleScroll = () => { showBackToTop.value = window.scrollY > 300; };
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

watch(() => route.params.category, () => {
  readCategoryFromUrl();
});

onMounted(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  loadData();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="bg-brand-black min-h-[110vh] pt-10 pb-24 font-sans relative">
    
    <header class="container mx-auto px-4 text-center mb-10">
      <h1 class="text-3xl md:text-5xl font-serif-elegant text-brand-white mb-4 tracking-[0.2em] uppercase">
        <span v-if="selectedCategory === 'Todas'">Nuestra Colección</span>
        <span v-else-if="selectedCategory === 'Piedras Sueltas'">Esmeraldas Sueltas</span>
        <span v-else>{{ selectedCategory }}</span>
      </h1>
      <div class="h-[1px] w-20 bg-brand-gold mx-auto mb-6"></div>
    </header>

    <div class="container mx-auto px-4 lg:px-8">
      
      <div class="mb-12 border-b border-brand-white/10 pb-8">
        <OccasionBadges 
          :occasions="occasionFilters" 
          :is-home="false" 
          :current-selection="selectedCategory"
          @select-category="setCategory" 
        />
      </div>

      <div v-if="loading" class="flex flex-col lg:flex-row gap-8 xl:gap-16 dynamic-skeleton-view">
        <aside class="w-full lg:w-56 space-y-6 opacity-30 animate-pulse">
          <div class="h-4 bg-brand-white/20 w-32"></div>
          <div class="space-y-2">
            <div class="h-8 bg-brand-white/10 w-full" v-for="n in 5" :key="n"></div>
          </div>
        </aside>
        <main class="flex-1">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12">
            <div v-for="i in 6" :key="i" class="space-y-4 animate-pulse">
              <div class="aspect-square bg-brand-white/[0.03] border border-brand-white/5 w-full"></div>
              <div class="h-3 bg-brand-white/20 w-3/4 mx-auto"></div>
              <div class="h-3 bg-brand-gold/20 w-1/2 mx-auto"></div>
            </div>
          </div>
        </main>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8 xl:gap-16 entry-fade">
        
        <aside class="w-full lg:w-56 lg:shrink-0 lg:sticky lg:top-24 h-fit z-10 py-2 md:py-0 space-y-8">
          <div>
            <h3 class="hidden lg:block text-brand-white font-serif-elegant text-xs uppercase tracking-[0.3em] mb-5 border-b border-brand-white/10 pb-4">Línea de Joyería</h3>
            <ul class="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-3 lg:pb-0 hide-scrollbar snap-x px-2 lg:px-0">
              <li v-for="cat in typeFilters" :key="cat" class="shrink-0 snap-center">
                <button 
                  @click="setCategory(cat)" 
                  class="text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all duration-300 px-4 py-2.5 lg:px-0 lg:py-1.5 border border-brand-white/10 lg:border-0 bg-brand-white/[0.02] lg:bg-transparent flex items-center w-full text-left"
                  :class="selectedCategory === cat ? 'text-brand-gold border-brand-gold/50 font-bold bg-brand-gold/5' : 'text-brand-white/50 hover:text-brand-white'"
                >
                  <span v-if="selectedCategory === cat" class="hidden lg:inline-block w-1.5 h-1.5 bg-brand-gold rounded-full mr-2 shrink-0"></span>
                  {{ cat }}
                </button>
              </li>
            </ul>
          </div>

          <div class="px-2 lg:px-0 pt-4 lg:pt-0 border-t border-brand-white/10 lg:border-0">
            <h3 class="text-brand-white font-serif-elegant text-xs uppercase tracking-[0.3em] mb-4">Rango de Inversión</h3>
            <div class="space-y-3">
              <input 
                type="range" 
                :min="0" 
                :max="maxPriceRange" 
                v-model.number="selectedMaxPrice"
                class="w-full accent-brand-gold bg-brand-white/10 h-[2px] cursor-pointer appearance-none"
              />
              <div class="flex justify-between items-center text-[10px] uppercase tracking-widest text-brand-white/50 font-sans-luxury">
                <span>$ 0</span>
                <span class="text-brand-gold font-bold bg-brand-gold/10 px-2 py-0.5 border border-brand-gold/20">
                  Hasta: $ {{ selectedMaxPrice.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main class="flex-1">
          <div class="flex flex-row justify-between items-center mb-8 pb-4 border-b border-brand-white/5 px-2 lg:px-0">
            <span class="text-[10px] uppercase tracking-widest text-brand-white/40 font-sans-luxury">
              {{ filteredProducts.length }} Piezas encontradas
            </span>
            
            <div class="flex items-center gap-2">
              <label for="sort" class="hidden sm:inline-block text-[10px] uppercase tracking-widest text-brand-white/40 font-sans-luxury">Ordenar por:</label>
              <select 
                id="sort"
                v-model="sortBy"
                class="bg-brand-black text-brand-white/80 border border-brand-white/10 text-[10px] uppercase tracking-wider px-3 py-1.5 focus:border-brand-gold outline-none cursor-pointer font-sans-luxury"
              >
                <option value="default">Recomendados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16">
            <div 
              v-for="product in displayedProducts" 
              :key="product.id"
              class="relative transition-all duration-700 p-1 bg-transparent border border-transparent"
              :class="{ 'border-brand-gold/30 bg-brand-gold/[0.01] rounded-sm pulse-gold-card': lastViewedProductId === product.id }"
            >
              <div 
                v-if="lastViewedProductId === product.id"
                class="absolute -top-3 left-4 z-30 bg-brand-gold text-brand-black text-[7px] font-extrabold uppercase tracking-[0.25em] px-2 py-0.5 rounded-none shadow-xl border border-brand-black/20"
              >
                Última pieza explorada
              </div>

              <ProductCard :product="product" />
            </div>
          </div>

          <div v-if="displayedProducts.length < filteredProducts.length" class="mt-14 md:mt-20 flex justify-center px-4 md:px-0">
            <button 
              @click="loadMore"
              class="w-full md:w-auto border border-brand-gold text-brand-gold px-12 py-4 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-brand-gold hover:text-brand-black transition-colors duration-300 bg-brand-black/50 backdrop-blur-sm"
            >
              Explorar más piezas ({{ filteredProducts.length - displayedProducts.length }} restantes)
            </button>
          </div>
        </main>

      </div>
    </div>

    <Transition name="fade-toast">
      <button 
        v-if="showBackToTop" 
        @click="scrollToTop" 
        class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-brand-black/90 border border-brand-gold text-brand-gold p-4 md:p-3 shadow-2xl backdrop-blur-sm hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
        aria-label="Volver al tope superior"
      >
        <Icon icon="lucide:arrow-up" class="w-5 h-5" />
      </button>
    </Transition>

  </div>
</template>

<style scoped>
@reference "../assets/main.css";

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; -webkit-overflow-scrolling: touch; }

.fade-toast-enter-active, .fade-toast-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-toast-enter-from, .fade-toast-leave-to { opacity: 0; transform: scale(0.9) translateY(10px); }

/* Transición suave para la entrada de la grilla real */
.entry-fade { animation: entryFade 0.3s ease-out; }
@keyframes entryFade { from { opacity: 0; } to { opacity: 1; } }

@keyframes goldGlow {
  0%, 100% { border-color: rgba(197, 168, 128, 0.15); box-shadow: 0 0 0px rgba(197, 168, 128, 0); }
  50% { border-color: rgba(197, 168, 128, 0.45); box-shadow: 0 0 15px rgba(197, 168, 128, 0.05); }
}
.pulse-gold-card {
  animation: goldGlow 2.5s ease-in-out infinite;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #c5a880; 
  cursor: pointer;
  border-radius: 0px; 
  transition: transform 0.2s;
}
input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.3); }
</style>