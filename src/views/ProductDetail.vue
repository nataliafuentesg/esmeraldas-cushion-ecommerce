<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from '@/api/axios';
import { useCartStore } from '@/stores/cart'; // Importamos el store
import { Icon } from '@iconify/vue';
import ProductGallery from '@/components/ProductGallery.vue';
import RelatedProducts from '@/components/RelatedProducts.vue';

const props = defineProps({
  slug: { type: String, required: true }
});

const cartStore = useCartStore(); // Instancia del store

// Estados de Datos
const product = ref(null);
const allProducts = ref([]);
const loading = ref(true);
const selectedQuantity = ref(1);
const whatsappLink = ref('');

// Estados del Formulario y Alertas
const newReview = ref({ author: '', rating: 0, comment: '', subtitleVerification: '' });
const isSubmitting = ref(false);
const feedback = ref({ show: false, type: 'success', message: '' });
const hoverRating = ref(0);

const fetchProduct = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/products/${props.slug}`);
    const data = res.data;
    
    product.value = { 
        ...data, 
        gallery: data.images.map((img, i) => ({ id: i, src: img.imageUrl, alt: data.name })),
        mainImage: data.images[0]?.imageUrl // Importante para el carrito
    };

    const msg = `Hola, quiero asesoría para la pieza: *${product.value.name}*`;
    whatsappLink.value = `https://wa.me/573001234567?text=${encodeURIComponent(msg)}`;

    const all = await api.get('/products');
    allProducts.value = all.data;
  } catch (err) {
    showFeedback('error', 'No pudimos cargar los detalles de esta pieza.');
  } finally {
    loading.value = false;
  }
};

// FUNCIONES DEL CARRITO
const addToCart = async () => {
  await cartStore.addItem(product.value, selectedQuantity.value);
  cartStore.isOffCanvasOpen = true; // ABRIR EL CARRITO AUTOMÁTICAMENTE
};

const increaseQty = () => selectedQuantity.value++;
const decreaseQty = () => { if (selectedQuantity.value > 1) selectedQuantity.value--; };

// ... (resto de funciones de feedback y submitReview iguales)
const showFeedback = (type, message) => {
  feedback.value = { show: true, type, message };
  if (type === 'success') setTimeout(() => feedback.value.show = false, 5000);
};

const submitReview = async () => {
  if (newReview.value.rating === 0) return showFeedback('error', 'Selecciona una valoración.');
  isSubmitting.value = true;
  try {
    const res = await api.post(`/products/${props.slug}/reviews`, newReview.value);
    product.value.reviews.unshift(res.data);
    showFeedback('success', '¡Reseña publicada!');
    newReview.value = { author: '', rating: 0, comment: '', subtitleVerification: '' };
  } catch (err) {
    showFeedback('error', 'Error al enviar.');
  } finally { isSubmitting.value = false; }
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

  <div v-else-if="product" class="bg-brand-black min-h-screen py-16">
    <div class="container mx-auto px-4 lg:px-20">
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
        <ProductGallery :images="product.gallery" :product-name="product.name" />

        <div class="flex flex-col justify-center">
          <span class="text-brand-gold text-[10px] tracking-[0.5em] uppercase mb-4">{{ product.category }}</span>
          <h1 class="text-5xl font-serif-elegant text-brand-white mb-6 uppercase">{{ product.name }}</h1>
          <p class="text-2xl text-brand-white/70 mb-8">$ {{ product.price.toLocaleString() }}</p>
          <p class="text-brand-white/50 leading-relaxed font-sans-luxury italic mb-12">"{{ product.description }}"</p>
          
          <div class="space-y-6 mb-12">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex items-center border border-brand-white/20 h-14 bg-brand-white/5">
                <button @click="decreaseQty" class="w-12 h-full text-brand-white hover:bg-white/10 transition-colors">-</button>
                <input type="text" v-model="selectedQuantity" readonly class="w-12 text-center bg-transparent text-brand-white font-sans-luxury outline-none" />
                <button @click="increaseQty" class="w-12 h-full text-brand-white hover:bg-white/10 transition-colors">+</button>
              </div>
              <button @click="addToCart" class="flex-1 bg-brand-primary text-brand-black font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-brand-gold transition-all duration-500 flex items-center justify-center">
                Añadir a la Colección
              </button>
            </div>
            <a :href="whatsappLink" target="_blank" class="flex items-center justify-center w-full border border-brand-primary text-brand-primary h-14 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-brand-primary/10 transition-colors">
              <Icon icon="lucide:whatsapp" class="w-4 h-4 mr-3" /> Asesoría por WhatsApp
            </a>
          </div>

          <div class="grid grid-cols-2 gap-4 border-t border-brand-white/10 pt-8 text-[11px] uppercase tracking-widest text-brand-white/40">
            <div>Gema: <span class="text-brand-white ml-2">{{ product.gemstoneType }}</span></div>
            <div>Metal: <span class="text-brand-white ml-2">{{ product.metalType }}</span></div>
          </div>
        </div>
      </div>

      <section class="max-w-4xl mx-auto border-t border-brand-white/10 pt-20">
         </section>

      <section class="mt-32 pb-20">
        <RelatedProducts :related-products="relatedProducts" />
      </section>
    </div>
  </div>
</template>