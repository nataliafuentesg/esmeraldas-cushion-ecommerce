<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useLocaleStore } from '@/stores/locale';

const L = useLocaleStore();
const STORAGE_KEY = 'cushion_cookie_consent';
const visible = ref(false);

onMounted(() => {
  // Si aún no eligió, mostramos el aviso. Envuelto en try/catch por si el
  // navegador bloquea localStorage (modo incógnito estricto, etc.).
  try {
    if (!localStorage.getItem(STORAGE_KEY)) visible.value = true;
  } catch (e) {
    visible.value = true;
  }
});

const choose = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch (e) { /* si no se puede guardar, igual cerramos el aviso */ }
  visible.value = false;
};
</script>

<template>
  <transition name="cookie-slide">
    <div
      v-if="visible"
      class="fixed bottom-0 inset-x-0 z-[60] p-4 sm:p-5"
      role="region"
      aria-label="Aviso de cookies"
    >
      <div class="max-w-4xl mx-auto bg-brand-white/90 backdrop-blur-xl border border-brand-black/10 rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">

        <div class="flex-1">
          <p class="text-brand-black text-sm font-sans-luxury leading-relaxed">
            {{ L.t('cookies.bannerText') }}
            <RouterLink to="/cookies" class="text-brand-gold underline underline-offset-2 hover:opacity-80 whitespace-nowrap">
              {{ L.t('cookies.bannerLink') }}
            </RouterLink>
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button
            @click="choose('rejected')"
            class="px-5 py-2.5 border border-brand-black/25 text-brand-black/70 text-[10px] font-bold font-sans-luxury tracking-[0.2em] uppercase rounded-full hover:border-brand-black/50 transition-colors duration-300">
            {{ L.t('cookies.reject') }}
          </button>
          <button
            @click="choose('accepted')"
            class="px-6 py-2.5 bg-brand-primary text-brand-black text-[10px] font-bold font-sans-luxury tracking-[0.2em] uppercase rounded-full hover:opacity-90 transition-opacity duration-300">
            {{ L.t('cookies.accept') }}
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
}
.cookie-slide-enter-from,
.cookie-slide-leave-to {
  transform: translateY(120%);
  opacity: 0;
}
</style>
