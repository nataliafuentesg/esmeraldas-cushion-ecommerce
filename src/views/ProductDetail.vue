<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import ProductGallery from '@/components/ProductGallery.vue';
import RelatedProducts from '@/components/RelatedProducts.vue';
import { useHead } from '@unhead/vue';

const route = useRoute();
const router = useRouter();

const props = defineProps({
  slug: { type: String, required: true }
});

const cartStore = useCartStore();
const authStore = useAuthStore();
const product = ref(null);
const allProducts = ref([]);
const loading = ref(true);
const selectedQuantity = ref(1);

const toast = ref({ show: false, message: '', type: 'error' });

const showToast = (message, type = 'error') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 4000);
};

// ✨ MANEJO SÓLIDO DEL GO BACK CONTRA CAÍDAS AL FOOTER
const handleGoBack = () => {
  // Leemos la posición exacta que congelamos en la sesión antes de salir de la colección
  const savedState = sessionStorage.getItem('collection_state');
  
  router.back();

  if (savedState) {
    const { scrollPosition } = JSON.parse(savedState);
    // Ejecutamos micro-fuerzas de posicionamiento secuenciales para ganarle el tiro a la carga de imágenes
    setTimeout(() => {
      window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    }, 40);
    setTimeout(() => {
      window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    }, 120);
  }
};

// Lógica de Reseñas Restaurada y Actualizada
const reviews = ref([]);
const newReview = ref({ 
  rating: 5, 
  author: authStore.user?.name || authStore.user?.firstName || '', 
  comment: '' 
});
const isSubmittingReview = ref(false);

useHead({
  title: computed(() => product.value ? `${product.value.name} | Cushion Joyería de Lujo` : 'Cargando Pieza...'),
  meta: [
    { name: 'description', content: computed(() => product.value ? product.value.description : 'Explora nuestra colección exclusiva.') },
    { property: 'og:title', content: computed(() => product.value?.name) },
    { property: 'og:description', content: computed(() => product.value?.description) },
    { property: 'og:image', content: computed(() => product.value?.images?.[0]) },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.value?.name,
        "image": product.value?.images,
        "description": product.value?.description,
        "offers": {
          "@type": "Offer",
          "price": product.value?.price,
          "priceCurrency": "COP",
          "availability": "https://schema.org/InStock"
        }
      }))
    }
  ]
});

const fetchProduct = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/products/${props.slug}`);
    product.value = res.data;

    reviews.value = product.value.reviews || [];

    const all = await api.get('/products');
    allProducts.value = all.data;
  } catch (err) {
    console.error("Error conectando con la base de datos:", err);
  } finally {
    loading.value = false;
  }
};

const addToCart = async () => {
  if (!product.value) return;
  await cartStore.addItem(product.value, selectedQuantity.value);
  cartStore.isOffCanvasOpen = true; 
};

const submitReview = async () => {
  if (!authStore.isAuthenticated) {
    showToast("Debes iniciar sesión para dejar una reseña.", "error");
    return;
  }
  
  if (newReview.value.comment.trim().length < 10) {
    showToast("Por favor, detalla más tu experiencia (mínimo 10 caracteres).", "error");
    return;
  }

  isSubmittingReview.value = true;
  try {
    await api.post(`/products/${props.slug}/reviews`, {
      author: newReview.value.author || 'Cliente Cushion',
      rating: newReview.value.rating,
      comment: newReview.value.comment
    });
    
    await fetchProduct();
    
    newReview.value.comment = '';
    newReview.value.rating = 5;
    
    showToast("¡Gracias! Tu reseña ha sido publicada.", "success");
    
  } catch (error) {
    console.error("Error enviando reseña:", error);
    if (error.response && error.response.data) {
       showToast(error.response.data.message || error.response.data.error || "Hubo un error al publicar.", "error");
    } else {
       showToast("Problema de conexión al enviar la reseña.", "error");
    }
  } finally {
    isSubmittingReview.value = false;
  }
};

const relatedProducts = computed(() => {
  if (!product.value || !allProducts.value) return [];
  const inStock = allProducts.value.filter(p => p.stock > 0 && p.id !== product.value.id);
  const sameCategory = inStock.filter(p => p.category === product.value.category);
  return sameCategory.length > 0 ? sameCategory.slice(0, 4) : inStock.slice(0, 4);
});

watch(() => props.slug, () => {
  fetchProduct();
}, { immediate: true });
</script>

<template>
  <div v-if="loading" class="bg-brand-black min-h-screen flex items-center justify-center">
    <Icon icon="line-md:loading-twotone-loop" class="text-brand-gold w-12 h-12" />
  </div>

  <div v-else-if="product" class="bg-brand-black min-h-screen py-6 lg:py-12">
    <div class="container mx-auto px-4 lg:px-20">
      
      <div class="mb-8 md:mb-12">
        <button 
          @click="handleGoBack" 
          class="group flex items-center gap-2 text-brand-white/40 hover:text-brand-gold text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 py-2"
        >
          <Icon 
            icon="lucide:arrow-left" 
            class="w-3 h-3 transform group-hover:-translate-x-1 transition-transform duration-300 text-brand-gold/60 group-hover:text-brand-gold" 
          />
          <span>Volver a la Colección</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-20">
        <div class="w-full lg:sticky lg:top-24 self-start main-gallery-wrapper">
          <ProductGallery :images="product.images" :product-name="product.name" />
          
          <div class="block lg:hidden text-center mt-3 text-[9px] uppercase tracking-[0.2em] text-brand-white/30 font-sans-luxury">
            <Icon icon="lucide:maximize-2" class="inline-block w-3 h-3 mr-1 text-brand-gold/50" />
            Presiona para ampliar • Desliza para explorar detalles
          </div>
        </div>

        <div class="flex flex-col">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <span class="text-brand-gold text-[10px] tracking-[0.5em] uppercase font-bold">{{ product.category }}</span>
            <span v-if="product.featured" class="bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-3 py-1 text-[8px] font-bold uppercase tracking-widest">Pieza Exclusiva</span>
          </div>

          <h1 class="text-2xl md:text-3xl lg:text-4xl font-serif-elegant text-brand-white mb-4 uppercase leading-tight tracking-wide">
            {{ product.name }}
          </h1>

          <p class="text-2xl md:text-3xl text-brand-white/90 mb-8 font-serif-elegant tracking-tight">
            $ {{ product.price.toLocaleString() }}
          </p>

          <div class="border-l-2 border-brand-gold pl-6 mb-10">
            <p class="text-brand-white/75 leading-relaxed font-sans-luxury italic text-sm md:text-base">
              "{{ product.description }}"
            </p>
          </div>

          <div class="bg-brand-white/[0.03] border border-brand-white/10 p-6 md:p-10 mb-8">
            <h3 class="text-brand-gold text-[10px] uppercase tracking-[0.4em] mb-8 border-b border-brand-gold/20 pb-4">
              Certificado de Joyería
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div v-if="product.gemstoneType?.trim()" class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/40 mb-1">Gema Principal</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.gemstoneType }}</span>
              </div>
              <div v-if="product.cutType?.trim()" class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/40 mb-1">Talla / Corte</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.cutType }}</span>
              </div>
              <div v-if="product.caratWeight?.trim()" class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/40 mb-1">Peso Carates (ct)</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.caratWeight }}</span>
              </div>
              <div v-if="product.totalWeight?.trim()" class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/40 mb-1">Peso de la Pieza</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.totalWeight }}</span>
              </div>
              <div v-if="product.metalType?.trim()" class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/40 mb-1">Metal Precioso</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.metalType }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch gap-4" v-if="product.stock > 0">
            <div class="flex items-center justify-between border border-brand-white/20 bg-brand-white/[0.02] px-4 py-3 sm:w-32">
              <button @click="selectedQuantity > 1 && selectedQuantity--" class="text-brand-white/60 hover:text-brand-gold text-lg px-2">-</button>
              <span class="text-brand-white font-sans-luxury text-sm font-bold">{{ selectedQuantity }}</span>
              <button @click="selectedQuantity < product.stock && selectedQuantity++" class="text-brand-white/60 hover:text-brand-gold text-lg px-2">+</button>
            </div>
            <button @click="addToCart" class="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-bold uppercase tracking-[0.2em] text-xs py-4 px-8 flex items-center justify-center gap-3">
              <Icon icon="ph:shopping-bag-light" class="w-5 h-5" /> Añadir a la bolsa Compra
            </button>
          </div>
          <div v-else class="bg-red-950/20 border border-red-900/40 p-4 text-center">
            <span class="text-red-400 text-xs uppercase tracking-widest font-bold">Sin Stock Disponible</span>
          </div>

        </div>
      </div>

      <section class="mt-20 pt-16 border-t border-brand-white/10">
        <h3 class="text-2xl font-serif-elegant text-brand-white uppercase tracking-widest mb-10 text-center">Reseñas de Clientes</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div class="bg-brand-white/[0.02] border border-brand-white/5 p-8 h-fit">
            <h4 class="text-brand-gold text-xs uppercase tracking-widest mb-6 border-b border-brand-white/10 pb-4">Dejar un comentario</h4>
            
            <form v-if="authStore.isAuthenticated" @submit.prevent="submitReview" class="space-y-6">
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] text-brand-white/50 uppercase tracking-widest mb-2">Calificación</label>
                  <div class="flex gap-2">
                    <Icon 
                      v-for="star in 5" :key="star" 
                      :icon="star <= newReview.rating ? 'lucide:star' : 'lucide:star'"
                      :class="star <= newReview.rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-white/20'"
                      class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                      @click="newReview.rating = star"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] text-brand-white/50 uppercase tracking-widest mb-2">Tu Nombre</label>
                  <input 
                    v-model="newReview.author" 
                    type="text" 
                    required
                    placeholder="Ej: María P." 
                    class="w-full bg-brand-black border border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none font-sans-luxury"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-[10px] text-brand-white/50 uppercase tracking-widest mb-2">Tu Experiencia</label>
                <textarea 
                  v-model="newReview.comment" 
                  rows="4" 
                  required
                  placeholder="Comparte tu experiencia con esta joya..." 
                  class="w-full bg-brand-black border border-brand-white/20 p-4 text-brand-white text-sm focus:border-brand-gold outline-none resize-none font-sans-luxury"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                :disabled="isSubmittingReview"
                class="w-full border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black uppercase text-xs tracking-widest py-3 transition-colors disabled:opacity-50"
              >
                {{ isSubmittingReview ? 'Enviando...' : 'Publicar Reseña' }}
              </button>
            </form>
            
            <div v-else class="text-center py-10">
              <p class="text-brand-white/50 text-sm mb-4 font-sans-luxury">Debes iniciar sesión para dejar una reseña.</p>
              <RouterLink to="/auth" class="text-brand-gold uppercase text-[10px] tracking-widest border-b border-brand-gold pb-1 hover:text-brand-white transition-colors">
                Iniciar Sesión
              </RouterLink>
            </div>
          </div>

          <div class="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            <div v-if="reviews.length === 0" class="text-center py-10 text-brand-white/40 text-sm italic font-sans-luxury border border-brand-white/5">
              Aún no hay reseñas para esta pieza.
            </div>
            
            <div v-for="review in reviews" :key="review.id" class="border-b border-brand-white/10 pb-6 mb-6 last:border-0">
              <div class="flex justify-between items-start mb-2">
                <span class="text-brand-white font-serif-elegant uppercase tracking-wide text-sm">{{ review.author || 'Cliente Cushion' }}</span>
                <span class="text-brand-white/30 text-[10px] tracking-widest">{{ new Date(review.date || Date.now()).toLocaleDateString() }}</span>
              </div>
              <div class="flex gap-1 mb-3">
                <Icon 
                  v-for="star in 5" :key="star" 
                  icon="lucide:star"
                  :class="star <= review.rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-white/20'"
                  class="w-3 h-3"
                />
              </div>
              <p class="text-brand-white/70 text-sm font-sans-luxury leading-relaxed">
                "{{ review.comment }}"
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-20 border-t border-brand-white/10 pt-20">
        <RelatedProducts :related-products="relatedProducts" />
      </section>

    </div>
    <Transition name="toast-fade">
      <div v-if="toast.show" 
           class="fixed top-24 right-4 md:right-8 z-50 flex items-center gap-3 px-6 py-4 shadow-2xl border backdrop-blur-md max-w-sm"
           :class="toast.type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-200' : 'bg-brand-black/95 border-brand-gold/50 text-brand-gold'">
        
        <Icon :icon="toast.type === 'error' ? 'lucide:alert-circle' : 'lucide:check-circle'" class="w-5 h-5 shrink-0" />
        <p class="font-sans-luxury text-xs uppercase tracking-widest leading-relaxed">
          {{ toast.message }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c5a880;
    border-radius: 2px;
}

/* ✨ REGLAS GLOBALES DE INTERFACES DE LUJO PARA CONTROL DE ZOOM EN MÓVILES */
@media (max-width: 1024px) {
  /* Obliga al contenedor de la imagen a aislar el desborde táctil para evitar saltos horizontales de pantalla */
  :deep(.main-gallery-wrapper), 
  :deep(.product-gallery-container) {
    overflow: hidden !important;
    touch-action: pan-x pan-y !important;
  }

  /* Inyectamos suavizado de transformación al elemento interno de zoom interactivo */
  :deep(.product-gallery-container img),
  :deep(.main-gallery-wrapper img) {
    transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1) !important;
    transform-origin: center center !important;
    cursor: zoom-in !important;
  }

  /* Si el usuario presiona, el sistema escala con suavidad sin movimientos de vibración erráticos */
  :deep(.main-gallery-wrapper img:active),
  :deep(.product-gallery-container img:active) {
    transform: scale(1.5) !important;
    cursor: move !important;
  }
}
</style>