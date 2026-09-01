<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useLocaleStore } from '@/stores/locale';

const router = useRouter();
const L = useLocaleStore();

const open = ref(false);
const view = ref('menu'); // 'menu' | 'location'
const q = ref('');

const WA = '573136133822';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Emerald+Trade+Center+Avenida+Jimenez+Bogota';

const waGeneral = computed(() =>
  `https://wa.me/${WA}?text=${encodeURIComponent('Hola Cushion 💚 quiero más información sobre sus joyas y esmeraldas.')}`
);
const waCustom = computed(() =>
  `https://wa.me/${WA}?text=${encodeURIComponent('Hola Cushion 💚 quiero diseñar una joya a mi medida. ¿Me asesoran?')}`
);

const toggle = () => { open.value = !open.value; if (!open.value) view.value = 'menu'; };

const doSearch = () => {
  const term = q.value.trim();
  if (!term) return;
  open.value = false;
  view.value = 'menu';
  q.value = '';
  router.push({ path: '/buscar', query: { q: term } });
};
</script>

<template>
  <!-- Solo escritorio -->
  <div class="hidden md:block">
    <!-- Panel -->
    <transition name="cc-pop">
      <div v-if="open"
        class="fixed bottom-24 right-6 z-[60] w-80 bg-brand-black border border-brand-gold/25 shadow-2xl overflow-hidden">

        <!-- Cabecera -->
        <div class="bg-brand-primary px-5 py-4 flex items-center gap-3 border-b border-brand-gold/40">
          <span class="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 shrink-0">
            <Icon icon="lucide:gem" class="w-4 h-4 text-white" />
          </span>
          <div>
            <p class="text-white font-serif-elegant text-sm tracking-wide leading-none">{{ L.t('cc.title') }}</p>
            <p class="text-white/70 text-[10px] tracking-wide mt-1">{{ L.t('cc.subtitle') }}</p>
          </div>
        </div>

        <!-- MENÚ -->
        <div v-if="view === 'menu'" class="p-3 space-y-1.5">
          <button @click="view = 'location'" class="cc-item">
            <Icon icon="lucide:map-pin" class="cc-ico" /> {{ L.t('cc.location') }}
            <Icon icon="lucide:chevron-right" class="w-3.5 h-3.5 text-brand-white/20 ml-auto" />
          </button>

          <a :href="waCustom" target="_blank" rel="noopener" class="cc-item">
            <Icon icon="lucide:sparkles" class="cc-ico" /> {{ L.t('cc.custom') }}
          </a>

          <!-- Buscar pieza -->
          <div class="px-3 pt-2 pb-1">
            <div class="flex items-center border border-brand-white/15 focus-within:border-brand-gold transition-colors">
              <input v-model="q" @keydown.enter="doSearch" type="text"
                :placeholder="L.t('cc.searchPlaceholder')"
                class="w-full bg-transparent text-brand-white text-xs px-3 py-2.5 focus:outline-none placeholder:text-brand-white/25" />
              <button @click="doSearch" class="px-3 text-brand-gold hover:text-brand-white transition-colors">
                <Icon icon="lucide:search" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <a :href="waGeneral" target="_blank" rel="noopener"
            class="mt-1 flex items-center justify-center gap-2 bg-brand-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] py-3 hover:brightness-95 transition">
            <Icon icon="simple-icons:whatsapp" class="w-4 h-4" /> {{ L.t('cc.whatsapp') }}
          </a>
        </div>

        <!-- UBICACIÓN + HORARIOS -->
        <div v-else class="p-5 space-y-4">
          <button @click="view = 'menu'" class="text-brand-white/40 hover:text-brand-gold text-[10px] tracking-wide flex items-center gap-1.5 transition-colors">
            <Icon icon="lucide:arrow-left" class="w-3 h-3" /> {{ L.t('cc.back') }}
          </button>
          <div class="flex items-start gap-3">
            <Icon icon="lucide:map-pin" class="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
            <p class="text-brand-white/80 text-xs font-sans-luxury leading-relaxed">{{ L.t('cc.address') }}</p>
          </div>
          <div class="flex items-start gap-3">
            <Icon icon="lucide:clock" class="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
            <div>
              <p class="text-brand-gold text-[9px] tracking-[0.3em] mb-1">{{ L.t('cc.hoursTitle') }}</p>
              <p class="text-brand-white/80 text-xs font-sans-luxury leading-relaxed">{{ L.t('cc.hours') }}</p>
            </div>
          </div>
          <a :href="MAPS" target="_blank" rel="noopener"
            class="inline-flex items-center gap-2 border border-brand-gold text-brand-gold text-[10px] font-bold tracking-[0.2em] px-5 py-2.5 hover:bg-brand-gold hover:text-brand-black transition-colors">
            <Icon icon="lucide:navigation" class="w-3.5 h-3.5" /> {{ L.t('cc.directions') }}
          </a>
        </div>
      </div>
    </transition>

    <!-- Botón flotante -->
    <button @click="toggle" aria-label="Asesoría"
      class="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-brand-primary text-white
             flex items-center justify-center shadow-2xl border border-brand-gold/40
             hover:scale-105 active:scale-95 transition-transform">
      <Icon :icon="open ? 'lucide:x' : 'lucide:message-circle'" class="w-6 h-6" />
    </button>
  </div>
</template>

<style scoped>
@reference "../assets/main.css";

.cc-item {
  @apply w-full flex items-center gap-3 px-3 py-3 text-brand-white/80 text-xs font-sans-luxury
         hover:bg-brand-white/[0.04] hover:text-brand-white transition-colors text-left tracking-wide;
}
.cc-ico {
  @apply w-4 h-4 text-brand-gold shrink-0;
}
.cc-pop-enter-active, .cc-pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.cc-pop-enter-from, .cc-pop-leave-to { opacity: 0; transform: translateY(10px) scale(0.98); }
</style>
