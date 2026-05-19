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
const displayLimit = ref(12);
const showBackToTop = ref(false);
const selectedCategory = ref('Todas');

// ✨ MAPEADO DINÁMICO DE IMÁGENES DE ATMÓSFERA PARA LAS OCASIONES
// Nota: Usa fotos de textura, detalles de vestidos o manos, nada cargado para mantener el lujo.
const occasionMetadata = {
  'Compromiso': { img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=300&q=80', label: 'Compromiso' },
  'Bodas': { img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80', label: 'Bodas' },
  'Quinceaños': { img: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=300&q=80', label: 'Quinceaños' },
  'Aniversario': { img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80', label: 'Aniversario' },
  'Regalo': { img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80', label: 'Regalos Especiales' }
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
    const allFilters = [...typeFilters.value, ...occasionFilters.value];
    const match = allFilters.find(cat => cat.toLowerCase() === urlParam);
    selectedCategory.value = match || 'Todas';
  }
};

const setCategory = (cat) => {
  selectedCategory.value = cat;
  displayLimit.value = 12; 
  if (cat === 'Todas') router.replace('/coleccion');
  else if (cat === 'Piedras Sueltas') router.replace('/coleccion/esmeraldas');
  else router.replace(`/coleccion/${cat.toLowerCase()}`);
};

const filteredProducts = computed(() => {
  const inStock = products.value.filter(p => p.stock > 0);
  if (selectedCategory.value === 'Todas') return inStock;
  if (selectedCategory.value === 'Joyas') return inStock.filter(p => p.category !== 'Piedras Sueltas');
  if (occasionFilters.value.includes(selectedCategory.value)) {
    return inStock.filter(p => p.occasions && p.occasions.includes(selectedCategory.value));
  }
  return inStock.filter(p => p.category && p.category.toLowerCase() === selectedCategory.value.toLowerCase());
});

const displayedProducts = computed(() => filteredProducts.value.slice(0, displayLimit.value));
const loadMore = () => { displayLimit.value += 12; };
const handleScroll = () => { showBackToTop.value = window.scrollY > 300; };
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

watch(() => route.params.category, () => { applyUrlFilter(); displayLimit.value = 12; });
onMounted(() => { loadData(); window.addEventListener('scroll', handleScroll, { passive: true }); });
onUnmounted(() => { window.removeEventListener('scroll', handleScroll); });
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-10 pb-24 font-sans relative">
    
    <header class="container mx-auto px-4 text-center mb-10">
      <h1 class="text-3xl md:text-5xl font-serif-elegant text-brand-white mb-4 tracking-[0.2em] uppercase">
        <span v-if="selectedCategory === 'Todas'">Nuestra Colección</span>
        <span v-else-if="selectedCategory === 'Piedras Sueltas'">Esmeraldas Sueltas</span>
        <span v-else>{{ selectedCategory }}</span>
      </h1>
      <div class="h-[1px] w-20 bg-brand-gold mx-auto mb-6"></div>
    </header>

    <div class="container mx-auto px-4 lg:px-8">
      
      <section v-if="occasionFilters.length > 0" class="mb-12 border-b border-brand-white/10 pb-8">
        <h3 class="text-center lg:text-left text-brand-white font-serif-elegant text-xs uppercase tracking-[0.3em] mb-6 opacity-60">
          Filtrar por Ocasión Especial
        </h3>
        
        <div class="flex flex-row gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x px-2">
          <div 
            v-for="occ in occasionFilters" 
            :key="occ"
            @click="setCategory(occ)"
            class="shrink-0 snap-center relative group cursor-pointer overflow-hidden border transition-all duration-500 rounded-full md:rounded-none w-20 h-20 md:w-44 md:h-20"
            :class="selectedCategory === occ ? 'border-brand-gold shadow-lg shadow-brand-gold/10 scale-95' : 'border-brand-white/10 hover:border-brand-white/40'"
          >
            <img 
              :src="occasionMetadata[occ]?.img || 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=300&q=80'" 
              :alt="occ"
              class="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-40 group-hover:opacity-60"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent"></div>
            
            <div class="absolute inset-0 flex flex-col items-center justify-center p-2 text-center select-none">
              <span 
                class="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] transition-colors"
                :class="selectedCategory === occ ? 'text-brand-gold' : 'text-brand-white group-hover:text-brand-gold'"
              >
                {{ occ }}
              </span>
              <div 
                class="h-[1px] bg-brand-gold transition-all duration-500 mt-1"
                :class="selectedCategory === occ ? 'w-6' : 'w-0 group-hover:w-6'"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <div v-if="loading" class="flex flex-col items-center justify-center py-32">
        <Icon icon="line-md:loading-twotone-loop" class="text-brand-gold w-12 h-12 mb-4" />
        <p class="text-brand-gold font-sans-luxury tracking-[0.3em] uppercase text-[10px]">Accediendo a Bóveda...</p>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8 xl:gap-16">
        
        <aside class="w-full lg:w-56 lg:shrink-0 lg:sticky lg:top-24 h-fit z-10 py-2 md:py-0">
          <div class="mb-6">
            <h3 class="hidden lg:block text-brand-white font-serif-elegant text-xs uppercase tracking-[0.3em] mb-6 border-b border-brand-white/10 pb-4">Línea de Joyería</h3>
            <ul class="flex flex-row lg:flex-col gap-2.5 overflow-x-auto pb-3 lg:pb-0 hide-scrollbar snap-x px-2 lg:px-0">
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
        </aside>

        <main class="flex-1">
          <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center text-center py-20 border border-brand-white/5 bg-brand-white/[0.01]">
            <Icon icon="lucide:gem" class="w-12 h-12 text-brand-white/10 mb-4" />
            <p class="text-brand-white/40 font-sans-luxury text-xs uppercase tracking-widest px-6">
              Las piezas correspondientes no están disponibles en este momento.
            </p>
          </div>
          
          <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16 fadeIn">
              <ProductCard 
                v-for="product in displayedProducts" 
                :key="product.id"
                :product="product" 
              />
            </div>

            <div v-if="displayedProducts.length < filteredProducts.length" class="mt-14 md:mt-20 flex justify-center px-4 md:px-0">
              <button 
                @click="loadMore"
                class="w-full md:w-auto border border-brand-gold text-brand-gold px-12 py-4 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-brand-gold hover:text-brand-black transition-colors duration-300 bg-brand-black/50 backdrop-blur-sm"
              >
                Explorar más piezas ({{ filteredProducts.length - displayedProducts.length }} restantes)
              </button>
            </div>
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
.fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.fade-toast-enter-active, .fade-toast-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-toast-enter-from, .fade-toast-leave-to { opacity: 0; transform: scale(0.9) translateY(10px); }
</style>