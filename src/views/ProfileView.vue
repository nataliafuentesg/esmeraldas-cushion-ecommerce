<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios';

const authStore = useAuthStore();
const router = useRouter();

const orders = ref([]);
const loading = ref(true);

// Si no está logueado, lo sacamos de aquí
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth');
    return;
  }
  
  // Traer el historial de pedidos de este cliente usando el endpoint que creamos en Java
  try {
    const response = await api.get(`/orders/client/${authStore.user.id}`);
    orders.value = response.data;
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
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
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      
      <div class="flex flex-col md:flex-row justify-between items-end border-b border-brand-white/10 pb-6 mb-12">
        <div>
          <h1 class="text-4xl md:text-5xl font-serif-elegant text-brand-white tracking-wide mb-2">
            Mi Cuenta
          </h1>
          <p class="text-brand-gold font-sans-luxury text-xs tracking-wide">
            Bienvenido, {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
          </p>
        </div>
        <button @click="handleLogout" 
                class="mt-6 md:mt-0 text-brand-white/50 hover:text-brand-white text-[10px] tracking-wide underline underline-offset-4 transition-colors">
          Cerrar Sesión
        </button>
      </div>

      <div>
        <h2 class="text-2xl font-serif-elegant text-brand-white mb-8 tracking-wider">
          Historial de Pedidos
        </h2>

        <div v-if="loading" class="text-brand-white/50 font-sans-luxury text-sm tracking-wide animate-pulse">
          Buscando tesoros...
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-12 border border-brand-white/5 bg-brand-white/5">
          <p class="text-brand-white/60 font-sans-luxury text-sm tracking-wide mb-6">
            Aún no has realizado ninguna compra.
          </p>
          <RouterLink to="/coleccion/todas" class="bg-brand-white text-brand-black px-8 py-3 text-[10px] font-bold tracking-wide hover:bg-brand-gold transition-colors duration-300">
            Explorar Colección
          </RouterLink>
        </div>

        <div v-else class="space-y-6">
          <div v-for="order in orders" :key="order.id" 
               class="border border-brand-white/10 p-6 bg-brand-black/50 hover:bg-brand-white/5 transition-colors duration-300">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-brand-white/10">
              <div>
                <p class="text-brand-gold text-xs font-bold tracking-wide mb-1">
                  Pedido #{{ order.orderNumber }}
                </p>
                <p class="text-brand-white/50 text-[10px] tracking-wide">
                  {{ new Date(order.createdAt).toLocaleDateString() }}
                </p>
              </div>
              <div class="mt-4 md:mt-0 text-right">
                <p class="text-brand-white font-sans-luxury text-lg tracking-wide mb-1">
                  ${{ order.totalAmount.toLocaleString() }}
                </p>
                <span class="inline-block px-3 py-1 text-[10px] font-bold tracking-wide"
                      :class="order.status === 'PENDIENTE_PAGO' ? 'bg-yellow-900/50 text-yellow-500' : 'bg-green-900/50 text-green-500'">
                  {{ order.status.replace('_', ' ') }}
                </span>
              </div>
            </div>

            <div class="space-y-3">
              <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center text-sm">
                <p class="text-brand-white/80 font-sans-luxury tracking-wide">
                  {{ item.quantity }}x <span class="text-brand-white">{{ item.product?.name || 'Artículo no disponible' }}</span>
                </p>
                <p class="text-brand-white/50 font-sans-luxury tracking-wide">
                  ${{ item.priceAtPurchase.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>