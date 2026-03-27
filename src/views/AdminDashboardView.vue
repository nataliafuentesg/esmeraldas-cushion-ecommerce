<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';

// Importamos los componentes modulares
const AdminOrders = defineAsyncComponent(() => import('@/components/admin/AdminOrders.vue'));
const AdminProducts = defineAsyncComponent(() => import('@/components/admin/AdminProducts.vue'));
const AdminMessages = defineAsyncComponent(() => import('@/components/admin/AdminMessages.vue'));
const AdminReviews = defineAsyncComponent(() => import('@/components/admin/AdminReviews.vue'));

const authStore = useAuthStore();
const router = useRouter();

const activeTab = ref('pedidos');
const isMobileMenuOpen = ref(false); // Controla el menú en celular

onMounted(() => {
  if (!authStore.isAdmin) {
    router.push('/');
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

const selectTab = (tab) => {
  activeTab.value = tab;
  isMobileMenuOpen.value = false; // Cierra el menú en móvil al seleccionar
};
</script>

<template>
  <div class="bg-brand-black min-h-screen flex flex-col md:flex-row">
    
    <div class="md:hidden flex justify-between items-center bg-brand-black border-b border-brand-white/10 p-4 sticky top-0 z-50">
      <h2 class="text-brand-gold font-serif-elegant text-xl tracking-widest uppercase">Admin</h2>
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-brand-white">
        <Icon :icon="isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="w-6 h-6" />
      </button>
    </div>

    <aside :class="isMobileMenuOpen ? 'block' : 'hidden'" 
           class="md:block w-full md:w-64 bg-brand-black border-r border-brand-white/10 p-6 flex flex-col fixed md:sticky top-0 md:h-screen z-40 overflow-y-auto transition-all">
      
      <div class="mb-10 hidden md:block">
        <h2 class="text-brand-gold font-serif-elegant text-2xl tracking-widest uppercase">Admin</h2>
        <p class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em] mt-1">Control Central</p>
      </div>

      <nav class="flex-1 space-y-2">
        <button @click="selectTab('pedidos')" :class="activeTab === 'pedidos' ? 'text-brand-gold bg-brand-white/5 border-l-2 md:border-l-0 md:border-r-2 border-brand-gold' : 'text-brand-white/70 hover:bg-brand-white/5'" class="w-full text-left px-4 py-4 md:py-3 text-xs uppercase tracking-[0.2em] flex items-center space-x-3 transition-colors">
          <Icon icon="lucide:shopping-bag" class="w-5 h-5 md:w-4 md:h-4" /><span>Pedidos</span>
        </button>
        <button @click="selectTab('productos')" :class="activeTab === 'productos' ? 'text-brand-gold bg-brand-white/5 border-l-2 md:border-l-0 md:border-r-2 border-brand-gold' : 'text-brand-white/70 hover:bg-brand-white/5'" class="w-full text-left px-4 py-4 md:py-3 text-xs uppercase tracking-[0.2em] flex items-center space-x-3 transition-colors">
          <Icon icon="lucide:gem" class="w-5 h-5 md:w-4 md:h-4" /><span>Inventario</span>
        </button>
        <button @click="selectTab('mensajes')" :class="activeTab === 'mensajes' ? 'text-brand-gold bg-brand-white/5 border-l-2 md:border-l-0 md:border-r-2 border-brand-gold' : 'text-brand-white/70 hover:bg-brand-white/5'" class="w-full text-left px-4 py-4 md:py-3 text-xs uppercase tracking-[0.2em] flex items-center space-x-3 transition-colors">
          <Icon icon="lucide:mail" class="w-5 h-5 md:w-4 md:h-4" /><span>Mensajes</span>
        </button>
        <button @click="selectTab('resenas')" :class="activeTab === 'resenas' ? 'text-brand-gold bg-brand-white/5 border-l-2 md:border-l-0 md:border-r-2 border-brand-gold' : 'text-brand-white/70 hover:bg-brand-white/5'" class="w-full text-left px-4 py-4 md:py-3 text-xs uppercase tracking-[0.2em] flex items-center space-x-3 transition-colors">
          <Icon icon="lucide:star" class="w-5 h-5 md:w-4 md:h-4" /><span>Reseñas</span>
        </button>
      </nav>

      <div class="mt-8 pt-6 border-t border-brand-white/10">
        <button @click="handleLogout" class="w-full text-left px-4 py-3 text-xs uppercase tracking-[0.2em] text-red-400 hover:text-red-300 hover:bg-red-900/10 flex items-center space-x-3 transition-colors">
          <Icon icon="lucide:log-out" class="w-5 h-5 md:w-4 md:h-4" /><span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 p-4 md:p-10 overflow-x-hidden">
      <transition name="fade" mode="out-in">
        <component :is="
          activeTab === 'pedidos' ? AdminOrders : 
          activeTab === 'productos' ? AdminProducts : 
          activeTab === 'mensajes' ? AdminMessages : AdminReviews
        " />
      </transition>
    </main>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>