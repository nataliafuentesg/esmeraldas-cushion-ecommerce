<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Mensajes para el carrusel de promociones
const promoMessages = [
    'ENVÍO GRATIS en todas las órdenes.',
    'Nueva Colección "Eterna Belleza" disponible.',
    'Financiamiento disponible en 3 cuotas sin interés.',
]

// Lógica de carrusel (cambia cada 5 segundos)
const currentMessageIndex = ref(0)
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % promoMessages.length
  }, 5000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<template>
  <div class="bg-brand-primary text-brand-white text-center text-xs py-1.5 overflow-hidden relative 
              font-sans-luxury font-light border-b border-brand-black/10">
      
      <transition-group name="slide-up" tag="div" class="h-4 flex items-center justify-center">
          <span :key="currentMessageIndex" class="absolute transition-all duration-1000">
              {{ promoMessages[currentMessageIndex] }}
          </span>
      </transition-group>
  </div>
</template>

<style scoped>
/* Estilos para la animación sutil del carrusel */
.slide-up-enter-active, 
.slide-up-leave-active {
  transition: all 0.5s ease-in-out;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>