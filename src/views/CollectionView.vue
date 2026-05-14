<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import ProductCard from '@/components/ProductCard.vue';
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(true);

// --- MENÚS DE FILTRADO ---
// Filtros por Tipo de Joya
const typeFilters = ['Todas', 'Joyas', 'Piedras Sueltas', 'Anillos', 'Aretes', 'Collares', 'Pulseras', 'Dije'];
// ✨ NUEVO: Filtros por Ocasión/Colección Especial
const occasionFilters = ['Compromiso', 'Bodas', 'Quinceaños', 'Aniversario', 'Regalo'];

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

// Leer la URL para pre-seleccionar filtros
const applyUrlFilter = () => {
  const urlParam = route.params.category?.toLowerCase();
  
  if (!urlParam) {
    selectedCategory.value = 'Todas';
    return;
  }

  // Mapeo especial para amigabilidad URL
  if (urlParam === 'esmeraldas') {
    selectedCategory.value = 'Piedras Sueltas';
  } else if (urlParam === 'dijes') {
    selectedCategory.value = 'Dije'; // Lo empatamos con la DB
  } else {
    // Buscamos si el parámetro coincide con un tipo o una ocasión
    const allFilters = [...typeFilters, ...occasionFilters];
    const match = allFilters.find(cat => cat.toLowerCase() === urlParam);
    selectedCategory.value = match || 'Todas';
  }
};

// Cambiar filtro y actualizar URL
const setCategory = (cat) => {
  selectedCategory.value = cat;
  if (cat === 'Todas') router.replace('/coleccion');
  else if (cat === 'Piedras Sueltas') router.replace('/coleccion/esmeraldas');
  else if (cat === 'Dije') router.replace('/coleccion/dijes');
  else router.replace(`/coleccion/${cat.toLowerCase()}`);
};

// --- MOTOR DE FILTRADO ---
const filteredProducts = computed(() => {
  const inStock = products.value.filter(p => p.stock > 0);

  if (selectedCategory.value === 'Todas') return inStock;
  
  if (selectedCategory.value === 'Joyas') {
    return inStock.filter(p => p.category !== 'Piedras Sueltas');
  }

  // ✨ LA MAGIA DE LAS OCASIONES ✨
  // Si la selección actual es una ocasión (ej: "Bodas"), revisamos el array 'occasions'
  if (occasionFilters.includes(selectedCategory.value)) {
    return inStock.filter(p => p.occasions && p.occasions.includes(selectedCategory.value));
  }

  // Filtrado normal por categoría base
  return inStock.filter(p => p.category && p.category.toLowerCase() === selectedCategory.value.toLowerCase());
});

watch(() => route.params.category, applyUrlFilter);
onMounted(loadData);
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-10 pb-20 font-sans">
    
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
              <li v-for="cat in typeFilters" :key="cat" class="shrink-0">
                <button 
                  @click="setCategory(cat)" 
                  class="text-[10px] uppercase tracking-[0.2em] transition-all duration-300 w-full text-left flex items-center group"
                  :class="selectedCategory === cat ? 'text-brand-gold font-bold' : 'text-brand-white/50 hover:text-brand-white'"
                >
                  <span v-if="selectedCategory === cat" class="w-1.5 h-1.5 bg-brand-gold rounded-full mr-2"></span>
                  <span v-else class="w-1.5 h-1.5 bg-transparent rounded-full mr-2 group-hover:bg-brand-white/30 transition-colors"></span>
                  {{ cat }}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-brand-white font-serif-elegant text-lg uppercase tracking-widest mb-6 border-b border-brand-white/10 pb-4">Colecciones</h3>
            <ul class="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
              <li v-for="occ in occasionFilters" :key="occ" class="shrink-0">
                <button 
                  @click="setCategory(occ)" 
                  class="text-[10px] uppercase tracking-[0.2em] transition-all duration-300 w-full text-left flex items-center group"
                  :class="selectedCategory === occ ? 'text-brand-gold font-bold' : 'text-brand-white/50 hover:text-brand-white'"
                >
                  <span v-if="selectedCategory === occ" class="w-1 h-1 bg-brand-gold transform rotate-45 mr-2"></span>
                  <span v-else class="w-1 h-1 border border-brand-white/30 transform rotate-45 mr-2 group-hover:border-brand-white transition-colors"></span>
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
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 fadeIn">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id"
              :product="product" 
            />
          </div>
        </main>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Asegura conexión con main.css (Tailwind v4) */
@reference "../assets/main.css";

/* Ocultar barra de scroll en el menú móvil (queda deslizable pero sin la fea barra) */
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
</style>