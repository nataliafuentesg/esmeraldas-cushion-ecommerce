<script setup>
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useCartStore } from '@/stores/cart';
import { useAnalytics } from '@/composables/useAnalytics';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const { trackPurchase } = useAnalytics();

const orderNumber = route.query.order || '';
const state = ref('checking'); // checking | paid | pending | rejected | error
let pollTimer = null;
let attempts = 0;
const MAX_ATTEMPTS = 8; // ~16s (el webhook de Bold puede tardar unos segundos)

// Dispara el Pixel Purchase una sola vez, con dedup contra el CAPI (event_id = orderNumber)
const firePurchasePixel = () => {
  const raw = sessionStorage.getItem('cushion_pending_order');
  if (!raw) return;
  try {
    const o = JSON.parse(raw);
    if (o.orderNumber === orderNumber) {
      trackPurchase({ orderNumber: o.orderNumber, total: o.total, items: o.items || [] });
    }
  } catch { /* noop */ }
  sessionStorage.removeItem('cushion_pending_order'); // evita doble disparo
};

const checkStatus = async () => {
  attempts++;
  try {
    const res = await api.get(`/orders/${orderNumber}/status`);
    const status = res.data.status;

    if (status === 'PAGADO') {
      state.value = 'paid';
      firePurchasePixel();
      // Vaciar el carrito local (el backend ya lo vació en el servidor)
      cartStore.items = [];
      cartStore.total = 0;
      stopPolling();
    } else if (status === 'PAGO_RECHAZADO') {
      state.value = 'rejected';
      stopPolling();
    } else if (attempts >= MAX_ATTEMPTS) {
      // Sigue PENDIENTE_PAGO tras varios intentos — el webhook puede llegar luego
      state.value = 'pending';
      stopPolling();
    }
  } catch (e) {
    if (attempts >= MAX_ATTEMPTS) {
      state.value = 'error';
      stopPolling();
    }
  }
};

const stopPolling = () => {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
};

onMounted(() => {
  if (!orderNumber) {
    state.value = 'error';
    return;
  }
  checkStatus();
  pollTimer = setInterval(checkStatus, 2000);
});

onUnmounted(stopPolling);
</script>

<template>
  <div class="bg-brand-black min-h-screen flex items-center justify-center px-4 py-20">
    <div class="max-w-lg w-full text-center">

      <!-- Verificando -->
      <div v-if="state === 'checking'" class="border border-brand-white/10 bg-brand-black/50 p-10">
        <Icon icon="line-md:loading-twotone-loop" class="w-14 h-14 text-brand-gold mx-auto mb-6" />
        <h1 class="text-2xl font-serif-elegant text-brand-white mb-2 tracking-wide">{{ L.t('pr.checking.title') }}</h1>
        <p class="text-brand-white/50 text-sm font-sans-luxury">{{ L.t('pr.checking.sub') }}</p>
      </div>

      <!-- Pagado -->
      <div v-else-if="state === 'paid'" class="border border-brand-gold/30 bg-brand-black/50 p-10">
        <Icon icon="lucide:check-circle" class="w-16 h-16 text-brand-gold mx-auto mb-6" />
        <h1 class="text-3xl font-serif-elegant text-brand-white mb-3 tracking-wide">{{ L.t('pr.paid.title') }}</h1>
        <p class="text-brand-white/60 text-sm font-sans-luxury leading-relaxed mb-2">
          {{ L.t('pr.paid.text1a') }}
          <span class="text-brand-gold">#{{ orderNumber }}</span> {{ L.t('pr.paid.text1b') }}
        </p>
        <p class="text-brand-white/50 text-xs font-sans-luxury leading-relaxed mb-8">
          {{ L.t('pr.paid.text2') }}
        </p>
        <button @click="router.push('/')" class="border border-brand-gold text-brand-gold px-8 py-3 text-[10px] font-bold tracking-[0.3em] hover:bg-brand-gold hover:text-brand-black transition-colors">
          {{ L.t('pr.paid.cta') }}
        </button>
      </div>

      <!-- Pendiente -->
      <div v-else-if="state === 'pending'" class="border border-brand-white/10 bg-brand-black/50 p-10">
        <Icon icon="lucide:clock" class="w-14 h-14 text-brand-gold/70 mx-auto mb-6" />
        <h1 class="text-2xl font-serif-elegant text-brand-white mb-3 tracking-wide">{{ L.t('pr.pending.title') }}</h1>
        <p class="text-brand-white/60 text-sm font-sans-luxury leading-relaxed mb-8">
          {{ L.t('pr.pending.text') }}
        </p>
        <button @click="router.push('/')" class="border border-brand-gold text-brand-gold px-8 py-3 text-[10px] font-bold tracking-[0.3em] hover:bg-brand-gold hover:text-brand-black transition-colors">
          {{ L.t('pr.pending.cta') }}
        </button>
      </div>

      <!-- Rechazado -->
      <div v-else-if="state === 'rejected'" class="border border-red-900/40 bg-brand-black/50 p-10">
        <Icon icon="lucide:x-circle" class="w-14 h-14 text-red-400/80 mx-auto mb-6" />
        <h1 class="text-2xl font-serif-elegant text-brand-white mb-3 tracking-wide">{{ L.t('pr.rejected.title') }}</h1>
        <p class="text-brand-white/60 text-sm font-sans-luxury leading-relaxed mb-8">
          {{ L.t('pr.rejected.text') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button @click="router.push('/finalizar-compra')" class="border border-brand-gold text-brand-gold px-8 py-3 text-[10px] font-bold tracking-[0.3em] hover:bg-brand-gold hover:text-brand-black transition-colors">
            {{ L.t('pr.rejected.retry') }}
          </button>
          <a href="https://wa.me/573136133822" target="_blank" class="border border-[#25D366]/40 text-[#25D366] px-8 py-3 text-[10px] font-bold tracking-[0.3em] hover:bg-[#25D366]/10 transition-colors inline-flex items-center justify-center gap-2">
            <Icon icon="simple-icons:whatsapp" class="w-3.5 h-3.5" /> WhatsApp
          </a>
        </div>
      </div>

      <!-- Error -->
      <div v-else class="border border-brand-white/10 bg-brand-black/50 p-10">
        <Icon icon="lucide:alert-triangle" class="w-14 h-14 text-brand-gold/70 mx-auto mb-6" />
        <h1 class="text-2xl font-serif-elegant text-brand-white mb-3 tracking-wide">{{ L.t('pr.error.title') }}</h1>
        <p class="text-brand-white/60 text-sm font-sans-luxury leading-relaxed mb-8">
          {{ L.t('pr.error.text1') }}
          <span class="text-brand-gold" v-if="orderNumber">#{{ orderNumber }}</span> {{ L.t('pr.error.text2') }}
        </p>
        <a href="https://wa.me/573136133822" target="_blank" class="border border-[#25D366]/40 text-[#25D366] px-8 py-3 text-[10px] font-bold tracking-[0.3em] hover:bg-[#25D366]/10 transition-colors inline-flex items-center justify-center gap-2">
          <Icon icon="simple-icons:whatsapp" class="w-3.5 h-3.5" /> {{ L.t('pr.error.cta') }}
        </a>
      </div>

    </div>
  </div>
</template>
