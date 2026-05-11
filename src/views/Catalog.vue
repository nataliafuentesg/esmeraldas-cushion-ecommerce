<script setup>
import { ref, onMounted } from 'vue';
import { PageFlip } from 'page-flip';
import api from '@/api/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const bookContainer = ref(null);
const products = ref([]);
const loading = ref(true);

const loadProducts = async () => {
  try {
    const response = await api.get('/products');
    products.value = response.data.filter(p => p.stock > 0);
    
    loading.value = false;
    
    setTimeout(() => {
      initPageFlip();
    }, 150);

  } catch (error) {
    console.error("Error cargando productos para el catálogo:", error);
    loading.value = false;
  }
};

const initPageFlip = () => {
  if (!bookContainer.value) return;

  const pageFlip = new PageFlip(bookContainer.value, {
    width: 400, // Base un poco más estrecha para celulares
    height: 600,
    size: "stretch",
    minWidth: 280, // Permite encogerse en celulares muy pequeños
    maxWidth: 800,
    minHeight: 400,
    maxHeight: 1000,
    maxShadowOpacity: 0.4,
    showCover: true,
    mobileScrollSupport: true,
    usePortrait: true // Clave: 1 página en móvil, 2 en PC
  });

  const pages = bookContainer.value.querySelectorAll('.magazine-page');
  pageFlip.loadFromHTML(pages);
};

onMounted(loadProducts);

const goToDetail = (slug) => {
  router.push(`/productos/${slug}`);
};
</script>

<template>
  <div class="fixed inset-0 bg-[#050505] z-[9999] flex items-center justify-center overflow-hidden font-sans">
    
    <button 
      @click="router.push('/')"
      class="absolute top-4 left-4 md:top-6 md:left-6 z-[10000] text-brand-gold border border-brand-gold/50 px-3 py-2 text-[9px] uppercase tracking-widest hover:bg-brand-gold hover:text-black transition-all bg-black/50 backdrop-blur-sm"
    >
      ✕ Cerrar Catálogo
    </button>

    <div v-if="loading" class="text-brand-gold animate-pulse tracking-[0.3em] uppercase text-xs flex flex-col items-center">
      <span class="text-3xl mb-4">💎</span>
      Preparando Colección...
    </div>

    <div v-show="!loading" class="w-full h-full max-w-6xl max-h-[90vh] md:max-h-[85vh] flex items-center justify-center p-2 md:p-8">
      
      <div ref="bookContainer" class="flip-book shadow-2xl bg-[#080808]">
        
        <div class="magazine-page cover bg-brand-black flex flex-col items-center justify-center relative overflow-hidden">
          <div class="absolute inset-4 md:inset-6 border border-brand-gold/20"></div>
          
          <img src="/src/assets/images/logo-cushion-white.png" class="w-32 md:w-48 mb-6 z-10 invert opacity-90" alt="Cushion" onerror="this.style.display='none'"/>
          
          <h1 class="text-3xl md:text-5xl text-brand-white font-serif-elegant tracking-[0.2em] uppercase mb-4 text-center px-4 z-10">
            Lookbook
          </h1>
          <div class="h-[1px] w-12 bg-brand-gold mb-6 z-10"></div>
          <p class="text-brand-gold font-sans-luxury tracking-[0.4em] text-[8px] md:text-[10px] uppercase z-10 text-center">
            Colección Oficial 2026
          </p>

          <div class="absolute bottom-10 md:bottom-16 flex flex-col items-center animate-bounce z-10">
            <span class="text-brand-white/60 text-[8px] uppercase tracking-widest mb-2">Desliza para explorar</span>
            <svg class="w-4 h-4 text-brand-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>

        <template v-for="(product, index) in products" :key="product.id">
          <div class="magazine-page bg-[#fdfdfd] relative flex flex-col h-full w-full">
            
            <div class="h-[55%] md:h-[65%] w-full bg-[#f4f4f4] flex items-center justify-center overflow-hidden">
              <img 
                v-if="product.images && product.images.length > 0"
                :src="product.images[0].imageUrl" 
                class="w-full h-full object-cover"
                onerror="this.style.display='none'"
              />
              <div v-else class="text-gray-400 font-sans-luxury text-[9px] tracking-widest uppercase text-center px-4">
                <span class="text-2xl block mb-2">💎</span>
                Pieza Exclusiva
              </div>
            </div>

            <div class="h-[45%] md:h-[35%] px-6 py-6 md:px-10 md:py-8 flex flex-col justify-between items-center text-center bg-white">
              <div class="w-full">
                <h3 class="text-lg md:text-2xl font-serif-elegant text-black uppercase tracking-widest mb-1 truncate">
                  {{ product.name }}
                </h3>
                <p class="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest mb-3">
                  {{ product.gemstoneType || 'Gema Natural' }} — {{ product.metalType || 'Alta Joyería' }}
                </p>
                <p class="text-base md:text-lg font-serif italic text-brand-gold">
                  ${{ product.price.toLocaleString() }} COP
                </p>
              </div>

              <button 
                @click="goToDetail(product.slug)"
                class="px-6 py-3 border border-black text-black hover:bg-black hover:text-white text-[8px] md:text-[9px] uppercase tracking-[0.2em] transition-colors w-full md:w-3/4"
              >
                Ver Detalles
              </button>
            </div>
            
            <span class="absolute bottom-3 md:bottom-4 text-[10px] text-gray-400 font-serif" :class="index % 2 === 0 ? 'left-4 md:left-6' : 'right-4 md:right-6'">
              {{ index + 1 }}
            </span>
          </div>
        </template>

        <div class="magazine-page cover bg-brand-black flex flex-col items-center justify-center relative">
          <div class="absolute inset-4 md:inset-6 border border-brand-gold/20"></div>
          <p class="text-brand-white/40 text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-center leading-loose px-8">
            Diseñado y elaborado a mano.<br><br>
            Cushion Jewelry<br>
            Bogotá, Colombia
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-book {
  /* Sombra más elegante y profunda */
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8);
}

.magazine-page {
  overflow: hidden;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.03);
}

.magazine-page.cover {
  background-color: #080808;
}
</style>