<script setup>
import HeroSection from '@/components/HeroSection.vue'
import FeaturedSection from '@/components/FeaturedSection.vue'
import CategoryShowcase from '@/components/CategoryShowcase.vue';
import ReviewsSection from '@/components/ReviewsSection.vue';
import StoreSection from '@/components/StoreSection.vue';
</script>

<template>
  <main class="bg-brand-black min-h-screen">
    <HeroSection />

    <CategoryShowcase />

    <FeaturedSection />

    <ReviewsSection />

    <StoreSection />
  </main>
</template>

<style scoped>
/* No necesita estilos scoped */
</style>