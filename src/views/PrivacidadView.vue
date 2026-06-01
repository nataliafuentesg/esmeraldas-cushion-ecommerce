<script setup>
import { Icon } from '@iconify/vue';

const WA_NUMBER = '573136133822';
const CORREO    = 'info@cushionjewelry.com';
const waLink    = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola Cushion 💎 Tengo una consulta sobre el tratamiento de mis datos personales.')}`;

const ultimaActualizacion = 'Mayo de 2026';
</script>

<template>
  <div class="bg-brand-black min-h-screen py-16 lg:py-24 font-sans text-brand-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20 max-w-4xl">

      <!-- Encabezado -->
      <header class="text-center mb-12">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">Protección de Datos</span>
        <h1 class="text-3xl md:text-4xl font-serif-elegant tracking-wide mb-4">Política de Privacidad</h1>
        <div class="h-[1px] w-20 bg-brand-gold mx-auto mb-6"></div>
        <p class="text-brand-white/50 font-sans-luxury text-xs max-w-xl mx-auto leading-relaxed">
          En cumplimiento de la Ley 1581 de 2012 (Habeas Data) y el Decreto 1377 de 2013 de la República de Colombia.
          <br>Última actualización: {{ ultimaActualizacion }}
        </p>
      </header>

      <div class="space-y-8 font-sans-luxury text-sm leading-relaxed text-brand-white/80">

        <!-- Responsable -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-5">
            <Icon icon="lucide:building-2" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">1. Responsable del Tratamiento</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Quién maneja tus datos</p>
            </div>
          </div>
          <p class="mb-3">
            <strong class="text-brand-white">CUSHION Joyas & Esmeraldas</strong> es responsable del tratamiento de los datos
            personales que recolecta a través de este sitio web.
          </p>
          <ul class="space-y-1.5 text-brand-white/60 text-xs">
            <li><strong class="text-brand-white/80">Dirección:</strong> Emerald Trade Center, Avenida Jiménez 5-43, Local 216, Bogotá, Colombia</li>
            <li><strong class="text-brand-white/80">Correo:</strong> {{ CORREO }}</li>
            <li><strong class="text-brand-white/80">WhatsApp:</strong> +57 313 613 3822</li>
          </ul>
        </section>

        <!-- Qué datos recolectamos -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-5">
            <Icon icon="lucide:database" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">2. Datos que Recolectamos</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Qué información guardamos</p>
            </div>
          </div>
          <p class="mb-4">Recolectamos los siguientes datos únicamente cuando tú decides proporcionarlos:</p>
          <ul class="space-y-2">
            <li class="flex items-start gap-2"><span class="text-brand-gold mt-0.5">·</span> <span><strong class="text-brand-white">Datos de contacto:</strong> nombre, correo electrónico y número de teléfono, cuando creas una cuenta, realizas un pedido o llenas el formulario de diseño personalizado.</span></li>
            <li class="flex items-start gap-2"><span class="text-brand-gold mt-0.5">·</span> <span><strong class="text-brand-white">Datos de pedido:</strong> dirección de envío y productos de interés.</span></li>
            <li class="flex items-start gap-2"><span class="text-brand-gold mt-0.5">·</span> <span><strong class="text-brand-white">Datos de navegación:</strong> páginas visitadas, productos vistos e interacciones, mediante cookies y tecnologías de medición (ver sección 5).</span></li>
          </ul>
        </section>

        <!-- Para qué los usamos -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-5">
            <Icon icon="lucide:target" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">3. Finalidad del Tratamiento</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Para qué usamos tus datos</p>
            </div>
          </div>
          <ul class="space-y-2">
            <li class="flex items-start gap-2"><Icon icon="lucide:check" class="text-brand-gold w-4 h-4 mt-0.5 shrink-0" /> Gestionar tus pedidos, consultas y solicitudes de diseño personalizado.</li>
            <li class="flex items-start gap-2"><Icon icon="lucide:check" class="text-brand-gold w-4 h-4 mt-0.5 shrink-0" /> Contactarte por WhatsApp o correo para coordinar pagos, envíos y asesoría.</li>
            <li class="flex items-start gap-2"><Icon icon="lucide:check" class="text-brand-gold w-4 h-4 mt-0.5 shrink-0" /> Enviarte información sobre nuestras piezas y colecciones (solo si lo autorizas).</li>
            <li class="flex items-start gap-2"><Icon icon="lucide:check" class="text-brand-gold w-4 h-4 mt-0.5 shrink-0" /> Mejorar la experiencia del sitio y medir la efectividad de nuestra publicidad.</li>
          </ul>
        </section>

        <!-- Con quién se comparte -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-5">
            <Icon icon="lucide:share-2" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">4. Con Quién Compartimos Datos</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Terceros y encargados</p>
            </div>
          </div>
          <p class="mb-4">
            <strong class="text-brand-white">No vendemos tus datos personales.</strong> Solo los compartimos con
            proveedores que nos ayudan a operar, bajo estrictos acuerdos de confidencialidad:
          </p>
          <ul class="space-y-2 text-brand-white/60 text-xs">
            <li class="flex items-start gap-2"><span class="text-brand-gold mt-0.5">·</span> Empresas transportadoras, para la entrega de tus pedidos.</li>
            <li class="flex items-start gap-2"><span class="text-brand-gold mt-0.5">·</span> Plataformas de medición y publicidad (Meta, Google, TikTok) para mostrar anuncios relevantes y medir resultados.</li>
            <li class="flex items-start gap-2"><span class="text-brand-gold mt-0.5">·</span> Proveedores de correo y mensajería para responder tus consultas.</li>
          </ul>
        </section>

        <!-- Cookies y medición -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-5">
            <Icon icon="lucide:cookie" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">5. Cookies y Tecnologías de Medición</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Píxeles y analítica</p>
            </div>
          </div>
          <p class="mb-4">
            Utilizamos cookies y píxeles de medición (Meta Pixel, Google Analytics y TikTok Pixel) para entender cómo
            usas el sitio y mostrarte publicidad relevante. Estas herramientas pueden registrar tu actividad de navegación
            de forma seudonimizada.
          </p>
          <p class="text-brand-white/60 text-xs">
            Puedes desactivar las cookies desde la configuración de tu navegador. Ten en cuenta que algunas funciones del
            sitio podrían no operar correctamente si las deshabilitas.
          </p>
        </section>

        <!-- Derechos del titular -->
        <section class="border-2 border-brand-gold/30 bg-brand-gold/[0.02] p-8 md:p-10">
          <div class="flex items-start gap-4 mb-5">
            <Icon icon="lucide:shield-check" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-gold mb-1">6. Tus Derechos (Habeas Data)</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Como titular de los datos</p>
            </div>
          </div>
          <p class="mb-4">Conforme a la Ley 1581 de 2012, en cualquier momento puedes ejercer tus derechos a:</p>
          <ul class="space-y-2">
            <li class="flex items-start gap-2"><span class="text-brand-gold mt-0.5">·</span> <strong class="text-brand-white">Conocer, actualizar y rectificar</strong> tus datos personales.</li>
            <li class="flex items-start gap-2"><span class="text-brand-gold mt-0.5">·</span> <strong class="text-brand-white">Solicitar prueba</strong> de la autorización otorgada.</li>
            <li class="flex items-start gap-2"><span class="text-brand-gold mt-0.5">·</span> Ser <strong class="text-brand-white">informado</strong> sobre el uso que se da a tus datos.</li>
            <li class="flex items-start gap-2"><span class="text-brand-gold mt-0.5">·</span> <strong class="text-brand-white">Revocar la autorización</strong> y/o solicitar la supresión de tus datos.</li>
          </ul>
          <p class="mt-4 text-brand-white/60 text-xs">
            Para ejercer cualquiera de estos derechos, escríbenos a <strong class="text-brand-white">{{ CORREO }}</strong>.
            Responderemos tu solicitud en los plazos establecidos por la ley.
          </p>
        </section>

        <!-- Seguridad y conservación -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-8 md:p-10">
          <div class="flex items-start gap-4 mb-5">
            <Icon icon="lucide:lock" class="text-brand-gold w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <h2 class="text-xl font-serif-elegant tracking-wider text-brand-white mb-1">7. Seguridad y Conservación</h2>
              <p class="text-brand-white/40 text-[10px] tracking-widest uppercase">Cómo protegemos tus datos</p>
            </div>
          </div>
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger tus datos contra accesos no autorizados,
            pérdida o alteración. Conservamos tu información solo durante el tiempo necesario para cumplir las finalidades
            descritas o las obligaciones legales aplicables.
          </p>
        </section>

        <!-- Contacto -->
        <section class="bg-brand-white/[0.02] border border-brand-white/10 p-8 md:p-10 text-center">
          <h3 class="text-lg font-serif-elegant text-brand-white mb-2">¿Dudas sobre tus datos?</h3>
          <p class="text-brand-white/50 text-xs mb-8 max-w-md mx-auto">
            Estamos a tu disposición para resolver cualquier inquietud sobre el tratamiento de tu información personal.
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
