<script setup>
import { useHead } from '@unhead/vue';
import HeroSection from '@/components/HeroSection.vue'
import CategoryShowcase from '@/components/CategoryShowcase.vue';
import NewArrivalsSection from '@/components/NewArrivalsSection.vue';
import ReviewsSection from '@/components/ReviewsSection.vue';
import StoreSection from '@/components/StoreSection.vue';

// Datos estructurados de la MARCA + TIENDA + CALIFICACIÓN.
// Ayuda a Google (resultados enriquecidos / panel de conocimiento) y a que las
// IAs entiendan y citen a Cushion. La calificación refleja las reseñas reales
// que se muestran en esta misma página (ReviewsSection).
const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'JewelryStore',
  '@id': 'https://cushionjewelry.com/#tienda',
  name: 'Cushion Joyas & Esmeraldas',
  alternateName: 'Cushion Jewelry',
  url: 'https://cushionjewelry.com',
  logo: 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1781226801/logo-cushion-black_ryyyje.png',
  image: 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1781226801/logo-cushion-black_ryyyje.png',
  description: 'Alta joyería con esmeraldas colombianas certificadas. Diseñada en Bogotá, con tienda física, certificación y envío asegurado a todo el país.',
  telephone: '+573136133822',
  priceRange: '$$$',
  currenciesAccepted: 'COP',
  paymentAccepted: 'Tarjeta de crédito, Tarjeta débito, PSE',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida Jiménez 5-43, Local 216 — Emerald Trade Center',
    addressLocality: 'Bogotá',
    addressRegion: 'Bogotá D.C.',
    addressCountry: 'CO',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '17:00' },
  ],
  sameAs: [
    'https://www.instagram.com/joyasyesmeraldas/',
    'https://www.facebook.com/cushionjewels',
    'https://www.tiktok.com/@cushion.joyas.esmeraldas',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '6',
    bestRating: '5',
    worstRating: '1',
  },
};

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(businessJsonLd),
    },
  ],
});
</script>

<template>
  <main class="bg-brand-black min-h-screen">
    <HeroSection />

    <CategoryShowcase />

    <NewArrivalsSection />

    <ReviewsSection />

    <StoreSection />
  </main>
</template>

<style scoped>
/* No necesita estilos scoped */
</style>