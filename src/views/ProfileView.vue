<script setup>
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const authStore = useAuthStore();
const router = useRouter();

const orders = ref([]);
const loading = ref(true);
const expandedOrders = ref(new Set());

const WA_NUMBER = '573136133822';

// Mapa de estados: label en español + clases Tailwind
const STATUS_MAP = {
  PENDIENTE_PAGO: {
    labelKey: 'st.pending',
    icon: 'lucide:clock',
    classes: 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30',
    step: 0,
  },
  PAGADO: {
    labelKey: 'st.paid',
    icon: 'lucide:check-circle',
    classes: 'bg-blue-900/30 text-blue-400 border border-blue-500/30',
    step: 1,
  },
  ENVIADO: {
    labelKey: 'st.shipped',
    icon: 'lucide:package',
    classes: 'bg-purple-900/30 text-purple-400 border border-purple-500/30',
    step: 2,
  },
  ENTREGADO: {
    labelKey: 'st.delivered',
    icon: 'lucide:gem',
    classes: 'bg-green-900/30 text-green-400 border border-green-500/30',
    step: 3,
  },
  CANCELADO: {
    labelKey: 'st.canceled',
    icon: 'lucide:x-circle',
    classes: 'bg-red-900/30 text-red-400 border border-red-500/30',
    step: -1,
  },
  EXPIRADO: {
    labelKey: 'st.expired',
    icon: 'lucide:clock-alert',
    classes: 'bg-brand-white/10 text-brand-white/40 border border-brand-white/20',
    step: -1,
  },
  PAGO_RECHAZADO: {
    labelKey: 'st.rejected',
    icon: 'lucide:x-circle',
    classes: 'bg-red-900/30 text-red-400 border border-red-500/30',
    step: -1,
  },
  PAGO_SIN_STOCK: {
    labelKey: 'st.review',
    icon: 'lucide:alert-triangle',
    classes: 'bg-orange-900/30 text-orange-400 border border-orange-500/30',
    step: -1,
  },
};

const TIMELINE_STEPS = [
  { key: 'PENDIENTE_PAGO', labelKey: 'pf.tl.pending', icon: 'lucide:clock' },
  { key: 'PAGADO',         labelKey: 'pf.tl.paid', icon: 'lucide:check-circle' },
  { key: 'ENVIADO',        labelKey: 'pf.tl.shipped', icon: 'lucide:package' },
  { key: 'ENTREGADO',      labelKey: 'pf.tl.delivered', icon: 'lucide:gem' },
];

const getStatus = (status) => STATUS_MAP[status] || { label: status, icon: 'lucide:circle', classes: 'bg-brand-white/10 text-brand-white/60 border border-brand-white/20', step: 0 };
const statusLabel = (status) => { const st = getStatus(status); return st.labelKey ? L.t(st.labelKey) : (st.label || status); };

const toggleOrder = (id) => {
  if (expandedOrders.value.has(id)) {
    expandedOrders.value.delete(id);
  } else {
    expandedOrders.value.add(id);
  }
  // Forzar reactividad en Set
  expandedOrders.value = new Set(expandedOrders.value);
};

const isExpanded = (id) => expandedOrders.value.has(id);

const openOrderWhatsApp = (order) => {
  const msg = encodeURIComponent(
    `Hola Cushion 💎\n\nSoy *${authStore.user?.firstName} ${authStore.user?.lastName}*.\n\nQuiero consultar el estado de mi pedido *#${order.orderNumber}*.\n\n¿Pueden ayudarme?`
  );
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
};

const ordersDesc = computed(() =>
  [...orders.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth');
    return;
  }
  try {
    const response = await api.get(`/orders/client/${authStore.user.id}`);
    orders.value = response.data;
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  } finally {
    loading.value = false;
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-20 pb-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

      <!-- Encabezado -->
      <div class="flex flex-col md:flex-row justify-between items-end border-b border-brand-white/10 pb-6 mb-12">
        <div>
          <p class="text-brand-gold font-sans-luxury text-[10px] tracking-[0.4em] mb-2">{{ L.t('pf.myAccount') }}</p>
          <h1 class="text-4xl md:text-5xl font-serif-elegant text-brand-white tracking-wide">
            {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
          </h1>
          <p class="text-brand-white/40 font-sans-luxury text-xs tracking-wide mt-2">
            {{ authStore.user?.email }}
          </p>
        </div>
        <button @click="handleLogout"
          class="mt-6 md:mt-0 text-brand-white/40 hover:text-brand-white text-[10px] tracking-wide underline underline-offset-4 transition-colors flex items-center gap-2 group">
          <Icon icon="lucide:log-out" class="w-3 h-3 group-hover:text-brand-gold transition-colors" />
          {{ L.t('pf.logout') }}
        </button>
      </div>

      <!-- Historial -->
      <section>
        <h2 class="text-xl font-serif-elegant text-brand-white tracking-wider mb-8">
          {{ L.t('pf.orderHistory') }}
        </h2>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center gap-3 text-brand-white/40 font-sans-luxury text-xs tracking-wide">
          <Icon icon="line-md:loading-twotone-loop" class="w-5 h-5 text-brand-gold animate-spin" />
          {{ L.t('pf.loading') }}
        </div>

        <!-- Sin órdenes -->
        <div v-else-if="ordersDesc.length === 0"
          class="text-center py-20 border border-brand-white/5 bg-brand-white/[0.02]">
          <Icon icon="lucide:gem" class="w-12 h-12 mx-auto mb-6 text-brand-gold/20" />
          <p class="text-brand-white/50 font-sans-luxury text-sm tracking-wide mb-8">
            {{ L.t('pf.noOrders') }}
          </p>
          <RouterLink to="/coleccion/todas"
            class="bg-brand-white text-brand-black px-8 py-3 text-[10px] font-bold tracking-wide hover:bg-brand-gold transition-colors duration-300">
            {{ L.t('pf.explore') }}
          </RouterLink>
        </div>

        <!-- Lista de órdenes -->
        <div v-else class="space-y-4">
          <article v-for="order in ordersDesc" :key="order.id"
            class="border border-brand-white/10 bg-brand-black/50 transition-colors duration-300"
            :class="{ 'border-brand-gold/20': isExpanded(order.id) }">

            <!-- Cabecera del pedido -->
            <div class="p-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <!-- Número + fecha -->
                <div>
                  <p class="text-brand-gold text-xs font-bold tracking-[0.2em] mb-1">
                    {{ L.t('pf.orderNum') }} #{{ order.orderNumber }}
                  </p>
                  <p class="text-brand-white/40 text-[10px] tracking-wide font-sans-luxury">
                    {{ new Date(order.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                  </p>
                </div>

                <!-- Total + badge de estado -->
                <div class="flex items-center gap-4">
                  <p class="text-brand-white font-sans-luxury text-base tracking-wide">
                    ${{ order.totalAmount.toLocaleString() }}
                    <span class="text-brand-white/40 text-[10px] ml-1">COP</span>
                  </p>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-wide"
                    :class="getStatus(order.status).classes">
                    <Icon :icon="getStatus(order.status).icon" class="w-3 h-3" />
                    {{ statusLabel(order.status) }}
                  </span>
                </div>
              </div>

              <!-- Timeline de progreso (solo si no está cancelado) -->
              <div v-if="order.status !== 'CANCELADO'" class="mt-6 flex items-center gap-0">
                <template v-for="(step, idx) in TIMELINE_STEPS" :key="step.key">
                  <div class="flex flex-col items-center">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300"
                      :class="getStatus(order.status).step >= idx
                        ? 'bg-brand-gold border-brand-gold text-brand-black'
                        : 'bg-transparent border-brand-white/20 text-brand-white/20'">
                      <Icon :icon="step.icon" class="w-3.5 h-3.5" />
                    </div>
                    <p class="text-[8px] tracking-wide mt-1 text-center max-w-[60px] leading-tight font-sans-luxury"
                      :class="getStatus(order.status).step >= idx ? 'text-brand-gold' : 'text-brand-white/20'">
                      {{ L.t(step.labelKey) }}
                    </p>
                  </div>
                  <div v-if="idx < TIMELINE_STEPS.length - 1"
                    class="flex-1 h-px mb-4 transition-all duration-300"
                    :class="getStatus(order.status).step > idx ? 'bg-brand-gold' : 'bg-brand-white/10'" />
                </template>
              </div>

              <!-- Acciones -->
              <div class="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-brand-white/5">
                <!-- Ver detalles -->
                <button @click="toggleOrder(order.id)"
                  class="flex items-center gap-1.5 text-[10px] tracking-wide font-sans-luxury text-brand-white/50 hover:text-brand-gold transition-colors">
                  <Icon :icon="isExpanded(order.id) ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-3 h-3" />
                  {{ isExpanded(order.id) ? 'Ocultar' : 'Ver' }} piezas
                </button>

                <!-- Consultar por WhatsApp -->
                <button @click="openOrderWhatsApp(order)"
                  class="flex items-center gap-2 px-4 py-2 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 text-[10px] tracking-wide font-sans-luxury transition-all duration-300 group ml-auto">
                  <Icon icon="simple-icons:whatsapp" class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  Consultar estado
                </button>
              </div>
            </div>

            <!-- Detalle de piezas (expandible) -->
            <Transition name="slide-down">
              <div v-if="isExpanded(order.id)"
                class="border-t border-brand-white/5 px-6 pb-6 pt-4 bg-brand-white/[0.02]">
                <div class="space-y-3">
                  <div v-for="item in order.items" :key="item.id"
                    class="flex justify-between items-center text-sm py-2 border-b border-brand-white/5 last:border-0">
                    <div class="flex items-center gap-3">
                      <span class="text-brand-gold font-bold text-xs font-sans-luxury">{{ item.quantity }}×</span>
                      <span class="text-brand-white font-sans-luxury tracking-wide">
                        {{ item.product?.name || 'Artículo no disponible' }}
                        <span v-if="item.selectedSize" class="text-[10px] text-brand-gold/70 ml-1">· Talla: {{ item.selectedSize }}</span>
                      </span>
                    </div>
                    <span class="text-brand-white/60 font-sans-luxury tracking-wide text-xs">
                      ${{ item.priceAtPurchase.toLocaleString() }}
                    </span>
                  </div>
                </div>
                <div class="flex justify-between items-center mt-4 pt-3 border-t border-brand-white/10">
                  <span class="text-brand-white/40 font-sans-luxury text-[10px] tracking-wide">{{ L.t('pf.orderTotal') }}</span>
                  <span class="text-brand-gold font-serif-elegant tracking-wide">
                    ${{ order.totalAmount.toLocaleString() }} COP
                  </span>
                </div>

                <!-- Detalle de pago -->
                <div class="mt-5 pt-4 border-t border-brand-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p class="text-brand-gold/80 text-[9px] tracking-[0.3em] mb-2">{{ L.t('pf.payment') }}</p>
                    <div class="space-y-1.5 text-[11px] font-sans-luxury">
                      <div class="flex justify-between">
                        <span class="text-brand-white/40">{{ L.t('pf.pmStatus') }}</span>
                        <span class="text-brand-white/80">{{ statusLabel(order.status) }}</span>
                      </div>
                      <div v-if="order.paymentId && order.paymentId !== 'MANUAL_ADMIN'" class="flex justify-between gap-3">
                        <span class="text-brand-white/40">{{ L.t('pf.reference') }}</span>
                        <span class="text-brand-white/80 truncate" :title="order.paymentId">{{ order.paymentId }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-brand-white/40">{{ L.t('pf.method') }}</span>
                        <span class="text-brand-white/80">{{ L.t('pf.methodValue') }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Detalle de envío (si ya fue despachado) -->
                  <div v-if="order.trackingNumber">
                    <p class="text-brand-gold/80 text-[9px] tracking-[0.3em] mb-2">{{ L.t('pf.shipping') }}</p>
                    <div class="space-y-1.5 text-[11px] font-sans-luxury">
                      <div class="flex justify-between gap-3">
                        <span class="text-brand-white/40">{{ L.t('tk.carrier') }}</span>
                        <span class="text-brand-white/80">{{ order.shippingCarrier || '—' }}</span>
                      </div>
                      <div class="flex justify-between gap-3">
                        <span class="text-brand-white/40">{{ L.t('pf.guide') }}</span>
                        <span class="text-brand-white/80 truncate" :title="order.trackingNumber">{{ order.trackingNumber }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

          </article>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 600px;
  opacity: 1;
}
</style>
