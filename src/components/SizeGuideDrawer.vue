<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';

const props = defineProps({
  category: { type: String, default: '' },
});

const open = ref(false);
defineExpose({ open: () => { open.value = true; } });

// Tipo de guía según la categoría de la pieza
const type = computed(() => {
  const c = (props.category || '').toLowerCase();
  if (c.includes('anillo'))  return 'rings';
  if (c.includes('collar') || c.includes('dije') || c.includes('cadena')) return 'necklaces';
  if (c.includes('pulsera')) return 'bracelets';
  return 'generic';
});

const anchor = computed(() => {
  if (type.value === 'rings')     return '/guia-de-tallas#anillos';
  if (type.value === 'necklaces') return '/guia-de-tallas#collares';
  if (type.value === 'bracelets') return '/guia-de-tallas#pulseras';
  return '/guia-de-tallas';
});

// Datos de referencia (compactos; la guía completa tiene el detalle)
const ringSizes = [
  { circ: '49.3', usa: '5'  },
  { circ: '51.8', usa: '6', mostCommon: true },
  { circ: '54.4', usa: '7'  },
  { circ: '57.2', usa: '8'  },
  { circ: '59.7', usa: '9'  },
  { circ: '62.3', usa: '10' },
];

const necklaceLengths = [
  { cm: '38–40', label: 'Gargantilla', where: 'Base del cuello' },
  { cm: '43–46', label: 'Collar · Clavícula', where: 'Sobre la clavícula' },
  { cm: '50–55', label: 'Princess', where: 'Clavícula y escote' },
  { cm: '60–70', label: 'Matinee', where: 'Sobre el pecho' },
];

const waLink = `https://wa.me/573136133822?text=${encodeURIComponent('Hola Cushion 💎 Necesito ayuda para conocer mi talla antes de comprar.')}`;

// Bloquea el scroll del fondo cuando el panel está abierto
watch(open, (v) => {
  try { document.body.style.overflow = v ? 'hidden' : ''; } catch (e) { /* noop */ }
});
</script>

<template>
  <!-- Pestañita en el borde derecho (visible en móvil y escritorio) -->
  <button
    @click="open = true"
    class="flex fixed right-0 top-1/2 -translate-y-1/2 z-40 items-center gap-2 bg-brand-primary/90 backdrop-blur-md text-brand-black px-2 md:px-2.5 py-3.5 md:py-4 rounded-l-xl shadow-lg hover:px-3.5 transition-all duration-300"
    aria-label="Abrir guía de tallas"
  >
    <span class="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold font-sans-luxury tracking-[0.25em] uppercase">
      Guía de tallas
    </span>
  </button>

  <!-- Backdrop + Panel -->
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-[55] bg-brand-white/40 backdrop-blur-sm" @click="open = false"></div>
  </transition>

  <transition name="slide">
    <aside
      v-if="open"
      class="fixed top-0 right-0 bottom-0 z-[56] w-full max-w-md bg-brand-black border-l border-brand-white/10 shadow-2xl overflow-y-auto"
    >
      <!-- Header -->
      <div class="sticky top-0 bg-brand-black/90 backdrop-blur-xl border-b border-brand-white/10 px-6 py-5 flex items-center justify-between z-10">
        <h3 class="font-serif-elegant text-brand-white text-lg tracking-wide flex items-center gap-2.5">
          <Icon icon="lucide:ruler" class="text-brand-gold w-5 h-5" />
          Guía de tallas
        </h3>
        <button @click="open = false" class="text-brand-white/50 hover:text-brand-gold transition-colors" aria-label="Cerrar">
          <Icon icon="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <div class="px-6 py-6 space-y-7">

        <!-- ANILLOS -->
        <template v-if="type === 'rings'">
          <div class="flex items-start gap-3 bg-brand-gold/[0.06] border border-brand-gold/25 p-4">
            <Icon icon="lucide:sparkles" class="text-brand-gold w-5 h-5 mt-0.5 shrink-0" />
            <p class="text-brand-white/70 text-xs leading-relaxed">
              <strong class="text-brand-gold">La talla más común en mujeres es la 6</strong> (USA).
              Si vas a regalar y no sabes la talla, la <strong class="text-brand-white">6</strong> es la apuesta más segura.
            </p>
          </div>

          <div>
            <p class="text-brand-white/50 text-xs leading-relaxed mb-3">
              Mide la <strong class="text-brand-white">circunferencia</strong> de tu dedo (en mm) y busca tu
              <strong class="text-brand-gold">Talla USA</strong> — ese número es el que eliges al comprar.
            </p>
            <table class="w-full text-xs font-sans-luxury border-collapse">
              <thead>
                <tr class="border-b border-brand-gold/30">
                  <th class="text-left py-2.5 px-3 text-brand-gold/80 text-[10px] tracking-[0.2em] font-bold">CIRCUNFERENCIA</th>
                  <th class="text-center py-2.5 px-3 text-brand-gold text-[10px] tracking-[0.2em] font-bold">TALLA USA</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in ringSizes" :key="s.usa" class="border-b border-brand-white/5" :class="s.mostCommon ? 'bg-brand-gold/[0.04]' : ''">
                  <td class="py-2.5 px-3 text-brand-white/70">{{ s.circ }} mm</td>
                  <td class="py-2.5 px-3 text-center">
                    <span class="text-base font-bold" :class="s.mostCommon ? 'text-brand-gold' : 'text-brand-white/80'">{{ s.usa }}</span>
                    <span v-if="s.mostCommon" class="block text-brand-gold text-[8px] tracking-[0.15em] font-bold">★ MÁS COMÚN</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex items-start gap-3 bg-brand-white/[0.02] border border-brand-white/5 p-4">
            <Icon icon="lucide:gift" class="text-brand-gold w-4 h-4 mt-0.5 shrink-0" />
            <p class="text-brand-white/60 text-xs leading-relaxed">
              <strong class="text-brand-white">Primer ajuste gratis:</strong> si al recibir tu anillo necesitas otro tamaño,
              el primer cambio es sin costo (dentro de 30 días).
            </p>
          </div>
        </template>

        <!-- COLLARES / DIJES -->
        <template v-else-if="type === 'necklaces'">
          <p class="text-brand-white/50 text-xs leading-relaxed">
            En collares no hay "talla" — depende de <strong class="text-brand-white/70">dónde quieres que caiga</strong> la pieza.
          </p>
          <div class="space-y-3">
            <div v-for="n in necklaceLengths" :key="n.cm" class="flex items-baseline gap-3 border-b border-brand-white/5 pb-3">
              <span class="text-brand-gold text-sm font-bold font-sans-luxury w-20 shrink-0">{{ n.cm }} cm</span>
              <div>
                <span class="text-brand-white text-xs font-bold tracking-wide block">{{ n.label }}</span>
                <span class="text-brand-white/45 text-[11px]">{{ n.where }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- PULSERAS -->
        <template v-else-if="type === 'bracelets'">
          <p class="text-brand-white/50 text-xs leading-relaxed">
            Mide el <strong class="text-brand-white/70">contorno de tu muñeca</strong> con una cinta o un hilo,
            justo donde usarías la pulsera.
          </p>
          <div class="flex items-start gap-3 bg-brand-gold/[0.06] border border-brand-gold/25 p-4">
            <Icon icon="lucide:info" class="text-brand-gold w-5 h-5 mt-0.5 shrink-0" />
            <p class="text-brand-white/70 text-xs leading-relaxed">
              A la medida de tu muñeca súmale <strong class="text-brand-white">1 a 2 cm</strong> para que quede
              cómoda (holgada pero sin deslizarse). Esa es tu talla.
            </p>
          </div>
        </template>

        <!-- GENÉRICO -->
        <template v-else>
          <p class="text-brand-white/55 text-xs leading-relaxed">
            Consulta nuestra guía completa para conocer las medidas de cada tipo de pieza, o escríbenos
            y te ayudamos a elegir la talla correcta.
          </p>
        </template>

        <!-- Acciones -->
        <div class="pt-2 space-y-3">
          <RouterLink
            :to="anchor"
            @click="open = false"
            class="block text-center px-6 py-3 border border-brand-gold/30 text-brand-gold text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-brand-gold hover:text-brand-black transition-all duration-500"
          >
            Ver guía completa →
          </RouterLink>
          <a
            :href="waLink" target="_blank" rel="noopener"
            data-wa-source="size-guide"
            class="flex items-center justify-center gap-2 text-brand-white/50 hover:text-brand-primary text-[11px] tracking-wide transition-colors duration-300"
          >
            <Icon icon="lucide:message-circle" class="w-4 h-4" />
            ¿Dudas con tu talla? Escríbenos
          </a>
        </div>

      </div>
    </aside>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
