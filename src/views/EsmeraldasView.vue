<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

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
  { value: 'Compromiso / Matrimonio', icon: 'lucide:heart', label: 'Compromiso' },
  { value: 'Regalo especial', icon: 'lucide:gift', label: 'Regalo' },
  { value: 'Inversión en gemas', icon: 'lucide:trending-up', label: 'Inversión' },
  { value: 'Colección personal', icon: 'lucide:gem', label: 'Colección' },
  { value: 'Otra ocasión', icon: 'lucide:sparkles', label: 'Otra' },
];

const jewelryTypes = [
  { value: 'Anillo', icon: 'lucide:circle', label: 'Anillo' },
  { value: 'Collar / Dije', icon: 'lucide:link', label: 'Collar' },
  { value: 'Aretes', icon: 'lucide:droplets', label: 'Aretes' },
  { value: 'Pulsera', icon: 'lucide:watch', label: 'Pulsera' },
  { value: 'Libre / Sorpréndeme', icon: 'lucide:wand', label: 'Libre' },
];

const gemstones = [
  { value: 'Esmeralda sola', label: 'Esmeralda sola', sub: 'Protagonismo total de la piedra' },
  { value: 'Esmeralda con diamantes', label: 'Con diamantes', sub: 'Contraste clásico de lujo' },
  { value: 'Esmeralda con otras gemas', label: 'Combinada', sub: 'Zafiros, rubíes u otras' },
  { value: 'Abierto a sugerencias', label: 'Me guío por ustedes', sub: 'Asesoría experta' },
];

const metals = [
  { value: 'Oro amarillo', label: 'Oro amarillo' },
  { value: 'Oro blanco', label: 'Oro blanco' },
  { value: 'Oro rosado', label: 'Oro rosado' },
  { value: 'Platino', label: 'Platino' },
  { value: 'Sin preferencia', label: 'Sin preferencia' },
];

const budgets = [
  { value: 'Menos de $5.000.000', label: 'Menos de $5M' },
  { value: '$5.000.000 - $15.000.000', label: '$5M – $15M' },
  { value: '$15.000.000 - $30.000.000', label: '$15M – $30M' },
  { value: '$30.000.000 - $60.000.000', label: '$30M – $60M' },
  { value: 'Más de $60.000.000', label: '+$60M' },
  { value: 'Abierto a cotización', label: 'Cotizar' },
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
    await api.post('/jewelry-requests', { ...form.value, contactMethod });

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
          Esmeraldas Colombianas
        </p>
        <h1 class="font-serif-elegant text-4xl md:text-6xl text-brand-white mb-6 leading-tight">
          Tu esmeralda,<br>
          <span style="color:#4C7F62;">diseñada para ti</span>
        </h1>
        <p class="text-brand-white/70 font-sans-luxury text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Colombia es el mayor productor de esmeraldas del mundo.
          Cada piedra tiene su propia historia — y la tuya está esperando ser escrita.
          Cuéntanos qué buscas y nuestros expertos te guiarán hacia la pieza perfecta.
        </p>
        <div class="flex flex-wrap justify-center gap-8 mt-12 text-center">
          <div v-for="stat in [
            { n: '+30 años', l: 'de experiencia en gemas' },
            { n: '100%', l: 'esmeraldas certificadas' },
            { n: 'Origen', l: 'Boyacá, Colombia' },
          ]" :key="stat.n">
            <p class="font-serif-elegant text-2xl md:text-3xl text-brand-gold">{{ stat.n }}</p>
            <p class="font-sans-luxury text-xs text-brand-white/50 mt-1">{{ stat.l }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CONFIRMACIÓN (post-envío) ─────────────────────────────────────── -->
    <section v-if="submitted" class="py-24 container mx-auto px-4 max-w-2xl text-center">
      <Icon icon="lucide:check-circle" class="w-16 h-16 mx-auto mb-6" style="color:#4C7F62;" />
      <h2 class="font-serif-elegant text-3xl text-brand-white mb-4">¡Consulta recibida!</h2>
      <p class="text-brand-white/60 font-sans-luxury text-sm leading-relaxed mb-8">
        Hemos guardado tu solicitud. Si elegiste contacto por formulario, te escribiremos
        en las próximas <strong class="text-brand-white">24 horas hábiles</strong>.
        Si elegiste WhatsApp, ya se abrió el chat — ¡solo envía el mensaje!
      </p>
      <button @click="resetForm"
              class="border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black
                     font-sans-luxury text-xs tracking-wide px-8 py-3 transition-colors duration-300">
        Enviar otra consulta
      </button>
    </section>

    <!-- ── FORMULARIO ─────────────────────────────────────────────────────── -->
    <section v-else class="py-16 md:py-24 container mx-auto px-4 max-w-4xl">

      <div class="text-center mb-14">
        <h2 class="font-serif-elegant text-3xl md:text-4xl text-brand-white mb-3">
          Cuéntanos tu visión
        </h2>
        <p class="text-brand-white/50 font-sans-luxury text-sm">
          Entre más detalles nos des, mejor podemos acercarte a tu esmeralda ideal.
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
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">¿Para qué ocasión?</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">Selecciona la que más se acerque</p>
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
              <span class="font-sans-luxury text-xs">{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Tipo de joya -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">¿Qué tipo de joya?</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">¿Tienes algo en mente?</p>
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
              <span class="font-sans-luxury text-xs">{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- 3. Gema -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">¿Cómo quieres la gema?</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">Opcional, pero nos ayuda mucho</p>
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
                <p class="font-sans-luxury text-sm text-brand-white">{{ opt.label }}</p>
                <p class="font-sans-luxury text-xs text-brand-white/40 mt-0.5">{{ opt.sub }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- 4. Metal -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">Preferencia de metal</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">Opcional</p>
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
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- 5. Presupuesto -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">Presupuesto aproximado</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">Sin compromiso — solo para orientarte mejor</p>
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
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- 6. Ideas libres -->
        <div>
          <h3 class="font-serif-elegant text-xl text-brand-white mb-2">Tu visión en palabras</h3>
          <p class="text-brand-white/40 text-xs font-sans-luxury mb-5">
            Cuéntanos todo: inspiraciones, referencias, diseñadores que te gusten, colores, etc.
          </p>
          <textarea
            v-model="form.ideas"
            rows="4"
            placeholder="Ejemplo: Busco un anillo de compromiso con esmeralda tipo cabochon, inspirado en joyería art déco, algo atemporal..."
            class="w-full bg-transparent border border-brand-white/10 px-4 py-3 text-brand-white
                   text-sm font-sans-luxury focus:outline-none focus:border-brand-primary
                   transition-colors placeholder:text-brand-white/20 resize-none"
          />
        </div>

        <!-- 7. Datos de contacto -->
        <div class="border-t border-brand-white/10 pt-10">
          <h3 class="font-serif-elegant text-xl text-brand-white mb-6">¿Cómo te contactamos?</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-brand-white/40 text-[10px] font-sans-luxury tracking-wide block mb-2">
                Nombre completo *
              </label>
              <input v-model="form.customerName" type="text" required
                     placeholder="Tu nombre"
                     class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3
                            text-brand-white text-sm font-sans-luxury focus:outline-none
                            focus:border-brand-primary transition-colors placeholder:text-brand-white/20" />
            </div>
            <div>
              <label class="text-brand-white/40 text-[10px] font-sans-luxury tracking-wide block mb-2">
                Correo electrónico *
              </label>
              <input v-model="form.customerEmail" type="email" required
                     placeholder="tu@correo.com"
                     class="w-full bg-transparent border-b border-brand-white/20 px-0 py-3
                            text-brand-white text-sm font-sans-luxury focus:outline-none
                            focus:border-brand-primary transition-colors placeholder:text-brand-white/20" />
            </div>
            <div class="md:col-span-2">
              <label class="text-brand-white/40 text-[10px] font-sans-luxury tracking-wide block mb-2">
                WhatsApp / Teléfono (opcional)
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
            Elige cómo quieres que te contactemos
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
              <span class="font-serif-elegant text-lg">Enviar consulta</span>
              <span class="font-sans-luxury text-xs text-brand-white/40 group-hover:text-brand-white/60 text-center">
                Completa el formulario y nuestro equipo te contacta en 24 horas
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
              <span class="font-serif-elegant text-lg">Continuar por WhatsApp</span>
              <span class="font-sans-luxury text-xs text-brand-white/40 group-hover:text-brand-white/60 text-center">
                Abre el chat con tu info pre-llenada y habla directo con un experto
              </span>
            </button>

          </div>

          <p class="text-brand-white/20 font-sans-luxury text-[10px] text-center mt-6">
            Tu información es confidencial y nunca será compartida con terceros.
          </p>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
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
</style>
