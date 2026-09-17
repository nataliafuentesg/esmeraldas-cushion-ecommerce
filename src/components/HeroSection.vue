<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();
defineOptions({ name: 'HeroSection' });

const heroImagePcUrl     = "https://res.cloudinary.com/dfmvlqtfb/image/upload/v1774902048/2U5A4981_cyohne.jpg";
const heroImageMobileUrl = "https://res.cloudinary.com/dfmvlqtfb/image/upload/v1774902043/2U5A4648_rr9snu.jpg";

// Elige la imagen según el tamaño (para el fondo parallax)
const isDesktop = ref(true);
let mq = null;
const onMq = (e) => { isDesktop.value = e.matches; };
onMounted(() => {
  mq = window.matchMedia('(min-width: 768px)');
  isDesktop.value = mq.matches;
  mq.addEventListener('change', onMq);
});
onUnmounted(() => { if (mq) mq.removeEventListener('change', onMq); });

const heroBg = computed(() => isDesktop.value ? heroImagePcUrl : heroImageMobileUrl);
</script>

<template>
  <section class="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden">

    <!-- ── IMAGEN DE FONDO (parallax: fija en escritorio) ────────────────── -->
    <div class="absolute inset-0 z-0">
      <div class="w-full h-full hero-bg" :style="{ backgroundImage: `url('${heroBg}')` }"></div>

      <!-- Gradiente suave: oscurece solo tope y pie, respeta el centro -->
      <div class="absolute inset-0
                  bg-gradient-to-b
                  from-brand-black/55
                  via-brand-black/10
                  to-brand-black/75">
      </div>
    </div>

    <!-- ── CONTENIDO ─────────────────────────────────────────────────────── -->
    <div class="relative z-10 text-center px-6 max-w-3xl -translate-y-10 md:-translate-y-14">

      <!-- Firma decorativa: línea · rombo · línea -->
      <div class="flex items-center justify-center gap-4 mb-8 hero-ornament">
        <div class="h-px w-10 md:w-16 bg-brand-gold/50"></div>
        <svg class="w-2.5 h-2.5 text-brand-gold/70 flex-shrink-0"
             viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1 L23 9 L12 23 L1 9 Z"/>
        </svg>
        <div class="h-px w-10 md:w-16 bg-brand-gold/50"></div>
      </div>

      <!-- Título: fino, sin sombra, el gradiente da el contraste -->
      <h1 class="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem]
                 text-brand-white font-serif-elegant font-light
                 tracking-[0.22em] leading-none mb-5 hero-title">
        CUSHION
      </h1>

      <!-- Separador dorado -->
      <div class="h-px w-14 bg-brand-gold/40 mx-auto mb-5"></div>

      <!-- Tagline: pequeño, mucho tracking, semitransparente -->
      <p class="text-[10px] sm:text-xs text-brand-white/70 font-sans-luxury
                tracking-[0.55em] uppercase mb-12">
        {{ L.t('home.hero.subtitle') }}
      </p>

      <!-- CTA: borde limpio → dorado en hover, sin relleno oscuro -->
      <RouterLink
        to="/coleccion"
        class="inline-block px-10 py-4
               border border-brand-white/50 text-brand-white/80
               text-[9px] font-bold font-sans-luxury tracking-[0.45em] uppercase
               hover:border-brand-gold hover:text-brand-gold
               transition-all duration-700 hero-cta">
        {{ L.t('home.hero.cta') }}
      </RouterLink>
    </div>

    <!-- ── SCROLL INDICATOR ──────────────────────────────────────────────── -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10
                flex flex-col items-center gap-3 scroll-indicator">
      <span class="text-brand-white/30 text-[7px] tracking-[0.45em] font-sans-luxury uppercase">
        {{ L.t('home.hero.scroll') }}
      </span>
      <div class="w-px h-8 bg-gradient-to-b from-brand-white/30 to-transparent scroll-line"></div>
    </div>

  </section>
</template>

<style scoped>
@reference "../assets/main.css";

/* ── Fondo parallax: estático en escritorio, se revela al hacer scroll ── */
.hero-bg {
  background-size: cover;
  background-position: center center;
  background-attachment: scroll;
}

/* 'fixed' solo en escritorio (en móvil se comporta mal) */
@media (min-width: 768px) and (hover: hover) {
  .hero-bg { background-attachment: fixed; }
}

/* ── Aparición del contenido: fade + rise suave ── */
.hero-ornament {
  animation: fade-up 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.hero-title {
  animation: fade-up 1.4s 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.hero-cta {
  animation: fade-up 1.4s 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* ── Indicador de scroll pulsante ── */
.scroll-indicator {
  animation: fade-up 1.6s 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.scroll-line {
  animation: scroll-pulse 2.4s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1);    }
  50%       { opacity: 0.7; transform: scaleY(1.15); }
}
</style>
