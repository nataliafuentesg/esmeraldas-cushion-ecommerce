<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import ProductGallery from '@/components/ProductGallery.vue';
import RelatedProducts from '@/components/RelatedProducts.vue';
import { RouterLink } from 'vue-router';
import { useHead } from '@unhead/vue';
import { useAnalytics } from '@/composables/useAnalytics';
import { useProductsStore } from '@/stores/products';
import { cloudinaryOptimize } from '@/utils/cloudinary';

const router = useRouter();

const props = defineProps({
  slug: { type: String, required: true }
});

const cartStore = useCartStore();
const authStore = useAuthStore();
const productsStore = useProductsStore();
const { trackViewProduct, trackAddToCart, trackWhatsAppClick } = useAnalytics();
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

// OG tags dinámicas — la imagen del producto aparece al compartir en WhatsApp / iMessage
useHead({
  title: () => product.value ? `${product.value.name} | Cushion` : 'Cushion | Alta Joyería',
  meta: [
    {
      property: 'og:type',
      content: 'product'
    },
    {
      property: 'og:title',
      content: () => product.value ? `${product.value.name} | Cushion Joyería` : 'Cushion | Alta Joyería'
    },
    {
      property: 'og:description',
      content: () => product.value?.description
        ? product.value.description.substring(0, 155)
        : 'Alta joyería con esmeraldas colombianas exclusivas. Diseñado en Bogotá.'
    },
    {
      property: 'og:image',
      content: () => product.value?.images?.[0]?.imageUrl
        ? cloudinaryOptimize(product.value.images[0].imageUrl, { width: 1200, quality: 'auto:best' })
        : 'https://cushionjewelry.com/images/og-cushion.png'
    },
    {
      property: 'og:image:width',
      content: '1200'
    },
    {
      property: 'og:image:height',
      content: '630'
    },
    {
      property: 'og:url',
      content: () => `https://cushionjewelry.com/producto/${product.value?.slug || ''}`
    },
    {
      name: 'description',
      content: () => product.value?.description?.substring(0, 155) || 'Alta joyería con esmeraldas colombianas.'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: () => product.value ? `${product.value.name} | Cushion` : 'Cushion Joyería'
    },
    {
      name: 'twitter:image',
      content: () => product.value?.images?.[0]?.imageUrl
        ? cloudinaryOptimize(product.value.images[0].imageUrl, { width: 1200, quality: 'auto:best' })
        : 'https://cushionjewelry.com/images/og-cushion.png'
    },
  ]
});

// ── Schema.org Product JSON-LD para Google Merchant Center ──────────────────
// Google rastrea estas páginas y usa este esquema para Google Shopping orgánico.
// Campos requeridos por Google Merchant: name, image, description, price,
// availability, brand, sku, condition, shippingDetails, returnPolicy.

const GOOGLE_CATEGORY_MAP = {
  anillos:       'Apparel & Accessories > Jewelry > Rings',
  collares:      'Apparel & Accessories > Jewelry > Necklaces',
  gargantillas:  'Apparel & Accessories > Jewelry > Necklaces',
  aretes:        'Apparel & Accessories > Jewelry > Earrings',
  pulseras:      'Apparel & Accessories > Jewelry > Bracelets',
  dijes:         'Apparel & Accessories > Jewelry > Charms & Pendants',
  'piedras sueltas': 'Arts & Entertainment > Hobbies & Creative Arts > Collectibles > Gemstones',
};

const productJsonLd = computed(() => {
  if (!product.value) return null;

  const catKey  = (product.value.category || '').toLowerCase();
  const gCat    = Object.entries(GOOGLE_CATEGORY_MAP).find(([k]) => catKey.includes(k))?.[1]
                  ?? 'Apparel & Accessories > Jewelry';

  const images  = (product.value.images || []).map(img =>
    cloudinaryOptimize(img.imageUrl, { width: 1200, quality: 'auto:best' })
  );

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name:        product.value.name,
    description: product.value.description || '',
    image:       images,
    sku:         String(product.value.id),
    brand:       { '@type': 'Brand', name: 'Cushion Jewelry' },
    category:    gCat,
    ...(product.value.metalType && { material: product.value.metalType }),
    offers: {
      '@type':            'Offer',
      url:                `https://cushionjewelry.com/producto/${product.value.slug}`,
      priceCurrency:      'COP',
      price:              product.value.price.toString(),
      priceValidUntil:    '2027-01-01',
      availability:       product.value.stock > 0
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/OutOfStock',
      itemCondition:      'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name:    'Cushion Jewelry',
        url:     'https://cushionjewelry.com',
      },
      // Detalles de envío — requeridos para el panel de envíos de Google
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'COP' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'CO' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime:  { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
        },
      },
      // Política de devoluciones — 2 días hábiles según política de la tienda
      hasMerchantReturnPolicy: {
        '@type':                  'MerchantReturnPolicy',
        applicableCountry:        'CO',
        returnPolicyCategory:     'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays:       2,
        returnMethod:             'https://schema.org/ReturnByMail',
        returnFees:               'https://schema.org/OriginalShippingFees',
      },
    },
  };
});

// Inyecta el JSON-LD reactivo en el <head> — se actualiza cuando carga el producto
useHead(computed(() => ({
  script: productJsonLd.value ? [
    {
      key:       'product-schema',
      type:      'application/ld+json',
      innerHTML: JSON.stringify(productJsonLd.value),
    },
  ] : [],
})));

// Modifica tu fetchProduct para que quede así:
const fetchProduct = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/products/${props.slug}`);
    product.value = res.data;
    trackViewProduct(res.data); // ← analytics: vista de producto

    await productsStore.fetchProducts();
    allProducts.value = productsStore.products;

    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, 10);
  } catch (err) {
    console.error("Error cargando pieza:", err);
  } finally {
    loading.value = false;
  }
};

const addToCart = async () => {
  if (!product.value) return;
  trackAddToCart(product.value, selectedQuantity.value); // ← analytics
  await cartStore.addItem(product.value, selectedQuantity.value);
  cartStore.isOffCanvasOpen = true;
};

const WA_NUMBER = '573136133822';

const handleWhatsAppClick = () => {
  if (!product.value) return;

  // 1. Analytics
  trackWhatsAppClick(product.value);

  // 2. Registrar en backend (fire & forget — no bloquea la UX)
  const params = new URLSearchParams(window.location.search);
  api.post('/product-inquiries', {
    productSlug:  product.value.slug,
    productName:  product.value.name,
    channel:      'WHATSAPP',
    clientEmail:  authStore.user?.email || null,
    utmSource:    params.get('utm_source'),
    utmMedium:    params.get('utm_medium'),
    utmCampaign:  params.get('utm_campaign'),
  }).catch(() => {}); // silencioso — no interrumpir flujo

  // 3. Abrir WhatsApp — incluye el link del producto para que el equipo sepa de cuál pieza se trata
  const isOutOfStock = product.value.stock === 0;
  const productUrl   = `https://cushionjewelry.com/producto/${product.value.slug}`;

  const msg = encodeURIComponent(
    isOutOfStock
      ? `Hola Cushion 💎 Vi esta pieza en su tienda y aparece agotada, me gustaría saber si pueden recrearla o hacer algo similar:\n\n*${product.value.name}*\n${productUrl}\n\n¿Me asesoran?`
      : `Hola, me interesa esta joya:\n\n*${product.value.name}* — $${product.value.price.toLocaleString()} COP\n${productUrl}\n\n¿Me pueden dar más información?`
  );
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
};

// Enlace contextual a la guía de tallas según categoría del producto
const sizeGuideLink = computed(() => {
  const cat = product.value?.category?.toLowerCase() || '';
  if (cat.includes('anillo'))    return '/guia-de-tallas#anillos';
  if (cat.includes('collar') || cat.includes('gargantilla')) return '/guia-de-tallas#collares';
  if (cat.includes('pulsera'))   return '/guia-de-tallas#pulseras';
  if (cat.includes('dije') || cat.includes('arete') || cat.includes('piedra')) return null;
  return null;
});

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
          class="group flex items-center gap-2 text-brand-white/40 hover:text-brand-gold text-[10px] tracking-[0.3em] transition-colors duration-300 py-2">
          <Icon icon="lucide:arrow-left"
            class="w-3 h-3 transform group-hover:-translate-x-1 transition-transform duration-300 text-brand-gold/60 group-hover:text-brand-gold" />
          <span>Volver</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-20">
        <div class="w-full lg:sticky lg:top-24 self-start main-gallery-wrapper relative" ref="galleryRef"
          @click="openLightboxOnActiveImage">
          <ProductGallery :images="product.images" :product-name="product.name" />
          <!-- Badge AGOTADO sobre la galería -->
          <div v-if="product.stock === 0"
               class="absolute top-4 left-4 z-20 bg-brand-black/95 backdrop-blur-sm text-brand-white border border-brand-white/30 px-3 py-1.5 text-[9px] font-bold tracking-[0.25em] pointer-events-none">
            AGOTADO
          </div>
          <div
            class="block lg:hidden text-center mt-3 text-[9px] tracking-wide text-brand-white/30 font-sans-luxury">
            <Icon icon="lucide:maximize-2" class="inline-block w-3 h-3 mr-1 text-brand-gold/50" />
            Toca la joya para ampliar en pantalla completa
          </div>
        </div>

        <div class="flex flex-col">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <span class="text-brand-gold text-[10px] tracking-[0.5em] font-bold">{{ product.category }}</span>
            <span v-if="product.featured && product.stock > 0"
              class="bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-3 py-1 text-[8px] font-bold tracking-wide">Pieza
              Exclusiva</span>
            <span v-if="product.stock === 0"
              class="bg-brand-black border border-brand-white/25 text-brand-white px-3 py-1 text-[8px] font-bold tracking-[0.2em]">
              AGOTADO
            </span>
          </div>

          <h1
            class="text-2xl md:text-3xl lg:text-4xl font-serif-elegant text-brand-white mb-4 leading-tight tracking-wide">
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
            <h3 class="text-brand-gold text-[10px] tracking-[0.4em] mb-8 border-b border-brand-gold/20 pb-4">
              Certificado de Joyería
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div v-if="product.gemstoneType?.trim()" class="flex flex-col">
                <span class="text-[9px] tracking-[0.3em] text-brand-white/40 mb-1">Gema Principal</span>
                <span class="text-brand-white text-sm font-sans-luxury">{{ product.gemstoneType }}</span>
              </div>
              <div v-if="product.cutType?.trim()" class="flex flex-col">
                <span class="text-[9px] tracking-[0.3em] text-brand-white/40 mb-1">Talla / Corte</span>
                <span class="text-brand-white text-sm font-sans-luxury">{{ product.cutType }}</span>
              </div>
              <div v-if="product.caratWeight?.trim()" class="flex flex-col">
                <span class="text-[9px] tracking-[0.3em] text-brand-white/40 mb-1">Peso Carates (ct)</span>
                <span class="text-brand-white text-sm font-sans-luxury">{{ product.caratWeight }}</span>
              </div>
              <div v-if="product.totalWeight?.trim()" class="flex flex-col">
                <span class="text-[9px] tracking-[0.3em] text-brand-white/40 mb-1">Peso de la Pieza</span>
                <span class="text-brand-white text-sm font-sans-luxury">{{ product.totalWeight }}</span>
              </div>
              <div v-if="product.metalType?.trim()" class="flex flex-col">
                <span class="text-[9px] tracking-[0.3em] text-brand-white/40 mb-1">Metal Precioso</span>
                <span class="text-brand-white text-sm font-sans-luxury">{{ product.metalType }}</span>
              </div>
            </div>
          </div>

          <!-- ── Guía de tallas (contextual por categoría) ── -->
          <RouterLink
            v-if="sizeGuideLink"
            :to="sizeGuideLink"
            class="inline-flex items-center gap-2 text-brand-white/40 hover:text-brand-gold text-[10px] tracking-[0.25em] transition-colors duration-300 mb-6 group"
          >
            <Icon icon="lucide:ruler" class="w-3.5 h-3.5 text-brand-gold/60 group-hover:text-brand-gold transition-colors" />
            GUÍA DE TALLAS
            <span class="text-brand-gold/50 group-hover:text-brand-gold transition-colors">→</span>
          </RouterLink>

          <!-- ── CON STOCK: selector + carrito ── -->
          <div v-if="product.stock > 0" class="flex flex-col sm:flex-row items-stretch gap-4">
            <div
              class="flex items-center justify-between border border-brand-white/20 bg-brand-white/[0.02] px-4 py-3 sm:w-32">
              <button @click="selectedQuantity > 1 && selectedQuantity--"
                class="text-brand-white/60 hover:text-brand-gold text-lg px-2">-</button>
              <span class="text-brand-white font-sans-luxury text-sm font-bold">{{ selectedQuantity }}</span>
              <button @click="selectedQuantity < product.stock && selectedQuantity++"
                class="text-brand-white/60 hover:text-brand-gold text-lg px-2">+</button>
            </div>
            <button @click="addToCart"
              class="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-bold tracking-wide text-xs py-4 px-8 flex items-center justify-center gap-3 transition-colors duration-300">
              <Icon icon="ph:shopping-bag-light" class="w-5 h-5" /> Añadir a la bolsa
            </button>
          </div>

          <!-- ── AGOTADO: aviso + CTA ── -->
          <div v-else class="border border-brand-white/10 bg-brand-white/[0.02] p-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-2 h-2 rounded-full bg-brand-white/20 flex-shrink-0"></span>
              <p class="text-brand-white/50 font-sans-luxury text-[10px] tracking-[0.25em] uppercase">
                Esta pieza esta Agotada
              </p>
            </div>
            <p class="text-brand-white/35 font-sans-luxury text-xs leading-relaxed mb-5">
              Sin embargo, podemos recrearla a tu medida con una esmeralda colombiana exclusiva.
              Cada diseño es único — cuéntanos tu visión y nuestros expertos te guían.
            </p>
            <button @click="handleWhatsAppClick"
              class="w-full flex items-center justify-center gap-3 bg-[#25D366]/10 border border-[#25D366]/40
                     text-[#25D366] hover:bg-[#25D366]/20 py-4 text-xs font-sans-luxury tracking-wide
                     transition-all duration-300 group">
              <Icon icon="simple-icons:whatsapp" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Quiero una pieza como esta
            </button>
          </div>

          <!-- Botón WhatsApp general (solo si hay stock) -->
          <button v-if="product.stock > 0" @click="handleWhatsAppClick"
            class="mt-3 w-full flex items-center justify-center gap-3 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 py-4 text-xs font-sans-luxury tracking-wide transition-all duration-300 group">
            <Icon icon="simple-icons:whatsapp" class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            Consultar por WhatsApp
          </button>

          <!-- Nota de confianza -->
          <p class="mt-4 text-center text-[10px] text-brand-white/30 font-sans-luxury tracking-wide">
            Respuesta en menos de 24 horas hábiles · Asesoría personalizada sin costo
          </p>
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
          class="absolute bottom-8 text-[9px] tracking-[0.25em] text-brand-white/40 font-sans-luxury text-center px-4">
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
