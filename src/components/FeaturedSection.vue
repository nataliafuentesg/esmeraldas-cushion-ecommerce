<script setup>
import { products } from '@/data/products';
import ProductCard from './ProductCard.vue';
// 1. Importar los componentes y módulos necesarios de Swiper
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';

// 2. Importar los estilos de Swiper (Asegúrate de que estas rutas sean correctas)
import 'swiper/css';
import 'swiper/css/pagination';

const featuredProducts = products.filter(p => p.isFeatured);

// 3. Definir los módulos que vamos a usar
const modules = [Pagination, Autoplay];

// 4. Configuración de Breakpoints para diseño responsive
const swiperBreakpoints = {
    // 320px y más
    320: {
        slidesPerView: 1.1,
        spaceBetween: 15,
    },
    // 768px y más (Tablets)
    768: {
        slidesPerView: 2.5,
        spaceBetween: 30,
    },
    // 1024px y más (Desktop)
    1024: {
        slidesPerView: 3.5,
        spaceBetween: 40,
    },
    // 1440px y más (Desktop Grande)
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

            <swiper
                :modules="modules"
                :space-between="40"
                :slides-per-view="4"
                :breakpoints="swiperBreakpoints"
                :loop="true"
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
/* 6. Estilos Personalizados para los Dots (Paginación) de CUSHION */

/* Contenedor general de la paginación */
.swiper-pagination {
    margin-top: 20px !important;
    position: relative; /* Lo movemos al flujo normal del documento */
    bottom: auto !important;
}

/* Dots individuales */
.swiper-pagination-bullet {
    background-color: var(--color-brand-white) !important; /* Blanco por defecto */
    opacity: 0.4;
    transition: opacity 0.3s, background-color 0.3s;
}

/* Dot Activo: Usamos el Dorado de la marca para destacar la posición */
.swiper-pagination-bullet-active {
    background-color: var(--color-brand-gold) !important; 
    opacity: 1;
}
</style>