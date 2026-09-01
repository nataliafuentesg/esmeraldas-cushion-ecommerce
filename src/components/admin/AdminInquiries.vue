<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const inquiries = ref([]);
const loading = ref(true);
const error = ref('');
const search = ref('');
const sourceFilter = ref('TODAS');

onMounted(async () => {
  try {
    const res = await api.get('/product-inquiries/admin');
    inquiries.value = res.data || [];
  } catch (e) {
    error.value = 'No se pudieron cargar las consultas. ¿El backend está arriba?';
  } finally {
    loading.value = false;
  }
});

// ── Helpers ────────────────────────────────────────────────────────────────
const sourceOf = (i) => (i.utmSource || '').trim().toLowerCase() || 'directo / orgánico';
const fmtDateTime = (d) => d
  ? new Date(d).toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—';

// Origen legible: fuente · medio · campaña (lo que exista)
const originText = (i) => {
  const parts = [i.utmSource, i.utmCampaign, i.utmTerm, i.utmContent, i.placement].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'Directo / orgánico';
};

// ── Resumen por origen ───────────────────────────────────────────────────
const bySource = computed(() => {
  const map = {};
  inquiries.value.forEach(i => {
    const s = sourceOf(i);
    map[s] = (map[s] || 0) + 1;
  });
  return Object.entries(map)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
});

const sources = computed(() => bySource.value.map(s => s.source));

// ── Filtro + búsqueda ────────────────────────────────────────────────────
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  let list = [...inquiries.value].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  if (sourceFilter.value !== 'TODAS') list = list.filter(i => sourceOf(i) === sourceFilter.value);
  if (q) list = list.filter(i =>
    (i.productName || '').toLowerCase().includes(q) ||
    (i.clientEmail || '').toLowerCase().includes(q) ||
    originText(i).toLowerCase().includes(q)
  );
  return list;
});

// ── Descargar Excel (CSV UTF-8 con BOM para tildes) ──────────────────────
const downloadExcel = () => {
  const headers = ['Fecha', 'Pieza', 'Slug', 'Canal', 'Correo', 'Fuente', 'Medio', 'Campaña', 'Grupo de anuncios', 'Anuncio', 'Ubicación'];
  const esc = (v) => {
    const s = (v ?? '').toString().replace(/"/g, '""');
    return /[",\n;]/.test(s) ? `"${s}"` : s;
  };
  const rows = filtered.value.map(i => [
    fmtDateTime(i.createdAt), i.productName, i.productSlug, i.channel || 'whatsapp',
    i.clientEmail, i.utmSource, i.utmMedium, i.utmCampaign, i.utmTerm, i.utmContent, i.placement,
  ].map(esc).join(','));

  const csv = '﻿' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `consultas-whatsapp-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div>
    <header class="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-serif-elegant text-brand-white tracking-wide">Consultas por WhatsApp</h1>
        <p class="text-brand-white/40 text-xs tracking-wide mt-1">
          {{ inquiries.length }} consultas · quién preguntó por cada pieza y de dónde llegó
        </p>
      </div>
      <button @click="downloadExcel" :disabled="!filtered.length"
        class="flex items-center justify-center gap-2 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold text-xs tracking-wide px-5 py-2.5 hover:bg-brand-gold hover:text-brand-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        <Icon icon="lucide:download" class="w-4 h-4" /> Descargar Excel
      </button>
    </header>

    <div v-if="loading" class="text-brand-white/50 text-sm py-20 text-center">
      <Icon icon="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto mb-3 text-brand-gold" />
      Cargando consultas…
    </div>

    <p v-else-if="error" class="text-amber-400/80 text-xs bg-amber-500/10 border border-amber-500/20 px-4 py-3">
      {{ error }}
    </p>

    <div v-else>
      <!-- Resumen por origen -->
      <div v-if="bySource.length" class="flex flex-wrap gap-2 mb-6">
        <button
          @click="sourceFilter = 'TODAS'"
          :class="sourceFilter === 'TODAS' ? 'bg-brand-gold/15 border-brand-gold/50 text-brand-gold' : 'border-brand-white/10 text-brand-white/50 hover:text-brand-white/80'"
          class="text-[11px] tracking-wide px-3 py-1.5 border transition-colors">
          Todas ({{ inquiries.length }})
        </button>
        <button v-for="s in bySource" :key="s.source"
          @click="sourceFilter = s.source"
          :class="sourceFilter === s.source ? 'bg-brand-gold/15 border-brand-gold/50 text-brand-gold' : 'border-brand-white/10 text-brand-white/50 hover:text-brand-white/80'"
          class="text-[11px] tracking-wide px-3 py-1.5 border transition-colors capitalize">
          {{ s.source }} ({{ s.count }})
        </button>
      </div>

      <!-- Búsqueda -->
      <div class="relative w-full sm:w-80 mb-4">
        <Icon icon="lucide:search" class="w-4 h-4 text-brand-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
        <input v-model="search" type="text" placeholder="Buscar por pieza, correo u origen"
          class="w-full bg-brand-white/[0.03] border border-brand-white/10 text-brand-white/80 text-xs pl-9 pr-3 py-2.5 focus:border-brand-gold outline-none" />
      </div>

      <div v-if="filtered.length" class="overflow-x-auto border border-brand-white/10">
        <table class="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr class="bg-brand-white/[0.03] text-[10px] uppercase tracking-wide text-brand-white/40">
              <th class="px-4 py-3 font-medium">Fecha</th>
              <th class="px-4 py-3 font-medium">Pieza</th>
              <th class="px-4 py-3 font-medium">Canal</th>
              <th class="px-4 py-3 font-medium">Correo</th>
              <th class="px-4 py-3 font-medium">Origen</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-white/5">
            <tr v-for="i in filtered" :key="i.id" class="text-xs hover:bg-brand-white/[0.02] transition-colors">
              <td class="px-4 py-3 text-brand-white/50 whitespace-nowrap">{{ fmtDateTime(i.createdAt) }}</td>
              <td class="px-4 py-3 text-brand-white/85">{{ i.productName || '—' }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 text-emerald-400/90">
                  <Icon icon="lucide:message-circle" class="w-3 h-3" /> {{ i.channel || 'whatsapp' }}
                </span>
              </td>
              <td class="px-4 py-3 text-brand-white/60">{{ i.clientEmail || '—' }}</td>
              <td class="px-4 py-3">
                <span :class="(i.utmSource || i.utmCampaign) ? 'text-brand-gold/90' : 'text-brand-white/40'">
                  {{ originText(i) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-brand-white/30 text-sm py-16 text-center">
        {{ search || sourceFilter !== 'TODAS' ? 'Ninguna consulta coincide con el filtro.' : 'Aún no hay consultas registradas.' }}
      </p>
    </div>
  </div>
</template>
