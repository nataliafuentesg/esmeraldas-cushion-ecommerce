<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
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

// ESTADOS DEL LIGHTBOX PREMIUM
const isLightboxOpen = ref(false);
const lightboxImgUrl = ref('');
const galleryRef = ref(null); 

const openLightboxOnActiveImage = (event) => {
  if (window.innerWidth < 1024) {
    const activeSlide = event.target.closest('.swiper-slide-active');
    if (!activeSlide) return;
    const activeImg = activeSlide.querySelector('img');
    if (activeImg && activeImg.src) {
      lightboxImgUrl.value = activeImg.src;
      isLightboxOpen.value = true;
      document.body.style.overflow = 'hidden'; 
    }
  }
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
  lightboxImgUrl.value = '';
  document.body.style.overflow = '';
};

// GESTIÓN DEL RETORNO NATIVO BLINDADO ANTI-FOOTER
const handleGoBack = () => {
  const savedState = sessionStorage.getItem('collection_state');
  const cameFromCollection = sessionStorage.getItem('came_from_collection') === 'true';

  router.back();

  if (cameFromCollection && savedState) {
    const { scrollPosition } = JSON.parse(savedState);
    setTimeout(() => { window.scrollTo({ top: scrollPosition, behavior: 'instant' }); }, 40);
  } else {
    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, 40);
  }
};

useHead({
  title: computed(() => product.value ? `${product.value.name} | Cushion` : 'Cargando...')
});

// Modifica tu fetchProduct para que quede así:
const fetchProduct = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/products/${props.slug}`);
    product.value = res.data;

    const cachedProducts = sessionStorage.getItem('cushion_global_products');
    if (cachedProducts) {
      allProducts.value = JSON.parse(cachedProducts);
    } else {
      const all = await api.get('/products');
      allProducts.value = all.data;
      sessionStorage.setItem('cushion_global_products', JSON.stringify(all.data));
    }

    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, 10);
  } catch (err) {
    console.error("Error cargando pieza:", err);
  } finally {
    loading.value = false;
  }
};

const addToCart = async () => {
  if (!product.value) return;
  await cartStore.addItem(product.value, selectedQuantity.value);
  cartStore.isOffCanvasOpen = true;
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

onMounted(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
});

// Limpieza preventiva de listeners
onUnmounted(() => {
  if (galleryRef.value) {
    const swiperContainer = galleryRef.value.querySelector('.swiper-wrapper') || galleryRef.value;
    swiperContainer.removeEventListener('click', openLightboxOnActiveImage);
  }
});
</script>

<template>
  <div v-if="loading" class="bg-brand-black min-h-screen flex items-center justify-center">
    <Icon icon="line-md:loading-twotone-loop" class="text-brand-gold w-12 h-12" />
  </div>

  <div v-else-if="product" class="bg-brand-black min-h-screen py-6 lg:py-12">
    <div class="container mx-auto px-4 lg:px-20">

      <div class="mb-8 md:mb-12">
        <button @click="handleGoBack"
          class="group flex items-center gap-2 text-brand-white/40 hover:text-brand-gold text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 py-2">
          <Icon icon="lucide:arrow-left"
            class="w-3 h-3 transform group-hover:-translate-x-1 transition-transform duration-300 text-brand-gold/60 group-hover:text-brand-gold" />
          <span>Volver</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-20">
        <div class="w-full lg:sticky lg:top-24 self-start main-gallery-wrapper" ref="galleryRef"
          @click="openLightboxOnActiveImage">
          <ProductGallery :images="product.images" :product-name="product.name" />
          <div
            class="block lg:hidden text-center mt-3 text-[9px] uppercase tracking-[0.2em] text-brand-white/30 font-sans-luxury">
            <Icon icon="lucide:maximize-2" class="inline-block w-3 h-3 mr-1 text-brand-gold/50" />
            Toca la joya para ampliar en pantalla completa
          </div>
        </div>

        <div class="flex flex-col">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <span class="text-brand-gold text-[10px] tracking-[0.5em] uppercase font-bold">{{ product.category }}</span>
            <span v-if="product.featured"
              class="bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-3 py-1 text-[8px] font-bold uppercase tracking-widest">Pieza
              Exclusiva</span>
          </div>

          <h1
            class="text-2xl md:text-3xl lg:text-4xl font-serif-elegant text-brand-white mb-4 uppercase leading-tight tracking-wide">
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
            <div
              class="flex items-center justify-between border border-brand-white/20 bg-brand-white/[0.02] px-4 py-3 sm:w-32">
              <button @click="selectedQuantity > 1 && selectedQuantity--"
                class="text-brand-white/60 hover:text-brand-gold text-lg px-2">-</button>
              <span class="text-brand-white font-sans-luxury text-sm font-bold">{{ selectedQuantity }}</span>
              <button @click="selectedQuantity < product.stock && selectedQuantity++"
                class="text-brand-white/60 hover:text-brand-gold text-lg px-2">+</button>
            </div>
            <button @click="addToCart"
              class="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-bold uppercase tracking-[0.2em] text-xs py-4 px-8 flex items-center justify-center gap-3">
              <Icon icon="ph:shopping-bag-light" class="w-5 h-5" /> Añadir a la bolsa
            </button>
          </div>
        </div>
      </div>

      <section class="mt-20 border-t border-brand-white/10 pt-20">
        <RelatedProducts :related-products="relatedProducts" />
      </section>
    </div>

    <Transition name="fade-lightbox">
      <div v-if="isLightboxOpen"
        class="fixed inset-0 bg-brand-black/98 backdrop-blur-md z-[999] flex flex-col justify-center items-center p-4"
        @click="closeLightbox">
        <button @click.stop="closeLightbox"
          class="absolute top-6 right-6 text-brand-white/70 hover:text-brand-gold p-3 z-50 transition-colors">
          <Icon icon="lucide:x" class="w-6 h-6" />
        </button>
        <div class="w-full max-w-full max-h-[80vh] flex justify-center items-center overflow-auto scrollbar-none"
          @click.stop>
          <img :src="lightboxImgUrl" :alt="product.name"
            class="max-w-full max-h-[75vh] object-contain select-none mobile-pinch-target" />
        </div>
        <div
          class="absolute bottom-8 text-[9px] uppercase tracking-[0.25em] text-brand-white/40 font-sans-luxury text-center px-4">
          Pellizca con dos dedos para ampliar detalles • Toca fuera para salir
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-lightbox-enter-active,
.fade-lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.fade-lightbox-enter-from,
.fade-lightbox-leave-to {
  opacity: 0;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}

@media (max-width: 1024px) {
  .mobile-pinch-target {
    touch-action: pinch-zoom !important;
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>