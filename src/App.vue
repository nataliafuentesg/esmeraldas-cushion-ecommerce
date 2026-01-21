<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import CartOffCanvas from '@/components/CartOffCanvas.vue'
import { onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

onMounted(() => {
  cartStore.initSession();
});
</script>

<template>
  <div class="bg-brand-black min-h-screen font-sans-luxury"> 
    <Header />
    
    <RouterView /> 
    
    <Footer />
    <CartOffCanvas />
  </div>
</template>