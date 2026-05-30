<script setup>
import { Icon } from '@iconify/vue';

const WA_NUMBER = '573136133822';
const CORREO    = 'info@cushionjewelry.com';
const waLink    = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola Cushion 💎 Tengo una consulta sobre la garantía de mi joya.')}`;
</script>

<template>
  <div class="bg-brand-black min-h-screen py-16 lg:py-24 font-sans text-brand-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20 max-w-4xl">

      <!-- Encabezado -->
      <header class="text-center mb-16">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">Autenticidad y Respaldo</span>
        <h1 class="text-3xl md:text-4xl font-serif-elegant tracking-wide mb-4">Política de Garantía</h1>
        <div class="h-[1px] w-20 bg-brand-gold mx-auto mb-6"></div>
        <p class="text-brand-white/60 font-sans-luxury text-sm max-w-xl mx-auto leading-relaxed italic">
          "Certificamos la excelencia de nuestra minería y orfebrería."
        </p>
      </header>

      <div class="space-y-8 font-sans-luxury text-sm leading-relaxed text-brand-white/80">

        <!-- Autenticidad de por vida -->
        <section class="border-2 border-brand-gold/30 bg-brand-gold/[0.02] p-8 md:p-10">
          <div class="flex items-start gap-4 mb-6">
            <Icon icon="lucide:gem" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-gold mb-1">Autenticidad de por Vida</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Garantía vitalicia</p>
            </div>
          </div>
          <p class="mb-4">
            Garantizamos de por vida la autenticidad de nuestro <strong class="text-brand-white">Oro de 18 kilates</strong> y
            la procedencia de nuestras <strong class="text-brand-white">Esmeraldas Naturales Colombianas</strong> o piedra preciosa
            que incluya tu joya.
          </p>
          <p class="text-brand-white/60 text-xs">
            Cada pieza de alto valor incluye su <strong class="text-brand-white">certificado de autenticidad</strong> detallando
            las características de la gema: origen, peso en quilates, tipo de talla y pureza.
          </p>
        </section>

        <!-- Garantía de fabricación -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-6">
            <Icon icon="lucide:shield-check" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">Garantía de Fabricación</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">12 meses por defectos de fábrica</p>
            </div>
          </div>
          <p class="mb-6">
            Todas nuestras joyas cuentan con una garantía de <strong class="text-brand-white">12 meses</strong> por defectos de fábrica,
            que incluye: desprendimiento de gemas, fallas en cierres o soldaduras.
          </p>

          <!-- Qué cubre y qué no -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div class="border border-brand-white/10 p-5">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:check-circle" class="text-[#25D366] w-4 h-4" />
                <span class="text-brand-white text-xs font-bold tracking-wide">Sí cubre</span>
              </div>
              <ul class="space-y-2 text-brand-white/60 text-xs">
                <li class="flex items-start gap-2">
                  <span class="text-[#25D366] mt-0.5">·</span>
                  Fallos en la estructura de la joya
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-[#25D366] mt-0.5">·</span>
                  Desprendimiento de gemas por fábrica
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-[#25D366] mt-0.5">·</span>
                  Fallas en cierres o soldaduras
                </li>
              </ul>
            </div>
            <div class="border border-brand-white/10 p-5">
              <div class="flex items-center gap-2 mb-3">
                <Icon icon="lucide:x-circle" class="text-brand-white/30 w-4 h-4" />
                <span class="text-brand-white/60 text-xs font-bold tracking-wide">No cubre</span>
              </div>
              <ul class="space-y-2 text-brand-white/50 text-xs">
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">·</span>
                  Daños por uso indebido o golpes
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">·</span>
                  Contacto con químicos abrasivos
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">·</span>
                  Desgaste natural del oro
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-0.5">·</span>
                  Intervenciones de joyerías externas
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Mantenimiento -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-6">
            <Icon icon="lucide:sparkles" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">Mantenimiento y Beneficios</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Incluido con tu compra</p>
            </div>
          </div>
          <p class="mb-6">
            Recomendamos una <strong class="text-brand-white">limpieza profesional anual</strong> con nosotros para mantener
            el brillo original del oro y verificar la seguridad del engaste de tus esmeraldas.
          </p>
          <div class="space-y-3">
            <div class="flex items-center gap-3 border border-brand-gold/20 bg-brand-gold/[0.03] p-4">
              <Icon icon="lucide:gift" class="text-brand-gold w-5 h-5 shrink-0" />
              <p class="text-sm">
                <strong class="text-brand-white">3 mantenimientos sin costo adicional</strong>
                <span class="text-brand-white/50"> incluidos con tu compra.</span>
              </p>
            </div>
            <div class="flex items-center gap-3 border border-brand-gold/20 bg-brand-gold/[0.03] p-4">
              <Icon icon="lucide:ruler" class="text-brand-gold w-5 h-5 shrink-0" />
              <p class="text-sm">
                <strong class="text-brand-white">Primera puesta a medida gratuita</strong>
                <span class="text-brand-white/50"> — ajuste de talla de anillo sin costo.</span>
              </p>
            </div>
          </div>
        </section>

        <!-- Nota sobre inclusiones -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-6 md:p-8">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:info" class="text-brand-gold/70 w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h3 class="text-sm font-serif-elegant text-brand-white mb-2">Sobre las Inclusiones Naturales</h3>
              <p class="text-brand-white/50 text-xs leading-relaxed">
                La presencia de inclusiones naturales (jardín) en las esmeraldas es prueba de su
                <strong class="text-brand-white/70">autenticidad</strong> y origen colombiano.
                No se considera un defecto ni es causa válida para activar la garantía de fabricación.
              </p>
            </div>
          </div>
        </section>

        <!-- Contacto -->
        <section class="bg-brand-white/[0.02] border border-brand-white/10 p-8 md:p-10 text-center">
          <h3 class="text-lg font-serif-elegant text-brand-white mb-2">¿Quieres activar tu garantía?</h3>
          <p class="text-brand-white/50 text-xs mb-8 max-w-md mx-auto">
            Contáctanos para gestionar cualquier solicitud de garantía, mantenimiento o consulta sobre la autenticidad de tu pieza.
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
