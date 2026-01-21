<template>
  <div class="container mx-auto px-4 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div class="bg-white p-8 border border-gray-100 shadow-sm rounded-lg">
        <h2 class="text-2xl font-serif text-emerald-900 mb-6">Datos de Envío</h2>
        <form @submit.prevent="handleOrder" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input v-model="form.customerName" type="text" required class="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input v-model="form.customerEmail" type="email" required class="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Teléfono</label>
            <input v-model="form.phoneNumber" type="tel" required class="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Dirección de Envío</label>
            <textarea v-model="form.shippingAddress" required class="w-full mt-1 p-2 border rounded"></textarea>
          </div>
          <button type="submit" :disabled="isSubmitting" 
                  class="w-full bg-emerald-800 text-white py-3 rounded hover:bg-emerald-900 transition">
            {{ isSubmitting ? 'Procesando...' : 'Generar Orden de Pago' }}
          </button>
        </form>
      </div>

      <div class="bg-stone-50 p-8 rounded-lg h-fit">
        <h2 class="text-2xl font-serif text-emerald-900 mb-6">Resumen</h2>
        <div v-for="item in cartStore.items" :key="item.product.id" class="flex justify-between mb-4 border-b pb-2">
          <span>{{ item.product.name }} (x{{ item.quantity }})</span>
          <span class="font-medium">${{ (item.product.price * item.quantity).toLocaleString() }}</span>
        </div>
        <div class="text-xl font-bold text-emerald-950 mt-6 flex justify-between">
          <span>Total:</span>
          <span>${{ cartStore.cartTotal.toLocaleString() }}</span>
        </div>
        <p class="text-sm text-gray-500 mt-4 italic">
          * Al confirmar, recibirás un correo con las instrucciones para el pago externo.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import api from '@/api/axios';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();
const isSubmitting = ref(false);

const form = reactive({
  customerName: '',
  customerEmail: '',
  phoneNumber: '',
  shippingAddress: ''
});

const handleOrder = async () => {
  if (cartStore.items.length === 0) return alert("Tu carrito está vacío");
  
  isSubmitting.value = true;
  try {
    // Enviamos la orden al backend para persistencia
    const response = await api.post('/orders/create', {
      ...form,
      totalAmount: cartStore.cartTotal
    });
    
    alert(`¡Orden ${response.data.orderNumber} creada! Revisa tu correo.`);
    cartStore.items = []; // Limpiar carrito
    router.push('/');
  } catch (error) {
    alert("Error al procesar la orden");
  } finally {
    isSubmitting.value = false;
  }
};
</script>