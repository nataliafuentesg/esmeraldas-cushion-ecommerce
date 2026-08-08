<script setup>
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();
</script>

<template>
  <div class="inline-flex items-center text-[10px] tracking-[0.15em] font-sans-luxury select-none">
    <button
      @click="L.setLocale('es')"
      :class="L.locale === 'es' ? 'text-brand-gold font-bold' : 'text-brand-white/40 hover:text-brand-white/70'"
      class="px-1 transition-colors"
      aria-label="Español">ES</button>
    <span class="text-brand-white/20">/</span>
    <button
      @click="L.setLocale('en')"
      :class="L.locale === 'en' ? 'text-brand-gold font-bold' : 'text-brand-white/40 hover:text-brand-white/70'"
      class="px-1 transition-colors"
      aria-label="English">EN</button>
  </div>
</template>
