<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

// Base de preguntas expandibles para el look and feel de joyería
const faqs = ref([
  {
    q: '¿Cómo sé mi talla exacta de anillo?',
    a: 'Disponemos de una guía de tallas descargable en nuestra web. No obstante, al realizar la compra de un anillo de compromiso o pieza especial, nuestro equipo se contactará para guiarle. El primer ajuste de talla posterior a la entrega es totalmente gratuito.',
    open: true
  },
  {
    q: '¿Las esmeraldas empleadas son naturales?',
    a: 'Sí, el 100% de nuestras esmeraldas proceden de depósitos legítimos de Boyacá (Muzo, Chivor y Coscuez). No trabajamos con piedras sintéticas, imitaciones ni tratamientos de resinas pesadas que comprometan la durabilidad de la joya.',
    open: false
  },
  {
    q: '¿Tienen tienda física para ver las joyas?',
    a: 'Sí, puede visitarnos en el Emerald Trade Center (Avenida Jimenez 5-43, Local 216, Bogotá). Atendemos de Lunes a Viernes de 9:00 a.m. a 6:00 p.m. y Sábados de 9:00 a.m. a 5:00 p.m.',
    open: false
  },
  {
    q: '¿Cómo funciona el proceso de personalización?',
    a: 'Usted puede elegir la montura, el tipo de metal y la gema de su preferencia. Nos envía su idea por WhatsApp o correo electrónico, elaboramos un render técnico en 3D, y tras su aprobación, nuestros maestros artesanos forjan la pieza única.',
    open: false
  }
]);
</script>

<template>
  <div class="bg-brand-black min-h-screen py-16 lg:py-24 font-sans text-brand-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20 max-w-3xl">
      
      <header class="text-center mb-16">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">Asesoría Inmediata</span>
        <h1 class="text-3xl md:text-4xl font-serif-elegant tracking-wide mb-4">Preguntas Frecuentes</h1>
        <div class="h-[1px] w-20 bg-brand-gold mx-auto"></div>
      </header>

      <div class="space-y-4 font-sans-luxury">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="border border-brand-white/10 bg-brand-white/[0.01] p-6 transition-all"
        >
          <button 
            @click="faq.open = !faq.open"
            class="w-full flex justify-between items-center text-left text-sm md:text-base font-serif-elegant tracking-wider text-brand-white hover:text-brand-gold transition-colors"
          >
            <span>{{ faq.q }}</span>
            <Icon 
              :icon="faq.open ? 'lucide:minus' : 'lucide:plus'" 
              class="w-4 h-4 text-brand-gold transition-transform"
            />
          </button>
          
          <div v-if="faq.open" class="mt-4 text-xs md:text-sm text-brand-white/70 leading-relaxed pt-2 border-t border-brand-white/5">
            {{ faq.a }}
          </div>
        </div>
      </div>

      <div class="mt-16 text-center border-t border-brand-white/5 pt-12">
        <p class="text-xs text-brand-white/40 tracking-wide mb-4">¿Su duda no está en la lista?</p>
        <p class="text-sm mb-6">Escríbanos a nuestro correo oficial de atención global:</p>
        <a href="mailto:info@cushionjewelry.com" class="text-brand-gold hover:text-brand-white transition-colors underline font-sans-luxury text-sm">
          info@cushionjewelry.com
        </a>
      </div>

    </div>
  </div>
</template>