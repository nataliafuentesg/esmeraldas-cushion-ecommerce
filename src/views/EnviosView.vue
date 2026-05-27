<script setup>
import { Icon } from '@iconify/vue';
</script>

<template>
  <div class="bg-brand-black min-h-screen py-16 lg:py-24 font-sans text-brand-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20 max-w-4xl">
      
      <header class="text-center mb-16">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">Logística de Seguridad</span>
        <h1 class="text-3xl md:text-4xl font-serif-elegant tracking-wide mb-4">Política de Envíos</h1>
        <div class="h-[1px] w-20 bg-brand-gold mx-auto"></div>
      </header>

      <div class="space-y-12 font-sans-luxury text-sm leading-relaxed text-brand-white/80">
        
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-center gap-4 mb-6">
            <Icon icon="lucide:truck" class="text-brand-gold w-6 h-6" />
            <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white">Envíos Nacionales (Colombia)</h2>
          </div>
          <p class="mb-4">
            Todos nuestros envíos dentro del territorio nacional son **completamente gratuitos** y se realizan mediante transportadoras especializadas en valores con blindaje y monitoreo constante.
          </p>
          <ul class="list-disc pl-5 space-y-2 text-brand-white/70">
            <li><strong>Empaque Discreto:</strong> Las joyas viajan en cajas de seguridad externas sin logotipos visibles para garantizar la máxima confidencialidad.</li>
            <li><strong>Firma Obligatoria:</strong> Ningún paquete será entregado a menores de edad o dejado en porterías sin autorización expresa por escrito del comprador.</li>
          </ul>
        </section>

        <section class="border-2 border-brand-gold/30 bg-brand-gold/[0.02] p-8 md:p-10">
          <div class="flex items-center gap-4 mb-6">
            <Icon icon="lucide:globe" class="text-brand-gold w-6 h-6" />
            <h2 class="text-xl font-serif-elegant tracking-wider text-brand-gold">Envíos Internacionales</h2>
          </div>
          <p class="mb-6">
            Realizamos entregas globales aseguradas a través de aliados internacionales de alta seguridad (como DHL Express / FedEx Priority). Debido a las regulaciones aduaneras de exportación de piedras preciosas y metales desde Colombia, las tarifas y tiempos varían según el país de destino.
          </p>
          <div class="bg-brand-black border border-brand-white/10 p-6 text-center">
            <p class="text-brand-white font-medium mb-4 tracking-wider text-xs">
              ¿Desea coordinar una entrega fuera de Colombia?
            </p>
            <p class="text-xs text-brand-white/60 mb-6">
              Contáctenos directamente para cotizar la logística de seguridad, seguros internacionales y tiempos estimados de nacionalización.
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a href="mailto:info@cushionjewelry.com" class="flex items-center gap-2 text-xs tracking-wide text-brand-gold hover:text-brand-white transition-colors">
                <Icon icon="lucide:mail" class="w-4 h-4" /> info@cushionjewelry.com
              </a>
              <a href="https://wa.me/573136133822" target="_blank" class="flex items-center gap-2 text-xs tracking-wide text-brand-gold hover:text-brand-white transition-colors">
                <Icon icon="lucide:message-circle" class="w-4 h-4" /> Concierge WhatsApp
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>