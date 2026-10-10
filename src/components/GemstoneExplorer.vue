<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import { useLocaleStore } from '@/stores/locale';
import { GEMSTONES, matchesGemstone } from '@/utils/gemstones';
import { cloudinaryOptimize } from '@/utils/cloudinary';

const router = useRouter();
const store = useProductsStore();
const L = useLocaleStore();

onMounted(() => store.fetchProducts());

const mainImage = (p) => {
  if (!p || !p.images || !p.images.length) return null;
  const thumb = p.images.find((i) => i.isThumbnail);
  return thumb ? thumb.imageUrl : p.images[0].imageUrl;
};

// Para cada piedra, elige una pieza representativa (en stock y con foto) para la portada.
const panels = computed(() =>
  GEMSTONES.map((g) => {
    const withImg = store.products.filter((p) => matchesGemstone(p, g.id) && mainImage(p));
    const pick = withImg.find((p) => p.stock > 0) || withImg[0] || null;
    // Prioriza la foto de stock de la gema; si no hay, usa una pieza real de respaldo.
    const src = g.image || (pick ? mainImage(pick) : null);
    return {
      ...g,
      count: store.products.filter((p) => p.stock > 0 && matchesGemstone(p, g.id)).length,
      image: src ? cloudinaryOptimize(src, { width: 900 }) : null,
    };
  })
);

// Acordeón: el panel activo se agranda; arranca en el primero (Esmeralda).
const active = ref(0);

const go = (id) => router.push({ path: '/coleccion', query: { piedra: id } });
</script>

<template>
  <section class="bg-brand-black py-16 md:py-24 border-t border-brand-white/5">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <header class="text-center mb-10 md:mb-12">
        <p class="text-brand-gold text-[10px] tracking-[0.5em] font-bold mb-3 uppercase">{{ L.t('gem.exploreEyebrow') }}</p>
        <h2 class="text-3xl md:text-5xl text-brand-white font-serif-elegant tracking-wide">{{ L.t('gem.exploreTitle') }}</h2>
        <div class="h-px w-16 bg-brand-gold mx-auto mt-5"></div>
        <p class="text-brand-white/50 font-sans-luxury text-sm mt-4 max-w-md mx-auto">{{ L.t('gem.exploreSub') }}</p>
      </header>

      <!-- ─── Acordeón horizontal (escritorio/tablet) ─── -->
      <div class="hidden md:flex gap-2 h-[460px] rounded-2xl overflow-hidden">
        <button
          v-for="(g, i) in panels"
          :key="g.id"
          @mouseenter="active = i"
          @focus="active = i"
          @click="go(g.id)"
          class="gem-panel relative overflow-hidden group"
          :style="{ flex: active === i ? '5 1 0%' : '1 1 0%' }"
          :aria-label="L.t(g.key)"
        >
          <!-- Foto -->
          <img v-if="g.image" :src="g.image" :alt="L.t(g.key)"
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out"
               :class="active === i ? 'scale-105' : 'scale-100'" />
          <div v-else class="absolute inset-0" :style="{ backgroundColor: g.color }"></div>

          <!-- Velo: solo oscurece abajo para el texto; la gema se ve vívida arriba -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"></div>

          <!-- Contenido -->
          <div class="absolute inset-0 flex items-end justify-center p-6">
            <!-- Colapsado: nombre vertical -->
            <span v-show="active !== i"
                  class="[writing-mode:vertical-rl] rotate-180 text-white font-serif-elegant text-xl tracking-[0.2em] whitespace-nowrap pb-2 [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
              {{ L.t(g.key) }}
            </span>
            <!-- Expandido: nombre + CTA -->
            <div v-show="active === i" class="text-center transition-all duration-500">
              <h3 class="text-white font-serif-elegant text-3xl tracking-wide mb-2 [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">{{ L.t(g.key) }}</h3>
              <span class="inline-flex items-center gap-1.5 text-brand-gold text-[10px] font-bold tracking-[0.3em] uppercase">
                {{ L.t('gem.view') }}
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></svg>
              </span>
            </div>
          </div>

          <!-- Marco dorado del activo -->
          <div class="absolute inset-0 border-2 transition-colors duration-500 pointer-events-none"
               :class="active === i ? 'border-brand-gold/40' : 'border-transparent'"></div>
        </button>
      </div>

      <!-- ─── Móvil: pila de banners ─── -->
      <div class="md:hidden space-y-3">
        <button
          v-for="g in panels"
          :key="g.id"
          @click="go(g.id)"
          class="relative w-full h-28 rounded-xl overflow-hidden block"
          :aria-label="L.t(g.key)"
        >
          <img v-if="g.image" :src="g.image" :alt="L.t(g.key)" class="absolute inset-0 w-full h-full object-cover" />
          <div v-else class="absolute inset-0" :style="{ backgroundColor: g.color }"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/10"></div>
          <div class="absolute inset-0 flex items-center justify-between px-6">
            <h3 class="text-white font-serif-elegant text-2xl tracking-wide [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">{{ L.t(g.key) }}</h3>
            <span class="inline-flex items-center gap-1.5 text-brand-gold text-[9px] font-bold tracking-[0.3em] uppercase">
              {{ L.t('gem.view') }}
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></svg>
            </span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gem-panel {
  transition: flex 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 0;
  cursor: pointer;
}
</style>
