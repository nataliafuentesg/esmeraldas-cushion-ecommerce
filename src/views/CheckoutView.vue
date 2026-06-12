<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const subtotal = computed(() => {
  return cartStore.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const form = ref({
  customerName: '',
  customerEmail: '',
  phoneNumber: '',
  country: 'Colombia', // País por defecto
  shippingAddress: '',
  notes: ''
});

// Tarifas de envío — se leen del backend (fuente única de verdad). Los valores
// por defecto son solo un respaldo mientras carga la config.
const shippingRates = ref({ nacional: 25000, internacional: 150000 });

const shippingFee = computed(() => {
  return form.value.country === 'Colombia'
    ? shippingRates.value.nacional
    : shippingRates.value.internacional;
});

const total = computed(() => subtotal.value + shippingFee.value);

const isSubmitting = ref(false);
const errorMsg = ref('');

// Estado del pago con Bold (Colombia)
const boldData = ref(null);          // datos del botón devueltos por el backend
const boldContainer = ref(null);     // contenedor donde se inyecta el botón

onMounted(async () => {
  if (authStore.isAuthenticated) {
    form.value.customerName = `${authStore.user.firstName} ${authStore.user.lastName}`.trim();
    form.value.customerEmail = authStore.user.email;
    form.value.phoneNumber = authStore.user.phone || '';
  }
  // Cargar las tarifas de envío del backend (mismo valor que se cobrará)
  try {
    const res = await api.get('/config/shipping');
    if (res.data?.nacional != null) shippingRates.value.nacional = res.data.nacional;
    if (res.data?.internacional != null) shippingRates.value.internacional = res.data.internacional;
  } catch { /* usa los valores por defecto si falla */ }
});

const submitOrder = async () => {
  if (cartStore.items.length === 0) {
    alert("Tu carrito está vacío.");
    router.push('/coleccion/todas');
    return;
  }

  isSubmitting.value = true;
  errorMsg.value = '';

  try {
    if (!cartStore.sessionId) {
      errorMsg.value = "No se encontró tu sesión de carrito. Por favor recarga la página e intenta de nuevo.";
      isSubmitting.value = false;
      return;
    }

    const fullAddress = `[${form.value.country.toUpperCase()}] - ${form.value.shippingAddress}`;
    const orderData = {
      customerName: form.value.customerName,
      customerEmail: form.value.customerEmail,
      phoneNumber: form.value.phoneNumber,
      shippingAddress: fullAddress,
      notes: form.value.notes,
      clientId: authStore.isAuthenticated ? authStore.user.id : null
    };

    // Crear la orden en el backend (queda PENDIENTE_PAGO — aún NO descuenta inventario)
    const response = await api.post(`/orders/create?sessionId=${cartStore.sessionId}`, orderData);
    const data = response.data;

    // Pago en línea con Bold — para Colombia E internacional (Bold acepta
    // tarjetas internacionales; el cobro es en COP, incluyendo el flete del país).
    sessionStorage.setItem('cushion_pending_order', JSON.stringify({
      orderNumber: data.orderNumber,
      total: data.totalAmount,
      items: cartStore.items.map(i => ({
        id: i.productId, name: i.productName, price: i.price, quantity: i.quantity,
      })),
    }));
    boldData.value = data;
    await nextTick();
    renderBoldButton();

  } catch (error) {
    console.error("Error al crear la orden:", error);
    const serverMsg = error.response?.data?.message || error.response?.data || null;
    errorMsg.value = serverMsg
      ? `Error: ${serverMsg}`
      : "Hubo un problema procesando tu orden. Verifica tu conexión e intenta de nuevo.";
  } finally {
    isSubmitting.value = false;
  }
};

// Patrón oficial de Bold para SPAs (React/Vue):
//   1. El botón (script con SOLO los data-attributes, sin src) se coloca en el
//      DOM dentro de un <form>.
//   2. LUEGO se inyecta la librería en el <head>; al cargar, escanea el DOM y
//      renderiza el botón. Si se revisita el checkout, recargamos la librería
//      para forzar que vuelva a procesar el botón nuevo.
const renderBoldButton = () => {
  if (!boldContainer.value || !boldData.value) return;
  boldContainer.value.innerHTML = '';

  const d = boldData.value;
  const btn = document.createElement('script');
  btn.setAttribute('data-bold-button', 'dark-L');
  btn.setAttribute('data-order-id', d.orderNumber);
  btn.setAttribute('data-currency', d.boldCurrency);
  btn.setAttribute('data-amount', String(d.boldAmount));
  btn.setAttribute('data-api-key', d.boldApiKey);
  btn.setAttribute('data-integrity-signature', d.boldIntegritySignature);
  btn.setAttribute('data-description', `Pedido Cushion ${d.orderNumber}`);
  btn.setAttribute('data-redirection-url',
    `https://cushionjewelry.com/pago-resultado?order=${d.orderNumber}`);
  btn.setAttribute('data-customer-data', JSON.stringify({
    email: form.value.customerEmail,
    fullName: form.value.customerName,
    phone: form.value.phoneNumber,
  }));
  boldContainer.value.appendChild(btn);

  // Inyectar (o reinyectar) la librería en el <head> para que procese el botón
  const prev = document.getElementById('bold-checkout-lib');
  if (prev) prev.remove();
  const lib = document.createElement('script');
  lib.id = 'bold-checkout-lib';
  lib.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
  document.head.appendChild(lib);
};
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-20 pb-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      <h1 class="text-4xl md:text-5xl font-serif-elegant text-brand-white mb-12 tracking-wide text-center border-b border-brand-white/10 pb-6">
        Finalizar Compra
      </h1>

      <!-- ESTADO 1: Formulario de envío -->
      <div v-if="!boldData" class="flex flex-col lg:flex-row gap-12">
        <div class="flex-1">
          <h2 class="text-2xl font-serif-elegant text-brand-white mb-8 tracking-wide">Detalles de envío</h2>
          
          <p v-if="errorMsg" class="text-red-400 text-xs font-sans-luxury tracking-wider mb-6 bg-red-900/20 p-4 border border-red-900/50">
            {{ errorMsg }}
          </p>

          <form id="checkout-form" @submit.prevent="submitOrder" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input v-model="form.customerName" type="text" placeholder="Nombre completo" required class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 tracking-wide">
              <input v-model="form.phoneNumber" type="tel" placeholder="Teléfono / WhatsApp" required class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 tracking-wide">
            </div>

            <input v-model="form.customerEmail" type="email" placeholder="Correo electrónico" required class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 tracking-wide">

            <div class="border-b border-brand-white/20 py-2">
              <label class="text-[10px] text-brand-white/50 tracking-wide block mb-1">Destino del envío</label>
              <select v-model="form.country" class="w-full bg-transparent text-brand-white text-sm font-sans-luxury focus:outline-none focus:text-brand-gold transition-colors cursor-pointer tracking-wide">
                <option value="Colombia" class="bg-brand-black">Colombia (Envío Nacional)</option>
                <option value="Estados Unidos" class="bg-brand-black">Estados Unidos (USA)</option>
                <option value="Canadá" class="bg-brand-black">Canadá</option>
                <option value="Europa" class="bg-brand-black">Europa (UE)</option>
                <option value="Otro País" class="bg-brand-black">Otro País Internacional</option>
              </select>
            </div>

            <input v-model="form.shippingAddress" type="text" placeholder="Dirección completa (Estado, Ciudad, Código Postal)" required class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 tracking-wide">

            <textarea v-model="form.notes" rows="3" placeholder="Notas adicionales (Opcional)" class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 tracking-wide resize-none"></textarea>
          </form>
        </div>

        <div class="w-full lg:w-1/3">
          <div class="border border-brand-white/10 bg-brand-black/50 p-8 sticky top-24">
            <h3 class="text-xl font-serif-elegant text-brand-gold mb-6 tracking-wide border-b border-brand-gold/20 pb-4">Resumen</h3>
            
            <div class="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              <div v-for="item in cartStore.items" :key="item.productId" class="flex justify-between text-sm">
                <span class="text-brand-white/80 font-sans-luxury tracking-wide flex-1 pr-4">{{ item.quantity }}x {{ item.productName || 'Joya Cushion' }}</span>
                <span class="text-brand-white font-sans-luxury tracking-wide">${{ (item.price * item.quantity).toLocaleString() }}</span>
              </div>
            </div>

            <div class="border-t border-brand-white/10 pt-4 space-y-3 mb-8">
              <div class="flex justify-between text-sm">
                <span class="text-brand-white/60 font-sans-luxury tracking-wide">Subtotal</span>
                <span class="text-brand-white font-sans-luxury tracking-wide">${{ subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-white/60 font-sans-luxury tracking-wide">{{ form.country === 'Colombia' ? 'Envío Nacional' : 'Envío Internacional' }}</span>
                <span class="text-brand-white font-sans-luxury tracking-wide">${{ shippingFee.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-lg border-t border-brand-white/10 pt-4 mt-4">
                <span class="text-brand-gold font-serif-elegant tracking-wide">Total</span>
                <span class="text-brand-gold font-serif-elegant tracking-wide">${{ total.toLocaleString() }}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" :disabled="isSubmitting || cartStore.items.length === 0" class="w-full bg-brand-white text-brand-black px-6 py-4 text-xs font-bold tracking-wide hover:bg-brand-gold transition-colors duration-300 disabled:opacity-50">
              {{ isSubmitting ? 'Procesando...' : 'Continuar al pago' }}
            </button>

            <p v-if="form.country !== 'Colombia'" class="text-center text-brand-white/40 text-[10px] font-sans-luxury tracking-wide mt-4">
              Aceptamos tarjetas internacionales. El cobro se realiza en pesos colombianos (COP).
            </p>
          </div>
        </div>
      </div>

      <!-- ESTADO 2: Pago en línea con Bold (nacional e internacional) -->
      <div v-else-if="boldData" class="max-w-lg mx-auto">
        <div class="border border-brand-gold/30 bg-brand-black/50 p-8 md:p-10 text-center">
          <Icon icon="lucide:shield-check" class="w-12 h-12 text-brand-gold mx-auto mb-4" />
          <h2 class="text-2xl font-serif-elegant text-brand-white mb-2 tracking-wide">Tu pedido está reservado</h2>
          <p class="text-brand-white/50 text-xs font-sans-luxury tracking-wide mb-1">
            Pedido <span class="text-brand-gold">#{{ boldData.orderNumber }}</span>
          </p>
          <p class="text-brand-white/60 text-sm font-sans-luxury mb-8">
            Completa el pago de forma segura para confirmar tu compra.
          </p>

          <div class="border-t border-b border-brand-white/10 py-5 mb-8">
            <div class="flex justify-between items-center">
              <span class="text-brand-gold font-serif-elegant text-lg tracking-wide">Total a pagar</span>
              <span class="text-brand-gold font-serif-elegant text-2xl tracking-wide">${{ boldData.totalAmount.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Bold renderiza el botón dentro de este form -->
          <form ref="boldContainer" class="bold-button-wrapper flex justify-center"></form>

          <p class="text-brand-white/30 text-[10px] font-sans-luxury tracking-wide mt-6 flex items-center justify-center gap-1.5">
            <Icon icon="lucide:lock" class="w-3 h-3" />
            Pago protegido por Bold · Tarjeta, PSE y más
          </p>
        </div>
      </div>

    </div>
  </div>
</template>