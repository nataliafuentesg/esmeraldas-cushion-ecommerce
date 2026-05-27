<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';
import ProductCard from '@/components/ProductCard.vue';

const route = useRoute();
const router = useRouter();

const allProducts = ref([]);
const loading = ref(true);
const localSearchQuery = ref('');

localSearchQuery.value = route.query.q || '';

const fetchProducts = async () => {
    loading.value = true;
    try {
        const res = await api.get('/products');
        allProducts.value = res.data;
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
});

onMounted(fetchProducts);
</script>

<template>
    <div class="bg-brand-black min-h-screen py-12 lg:py-24 font-sans">
        <div class="container mx-auto px-4 sm:px-6 lg:px-20">
            
            <div class="max-w-3xl mx-auto text-center mb-16">
                <span class="text-brand-gold text-[10px] tracking-[0.6em] font-bold block mb-3">Galería de Exploración</span>
                <h1 class="text-3xl md:text-4xl font-serif-elegant text-brand-white tracking-wide mb-8">
                    Resultados de Búsqueda
                </h1>
                
                <div class="relative flex items-center border border-brand-white/10 bg-brand-white/[0.02] focus-within:border-brand-gold transition-colors px-4 py-3 max-w-xl mx-auto">
                    <input 
                        v-model="localSearchQuery"
                        @keydown.enter="triggerLocalSearch"
                        type="text"
                        placeholder="Buscar otra pieza o colección..."
                        class="w-full bg-transparent text-brand-white font-sans-luxury text-sm focus:outline-none placeholder-brand-white/20 pr-10"
                    />
                    <button @click="triggerLocalSearch" class="absolute right-4 text-brand-white/40 hover:text-brand-gold transition-colors">
                        <Icon icon="lucide:search" class="w-4 h-4" />
                    </button>
                </div>
                
                <p v-if="route.query.q" class="text-xs text-brand-white/40 mt-4 italic font-sans-luxury">
                    Mostrando piezas vinculadas con: <span class="text-brand-gold">"{{ route.query.q }}"</span>
                </p>
            </div>

            <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                <Icon icon="line-md:loading-twotone-loop" class="text-brand-gold w-10 h-10 mb-4" />
                <span class="text-[9px] tracking-wide text-brand-white/40">Abriendo Bóvedas de Inventario...</span>
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
                    <h3 class="text-brand-white text-lg font-serif-elegant mb-2">No se hallaron coincidencias</h3>
                    <p class="text-brand-white/40 text-xs font-sans-luxury leading-relaxed mb-6">
                        No encontramos piezas registradas con esos términos. Intenta buscando palabras clave individuales como "Anillo", "OB", "Cluster" o "Topos".
                    </p>
                    <button 
                        @click="localSearchQuery = ''; router.push('/coleccion')"
                        class="border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black text-[10px] font-bold tracking-wide px-6 py-3 transition-colors"
                    >
                        Ver Catálogo Completo
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