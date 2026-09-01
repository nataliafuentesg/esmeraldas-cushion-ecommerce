<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const data = ref(null);
const loading = ref(true);
const error = ref('');
const days = ref(30);

// Etiquetas legibles por tipo de evento
const TYPE_LABEL = {
  view_product: 'Vieron una pieza',
  add_to_cart: 'Agregaron al carrito',
  begin_checkout: 'Iniciaron checkout',
  purchase: 'Compraron',
  whatsapp_click: 'Clic a WhatsApp',
  customize_click: 'Clic en Personalizar',
  generate_lead: 'Formulario esmeralda',
  widget_open: 'Abrieron el chat',
  search: 'Búsquedas',
};
const typeLabel = (t) => TYPE_LABEL[t] || t;

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.get(`/admin/events/summary?days=${days.value}`);
    data.value = res.data;
  } catch (e) {
    error.value = 'No se pudo cargar la analítica. ¿El backend está desplegado?';
  } finally {
    loading.value = false;
  }
};
onMounted(load);
const setDays = (d) => { days.value = d; load(); };

const money = (n) => Math.round(n || 0).toLocaleString('es-CO');
const fmtTime = (d) => d ? new Date(d).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

// Barra: % relativo al mayor de la lista
const pct = (list, count) => {
  const max = Math.max(1, ...(list || []).map(r => r.count));
  return (count / max) * 100;
};
</script>

<template>
  <div>
    <header class="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-serif-elegant text-brand-white tracking-wide">Analítica propia</h1>
        <p class="text-brand-white/40 text-xs tracking-wide mt-1">Toda interacción del sitio, medida por nosotros</p>
      </div>
      <div class="flex gap-2">
        <button v-for="d in [7, 30, 90]" :key="d" @click="setDays(d)"
          :class="days === d ? 'bg-brand-gold/15 border-brand-gold/50 text-brand-gold' : 'border-brand-white/10 text-brand-white/50 hover:text-brand-white/80'"
          class="text-[11px] tracking-wide px-3 py-1.5 border transition-colors">{{ d }} días</button>
      </div>
    </header>

    <div v-if="loading" class="text-brand-white/50 text-sm py-20 text-center">
      <Icon icon="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto mb-3 text-brand-gold" /> Cargando…
    </div>
    <p v-else-if="error" class="text-amber-400/80 text-xs bg-amber-500/10 border border-amber-500/20 px-4 py-3">{{ error }}</p>

    <div v-else-if="data">
      <p class="text-brand-white/60 text-sm mb-6"><span class="text-brand-gold font-medium">{{ money(data.total) }}</span> eventos en los últimos {{ data.days }} días</p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        <!-- Por tipo de interacción -->
        <section class="panel">
          <h2 class="panel-title">Qué hacen en el sitio</h2>
          <div v-if="data.byType?.length" class="space-y-3 mt-6">
            <div v-for="r in data.byType" :key="r.key">
              <div class="flex justify-between items-baseline mb-1 gap-3">
                <span class="text-xs text-brand-white/75">{{ typeLabel(r.key) }}</span>
                <span class="text-[11px] text-brand-white/50 shrink-0">{{ money(r.count) }}</span>
              </div>
              <div class="h-1.5 bg-brand-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-brand-gold/70 rounded-full" :style="{ width: pct(data.byType, r.count) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-6">Aún sin eventos.</p>
        </section>

        <!-- Por campaña -->
        <section class="panel">
          <h2 class="panel-title">Por campaña</h2>
          <div v-if="data.byCampaign?.length" class="space-y-3 mt-6">
            <div v-for="r in data.byCampaign" :key="r.key">
              <div class="flex justify-between items-baseline mb-1 gap-3">
                <span class="text-xs text-brand-white/75 truncate">{{ r.key }}</span>
                <span class="text-[11px] text-brand-white/50 shrink-0">{{ money(r.count) }}</span>
              </div>
              <div class="h-1.5 bg-brand-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500/60 rounded-full" :style="{ width: pct(data.byCampaign, r.count) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-6">Sin datos de campaña.</p>
        </section>

        <!-- Por grupo de anuncios -->
        <section class="panel">
          <h2 class="panel-title">Por grupo de anuncios</h2>
          <div v-if="data.byAdset?.length" class="space-y-3.5 mt-6">
            <div v-for="r in data.byAdset" :key="r.key" class="flex justify-between items-baseline gap-3">
              <span class="text-xs text-brand-white/75 truncate">{{ r.key }}</span>
              <span class="text-[11px] text-brand-white/50 shrink-0">{{ money(r.count) }}</span>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-6">—</p>
        </section>

        <!-- Por anuncio + ubicación -->
        <section class="panel">
          <h2 class="panel-title">Por anuncio</h2>
          <div v-if="data.byAd?.length" class="space-y-3.5 mt-6">
            <div v-for="r in data.byAd" :key="r.key" class="flex justify-between items-baseline gap-3">
              <span class="text-xs text-brand-white/75 truncate">{{ r.key }}</span>
              <span class="text-[11px] text-brand-white/50 shrink-0">{{ money(r.count) }}</span>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-6">—</p>
          <h2 class="panel-title mt-6">Por ubicación</h2>
          <div v-if="data.byPlacement?.length" class="space-y-2 mt-4">
            <div v-for="r in data.byPlacement" :key="r.key" class="flex justify-between items-baseline gap-3">
              <span class="text-xs text-brand-white/75 truncate">{{ r.key }}</span>
              <span class="text-[11px] text-brand-white/50 shrink-0">{{ money(r.count) }}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Actividad reciente -->
      <section class="panel mt-4 md:mt-6">
        <h2 class="panel-title">Actividad reciente</h2>
        <div v-if="data.recent?.length" class="mt-4 divide-y divide-brand-white/5">
          <div v-for="(e, i) in data.recent" :key="i" class="flex items-center justify-between py-2.5 gap-3">
            <div class="min-w-0">
              <p class="text-xs text-brand-white/80 truncate">
                {{ typeLabel(e.type) }}
                <span v-if="e.label" class="text-brand-white/40">· {{ e.label }}</span>
              </p>
              <p class="text-[10px] text-brand-white/35 truncate">
                {{ e.path }}<span v-if="e.utmCampaign"> · {{ e.utmCampaign }}</span><span v-if="e.utmContent"> · {{ e.utmContent }}</span>
              </p>
            </div>
            <span class="text-[10px] text-brand-white/40 shrink-0">{{ fmtTime(e.createdAt) }}</span>
          </div>
        </div>
        <p v-else class="text-brand-white/30 text-xs mt-4">Sin actividad.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/main.css";
.panel { @apply bg-brand-white/[0.02] border border-brand-white/10 p-5 md:p-6; }
.panel-title { @apply text-xs tracking-[0.2em] uppercase text-brand-gold font-bold; }
</style>
