<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios'; 
import ProductCard from './ProductCard.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const featuredProducts = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await api.get('/products');
    featuredProducts.value = response.data.filter(p => p.featured === true);
    console.log("Productos destacados filtrados:", featuredProducts.value);
  } catch (error) {
    console.error("Error cargando destacados:", error);
  } finally {
    loading.value = false;
  }
});

const modules = [Pagination, Autoplay];

const swiperBreakpoints = {
    320: {
        slidesPerView: 1.1,
        spaceBetween: 20,
    },
    768: {
        slidesPerView: 2.2,
        spaceBetween: 30,
    },
    1024: {
        slidesPerView: 3.2,
        spaceBetween: 40,
    },
    1440: {
        slidesPerView: 4,
        spaceBetween: 40,
    }
};
</script>

<template>
    <section class="relative bg-brand-black bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/[0.07] via-brand-black to-brand-black py-24 overflow-hidden border-t border-b border-brand-white/5">
        
        <div class="absolute inset-0 pointer-events-none opacity-20">
            <div class="absolute left-0 top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"></div>
            <div class="absolute left-1/4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-brand-white/5 via-transparent to-brand-white/5"></div>
            <div class="absolute right-1/4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-brand-gold/10 to-transparent"></div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <header class="mb-16 text-center">
                <p class="text-brand-gold text-[10px] tracking-[0.5em] font-bold mb-3 animate-pulse">
                    Curaduría Exclusiva
                </p>
                <h2 class="text-3xl md:text-5xl text-brand-white font-serif-elegant tracking-[0.25em] relative inline-block">
                    Piezas Destacadas
                </h2>
                <div class="h-[1px] w-16 bg-brand-gold mx-auto mt-5"></div>
            </header>

            <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                <div class="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin mb-4"></div>
                <p class="text-brand-gold font-sans-luxury tracking-[0.3em] text-[9px]">Cargando Exclusividad...</p>
            </div>

            <swiper
                v-else
                :modules="modules"
                :space-between="40"
                :slides-per-view="4"
                :breakpoints="swiperBreakpoints"
                :loop="featuredProducts.length > 4"
                :autoplay="{ delay: 5000, disableOnInteraction: false }"
                :pagination="{ clickable: true }"
                class="pb-14 drop-shadow-[0_15px_30px_rgba(197,168,128,0.03)]"
            >
                <swiper-slide v-for="product in featuredProducts" :key="product.id" class="py-4 h-auto !flex !items-stretch">
                    <div class="transform hover:-translate-y-2 transition-all duration-500 w-full flex flex-col justify-between bg-brand-black/40 border border-brand-white/5">
                        <ProductCard :product="product" class="h-full" />
                    </div>
                </swiper-slide>
            </swiper>

            <div class="text-center mt-8">
                <RouterLink to="/coleccion"
                    class="inline-block px-12 py-4 border border-brand-gold/30 text-brand-gold 
                           text-[10px] font-bold tracking-[0.3em] 
                           bg-brand-gold/[0.02] backdrop-blur-sm
                           hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold
                           transition-all duration-500 shadow-xl shadow-black/40 hover:shadow-brand-gold/10">
                    Explorar la Colección
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<style>
/* Estilos personalizados de Swiper unificados y limpios */
.swiper-pagination {
    margin-top: 30px !important;
    position: relative; 
    bottom: auto !important;
    display: flex;
    justify-content: center;
    gap: 8px;
}

.swiper-pagination-bullet {
    width: 6px !important;
    height: 6px !important;
    background-color: #ffffff !important; 
    opacity: 0.2;
    border-radius: 0px !important; /* Cuadradas para encajar con el minimalismo geométrico */
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.swiper-pagination-bullet-active {
    width: 24px !important; /* Efecto píldora estirada al estar activa */
    background-color: #c5a880 !important; /* Tu color de oro de marca */
    opacity: 1;
}
</style>