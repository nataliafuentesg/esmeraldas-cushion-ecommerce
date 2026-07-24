<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const users = ref([]);
const loading = ref(true);
const error = ref('');
const search = ref('');

onMounted(async () => {
  try {
    const res = await api.get('/admin/clients');
    users.value = res.data || [];
  } catch (e) {
    error.value = 'No se pudieron cargar los usuarios. ¿Ya desplegaste el backend con el nuevo endpoint?';
  } finally {
    loading.value = false;
  }
});

const fullName = (u) => [u.firstName, u.lastName].filter(Boolean).join(' ') || '—';

const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  const list = [...users.value].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  if (!q) return list;
  return list.filter(u =>
    fullName(u).toLowerCase().includes(q) ||
    (u.email || '').toLowerCase().includes(q) ||
    (u.phone || '').toLowerCase().includes(q)
  );
});

const withOrders = computed(() => users.value.filter(u => (u.orderCount || 0) > 0).length);
</script>

<template>
  <div>
    <header class="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-serif-elegant text-brand-white tracking-wide">Usuarios</h1>
        <p class="text-brand-white/40 text-xs tracking-wide mt-1">
          {{ users.length }} registrados · {{ withOrders }} con pedidos
        </p>
      </div>
      <div class="relative w-full sm:w-72">
        <Icon icon="lucide:search" class="w-4 h-4 text-brand-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
        <input v-model="search" type="text" placeholder="Buscar por nombre, correo o teléfono"
          class="w-full bg-brand-white/[0.03] border border-brand-white/10 text-brand-white/80 text-xs pl-9 pr-3 py-2.5 focus:border-brand-gold outline-none" />
      </div>
    </header>

    <div v-if="loading" class="text-brand-white/50 text-sm py-20 text-center">
      <Icon icon="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto mb-3 text-brand-gold" />
      Cargando usuarios…
    </div>

    <p v-else-if="error" class="text-amber-400/80 text-xs bg-amber-500/10 border border-amber-500/20 px-4 py-3">
      {{ error }}
    </p>

    <div v-else-if="filtered.length" class="overflow-x-auto border border-brand-white/10">
      <table class="w-full text-left border-collapse min-w-[640px]">
        <thead>
          <tr class="bg-brand-white/[0.03] text-[10px] uppercase tracking-wide text-brand-white/40">
            <th class="px-4 py-3 font-medium">Nombre</th>
            <th class="px-4 py-3 font-medium">Correo</th>
            <th class="px-4 py-3 font-medium">Teléfono</th>
            <th class="px-4 py-3 font-medium text-center">Pedidos</th>
            <th class="px-4 py-3 font-medium">Registro</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-white/5">
          <tr v-for="u in filtered" :key="u.id" class="text-xs hover:bg-brand-white/[0.02] transition-colors">
            <td class="px-4 py-3 text-brand-white/85">
              {{ fullName(u) }}
              <span v-if="u.role === 'ADMIN'" class="ml-1.5 text-[8px] bg-brand-gold/15 text-brand-gold px-1.5 py-0.5 tracking-wide">ADMIN</span>
            </td>
            <td class="px-4 py-3 text-brand-white/60">{{ u.email }}</td>
            <td class="px-4 py-3 text-brand-white/60">{{ u.phone || '—' }}</td>
            <td class="px-4 py-3 text-center">
              <span :class="u.orderCount > 0 ? 'text-brand-gold' : 'text-brand-white/30'">{{ u.orderCount || 0 }}</span>
            </td>
            <td class="px-4 py-3 text-brand-white/50">{{ fmtDate(u.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-brand-white/30 text-sm py-16 text-center">
      {{ search ? 'Ningún usuario coincide con la búsqueda.' : 'Aún no hay usuarios registrados.' }}
    </p>
  </div>
</template>
