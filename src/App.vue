<script setup>
import { computed, onMounted } from 'vue'; 
import { RouterView, useRoute } from 'vue-router'; 
import { useHead } from '@unhead/vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import CartOffCanvas from '@/components/CartOffCanvas.vue';
import { useCartStore } from '@/stores/cart';

const route = useRoute(); 
const isAdminRoute = computed(() => route.path.startsWith('/admin'));

const cartStore = useCartStore();

useHead({
  title: computed(() => route.meta.title || 'Cushion | Alta Joyería'),
  meta: [
    {
      name: 'description',
      content: computed(() => route.meta.description || 'Alta joyería colombiana.')
    }
  ]
});

onMounted(() => {
  cartStore.initSession();
});
</script>

<template>
  <div class="bg-brand-black min-h-screen font-sans-luxury flex flex-col overflow-x-hidden"> 
    
    <Header v-if="!isAdminRoute" />
    
    <main class="flex-grow relative">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" :key="route.name === 'coleccion' ? 'static-collection' : route.fullPath" />
        </KeepAlive>
      </RouterView>
    </main>
    
    <Footer v-if="!isAdminRoute" />
    <CartOffCanvas v-if="!isAdminRoute" />
    
  </div>
</template>