<script setup>
import TopBar from '@/components/TopBar.vue'
import MainNav from '@/components/MainNav.vue'
</script>

<template>
  <header class="sticky top-0 z-50 bg-brand-black shadow-xl">
    
    <TopBar />
    
    <MainNav />
    
  </header>
</template>

<style scoped>
/* No necesita estilos scoped aquí ya que los hijos manejan sus propios estilos */
</style>