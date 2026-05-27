<script setup>
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const requests = ref([]);
const stats = ref({ FORMULARIO: 0, WHATSAPP: 0, TOTAL: 0 });
const isLoading = ref(true);
const error = ref(null);
const activeFilter = ref('TODOS');
const selectedRequest = ref(null);
const updatingId = ref(null);

const statusOptions = ['PENDIENTE', 'EN REVISIÓN', 'CONTACTADO', 'CERRADO'];

const statusColors = {
  'PENDIENTE':     'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  'EN REVISIÓN':   'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  'CONTACTADO':    'bg-brand-primary/20 text-emerald-400 border border-brand-primary/30',
  'CERRADO':       'bg-brand-white/10 text-brand-white/40 border border-brand-white/10',
};

async function fetchData() {
  isLoading.value = true;
  error.value = null;
  try {
    const [reqRes, statsRes] = await Promise.all([
      api.get('/jewelry-requests/admin'),
      api.get('/jewelry-requests/admin/stats'),
    ]);
    requests.value = reqRes.data;
    stats.value = statsRes.data;
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}

async function updateStatus(id, newStatus) {
  updatingId.value = id;
  try {
    const res = await api.put(`/jewelry-requests/admin/${id}/status`, null, {
      params: { status: newStatus }
    });
    const updated = res.data;
    const idx = requests.value.findIndex(r => r.id === id);
    if (idx !== -1) requests.value[idx] = updated;
    if (selectedRequest.value?.id === id) selectedRequest.value = updated;
  } catch (e) {
    alert('Error: ' + e.message);
  } finally {
    updatingId.value = null;
  }
}

const filteredRequests = computed(() => {
  if (activeFilter.value === 'TODOS') return requests.value;
  if (activeFilter.value === 'FORMULARIO' || activeFilter.value === 'WHATSAPP')
    return requests.value.filter(r => r.contactMethod === activeFilter.value);
  return requests.value.filter(r => r.status === activeFilter.value);
});

const formularioPercent = computed(() => {
  if (!stats.value.TOTAL) return 0;
  return Math.round((stats.value.FORMULARIO / stats.value.TOTAL) * 100);
});

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
}

onMounted(fetchData);
</script>

<template>
  <div class="text-brand-white">

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-serif-elegant text-brand-gold tracking-wide">Consultas Esmeraldas</h1>
        <p class="text-xs text-brand-white/40 mt-1 font-sans-luxury tracking-wide">Solicitudes de joyería personalizada</p>
      </div>
      <button @click="fetchData" class="flex items-center gap-2 text-xs text-brand-white/60 hover:text-brand-gold transition-colors px-3 py-2 border border-brand-white/10 hover:border-brand-gold/30 rounded">
        <Icon icon="lucide:refresh-cw" class="w-3.5 h-3.5" />
        Actualizar
      </button>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-brand-white/5 border border-brand-white/10 rounded-lg p-4">
        <p class="text-xs text-brand-white/40 font-sans-luxury tracking-wide mb-1">Total</p>
        <p class="text-3xl font-serif-elegant text-brand-gold">{{ stats.TOTAL }}</p>
      </div>
      <div class="bg-brand-white/5 border border-brand-white/10 rounded-lg p-4">
        <p class="text-xs text-brand-white/40 font-sans-luxury tracking-wide mb-1">Formulario</p>
        <p class="text-3xl font-serif-elegant text-brand-primary">{{ stats.FORMULARIO }}</p>
      </div>
      <div class="bg-brand-white/5 border border-brand-white/10 rounded-lg p-4">
        <p class="text-xs text-brand-white/40 font-sans-luxury tracking-wide mb-1">WhatsApp</p>
        <p class="text-3xl font-serif-elegant text-green-400">{{ stats.WHATSAPP }}</p>
      </div>
      <!-- A/B bar -->
      <div class="bg-brand-white/5 border border-brand-white/10 rounded-lg p-4 flex flex-col justify-between">
        <p class="text-xs text-brand-white/40 font-sans-luxury tracking-wide mb-2">Canal preferido</p>
        <div class="w-full h-2 rounded-full bg-green-400/20 overflow-hidden">
          <div class="h-full bg-brand-primary rounded-full transition-all duration-700" :style="{ width: formularioPercent + '%' }"></div>
        </div>
        <div class="flex justify-between text-[10px] mt-1.5 text-brand-white/40">
          <span>Formulario {{ formularioPercent }}%</span>
          <span>WA {{ 100 - formularioPercent }}%</span>
        </div>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-if="isLoading" class="flex items-center justify-center py-20 text-brand-white/30">
      <Icon icon="lucide:loader-2" class="w-6 h-6 animate-spin mr-2" />
      Cargando consultas...
    </div>
    <div v-else-if="error" class="text-center py-20 text-red-400 text-sm">{{ error }}</div>

    <template v-else>
      <!-- Filters -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button v-for="f in ['TODOS', 'FORMULARIO', 'WHATSAPP', 'PENDIENTE', 'EN REVISIÓN', 'CONTACTADO', 'CERRADO']" :key="f"
          @click="activeFilter = f"
          :class="activeFilter === f
            ? 'bg-brand-gold text-brand-black'
            : 'bg-brand-white/5 text-brand-white/60 hover:bg-brand-white/10'"
          class="px-3 py-1.5 text-[10px] font-sans-luxury tracking-wide rounded transition-colors">
          {{ f }}
        </button>
      </div>

      <!-- Empty -->
      <div v-if="!filteredRequests.length" class="text-center py-20 text-brand-white/30 text-sm">
        No hay consultas con este filtro.
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg border border-brand-white/10">
        <table class="w-full text-xs font-sans-luxury">
          <thead>
            <tr class="border-b border-brand-white/10 text-brand-white/40">
              <th class="px-4 py-3 text-left tracking-wide">#</th>
              <th class="px-4 py-3 text-left tracking-wide">Canal</th>
              <th class="px-4 py-3 text-left tracking-wide">Cliente</th>
              <th class="px-4 py-3 text-left tracking-wide hidden md:table-cell">Joya</th>
              <th class="px-4 py-3 text-left tracking-wide hidden lg:table-cell">Presupuesto</th>
              <th class="px-4 py-3 text-left tracking-wide">Estado</th>
              <th class="px-4 py-3 text-left tracking-wide hidden xl:table-cell">Fecha</th>
              <th class="px-4 py-3 text-left tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in filteredRequests" :key="req.id"
              class="border-b border-brand-white/5 hover:bg-brand-white/5 transition-colors cursor-pointer"
              @click="selectedRequest = req">
              <td class="px-4 py-3 text-brand-white/40">{{ req.id }}</td>
              <td class="px-4 py-3">
                <span :class="req.contactMethod === 'WHATSAPP' ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-brand-primary/15 text-emerald-300 border border-brand-primary/20'"
                  class="px-2 py-0.5 rounded text-[10px]">
                  {{ req.contactMethod === 'WHATSAPP' ? '💬 WA' : '📋 Form' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <p class="text-brand-white font-medium">{{ req.customerName }}</p>
                <p class="text-brand-white/40 text-[10px]">{{ req.customerEmail }}</p>
              </td>
              <td class="px-4 py-3 text-brand-white/60 hidden md:table-cell">{{ req.jewelryType }}</td>
              <td class="px-4 py-3 text-brand-white/60 hidden lg:table-cell">{{ req.budgetRange }}</td>
              <td class="px-4 py-3" @click.stop>
                <select :value="req.status"
                  @change="updateStatus(req.id, $event.target.value)"
                  :disabled="updatingId === req.id"
                  :class="statusColors[req.status] || 'bg-brand-white/10 text-brand-white/40'"
                  class="text-[10px] rounded px-2 py-1 bg-transparent cursor-pointer outline-none">
                  <option v-for="s in statusOptions" :key="s" :value="s" class="bg-brand-black text-brand-white">{{ s }}</option>
                </select>
              </td>
              <td class="px-4 py-3 text-brand-white/40 hidden xl:table-cell">{{ formatDate(req.createdAt) }}</td>
              <td class="px-4 py-3" @click.stop>
                <button @click="selectedRequest = req" class="text-brand-gold/60 hover:text-brand-gold transition-colors">
                  <Icon icon="lucide:eye" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Detail drawer / modal -->
    <Transition name="slide-panel">
      <div v-if="selectedRequest" class="fixed inset-0 z-50 flex justify-end">
        <div class="absolute inset-0 bg-brand-black/70 backdrop-blur-sm" @click="selectedRequest = null"></div>
        <div class="relative w-full max-w-md bg-[#0D1A14] border-l border-brand-white/10 h-full overflow-y-auto p-6 shadow-2xl">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-serif-elegant text-brand-gold">Consulta #{{ selectedRequest.id }}</h2>
            <button @click="selectedRequest = null" class="text-brand-white/40 hover:text-brand-white transition-colors">
              <Icon icon="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Canal badge -->
          <div class="mb-6">
            <span :class="selectedRequest.contactMethod === 'WHATSAPP' ? 'bg-green-500/15 text-green-400 border-green-500/20' : 'bg-brand-primary/15 text-emerald-300 border-brand-primary/20'"
              class="border px-3 py-1 rounded-full text-xs font-sans-luxury">
              {{ selectedRequest.contactMethod === 'WHATSAPP' ? '💬 Contactó por WhatsApp' : '📋 Enviado por Formulario' }}
            </span>
          </div>

          <!-- Fields -->
          <div class="space-y-4 text-sm font-sans-luxury">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] text-brand-white/40 tracking-wide mb-1">NOMBRE</p>
                <p class="text-brand-white">{{ selectedRequest.customerName }}</p>
              </div>
              <div>
                <p class="text-[10px] text-brand-white/40 tracking-wide mb-1">TELÉFONO</p>
                <p class="text-brand-white">{{ selectedRequest.customerPhone || '—' }}</p>
              </div>
            </div>
            <div>
              <p class="text-[10px] text-brand-white/40 tracking-wide mb-1">EMAIL</p>
              <p class="text-brand-white">{{ selectedRequest.customerEmail }}</p>
            </div>
            <hr class="border-brand-white/10" />
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] text-brand-white/40 tracking-wide mb-1">OCASIÓN</p>
                <p class="text-brand-white">{{ selectedRequest.occasion }}</p>
              </div>
              <div>
                <p class="text-[10px] text-brand-white/40 tracking-wide mb-1">TIPO DE JOYA</p>
                <p class="text-brand-white">{{ selectedRequest.jewelryType }}</p>
              </div>
              <div>
                <p class="text-[10px] text-brand-white/40 tracking-wide mb-1">GEMA</p>
                <p class="text-brand-white">{{ selectedRequest.gemstonePreference }}</p>
              </div>
              <div>
                <p class="text-[10px] text-brand-white/40 tracking-wide mb-1">METAL</p>
                <p class="text-brand-white">{{ selectedRequest.metalType }}</p>
              </div>
            </div>
            <div>
              <p class="text-[10px] text-brand-white/40 tracking-wide mb-1">PRESUPUESTO</p>
              <p class="text-brand-gold font-medium">{{ selectedRequest.budgetRange }}</p>
            </div>
            <div v-if="selectedRequest.ideas">
              <p class="text-[10px] text-brand-white/40 tracking-wide mb-1">IDEAS / DESCRIPCIÓN</p>
              <p class="text-brand-white/80 leading-relaxed">{{ selectedRequest.ideas }}</p>
            </div>
            <hr class="border-brand-white/10" />
            <div>
              <p class="text-[10px] text-brand-white/40 tracking-wide mb-2">ESTADO</p>
              <select :value="selectedRequest.status"
                @change="updateStatus(selectedRequest.id, $event.target.value)"
                :disabled="updatingId === selectedRequest.id"
                class="w-full bg-brand-white/5 border border-brand-white/20 rounded px-3 py-2 text-brand-white text-xs outline-none cursor-pointer hover:border-brand-gold/40 transition-colors">
                <option v-for="s in statusOptions" :key="s" :value="s" class="bg-[#0D1A14] text-brand-white">{{ s }}</option>
              </select>
            </div>
            <div>
              <p class="text-[10px] text-brand-white/40 tracking-wide mb-1">RECIBIDO</p>
              <p class="text-brand-white/60">{{ formatDate(selectedRequest.createdAt) }}</p>
            </div>
          </div>

          <!-- WhatsApp CTA if they provided phone -->
          <div v-if="selectedRequest.customerPhone" class="mt-8">
            <a :href="`https://wa.me/${selectedRequest.customerPhone.replace(/\D/g,'')}`" target="_blank"
              class="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-sans-luxury tracking-wide rounded transition-colors">
              <Icon icon="simple-icons:whatsapp" class="w-4 h-4" />
              Abrir en WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.slide-panel-enter-active, .slide-panel-leave-active {
  transition: opacity 0.3s ease;
}
.slide-panel-enter-active .relative,
.slide-panel-leave-active .relative {
  transition: transform 0.3s ease;
}
.slide-panel-enter-from, .slide-panel-leave-to {
  opacity: 0;
}
.slide-panel-enter-from .relative {
  transform: translateX(100%);
}
</style>
