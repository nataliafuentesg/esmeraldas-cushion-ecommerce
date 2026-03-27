<script setup>
import { computed, onMounted } from 'vue'; // Añadimos computed aquí
import { RouterView, useRoute } from 'vue-router'; // Añadimos useRoute aquí
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import CartOffCanvas from '@/components/CartOffCanvas.vue';
import { useCartStore } from '@/stores/cart';

const route = useRoute(); // Inicializamos el router para poder leer la URL
const isAdminRoute = computed(() => route.path.startsWith('/admin'));

const cartStore = useCartStore();

onMounted(() => {
  cartStore.initSession();
});
</script>

<template>
  <div class="bg-brand-black min-h-screen font-sans-luxury flex flex-col"> 
    
    <Header v-if="!isAdminRoute" />
    
    <main class="flex-grow">
      <RouterView /> 
    </main>
    
    <Footer v-if="!isAdminRoute" />
    <CartOffCanvas v-if="!isAdminRoute" />
    
  </div>
</template>