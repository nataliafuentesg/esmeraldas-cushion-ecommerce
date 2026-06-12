<script setup>
import { computed, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const cartTotal = computed(() => cartStore.total);
const isOffCanvasOpen = computed(() => cartStore.isOffCanvasOpen);
const removedItems = computed(() => cartStore.removedDueToStock);

const closeCart = () => {
  cartStore.isOffCanvasOpen = false;
};

const dismissRemovedBanner = () => {
  cartStore.clearRemovedDueToStock();
};

// Cada vez que se abre el carrito, verificar si hay piezas sin stock
watch(isOffCanvasOpen, async (isOpen) => {
  if (isOpen) {
    cartStore.clearRemovedDueToStock();
    await cartStore.syncWithStock();
  }
});
</script>

<template>
  <div v-if="isOffCanvasOpen" @click="closeCart" class="fixed inset-0 bg-brand-black/70 z-40 backdrop-blur-sm"></div>

  <div
    class="fixed top-0 right-0 w-full md:w-[450px] h-full bg-brand-black text-brand-white shadow-2xl z-50 transition-transform duration-500 ease-in-out border-l border-brand-gold/20"
    :class="{ 'translate-x-0': isOffCanvasOpen, 'translate-x-full': !isOffCanvasOpen }"
  >
    <header class="p-8 border-b border-brand-white/10 flex justify-between items-center sticky top-0 bg-brand-black z-10">
      <h2 class="text-2xl font-serif-elegant tracking-wide">Selección</h2>
      <button @click="closeCart" class="text-brand-white hover:text-brand-gold transition-colors p-2">
        <Icon icon="lucide:x" class="w-6 h-6" />
      </button>
    </header>

    <!-- Aviso de piezas removidas por falta de stock -->
    <div v-if="removedItems.length > 0"
         class="mx-4 mt-4 p-4 border border-amber-500/40 bg-amber-900/20 text-amber-400 text-[11px] font-sans-luxury tracking-wide leading-relaxed">
      <p class="flex items-start gap-2">
        <Icon icon="lucide:alert-triangle" class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          <b>{{ removedItems.join(', ') }}</b>
          {{ removedItems.length === 1 ? ' se agotó' : ' se agotaron' }}
          y {{ removedItems.length === 1 ? 'fue removida' : 'fueron removidas' }} de tu selección.
        </span>
      </p>
      <button @click="dismissRemovedBanner" class="mt-2 text-amber-500/60 hover:text-amber-400 text-[10px] underline underline-offset-2 block">
        Entendido
      </button>
    </div>

    <div class="h-full pb-64 overflow-y-auto custom-scrollbar">
      <div v-if="cartItems.length === 0" class="p-12 text-center pt-32">
        <Icon icon="lucide:gem" class="w-12 h-12 mx-auto mb-6 text-brand-gold/30" />
        <p class="font-sans-luxury text-brand-white/40 text-[10px] tracking-wide">El joyero está vacío</p>
      </div>

      <div v-else>
        <ul class="divide-y divide-brand-white/5">
          <li v-for="item in cartItems" :key="item.productId" class="flex p-6 items-center hover:bg-brand-white/[0.02] transition-colors group">
            <div class="w-20 h-20 bg-brand-white/5 border border-brand-white/10 overflow-hidden flex-shrink-0">
              <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
            </div>
            <div class="flex-grow ml-6">
              <p class="font-serif-elegant text-sm text-brand-white tracking-wider mb-2">{{ item.productName }}</p>

              <div class="flex items-center justify-between">
                <div class="flex items-center border border-brand-white/10 bg-brand-black">
                  <button @click="cartStore.updateQuantity(item.productId, -1)" class="px-2 py-1 text-brand-white/50 hover:text-brand-gold">-</button>
                  <span class="px-3 text-[11px] text-brand-white font-sans-luxury">{{ item.quantity }}</span>
                  <button @click="cartStore.updateQuantity(item.productId, 1)" class="px-2 py-1 text-brand-white/50 hover:text-brand-gold">+</button>
                </div>
                <p class="font-sans-luxury text-[11px] text-brand-gold">$ {{ (item.price * item.quantity).toLocaleString() }}</p>
              </div>
            </div>
            <button @click="cartStore.removeItem(item.productId)" class="ml-4 text-brand-white/20 hover:text-red-400 p-2">
              <Icon icon="lucide:trash-2" class="w-4 h-4" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="cartItems.length > 0" class="absolute bottom-0 w-full p-8 bg-brand-black border-t border-brand-white/10">
      <div class="flex justify-between items-end mb-8">
        <span class="font-sans-luxury text-[10px] tracking-[0.3em] text-brand-white/40">Total Estimado</span>
        <span class="text-2xl font-serif-elegant text-brand-gold">$ {{ cartTotal.toLocaleString() }}</span>
      </div>
      <div class="grid gap-3">
        <RouterLink to="/finalizar-compra" @click="closeCart"
          class="block w-full text-center py-5 bg-brand-primary text-brand-black font-bold text-[10px] tracking-[0.3em] hover:bg-brand-gold transition-all duration-500">
          Proceder al Pago
        </RouterLink>
        <button @click="cartStore.clearCart" class="text-[9px] tracking-wide text-brand-white/30 hover:text-red-400 py-2 transition-colors">
          Vaciar Selección
        </button>
      </div>
    </div>
  </div>
</template>
