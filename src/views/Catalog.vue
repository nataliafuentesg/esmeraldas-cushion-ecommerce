<script setup>
import { ref, onMounted, computed } from 'vue';
import { PageFlip } from 'page-flip';
import api from '@/api/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const bookContainer = ref(null);
const products = ref([]);
const loading = ref(true);
const currentPage = ref(0);

// Agrupamos productos por categoría
const categorizedProducts = computed(() => {
  const groups = {};
  products.value.forEach(p => {
    const cat = p.category || 'Colección';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(p);
  });
  return groups;
});

// Función para dividir el catálogo en páginas de a 4 productos
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

let pageFlipInstance = null;

const loadData = async () => {
  try {
    const response = await api.get('/products');
    products.value = response.data.filter(p => p.stock > 0);
    loading.value = false;
    
    // Tiempo de gracia para que Vue renderice el HTML antes del 3D
    setTimeout(() => {
      initPageFlip();
    }, 200);
  } catch (error) {
    console.error("Error cargando el catálogo:", error);
    loading.value = false;
  }
};

const initPageFlip = () => {
  if (!bookContainer.value) return;

  pageFlipInstance = new PageFlip(bookContainer.value, {
    width: 450,
    height: 600,
    size: "stretch",
    minWidth: 300,
    maxWidth: 800,
    minHeight: 400,
    maxHeight: 1000,
    maxShadowOpacity: 0.8,
    showCover: true,
    mobileScrollSupport: true,
    usePortrait: true, // 1 página en móvil, 2 en PC
    flippingTime: 700,
    swipeDistance: 30
  });

  pageFlipInstance.loadFromHTML(bookContainer.value.querySelectorAll('.magazine-page'));

  pageFlipInstance.on('flip', (e) => {
    currentPage.value = e.data;
  });
};

onMounted(loadData);

const goNext = () => pageFlipInstance?.flipNext();
const goPrev = () => pageFlipInstance?.flipPrev();
const goToDetail = (slug) => router.push(`/producto/${slug}`);
</script>

<template>
  <div class="fixed inset-0 bg-brand-black z-[9999] flex items-center justify-center overflow-hidden select-none">
    
    <button @click="router.push('/')" class="absolute top-6 left-6 z-[10020] text-brand-gold border border-brand-gold/30 px-4 py-2 text-[9px] uppercase tracking-[0.3em] font-sans-luxury hover:bg-brand-gold hover:text-brand-black transition-all bg-brand-black/50 backdrop-blur-md">
      ✕ Salir
    </button>

    <button v-if="currentPage > 0" @click="goPrev" class="nav-arrow left-2 md:left-6">
      <svg class="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="1.5"/></svg>
    </button>

    <button @click="goNext" class="nav-arrow right-2 md:right-6">
      <svg class="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="1.5"/></svg>
    </button>

    <div v-if="loading" class="text-brand-gold font-sans-luxury animate-pulse text-[10px] uppercase tracking-[0.5em]">
      Cargando Lookbook...
    </div>

    <div v-show="!loading" class="w-full h-full max-w-6xl max-h-[90vh] md:max-h-[85vh] mx-auto flex items-center justify-center p-2 md:p-8">
      
      <div ref="bookContainer" class="flip-book shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
        
        <div class="magazine-page cover bg-brand-black relative">
          <div class="absolute inset-6 md:inset-8 border border-brand-gold/20 pointer-events-none z-0"></div>
          
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
            <img src="/src/assets/images/logo-cushion-white.png" class="w-40 md:w-56 mb-8" alt="Cushion Logo" onerror="this.style.display='none'" />
            <h1 class="text-4xl md:text-5xl text-brand-white font-serif-elegant tracking-[0.2em] uppercase mb-4">
              Lookbook
            </h1>
            <p class="text-brand-gold font-sans-luxury tracking-[0.4em] text-[9px] md:text-[10px] uppercase">
              Edición 2026
            </p>
            
            <div class="mt-16 flex flex-col items-center opacity-50">
              <span class="text-[8px] text-brand-white uppercase tracking-[0.4em] mb-4 font-sans-luxury">Desliza para hojear</span>
              <div class="w-[1px] h-12 bg-brand-gold"></div>
            </div>
          </div>
        </div>

        <template v-for="(items, category) in categorizedProducts" :key="category">
          
          <div class="magazine-page bg-brand-black relative border-r border-brand-white/5">
            <div class="absolute inset-8 border border-brand-white/5 pointer-events-none z-0"></div>
            
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
              <span class="text-brand-gold font-sans-luxury text-[10px] uppercase tracking-[0.6em] mb-4">Colección</span>
              <h2 class="text-3xl md:text-4xl text-brand-white font-serif-elegant tracking-[0.1em] uppercase">{{ category }}</h2>
              <div class="h-[1px] w-16 bg-brand-gold mt-8"></div>
            </div>
          </div>

          <div v-for="(chunk, pageIdx) in chunkArray(items, 4)" :key="pageIdx" class="magazine-page bg-brand-black relative border-r border-brand-white/5">
            
            <div class="absolute inset-0 p-6 md:p-10 flex flex-col justify-center z-10">
              <div class="grid grid-cols-2 grid-rows-2 h-[85%] gap-6 md:gap-8">
                
                <div v-for="product in chunk" :key="product.id" class="flex flex-col group cursor-pointer h-full" @click="goToDetail(product.slug)">
                  <div class="flex-1 bg-brand-black overflow-hidden border border-brand-white/10 group-hover:border-brand-gold transition-all duration-500 relative flex items-center justify-center">
                    <img v-if="product.images?.length" :src="product.images[0].imageUrl" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div v-else class="text-[12px] md:text-2xl opacity-30 text-brand-white">💎</div>
                  </div>
                  
                  <div class="mt-4 h-[40px] text-center flex flex-col justify-center">
                    <h4 class="text-[8px] md:text-[9px] text-brand-white font-serif-elegant uppercase tracking-widest mb-1 truncate px-1">{{ product.name }}</h4>
                    <p class="text-[9px] md:text-[10px] text-brand-gold font-sans-luxury tracking-widest">${{ product.price.toLocaleString() }}</p>
                  </div>
                </div>

              </div>
              
              <span class="absolute bottom-6 left-1/2 -translate-x-1/2 text-[7px] text-brand-white/20 tracking-[0.4em] uppercase font-sans-luxury italic">
                Cushion — {{ category }}
              </span>
            </div>
          </div>
        </template>

        <div class="magazine-page cover bg-brand-black relative">
          <div class="absolute inset-6 md:inset-8 border border-brand-gold/20 pointer-events-none z-0"></div>
          
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-10 z-10">
            <span class="text-brand-gold font-sans-luxury text-[10px] uppercase tracking-[0.5em] mb-4">Final de la edición</span>
            <h2 class="text-3xl md:text-4xl text-brand-white font-serif-elegant tracking-[0.1em] uppercase mb-8">Fin del Catálogo</h2>
            
            <div class="h-[1px] w-16 bg-brand-gold mb-10"></div>
            
            <button @click="router.push('/')" class="px-8 py-3 bg-brand-gold text-brand-black font-sans-luxury text-[10px] uppercase tracking-[0.2em] hover:bg-brand-white transition-colors">
              Visitar Tienda
            </button>

            <p class="absolute bottom-12 text-brand-white/30 font-sans-luxury text-[8px] uppercase tracking-[0.3em]">
              Alta Joyería<br>
              Bogotá, Colombia
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Asegura la conexión de variables de colores Tailwind v4 */
@reference "../assets/main.css";

.flip-book {
  perspective: 2500px;
}

.magazine-page {
  /* Fondo negro por defecto para evitar destellos blancos */
  background-color: #1E1E1E; 
  box-shadow: inset 0 0 60px rgba(0,0,0,0.9);
  overflow: hidden;
}

.nav-arrow {
  @apply absolute top-1/2 -translate-y-1/2 z-[10015] text-brand-gold/40 hover:text-brand-gold transition-all duration-300 outline-none;
}

.nav-arrow:hover {
  @apply scale-110 brightness-125;
}

/* Evita cuadros azules nativos de celular al dar toque en la pantalla */
* {
  -webkit-tap-highlight-color: transparent;
}
</style>