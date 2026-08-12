<script setup>
import { useLocaleStore } from '@/stores/locale';
const L = useLocaleStore();
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useProductsStore } from '@/stores/products';
import { useAnalytics } from '@/composables/useAnalytics';
import ProductCard from '@/components/ProductCard.vue';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const { trackSearch } = useAnalytics();

const allProducts = ref([]);
const loading = ref(true);
const localSearchQuery = ref('');

localSearchQuery.value = route.query.q || '';

const fetchProducts = async () => {
    loading.value = true;
    try {
        await productsStore.fetchProducts();
        allProducts.value = productsStore.products;
    } catch (err) {
        console.error("Error obteniendo catálogo de búsqueda:", err);
    } finally {
        loading.value = false;
    }
};

const normalizeText = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

// 🔍 Motor de filtrado de la grilla
const searchResults = computed(() => {
    const query = normalizeText(route.query.q || '');
    if (!query) return allProducts.value;

    const terms = query.split(/\s+/);

    return allProducts.value.filter(product => {
        const name = normalizeText(product.name);
        const category = normalizeText(product.category);
        const description = normalizeText(product.description);
        const metal = normalizeText(product.metalType);
        const gema = normalizeText(product.gemstoneType);

        return terms.every(term => 
            name.includes(term) || 
            category.includes(term) || 
            description.includes(term) ||
            metal.includes(term) ||
            gema.includes(term)
        );
    });
});

const triggerLocalSearch = () => {
    if (!localSearchQuery.value.trim()) return;
    router.push({ path: '/buscar', query: { q: localSearchQuery.value.trim() } });
};

watch(() => route.query.q, (newQuery) => {
    localSearchQuery.value = newQuery || '';
    if (newQuery && newQuery.trim()) trackSearch(newQuery.trim()); // medición de búsqueda
});

onMounted(() => {
    fetchProducts();
    if (route.query.q && route.query.q.trim()) trackSearch(route.query.q.trim());
});
</script>

<template>
    <div class="bg-brand-black min-h-screen py-12 lg:py-24 font-sans">
        <div class="container mx-auto px-4 sm:px-6 lg:px-20">
            
            <div class="max-w-3xl mx-auto text-center mb-16">
                <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">{{ L.t('sv.eyebrow') }}</span>
                <h1 class="text-3xl md:text-4xl font-serif-elegant text-brand-white tracking-wide mb-8">
                    {{ L.t('sv.title') }}
                </h1>
                
                <div class="relative flex items-center border border-brand-white/10 bg-brand-white/[0.02] focus-within:border-brand-gold transition-colors px-4 py-3 max-w-xl mx-auto">
                    <input 
                        v-model="localSearchQuery"
                        @keydown.enter="triggerLocalSearch"
                        type="text"
                        :placeholder="L.t('sv.placeholder')"
                        class="w-full bg-transparent text-brand-white font-sans-luxury text-sm focus:outline-none placeholder-brand-white/20 pr-10"
                    />
                    <button @click="triggerLocalSearch" class="absolute right-4 text-brand-white/40 hover:text-brand-gold transition-colors">
                        <Icon icon="lucide:search" class="w-4 h-4" />
                    </button>
                </div>
                
                <p v-if="route.query.q" class="text-xs text-brand-white/40 mt-4 italic font-sans-luxury">
                    {{ L.t('sv.showing') }} <span class="text-brand-gold">"{{ route.query.q }}"</span>
                </p>
            </div>

            <!-- Skeleton tarjetas mientras carga -->
            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                <div v-for="i in 6" :key="i" class="animate-pulse">
                    <div class="aspect-square bg-brand-white/[0.04] border border-brand-white/5 w-full"></div>
                    <div class="p-5 space-y-3">
                        <div class="h-2 bg-brand-white/10 w-1/3 mx-auto"></div>
                        <div class="h-3 bg-brand-white/10 w-2/3 mx-auto"></div>
                        <div class="h-2 bg-brand-gold/10 w-1/4 mx-auto mt-3"></div>
                    </div>
                </div>
            </div>

            <div v-else>
                <div v-if="searchResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 fadeIn">
                    <ProductCard 
                        v-for="product in searchResults" 
                        :key="product.id"
                        :product="product" 
                    />
                </div>

                <div v-else class="text-center py-24 border border-brand-white/5 bg-brand-white/[0.01] max-w-xl mx-auto p-8">
                    <Icon icon="lucide:package-open" class="text-brand-gold/40 w-12 h-12 mx-auto mb-4" />
                    <h3 class="text-brand-white text-lg font-serif-elegant mb-2">{{ L.t('sv.noResults') }}</h3>
                    <p class="text-brand-white/40 text-xs font-sans-luxury leading-relaxed mb-6">
                        {{ L.t('sv.noResultsText') }}
                    </p>
                    <button 
                        @click="localSearchQuery = ''; router.push('/coleccion')"
                        class="border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black text-[10px] font-bold tracking-wide px-6 py-3 transition-colors"
                    >
                        {{ L.t('sv.viewCatalog') }}
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.fadeIn {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>