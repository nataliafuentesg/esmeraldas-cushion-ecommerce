<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const cartTotal = computed(() => cartStore.cartTotal);
const isOffCanvasOpen = computed(() => cartStore.isOffCanvasOpen);

const removeItem = (productId) => {
    cartStore.removeItem(productId);
};

const closeCart = () => {
    cartStore.toggleOffCanvas();
};
</script>

<template>
  <div 
    v-if="isOffCanvasOpen" 
    @click="closeCart" 
    class="fixed inset-0 bg-brand-black/50 z-40 transition-opacity duration-300"
  ></div>

  <div 
    class="fixed top-0 right-0 w-full md:w-96 h-full bg-brand-black text-brand-white shadow-2xl z-50 transition-transform duration-300 ease-in-out border-l border-brand-gold/10"
    :class="{ 'translate-x-0': isOffCanvasOpen, 'translate-x-full': !isOffCanvasOpen }"
  >
    
    <header class="p-6 border-b border-brand-white/10 flex justify-between items-center sticky top-0 bg-brand-black">
      <h2 class="text-2xl font-serif-elegant uppercase tracking-widest">Mi Carrito</h2>
      <button @click="closeCart" class="text-brand-white hover:text-brand-gold transition-colors">
        <Icon icon="lucide:x" class="w-6 h-6" />
      </button>
    </header>

    <div class="h-full pb-44 overflow-y-auto">
      <div v-if="cartItems.length === 0" class="p-6 text-center pt-20">
        <Icon icon="lucide:shopping-cart" class="w-12 h-12 mx-auto mb-4 text-brand-gold" />
        <p class="font-sans-luxury text-brand-white/70">Tu carrito está vacío.</p>
        <RouterLink to="/esmeraldas" @click="closeCart" class="mt-6 inline-block text-sm font-bold text-brand-gold hover:text-brand-primary transition-colors uppercase">
            Explorar Colección
        </RouterLink>
      </div>

      <div v-else>
        <ul class="divide-y divide-brand-white/10">
          <li v-for="item in cartItems" :key="item.product.id" class="flex p-4 items-center hover:bg-brand-black/50 transition-colors">
            <img :src="`/src/assets/images/products/${item.product.mainImage}`" :alt="item.product.name" class="w-16 h-16 object-cover mr-4 border border-brand-white/20">
            
            <div class="flex-grow">
              <p class="font-serif-elegant text-base text-brand-white uppercase truncate">{{ item.product.name }}</p>
              <p class="font-sans-luxury text-sm text-brand-gold">
                {{ item.quantity }} x $ {{ item.product.price.toLocaleString() }}
              </p>
            </div>
            
            <button @click="removeItem(item.product.id)" class="ml-4 text-brand-white/50 hover:text-brand-gold transition-colors">
              <Icon icon="lucide:trash" class="w-5 h-5" />
            </button>
          </li>
        </ul>
      </div>
    </div>
    
    <div v-if="cartItems.length > 0" class="absolute bottom-0 w-full p-6 bg-brand-black border-t border-brand-white/10 shadow-3xl">
      <div class="flex justify-between font-serif-elegant text-xl mb-4">
        <span class="uppercase">Subtotal:</span>
        <span class="text-brand-gold">$ {{ cartTotal.toLocaleString() }}</span>
      </div>
      
      <RouterLink 
        to="/carrito" 
        @click="closeCart"
        class="block text-center px-6 py-3 bg-brand-primary text-brand-black uppercase font-bold text-sm tracking-widest hover:bg-brand-gold transition-colors duration-300 mb-3"
      >
        Ver Carrito Completo
      </RouterLink>
      
      <button 
        class="block w-full text-center px-6 py-3 border border-brand-primary text-brand-primary uppercase font-bold text-sm tracking-widest hover:bg-brand-primary/10 transition-colors duration-300"
      >
        Finalizar Compra
      </button>
    </div>
  </div>
</template>