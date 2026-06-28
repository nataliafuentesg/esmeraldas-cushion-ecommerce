<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const store = {
  name: 'Emerald Trade Center',
  address: 'Avenida Jiménez 5-43, Local 216',
  city: 'Bogotá, Colombia',
  phone: '+57 313 613 3822',
  hours: [
    { d: 'Lunes a Viernes', h: '9:00 a.m. – 6:00 p.m.' },
    { d: 'Sábado', h: '9:00 a.m. – 5:00 p.m.' },
    { d: 'Domingo', h: 'Cerrado' },
  ],
};

// Fotos profesionales del local (en public/images/tienda)
const photos = [
  '/images/tienda/DSC08956-HDR.JPG',
  '/images/tienda/DSC09036-HDR.JPG',
  '/images/tienda/DSC09133-HDR.JPG',
  '/images/tienda/DSC09176-HDR.JPG',
  '/images/tienda/DSC09240-HDR.JPG',
  '/images/tienda/DSC09320-HDR.JPG',
];
const activePhoto = ref(photos[0]);

const mapsLink = 'https://www.google.com/maps/search/?api=1&query=Emerald+Trade+Center+Avenida+Jimenez+Bogota';
</script>

<template>
  <section class="bg-brand-black border-t border-brand-white/5 py-16 md:py-24">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20">

      <div class="text-center mb-12">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">Visítanos</span>
        <h2 class="text-3xl md:text-4xl font-serif-elegant text-brand-white tracking-wide mb-4">Nuestra Tienda Física</h2>
        <p class="text-brand-white/50 font-sans-luxury text-sm max-w-xl mx-auto leading-relaxed">
          No somos solo una tienda en línea. Te esperamos en nuestro espacio en el corazón joyero de Bogotá,
          con asesoría personalizada y nuestras piezas para que las veas de cerca.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

        <!-- Galería de fotos del local -->
        <div class="flex flex-col gap-3">
          <div class="border border-brand-white/10 overflow-hidden aspect-[4/3]">
            <img :src="activePhoto" alt="Tienda Cushion — Emerald Trade Center"
              class="w-full h-full object-cover transition-opacity duration-300" loading="lazy">
          </div>
          <div class="grid grid-cols-6 gap-2">
            <button v-for="p in photos" :key="p" @click="activePhoto = p"
              class="border overflow-hidden aspect-square transition-all duration-200"
              :class="activePhoto === p ? 'border-brand-gold' : 'border-brand-white/10 opacity-60 hover:opacity-100'">
              <img :src="p" alt="" class="w-full h-full object-cover" loading="lazy">
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="bg-brand-white/[0.02] border border-brand-white/10 p-8 md:p-10 flex flex-col justify-center">
          <div class="flex items-start gap-4 mb-7">
            <Icon icon="lucide:map-pin" class="w-6 h-6 text-brand-gold mt-1 shrink-0" />
            <div>
              <p class="text-brand-white font-serif-elegant text-lg tracking-wide mb-1">{{ store.name }}</p>
              <p class="text-brand-white/70 text-sm font-sans-luxury">{{ store.address }}</p>
              <p class="text-brand-white/70 text-sm font-sans-luxury">{{ store.city }}</p>
            </div>
          </div>

          <div class="flex items-start gap-4 mb-7">
            <Icon icon="lucide:clock" class="w-6 h-6 text-brand-gold mt-1 shrink-0" />
            <div class="flex-1">
              <p class="text-brand-gold text-[10px] tracking-[0.3em] mb-2">HORARIOS</p>
              <div v-for="h in store.hours" :key="h.d" class="flex justify-between text-sm font-sans-luxury py-0.5">
                <span class="text-brand-white/70">{{ h.d }}</span>
                <span :class="h.h === 'Cerrado' ? 'text-brand-white/30' : 'text-brand-white/80'">{{ h.h }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 mb-8">
            <Icon icon="lucide:phone" class="w-6 h-6 text-brand-gold shrink-0" />
            <a :href="`tel:${store.phone.replace(/\s/g,'')}`" class="text-brand-white/80 hover:text-brand-gold text-sm font-sans-luxury transition-colors">{{ store.phone }}</a>
          </div>

          <a :href="mapsLink" target="_blank" rel="noopener"
            class="inline-flex items-center justify-center gap-2.5 bg-brand-gold text-brand-black px-8 py-4 text-[10px] font-bold tracking-[0.25em] hover:bg-brand-white transition-colors duration-300">
            <Icon icon="lucide:navigation" class="w-4 h-4" />
            CÓMO LLEGAR
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
