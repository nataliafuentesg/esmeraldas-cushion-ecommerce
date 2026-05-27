<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import api from '@/api/axios';

const authStore = useAuthStore();
const router = useRouter();

// Estados para la búsqueda
const isSearchOpen = ref(false);
const searchQuery = ref('');
const allProducts = ref([]);

// Cargar los productos al montar para la búsqueda dinámica rápida
onMounted(async () => {
    try {
        const res = await api.get('/products');
        allProducts.value = res.data;
    } catch (err) {
        console.error("Error cargando productos para el buscador:", err);
    }
});

// Normalizar texto (sin acentos, todo minúscula)
const normalizeText = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

// 🔍 Búsqueda Dinámica en tiempo real (Offcanvas)
const filteredResults = computed(() => {
    const query = normalizeText(searchQuery.value.trim());
    if (!query || query.length < 2) return [];

    const searchTerms = query.split(/\s+/);

    return allProducts.value.filter(product => {
        const name = normalizeText(product.name);
        const category = normalizeText(product.category);
        const description = normalizeText(product.description);
        const metal = normalizeText(product.metalType);
        const gema = normalizeText(product.gemstoneType);

        return searchTerms.every(term =>
            name.includes(term) ||
            category.includes(term) ||
            description.includes(term) ||
            metal.includes(term) ||
            gema.includes(term)
        );
    }).slice(0, 5); // Máximo 5 resultados rápidos
});

const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value;
    if (isSearchOpen.value) {
        searchQuery.value = '';
        setTimeout(() => {
            document.getElementById('search-input')?.focus();
        }, 100);
    }
};

const handleSearchSubmit = () => {
    if (!searchQuery.value.trim()) return;
    isSearchOpen.value = false;
    router.push({ path: '/buscar', query: { q: searchQuery.value.trim() } });
};

// Navegación rápida (asume que tu ruta base de ficha técnica en tu router es la misma que usa ProductCard)
const goToProduct = (slug) => {
    isSearchOpen.value = false;
    // Si tu ruta es en singular, ajusta 'productos' por 'producto' aquí si es necesario
    router.push(`/producto/${slug}`);
};

const goToProfile = () => {
    if (authStore.isAuthenticated) {
        router.push('/perfil');
    } else {
        router.push('/auth');
    }
};
</script>

<template>
    <div class="bg-brand-black/70 border-t border-brand-white/10 text-brand-white py-2 relative z-40">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">

            <div class="flex items-center w-full lg:pr-10 xl:pr-20 lg:pl-10 xl:pl-20">
                <button @click="toggleSearch"
                        class="flex items-center space-x-2 font-sans-luxury text-xs
                                hover:text-brand-gold transition-colors tracking-wider">
                    <Icon icon="lucide:search" class="w-4 h-4" />
                    <span class="hidden sm:block">Búsqueda</span>
                </button>

                <button @click="goToProfile"
                        class="flex items-center space-x-2 font-sans-luxury text-xs
                                hover:text-brand-gold transition-colors tracking-wider ml-auto">
                    <Icon icon="lucide:user" class="w-4 h-4" />
                    <span class="hidden sm:block">Mi Cuenta</span>
                </button>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="-translate-y-full opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-full opacity-0"
        >
            <div v-if="isSearchOpen" class="fixed inset-x-0 top-0 bg-brand-black border-b border-brand-white/10 z-[100] shadow-2xl py-8">
                <div class="container mx-auto px-4 sm:px-6 lg:px-20">

                    <div class="flex justify-between items-center mb-6">
                        <span class="text-[10px] tracking-[0.4em] text-brand-gold font-bold">Buscador de Piezas</span>
                        <button @click="toggleSearch" class="text-brand-white/60 hover:text-brand-white transition-colors">
                            <Icon icon="lucide:x" class="w-6 h-6" />
                        </button>
                    </div>

                    <div class="relative flex items-center border-b border-brand-white/20 focus-within:border-brand-gold transition-colors pb-2">
                        <input
                            id="search-input"
                            v-model="searchQuery"
                            @keydown.enter="handleSearchSubmit"
                            type="text"
                            placeholder="Escribe el nombre, metal, gema o referencia..."
                            class="w-full bg-transparent text-brand-white font-serif-elegant text-lg md:text-2xl focus:outline-none placeholder-brand-white/30 pr-10"
                        />
                        <button @click="handleSearchSubmit" class="absolute right-0 text-brand-white/60 hover:text-brand-gold">
                            <Icon icon="lucide:arrow-right" class="w-5 h-5" />
                        </button>
                    </div>

                    <div v-if="searchQuery.trim().length >= 2" class="mt-6">
                        <p class="text-[9px] tracking-wide text-brand-white/40 mb-3">Sugerencias en tiempo real</p>

                        <div v-if="filteredResults.length > 0" class="divide-y divide-brand-white/5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            <div
                                v-for="item in filteredResults"
                                :key="item.id"
                                @click="goToProduct(item.slug)"
                                class="flex items-center gap-4 py-3 cursor-pointer group hover:bg-brand-white/[0.02] transition-colors px-2"
                            >
                                <img
                                    v-if="item.images?.[0]?.imageUrl"
                                    :src="item.images[0].imageUrl"
                                    :alt="item.name"
                                    class="w-10 h-10 object-cover border border-brand-white/10 group-hover:border-brand-gold transition-colors flex-shrink-0"
                                />
                                <div
                                    v-else
                                    class="w-10 h-10 flex-shrink-0 border border-brand-white/10 bg-brand-white/5 flex items-center justify-center"
                                >
                                    <Icon icon="lucide:gem" class="w-4 h-4 text-brand-gold/40" />
                                </div>
                                <div class="flex-1">
                                    <h4 class="text-brand-white group-hover:text-brand-gold font-sans-luxury text-sm transition-colors">
                                        {{ item.name }}
                                    </h4>
                                    <p class="text-xs text-brand-white/40 capitalize">{{ item.category }}</p>
                                </div>
                                <span class="text-brand-gold text-xs font-sans-luxury font-bold">
                                    $ {{ item.price.toLocaleString() }}
                                </span>
                            </div>
                        </div>

                        <div v-else class="py-4 text-center">
                            <p class="text-brand-white/50 text-sm italic">No encontramos piezas exactas con ese término.</p>
                            <p class="text-brand-gold text-xs tracking-wide mt-2 cursor-pointer" @click="handleSearchSubmit">
                                Presiona Enter para búsqueda avanzada
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </Transition>

        <div v-if="isSearchOpen" @click="toggleSearch" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"></div>
    </Teleport>
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
</style>
