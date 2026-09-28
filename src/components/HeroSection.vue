<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useLocaleStore } from '@/stores/locale';
import { cloudinaryOptimize } from '@/utils/cloudinary';
const L = useLocaleStore();
defineOptions({ name: 'HeroSection' });

// Optimiza las fotos del hero (las originales pesan mucho: ~3000px).
// Así cargan livianas y no hay parpadeo en blanco al abrir.
const opt = (url, width) => cloudinaryOptimize(url, { width });

/* ─────────────────────────────────────────────────────────────
   SLIDESHOW DEL HERO
   Cada slide puede tener foto de escritorio (pc) y de móvil (mobile).
   Si no pones "mobile", usa la misma "pc" en móvil.
   👉 Para agregar fotos: pega más objetos aquí abajo. Nada más.
   ───────────────────────────────────────────────────────────── */
const heroSlides = [
  {
    pc:     'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1774902048/2U5A4981_cyohne.jpg',
    mobile: 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1790601405/2U5A4654_dhdfvo.jpg',
  },
  {
    pc:     'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1790601142/2U5A5112_hzciwl.jpg',
    mobile: 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1790601405/2U5A5045_j2e4mr.jpg',
  },
  {
    pc:     'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1790601142/2U5A4972_ptwgak.jpg',
    mobile: 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1790601405/2U5A4986_du4uff.jpg',
  },
  {
    pc:     'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1790601142/2U5A4788_vxuuco.jpg',
    mobile: 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1790601404/2U5A4648_vprw46.jpg',
  },
];

const current = ref(0);
const previous = ref(-1);
let slideTimer = null;

// Al cambiar de foto guardamos la anterior: se queda quieta y opaca DEBAJO,
// mientras la nueva aparece ENCIMA. Así nunca se cruzan a media opacidad
// (que era lo que causaba el parpadeo raro).
const nextSlide = () => {
  previous.value = current.value;
  current.value = (current.value + 1) % heroSlides.length;
};

// Parallax con JS: mueve la imagen más lento que el scroll (sin agrandarla).
const section = ref(null);
const media = ref(null);
let raf = null;

const onScroll = () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = null;
    const sec = section.value;
    const m = media.value;
    if (!sec || !m) return;
    const rect = sec.getBoundingClientRect();
    // solo calcula si la sección está cerca del viewport
    if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
    const offset = Math.max(-110, Math.min(110, -rect.top * 0.12));
    m.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
};

// Letras de CUSHION para animarlas una por una al abrir
const letters = 'CUSHION'.split('');

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // respeta accesibilidad
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // Auto-cambio de fotos (solo si hay más de una)
  if (heroSlides.length > 1) {
    slideTimer = setInterval(nextSlide, 6000);
  }
});
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  if (slideTimer) clearInterval(slideTimer);
});
</script>

<template>
  <section ref="section" class="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden">

    <!-- ── SLIDESHOW DE FONDO (parallax + crossfade) ─────────────────────── -->
    <div class="absolute inset-0 z-0">
      <div ref="media" class="hero-media">
        <div
          v-for="(slide, i) in heroSlides"
          :key="i"
          class="hero-slide"
          :class="{ 'is-current': i === current, 'is-previous': i === previous }"
          :style="{ zIndex: i === current ? 2 : (i === previous ? 1 : 0) }"
        >
          <picture class="block w-full h-full">
            <source :srcset="opt(slide.pc, 1800)" media="(min-width: 768px)" />
            <img
              :src="opt(slide.mobile || slide.pc, 900)"
              alt="Alta Joyería Cushion"
              :fetchpriority="i === 0 ? 'high' : 'auto'"
              decoding="async"
              class="w-full h-full object-cover hero-image"
            />
          </picture>
        </div>
      </div>

      <!-- Gradiente suave: oscurece solo tope y pie, respeta el centro -->
      <div class="absolute inset-0
                  bg-gradient-to-b
                  from-brand-black/55
                  via-brand-black/10
                  to-brand-black/75">
      </div>

      <!-- Halo cálido detrás del texto: hace que las letras oscuras se lean
           sobre la foto sin tapar la joya del centro -->
      <div class="absolute inset-0 hero-glow pointer-events-none"></div>
    </div>

    <!-- ── CONTENIDO ─────────────────────────────────────────────────────── -->
    <div class="relative z-10 text-center px-6 max-w-3xl -translate-y-10 md:-translate-y-14">

      <!-- Firma decorativa: línea · rombo · línea -->
      <div class="flex items-center justify-center gap-4 mb-8 hero-ornament">
        <div class="h-px w-10 md:w-16 bg-brand-gold/60"></div>
        <svg class="w-2.5 h-2.5 text-brand-gold flex-shrink-0"
             viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1 L23 9 L12 23 L1 9 Z"/>
        </svg>
        <div class="h-px w-10 md:w-16 bg-brand-gold/60"></div>
      </div>

      <!-- Título: cada letra aparece con un fade + blur en cascada -->
      <h1 class="text-[3.35rem] sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem]
                 text-brand-white font-serif-elegant font-light
                 tracking-[0.16em] sm:tracking-[0.22em] leading-none mb-5 hero-title" aria-label="CUSHION">
        <span
          v-for="(ch, i) in letters"
          :key="i"
          class="hero-letter"
          :style="{ animationDelay: (0.35 + i * 0.085) + 's' }"
          aria-hidden="true"
        >{{ ch }}</span>
      </h1>

      <!-- Separador dorado -->
      <div class="h-px w-14 bg-brand-gold/50 mx-auto mb-5 hero-sep"></div>

      <!-- Tagline: más contraste + halo para que se lea sobre la foto -->
      <p class="text-[11px] sm:text-xs text-brand-white/90 font-sans-luxury
                tracking-[0.55em] uppercase mb-12 hero-tagline">
        {{ L.t('home.hero.subtitle') }}
      </p>

      <!-- CTA glass: panel esmerilado, se lee claro sobre la foto -->
      <RouterLink
        to="/coleccion"
        class="hero-cta inline-block px-11 py-4
               bg-brand-black/40 backdrop-blur-lg
               border border-brand-white/45 text-brand-white
               text-[10px] font-bold font-sans-luxury tracking-[0.4em] uppercase
               shadow-xl
               hover:bg-brand-primary hover:border-brand-primary hover:text-brand-black
               transition-all duration-500">
        {{ L.t('home.hero.cta') }}
      </RouterLink>
    </div>

    <!-- ── SCROLL INDICATOR ──────────────────────────────────────────────── -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10
                flex flex-col items-center gap-3 scroll-indicator">
      <span class="text-brand-white/40 text-[7px] tracking-[0.45em] font-sans-luxury uppercase">
        {{ L.t('home.hero.scroll') }}
      </span>
      <div class="w-px h-8 bg-gradient-to-b from-brand-white/40 to-transparent scroll-line"></div>
    </div>

  </section>
</template>

<style scoped>
@reference "../assets/main.css";

/* Capa que se desplaza para el parallax (un poco más alta para no dejar bordes) */
.hero-media {
  position: absolute;
  top: -15%;
  left: 0;
  right: 0;
  height: 130%;
  will-change: transform;
}

/* ── Slides apilados: la nueva entra ENCIMA de la anterior ──
   La anterior se queda opaca debajo (sin animar) y la actual aparece
   por encima con un fade. Así nunca se ven las dos a media opacidad
   → se acaba el parpadeo. */
.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
}
/* La foto anterior permanece visible y quieta como fondo sólido */
.hero-slide.is-previous {
  opacity: 1;
}
/* La foto actual aparece por encima con un fundido suave */
.hero-slide.is-current {
  opacity: 1;
  transition: opacity 1.1s ease-in;
}

/* Sin zoom Ken Burns: hacía que la foto saliente saltara de golpe de vuelta
   a su tamaño al cambiar (se sentía un "tirón"). Sin él, el cambio es limpio. */
.hero-image {
  object-position: center center;
}

/* Halo cálido radial detrás del texto */
.hero-glow {
  background: radial-gradient(ellipse 62% 52% at center 44%,
              rgba(250, 247, 242, 0.42) 0%,
              rgba(250, 247, 242, 0.12) 42%,
              transparent 70%);
}

/* Un poco de sombra clara detrás del texto oscuro = más legible */
.hero-title,
.hero-tagline {
  text-shadow: 0 1px 16px rgba(250, 247, 242, 0.55);
}

/* ── Aparición del contenido ── */
.hero-ornament {
  animation: fade-up 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* CUSHION en una sola línea: al ser letras sueltas (spans) hay que evitar
   que el renglón se parta entre letras en móvil */
.hero-title {
  white-space: nowrap;
}

/* Cada letra de CUSHION: fade + blur + subida, en cascada */
.hero-letter {
  display: inline-block;
  opacity: 0;
  animation: letter-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes letter-in {
  0%   { opacity: 0; transform: translateY(30px) scale(0.9); filter: blur(10px); }
  60%  { opacity: 1; }
  100% { opacity: 1; transform: translateY(0)    scale(1);   filter: blur(0);    }
}

.hero-sep {
  transform-origin: center;
  animation: grow-line 1.2s 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes grow-line {
  from { transform: scaleX(0); opacity: 0; }
  to   { transform: scaleX(1); opacity: 1; }
}

.hero-tagline {
  animation: fade-up 1.4s 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.hero-cta {
  animation: fade-up 1.4s 1.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* ── Indicador de scroll pulsante ── */
.scroll-indicator {
  animation: fade-up 1.6s 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.scroll-line {
  animation: scroll-pulse 2.4s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1);    }
  50%       { opacity: 0.7; transform: scaleY(1.15); }
}

/* Accesibilidad: sin movimiento fuerte si el usuario lo pidió */
@media (prefers-reduced-motion: reduce) {
  .hero-letter { opacity: 1; filter: none; transform: none; animation: none; }
  .hero-slide.is-current { transition: none; }
  .hero-slide.is-current .hero-image { animation: none; }
}
</style>
