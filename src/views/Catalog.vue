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
  <div class="fixed inset-0 bg-brand-black z-[9999] flex items-center justify-center overflow-hidden select-none antialiased">
    
    <!-- SALIR: Rediseño minimalista de perfil ultra delgado -->
    <button @click="router.push('/')" class="absolute top-6 left-6 z-[10020] text-brand-white/60 border border-brand-white/10 px-4 py-2 text-[9px] tracking-[0.35em] font-sans-luxury hover:border-brand-gold hover:text-brand-gold bg-transparent backdrop-blur-sm transition-all duration-300">
      ✕ Salir
    </button>

    <!-- Flechas de navegación -->
    <button v-if="currentPage > 0" @click="goPrev" class="nav-arrow left-2 md:left-6">
      <svg class="w-10 h-10 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="1.2"/></svg>
    </button>

    <button @click="goNext" class="nav-arrow right-2 md:right-6">
      <svg class="w-10 h-10 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="1.2"/></svg>
    </button>

    <!-- Loader -->
    <div v-if="loading" class="text-brand-gold/60 font-sans-luxury text-[9px] tracking-[0.6em] animate-pulse">
      Cargando Lookbook...
    </div>

    <div v-show="!loading" class="w-full h-full max-w-6xl max-h-[90vh] md:max-h-[85vh] mx-auto flex items-center justify-center p-2 md:p-8">
      
      <div ref="bookContainer" class="flip-book shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95)]">
        
        <!-- ================= PORTADA DEL LOOKBOOK ================= -->
        <div class="magazine-page cover bg-brand-black relative">
          <div class="absolute inset-6 md:inset-8 border border-brand-white/[0.05] pointer-events-none z-0"></div>
          
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
            <img src="/src/assets/images/logo-cushion-white.png" class="w-24 md:w-32 opacity-40 mb-10" alt="Cushion Logo" onerror="this.style.display='none'" />
            
            <h1 class="text-4xl md:text-5xl lg:text-6xl text-brand-white font-serif-elegant font-normal tracking-wide normal-case mb-3">
              Lookbook
            </h1>
            <p class="text-brand-gold text-[10px] tracking-[0.5em] font-sans-luxury font-light">
              Edición 2026
            </p>
            
            <div class="mt-20 flex flex-col items-center opacity-30">
              <span class="text-[8px] text-brand-white tracking-[0.4em] mb-4 font-sans-luxury">Desliza para hojear</span>
              <div class="w-[1px] h-16 bg-gradient-to-b from-brand-gold to-transparent"></div>
            </div>
          </div>
        </div>

        <!-- ================= CONTENIDO AGRUPADO ================= -->
        <template v-for="(items, category) in categorizedProducts" :key="category">
          
          <!-- PÁGINA INTERMEDIA: Introducción de Categoría -->
          <div class="magazine-page bg-brand-black relative border-r border-brand-white/5">
            <div class="absolute inset-8 border border-brand-white/[0.03] pointer-events-none z-0"></div>
            
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
              <span class="text-brand-gold text-[9px] tracking-[0.6em] mb-3 font-sans-luxury font-light">Colección</span>
              <h2 class="text-3xl md:text-4xl text-brand-white font-serif-elegant tracking-wide normal-case font-normal italic">
                {{ category }}
              </h2>
              <div class="h-[1px] w-12 bg-brand-gold/40 mt-6"></div>
            </div>
          </div>

          <!-- PÁGINA DE RETÍCULA DE PIEZAS (4 por página) -->
          <div v-for="(chunk, pageIdx) in chunkArray(items, 4)" :key="pageIdx" class="magazine-page bg-brand-black relative border-r border-brand-white/5">
            
            <div class="absolute inset-0 p-6 md:p-10 flex flex-col justify-center z-10">
              <div class="grid grid-cols-2 grid-rows-2 h-[85%] gap-6 md:gap-8">
                
                <div v-for="product in chunk" :key="product.id" class="flex flex-col group cursor-pointer h-full" @click="goToDetail(product.slug)">
                  <!-- Contenedor de Imagen -->
                  <div class="flex-1 bg-brand-black overflow-hidden border border-brand-white/[0.06] group-hover:border-brand-gold/40 transition-all duration-700 relative flex items-center justify-center">
                    <!-- ✔️ RESTAURADO: Volvemos a tu mapeo original exacto que sí funcionaba -->
                    <img v-if="product.images?.length" :src="product.images[0].imageUrl" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-[1.2s] ease-out group-hover:scale-105" />
                    <div v-else class="text-lg opacity-20 text-brand-white font-serif-elegant">💎</div>
                  </div>
                  
                  <div class="mt-3 h-[42px] text-center flex flex-col justify-center">
                    <h4 class="text-[11px] md:text-xs text-brand-white/80 font-serif-elegant tracking-wide normal-case mb-0.5 truncate px-1 font-normal">
                      {{ product.name }}
                    </h4>
                    <p class="text-[9px] text-brand-gold/80 font-sans-luxury tracking-[0.12em] font-light">
                      $ {{ product.price.toLocaleString() }}
                    </p>
                  </div>
                </div>

              </div>
              
              <span class="absolute bottom-5 left-1/2 -translate-x-1/2 text-[7px] text-brand-white/20 tracking-[0.5em] font-sans-luxury">
                Cushion — {{ category }}
              </span>
            </div>
          </div>
        </template>

        <!-- ================= CONTRAPORTADA FINAL ================= -->
        <div class="magazine-page cover bg-brand-black relative">
          <div class="absolute inset-6 md:inset-8 border border-brand-white/[0.05] pointer-events-none z-0"></div>
          
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-10 z-10">
            <span class="text-brand-gold text-[9px] tracking-[0.5em] mb-3 font-sans-luxury font-light">Final de la edición</span>
            <h2 class="text-3xl md:text-4xl text-brand-white font-serif-elegant tracking-wide normal-case font-normal mb-8">
              Fin del Catálogo
            </h2>
            
            <div class="h-[1px] w-12 bg-brand-gold/30 mb-10"></div>
            
            <button @click="router.push('/')" class="px-8 py-3 border border-brand-gold text-brand-gold font-sans-luxury text-[9px] tracking-[0.3em] hover:bg-brand-gold hover:text-brand-black transition-all duration-300 bg-transparent">
              Visitar Tienda
            </button>

            <p class="absolute bottom-12 text-brand-white/20 font-sans-luxury text-[8px] tracking-[0.4em] leading-relaxed">
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
@reference "../assets/main.css";

.flip-book {
  perspective: 2500px;
}

.magazine-page {
  background-color: #0d0d0d;
  box-shadow: inset 0 0 80px rgba(0,0,0,0.95);
  overflow: hidden;
}

.nav-arrow {
  @apply absolute top-1/2 -translate-y-1/2 z-[10015] text-brand-white/20 hover:text-brand-gold transition-all duration-500 outline-none;
}

.nav-arrow:hover {
  @apply scale-105;
}

* {
  -webkit-tap-highlight-color: transparent;
}
</style>