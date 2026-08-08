<script setup>
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();
import { RouterLink } from 'vue-router';
const categories = [
    { name: 'Anillos', nameKey: 'cat.rings', image: 'categoria-anillos.jpg', path: '/coleccion/anillos' },
    { name: 'Collares', nameKey: 'cat.necklaces', image: 'categoria-collares.jpg', path: '/coleccion/collares' },
    { name: 'Aretes', nameKey: 'cat.earrings', image: 'categoria-aretes.png', path: '/coleccion/aretes' },
    { name: 'Pulseras', nameKey: 'cat.bracelets', image: 'categoria-pulseras.jpg', path: '/coleccion/pulseras' },
    { name: 'Dijes', nameKey: 'cat.charms', image: 'categoria-dije.jpg', path: '/coleccion/dije' }, // 'dije' en singular para coincidir con BD
];
</script>

<template>
  <section class="bg-brand-black py-24 border-t border-brand-white/5">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-5xl text-brand-white font-serif-elegant mb-4 tracking-normal">
          {{ L.t('home.categories.titlePre') }} <span class="text-brand-gold italic lowercase font-serif">{{ L.t('home.categories.titleSpan') }}</span>
        </h2>
        <div class="h-[1px] w-16 bg-brand-gold mx-auto"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
        
        <RouterLink 
          v-for="(category, index) in categories" 
          :key="category.name"
          :to="category.path"
          class="relative overflow-hidden group block"
          :class="{
            'md:col-span-2 aspect-[4/5] md:aspect-[4/3]': index < 2, 
            'md:col-span-1 aspect-square': index >= 2 
          }"
        >
          <img 
            :src="`/images/category/${category.image}`" 
            :alt="category.name" 
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            onerror="this.style.display='none'"
          />
          
          <div class="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500"></div>
          <div class="absolute inset-4 border border-brand-white/0 group-hover:border-brand-gold/30 transition-colors duration-500 z-10 pointer-events-none"></div>

          <div class="absolute inset-0 flex flex-col justify-end p-8 md:p-10 z-20">
            <h3 class="text-2xl md:text-3xl font-serif-elegant text-brand-white tracking-wide mb-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
              {{ L.t(category.nameKey) }}
            </h3>
            
            <div class="overflow-hidden">
              <span class="block text-brand-gold font-sans-luxury text-[9px] md:text-[10px] tracking-[0.3em] opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 delay-75">
                {{ L.t('home.categories.discover') }}
              </span>
            </div>
          </div>
        </RouterLink>

      </div>
    </div>
  </section>
</template>