<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const data = ref(null);
const loading = ref(true);
const error = ref('');
const days = ref(30);
const downloading = ref(false);
const showAdvanced = ref(false);
const showRecent = ref(false);

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

// Cuántas veces pasó una interacción (para las tarjetas de resumen)
const countOf = (type) => {
  const row = (data.value?.byType || []).find(r => r.key === type);
  return row ? row.count : 0;
};

// Tarjetas de embudo, en lenguaje sencillo
const funnel = computed(() => ([
  { icon: 'lucide:eye',            label: 'Miraron una pieza',      n: countOf('view_product'),   color: 'text-brand-gold' },
  { icon: 'lucide:shopping-bag',   label: 'La agregaron al carrito', n: countOf('add_to_cart'),    color: 'text-brand-gold' },
  { icon: 'lucide:credit-card',    label: 'Iniciaron el pago',       n: countOf('begin_checkout'), color: 'text-brand-gold' },
  { icon: 'lucide:check-circle',   label: 'Compraron',               n: countOf('purchase'),       color: 'text-emerald-400' },
  { icon: 'simple-icons:whatsapp', label: 'Escribieron por WhatsApp', n: countOf('whatsapp_click'), color: 'text-emerald-400' },
]));

// Descargar todo en Excel (CSV)
const download = async () => {
  downloading.value = true;
  try {
    const res = await api.get(`/admin/events/export?days=${days.value}`, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `cushion-analitica-${days.value}dias.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    error.value = 'No se pudo descargar el archivo.';
  } finally {
    downloading.value = false;
  }
};
</script>

<template>
  <div>
    <header class="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-serif-elegant text-brand-white tracking-wide">Analítica</h1>
        <p class="text-brand-white/40 text-xs tracking-wide mt-1">Qué miran, qué buscan y de dónde llega tu gente</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button v-for="d in [7, 30, 90]" :key="d" @click="setDays(d)"
          :class="days === d ? 'bg-brand-gold/15 border-brand-gold/50 text-brand-gold' : 'border-brand-white/10 text-brand-white/50 hover:text-brand-white/80'"
          class="text-[11px] tracking-wide px-3 py-1.5 border transition-colors">{{ d }} días</button>
        <button @click="download" :disabled="downloading || !data"
          class="text-[11px] tracking-wide px-3 py-1.5 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5 disabled:opacity-40">
          <Icon :icon="downloading ? 'lucide:loader-2' : 'lucide:download'" :class="downloading && 'animate-spin'" class="w-3.5 h-3.5" />
          Descargar Excel
        </button>
      </div>
    </header>

    <div v-if="loading" class="text-brand-white/50 text-sm py-20 text-center">
      <Icon icon="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto mb-3 text-brand-gold" /> Cargando…
    </div>
    <p v-else-if="error" class="text-amber-400/80 text-xs bg-amber-500/10 border border-amber-500/20 px-4 py-3">{{ error }}</p>

    <div v-else-if="data">
      <p class="text-brand-white/50 text-sm mb-6">Actividad de los últimos <span class="text-brand-gold">{{ data.days }} días</span></p>

      <!-- RESUMEN EN PALABRAS SENCILLAS -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <div v-for="f in funnel" :key="f.label" class="bg-brand-white/[0.02] border border-brand-white/10 p-4">
          <Icon :icon="f.icon" :class="f.color" class="w-5 h-5 mb-2" />
          <p class="text-2xl font-serif-elegant text-brand-white leading-none">{{ money(f.n) }}</p>
          <p class="text-[10px] text-brand-white/50 tracking-wide mt-1.5 leading-snug">{{ f.label }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        <!-- PIEZAS MÁS VISTAS -->
        <section class="panel">
          <h2 class="panel-title">Piezas que más miran</h2>
          <p class="panel-hint">Las joyas que más gente abre. Considera destacarlas en la portada o pautarlas.</p>
          <div v-if="data.topViewed?.length" class="space-y-3 mt-5">
            <div v-for="(r, i) in data.topViewed" :key="r.key">
              <div class="flex justify-between items-baseline mb-1 gap-3">
                <span class="text-xs text-brand-white/80 truncate"><span class="text-brand-gold/60 mr-1.5">{{ i + 1 }}.</span>{{ r.key }}</span>
                <span class="text-[11px] text-brand-white/50 shrink-0">{{ money(r.count) }}</span>
              </div>
              <div class="h-1.5 bg-brand-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-brand-gold/70 rounded-full" :style="{ width: pct(data.topViewed, r.count) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-5">Aún nadie ha abierto una pieza en este periodo.</p>
        </section>

        <!-- PIEZAS MÁS CONSULTADAS POR WHATSAPP -->
        <section class="panel">
          <h2 class="panel-title">Más consultadas por WhatsApp</h2>
          <p class="panel-hint">Piezas por las que la gente escribió pidiendo información. Son las de mayor intención de compra.</p>
          <div v-if="data.topWhatsapp?.length" class="space-y-3 mt-5">
            <div v-for="(r, i) in data.topWhatsapp" :key="r.key">
              <div class="flex justify-between items-baseline mb-1 gap-3">
                <span class="text-xs text-brand-white/80 truncate"><span class="text-emerald-400/60 mr-1.5">{{ i + 1 }}.</span>{{ r.key }}</span>
                <span class="text-[11px] text-brand-white/50 shrink-0">{{ money(r.count) }}</span>
              </div>
              <div class="h-1.5 bg-brand-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500/60 rounded-full" :style="{ width: pct(data.topWhatsapp, r.count) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-5">Sin consultas de WhatsApp con pieza asociada.</p>
        </section>

        <!-- WHATSAPP POR BOTÓN / ORIGEN -->
        <section class="panel">
          <h2 class="panel-title">WhatsApp: desde qué botón</h2>
          <p class="panel-hint">De dónde tocan WhatsApp: la pieza, el dock del celular, el chat… Este total debería parecerse a los "Contactos" de Meta.</p>
          <div v-if="data.whatsappBySource?.length" class="space-y-3 mt-5">
            <div v-for="r in data.whatsappBySource" :key="r.key">
              <div class="flex justify-between items-baseline mb-1 gap-3">
                <span class="text-xs text-brand-white/80 truncate capitalize">{{ r.key }}</span>
                <span class="text-[11px] text-brand-white/50 shrink-0">{{ money(r.count) }}</span>
              </div>
              <div class="h-1.5 bg-brand-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500/60 rounded-full" :style="{ width: pct(data.whatsappBySource, r.count) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-5">Aún sin clics de WhatsApp en este periodo.</p>
        </section>

        <!-- QUÉ BUSCAN -->
        <section class="panel">
          <h2 class="panel-title">Qué buscan en el sitio</h2>
          <p class="panel-hint">Lo que la gente escribe en el buscador. Si buscan algo que no tienes, es una oportunidad de negocio.</p>
          <div v-if="data.topSearches?.length" class="space-y-2.5 mt-5">
            <div v-for="(r, i) in data.topSearches" :key="r.key" class="flex justify-between items-baseline gap-3">
              <span class="text-xs text-brand-white/80 truncate"><span class="text-brand-white/30 mr-1.5">{{ i + 1 }}.</span>“{{ r.key }}”</span>
              <span class="text-[11px] text-brand-white/50 shrink-0">{{ money(r.count) }} {{ r.count === 1 ? 'búsqueda' : 'búsquedas' }}</span>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-5">Nadie ha usado el buscador todavía.</p>
        </section>

        <!-- DE DÓNDE LLEGA LA GENTE -->
        <section class="panel">
          <h2 class="panel-title">De dónde llega la gente</h2>
          <p class="panel-hint">Qué campaña o fuente trajo cada visita. “directo / orgánico” = llegaron sin anuncio (Google, redes, escribiendo la web).</p>
          <div v-if="data.byCampaign?.length" class="space-y-3 mt-5">
            <div v-for="r in data.byCampaign" :key="r.key">
              <div class="flex justify-between items-baseline mb-1 gap-3">
                <span class="text-xs text-brand-white/80 truncate">{{ r.key }}</span>
                <span class="text-[11px] text-brand-white/50 shrink-0">{{ money(r.count) }}</span>
              </div>
              <div class="h-1.5 bg-brand-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-brand-primary rounded-full" :style="{ width: pct(data.byCampaign, r.count) + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-5">Sin datos de origen.</p>
        </section>
      </div>

      <!-- DETALLE AVANZADO (colapsable) -->
      <section class="panel mt-4 md:mt-6">
        <button @click="showAdvanced = !showAdvanced" class="w-full flex items-center justify-between">
          <span class="panel-title">Detalle por anuncio <span class="text-brand-white/30 normal-case tracking-normal font-normal">(avanzado)</span></span>
          <Icon :icon="showAdvanced ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-4 h-4 text-brand-white/40" />
        </button>
        <div v-if="showAdvanced" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
          <div>
            <p class="text-[10px] tracking-[0.2em] uppercase text-brand-white/40 mb-3">Grupo de anuncios</p>
            <div v-if="data.byAdset?.length" class="space-y-2">
              <div v-for="r in data.byAdset" :key="r.key" class="flex justify-between items-baseline gap-3">
                <span class="text-xs text-brand-white/70 truncate">{{ r.key }}</span>
                <span class="text-[11px] text-brand-white/40 shrink-0">{{ money(r.count) }}</span>
              </div>
            </div>
            <p v-else class="text-brand-white/25 text-xs">—</p>
          </div>
          <div>
            <p class="text-[10px] tracking-[0.2em] uppercase text-brand-white/40 mb-3">Anuncio</p>
            <div v-if="data.byAd?.length" class="space-y-2">
              <div v-for="r in data.byAd" :key="r.key" class="flex justify-between items-baseline gap-3">
                <span class="text-xs text-brand-white/70 truncate">{{ r.key }}</span>
                <span class="text-[11px] text-brand-white/40 shrink-0">{{ money(r.count) }}</span>
              </div>
            </div>
            <p v-else class="text-brand-white/25 text-xs">—</p>
          </div>
          <div>
            <p class="text-[10px] tracking-[0.2em] uppercase text-brand-white/40 mb-3">Ubicación</p>
            <div v-if="data.byPlacement?.length" class="space-y-2">
              <div v-for="r in data.byPlacement" :key="r.key" class="flex justify-between items-baseline gap-3">
                <span class="text-xs text-brand-white/70 truncate">{{ r.key }}</span>
                <span class="text-[11px] text-brand-white/40 shrink-0">{{ money(r.count) }}</span>
              </div>
            </div>
            <p v-else class="text-brand-white/25 text-xs">—</p>
          </div>
        </div>
      </section>

      <!-- ACTIVIDAD RECIENTE (colapsable) -->
      <section class="panel mt-4 md:mt-6">
        <button @click="showRecent = !showRecent" class="w-full flex items-center justify-between">
          <span class="panel-title">Actividad reciente <span class="text-brand-white/30 normal-case tracking-normal font-normal">(últimos movimientos)</span></span>
          <Icon :icon="showRecent ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-4 h-4 text-brand-white/40" />
        </button>
        <div v-if="showRecent && data.recent?.length" class="mt-4 divide-y divide-brand-white/5">
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
        <p v-else-if="showRecent" class="text-brand-white/30 text-xs mt-4">Sin actividad.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/main.css";
.panel { @apply bg-brand-white/[0.02] border border-brand-white/10 p-5 md:p-6; }
.panel-title { @apply text-xs tracking-[0.2em] uppercase text-brand-gold font-bold; }
.panel-hint { @apply text-[11px] text-brand-white/40 leading-relaxed mt-2; }
</style>
