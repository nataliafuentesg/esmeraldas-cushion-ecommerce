<script setup>
import { Icon } from '@iconify/vue';

const WA_NUMBER = '573136133822';
const CORREO    = 'info@cushionjewelry.com';
const waLink    = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola Cushion 💎 Tengo una consulta sobre el envío de mi pedido.')}`;
</script>

<template>
  <div class="bg-brand-black min-h-screen py-16 lg:py-24 font-sans text-brand-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20 max-w-4xl">

      <!-- Encabezado -->
      <header class="text-center mb-16">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">Logística de Seguridad</span>
        <h1 class="text-3xl md:text-4xl font-serif-elegant tracking-wide mb-4">Política de Envíos</h1>
        <div class="h-[1px] w-20 bg-brand-gold mx-auto mb-6"></div>
        <p class="text-brand-white/60 font-sans-luxury text-sm max-w-xl mx-auto leading-relaxed italic">
          "El lujo y la delicadeza de nuestras piezas exigen un transporte impecable."
        </p>
      </header>

      <div class="space-y-8 font-sans-luxury text-sm leading-relaxed text-brand-white/80">

        <!-- Cobertura y tiempos -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-6">
            <Icon icon="lucide:clock" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">Cobertura y Tiempos de Entrega</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">A nivel nacional e internacional</p>
            </div>
          </div>
          <p class="mb-6 text-brand-white/70">
            Realizamos envíos asegurados a nivel <strong class="text-brand-white">nacional e internacional</strong>.
            Los tiempos estimados de entrega son los siguientes, contados desde la confirmación de la compra
            y sujetos a la disponibilidad de la pieza y el destino:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="border border-brand-white/10 p-6 text-center">
              <Icon icon="lucide:map-pin" class="text-brand-gold w-7 h-7 mx-auto mb-3" />
              <p class="text-brand-gold text-[10px] tracking-[0.3em] mb-1 font-bold">NACIONAL</p>
              <p class="text-2xl font-serif-elegant text-brand-white mb-1">2 días hábiles</p>
              <p class="text-brand-white/40 text-[11px]">Colombia · Envío asegurado</p>
            </div>
            <div class="border border-brand-gold/30 bg-brand-gold/[0.02] p-6 text-center">
              <Icon icon="lucide:globe" class="text-brand-gold w-7 h-7 mx-auto mb-3" />
              <p class="text-brand-gold text-[10px] tracking-[0.3em] mb-1 font-bold">INTERNACIONAL</p>
              <p class="text-2xl font-serif-elegant text-brand-white mb-1">5 días hábiles</p>
              <p class="text-brand-white/40 text-[11px]">Consultar destino y aduanas</p>
            </div>
          </div>
        </section>

        <!-- Seguridad y embalaje -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-6">
            <Icon icon="lucide:package" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">Seguridad y Embalaje</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Discreción garantizada</p>
            </div>
          </div>
          <p>
            Todas las piezas son enviadas en <strong class="text-brand-white">estuches de seguridad sellados</strong> y
            protegidas con embalaje discreto para garantizar su integridad y privacidad durante el trayecto.
            El exterior del paquete no lleva logotipos ni referencias visibles al contenido.
          </p>
        </section>

        <!-- Seguro de envío -->
        <section class="border-2 border-brand-gold/30 bg-brand-gold/[0.02] p-8 md:p-10">
          <div class="flex items-start gap-4 mb-6">
            <Icon icon="lucide:shield-check" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-gold mb-1">Seguro de Envío</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Cobertura total</p>
            </div>
          </div>
          <p>
            Cada envío cuenta con un <strong class="text-brand-white">seguro de cobertura total</strong> contra pérdida o daño.
            Si tu joya presenta algún inconveniente durante el transporte,
            <strong class="text-brand-white">nosotros asumimos la responsabilidad total</strong> y gestionamos
            el reenvío o reposición de la pieza sin costo adicional para ti.
          </p>
        </section>

        <!-- Seguimiento -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-6">
            <Icon icon="lucide:scan-line" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">Seguimiento en Tiempo Real</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Monitoreo de tu pedido</p>
            </div>
          </div>
          <p>
            Una vez despachada tu joya, recibirás un <strong class="text-brand-white">número de guía</strong> para
            monitorear el estado de tu pedido en tiempo real a través del portal de la transportadora asignada.
          </p>
        </section>

        <!-- Contacto -->
        <section class="bg-brand-white/[0.02] border border-brand-white/10 p-8 md:p-10 text-center">
          <h3 class="text-lg font-serif-elegant text-brand-white mb-2">¿Preguntas sobre tu envío?</h3>
          <p class="text-brand-white/50 text-xs mb-8 max-w-md mx-auto">
            Contáctanos directamente para hacer seguimiento o resolver cualquier inquietud sobre la entrega de tu joya.
          </p>
          <div class="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
            <a :href="waLink" target="_blank"
               class="inline-flex items-center gap-2 px-6 py-3 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 text-xs tracking-wide transition-all duration-300">
              <Icon icon="simple-icons:whatsapp" class="w-4 h-4" />
              WhatsApp: +57 313 613 3822
            </a>
            <a :href="`mailto:${CORREO}`"
               class="inline-flex items-center gap-2 px-6 py-3 border border-brand-white/20 text-brand-white/60 hover:text-brand-gold hover:border-brand-gold/40 text-xs tracking-wide transition-all duration-300">
              <Icon icon="lucide:mail" class="w-4 h-4" />
              {{ CORREO }}
            </a>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>
