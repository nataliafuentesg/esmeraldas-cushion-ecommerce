<script setup>
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';
import { useAnalytics } from '@/composables/useAnalytics';
import { getAttribution } from '@/utils/utm';
import { v4 as uuidv4 } from 'uuid';

const { trackEmeraldForm } = useAnalytics();

// ── Estado del formulario ──────────────────────────────────────────────────
const form = ref({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  occasion: '',
  jewelryType: '',
  gemstonePreference: '',
  metalType: '',
  budgetRange: '',
  ideas: '',
});

const isSubmitting = ref(false);
const submitted = ref(false);
const errorMsg = ref('');

// ── Opciones visuales ──────────────────────────────────────────────────────
const occasions = [
  { value: 'Compromiso / Matrimonio', icon: 'lucide:heart', labelKey: 'em.occ.engagement' },
  { value: 'Regalo especial', icon: 'lucide:gift', labelKey: 'em.occ.gift' },
  { value: 'Inversión en gemas', icon: 'lucide:trending-up', labelKey: 'em.occ.investment' },
  { value: 'Colección personal', icon: 'lucide:gem', labelKey: 'em.occ.collection' },
  { value: 'Otra ocasión', icon: 'lucide:sparkles', labelKey: 'em.occ.other' },
];

const jewelryTypes = [
  { value: 'Anillo', icon: 'lucide:circle', labelKey: 'em.jt.ring' },
  { value: 'Collar / Dije', icon: 'lucide:link', labelKey: 'em.jt.necklace' },
  { value: 'Aretes', icon: 'lucide:droplets', labelKey: 'em.jt.earrings' },
  { value: 'Pulsera', icon: 'lucide:watch', labelKey: 'em.jt.bracelet' },
  { value: 'Libre / Sorpréndeme', icon: 'lucide:wand', labelKey: 'em.jt.open' },
];

const gemstones = [
  { value: 'Esmeralda sola', labelKey: 'em.gem.alone', subKey: 'em.gem.aloneSub' },
  { value: 'Esmeralda con diamantes', labelKey: 'em.gem.diamonds', subKey: 'em.gem.diamondsSub' },
  { value: 'Esmeralda con otras gemas', labelKey: 'em.gem.combined', subKey: 'em.gem.combinedSub' },
  { value: 'Abierto a sugerencias', labelKey: 'em.gem.open', subKey: 'em.gem.openSub' },
];

// Cushion trabaja únicamente en oro de 18k
const metals = [
  { value: 'Oro amarillo', labelKey: 'em.metal.yellow' },
  { value: 'Oro blanco', labelKey: 'em.metal.white' },
  { value: 'Oro rosado', labelKey: 'em.metal.rose' },
  { value: 'Sin preferencia', labelKey: 'em.metal.none' },
];

const budgets = [
  { value: 'Menos de $5.000.000', labelKey: 'em.budget.1' },
  { value: '$5.000.000 - $15.000.000', labelKey: 'em.budget.2' },
  { value: '$15.000.000 - $30.000.000', labelKey: 'em.budget.3' },
  { value: '$30.000.000 - $60.000.000', labelKey: 'em.budget.4' },
  { value: 'Más de $60.000.000', labelKey: 'em.budget.5' },
  { value: 'Abierto a cotización', labelKey: 'em.budget.6' },
];

// ── Validación básica ──────────────────────────────────────────────────────
const isValid = computed(() =>
  form.value.customerName.trim() &&
  form.value.customerEmail.trim() &&
  form.value.occasion &&
  form.value.jewelryType
);

// ── Envío al backend + acción según canal ──────────────────────────────────
const submitRequest = async (contactMethod) => {
  if (!isValid.value) {
    errorMsg.value = 'Por favor completa al menos tu nombre, correo, la ocasión y el tipo de joya.';
    return;
  }
  isSubmitting.value = true;
  errorMsg.value = '';

  try {
    // event_id compartido — mismo valor en navegador (Pixel) y servidor (CAPI)
    // para que Meta deduplique el evento Lead y no lo cuente dos veces.
    const eventId = 'lead_' + uuidv4();

    // Atribución de campaña — de qué anuncio vino esta cotización
    const attribution = getAttribution() || {};
    await api.post('/jewelry-requests', {
      ...form.value, contactMethod, eventId,
      utmSource: attribution.utm_source || null,
      utmMedium: attribution.utm_medium || null,
      utmCampaign: attribution.utm_campaign || null,
    });

    // Meta Pixel — Lead con dedup contra la Conversions API
    trackEmeraldForm(contactMethod, eventId);

    if (contactMethod === 'WHATSAPP') {
      const msg = buildWhatsAppMessage();
      const numero = '573136133822'; // ← cambia por tu número real
      window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
    }

    submitted.value = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (e) {
    errorMsg.value = 'Hubo un error al enviar tu consulta. Por favor intenta de nuevo.';
  } finally {
    isSubmitting.value = false;
  }
};

const buildWhatsAppMessage = () => {
  const f = form.value;
  return `¡Hola Cushion! Me gustaría cotizar una joya con esmeralda colombiana.\n\n` +
    `👤 *Nombre:* ${f.customerName}\n` +
    `📧 *Email:* ${f.customerEmail}\n` +
    (f.customerPhone ? `📱 *Teléfono:* ${f.customerPhone}\n` : '') +
    `\n💍 *Ocasión:* ${f.occasion}\n` +
    `✨ *Tipo de joya:* ${f.jewelryType}\n` +
    (f.gemstonePreference ? `💎 *Gema:* ${f.gemstonePreference}\n` : '') +
    (f.metalType ? `⚗️ *Metal:* ${f.metalType}\n` : '') +
    (f.budgetRange ? `💰 *Presupuesto:* ${f.budgetRange}\n` : '') +
    (f.ideas ? `\n📝 *Ideas:* ${f.ideas}` : '');
};

const resetForm = () => {
  submitted.value = false;
  form.value = {
    customerName: '', customerEmail: '', customerPhone: '',
    occasion: '', jewelryType: '', gemstonePreference: '',
    metalType: '', budgetRange: '', ideas: '',
  };
};
</script>

<template>
  <div class="bg-brand-black min-h-screen">

    <!-- ── HERO ─────────────────────────────────────────────────────────── -->
    <section class="relative py-28 md:py-40 overflow-hidden emerald-hero">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
             style="background: radial-gradient(circle, #4C7F62, transparent 70%);" />
        <div class="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
             style="background: radial-gradient(circle, #006B55, transparent 70%);" />
      </div>
      <div class="relative container mx-auto px-4 text-center">
        <p class="text-brand-gold font-sans-luxury text-xs tracking-wide mb-4">
          {{ L.t('em.hero.eyebrow') }}
        </p>
        <h1 class="font-serif-elegant text-4xl md:text-6xl text-brand-white mb-6 leading-tight">
          {{ L.t('em.hero.title1') }}<br>
          <span style="color:#4C7F62;">{{ L.t('em.hero.title2') }}</span>
        </h1>
        <p class="text-brand-white/70 font-sans-luxury text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {{ L.t('em.hero.desc') }}
        </p>
        <div class="flex flex-wrap justify-center gap-8 mt-12 text-center">
          <div v-for="stat in [
            { nKey: 'em.stat1n', lKey: 'em.stat1l' },
            { nKey: 'em.stat2n', lKey: 'em.stat2l' },
            { nKey: 'em.stat3n', lKey: 'em.stat3l' },
          ]" :key="stat.n">
            <p class="font-serif-elegant text-2xl md:text-3xl text-brand-gold">{{ L.t(stat.nKey) }}</p>
            <p class="font-sans-luxury text-xs text-brand-white/50 mt-1">{{ L.t(stat.lKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CONFIRMACIÓN (post-envío) ─────────────────────────────────────── -->
    <section v-if="submitted" class="py-24 container mx-auto px-4 max-w-2xl text-center">
      <Icon icon="lucide:check-circle" class="w-16 h-16 mx-auto mb-6" style="color:#4C7F62;" />
      <h2 class="font-serif-elegant text-3xl text-brand-white mb-4">{{ L.t('em.received') }}</h2>
      <p class="text-brand-white/60 font-sans-luxury text-sm leading-relaxed mb-8">
        {{ L.t('em.receivedText') }}
      </p>
      <button @click="resetForm"
              class="border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black
                     font-sans-luxury text-xs tracking-wide px-8 py-3 transition-colors duration-300">
        {{ L.t('em.another') }}
      </button>
    </section>

    <!-- ── FORMULARIO ─────────────────────────────────────────────────────── -->
    <section v-else class="py-16 md:py-24 container mx-auto px-4 max-w-4xl">

      <div class="text-center mb-14">
        <h2 class="font-serif-elegant text-3xl md:text-4xl text-brand-white mb-3">
          {{ L.t('em.formTitle') }}
        </h2>
        <p class="text-brand-white/50 font-sans-luxury text-sm">
          {{ L.t('em.formSub') }}
        </p>
      </div>

      <!-- Error -->
      <p v-if="errorMsg"
         class="text-red-400 text-xs font-sans-luxury text-center mb-8 bg-red-900/20 p-4 border border-red-900/50">
        {{ errorMsg }}
      </p>

      <div class="space-y-12">

        <!-- 1. Ocasión -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">{{ L.t('em.q.occasion') }}</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">{{ L.t('em.q.occasionSub') }}</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <button v-for="opt in occasions" :key="opt.value"
                    type="button"
                    @click="form.occasion = opt.value"
                    :class="[
                      'flex flex-col items-center gap-2 p-4 border transition-all duration-200 text-center',
                      form.occasion === opt.value
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-white'
                        : 'border-brand-white/10 text-brand-white/50 hover:border-brand-white/30 hover:text-brand-white'
                    ]">
              <Icon :icon="opt.icon" class="w-6 h-6" />
              <span class="font-sans-luxury text-xs">{{ L.t(opt.labelKey) }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Tipo de joya -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">{{ L.t('em.q.type') }}</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">{{ L.t('em.q.typeSub') }}</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <button v-for="opt in jewelryTypes" :key="opt.value"
                    type="button"
                    @click="form.jewelryType = opt.value"
                    :class="[
                      'flex flex-col items-center gap-2 p-4 border transition-all duration-200 text-center',
                      form.jewelryType === opt.value
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-white'
                        : 'border-brand-white/10 text-brand-white/50 hover:border-brand-white/30 hover:text-brand-white'
                    ]">
              <Icon :icon="opt.icon" class="w-6 h-6" />
              <span class="font-sans-luxury text-xs">{{ L.t(opt.labelKey) }}</span>
            </button>
          </div>
        </div>

        <!-- 3. Gema -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">{{ L.t('em.q.gem') }}</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">{{ L.t('em.q.gemSub') }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button v-for="opt in gemstones" :key="opt.value"
                    type="button"
                    @click="form.gemstonePreference = opt.value"
                    :class="[
                      'flex items-center gap-4 p-4 border text-left transition-all duration-200',
                      form.gemstonePreference === opt.value
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'border-brand-white/10 hover:border-brand-white/30'
                    ]">
              <div class="w-3 h-3 rounded-full border-2 flex-shrink-0 transition-colors"
                   :style="form.gemstonePreference === opt.value
                     ? 'border-color:#4C7F62; background:#4C7F62;'
                     : 'border-color:rgba(255,255,255,0.3);'" />
              <div>
                <p class="font-sans-luxury text-sm text-brand-white">{{ L.t(opt.labelKey) }}</p>
                <p class="font-sans-luxury text-xs text-brand-white/40 mt-0.5">{{ L.t(opt.subKey) }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- 4. Metal -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">{{ L.t('em.q.metal') }}</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">{{ L.t('em.optional') }}</p>
          <div class="flex flex-wrap gap-3">
            <button v-for="opt in metals" :key="opt.value"
                    type="button"
                    @click="form.metalType = opt.value"
                    :class="[
                      'px-5 py-2.5 border font-sans-luxury text-xs transition-all duration-200',
                      form.metalType === opt.value
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                        : 'border-brand-white/10 text-brand-white/50 hover:border-brand-white/30 hover:text-brand-white'
                    ]">
              {{ L.t(opt.labelKey) }}
            </button>
          </div>
        </div>

        <!-- 5. Presupuesto -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">{{ L.t('em.q.budget') }}</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">{{ L.t('em.q.budgetSub') }}</p>
          <div class="flex flex-wrap gap-3">
            <button v-for="opt in budgets" :key="opt.value"
                    type="button"
                    @click="form.budgetRange = opt.value"
                    :class="[
                      'px-5 py-2.5 border font-sans-luxury text-xs transition-all duration-200',
                      form.budgetRange === opt.value
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-white'
                        : 'border-brand-white/10 text-brand-white/50 hover:border-brand-white/30 hover:text-brand-white'
                    ]">
              {{ L.t(opt.labelKey) }}
            </button>
          </div>
        </div>

        <!-- 6. Ideas libres -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">{{ L.t('em.q.vision') }}</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">
            {{ L.t('em.visionHint') }}
          </p>
          <textarea
            v-model="form.ideas"
            rows="4"
            :placeholder="L.t('em.visionPlaceholder')"
            class="w-full bg-transparent border border-brand-white/10 px-4 py-3 text-brand-white
                   text-sm font-sans-luxury focus:outline-none focus:border-brand-primary
                   transition-colors placeholder:text-brand-white/20 resize-none"
          />
        </div>

        <!-- 7. Datos de contacto -->
        <div class="border-t border-brand-white/10 pt-10">
          <h3 class="font-serif-elegant text-xl text-brand-white mb-6">{{ L.t('em.q.contact') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-brand-white/40 text-[10px] font-sans-luxury tracking-wide block mb-2">
                {{ L.t('em.nameLabel') }}
              </label>
              <input v-model="form.customerName" type="text" required
                     :placeholder="L.t('em.namePlaceholder')"
                     class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3
                            text-brand-white text-sm font-sans-luxury focus:outline-none
                            focus:border-brand-primary transition-colors placeholder:text-brand-white/20" />
            </div>
            <div>
              <label class="text-brand-white/40 text-[10px] font-sans-luxury tracking-wide block mb-2">
                {{ L.t('em.emailLabel') }}
              </label>
              <input v-model="form.customerEmail" type="email" required
                     placeholder="tu@correo.com"
                     class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3
                            text-brand-white text-sm font-sans-luxury focus:outline-none
                            focus:border-brand-primary transition-colors placeholder:text-brand-white/20" />
            </div>
            <div class="md:col-span-2">
              <label class="text-brand-white/40 text-[10px] font-sans-luxury tracking-wide block mb-2">
                {{ L.t('em.phoneLabel') }}
              </label>
              <input v-model="form.customerPhone" type="tel"
                     placeholder="+57 300 000 0000"
                     class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3
                            text-brand-white text-sm font-sans-luxury focus:outline-none
                            focus:border-brand-primary transition-colors placeholder:text-brand-white/20" />
            </div>
          </div>
        </div>

        <!-- ── CTAs ──────────────────────────────────────────────────────── -->
        <div class="border-t border-brand-white/10 pt-10">
          <p class="text-brand-white/50 font-sans-luxury text-xs text-center mb-8">
            {{ L.t('em.chooseContact') }}
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- Opción 1: formulario → nosotros escribimos -->
            <button
              type="button"
              @click="submitRequest('FORMULARIO')"
              :disabled="isSubmitting"
              class="group flex flex-col items-center gap-3 p-6 border border-brand-white/20
                     hover:border-brand-white bg-transparent text-brand-white
                     transition-all duration-300 disabled:opacity-50">
              <Icon icon="lucide:mail" class="w-8 h-8 text-brand-white/60 group-hover:text-brand-white transition-colors" />
              <span class="font-serif-elegant text-lg">{{ L.t('em.submit') }}</span>
              <span class="font-sans-luxury text-xs text-brand-white/40 group-hover:text-brand-white/60 text-center">
                {{ L.t('em.submitSub') }}
              </span>
            </button>

            <!-- Opción 2: WhatsApp directo -->
            <button
              type="button"
              @click="submitRequest('WHATSAPP')"
              :disabled="isSubmitting"
              class="group flex flex-col items-center gap-3 p-6 border border-brand-primary/40
                     hover:border-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10
                     text-brand-white transition-all duration-300 disabled:opacity-50">
              <Icon icon="ic:baseline-whatsapp" class="w-8 h-8 text-brand-primary group-hover:text-brand-white transition-colors" />
              <span class="font-serif-elegant text-lg">{{ L.t('em.whatsapp') }}</span>
              <span class="font-sans-luxury text-xs text-brand-white/40 group-hover:text-brand-white/60 text-center">
                {{ L.t('em.whatsappSub') }}
              </span>
            </button>

          </div>

          <p class="text-brand-white/20 font-sans-luxury text-[10px] text-center mt-6">
            {{ L.t('em.privacy') }}
          </p>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
@reference "../assets/main.css";

.emerald-hero {
  background:
    repeating-linear-gradient(
      45deg,
      rgba(0, 150, 100, 0.03) 0px,
      rgba(0, 150, 100, 0.03) 1px,
      transparent 1px,
      transparent 14px
    ),
    linear-gradient(160deg, #001A14 0%, #002D20 30%, #003D30 60%, #001A14 100%);
}

/* Garantiza que el texto sobre el hero verde siempre sea claro,
   sin importar qué paleta global esté activa. */
.emerald-hero :deep(*) {
  --color-brand-white: var(--color-on-emerald);
}
</style>
