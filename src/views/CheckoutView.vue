<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import { Icon } from '@iconify/vue';

const cartStore = useCartStore();
const router = useRouter();
const isSubmitting = ref(false);

// --- ESTADO PARA NOTIFICACIONES (TOASTS) ---
const toast = ref({
    show: false,
    type: 'success', 
    message: ''
});

const dto = ref({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    phoneNumber: '',
    notes: ''
});

const shippingFeeBase = 25000; // Precio base de envío
const totalWithShipping = computed(() => cartStore.total + shippingFeeBase);

const showNotification = (type, message) => {
    toast.value = { show: true, type, message };
    setTimeout(() => toast.value.show = false, 4000);
};

onMounted(async () => {
    if (!cartStore.sessionId) await cartStore.initSession();
    await cartStore.loadCart();
    
    // Si el carrito está vacío, no permitimos estar en checkout
    if (cartStore.items.length === 0) {
        router.push('/joyas');
    }
});

const processOrder = async () => {
    if (!dto.value.customerName || !dto.value.customerEmail || !dto.value.shippingAddress || !dto.value.phoneNumber) {
        showNotification('error', 'Por favor complete todos los campos obligatorios.');
        return;
    }

    isSubmitting.value = true;
    
    try {
        // 1. Persistir la orden en el Backend
        const res = await api.post(`/orders/create?sessionId=${cartStore.sessionId}`, dto.value);
        const order = res.data;

        showNotification('success', '¡Orden registrada! Conectando con un asesor...');

        // 2. Configuración de WhatsApp
        const salesPhone = "573124965755";
        
        // Mensaje personalizado indicando que el envío es base/negociable
        const text = `✨ *SOLICITUD DE ORDEN: ${order.orderNumber}* ✨\n\n` +
                     `*Cliente:* ${dto.value.customerName}\n` +
                     `*Email:* ${dto.value.customerEmail}\n\n` +
                     `*JOYAS:* \n` +
                     cartStore.items.map(i => `💍 ${i.productName} (x${i.quantity})`).join('\n') +
                     `\n\n*Subtotal:* $${cartStore.total.toLocaleString()}\n` +
                     `*Envío Base:* $${shippingFeeBase.toLocaleString()}\n` +
                     `*TOTAL ESTIMADO:* $${order.totalAmount.toLocaleString()}\n\n` +
                     `📍 *Dirección inicial:* ${dto.value.shippingAddress}\n\n` +
                     `_Deseo coordinar el pago y definir si prefiero recogida en tienda o envío asegurado especial._`;

        const whatsappUrl = `https://wa.me/${salesPhone}?text=${encodeURIComponent(text)}`;
        
        // 3. Limpieza y apertura en pestaña nueva
        setTimeout(() => {
            cartStore.items = [];
            cartStore.total = 0;
            
            // Abre WhatsApp en pestaña nueva
            window.open(whatsappUrl, '_blank');
            
            // Redirige la pestaña actual a una página de éxito o a la tienda
            router.push('/joyas'); 
        }, 1500);
        
    } catch (err) {
        const msg = err.response?.data?.message || "Error al procesar la orden. Verifique el inventario.";
        showNotification('error', msg);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
  <div class="bg-brand-black min-h-screen py-20 text-brand-white">
    <div class="container mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
      
      <div class="space-y-12">
        <h1 class="font-serif-elegant text-4xl uppercase tracking-[0.3em] border-b border-brand-white/10 pb-6">Checkout</h1>
        
        <form @submit.prevent="processOrder" class="space-y-8">
          <div class="space-y-6">
            <div class="flex flex-col border-b border-white/10 focus-within:border-brand-gold transition-colors">
              <label class="text-[9px] uppercase tracking-widest text-brand-gold mb-1 font-bold">Nombre Completo *</label>
              <input v-model="dto.customerName" type="text" placeholder="Ej: Nombre..." required 
                     class="bg-transparent py-3 text-sm outline-none placeholder:text-white/5">
            </div>

            <div class="flex flex-col border-b border-white/10 focus-within:border-brand-gold transition-colors">
              <label class="text-[9px] uppercase tracking-widest text-brand-gold mb-1 font-bold">Correo Electrónico *</label>
              <input v-model="dto.customerEmail" type="email" placeholder="n.fuentes@email.com" required 
                     class="bg-transparent py-3 text-sm outline-none placeholder:text-white/5">
            </div>

            <div class="flex flex-col border-b border-white/10 focus-within:border-brand-gold transition-colors">
              <label class="text-[9px] uppercase tracking-widest text-brand-gold mb-1 font-bold">WhatsApp / Teléfono *</label>
              <input v-model="dto.phoneNumber" type="tel" placeholder="+57 300 ..." required 
                     class="bg-transparent py-3 text-sm outline-none placeholder:text-white/5">
            </div>

            <div class="flex flex-col border-b border-white/10 focus-within:border-brand-gold transition-colors">
              <label class="text-[9px] uppercase tracking-widest text-brand-gold mb-1 font-bold">Dirección de Entrega Preliminar *</label>
              <input v-model="dto.shippingAddress" type="text" placeholder="Ciudad, Barrio y Dirección" required 
                     class="bg-transparent py-3 text-sm outline-none placeholder:text-white/5">
            </div>

            <div class="flex flex-col border-b border-white/10 focus-within:border-brand-gold transition-colors">
              <label class="text-[9px] uppercase tracking-widest text-brand-gold mb-1">Notas Especiales</label>
              <textarea v-model="dto.notes" placeholder="¿Deseas empaque de regalo o recogida en tienda?" 
                        class="bg-transparent py-3 text-sm outline-none h-20 resize-none placeholder:text-white/5"></textarea>
            </div>
          </div>

          <div class="space-y-4">
              <button type="submit" :disabled="isSubmitting" 
                      class="w-full h-16 bg-brand-primary text-brand-black font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-brand-gold transition-all flex items-center justify-center disabled:opacity-50 shadow-2xl">
                <span v-if="!isSubmitting">Confirmar y Definir Pago en WhatsApp</span>
                <Icon v-else icon="line-md:loading-twotone-loop" class="w-8 h-8" />
              </button>
              
              <p class="text-[9px] text-brand-white/40 uppercase tracking-[0.2em] text-center leading-relaxed italic px-4">
                * Un asesor de <span class="text-brand-gold">Cushion</span> se comunicará para definir el medio de pago (Transferencia, Link o Efectivo) y el costo final de envío asegurado.
              </p>
          </div>
        </form>
      </div>

      <div class="bg-white/[0.02] border border-white/5 p-12 h-fit lg:sticky lg:top-28">
        <h3 class="text-brand-gold uppercase tracking-[0.4em] text-[10px] mb-10 border-b border-brand-gold/20 pb-4 font-bold">Detalle de la Bóveda</h3>
        
        <div class="space-y-6 mb-12">
            <div v-for="item in cartStore.items" :key="item.productId" class="flex justify-between items-start gap-4 text-sm">
                <div class="flex flex-col">
                  <span class="text-white/80 uppercase tracking-widest text-[11px] font-bold">{{ item.productName }}</span>
                  <span class="text-white/40 text-[9px] uppercase">Cantidad: {{ item.quantity }}</span>
                </div>
                <span class="font-sans-luxury text-brand-gold">$ {{ (item.price * item.quantity).toLocaleString() }}</span>
            </div>
        </div>

        <div class="border-t border-white/10 pt-10 space-y-5">
            <div class="flex justify-between text-[10px] text-white/40 uppercase tracking-[0.3em]">
                <span>Piezas Seleccionadas</span>
                <span>$ {{ cartStore.total.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-[10px] text-white/40 uppercase tracking-[0.3em]">
                <span>Seguro Envío (Base)</span>
                <span>$ {{ shippingFeeBase.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-3xl font-serif-elegant text-brand-gold pt-8 border-t border-brand-gold/30">
                <span class="tracking-widest">TOTAL</span>
                <span>$ {{ totalWithShipping.toLocaleString() }}</span>
            </div>
        </div>

        <div class="mt-14 p-6 bg-brand-gold/5 border border-brand-gold/20 flex gap-5 items-center">
            <Icon icon="lucide:gem" class="text-brand-gold w-8 h-8 flex-shrink-0 opacity-50" />
            <p class="text-[9px] text-white/50 uppercase tracking-[0.2em] leading-relaxed italic">
                Todas nuestras gemas cuentan con certificación y son transportadas bajo protocolos de seguridad privada.
            </p>
        </div>
      </div>
    </div>

    <transition name="slide-fade">
        <div v-if="toast.show" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
            <div :class="[
                'backdrop-blur-xl border px-8 py-5 flex items-center gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
                toast.type === 'success' ? 'bg-green-950/90 border-green-500/30' : 'bg-red-950/90 border-red-500/30'
            ]">
                <Icon :icon="toast.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" 
                    class="w-6 h-6 text-white" />
                <p class="text-white text-[10px] uppercase tracking-[0.2em] font-bold flex-grow">
                    {{ toast.message }}
                </p>
                <button @click="toast.show = false" class="text-white/30 hover:text-white transition-colors">
                    <Icon icon="lucide:x" class="w-4 h-4" />
                </button>
            </div>
        </div>
    </transition>
  </div>
</template>

<style scoped>
/* Transición elegante para el Toast */
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translate(-50%, 30px);
  opacity: 0;
}

/* Estilos de inputs para asegurar legibilidad */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>