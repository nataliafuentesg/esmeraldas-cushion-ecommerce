<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useAnalytics } from '@/composables/useAnalytics';
import api from '@/api/axios';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const { trackPurchase } = useAnalytics();

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

// Tarifa dinámica según el país
const shippingFee = computed(() => {
  return form.value.country === 'Colombia' ? 25000 : 150000;
});

const total = computed(() => subtotal.value + shippingFee.value);

const isSubmitting = ref(false);
const errorMsg = ref('');

onMounted(() => {
  if (authStore.isAuthenticated) {
    form.value.customerName = `${authStore.user.firstName} ${authStore.user.lastName}`.trim();
    form.value.customerEmail = authStore.user.email;
    form.value.phoneNumber = authStore.user.phone || '';
  }
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
    // Verificar que exista una sesión de carrito válida antes de continuar
    if (!cartStore.sessionId) {
      errorMsg.value = "No se encontró tu sesión de carrito. Por favor recarga la página e intenta de nuevo.";
      isSubmitting.value = false;
      return;
    }

    // Unimos el país a la dirección para que el backend calcule el flete correctamente
    const fullAddress = `[${form.value.country.toUpperCase()}] - ${form.value.shippingAddress}`;

    const orderData = {
      customerName: form.value.customerName,
      customerEmail: form.value.customerEmail,
      phoneNumber: form.value.phoneNumber,
      shippingAddress: fullAddress,
      notes: form.value.notes,
      clientId: authStore.isAuthenticated ? authStore.user.id : null
    };

    // Guardamos los items ANTES de limpiar el carrito (para el evento de compra)
    const purchasedItems = cartStore.items.map(i => ({
      id: i.productId,
      name: i.productName,
      price: i.price,
      quantity: i.quantity,
    }));

    // 1. Guardar la orden en el backend usando la sesión existente
    const response = await api.post(`/orders/create?sessionId=${cartStore.sessionId}`, orderData);
    const orderNumber = response.data.orderNumber;
    const totalReal = response.data.totalAmount;

    // Meta Pixel — Purchase con dedup (mismo event_id = orderNumber que el backend/CAPI)
    trackPurchase({ orderNumber, total: totalReal, items: purchasedItems });

    // 2. Limpiar el carrito completamente (items + total)
    cartStore.items = [];
    cartStore.total = 0;

    // 3. Lógica de Contacto (WhatsApp vs Email)
    if (form.value.country === 'Colombia') {
      const waMessage = `¡Hola Cushion! Acabo de registrar el pedido #${orderNumber}.\n\n👤 Nombre: ${form.value.customerName}\n💎 Total: $${totalReal.toLocaleString()} COP\n\nQuiero coordinar el pago y envío.`;
      const numeroWhatsApp = '573000000000'; // PON TU NÚMERO AQUÍ
      const waUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');
    } else {
      const emailSubject = `Nuevo pedido internacional Cushion: #${orderNumber}`;
      const emailBody = `¡Hola Cushion!\n\nAcabo de realizar el pedido #${orderNumber} desde ${form.value.country}.\n\n👤 Nombre: ${form.value.customerName}\n💎 Total estimado: $${totalReal.toLocaleString()} COP\n\nPor favor, indíquenme las instrucciones para el pago internacional (PayPal, Zelle, Swift) y confirmación del envío.\n\nGracias.`;
      const correoEmpresa = 'ventas@cushion.com'; // PON TU CORREO AQUÍ
      const mailtoUrl = `mailto:${correoEmpresa}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoUrl, '_blank');
    }

    alert(`¡Pedido #${orderNumber} creado con éxito!`);

    if (authStore.isAuthenticated) {
      router.push('/perfil');
    } else {
      router.push('/');
    }

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
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-20 pb-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      <h1 class="text-4xl md:text-5xl font-serif-elegant text-brand-white mb-12 tracking-wide text-center border-b border-brand-white/10 pb-6">
        Finalizar Compra
      </h1>

      <div class="flex flex-col lg:flex-row gap-12">
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
              {{ isSubmitting ? 'Procesando...' : 'Confirmar Pedido' }}
            </button>
            
            <p v-if="form.country !== 'Colombia'" class="text-center text-brand-white/40 text-[10px] font-sans-luxury tracking-wide mt-4">
              Los pagos internacionales se coordinan por correo posterior a la compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>