<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

defineOptions({ name: 'TopBar' });

const messages = [
  { icon: '✦', text: 'Envío gratis a nivel nacional' },
  { icon: '✦', text: 'Esmeraldas 100% colombianas' },
  { icon: '✦', text: 'Asesoría personalizada sin costo' },
  { icon: '✦', text: 'Diseño a la medida de tu historia' },
];

const current = ref(0);
let timer = null;

const next = () => {
  current.value = (current.value + 1) % messages.length;
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

    <div class="relative h-7 flex items-center justify-center overflow-hidden px-4">

      <Transition name="slide-up" mode="out-in">
        <p :key="current"
           class="absolute inset-0 flex items-center justify-center gap-2
                  text-[10px] tracking-[0.28em] font-sans-luxury font-light
                  topbar-text whitespace-nowrap">
          <span class="text-brand-gold opacity-70 text-[8px]">{{ messages[current].icon }}</span>
          {{ messages[current].text }}
          <span class="text-brand-gold opacity-70 text-[8px]">{{ messages[current].icon }}</span>
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
