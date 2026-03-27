<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

// Calculamos el subtotal usando los items en el frontend
const subtotal = computed(() => {
  return cartStore.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const shippingFee = 25000;
const total = computed(() => subtotal.value + shippingFee);

const form = ref({
  customerName: '',
  customerEmail: '',
  phoneNumber: '',
  shippingAddress: '',
  notes: ''
});

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
    const orderData = {
      customerName: form.value.customerName,
      customerEmail: form.value.customerEmail,
      phoneNumber: form.value.phoneNumber,
      shippingAddress: form.value.shippingAddress,
      notes: form.value.notes,
      clientId: authStore.isAuthenticated ? authStore.user.id : null 
    };

    const currentSessionId = cartStore.sessionId || 'session-' + Math.random().toString(36).substr(2, 9);
    
    // 1. Guardar la orden en tu base de datos
    const response = await api.post(`/orders/create?sessionId=${currentSessionId}`, orderData);

    // 2. Extraer los datos reales de la respuesta del backend
    const orderNumber = response.data.orderNumber;
    const totalReal = response.data.totalAmount;
    
    // 3. Armar y enviar el mensaje de WhatsApp (Usa el totalReal del backend)
    const waMessage = `¡Hola Cushion! Acabo de registrar el pedido #${orderNumber}.\n\n👤 Nombre: ${form.value.customerName}\n💎 Total: $${totalReal.toLocaleString()}\n\nQuiero coordinar el pago y envío.`;
    
    // IMPORTANTE: Cambia este número por el WhatsApp de tu tienda
    const numeroWhatsApp = '573000000000'; 
    const waUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank'); 

    // 4. Limpiar el carrito visual
    cartStore.items = [];
    
    alert(`¡Pedido # ${orderNumber} creado con éxito!`);
    
    // 5. Redirigir al usuario
    if (authStore.isAuthenticated) {
      router.push('/perfil'); 
    } else {
      router.push('/'); 
    }

  } catch (error) {
    console.error("Error al crear la orden:", error);
    errorMsg.value = "Hubo un problema procesando tu orden. Verifica tu conexión e intenta de nuevo.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="bg-brand-black min-h-screen pt-20 pb-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      
      <h1 class="text-4xl md:text-5xl font-serif-elegant text-brand-white mb-12 tracking-widest uppercase text-center border-b border-brand-white/10 pb-6">
        Finalizar Compra
      </h1>

      <div class="flex flex-col lg:flex-row gap-12">
        
        <div class="flex-1">
          <h2 class="text-2xl font-serif-elegant text-brand-white mb-8 tracking-wider uppercase">
            Detalles de Envío
          </h2>

          <p v-if="errorMsg" class="text-red-400 text-xs font-sans-luxury uppercase tracking-wider mb-6 bg-red-900/20 p-4 border border-red-900/50">
            {{ errorMsg }}
          </p>

          <form id="checkout-form" @submit.prevent="submitOrder" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input v-model="form.customerName" type="text" placeholder="Nombre Completo" required
                     class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 uppercase tracking-wider">
              
              <input v-model="form.phoneNumber" type="tel" placeholder="Teléfono Móvil" required
                     class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 uppercase tracking-wider">
            </div>

            <input v-model="form.customerEmail" type="email" placeholder="Correo Electrónico" required
                   class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 uppercase tracking-wider">

            <input v-model="form.shippingAddress" type="text" placeholder="Dirección de Envío Completa (Ej: Calle 123 # 45 - 67, Apto 8, Bogotá)" required
                   class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 uppercase tracking-wider">

            <textarea v-model="form.notes" rows="3" placeholder="Notas adicionales para el envío (Opcional)"
                      class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3 text-brand-white text-sm font-sans-luxury focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-white/30 uppercase tracking-wider resize-none"></textarea>
          </form>
        </div>

        <div class="w-full lg:w-1/3">
          <div class="border border-brand-white/10 bg-brand-black/50 p-8 sticky top-24">
            <h3 class="text-xl font-serif-elegant text-brand-gold mb-6 tracking-wider uppercase border-b border-brand-gold/20 pb-4">
              Resumen
            </h3>

            <div class="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              <div v-for="item in cartStore.items" :key="item.productId" class="flex justify-between text-sm">
                <span class="text-brand-white/80 font-sans-luxury uppercase tracking-widest flex-1 pr-4">
                  {{ item.quantity }}x {{ item.productName || 'Joya Cushion' }}
                </span>
                <span class="text-brand-white font-sans-luxury tracking-widest">
                  ${{ (item.price * item.quantity).toLocaleString() }}
                </span>
              </div>
            </div>

            <div class="border-t border-brand-white/10 pt-4 space-y-3 mb-8">
              <div class="flex justify-between text-sm">
                <span class="text-brand-white/60 font-sans-luxury uppercase tracking-widest">Subtotal</span>
                <span class="text-brand-white font-sans-luxury tracking-widest">${{ subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-brand-white/60 font-sans-luxury uppercase tracking-widest">Envío Asegurado</span>
                <span class="text-brand-white font-sans-luxury tracking-widest">${{ shippingFee.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-lg border-t border-brand-white/10 pt-4 mt-4">
                <span class="text-brand-gold font-serif-elegant uppercase tracking-wider">Total</span>
                <span class="text-brand-gold font-serif-elegant tracking-wider">${{ total.toLocaleString() }}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" :disabled="isSubmitting || cartStore.items.length === 0"
                    class="w-full bg-brand-white text-brand-black px-6 py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-brand-gold transition-colors duration-300 disabled:opacity-50">
              {{ isSubmitting ? 'Procesando...' : 'Confirmar Pedido' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}
::-webkit-scrollbar-thumb:hover {
  background: #B89B6A; 
}
</style>