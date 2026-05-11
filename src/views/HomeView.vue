<script setup>
import { RouterLink } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import FeaturedSection from '@/components/FeaturedSection.vue'
import StorytellingSection from '@/components/StorytellingSection.vue';
import CategoryShowcase from '@/components/CategoryShowcase.vue';


</script>

<template>
  <main class="bg-brand-black min-h-screen">
    
    <HeroSection />
    <FeaturedSection />
    <CategoryShowcase />    
  </main>
</template>

<style scoped>
/* No necesita estilos scoped */
</style>