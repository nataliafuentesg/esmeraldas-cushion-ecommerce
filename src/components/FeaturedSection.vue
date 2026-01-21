<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios'; // Importamos la instancia de axios creada previamente
import ProductCard from './ProductCard.vue';
// 1. Importar los componentes y módulos necesarios de Swiper
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';

// 2. Importar los estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';

// Reactividad para los productos del back
const featuredProducts = ref([]);
const loading = ref(true);

// Carga de datos desde el backend al montar el componente
onMounted(async () => {
  try {
    const response = await api.get('/products');
    // Filtramos usando la propiedad exacta del JSON: 'featured'
    featuredProducts.value = response.data.filter(p => p.featured === true);
    console.log("Productos destacados filtrados:", featuredProducts.value);
  } catch (error) {
    console.error("Error cargando destacados:", error);
  } finally {
    loading.value = false;
  }
});

// 3. Definir los módulos que vamos a usar
const modules = [Pagination, Autoplay];

// 4. Configuración de Breakpoints para diseño responsive
const swiperBreakpoints = {
    320: {
        slidesPerView: 1.1,
        spaceBetween: 15,
    },
    768: {
        slidesPerView: 2.5,
        spaceBetween: 30,
    },
    1024: {
        slidesPerView: 3.5,
        spaceBetween: 40,
    },
    1440: {
        slidesPerView: 4,
        spaceBetween: 50,
    }
};
</script>

<template>
    <section class="bg-brand-black py-20">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            
            <h2 class="text-center text-4xl md:text-5xl text-brand-white 
                       font-serif-elegant mb-12 uppercase tracking-wider">
                Piezas Destacadas
            </h2>

            <div v-if="loading" class="text-center text-brand-white py-10 opacity-50">
                Cargando exclusividad...
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
                class="pb-10"
            >
                <swiper-slide v-for="product in featuredProducts" :key="product.id">
                    <ProductCard :product="product" />
                </swiper-slide>
            </swiper>

            <div class="text-center mt-12">
                <RouterLink to="/coleccion"
                    class="inline-block px-8 py-3 border border-brand-primary text-brand-primary 
                           uppercase text-sm font-sans-luxury tracking-widest 
                           hover:bg-brand-primary hover:text-brand-black transition-all duration-300">
                    Ver toda la Colección
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<style>
/* Se mantienen tus estilos originales intactos */
.swiper-pagination {
    margin-top: 20px !important;
    position: relative; 
    bottom: auto !important;
}

.swiper-pagination-bullet {
    background-color: var(--color-brand-white) !important; 
    opacity: 0.4;
    transition: opacity 0.3s, background-color 0.3s;
}

.swiper-pagination-bullet-active {
    background-color: var(--color-brand-gold) !important; 
    opacity: 1;
}
</style>