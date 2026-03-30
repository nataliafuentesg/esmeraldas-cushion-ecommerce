<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from '@/api/axios';
import { useCartStore } from '@/stores/cart';
import { Icon } from '@iconify/vue';
import ProductGallery from '@/components/ProductGallery.vue';
import RelatedProducts from '@/components/RelatedProducts.vue';

const props = defineProps({
  slug: { type: String, required: true }
});

const cartStore = useCartStore();

// --- ESTADOS DE DATOS ---
const product = ref(null);
const allProducts = ref([]);
const loading = ref(true);
const selectedQuantity = ref(1);

const newReview = ref({ author: '', rating: 0, comment: '', subtitleVerification: '' });
const isSubmitting = ref(false);
const feedback = ref({ show: false, type: 'success', message: '' });
const hoverRating = ref(0);

const fetchProduct = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/products/${props.slug}`);

    product.value = res.data;

    const all = await api.get('/products');
    allProducts.value = all.data;
  } catch (err) {
    showFeedback('error', 'No se pudo conectar con la base de datos de Cushion.');
  } finally {
    loading.value = false;
  }
};

const showFeedback = (type, message) => {
  feedback.value = { show: true, type, message };
  if (type === 'success') setTimeout(() => feedback.value.show = false, 5000);
};

// --- LÓGICA DEL CARRITO ---
const addToCart = async () => {
  if (selectedQuantity.value > product.value.stock) {
    return showFeedback('error', `Solo tenemos ${product.value.stock} unidades disponibles.`);
  }
  await cartStore.addItem(product.value, selectedQuantity.value);
  cartStore.isOffCanvasOpen = true;
};

// --- LÓGICA DE RESEÑAS ---
const submitReview = async () => {
  if (newReview.value.rating === 0) return showFeedback('error', 'Por favor selecciona una calificación.');
  if (newReview.value.comment.length < 10) return showFeedback('error', 'El comentario debe tener al menos 10 caracteres.');

  isSubmitting.value = true;
  try {
    const res = await api.post(`/products/${props.slug}/reviews`, newReview.value);
    if (!product.value.reviews) product.value.reviews = [];
    product.value.reviews.unshift(res.data);

    showFeedback('success', 'Tu reseña ha sido publicada con éxito.');
    newReview.value = { author: '', rating: 0, comment: '', subtitleVerification: '' };
  } catch (err) {
    const msg = err.response?.data?.message || 'Error al enviar la reseña.';
    showFeedback('error', msg);
  } finally {
    isSubmitting.value = false;
  }
};

const relatedProducts = computed(() => {
  if (!product.value) return [];
  return allProducts.value.filter(p => p.category === product.value.category && p.id !== product.value.id).slice(0, 4);
});

watch(() => props.slug, fetchProduct);
onMounted(fetchProduct);
</script>

<template>
  <div v-if="loading" class="bg-brand-black min-h-screen flex items-center justify-center">
    <Icon icon="line-md:loading-twotone-loop" class="text-brand-gold w-12 h-12" />
  </div>

  <div v-else-if="product" class="bg-brand-black min-h-screen py-10 lg:py-20">
    <div class="container mx-auto px-4 lg:px-20">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-32">

        <div class="w-full lg:sticky lg:top-24 self-start">
          <ProductGallery :images="product.images" :product-name="product.name" />
        </div>

        <div class="flex flex-col">

          <div class="flex items-center gap-4 mb-6">
            <span class="text-brand-gold text-[10px] tracking-[0.5em] uppercase font-bold">{{ product.category }}</span>
            <span v-if="product.featured"
              class="bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-3 py-1 text-[8px] font-bold uppercase tracking-widest">Pieza
              Exclusiva</span>
          </div>

          <h1
            class="text-4xl md:text-5xl xl:text-6xl font-serif-elegant text-brand-white mb-6 uppercase leading-tight tracking-wide">
            {{ product.name }}
          </h1>

          <p class="text-3xl text-brand-white/80 mb-10 font-serif-elegant tracking-tighter">
            $ {{ product.price.toLocaleString() }}
          </p>

          <div class="border-l-2 border-brand-gold pl-8 mb-12">
            <p class="text-brand-white/60 leading-relaxed font-sans-luxury italic text-base">
              "{{ product.description }}"
            </p>
          </div>

          <div class="bg-brand-white/[0.03] border border-brand-white/10 p-10 mb-12">
            <h3 class="text-brand-gold text-[10px] uppercase tracking-[0.4em] mb-10 border-b border-brand-gold/20 pb-4">
              Especificaciones de la Joya</h3>

            <div class="grid grid-cols-2 gap-y-10 gap-x-8">
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/30 mb-2">Gema Principal</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.gemstoneType || 'Esmeralda'
                  }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/30 mb-2">Talla / Corte</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.cutType || 'Clásico'
                  }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/30 mb-2">Peso Carates</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.caratWeight || 'N/A'
                  }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/30 mb-2">Metal Precioso</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.metalType || 'Oro 18k'
                  }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/30 mb-2">Claridad</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.clarity || 'Alta' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/30 mb-2">Disponibilidad</span>
                <span class="text-brand-gold text-sm font-bold uppercase tracking-widest">{{ product.stock }}
                  UNIDADES</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <div
              class="flex items-center border border-brand-white/20 h-16 bg-brand-white/5 w-full sm:w-32 justify-between px-4">
              <button @click="selectedQuantity > 1 ? selectedQuantity-- : null"
                class="text-brand-white hover:text-brand-gold transition-colors text-xl font-light">-</button>
              <span class="text-brand-white font-bold">{{ selectedQuantity }}</span>
              <button @click="selectedQuantity < product.stock ? selectedQuantity++ : null"
                class="text-brand-white hover:text-brand-gold transition-colors text-xl font-light">+</button>
            </div>

            <button @click="addToCart"
              class="flex-1 h-16 bg-brand-gold text-brand-black font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-white transition-all duration-300 shadow-lg flex items-center justify-center">
              Añadir a la Selección
            </button>
          </div>

        </div>
      </div>
      <section class="max-w-5xl mx-auto border-t border-brand-white/10 pt-24 pb-32">
        <h2 class="font-serif-elegant text-brand-white text-4xl text-center mb-20 tracking-[0.3em] uppercase">
          Testimonios <span class="text-brand-gold">Cushion</span>
        </h2>

        <div v-if="product.reviews?.length" class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div v-for="rev in product.reviews" :key="rev.id"
            class="bg-brand-white/[0.02] p-10 border border-brand-white/5 relative group">
            <Icon icon="bi:quote" class="absolute top-6 right-8 text-brand-gold/10 w-12 h-12" />
            <div class="flex text-brand-gold mb-4 gap-1">
              <Icon v-for="i in 5" :key="i"
                :icon="i <= rev.rating ? 'material-symbols:star' : 'material-symbols:star-outline'" class="w-4 h-4" />
            </div>
            <p class="text-brand-white/70 text-base leading-relaxed mb-8 italic font-sans-luxury">"{{ rev.comment }}"
            </p>
            <div class="flex items-center gap-4 border-t border-brand-white/10 pt-6">
              <div
                class="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-xs">
                {{ rev.author.charAt(0) }}
              </div>
              <span class="text-[10px] text-brand-gold uppercase tracking-[0.3em] font-bold">{{ rev.author }}</span>
            </div>
          </div>
        </div>

        <div class="max-w-3xl mx-auto bg-brand-white/[0.03] p-12 border border-brand-white/10 relative overflow-hidden">

          <transition name="fade">
            <div v-if="feedback.show" :class="feedback.type === 'success' ? 'bg-green-950/95' : 'bg-red-950/95'"
              class="absolute inset-0 z-40 flex flex-col items-center justify-center text-center p-10 backdrop-blur-md">
              <Icon :icon="feedback.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'"
                class="w-16 h-16 text-white mb-6" />
              <p class="text-white font-serif-elegant text-2xl uppercase tracking-widest">{{ feedback.message }}</p>
              <button @click="feedback.show = false"
                class="mt-10 border border-white/30 px-10 py-3 text-[10px] uppercase text-white tracking-widest hover:bg-white hover:text-black transition-all">Regresar</button>
            </div>
          </transition>

          <form @submit.prevent="submitReview" class="space-y-12">
            <div class="hidden-trap" aria-hidden="true">
              <input v-model="newReview.subtitleVerification" type="text" tabindex="-1">
            </div>

            <div class="flex flex-col items-center">
              <span class="text-[10px] uppercase tracking-[0.5em] text-brand-white/30 mb-8">¿Cuál es su
                valoración?</span>
              <div class="flex gap-4">
                <button v-for="i in 5" :key="i" type="button" @click="newReview.rating = i"
                  @mouseenter="hoverRating = i" @mouseleave="hoverRating = 0"
                  class="transform hover:scale-125 transition-transform duration-300">
                  <Icon
                    :icon="i <= (hoverRating || newReview.rating) ? 'material-symbols:star' : 'material-symbols:star-outline'"
                    class="w-12 h-12 transition-colors"
                    :class="i <= (hoverRating || newReview.rating) ? 'text-brand-gold' : 'text-brand-white/10'" />
                </button>
              </div>
            </div>

            <div class="flex flex-col space-y-3">
              <label class="text-[10px] uppercase tracking-[0.3em] text-brand-gold ml-1">Su Nombre</label>
              <input v-model="newReview.author" type="text" placeholder="Escriba su nombre completo" required
                class="bg-transparent border-b border-brand-white/20 py-4 text-sm text-brand-white focus:border-brand-gold outline-none transition-all">
            </div>

            <div class="flex flex-col space-y-3">
              <label class="text-[10px] uppercase tracking-[0.3em] text-brand-gold ml-1">Su Experiencia</label>
              <textarea v-model="newReview.comment" placeholder="Describa los detalles de su pieza..." rows="5" required
                class="w-full bg-brand-white/5 border border-brand-white/10 p-6 text-sm text-brand-white focus:border-brand-gold outline-none resize-none leading-relaxed transition-all"></textarea>
            </div>

            <button type="submit" :disabled="isSubmitting"
              class="w-full h-16 bg-brand-gold text-brand-black font-bold uppercase text-[11px] tracking-[0.5em] hover:bg-white transition-all flex items-center justify-center">
              <span v-if="!isSubmitting">Publicar en el Registro</span>
              <Icon v-else icon="line-md:loading-twotone-loop" class="w-8 h-8" />
            </button>
          </form>
        </div>
      </section>

      <section class="mt-20">
        <RelatedProducts :related-products="relatedProducts" />
      </section>

    </div>
  </div>
</template>

<style scoped>
.hidden-trap {
  opacity: 0;
  position: absolute;
  height: 0;
  width: 0;
  z-index: -1;
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar Personalizada para Lujo */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: #050505;
}

::-webkit-scrollbar-thumb {
  background: #B89B6A;
}
</style>