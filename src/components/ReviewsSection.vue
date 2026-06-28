<script setup>
import { Icon } from '@iconify/vue';

// Reseñas reales de Google (verificadas). Para actualizar, edita este arreglo.
const reviews = [
  {
    name: 'Luisa María Gómez',
    text: 'Tuve una excelente experiencia en Cushion. Desde el primer momento recibí una atención cálida, profesional y muy personalizada. La calidad de las joyas es impecable, con diseños hermosos y detalles que marcan la diferencia. Sin duda, recomiendo Cushion a quienes buscan piezas especiales. ¡Volveré!',
  },
  {
    name: 'Germán Martínez',
    text: 'Es un sitio exclusivo, con atención personalizada. Una experiencia única al comprar una joya de alto valor.',
  },
  {
    name: 'Tatiana Obando',
    text: 'La mejor de las joyerías y la atención. La recomiendo 100%. El señor que me atendió me ayudó incluso a verificar si las piedras de una joya que ya tenía eran originales.',
  },
  {
    name: 'Manuela Giraldo Gómez',
    text: 'Calidad en el producto, excelente trabajo, tiempos adecuados, relación costo/beneficio 10 de 10. Y sobre todo, calidad humana en la atención.',
  },
  {
    name: 'Verónica Giraldo',
    text: 'Cumplimiento de las expectativas al 100% en calidad, producto, precio y servicio. ¡RECOMENDADOS!',
  },
  {
    name: 'Alejandra Lancheros',
    text: 'Súper cumplidos, los mejores. Excelente atención y calidad.',
  },
];

// Enlace a tu perfil de Google (reemplázalo por el link exacto de tus reseñas)
const googleReviewsUrl = 'https://www.google.com/maps/search/Cushion+Joyas+y+Esmeraldas+Bogot%C3%A1';

const initials = (name) => name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
</script>

<template>
  <section class="bg-brand-black border-t border-brand-white/5 py-16 md:py-24">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20">

      <!-- Encabezado -->
      <div class="text-center mb-12">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">Lo que dicen nuestros clientes</span>
        <h2 class="text-3xl md:text-4xl font-serif-elegant text-brand-white tracking-wide mb-4">Experiencias Cushion</h2>
        <div class="flex items-center justify-center gap-3">
          <div class="flex gap-0.5">
            <Icon v-for="i in 5" :key="i" icon="material-symbols:star-rounded" class="w-5 h-5 text-brand-gold" />
          </div>
          <span class="text-brand-white/70 text-sm font-sans-luxury">5.0 · Reseñas verificadas en Google</span>
        </div>
      </div>

      <!-- Grilla de reseñas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article v-for="r in reviews" :key="r.name"
          class="bg-brand-white/[0.02] border border-brand-white/10 p-6 flex flex-col hover:border-brand-gold/25 transition-colors duration-300">
          <!-- Estrellas + comillas -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex gap-0.5">
              <Icon v-for="i in 5" :key="i" icon="material-symbols:star-rounded" class="w-4 h-4 text-brand-gold" />
            </div>
            <Icon icon="bi:google" class="w-4 h-4 text-brand-white/25" />
          </div>

          <!-- Texto -->
          <p class="text-brand-white/75 text-sm font-sans-luxury leading-relaxed flex-1 mb-5">"{{ r.text }}"</p>

          <!-- Autor -->
          <div class="flex items-center gap-3 pt-4 border-t border-brand-white/5">
            <div class="w-9 h-9 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold text-[11px] font-bold shrink-0">
              {{ initials(r.name) }}
            </div>
            <div>
              <p class="text-brand-white text-xs font-bold tracking-wide">{{ r.name }}</p>
              <p class="text-brand-white/40 text-[10px] tracking-wide">Cliente verificado</p>
            </div>
          </div>
        </article>
      </div>

      <!-- CTA Google -->
      <div class="text-center mt-12">
        <a :href="googleReviewsUrl" target="_blank" rel="noopener"
          class="inline-flex items-center gap-2.5 border border-brand-white/20 text-brand-white/70 hover:text-brand-gold hover:border-brand-gold/40 px-8 py-3.5 text-[10px] font-bold tracking-[0.25em] transition-colors duration-300">
          <Icon icon="bi:google" class="w-4 h-4" />
          VER TODAS LAS RESEÑAS EN GOOGLE
        </a>
      </div>

    </div>
  </section>
</template>
