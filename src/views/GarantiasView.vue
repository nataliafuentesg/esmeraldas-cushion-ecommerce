<script setup>
import { Icon } from '@iconify/vue';
</script>

<template>
  <div class="bg-brand-black min-h-screen py-16 lg:py-24 font-sans text-brand-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20 max-w-4xl">
      
      <header class="text-center mb-16">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] uppercase font-bold block mb-3">Autenticidad y Respaldo</span>
        <h1 class="text-3xl md:text-4xl font-serif-elegant uppercase tracking-wide mb-4">Garantías y Certificados</h1>
        <div class="h-[1px] w-20 bg-brand-gold mx-auto"></div>
      </header>

      <div class="space-y-12 font-sans-luxury text-sm leading-relaxed text-brand-white/80">
        
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-center gap-4 mb-6">
            <Icon icon="lucide:gem" class="text-brand-gold w-6 h-6" />
            <h2 class="text-xl font-serif-elegant uppercase tracking-wider text-brand-white">Certificación de Gemas</h2>
          </div>
          <p class="mb-4">
            Cada esmeralda y diamante incorporado en nuestras piezas de alta joyería cuenta con un certificado de autenticidad detallado que especifica su origen, peso en quilates, tipo de talla y pureza.
          </p>
          <p>
            Trabajamos respaldados por los laboratorios gemológicos más prestigiosos del país y certificaciones internacionales **GIA** para diamantes seleccionados, garantizando una extracción ética y legítima.
          </p>
        </section>

        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-center gap-4 mb-6">
            <Icon icon="lucide:shield-check" class="text-brand-gold w-6 h-6" />
            <h2 class="text-xl font-serif-elegant uppercase tracking-wider text-brand-white">Garantía de Por Vida sobre Metales</h2>
          </div>
          <p class="mb-4">
            Garantizamos de por vida la pureza y autenticidad del metal precioso empleado en su joya (Oro de 18 Quilates Ley 750 o Platino 950). 
          </p>
          <p>
            *Nota: Esta garantía cubre cualquier defecto de fabricación en la estructura de la pieza, pero no cubre daños causados por desgaste natural, mal uso o modificaciones realizadas por talleres externos a Cushion.*
          </p>
        </section>

        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10 text-center">
          <h3 class="text-lg font-serif-elegant uppercase text-brand-gold mb-3">¿Dudas sobre una pieza o certificación?</h3>
          <p class="mb-6 max-w-xl mx-auto text-xs">
            Nuestro equipo técnico está a su disposición para validar historiales de gemas o agendar mantenimientos preventivos.
          </p>
          <a href="mailto:info@cushionjewelry.com" class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-white border-b border-brand-gold pb-1 hover:text-brand-gold transition-colors">
            <Icon icon="lucide:mail" class="w-4 h-4" /> info@cushionjewelry.com
          </a>
        </section>

      </div>
    </div>
  </div>
</template>