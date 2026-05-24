<script setup>
import { computed, onMounted } from 'vue'; 
import { RouterView, useRoute } from 'vue-router'; 
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import CartOffCanvas from '@/components/CartOffCanvas.vue';
import { useCartStore } from '@/stores/cart';
import { useHead } from '@unhead/vue';

const route = useRoute(); 
const isAdminRoute = computed(() => route.path.startsWith('/admin'));
const cartStore = useCartStore();

useHead({
  title: computed(() => route.meta.title || 'Cushion | Alta Joyería')
});

onMounted(() => {
  cartStore.initSession();
});
</script>

<template>
  <div class="bg-brand-black min-h-screen font-sans-luxury flex flex-col"> 
    
    <Header v-if="!isAdminRoute" />
    
    <main class="flex-grow relative">
      <RouterView v-slot="{ Component }">
        <transition name="fade-page">
          <KeepAlive :include="['CollectionView']">
            <component :is="Component" />
          </KeepAlive>
        </transition>
      </RouterView>
    </main>
    
    <Footer v-if="!isAdminRoute" />
    <CartOffCanvas v-if="!isAdminRoute" />
    
  </div>
</template>

<style>
.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.fade-page-enter-from,
.fade-page-leave-to {
  opacity: 0;
}
</style>