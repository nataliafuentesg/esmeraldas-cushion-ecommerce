<script setup>
import { RouterLink } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import FeaturedSection from '@/components/FeaturedSection.vue'
import CategoryShowcase from '@/components/CategoryShowcase.vue';
import OccasionBadges from '@/components/OccasionBadges.vue';
import ReviewsSection from '@/components/ReviewsSection.vue';
import StoreSection from '@/components/StoreSection.vue';
const homeOccasions = ['Compromiso', 'Bodas', 'Quinceaños', 'Aniversario', 'Regalo'];


</script>

<template>
  <main class="bg-brand-black min-h-screen">
    <HeroSection />

    <div class="container mx-auto py-12 md:py-16 border-t border-brand-white/5">
      <OccasionBadges :occasions="homeOccasions" :is-home="true" />
    </div>

    <CategoryShowcase />

    <FeaturedSection />

    <ReviewsSection />

    <StoreSection />
  </main>
</template>

<style scoped>
/* No necesita estilos scoped */
</style>