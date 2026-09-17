<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useLocaleStore } from '@/stores/locale';
import { logEvent } from '@/utils/eventlog';

const L = useLocaleStore();

// 📸 Foto del dije de corazón esmeralda (horizontal), optimizada por Cloudinary.
const HERO_IMG = 'https://res.cloudinary.com/dfmvlqtfb/image/upload/f_auto,q_auto,w_2000/v1789608088/2U5A5014_ij5yrq.jpg';

const WA = '573136133822';
const waLink = computed(() =>
  `https://wa.me/${WA}?text=${encodeURIComponent('Hola Cushion 💚 quiero una joya para regalar en Amor y Amistad, ¿me asesoran?')}`
);

const trackSelection = () => logEvent('promo_click', { source: 'amor_amistad', label: 'ver_seleccion' });
</script>

<template>
  <section class="amor-band relative overflow-hidden" :style="{ backgroundImage: `url('${HERO_IMG}')` }">
    <!-- Capa para legibilidad del texto sobre la foto -->
    <div class="absolute inset-0 amor-overlay"></div>

    <div class="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-12 md:pb-16 text-center">
      <p class="flex items-center justify-center gap-2 text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-brand-gold mb-5 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
        <span class="h-px w-6 bg-brand-gold/50"></span>
        {{ L.t('aa.eyebrow') }}
        <span class="h-px w-6 bg-brand-gold/50"></span>
      </p>

      <h2 class="font-serif-elegant text-3xl md:text-5xl leading-tight text-white mb-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
        {{ L.t('aa.title') }}
      </h2>

      <p class="text-white/85 font-sans-luxury text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-9 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        {{ L.t('aa.subtitle') }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <RouterLink to="/coleccion/Amor y Amistad" @click="trackSelection"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] hover:brightness-95 transition shadow-lg">
          <Icon icon="lucide:gem" class="w-4 h-4" /> {{ L.t('aa.cta') }}
        </RouterLink>

        <a :href="waLink" target="_blank" rel="noopener" data-wa-source="amor_amistad"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/60 text-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-white/15 transition backdrop-blur-sm">
          <Icon icon="simple-icons:whatsapp" class="w-4 h-4" /> {{ L.t('aa.whatsapp') }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "../assets/main.css";

.amor-band {
  min-height: calc(100vh - 131px);   /* ocupa la pantalla, descontando el header (131px) */
  min-height: calc(100svh - 131px);  /* móvil moderno (sin saltos con la barra) */
  display: flex;
  align-items: flex-end;         /* el texto va abajo → el corazón queda libre arriba */
  justify-content: center;
  background-color: #3f6b53;      /* respaldo esmeralda mientras carga / si falla la foto */
  background-size: cover;
  background-position: center 38%;
  background-attachment: scroll;
  border-bottom: 1px solid rgba(184, 155, 106, 0.4);
}

/* Parallax solo en escritorio (en móvil 'fixed' se comporta mal) */
@media (min-width: 768px) and (hover: hover) {
  .amor-band { background-attachment: fixed; }
}

/* Casi transparente arriba (se ve el corazón), oscuro abajo (se lee el texto) */
.amor-overlay {
  background: linear-gradient(
    to bottom,
    rgba(20, 32, 26, 0.10) 0%,
    rgba(20, 32, 26, 0.05) 42%,
    rgba(20, 32, 26, 0.40) 66%,
    rgba(20, 32, 26, 0.88) 100%
  );
}
</style>
