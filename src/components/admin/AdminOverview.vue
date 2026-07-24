<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const orders = ref([]);
const clients = ref([]);
const inquiryStats = ref({ total: 0, topProducts: [] });
const loading = ref(true);
const error = ref('');

// Un pedido cuenta como "pagado" (entró dinero) en cualquiera de estos estados
const PAID = ['PAGADO', 'ENVIADO', 'ENTREGADO', 'PAGO_SIN_STOCK'];
const isPaid = (o) => PAID.includes(o.status);

onMounted(async () => {
  try {
    const [ordRes, cliRes, inqRes] = await Promise.allSettled([
      api.get('/admin/orders'),
      api.get('/admin/clients'),
      api.get('/product-inquiries/admin/stats'),
    ]);
    if (ordRes.status === 'fulfilled') orders.value = ordRes.value.data || [];
    if (cliRes.status === 'fulfilled') clients.value = cliRes.value.data || [];
    if (inqRes.status === 'fulfilled') inquiryStats.value = inqRes.value.data || { total: 0, topProducts: [] };
    if (ordRes.status === 'rejected') error.value = 'No se pudieron cargar los pedidos.';
  } catch (e) {
    error.value = 'Error cargando el panel.';
  } finally {
    loading.value = false;
  }
});

// ── Helpers ────────────────────────────────────────────────────────────────
const money = (n) => '$ ' + Math.round(n || 0).toLocaleString('es-CO');
const monthKey = (d) => { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`; };
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const monthLabel = (key) => { const [y, m] = key.split('-'); return `${MONTHS[+m - 1]} ${y.slice(2)}`; };
const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'hace un momento';
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`;
  if (s < 86400) return `hace ${Math.floor(s / 3600)} h`;
  return `hace ${Math.floor(s / 86400)} d`;
};

// ── Métricas ─────────────────────────────────────────────────────────────
const paidOrders = computed(() => orders.value.filter(isPaid));

const revenueTotal = computed(() => paidOrders.value.reduce((s, o) => s + (o.totalAmount || 0), 0));

const revenueThisMonth = computed(() => {
  const k = monthKey(new Date());
  return paidOrders.value.filter(o => monthKey(o.createdAt) === k).reduce((s, o) => s + (o.totalAmount || 0), 0);
});

const avgTicket = computed(() => paidOrders.value.length ? revenueTotal.value / paidOrders.value.length : 0);

const countBy = (status) => orders.value.filter(o => o.status === status).length;

const abandonadas = computed(() => countBy('EXPIRADO'));
const rechazadas = computed(() => countBy('PAGO_RECHAZADO'));
const pendientes = computed(() => countBy('PENDIENTE_PAGO'));

// Conversión de pago = de los checkouts ya resueltos (no cuenta los que siguen en curso)
const conversionRate = computed(() => {
  const resueltos = paidOrders.value.length + abandonadas.value + rechazadas.value;
  return resueltos ? (paidOrders.value.length / resueltos) * 100 : 0;
});

// Embudo del ciclo de vida
const funnel = computed(() => ([
  { label: 'Iniciadas',   value: orders.value.length,                    color: '#8a8a8a' },
  { label: 'Pagadas',     value: paidOrders.value.length,                color: '#4C7F62' },
  { label: 'Enviadas',    value: countBy('ENVIADO') + countBy('ENTREGADO'), color: '#5b8fb0' },
  { label: 'Entregadas',  value: countBy('ENTREGADO'),                   color: '#B89B6A' },
]));

// Ingresos por mes (últimos 6 meses con datos)
const monthlyRevenue = computed(() => {
  const map = {};
  // Semilla de los últimos 6 meses para que salgan aunque estén en 0
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    map[monthKey(d)] = 0;
  }
  paidOrders.value.forEach(o => {
    const k = monthKey(o.createdAt);
    if (k in map) map[k] += (o.totalAmount || 0);
  });
  const entries = Object.entries(map);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return entries.map(([k, v]) => ({ key: k, label: monthLabel(k), value: v, pct: (v / max) * 100 }));
});

// Top piezas (por unidades vendidas en pedidos pagados)
const topProducts = computed(() => {
  const map = {};
  paidOrders.value.forEach(o => (o.items || []).forEach(it => {
    const name = it.product?.name || 'Pieza';
    if (!map[name]) map[name] = { name, units: 0, revenue: 0 };
    map[name].units += it.quantity || 0;
    map[name].revenue += (it.priceAtPurchase || 0) * (it.quantity || 0);
  }));
  const arr = Object.values(map).sort((a, b) => b.units - a.units).slice(0, 6);
  const max = Math.max(1, ...arr.map(p => p.units));
  return arr.map(p => ({ ...p, pct: (p.units / max) * 100 }));
});

// Atribución: por fuente UTM (qué canal trae compradores reales)
const attribution = computed(() => {
  const map = {};
  orders.value.forEach(o => {
    const src = (o.utmSource || '').trim().toLowerCase() || 'directo / orgánico';
    if (!map[src]) map[src] = { source: src, orders: 0, paid: 0, revenue: 0 };
    map[src].orders++;
    if (isPaid(o)) { map[src].paid++; map[src].revenue += (o.totalAmount || 0); }
  });
  const arr = Object.values(map).sort((a, b) => b.revenue - a.revenue || b.orders - a.orders);
  const max = Math.max(1, ...arr.map(s => s.orders));
  return arr.map(s => ({ ...s, pct: (s.orders / max) * 100 }));
});

// Piezas más consultadas por WhatsApp (señal de visibilidad / interés real)
const topInquiries = computed(() => {
  const arr = (inquiryStats.value.topProducts || []).slice(0, 8);
  const max = Math.max(1, ...arr.map(p => Number(p.count) || 0));
  return arr.map(p => ({ ...p, count: Number(p.count) || 0, pct: ((Number(p.count) || 0) / max) * 100 }));
});

// Actividad reciente
const recentOrders = computed(() =>
  [...orders.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)
);

const statusStyle = (s) => {
  switch (s) {
    case 'PAGADO': return 'text-green-400';
    case 'ENVIADO': return 'text-blue-400';
    case 'ENTREGADO': return 'text-brand-gold';
    case 'PENDIENTE_PAGO': return 'text-amber-400';
    case 'EXPIRADO': return 'text-brand-white/40';
    case 'PAGO_RECHAZADO': return 'text-red-400';
    default: return 'text-brand-white/60';
  }
};
const statusLabel = (s) => (s || '').replace(/_/g, ' ');

const newUsersThisMonth = computed(() => {
  const k = monthKey(new Date());
  return clients.value.filter(c => c.createdAt && monthKey(c.createdAt) === k).length;
});
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-2xl md:text-3xl font-serif-elegant text-brand-white tracking-wide">Resumen</h1>
      <p class="text-brand-white/40 text-xs tracking-wide mt-1">Lo que está pasando en tu tienda</p>
    </header>

    <div v-if="loading" class="text-brand-white/50 text-sm py-20 text-center">
      <Icon icon="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto mb-3 text-brand-gold" />
      Cargando métricas…
    </div>

    <div v-else>
      <p v-if="error" class="text-amber-400/80 text-xs bg-amber-500/10 border border-amber-500/20 px-4 py-3 mb-6">
        {{ error }}
      </p>

      <!-- KPIs -->
      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-8">
        <div class="kpi">
          <p class="kpi-label">Ingresos totales</p>
          <p class="kpi-value">{{ money(revenueTotal) }}</p>
          <p class="kpi-sub"><span class="text-brand-gold">{{ money(revenueThisMonth) }}</span> este mes</p>
        </div>
        <div class="kpi">
          <p class="kpi-label">Pedidos pagados</p>
          <p class="kpi-value">{{ paidOrders.length }}</p>
          <p class="kpi-sub">{{ pendientes }} en proceso</p>
        </div>
        <div class="kpi">
          <p class="kpi-label">Ticket promedio</p>
          <p class="kpi-value">{{ money(avgTicket) }}</p>
          <p class="kpi-sub">por pedido pagado</p>
        </div>
        <div class="kpi">
          <p class="kpi-label">Conversión de pago</p>
          <p class="kpi-value" :class="conversionRate >= 50 ? 'text-green-400' : 'text-amber-400'">
            {{ conversionRate.toFixed(0) }}%
          </p>
          <p class="kpi-sub">checkouts que sí pagan</p>
        </div>
        <div class="kpi">
          <p class="kpi-label">Carritos abandonados</p>
          <p class="kpi-value text-brand-white/70">{{ abandonadas }}</p>
          <p class="kpi-sub">reservas vencidas sin pagar</p>
        </div>
        <div class="kpi">
          <p class="kpi-label">Usuarios registrados</p>
          <p class="kpi-value">{{ clients.length }}</p>
          <p class="kpi-sub"><span class="text-brand-gold">+{{ newUsersThisMonth }}</span> este mes</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        <!-- Ingresos por mes -->
        <section class="panel">
          <h2 class="panel-title">Ingresos por mes</h2>
          <div class="flex items-end justify-between gap-2 md:gap-3 h-44 mt-6">
            <div v-for="m in monthlyRevenue" :key="m.key" class="flex-1 flex flex-col items-center justify-end h-full group">
              <span class="text-[9px] text-brand-white/50 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{{ money(m.value) }}</span>
              <div class="w-full bg-brand-gold/80 hover:bg-brand-gold transition-all rounded-t-sm"
                   :style="{ height: Math.max(m.pct, 2) + '%' }"></div>
              <span class="text-[9px] text-brand-white/40 mt-2 tracking-wide">{{ m.label }}</span>
            </div>
          </div>
        </section>

        <!-- Embudo -->
        <section class="panel">
          <h2 class="panel-title">Embudo de pedidos</h2>
          <div class="space-y-3 mt-6">
            <div v-for="(step, i) in funnel" :key="step.label">
              <div class="flex justify-between items-baseline mb-1">
                <span class="text-xs text-brand-white/70">{{ step.label }}</span>
                <span class="text-sm font-medium" :style="{ color: step.color }">{{ step.value }}</span>
              </div>
              <div class="h-2 bg-brand-white/5 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all"
                     :style="{ width: (funnel[0].value ? (step.value / funnel[0].value) * 100 : 0) + '%', background: step.color }"></div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-x-5 gap-y-2 mt-6 pt-4 border-t border-brand-white/5 text-[11px]">
            <span class="text-brand-white/50">Abandonadas: <b class="text-brand-white/70">{{ abandonadas }}</b></span>
            <span class="text-brand-white/50">Rechazadas: <b class="text-red-400/80">{{ rechazadas }}</b></span>
            <span class="text-brand-white/50">Pendientes: <b class="text-amber-400/80">{{ pendientes }}</b></span>
          </div>
        </section>

        <!-- Top piezas -->
        <section class="panel">
          <h2 class="panel-title">Piezas más vendidas</h2>
          <div v-if="topProducts.length" class="space-y-3.5 mt-6">
            <div v-for="p in topProducts" :key="p.name">
              <div class="flex justify-between items-baseline mb-1 gap-3">
                <span class="text-xs text-brand-white/70 truncate">{{ p.name }}</span>
                <span class="text-[11px] text-brand-white/50 shrink-0">{{ p.units }} und · {{ money(p.revenue) }}</span>
              </div>
              <div class="h-1.5 bg-brand-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-brand-gold/70 rounded-full" :style="{ width: p.pct + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-6">Aún no hay ventas registradas.</p>
        </section>

        <!-- Atribución -->
        <section class="panel">
          <h2 class="panel-title">Atribución por canal <span class="text-brand-white/30 font-normal normal-case tracking-normal">(de dónde llegan)</span></h2>
          <div v-if="attribution.length" class="space-y-3.5 mt-6">
            <div v-for="s in attribution" :key="s.source">
              <div class="flex justify-between items-baseline mb-1 gap-3">
                <span class="text-xs text-brand-white/70 capitalize truncate">{{ s.source }}</span>
                <span class="text-[11px] text-brand-white/50 shrink-0">{{ s.orders }} órd · {{ s.paid }} pag · {{ money(s.revenue) }}</span>
              </div>
              <div class="h-1.5 bg-brand-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500/60 rounded-full" :style="{ width: s.pct + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-6">Sin datos de atribución todavía.</p>
        </section>

        <!-- Piezas más consultadas por WhatsApp -->
        <section class="panel lg:col-span-2">
          <div class="flex items-baseline justify-between gap-3">
            <h2 class="panel-title flex items-center gap-2">
              <Icon icon="lucide:message-circle" class="w-3.5 h-3.5" /> Piezas más consultadas
              <span class="text-brand-white/30 font-normal normal-case tracking-normal">(botón WhatsApp)</span>
            </h2>
            <span class="text-[11px] text-brand-white/50 shrink-0">{{ inquiryStats.total }} consultas en total</span>
          </div>
          <div v-if="topInquiries.length" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 mt-6">
            <div v-for="p in topInquiries" :key="p.slug">
              <div class="flex justify-between items-baseline mb-1 gap-3">
                <span class="text-xs text-brand-white/70 truncate">{{ p.name }}</span>
                <span class="text-[11px] text-brand-white/50 shrink-0">{{ p.count }}</span>
              </div>
              <div class="h-1.5 bg-brand-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500/60 rounded-full" :style="{ width: p.pct + '%' }"></div>
              </div>
            </div>
          </div>
          <p v-else class="text-brand-white/30 text-xs mt-6">Aún no hay consultas registradas por WhatsApp.</p>
        </section>

      </div>

      <!-- Actividad reciente -->
      <section class="panel mt-4 md:mt-6">
        <h2 class="panel-title">Actividad reciente</h2>
        <div v-if="recentOrders.length" class="mt-4 divide-y divide-brand-white/5">
          <div v-for="o in recentOrders" :key="o.id" class="flex items-center justify-between py-3 gap-3">
            <div class="min-w-0">
              <p class="text-xs text-brand-white/80 truncate">{{ o.customerName || 'Cliente' }}
                <span class="text-brand-white/30">· {{ o.orderNumber }}</span></p>
              <p class="text-[10px] text-brand-white/40">{{ timeAgo(o.createdAt) }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xs text-brand-white/80">{{ money(o.totalAmount) }}</p>
              <p class="text-[10px] uppercase tracking-wide" :class="statusStyle(o.status)">{{ statusLabel(o.status) }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-brand-white/30 text-xs mt-4">Sin pedidos todavía.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/main.css";

.kpi {
  @apply bg-brand-white/[0.02] border border-brand-white/10 p-4 md:p-5;
}
.kpi-label {
  @apply text-[10px] text-brand-white/40 tracking-wide uppercase mb-2;
}
.kpi-value {
  @apply text-lg md:text-xl font-serif-elegant text-brand-white tracking-wide;
}
.kpi-sub {
  @apply text-[10px] text-brand-white/40 mt-1.5;
}
.panel {
  @apply bg-brand-white/[0.02] border border-brand-white/10 p-5 md:p-6;
}
.panel-title {
  @apply text-xs tracking-[0.2em] uppercase text-brand-gold font-bold;
}
</style>
