<script setup>
import { RouterLink } from 'vue-router';
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();
</script>

<template>
  <section class="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-brand-black">
    <div class="text-center max-w-lg">

      <!-- Firma decorativa -->
      <div class="flex items-center justify-center gap-4 mb-8">
        <div class="h-px w-10 bg-brand-gold/50"></div>
        <svg class="w-2.5 h-2.5 text-brand-gold/70" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1 L23 9 L12 23 L1 9 Z"/>
        </svg>
        <div class="h-px w-10 bg-brand-gold/50"></div>
      </div>

      <p class="text-7xl md:text-8xl font-serif-elegant text-brand-gold tracking-[0.1em] mb-4">404</p>
      <h1 class="text-2xl md:text-3xl font-serif-elegant text-brand-white tracking-wide mb-4">
        {{ L.t('notFound.title') }}
      </h1>
      <p class="text-brand-white/55 font-sans-luxury text-sm leading-relaxed mb-10">
        {{ L.t('notFound.text') }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <RouterLink
          to="/"
          class="inline-block px-10 py-4 bg-brand-primary text-brand-black text-[10px] font-bold font-sans-luxury tracking-[0.3em] uppercase hover:opacity-90 transition-opacity duration-500">
          {{ L.t('notFound.home') }}
        </RouterLink>
        <RouterLink
          to="/coleccion"
          class="inline-block px-10 py-4 border border-brand-white/25 text-brand-white/80 text-[10px] font-bold font-sans-luxury tracking-[0.3em] uppercase hover:border-brand-gold hover:text-brand-gold transition-all duration-500">
          {{ L.t('notFound.collection') }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>
