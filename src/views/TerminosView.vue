<script setup>
import { Icon } from '@iconify/vue';

const WA_NUMBER = '573136133822';
const CORREO    = 'info@cushionjewelry.com';
const waLink    = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola Cushion 💎 Quiero radicar una solicitud de cambio o devolución.')}`;
</script>

<template>
  <div class="bg-brand-black min-h-screen py-16 lg:py-24 font-sans text-brand-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20 max-w-4xl">

      <!-- Encabezado -->
      <header class="text-center mb-16">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">Marco Legal</span>
        <h1 class="text-3xl md:text-4xl font-serif-elegant tracking-wide mb-4">Términos, Condiciones<br class="hidden md:block" /> y Política de Cambios</h1>
        <div class="h-[1px] w-20 bg-brand-gold mx-auto mb-6"></div>
        <p class="text-brand-white/60 font-sans-luxury text-sm max-w-xl mx-auto leading-relaxed italic">
          "Tu satisfacción es nuestra prioridad absoluta."
        </p>
      </header>

      <!-- ── SECCIÓN PRINCIPAL: Cambios y Devoluciones ── -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="h-[1px] flex-1 bg-brand-gold/20"></div>
          <span class="text-brand-gold text-[10px] tracking-[0.4em] font-bold">POLÍTICA DE CAMBIOS Y DEVOLUCIONES</span>
          <div class="h-[1px] flex-1 bg-brand-gold/20"></div>
        </div>

        <div class="space-y-8 font-sans-luxury text-sm leading-relaxed text-brand-white/80">

          <!-- Derecho de retracto -->
          <section class="border-2 border-brand-gold/30 bg-brand-gold/[0.02] p-8 md:p-10">
            <div class="flex items-start gap-4 mb-6">
              <Icon icon="lucide:calendar-check" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
              <div>
                <h2 class="text-xl font-serif-elegant tracking-wider text-brand-gold mb-1">Derecho de Retracto</h2>
                <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">2 días hábiles para solicitar</p>
              </div>
            </div>
            <p>
              Si la pieza no cumple con tus expectativas, cuentas con
              <strong class="text-brand-white">2 días hábiles</strong> después de recibir tu pedido para
              solicitar un cambio o devolución,
              <strong class="text-brand-white">descontando los gastos financieros y de envío</strong> en que se haya incurrido.
            </p>
          </section>

          <!-- Condiciones de aceptación -->
          <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
            <div class="flex items-start gap-4 mb-6">
              <Icon icon="lucide:clipboard-check" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
              <div>
                <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">Condiciones de Aceptación</h2>
                <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Requisitos para proceder</p>
              </div>
            </div>
            <p class="mb-5 text-brand-white/70">Para que la solicitud sea aprobada, la joya debe cumplir con todas las siguientes condiciones:</p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <Icon icon="lucide:check" class="text-brand-gold w-4 h-4 mt-0.5 shrink-0" />
                <span>Estado <strong class="text-brand-white">original</strong>, sin signos de uso</span>
              </li>
              <li class="flex items-start gap-3">
                <Icon icon="lucide:check" class="text-brand-gold w-4 h-4 mt-0.5 shrink-0" />
                <span>Sin ajustes realizados (grabados, cambios de talla u otras modificaciones)</span>
              </li>
              <li class="flex items-start gap-3">
                <Icon icon="lucide:check" class="text-brand-gold w-4 h-4 mt-0.5 shrink-0" />
                <span>Conservando sus <strong class="text-brand-white">etiquetas y certificados originales</strong></span>
              </li>
            </ul>
          </section>

          <!-- Proceso de devolución -->
          <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
            <div class="flex items-start gap-4 mb-6">
              <Icon icon="lucide:refresh-cw" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
              <div>
                <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">Proceso de Devolución</h2>
                <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Reembolso en 30 días calendario</p>
              </div>
            </div>
            <p>
              Una vez recibida la joya y aprobada la <strong class="text-brand-white">inspección de calidad por nuestros gemólogos</strong>,
              procederemos con el reembolso del dinero a través del método de pago original en un plazo de
              <strong class="text-brand-white">30 días calendario</strong>.
            </p>
          </section>

          <!-- Piezas personalizadas -->
          <section class="bg-brand-white/[0.01] border border-brand-white/5 p-6 md:p-8">
            <div class="flex items-start gap-3">
              <Icon icon="lucide:alert-triangle" class="text-brand-gold/70 w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h3 class="text-sm font-serif-elegant text-brand-white mb-2">Piezas Personalizadas</h3>
                <p class="text-brand-white/50 text-xs leading-relaxed">
                  Las joyas fabricadas bajo <strong class="text-brand-white/70">medidas especiales, grabados personalizados
                  o diseños exclusivos</strong> hechos a solicitud del cliente <strong class="text-brand-white/70">no están sujetas
                  a cambios ni devoluciones</strong>, a menos que presenten defectos de fábrica cubiertos por la garantía.
                </p>
              </div>
            </div>
          </section>

          <!-- Cómo radicar la solicitud -->
          <section class="bg-brand-white/[0.02] border border-brand-white/10 p-8 md:p-10 text-center">
            <h3 class="text-lg font-serif-elegant text-brand-white mb-2">Radicar una Solicitud</h3>
            <p class="text-brand-white/50 text-xs mb-8 max-w-md mx-auto">
              Para iniciar un proceso de cambio o devolución, comunícate con nosotros dentro del plazo de
              2 días hábiles por cualquiera de estos canales:
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

      <!-- ── SECCIÓN SECUNDARIA: Términos y Condiciones legales ── -->
      <div class="mt-16">
        <div class="flex items-center gap-3 mb-8">
          <div class="h-[1px] flex-1 bg-brand-white/10"></div>
          <span class="text-brand-white/30 text-[10px] tracking-[0.4em]">TÉRMINOS Y CONDICIONES GENERALES</span>
          <div class="h-[1px] flex-1 bg-brand-white/10"></div>
        </div>

        <div class="space-y-6 font-sans-luxury text-xs md:text-sm leading-relaxed text-brand-white/50">

          <section>
            <h2 class="text-sm font-serif-elegant tracking-wider text-brand-white/70 mb-3">1. Propiedad de las Piezas e Inventario</h2>
            <p>
              CUSHION Joyas & Esmeraldas se reserva el derecho de modificar la disponibilidad, precios y especificaciones
              técnicas de las piezas exhibidas en este portal sin previo aviso. Debido a la naturaleza exclusiva y artesanal
              de nuestras joyas de alta gama, la confirmación final de compra queda sujeta a la validación de stock en
              nuestras bóvedas físicas.
            </p>
          </section>

          <section>
            <h2 class="text-sm font-serif-elegant tracking-wider text-brand-white/70 mb-3">2. Política de Precios y Divisas</h2>
            <p>
              Los precios mostrados corresponden a la moneda de circulación nacional (COP — Pesos Colombianos).
              Para transacciones internacionales, los valores finales se calcularán de mutuo acuerdo con el asesor comercial
              tomando como referencia la tasa de cambio vigente al día de la facturación.
            </p>
          </section>

          <section>
            <h2 class="text-sm font-serif-elegant tracking-wider text-brand-white/70 mb-3">3. Diseño Personalizado y Anulaciones</h2>
            <p>
              Las piezas adquiridas bajo la modalidad de Diseño Personalizado / A Medida no admiten devoluciones
              ni cancelaciones una vez iniciado el proceso de fundición y engaste en el taller, debido a las
              características únicas solicitadas por el comprador.
            </p>
          </section>

          <section>
            <h2 class="text-sm font-serif-elegant tracking-wider text-brand-white/70 mb-3">4. Canal Oficial de Reclamaciones</h2>
            <p>
              Para cualquier reclamo, derecho de petición, sugerencia o solicitud de soporte posventa legal,
              los canales digitales vinculantes de la empresa son:
            </p>
            <div class="mt-4 flex flex-col sm:flex-row gap-3">
              <div class="flex-1 border border-brand-white/10 p-4 text-center">
                <a :href="`mailto:${CORREO}`" class="text-brand-white/70 hover:text-brand-gold transition-colors text-xs">
                  {{ CORREO }}
                </a>
              </div>
              <div class="flex-1 border border-brand-white/10 p-4 text-center">
                <a href="https://wa.me/573136133822" target="_blank" class="text-brand-white/70 hover:text-brand-gold transition-colors text-xs">
                  WhatsApp +57 313 613 3822
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>

    </div>
  </div>
</template>
