<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();
const router = useRouter();

// Volver a la página anterior (normalmente el producto). Si no hay historial,
// va a la colección.
const goBack = () => {
  if (window.history.length > 1) router.back();
  else router.push('/coleccion');
};

// Tab activo controlado por el hash de la URL (/guia-de-tallas#collares)
const validTabs = ['anillos', 'collares', 'pulseras'];
const activeTab = ref(
  validTabs.includes(route.hash?.replace('#', '')) ? route.hash.replace('#', '') : 'anillos'
);

watch(() => route.hash, (hash) => {
  const tab = hash?.replace('#', '');
  if (validTabs.includes(tab)) activeTab.value = tab;
});

// Tabla de tallas de anillos — la TALLA USA es la que se selecciona al comprar.
// "common" marca el rango más usado en mujeres; "mostCommon" la talla típica (6).
const ringSizes = [
  { diam: '14.9', circ: '46.8', usa: '4'  },
  { diam: '15.3', circ: '48.0', usa: '4½' },
  { diam: '15.7', circ: '49.3', usa: '5'  },
  { diam: '16.1', circ: '50.6', usa: '5½' },
  { diam: '16.5', circ: '51.8', usa: '6',  popular: true, mostCommon: true },
  { diam: '16.9', circ: '53.1', usa: '6½', popular: true },
  { diam: '17.3', circ: '54.4', usa: '7',  popular: true },
  { diam: '17.7', circ: '55.7', usa: '7½' },
  { diam: '18.2', circ: '57.2', usa: '8'  },
  { diam: '18.6', circ: '58.5', usa: '8½' },
  { diam: '19.0', circ: '59.7', usa: '9'  },
  { diam: '19.4', circ: '61.0', usa: '9½' },
  { diam: '19.8', circ: '62.3', usa: '10' },
  { diam: '20.2', circ: '63.5', usa: '10½' },
  { diam: '20.6', circ: '64.8', usa: '11' },
];

// Longitudes de cadena y dónde caen en el cuerpo
const necklaceLengths = [
  { cm: '35–40', label: 'Gargantilla', where: 'Justo en la base del cuello', icon: 'lucide:circle-dot', svgY: 78 },
  { cm: '43–46', label: 'Collar / Clavícula', where: 'Sobre la clavícula', icon: 'lucide:circle-dot', svgY: 100 },
  { cm: '50–55', label: 'Princess', where: 'Entre la clavícula y el escote', icon: 'lucide:circle-dot', svgY: 130 },
  { cm: '60–70', label: 'Matinee', where: 'Sobre el pecho', icon: 'lucide:circle-dot', svgY: 165 },
  { cm: '75–90', label: 'Opera / Largo', where: 'Por debajo del pecho', icon: 'lucide:circle-dot', svgY: 210 },
];

const waLink = `https://wa.me/573136133822?text=${encodeURIComponent('Hola Cushion 💎 Necesito ayuda para conocer mi talla antes de comprar.')}`;
</script>

<template>
  <div class="bg-brand-black min-h-screen py-16 lg:py-24 font-sans text-brand-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-20 max-w-4xl">

      <!-- Volver al producto -->
      <button @click="goBack"
        class="group flex items-center gap-2 text-brand-white/40 hover:text-brand-gold text-[10px] tracking-[0.3em] transition-colors duration-300 mb-8">
        <Icon icon="lucide:arrow-left" class="w-3 h-3 transform group-hover:-translate-x-1 transition-transform duration-300 text-brand-gold/60 group-hover:text-brand-gold" />
        <span>VOLVER AL PRODUCTO</span>
      </button>

      <!-- Encabezado -->
      <header class="text-center mb-12">
        <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">Ajuste Perfecto</span>
        <h1 class="text-3xl md:text-4xl font-serif-elegant tracking-wide mb-4">Guía de Tallas</h1>
        <div class="h-[1px] w-20 bg-brand-gold mx-auto mb-5"></div>
        <p class="text-brand-white/50 font-sans-luxury text-sm max-w-lg mx-auto leading-relaxed">
          Conoce tu medida exacta antes de comprar. Si tienes dudas, escríbenos por WhatsApp —
          nuestros asesores te guían sin costo.
        </p>
      </header>

      <!-- Tabs de navegación -->
      <div class="flex gap-1 border border-brand-white/10 p-1 mb-10">
        <button
          v-for="tab in [
            { id: 'anillos',   label: 'Anillos',             icon: 'lucide:circle' },
            { id: 'collares',  label: 'Collares & Cadenas',  icon: 'lucide:link' },
            { id: 'pulseras',  label: 'Pulseras',            icon: 'lucide:minus-circle' },
          ]"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold tracking-[0.2em] transition-all duration-300"
          :class="activeTab === tab.id
            ? 'bg-brand-gold text-brand-black'
            : 'text-brand-white/40 hover:text-brand-white'"
        >
          <Icon :icon="tab.icon" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ tab.label }}</span>
          <span class="sm:hidden">{{ tab.id === 'anillos' ? 'Anillos' : tab.id === 'collares' ? 'Collares' : 'Pulseras' }}</span>
        </button>
      </div>

      <!-- ════════════════ TAB: ANILLOS ════════════════ -->
      <div v-if="activeTab === 'anillos'" id="anillos">

        <!-- Cómo medir -->
        <section class="mb-8 bg-brand-white/[0.01] border border-brand-white/5 p-6 md:p-8">
          <h2 class="text-lg font-serif-elegant text-brand-white mb-6 flex items-center gap-3">
            <Icon icon="lucide:ruler" class="text-brand-gold w-5 h-5" />
            ¿Cómo medir tu dedo?
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Método 1: hilo -->
            <div class="border border-brand-white/10 p-5">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-6 h-6 bg-brand-gold text-brand-black text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                <span class="text-brand-white text-sm font-bold">Con un hilo o papel</span>
              </div>
              <ol class="space-y-2 text-brand-white/60 text-xs leading-relaxed list-none">
                <li class="flex gap-2"><span class="text-brand-gold shrink-0">›</span> Enrolla una tira de papel delgado alrededor del dedo donde usarás el anillo.</li>
                <li class="flex gap-2"><span class="text-brand-gold shrink-0">›</span> Marca el punto donde se superpone con un lápiz.</li>
                <li class="flex gap-2"><span class="text-brand-gold shrink-0">›</span> Extiende el papel sobre una regla y mide la longitud en mm. Ese es tu <strong class="text-brand-white">perímetro interior</strong>.</li>
                <li class="flex gap-2"><span class="text-brand-gold shrink-0">›</span> Busca ese valor en la columna "Circunferencia" de la tabla.</li>
              </ol>
            </div>

            <!-- Método 2: anillo existente -->
            <div class="border border-brand-white/10 p-5">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-6 h-6 bg-brand-gold text-brand-black text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                <span class="text-brand-white text-sm font-bold">Con un anillo que ya uses</span>
              </div>
              <ol class="space-y-2 text-brand-white/60 text-xs leading-relaxed list-none">
                <li class="flex gap-2"><span class="text-brand-gold shrink-0">›</span> Toma un anillo que te quede bien en el mismo dedo.</li>
                <li class="flex gap-2"><span class="text-brand-gold shrink-0">›</span> Mide el <strong class="text-brand-white">diámetro interior</strong> (de borde a borde por el centro) con una regla o calibrador.</li>
                <li class="flex gap-2"><span class="text-brand-gold shrink-0">›</span> Busca ese valor en la columna "Diámetro" de la tabla.</li>
              </ol>
            </div>

          </div>

          <!-- Tip -->
          <div class="mt-5 flex items-start gap-3 bg-brand-gold/[0.05] border border-brand-gold/20 p-4">
            <Icon icon="lucide:lightbulb" class="text-brand-gold w-4 h-4 mt-0.5 shrink-0" />
            <p class="text-brand-white/60 text-xs leading-relaxed">
              <strong class="text-brand-white">Consejo:</strong> Mide al final del día cuando tus dedos están ligeramente más grandes por el calor.
              Si estás entre dos tallas, elige la mayor. La talla varía hasta 0.5 tallas entre la mañana y la noche.
            </p>
          </div>
        </section>

        <!-- Tabla de tallas -->
        <section class="mb-8">
          <h2 class="text-lg font-serif-elegant text-brand-white flex items-center gap-3 mb-3">
            <Icon icon="lucide:table" class="text-brand-gold w-5 h-5" />
            Encuentra tu Talla USA
          </h2>
          <p class="text-brand-white/50 text-xs leading-relaxed mb-5">
            Mide el <strong class="text-brand-white">diámetro</strong> o la <strong class="text-brand-white">circunferencia</strong> de tu dedo
            (en mm, con los métodos de arriba) y busca tu número en la tabla. Ese número de la columna
            <strong class="text-brand-gold">TU TALLA (USA)</strong> es exactamente el que eliges al comprar la pieza.
          </p>

          <!-- Aviso: talla más común -->
          <div class="flex items-start gap-3 bg-brand-gold/[0.06] border border-brand-gold/25 p-4 mb-5">
            <Icon icon="lucide:sparkles" class="text-brand-gold w-5 h-5 mt-0.5 shrink-0" />
            <p class="text-brand-white/70 text-xs leading-relaxed">
              <strong class="text-brand-gold">La talla más común en mujeres es la 6</strong> (USA).
              La mayoría está entre la <strong class="text-brand-white">6 y la 7</strong> — si vas a regalar y no sabes la talla,
              la <strong class="text-brand-white">6</strong> es la apuesta más segura.
            </p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs font-sans-luxury border-collapse">
              <thead>
                <tr class="border-b border-brand-gold/30">
                  <th class="text-left py-3 px-3 text-brand-gold/80 text-[10px] tracking-[0.2em] font-bold">DIÁMETRO (mm)</th>
                  <th class="text-left py-3 px-3 text-brand-gold/80 text-[10px] tracking-[0.2em] font-bold">CIRCUNFERENCIA (mm)</th>
                  <th class="text-center py-3 px-3 text-brand-gold text-[10px] tracking-[0.2em] font-bold bg-brand-gold/[0.05]">TU TALLA (USA)</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="size in ringSizes"
                  :key="size.diam"
                  class="border-b border-brand-white/5 transition-colors"
                  :class="size.popular
                    ? 'bg-brand-gold/[0.04] border-brand-gold/15'
                    : 'hover:bg-brand-white/[0.02]'"
                >
                  <td class="py-3 px-3 text-brand-white/70">{{ size.diam }} mm</td>
                  <td class="py-3 px-3">
                    <span :class="size.popular ? 'text-brand-white font-bold' : 'text-brand-white/70'">{{ size.circ }} mm</span>
                  </td>
                  <td class="py-3 px-3 text-center bg-brand-gold/[0.03]">
                    <span class="text-base font-bold" :class="size.mostCommon ? 'text-brand-gold' : size.popular ? 'text-brand-gold/90' : 'text-brand-white/80'">
                      {{ size.usa }}
                    </span>
                    <span v-if="size.mostCommon" class="block text-brand-gold text-[8px] tracking-[0.15em] font-bold mt-0.5">★ MÁS COMÚN</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="mt-3 text-brand-white/30 text-[10px] font-sans-luxury">
            ¿No estás seguro/a? Al comprar puedes elegir <strong class="text-brand-white/50">"No estoy seguro/a"</strong> y nuestros
            asesores te ayudan a confirmar la talla antes de hacer la pieza.
          </p>
        </section>

        <!-- Primera puesta a medida -->
        <section class="bg-brand-gold/[0.04] border border-brand-gold/25 p-6 mb-8">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:gift" class="text-brand-gold w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p class="text-brand-white text-sm font-bold mb-1">Primera Puesta a Medida — Sin Costo</p>
              <p class="text-brand-white/60 text-xs leading-relaxed">
                Si al recibir tu anillo necesitas un ajuste de talla, el primer cambio es completamente gratuito.
                Simplemente contáctanos dentro de los 30 días posteriores a la entrega.
              </p>
            </div>
          </div>
        </section>

      </div>

      <!-- ════════════════ TAB: COLLARES ════════════════ -->
      <div v-if="activeTab === 'collares'" id="collares">

        <section class="mb-8 bg-brand-white/[0.01] border border-brand-white/5 p-6 md:p-8">
          <h2 class="text-lg font-serif-elegant text-brand-white mb-2 flex items-center gap-3">
            <Icon icon="lucide:link" class="text-brand-gold w-5 h-5" />
            Longitudes de Cadena
          </h2>
          <p class="text-brand-white/50 text-xs mb-8">
            En collares y gargantillas no hay "talla" como en anillos — todo depende de
            <strong class="text-brand-white/70">dónde quieres que caiga la pieza</strong> en tu cuerpo.
          </p>

          <!-- Timeline vertical proporcional — spacing entre puntos = diferencia real de cm -->
          <div class="relative pl-6">
            <!-- Línea vertical -->
            <div class="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-brand-gold/60 via-brand-white/20 to-brand-white/10"></div>

            <!-- Gargantilla → 38 cm (punto de referencia) -->
            <div class="relative mb-0">
              <div class="absolute left-[-22px] top-[5px] w-3.5 h-3.5 rounded-full border-2 border-brand-gold bg-brand-black"></div>
              <div class="flex items-baseline gap-3 mb-0.5">
                <span class="text-brand-gold text-base font-bold font-sans-luxury">38–40 cm</span>
                <span class="text-brand-gold text-xs font-bold tracking-wide">Gargantilla</span>
              </div>
              <p class="text-brand-white/50 text-[11px] mb-0">Justo en la base del cuello</p>
            </div>

            <!-- Collar → +5 cm desde gargantilla -->
            <div class="relative mt-10 mb-0">
              <div class="absolute left-[-22px] top-[5px] w-3 h-3 rounded-full border border-brand-white/40 bg-brand-black"></div>
              <div class="flex items-baseline gap-3 mb-0.5">
                <span class="text-brand-white text-base font-bold font-sans-luxury">43–46 cm</span>
                <span class="text-brand-white/70 text-xs font-bold tracking-wide">Collar · Clavícula</span>
              </div>
              <p class="text-brand-white/50 text-[11px]">Sobre la clavícula</p>
            </div>

            <!-- Princess → +12 cm desde gargantilla -->
            <div class="relative mt-14 mb-0">
              <div class="absolute left-[-22px] top-[5px] w-3 h-3 rounded-full border border-brand-white/40 bg-brand-black"></div>
              <div class="flex items-baseline gap-3 mb-0.5">
                <span class="text-brand-white text-base font-bold font-sans-luxury">50–55 cm</span>
                <span class="text-brand-white/70 text-xs font-bold tracking-wide">Princess</span>
              </div>
              <p class="text-brand-white/50 text-[11px]">Entre la clavícula y el escote</p>
            </div>

            <!-- Matinee → +22 cm desde gargantilla -->
            <div class="relative mt-20 mb-0">
              <div class="absolute left-[-22px] top-[5px] w-3 h-3 rounded-full border border-brand-white/40 bg-brand-black"></div>
              <div class="flex items-baseline gap-3 mb-0.5">
                <span class="text-brand-white text-base font-bold font-sans-luxury">60–70 cm</span>
                <span class="text-brand-white/70 text-xs font-bold tracking-wide">Matinee</span>
              </div>
              <p class="text-brand-white/50 text-[11px]">Sobre el pecho</p>
            </div>

            <!-- Opera → +37 cm desde gargantilla -->
            <div class="relative mt-24 mb-2">
              <div class="absolute left-[-22px] top-[5px] w-3 h-3 rounded-full border border-brand-white/20 bg-brand-black"></div>
              <div class="flex items-baseline gap-3 mb-0.5">
                <span class="text-brand-white/60 text-base font-bold font-sans-luxury">75–90 cm</span>
                <span class="text-brand-white/40 text-xs font-bold tracking-wide">Opera · Largo</span>
              </div>
              <p class="text-brand-white/30 text-[11px]">Por debajo del pecho</p>
            </div>
          </div>
        </section>

        <!-- Tip para dijes -->
        <section class="bg-brand-white/[0.01] border border-brand-white/5 p-6">
          <div class="flex items-start gap-3">
            <Icon icon="lucide:info" class="text-brand-gold/70 w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h3 class="text-sm font-serif-elegant text-brand-white mb-2">Sobre los Dijes</h3>
              <p class="text-brand-white/50 text-xs leading-relaxed">
                Los dijes (pendientes) no tienen talla — se adaptan a cualquier cadena.
                Si adquieres solo el dije, indícanos la longitud de cadena que prefieras
                si está disponible en el diseño.
              </p>
            </div>
          </div>
        </section>

      </div>

      <!-- ════════════════ TAB: PULSERAS ════════════════ -->
      <div v-if="activeTab === 'pulseras'" id="pulseras">

        <!-- Cómo medir -->
        <section class="mb-8 bg-brand-white/[0.01] border border-brand-white/5 p-6 md:p-8">
          <h2 class="text-lg font-serif-elegant text-brand-white mb-6 flex items-center gap-3">
            <Icon icon="lucide:ruler" class="text-brand-gold w-5 h-5" />
            ¿Cómo medir tu muñeca?
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="border border-brand-white/10 p-5">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-6 h-6 bg-brand-gold text-brand-black text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                <span class="text-brand-white text-sm font-bold">Mide tu muñeca</span>
              </div>
              <ol class="space-y-2 text-brand-white/60 text-xs leading-relaxed">
                <li class="flex gap-2"><span class="text-brand-gold">›</span> Enrolla una cinta métrica o tira de papel justo por encima del hueso de la muñeca.</li>
                <li class="flex gap-2"><span class="text-brand-gold">›</span> Anota la medida en centímetros.</li>
              </ol>
            </div>
            <div class="border border-brand-white/10 p-5">
              <div class="flex items-center gap-2 mb-3">
                <span class="w-6 h-6 bg-brand-gold text-brand-black text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                <span class="text-brand-white text-sm font-bold">Agrega la holgura</span>
              </div>
              <ul class="space-y-2 text-brand-white/60 text-xs leading-relaxed">
                <li class="flex gap-2"><span class="text-brand-gold">›</span> <strong class="text-brand-white">+1 cm</strong> para un ajuste ceñido y elegante</li>
                <li class="flex gap-2"><span class="text-brand-gold">›</span> <strong class="text-brand-white">+1.5 cm</strong> para un ajuste cómodo (recomendado)</li>
                <li class="flex gap-2"><span class="text-brand-gold">›</span> <strong class="text-brand-white">+2 cm</strong> para un ajuste suelto o holgado</li>
              </ul>
            </div>
          </div>

          <!-- Tabla de pulseras -->
          <h3 class="text-sm font-serif-elegant text-brand-white mb-4 mt-6">Tallas de Pulsera</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-xs font-sans-luxury border-collapse">
              <thead>
                <tr class="border-b border-brand-gold/30">
                  <th class="text-left py-3 px-3 text-brand-gold/80 text-[10px] tracking-[0.2em] font-bold">TALLA</th>
                  <th class="text-center py-3 px-3 text-brand-gold/80 text-[10px] tracking-[0.2em] font-bold">LONGITUD</th>
                  <th class="text-left py-3 px-3 text-brand-gold/80 text-[10px] tracking-[0.2em] font-bold">CIRCUNF. DE MUÑECA</th>
                  <th class="text-left py-3 px-3 text-brand-gold/80 text-[10px] tracking-[0.2em] font-bold">EQUIVALENTE</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in [
                  { talla: 'XS', long: '16 cm', muneca: '14–15 cm', equiv: 'XS / Muy pequeña' },
                  { talla: 'S',  long: '17 cm', muneca: '15–16 cm', equiv: 'S / Pequeña', pop: true },
                  { talla: 'M',  long: '18 cm', muneca: '16–17 cm', equiv: 'M / Mediana', pop: true },
                  { talla: 'L',  long: '19 cm', muneca: '17–18 cm', equiv: 'L / Grande', pop: true },
                  { talla: 'XL', long: '20 cm', muneca: '18–19 cm', equiv: 'XL / Muy grande' },
                ]" :key="row.talla"
                class="border-b border-brand-white/5"
                :class="row.pop ? 'bg-brand-gold/[0.03]' : ''">
                  <td class="py-3 px-3">
                    <span :class="row.pop ? 'text-brand-gold font-bold' : 'text-brand-white/60'">{{ row.talla }}</span>
                  </td>
                  <td class="py-3 px-3 text-center text-brand-white/80 font-bold">{{ row.long }}</td>
                  <td class="py-3 px-3 text-brand-white/60">{{ row.muneca }}</td>
                  <td class="py-3 px-3 text-brand-white/40 text-[11px]">{{ row.equiv }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mt-3 text-brand-white/30 text-[10px]">
            La mayoría de nuestras pulseras incluyen una extensión de 1–2 cm para mayor flexibilidad de talla.
            Escríbenos si necesitas un ajuste especial.
          </p>
        </section>

      </div>

      <!-- ════════════════ CTA WHATSAPP (global) ════════════════ -->
      <section class="mt-10 bg-brand-white/[0.02] border border-brand-white/10 p-8 text-center">
        <Icon icon="lucide:help-circle" class="text-brand-gold w-8 h-8 mx-auto mb-3" />
        <h3 class="text-lg font-serif-elegant text-brand-white mb-2">¿Todavía con dudas sobre tu talla?</h3>
        <p class="text-brand-white/50 text-xs mb-6 max-w-md mx-auto">
          Nuestros asesores te ayudan a encontrar la talla exacta antes de comprar. Sin compromiso.
        </p>
        <a :href="waLink" target="_blank"
           class="inline-flex items-center gap-3 px-8 py-4 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 text-xs font-bold tracking-wide transition-all duration-300">
          <Icon icon="simple-icons:whatsapp" class="w-4 h-4" />
          Consultar Talla por WhatsApp
        </a>
      </section>

    </div>
  </div>
</template>
