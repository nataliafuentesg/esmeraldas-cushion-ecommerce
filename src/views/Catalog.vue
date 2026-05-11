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
    
    // 1. Ocultamos la pantalla de carga para que Vue dibuje el HTML
    loading.value = false;
    
    // 2. MAGIA: Le damos 150 milisegundos al navegador para que 
    // termine de pintar las cajas antes de que PageFlip intente convertirlas en 3D.
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
    width: 450, // Lo hicimos un poco más ajustado
    height: 600,
    size: "stretch",
    minWidth: 315,
    maxWidth: 1000,
    minHeight: 420,
    maxHeight: 1350,
    maxShadowOpacity: 0.3,
    showCover: true,
    mobileScrollSupport: true,
    usePortrait: true // Modo de una sola página en celulares
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
  <div class="fixed inset-0 bg-[#0a0a0a] z-[9999] flex items-center justify-center overflow-hidden">
    
    <button 
      @click="router.push('/')"
      class="absolute top-6 left-6 z-[10000] text-brand-gold border border-brand-gold/50 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-gold hover:text-black transition-all"
    >
      ✕ Salir
    </button>

    <div v-if="loading" class="text-brand-gold animate-pulse tracking-[0.3em] uppercase text-xs">
      Abriendo Archivos de Lujo...
    </div>

    <div v-show="!loading" ref="bookContainer" class="flip-book shadow-2xl bg-[#0a0a0a]">
      
      <div class="magazine-page cover bg-brand-black flex flex-col items-center justify-center relative">
        <div class="absolute inset-6 border border-brand-gold/20"></div>
        <h1 class="text-5xl md:text-6xl text-brand-white font-serif-elegant tracking-[0.3em] uppercase mb-4">Cushion</h1>
        <div class="h-[1px] w-20 bg-brand-gold mb-6"></div>
        <p class="text-brand-gold font-sans-luxury tracking-[0.5em] text-[10px] uppercase">Lookbook Editorial</p>
      </div>

      <template v-for="(product, index) in products" :key="product.id">
        <div class="magazine-page bg-[#fdfdfd] relative flex flex-col h-full w-full">
          
          <div class="h-[60%] w-full bg-[#f0f0f0] flex items-center justify-center overflow-hidden">
            <img 
              v-if="product.images && product.images.length > 0"
              :src="product.images[0].imageUrl" 
              class="w-full h-full object-cover"
              onerror="this.style.display='none'"
            />
            <div v-else class="text-gray-400 font-sans-luxury text-[9px] tracking-widest uppercase text-center px-4">
              <span class="text-2xl block mb-2">💎</span>
              Imagen en archivo
            </div>
          </div>

          <div class="h-[40%] px-8 py-6 flex flex-col justify-between items-center text-center bg-white">
            <div class="w-full">
              <h3 class="text-xl md:text-2xl font-serif-elegant text-black uppercase tracking-widest mb-1 truncate">
                {{ product.name }}
              </h3>
              <p class="text-[9px] text-gray-500 uppercase tracking-widest mb-3">
                {{ product.gemstoneType || 'Gema' }} — {{ product.metalType || 'Metal' }}
              </p>
              <p class="text-lg font-serif italic text-brand-gold">
                ${{ product.price.toLocaleString() }} COP
              </p>
            </div>

            <button 
              @click="goToDetail(product.slug)"
              class="px-6 py-3 border border-black text-black hover:bg-black hover:text-white text-[9px] uppercase tracking-[0.2em] transition-colors w-full"
            >
              Adquirir Pieza
            </button>
          </div>
          
          <span class="absolute bottom-4 text-xs text-gray-400 font-serif" :class="index % 2 === 0 ? 'left-6' : 'right-6'">
            {{ index + 1 }}
          </span>
        </div>
      </template>

      <div class="magazine-page cover bg-brand-black flex flex-col items-center justify-center relative">
        <div class="absolute inset-6 border border-brand-gold/20"></div>
        <p class="text-brand-white/40 text-[9px] uppercase tracking-[0.3em] text-center leading-loose">
          Cushion Jewelry<br>
          Alta Joyería & Esmeraldas
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.magazine-page {
  /* Le da la rigidez física de un papel a la caja */
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
}

.magazine-page.cover {
  background-color: #080808;
}
</style>