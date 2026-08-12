<script setup>
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();
import { ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const route = useRoute();
const orderNumber = ref(route.query.order || '');
const contact = ref('');
const order = ref(null);
const errorMsg = ref('');
const loading = ref(false);
const boldContainer = ref(null);
const showPayment = ref(false);

// Pasos del pedido en orden
const steps = [
  { key: 'PENDIENTE_PAGO', labelKey: 'tk.step.received', icon: 'lucide:receipt' },
  { key: 'PAGADO',         labelKey: 'tk.step.paid', icon: 'lucide:credit-card' },
  { key: 'ENVIADO',        labelKey: 'tk.step.shipped', icon: 'lucide:truck' },
  { key: 'ENTREGADO',      labelKey: 'tk.step.delivered', icon: 'lucide:package-check' },
];

const currentStepIndex = (status) => {
  const i = steps.findIndex(s => s.key === status);
  return i === -1 ? 0 : i;
};

const search = async () => {
  if (!orderNumber.value.trim() || !contact.value.trim()) {
    errorMsg.value = 'Ingresa tu número de pedido y tu correo o teléfono.';
    return;
  }
  loading.value = true;
  errorMsg.value = '';
  order.value = null;
  showPayment.value = false;
  try {
    const res = await api.get('/orders/track', {
      params: { orderNumber: orderNumber.value.trim(), contact: contact.value.trim() }
    });
    order.value = res.data;
  } catch (e) {
    errorMsg.value = e.response?.data?.message
      || 'No encontramos el pedido. Verifica los datos e intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};

// Completar el pago de una orden pendiente desde el rastreo
const payPending = async () => {
  showPayment.value = true;
  await nextTick();
  renderBoldButton();
};

const renderBoldButton = () => {
  const o = order.value;
  if (!boldContainer.value || !o || !o.boldApiKey) return;
  boldContainer.value.innerHTML = '';

  const btn = document.createElement('script');
  btn.setAttribute('data-bold-button', 'dark-L');
  btn.setAttribute('data-order-id', o.orderNumber);
  btn.setAttribute('data-currency', o.boldCurrency || 'COP');
  btn.setAttribute('data-amount', String(o.boldAmount));
  btn.setAttribute('data-api-key', o.boldApiKey);
  btn.setAttribute('data-integrity-signature', o.boldIntegritySignature);
  btn.setAttribute('data-description', `Pedido Cushion ${o.orderNumber}`);
  btn.setAttribute('data-redirection-url',
    `https://cushionjewelry.com/pago-resultado?order=${o.orderNumber}`);
  btn.setAttribute('data-customer-data', JSON.stringify({
    email: o.customerEmail || '',
    fullName: o.customerName || '',
    phone: o.phoneNumber || '',
  }));
  boldContainer.value.appendChild(btn);

  const prev = document.getElementById('bold-checkout-lib');
  if (prev) prev.remove();
  const lib = document.createElement('script');
  lib.id = 'bold-checkout-lib';
  lib.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
  document.head.appendChild(lib);
};
</script>

<template>
  <div class="bg-brand-black min-h-screen py-16 lg:py-24 font-sans text-brand-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20 max-w-3xl">

      <header class="text-center mb-12">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">{{ L.t('tk.eyebrow') }}</span>
        <h1 class="text-3xl md:text-4xl font-serif-elegant tracking-wide mb-4">{{ L.t('tk.title') }}</h1>
        <div class="h-[1px] w-20 bg-brand-gold mx-auto mb-5"></div>
        <p class="text-brand-white/50 font-sans-luxury text-sm max-w-md mx-auto">
          {{ L.t('tk.sub') }}
        </p>
      </header>

      <!-- Formulario -->
      <div class="bg-brand-white/[0.02] border border-brand-white/10 p-6 md:p-8 mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-[10px] text-brand-white/50 tracking-wide block mb-2">{{ L.t('tk.orderNumber') }}</label>
            <input v-model="orderNumber" type="text" placeholder="CUSH-XXXXXXXX" @keydown.enter="search"
              class="w-full bg-transparent border-b border-brand-white/20 py-2 text-brand-white text-sm focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/25 uppercase">
          </div>
          <div>
            <label class="text-[10px] text-brand-white/50 tracking-wide block mb-2">{{ L.t('tk.contact') }}</label>
            <input v-model="contact" type="text" :placeholder="L.t('tk.contactPlaceholder')" @keydown.enter="search"
              class="w-full bg-transparent border-b border-brand-white/20 py-2 text-brand-white text-sm focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/25">
          </div>
        </div>
        <p v-if="errorMsg" class="text-red-400/80 text-xs font-sans-luxury mb-4">{{ errorMsg }}</p>
        <button @click="search" :disabled="loading"
          class="w-full sm:w-auto bg-brand-gold text-brand-black px-10 py-3 text-[10px] font-bold tracking-[0.3em] hover:bg-brand-white transition-colors disabled:opacity-50">
          {{ loading ? L.t('tk.searching') : L.t('tk.track') }}
        </button>
      </div>

      <!-- Resultado -->
      <div v-if="order" class="border border-brand-gold/20 bg-brand-black/50 p-6 md:p-10 fade-in">
        <div class="flex flex-wrap justify-between items-baseline gap-2 mb-8 border-b border-brand-white/10 pb-5">
          <div>
            <p class="text-[10px] text-brand-white/40 tracking-wide">{{ L.t('tk.order') }}</p>
            <p class="text-xl font-serif-elegant text-brand-white tracking-wide">#{{ order.orderNumber }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-brand-white/40 tracking-wide">{{ L.t('co.total') }}</p>
            <p class="text-lg font-serif-elegant text-brand-gold">${{ order.totalAmount.toLocaleString() }}</p>
          </div>
        </div>

        <!-- Timeline de estados -->
        <div v-if="order.status !== 'PAGO_RECHAZADO' && order.status !== 'CANCELADO'" class="mb-8">
          <div class="flex justify-between relative">
            <div class="absolute top-5 left-0 right-0 h-[1px] bg-brand-white/10"></div>
            <div v-for="(step, idx) in steps" :key="step.key" class="relative flex flex-col items-center flex-1 z-10">
              <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
                :class="idx <= currentStepIndex(order.status)
                  ? 'bg-brand-gold border-brand-gold text-brand-black'
                  : 'bg-brand-black border-brand-white/20 text-brand-white/30'">
                <Icon :icon="step.icon" class="w-4 h-4" />
              </div>
              <p class="text-[9px] tracking-wide mt-2 text-center"
                :class="idx <= currentStepIndex(order.status) ? 'text-brand-gold' : 'text-brand-white/30'">
                {{ L.t(step.labelKey) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Estado rechazado -->
        <div v-else class="bg-red-900/20 border border-red-900/40 p-4 mb-8 text-center">
          <p class="text-red-300/80 text-sm font-sans-luxury">
            {{ order.status === 'PAGO_RECHAZADO' ? L.t('tk.rejected') : L.t('tk.canceled') }}
          </p>
        </div>

        <!-- Completar pago (orden pendiente) -->
        <div v-if="order.status === 'PENDIENTE_PAGO'" class="bg-brand-gold/[0.06] border border-brand-gold/30 p-6 mb-8 text-center">
          <Icon icon="lucide:alert-circle" class="w-8 h-8 text-brand-gold mx-auto mb-3" />
          <h4 class="text-brand-white font-serif-elegant text-lg mb-2">{{ L.t('tk.pendingTitle') }}</h4>
          <p class="text-brand-white/50 text-xs font-sans-luxury mb-6 max-w-sm mx-auto">
            {{ L.t('tk.pendingText') }}
          </p>

          <button v-if="!showPayment" @click="payPending"
            class="bg-brand-gold text-brand-black px-10 py-3 text-[10px] font-bold tracking-[0.3em] hover:bg-brand-white transition-colors">
            {{ L.t('tk.completePayment') }}
          </button>

          <!-- Bold renderiza el botón aquí -->
          <form v-show="showPayment" ref="boldContainer" class="flex justify-center"></form>

          <p v-if="showPayment" class="text-brand-white/30 text-[10px] font-sans-luxury tracking-wide mt-4 flex items-center justify-center gap-1.5">
            <Icon icon="lucide:lock" class="w-3 h-3" /> {{ L.t('tk.boldSecure') }}
          </p>
        </div>

        <!-- Reserva vencida -->
        <div v-if="order.status === 'EXPIRADO'" class="bg-brand-white/[0.03] border border-brand-white/10 p-5 mb-8 text-center">
          <p class="text-brand-white/60 text-sm font-sans-luxury mb-4">
            {{ L.t('tk.expiredText') }}
          </p>
          <RouterLink to="/coleccion"
            class="inline-block border border-brand-gold text-brand-gold px-8 py-2.5 text-[10px] font-bold tracking-[0.2em] hover:bg-brand-gold hover:text-brand-black transition-colors">
            {{ L.t('tk.backToCollection') }}
          </RouterLink>
        </div>

        <!-- Datos de envío (si ya fue enviado) -->
        <div v-if="order.trackingNumber" class="bg-brand-white/[0.03] border border-brand-white/10 p-5 mb-6">
          <h4 class="text-brand-gold text-[10px] tracking-[0.3em] mb-3">{{ L.t('tk.shippingInfo') }}</h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-[10px] text-brand-white/40">{{ L.t('tk.carrier') }}</p>
              <p class="text-brand-white">{{ order.shippingCarrier || '—' }}</p>
            </div>
            <div>
              <p class="text-[10px] text-brand-white/40">{{ L.t('tk.trackingNumber') }}</p>
              <p class="text-brand-white tracking-wide">{{ order.trackingNumber }}</p>
            </div>
          </div>
        </div>

        <!-- Artículos -->
        <div v-if="order.items && order.items.length">
          <h4 class="text-brand-white/60 text-[10px] tracking-[0.3em] mb-3 border-b border-brand-white/10 pb-2">{{ L.t('tk.items') }}</h4>
          <div v-for="(it, i) in order.items" :key="i" class="flex justify-between text-sm py-2">
            <span class="text-brand-white/80">
              <span class="text-brand-gold">{{ it.quantity }}x</span> {{ it.name }}
              <span v-if="it.size" class="block text-[10px] text-brand-gold/70">{{ L.t('cart.size') }} {{ it.size }}</span>
            </span>
            <span class="text-brand-white/70">${{ (it.price || 0).toLocaleString() }}</span>
          </div>
        </div>

        <p class="text-center text-brand-white/30 text-[10px] mt-8 font-sans-luxury">
          {{ L.t('tk.doubts') }}
          <a href="https://wa.me/573136133822" target="_blank" class="text-brand-gold hover:underline">{{ L.t('tk.whatsappUs') }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
