<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const orders = ref([]);
const loading = ref(true);

// Filtros por estado
const statusFilter = ref('TODOS');
const filterTabs = [
  { key: 'TODOS',          label: 'Todos' },
  { key: 'PENDIENTE_PAGO', label: 'Pendientes' },
  { key: 'PAGADO',         label: 'Pagados' },
  { key: 'ENVIADO',        label: 'Enviados' },
  { key: 'ENTREGADO',      label: 'Entregados' },
];

const countByStatus = (key) =>
  key === 'TODOS' ? orders.value.length : orders.value.filter(o => o.status === key).length;

const filteredOrders = computed(() =>
  statusFilter.value === 'TODOS'
    ? orders.value
    : orders.value.filter(o => o.status === statusFilter.value)
);

// Estilo del badge según el estado
const statusStyle = (status) => {
  switch (status) {
    case 'PAGADO':         return 'bg-green-500/15 text-green-400 border-green-500/30';
    case 'ENVIADO':        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'ENTREGADO':      return 'bg-brand-gold/15 text-brand-gold border-brand-gold/40';
    case 'PENDIENTE_PAGO': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'EXPIRADO':       return 'bg-brand-white/10 text-brand-white/40 border-brand-white/20';
    case 'PAGO_SIN_STOCK': return 'bg-orange-500/15 text-orange-400 border-orange-500/40';
    case 'PAGO_RECHAZADO':
    case 'CANCELADO':      return 'bg-red-500/15 text-red-400 border-red-500/30';
    default:               return 'bg-brand-white/10 text-brand-white/50 border-brand-white/20';
  }
};

const statusLabel = (status) => (status || '').replace(/_/g, ' ');

// Control del Modal de Detalles
const selectedOrder = ref(null);
const showModal = ref(false);

// Envío
const shipForm = ref({ trackingNumber: '', carrier: '' });
const actionLoading = ref(false);

onMounted(async () => {
  await loadOrders();
});

const loadOrders = async () => {
  loading.value = true;
  try {
    const res = await api.get('/admin/orders');
    orders.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error cargando pedidos:", error);
  } finally {
    loading.value = false;
  }
};

// Descargar todas las ventas en Excel (CSV con el ID de transacción de Bold)
const exporting = ref(false);
const exportOrders = async () => {
  exporting.value = true;
  try {
    const res = await api.get('/admin/orders/export', { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `cushion-ventas-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('Error al exportar las ventas.');
  } finally {
    exporting.value = false;
  }
};

// Función para abrir los detalles
const openOrderDetails = (order) => {
  selectedOrder.value = order;
  shipForm.value = {
    trackingNumber: order.trackingNumber || '',
    carrier: order.shippingCarrier || '',
  };
  showModal.value = true;
};

// Confirmar pago manualmente (para órdenes internacionales o pruebas donde el
// webhook de Bold no llegó). Hace lo mismo que el webhook: PAGADO + inventario + correo.
const confirmPaymentManually = async () => {
  if (!confirm('¿Confirmar el pago de este pedido manualmente? Se descontará inventario y se enviará el correo de pago.')) return;
  actionLoading.value = true;
  try {
    await api.post(`/admin/orders/${selectedOrder.value.orderNumber}/confirm-payment`);
    selectedOrder.value.status = 'PAGADO';
    await loadOrders();
    alert('Pago confirmado. Inventario descontado y correo enviado.');
  } catch (e) {
    alert(e.response?.data?.message || 'Error al confirmar el pago.');
  } finally {
    actionLoading.value = false;
  }
};

// Marcar como ENVIADO (guarda guía + transportadora y dispara el correo de envío)
const markShipped = async () => {
  if (!shipForm.value.trackingNumber.trim() || !shipForm.value.carrier.trim()) {
    alert('Ingresa el número de guía y la transportadora.');
    return;
  }
  actionLoading.value = true;
  try {
    const res = await api.post(
      `/admin/orders/${selectedOrder.value.id}/ship` +
      `?trackingNumber=${encodeURIComponent(shipForm.value.trackingNumber.trim())}` +
      `&carrier=${encodeURIComponent(shipForm.value.carrier.trim())}`
    );
    Object.assign(selectedOrder.value, res.data);
    await loadOrders();
    alert('Pedido marcado como ENVIADO. Se envió el correo al cliente.');
  } catch (e) {
    alert('Error al marcar como enviado.');
  } finally {
    actionLoading.value = false;
  }
};

// Marcar como ENTREGADO (dispara el correo de agradecimiento)
const markDelivered = async () => {
  if (!confirm('¿Confirmar que el pedido fue entregado? Se enviará el correo final al cliente.')) return;
  actionLoading.value = true;
  try {
    const res = await api.post(`/admin/orders/${selectedOrder.value.id}/deliver`);
    Object.assign(selectedOrder.value, res.data);
    await loadOrders();
    alert('Pedido marcado como ENTREGADO.');
  } catch (e) {
    alert('Error al marcar como entregado.');
  } finally {
    actionLoading.value = false;
  }
};
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8 border-b border-brand-white/10 pb-4">
      <h3 class="text-2xl font-serif-elegant text-brand-white tracking-wide">Gestión de Pedidos</h3>
      <button @click="exportOrders" :disabled="exporting"
        class="shrink-0 flex items-center gap-2 border border-brand-gold/40 text-brand-gold px-4 py-2 text-[10px] font-bold tracking-[0.2em] hover:bg-brand-gold hover:text-brand-black transition-colors disabled:opacity-50">
        <Icon icon="lucide:download" class="w-3.5 h-3.5" />
        {{ exporting ? 'GENERANDO…' : 'DESCARGAR VENTAS (EXCEL)' }}
      </button>
    </div>
    
    <!-- Filtros por estado -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button v-for="tab in filterTabs" :key="tab.key"
        @click="statusFilter = tab.key"
        class="px-4 py-2 text-[10px] font-bold tracking-[0.15em] border transition-colors flex items-center gap-2"
        :class="statusFilter === tab.key
          ? 'bg-brand-gold text-brand-black border-brand-gold'
          : 'text-brand-white/60 border-brand-white/15 hover:border-brand-gold/40 hover:text-brand-white'">
        {{ tab.label }}
        <span class="px-1.5 py-0.5 rounded-full text-[9px]"
          :class="statusFilter === tab.key ? 'bg-brand-black/20' : 'bg-brand-white/10'">
          {{ countByStatus(tab.key) }}
        </span>
      </button>
    </div>

    <div v-if="loading" class="text-brand-gold tracking-wide text-xs animate-pulse">Cargando...</div>

    <div v-else-if="filteredOrders.length === 0" class="text-center py-16 text-brand-white/40 text-xs tracking-wide border border-brand-white/10 bg-brand-white/[0.02]">
      No hay pedidos en esta categoría.
    </div>

    <div v-else class="overflow-x-auto bg-brand-white/5 border border-brand-white/10 p-1">
      <table class="w-full text-left min-w-[900px]">
        <thead class="bg-brand-black/50">
          <tr class="text-brand-gold text-[10px] tracking-wide">
            <th class="p-4">Pedido</th>
            <th class="p-4">Cliente</th>
            <th class="p-4">Total</th>
            <th class="p-4">Estado</th>
            <th class="p-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="text-sm font-sans-luxury text-brand-white/80">
          <tr v-for="order in filteredOrders" :key="order.id" class="border-t border-brand-white/10 hover:bg-brand-black/50 transition-colors">
            <td class="p-4 font-bold text-brand-white">#{{ order.orderNumber }}</td>
            <td class="p-4">
              <p class="text-brand-white">{{ order.customerName }}</p>
              <p class="text-[10px] text-brand-white/50">{{ order.customerEmail }}</p>
            </td>
            <td class="p-4 text-brand-gold font-bold">${{ order.totalAmount.toLocaleString() }}</td>
            <td class="p-4">
              <span class="inline-block px-3 py-1 text-[9px] font-bold tracking-wide border rounded-sm" :class="statusStyle(order.status)">
                {{ statusLabel(order.status) }}
              </span>
            </td>
            <td class="p-4 text-center">
              <button @click="openOrderDetails(order)" class="text-brand-gold text-[10px] tracking-wide underline underline-offset-4 hover:text-brand-white transition-colors">
                Gestionar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal && selectedOrder" class="fixed inset-0 bg-brand-black/95 z-50 flex items-center justify-center p-4">
      <div class="bg-brand-black border border-brand-gold p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        
        <button @click="showModal = false" class="absolute top-4 right-4 text-brand-white/50 hover:text-brand-white">
          <Icon icon="lucide:x" class="w-6 h-6" />
        </button>

        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-2xl font-serif-elegant text-brand-gold tracking-wider">
            Pedido #{{ selectedOrder.orderNumber }}
          </h3>
          <span class="inline-block px-3 py-1 text-[9px] font-bold tracking-wide border rounded-sm" :class="statusStyle(selectedOrder.status)">
            {{ statusLabel(selectedOrder.status) }}
          </span>
        </div>
        <p class="text-[10px] text-brand-white/50 tracking-wide mb-8 border-b border-brand-white/10 pb-4">
          Fecha: {{ new Date(selectedOrder.createdAt).toLocaleString() }}
        </p>
        
        <div class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-white/5 p-4 border border-brand-white/10">
            <div>
              <h4 class="text-brand-gold text-[10px] tracking-wide mb-2">Datos del Cliente</h4>
              <p class="text-brand-white text-sm font-sans-luxury">{{ selectedOrder.customerName }}</p>
              <p class="text-brand-white/70 text-sm font-sans-luxury">{{ selectedOrder.customerEmail }}</p>
              <p class="text-brand-white/70 text-sm font-sans-luxury">Tel: {{ selectedOrder.phoneNumber }}</p>
            </div>
            
            <div>
              <h4 class="text-brand-gold text-[10px] tracking-wide mb-2">Dirección de Envío</h4>
              <p class="text-brand-white text-sm font-sans-luxury leading-relaxed">{{ selectedOrder.shippingAddress }}</p>
            </div>
          </div>

          <div v-if="selectedOrder.notes" class="bg-brand-gold/10 p-4 border border-brand-gold/30">
            <h4 class="text-brand-gold text-[10px] tracking-wide mb-2">Notas del Cliente</h4>
            <p class="text-brand-white text-sm font-sans-luxury italic">"{{ selectedOrder.notes }}"</p>
          </div>

          <div>
            <h4 class="text-brand-white tracking-wide text-xs border-b border-brand-white/10 pb-2 mb-4">Artículos en este pedido</h4>
            
            <div v-if="selectedOrder.items && selectedOrder.items.length > 0" class="space-y-3">
              <div v-for="item in selectedOrder.items" :key="item.id" class="flex justify-between items-center text-sm border-b border-brand-white/5 pb-2">
                <p class="text-brand-white/80 font-sans-luxury tracking-wide flex-1">
                  <span class="text-brand-gold font-bold mr-2">{{ item.quantity }}x</span> 
                  {{ item.product?.name || 'Joya Eliminada del Catálogo' }}
                </p>
                <p class="text-brand-white/80 font-sans-luxury tracking-wide">
                  ${{ item.priceAtPurchase.toLocaleString() }}
                </p>
              </div>
            </div>
            <div v-else class="text-brand-white/50 text-xs tracking-wide italic">
              Detalle de artículos no disponible.
            </div>
            
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-brand-white/20">
              <span class="text-brand-gold font-serif-elegant tracking-wider text-lg">Total Pagado</span>
              <span class="text-brand-gold font-serif-elegant tracking-wider text-xl">${{ selectedOrder.totalAmount.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Confirmar pago manual (solo si está pendiente de pago) -->
          <div v-if="selectedOrder.status === 'PENDIENTE_PAGO'" class="bg-brand-gold/[0.06] border border-brand-gold/30 p-5">
            <h4 class="text-brand-gold text-[10px] tracking-[0.3em] mb-3 flex items-center gap-2">
              <Icon icon="lucide:credit-card" class="w-4 h-4" /> PAGO PENDIENTE
            </h4>
            <p class="text-brand-white/50 text-[11px] mb-4">
              Usa esto para pagos internacionales coordinados por correo, o si el webhook de Bold no llegó.
            </p>
            <button @click="confirmPaymentManually" :disabled="actionLoading"
              class="w-full bg-brand-gold text-brand-black px-4 py-3 text-[10px] font-bold tracking-[0.2em] hover:bg-brand-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Icon icon="lucide:check-circle" class="w-3.5 h-3.5" /> CONFIRMAR PAGO MANUALMENTE
            </button>
          </div>

          <!-- Gestión de envío -->
          <div class="bg-brand-white/5 border border-brand-white/10 p-5">
            <h4 class="text-brand-gold text-[10px] tracking-[0.3em] mb-4 flex items-center gap-2">
              <Icon icon="lucide:truck" class="w-4 h-4" /> GESTIÓN DE ENVÍO
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="text-[9px] text-brand-white/40 tracking-wide block mb-1">Transportadora</label>
                <input v-model="shipForm.carrier" type="text" placeholder="Ej: Servientrega, Coordinadora"
                  class="w-full bg-transparent border-b border-brand-white/20 py-2 text-brand-white text-sm focus:outline-none focus:border-brand-gold placeholder:text-brand-white/25">
              </div>
              <div>
                <label class="text-[9px] text-brand-white/40 tracking-wide block mb-1">Número de guía</label>
                <input v-model="shipForm.trackingNumber" type="text" placeholder="Ej: 999000111222"
                  class="w-full bg-transparent border-b border-brand-white/20 py-2 text-brand-white text-sm focus:outline-none focus:border-brand-gold placeholder:text-brand-white/25">
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button @click="markShipped" :disabled="actionLoading"
                class="flex-1 bg-brand-gold text-brand-black px-4 py-3 text-[10px] font-bold tracking-[0.2em] hover:bg-brand-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <Icon icon="lucide:send" class="w-3.5 h-3.5" />
                {{ selectedOrder.status === 'ENVIADO' ? 'ACTUALIZAR GUÍA' : 'MARCAR ENVIADO' }}
              </button>
              <button @click="markDelivered" :disabled="actionLoading || selectedOrder.status === 'ENTREGADO'"
                class="flex-1 border border-brand-gold/40 text-brand-gold px-4 py-3 text-[10px] font-bold tracking-[0.2em] hover:bg-brand-gold/10 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                <Icon icon="lucide:package-check" class="w-3.5 h-3.5" />
                {{ selectedOrder.status === 'ENTREGADO' ? 'YA ENTREGADO' : 'MARCAR ENTREGADO' }}
              </button>
            </div>
            <p class="text-[9px] text-brand-white/30 tracking-wide mt-3">
              Al marcar enviado/entregado se envía automáticamente el correo correspondiente al cliente.
            </p>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>