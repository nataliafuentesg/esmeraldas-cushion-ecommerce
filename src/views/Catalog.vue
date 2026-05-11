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

const categorizedProducts = computed(() => {
  const groups = {};
  products.value.forEach(p => {
    const cat = p.category || 'Colección';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(p);
  });
  return groups;
});

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
    
    setTimeout(() => {
      initPageFlip();
    }, 200);
  } catch (error) {
    console.error("Error:", error);
    loading.value = false;
  }
};

const initPageFlip = () => {
  if (!bookContainer.value) return;

  pageFlipInstance = new PageFlip(bookContainer.value, {
    width: 450,
    height: 600,
    size: "stretch",
    minWidth: 280,
    maxWidth: 800,
    minHeight: 400,
    maxHeight: 1000,
    maxShadowOpacity: 0.8,
    showCover: true,
    mobileScrollSupport: true,
    usePortrait: true,
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
const goToDetail = (slug) => router.push(`/productos/${slug}`);
</script>

<template>
  <div class="fixed inset-0 bg-brand-black z-[9999] flex items-center justify-center overflow-hidden select-none">
    
    <button @click="router.push('/')" class="absolute top-6 left-6 z-[10020] text-brand-gold border border-brand-gold/30 px-4 py-2 text-[9px] uppercase tracking-[0.3em] font-sans-luxury hover:bg-brand-gold hover:text-brand-black transition-all bg-brand-black/50 backdrop-blur-md">
      ✕ Salir
    </button>

    <button v-if="currentPage > 0" @click="goPrev" class="nav-arrow left-2 md:left-8">
      <svg class="w-12 h-12 md:w-20 md:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="1"/></svg>
    </button>

    <button @click="goNext" class="nav-arrow right-2 md:right-8">
      <svg class="w-12 h-12 md:w-20 md:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="1"/></svg>
    </button>

    <div v-if="loading" class="text-brand-gold font-sans-luxury animate-pulse text-[10px] uppercase tracking-[0.5em]">
      Cargando Lookbook...
    </div>

    <div v-show="!loading" ref="bookContainer" class="flip-book shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
      
      <div class="magazine-page cover bg-brand-black flex flex-col items-center justify-center text-center p-8">
        <div class="absolute inset-8 border border-brand-gold/20 pointer-events-none"></div>
        
        <img src="/src/assets/images/logo-cushion-white.png" class="w-40 md:w-56 mb-8 z-10 invert brightness-150" alt="Cushion" />
        
        <h1 class="text-4xl md:text-6xl text-brand-white font-serif-elegant tracking-[0.2em] uppercase mb-4 z-10">
          Lookbook
        </h1>
        <p class="text-brand-gold font-sans-luxury tracking-[0.4em] text-[9px] md:text-[11px] uppercase z-10">
          Edición 2026
        </p>
        
        <div class="mt-16 flex flex-col items-center opacity-50 z-10">
          <span class="text-[8px] text-brand-white uppercase tracking-[0.4em] mb-4 font-sans-luxury">Desliza para hojear</span>
          <div class="w-[1px] h-12 bg-brand-gold"></div>
        </div>
      </div>

      <template v-for="(items, category) in categorizedProducts" :key="category">
        
        <div class="magazine-page bg-brand-black flex flex-col items-center justify-center p-12 text-center border-r border-brand-white/5">
          <div class="absolute inset-10 border border-brand-white/5 pointer-events-none"></div>
          <span class="text-brand-gold font-sans-luxury text-[10px] uppercase tracking-[0.6em] mb-4 z-10">Colección</span>
          <h2 class="text-3xl md:text-5xl text-brand-white font-serif-elegant tracking-[0.1em] uppercase z-10">{{ category }}</h2>
          <div class="h-[1px] w-20 bg-brand-gold mt-8 z-10"></div>
        </div>

        <div v-for="(chunk, pageIdx) in chunkArray(items, 4)" :key="pageIdx" class="magazine-page bg-brand-black p-6 md:p-10 border-r border-brand-white/5 relative">
          <div class="grid grid-cols-2 grid-rows-2 h-full gap-4 md:gap-8 pb-10">
            <div v-for="product in chunk" :key="product.id" class="flex flex-col group cursor-pointer" @click="goToDetail(product.slug)">
              
              <div class="aspect-[4/5] bg-brand-black overflow-hidden border border-brand-white/10 group-hover:border-brand-gold transition-all duration-500">
                <img v-if="product.images?.length" :src="product.images[0].imageUrl" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div v-else class="w-full h-full flex flex-col items-center justify-center text-[8px] text-brand-white/20 uppercase tracking-widest font-sans-luxury bg-brand-white/5">
                  <span class="text-xl mb-2">💎</span>
                </div>
              </div>
              
              <div class="mt-4 text-center">
                <h4 class="text-[8px] md:text-[10px] text-brand-white font-serif-elegant uppercase tracking-widest mb-1 truncate px-1">{{ product.name }}</h4>
                <p class="text-[9px] md:text-[11px] text-brand-gold font-sans-luxury tracking-widest">${{ product.price.toLocaleString() }}</p>
              </div>
            </div>
          </div>
          <span class="absolute bottom-6 left-1/2 -translate-x-1/2 text-[7px] text-brand-white/20 tracking-[0.4em] uppercase font-sans-luxury italic">
            Cushion — {{ category }}
          </span>
        </div>
      </template>

      <div class="magazine-page cover bg-brand-black flex flex-col items-center justify-center text-center p-12">
        <div class="absolute inset-8 border border-brand-gold/20 pointer-events-none"></div>
        
        <span class="text-brand-gold font-sans-luxury text-[10px] uppercase tracking-[0.5em] mb-4">Final de la edición</span>
        <h2 class="text-3xl md:text-4xl text-brand-white font-serif-elegant tracking-[0.1em] uppercase mb-8">Fin del Catálogo</h2>
        
        <div class="h-[1px] w-16 bg-brand-gold mb-10"></div>
        
        <button 
          @click="router.push('/')"
          class="px-8 py-3 bg-brand-gold text-brand-black font-sans-luxury text-[10px] uppercase tracking-[0.2em] hover:bg-brand-white transition-colors"
        >
          Visitar Página Web
        </button>

        <p class="absolute bottom-12 text-brand-white/30 font-sans-luxury text-[8px] uppercase tracking-[0.3em]">
          Piezas con Alma de Esmeralda<br>
          Bogotá, Colombia
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Importante para que Tailwind v4 reconozca tus colores */
@reference "../assets/main.css";

.flip-book {
  perspective: 2500px;
}

.magazine-page {
  /* Profundidad interna */
  box-shadow: inset 0 0 80px rgba(0,0,0,0.9);
  /* Altura total para asegurar el centrado */
  height: 100%;
  width: 100%;
}

.nav-arrow {
  @apply absolute top-1/2 -translate-y-1/2 z-[10015] text-brand-gold/40 hover:text-brand-gold transition-all duration-500 outline-none;
}

.nav-arrow:hover {
  @apply scale-125 brightness-125;
}

/* Evita resaltados molestos en móvil */
* {
  -webkit-tap-highlight-color: transparent;
}
</style>