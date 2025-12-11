<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import CartOffCanvas from '@/components/CartOffCanvas.vue'
</script>

<template>
  <div class="bg-brand-black min-h-screen font-sans-luxury"> 
    <Header />
    
    <RouterView /> 
    
    <Footer />
    <CartOffCanvas />
  </div>
</template>