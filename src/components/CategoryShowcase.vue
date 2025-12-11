<script setup>
import { RouterLink } from 'vue-router';

// Array de categorías para el carrusel
// NOTA: Asume que las imágenes existen en src/assets/images/
const categories = [
    { name: 'Anillos', image: 'category-anillos.jpg', path: '/coleccion/anillos' },
    { name: 'Collares', image: 'category-collares.jpg', path: '/coleccion/collares' },
    { name: 'Aretes', image: 'category-aretes.jpg', path: '/coleccion/aretes' },
    { name: 'Pulseras', image: 'category-pulseras.jpg', path: '/coleccion/pulseras' },
];
</script>

<template>
  <section class="bg-brand-black py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      
      <h2 class="text-center text-4xl md:text-5xl text-brand-white 
                   font-serif-elegant mb-12 uppercase tracking-wider">
        Explora por Categoría
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <RouterLink 
          v-for="category in categories" 
          :key="category.name"
          :to="category.path"
          class="relative overflow-hidden aspect-square group block"
        >
          <img 
            :src="`/src/assets/images/${category.image}`" 
            :alt="category.name" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div class="absolute inset-0 bg-brand-black/40 group-hover:bg-brand-black/20 
                      transition-colors duration-500 flex items-end justify-start p-6 md:p-8">
            
            <h3 class="text-2xl md:text-3xl font-serif-elegant text-brand-white 
                       border-b-2 border-brand-gold pb-1 tracking-wider">
              {{ category.name }}
            </h3>
          </div>
        </RouterLink>

      </div>
      
    </div>
  </section>
</template>