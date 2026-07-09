<script setup>
import HeroSection from '@/components/HeroSection.vue'
import CategoryShowcase from '@/components/CategoryShowcase.vue';
import NewArrivalsSection from '@/components/NewArrivalsSection.vue';
import ReviewsSection from '@/components/ReviewsSection.vue';
import StoreSection from '@/components/StoreSection.vue';
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