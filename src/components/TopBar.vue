<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useLocaleStore } from '@/stores/locale';

defineOptions({ name: 'TopBar' });

const L = useLocaleStore();

// Claves de mensaje (el texto se traduce según el idioma activo).
// Amor y Amistad va primero para que sea lo primero que vean.
const keys = ['topbar.love', 'topbar.shipping', 'topbar.worldwide', 'topbar.emeralds', 'topbar.advice', 'topbar.custom'];

const current = ref(0);
const isLove = computed(() => keys[current.value] === 'topbar.love');
let timer = null;

const next = () => {
  current.value = (current.value + 1) % keys.length;
};

onMounted(() => {
  timer = setInterval(next, 4500);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="bg-brand-primary border-b border-brand-black/10 topbar-wrap">

    <div class="relative h-8 flex items-center justify-center overflow-hidden px-4">

      <Transition name="slide-up" mode="out-in">
        <p :key="current"
           class="absolute inset-0 flex items-center justify-center gap-2.5
                  text-[11px] tracking-[0.18em] font-sans-luxury font-medium
                  topbar-text whitespace-nowrap">
          <Icon v-if="isLove" icon="lucide:heart" class="w-3 h-3 text-brand-gold" />
          <span v-else class="text-brand-gold opacity-70 text-[8px]">✦</span>
          {{ L.t(keys[current]) }}
          <Icon v-if="isLove" icon="lucide:heart" class="w-3 h-3 text-brand-gold" />
          <span v-else class="text-brand-gold opacity-70 text-[8px]">✦</span>
        </p>
      </Transition>

    </div>



  </div>
</template>

<style scoped>
@reference "../assets/main.css";

/* Texto siempre blanco sobre el fondo verde,
   sin importar la paleta global activa.        */
.topbar-wrap {
  color: var(--color-on-emerald);
}
.topbar-wrap :deep(*) {
  --color-brand-white: var(--color-on-emerald);
}

/* Animación: entra desde abajo, sale hacia arriba */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
