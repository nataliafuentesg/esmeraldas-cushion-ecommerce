<script setup>
import { ref } from 'vue';
import { useLocaleStore } from '@/stores/locale';
import { RouterLink } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const L = useLocaleStore();
const categories = [
    { name: 'Anillos', nameKey: 'cat.rings', image: 'categoria-anillos.jpg', path: '/coleccion/anillos' },
    { name: 'Collares', nameKey: 'cat.necklaces', image: 'categoria-collares.jpg', path: '/coleccion/collares' },
    { name: 'Aretes', nameKey: 'cat.earrings', image: 'categoria-aretes.png', path: '/coleccion/aretes' },
    { name: 'Pulseras', nameKey: 'cat.bracelets', image: 'categoria-pulseras.jpg', path: '/coleccion/pulseras' },
    { name: 'Dijes', nameKey: 'cat.charms', image: 'categoria-dije.jpg', path: '/coleccion/dije' }, // 'dije' en singular para coincidir con BD
];

const modules = [Autoplay];
// Tira continua: las fotos van pegadas (sin espacio) formando una banda, con el
// nombre encima. Cambia sola (timer) + swipe, y en círculo (loop) sin cortes.
const swiperBreakpoints = {
  320:  { slidesPerView: 2.15 },
  640:  { slidesPerView: 3.15 },
  1024: { slidesPerView: 4.15 },
};

// Indicador "contador + aro": el número muestra en cuál categoría vamos y el
// aro se va llenando con el tiempo del autoplay (avisa cuándo va a cambiar).
const total = categories.length;
const current = ref(1);
const RING_C = 2 * Math.PI * 21; // circunferencia del aro (r = 21)
const ringOffset = ref(RING_C);  // arranca vacío

const onSlideChange = (sw) => { current.value = sw.realIndex + 1; };
// timeLeftPct va de 1 (recién cambió) a 0 (a punto de cambiar) → llenamos el aro
const onAutoplayTimeLeft = (sw, time, pct) => { ringOffset.value = RING_C * pct; };
</script>

<template>
  <section class="bg-brand-black py-16 md:py-20 border-t border-brand-white/5">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10" v-reveal>
        <h2 class="text-3xl md:text-5xl text-brand-white font-serif-elegant mb-4 tracking-normal">
          {{ L.t('home.categories.titlePre') }} <span class="text-brand-gold italic lowercase font-serif">{{ L.t('home.categories.titleSpan') }}</span>
        </h2>
        <div class="h-[1px] w-16 bg-brand-gold mx-auto"></div>
      </div>
    </div>

    <!-- Banda a todo el ancho: las fotos van pegadas una junto a otra. -->
    <swiper
      :modules="modules"
      slides-per-view="2.15"
      :space-between="0"
      :breakpoints="swiperBreakpoints"
      :grab-cursor="true"
      :loop="true"
      :autoplay="{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }"
      @slide-change="onSlideChange"
      @autoplay-time-left="onAutoplayTimeLeft"
      class="cat-swiper"
    >
      <swiper-slide v-for="category in categories" :key="category.name">
        <RouterLink
          :to="category.path"
          class="relative overflow-hidden group block aspect-[4/5]"
        >
          <img
            :src="`/images/category/${category.image}`"
            :alt="category.name"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            onerror="this.style.display='none'"
          />

          <!-- Fundido crema SOLO abajo (para el nombre); la foto se ve nítida arriba -->
          <div class="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/0 to-transparent"></div>
          <!-- Oscurecido sutil al pasar el mouse -->
          <div class="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/10 transition-colors duration-500"></div>

          <div class="absolute inset-0 flex flex-col justify-end p-5 md:p-7 z-20">
            <h3 class="text-xl md:text-3xl font-serif-elegant text-brand-white tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              {{ L.t(category.nameKey) }}
            </h3>
            <span class="inline-flex items-center gap-1.5 text-brand-gold font-sans-luxury text-[9px] md:text-[10px] tracking-[0.3em] uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {{ L.t('home.categories.discover') }}
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></svg>
            </span>
          </div>
        </RouterLink>
      </swiper-slide>
    </swiper>

    <!-- Contador + aro dorado que se llena con el tiempo del autoplay -->
    <div class="flex items-center justify-center gap-3 mt-9">
      <div class="relative w-12 h-12">
        <svg viewBox="0 0 48 48" class="w-full h-full -rotate-90">
          <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(197,168,128,0.22)" stroke-width="2" />
          <circle
            cx="24" cy="24" r="21" fill="none"
            stroke="#c5a880" stroke-width="2" stroke-linecap="round"
            :stroke-dasharray="RING_C"
            :stroke-dashoffset="ringOffset"
            style="transition: stroke-dashoffset 0.15s linear"
          />
        </svg>
        <span class="absolute inset-0 flex items-center justify-center text-brand-white text-sm font-serif-elegant">
          {{ String(current).padStart(2, '0') }}
        </span>
      </div>
      <span class="text-brand-white/40 text-[11px] tracking-[0.25em] font-sans-luxury">
        / {{ String(total).padStart(2, '0') }}
      </span>
    </div>
  </section>
</template>

<style scoped>
/* Todos los slides a la misma altura */
.cat-swiper :deep(.swiper-wrapper) { align-items: stretch; }
.cat-swiper :deep(.swiper-slide) { height: auto; }
</style>
