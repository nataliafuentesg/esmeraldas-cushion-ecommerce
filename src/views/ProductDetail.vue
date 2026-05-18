<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from '@/api/axios';
import { useCartStore } from '@/stores/cart';
import { Icon } from '@iconify/vue';
import ProductGallery from '@/components/ProductGallery.vue';
import RelatedProducts from '@/components/RelatedProducts.vue';
import { useHead } from '@unhead/vue';

const props = defineProps({
  slug: { type: String, required: true }
});

const cartStore = useCartStore();
const product = ref(null);
const allProducts = ref([]);
const loading = ref(true);
const selectedQuantity = ref(1);

useHead({
  title: computed(() => product.value ? `${product.value.name} | Cushion Joyería de Lujo` : 'Cargando Pieza...'),
  meta: [
    {
      name: 'description',
      content: computed(() => product.value ? product.value.description : 'Explora nuestra colección exclusiva.')
    },
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

    // Diagnóstico en consola
    console.log("Datos de la joya recibidos:", product.value);

    const all = await api.get('/products');
    allProducts.value = all.data;
  } catch (err) {
    console.error("Error conectando con la base de datos:", err);
  } finally {
    loading.value = false;
  }
};

const addToCart = () => {
  if (!product.value) return;
  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.images?.[0] || '',
    slug: product.value.slug,
    quantity: selectedQuantity.value
  });
  // Opcional: Aquí puedes agregar una notificación visual de éxito
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
onMounted(fetchProduct);
</script>

<template>
  <div v-if="loading" class="bg-brand-black min-h-screen flex items-center justify-center">
    <Icon icon="line-md:loading-twotone-loop" class="text-brand-gold w-12 h-12" />
  </div>

  <div v-else-if="product" class="bg-brand-black min-h-screen py-10 lg:py-20">
    <div class="container mx-auto px-4 lg:px-20">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-32">
        <div class="w-full lg:sticky lg:top-24 self-start">
          <ProductGallery :images="product.images" :product-name="product.name" />
        </div>

        <div class="flex flex-col">
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <span class="text-brand-gold text-[10px] tracking-[0.5em] uppercase font-bold">{{ product.category }}</span>
            <span v-if="product.featured"
              class="bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-3 py-1 text-[8px] font-bold uppercase tracking-widest">Pieza
              Exclusiva</span>
            <span v-for="occ in product.occasions" :key="occ"
              class="text-brand-white/60 border border-brand-white/20 px-3 py-1 text-[8px] uppercase tracking-[0.2em]">
              {{ occ }}
            </span>
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
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.totalWeight }} gr</span>
              </div>

              <div v-if="product.metalType?.trim()" class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/40 mb-1">Metal Precioso</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.metalType }}</span>
              </div>

              <div v-if="product.clarity?.trim()" class="flex flex-col">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/40 mb-1">Claridad</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase">{{ product.clarity }}</span>
              </div>

              <div v-if="product.diamondDetails?.trim()"
                class="flex flex-col md:col-span-2 border-t border-brand-white/5 pt-4">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-gold/70 mb-1">Acompañamiento /
                  Diamantes</span>
                <span class="text-brand-white text-sm font-sans-luxury uppercase leading-relaxed">{{
                  product.diamondDetails }}</span>
              </div>

              <div class="flex flex-col md:col-span-2 border-t border-brand-white/5 pt-4">
                <span class="text-[9px] uppercase tracking-[0.3em] text-brand-white/40 mb-1">Disponibilidad
                  Actual</span>
                <span class="text-brand-gold text-sm font-bold uppercase tracking-widest">{{ product.stock }} UNIDADES
                  EN BÓVEDA</span>
              </div>
            </div>
          </div>

          <div v-if="product.stock > 0" class="flex flex-col sm:flex-row items-stretch gap-4">
            <div
              class="flex items-center justify-between border border-brand-white/20 bg-brand-white/[0.02] px-4 py-3 sm:w-32">
              <button @click="selectedQuantity > 1 && selectedQuantity--"
                class="text-brand-white/60 hover:text-brand-gold transition-colors text-lg px-2">
                -
              </button>
              <span class="text-brand-white font-sans-luxury text-sm font-bold">{{ selectedQuantity }}</span>
              <button @click="selectedQuantity < product.stock && selectedQuantity++"
                class="text-brand-white/60 hover:text-brand-gold transition-colors text-lg px-2">
                +
              </button>
            </div>

            <button @click="addToCart"
              class="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-bold uppercase tracking-[0.2em] text-xs py-4 px-8 transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-3 shadow-lg shadow-brand-gold/10 hover:shadow-brand-gold/25">
              <Icon icon="ph:shopping-bag-light" class="w-5 h-5" />
              Añadir a la Bóveda de Compra
            </button>
          </div>

          <div v-else class="bg-red-950/20 border border-red-900/40 p-4 text-center">
            <span class="text-red-400 text-xs uppercase tracking-widest font-bold">Pieza Retenida / Sin Stock
              Disponible</span>
          </div>

        </div>
      </div>

      <section class="mt-20 border-t border-brand-white/10 pt-20">
        <RelatedProducts :related-products="relatedProducts" />
      </section>

    </div>
  </div>
</template>