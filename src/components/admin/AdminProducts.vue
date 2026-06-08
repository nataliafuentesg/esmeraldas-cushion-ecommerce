<script setup>
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const products = ref([]);
const loading = ref(true);

const searchQuery = ref('');
const filterCategory = ref('Todas');
const filterStock = ref('Todos');
const filterDate = ref(''); // ✨ Nuevo estado para la fecha
const filterFeatured = ref(false); // Mostrar solo los del carrusel
const togglingId = ref(null);      // ID del producto que se está actualizando

const showProductModal = ref(false);
const isEditing = ref(false);

// ✨ ESQUEMA COMPLETO MAPEADO AL BACKEND ✨
const emptyProduct = {
  id: null, 
  name: '', 
  description: '', 
  price: 0, 
  category: 'Anillos', 
  stock: 1, 
  featured: false,
  
  // Especificaciones de Alta Joyería
  gemstoneType: '', 
  caratWeight: '',    // Peso Carate (Gema)
  totalWeight: '',    // Peso total de la pieza (Metal)
  cutType: '', 
  clarity: '', 
  metalType: '', 
  diamondDetails: '', // Detalle de diamantes de acompañamiento
  
  // Arreglo para múltiples ocasiones
  occasions: [], 
  
  // Imágenes
  images: [{ imageUrl: '', isThumbnail: true, displayOrder: 1 }]
};

const currentProduct = ref({ ...emptyProduct });

onMounted(async () => {
  await loadProducts();
});

const loadProducts = async () => {
  loading.value = true;
  try {
    const res = await api.get('/products');
    products.value = res.data;
  } catch (error) {
    console.error("Error cargando productos:", error);
  } finally {
    loading.value = false;
  }
};

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const query = searchQuery.value.toLowerCase();
    // ✨ Ahora busca en el nombre O en la descripción (referencia)
    const matchesSearch = product.name.toLowerCase().includes(query) || 
                          (product.description && product.description.toLowerCase().includes(query));
    
    const matchesCategory = filterCategory.value === 'Todas' || product.category === filterCategory.value;
    
    const matchesStock = filterStock.value === 'Todos' || 
                         (filterStock.value === 'Con Stock' && product.stock > 0) ||
                         (filterStock.value === 'Agotados' && product.stock === 0);
                         
    // ✨ Filtro por fecha (Asume que el backend envía 'createdAt' tipo '2026-05-18T...')
    const matchesDate = !filterDate.value || (product.createdAt && product.createdAt.startsWith(filterDate.value));

    const matchesFeatured = !filterFeatured.value || product.featured;

    return matchesSearch && matchesCategory && matchesStock && matchesDate && matchesFeatured;
  });
});

// Cuántas piezas hay en el carrusel del inicio
const featuredCount = computed(() => products.value.filter(p => p.featured).length);

// Enciende/apaga el destacado de una pieza con un clic (sin abrir el formulario)
const toggleFeatured = async (product) => {
  if (togglingId.value) return; // evita dobles clics
  const newVal = !product.featured;
  togglingId.value = product.id;
  product.featured = newVal; // actualización optimista (se ve al instante)

  try {
    const payload = {
      ...product,
      featured: newVal,
      occasions: product.occasions ? [...product.occasions] : [],
      images: (product.images || []).filter(img => img.imageUrl && img.imageUrl.trim() !== ''),
    };
    await api.put(`/admin/products/${product.id}`, payload);
  } catch (error) {
    product.featured = !newVal; // revertir si falla
    console.error(error);
    alert('No se pudo actualizar el destacado. Intenta de nuevo.');
  } finally {
    togglingId.value = null;
  }
};

const openModalNew = () => {
  isEditing.value = false;
  currentProduct.value = JSON.parse(JSON.stringify(emptyProduct));
  showProductModal.value = true;
};

const openModalEdit = (prod) => {
  isEditing.value = true;
  currentProduct.value = { 
    ...prod, 
    occasions: prod.occasions ? [...prod.occasions] : [],
    images: prod.images?.length ? [...prod.images] : [{ imageUrl: '', isThumbnail: true, displayOrder: 1 }] 
  };
  showProductModal.value = true;
};

const addImageInput = () => {
  currentProduct.value.images.push({ imageUrl: '', isThumbnail: false, displayOrder: currentProduct.value.images.length + 1 });
};

const removeImageInput = (index) => {
  currentProduct.value.images.splice(index, 1);
};

const saveProduct = async () => {
  try {
    const slug = currentProduct.value.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    const payload = { ...currentProduct.value, slug };
    payload.images = payload.images.filter(img => img.imageUrl.trim() !== '');
    
    if (isEditing.value) {
      await api.put(`/admin/products/${payload.id}`, payload);
    } else {
      await api.post('/admin/products', payload);
    }
    
    showProductModal.value = false;
    await loadProducts();
  } catch (error) {
    console.error(error);
    alert("Error al guardar la joya");
  }
};

const deleteProduct = async (id, name) => {
  if (confirm(`¿Eliminar definitivamente: ${name}?`)) {
    try {
      await api.delete(`/admin/products/${id}`);
      await loadProducts();
    } catch (error) {
      alert("Error al eliminar");
    }
  }
};
</script>

<template>
  <div class="font-sans">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-brand-white/10 pb-4 gap-4">
      <h3 class="text-2xl font-serif-elegant text-brand-white tracking-wide">Inventario Cushion</h3>
      <button @click="openModalNew" class="bg-brand-white text-brand-black px-4 py-2 text-[10px] font-bold tracking-wide hover:bg-brand-gold transition-colors flex items-center space-x-2">
        <Icon icon="lucide:plus" class="w-4 h-4" /><span>Nueva Joya</span>
      </button>
    </div>

    <!-- Gestión del carrusel del inicio -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 bg-brand-gold/[0.04] border border-brand-gold/20 px-4 py-3">
      <div class="flex items-center gap-3">
        <Icon icon="lucide:sparkles" class="w-5 h-5 text-brand-gold shrink-0" />
        <div>
          <p class="text-brand-white text-xs tracking-wide">
            Carrusel del Inicio:
            <span class="text-brand-gold font-bold">{{ featuredCount }}</span>
            {{ featuredCount === 1 ? 'pieza destacada' : 'piezas destacadas' }}
          </p>
          <p class="text-brand-white/40 text-[10px] tracking-wide mt-0.5">
            <span v-if="featuredCount < 4" class="text-amber-400/80">Recomendado: 4 a 8 piezas para que el carrusel se vea completo.</span>
            <span v-else-if="featuredCount > 8" class="text-amber-400/80">Tienes muchas — considera dejar entre 4 y 8 para mejor impacto.</span>
            <span v-else>Toca la estrella ⭐ de cualquier fila para añadir o quitar del carrusel.</span>
          </p>
        </div>
      </div>
      <button
        @click="filterFeatured = !filterFeatured"
        class="shrink-0 px-4 py-2 text-[10px] font-bold tracking-wide border transition-colors flex items-center gap-2"
        :class="filterFeatured
          ? 'bg-brand-gold text-brand-black border-brand-gold'
          : 'text-brand-gold border-brand-gold/40 hover:bg-brand-gold/10'"
      >
        <Icon :icon="filterFeatured ? 'lucide:list' : 'lucide:star'" class="w-3.5 h-3.5" />
        {{ filterFeatured ? 'Ver todo el inventario' : 'Ver solo el carrusel' }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-brand-white/5 p-4 border border-brand-white/10">
      <div class="relative">
        <Icon icon="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-white/50" />
        <input v-model="searchQuery" type="text" placeholder="Buscar ref o nombre..." class="w-full bg-brand-black border border-brand-white/20 pl-10 pr-4 py-2 text-brand-white text-xs tracking-wide focus:border-brand-gold outline-none transition-colors placeholder:text-brand-white/30">
      </div>
      
      <select v-model="filterCategory" class="bg-brand-black border border-brand-white/20 px-4 py-2 text-brand-white text-xs tracking-wide focus:border-brand-gold outline-none cursor-pointer">
        <option value="Todas">Todas las Categorías</option>
        <option value="Anillos">Anillos</option>
        <option value="Aretes">Aretes</option>
        <option value="Collares">Collares</option>
        <option value="Gargantillas">Gargantillas</option>
        <option value="Pulseras">Pulseras</option>
        <option value="Sets">Sets</option>
        <option value="Piedras Sueltas">Piedras Sueltas</option>
        <option value="Dijes">Dijes</option>
      </select>
      
      <select v-model="filterStock" class="bg-brand-black border border-brand-white/20 px-4 py-2 text-brand-white text-xs tracking-wide focus:border-brand-gold outline-none cursor-pointer">
        <option value="Todos">Cualquier Stock</option>
        <option value="Con Stock">Disponibles</option>
        <option value="Agotados">Agotados</option>
      </select>

      <div class="relative">
        <input v-model="filterDate" type="date" class="w-full bg-brand-black border border-brand-white/20 px-4 py-2 text-brand-white text-xs tracking-wide focus:border-brand-gold outline-none transition-colors cursor-pointer [color-scheme:dark]">
      </div>
    </div>

    <div v-if="loading" class="text-brand-gold tracking-wide text-xs animate-pulse text-center py-20">Analizando archivos...</div>

    <div v-else class="overflow-x-auto border border-brand-white/10 bg-brand-black/50">
      <table class="w-full text-left border-collapse whitespace-nowrap">
        <thead class="bg-brand-white/5 text-[10px] tracking-wide text-brand-white/60">
          <tr>
            <th class="p-4 border-b border-brand-white/10 font-medium text-center" title="Destacar en el carrusel del inicio">★</th>
            <th class="p-4 border-b border-brand-white/10 font-medium">Joya / Referencia</th>
            <th class="p-4 border-b border-brand-white/10 font-medium">Categoría</th>
            <th class="p-4 border-b border-brand-white/10 font-medium">Gema Principal</th>
            <th class="p-4 border-b border-brand-white/10 font-medium">Precio</th>
            <th class="p-4 border-b border-brand-white/10 font-medium">Stock</th>
            <th class="p-4 border-b border-brand-white/10 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="text-sm font-sans-luxury text-brand-white">
          <tr v-if="filteredProducts.length === 0">
            <td colspan="7" class="p-8 text-center text-brand-white/40 text-xs tracking-wide">No se encontraron piezas con esos filtros.</td>
          </tr>
          <tr v-for="product in filteredProducts" :key="product.id"
              class="border-b border-brand-white/5 hover:bg-brand-white/[0.02] transition-colors group"
              :class="{ 'bg-brand-gold/[0.04]': product.featured }">
            <td class="p-4 text-center">
              <button
                @click="toggleFeatured(product)"
                :disabled="togglingId === product.id"
                class="transition-all duration-200 disabled:opacity-40 hover:scale-110"
                :title="product.featured ? 'Quitar del carrusel' : 'Añadir al carrusel'"
              >
                <Icon
                  :icon="togglingId === product.id
                    ? 'line-md:loading-twotone-loop'
                    : (product.featured ? 'mdi:star' : 'mdi:star-outline')"
                  class="w-5 h-5"
                  :class="product.featured ? 'text-brand-gold' : 'text-brand-white/25 hover:text-brand-gold/60'"
                />
              </button>
            </td>
            <td class="p-4">
              <div class="font-serif-elegant text-base text-brand-white">{{ product.name }}</div>
              <div class="text-[10px] text-brand-white/40 tracking-wide truncate max-w-[250px] mt-1">{{ product.description }}</div>
            </td>
            <td class="p-4 text-[10px] tracking-wide text-brand-gold">{{ product.category }}</td>
            <td class="p-4 text-[10px] tracking-wide text-brand-white/70">
              {{ product.gemstoneType || 'N/A' }} 
              <span v-if="product.caratWeight" class="text-brand-white/40 ml-1">({{ product.caratWeight }})</span>
            </td>
            <td class="p-4 tracking-wide text-brand-white/90">$ {{ product.price.toLocaleString() }}</td>
            <td class="p-4">
              <span :class="product.stock > 0 ? 'text-green-500' : 'text-red-500'" class="text-[10px] font-bold tracking-wide">
                {{ product.stock }}
              </span>
            </td>
            <td class="p-4 text-right">
              <div class="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openModalEdit(product)" class="bg-brand-white/10 text-brand-white p-2 hover:bg-brand-gold hover:text-brand-black transition-colors" title="Editar Pieza">
                  <Icon icon="lucide:edit" class="w-4 h-4" />
                </button>
                <button @click="deleteProduct(product.id, product.name)" class="bg-red-900/40 text-brand-white p-2 hover:bg-red-600 transition-colors" title="Eliminar Pieza">
                  <Icon icon="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showProductModal" class="fixed inset-0 bg-brand-black/98 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-brand-black border border-brand-gold p-6 md:p-10 max-w-5xl w-full max-h-[95vh] overflow-y-auto relative shadow-2xl">
        <h3 class="text-2xl font-serif-elegant text-brand-gold mb-10 tracking-[0.3em] text-center border-b border-brand-gold/20 pb-6">
          Registro de Alta Joyería
        </h3>
        
        <form @submit.prevent="saveProduct" class="space-y-10">
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="md:col-span-2">
              <label class="label-admin">Nombre de la Joya</label>
              <input v-model="currentProduct.name" type="text" required class="input-admin" placeholder="Ej: Anillo de Compromiso Aura">
            </div>
            <div>
              <label class="label-admin">Precio (COP)</label>
              <input v-model="currentProduct.price" type="number" required class="input-admin">
            </div>
            <div>
              <label class="label-admin">Categoría</label>
              <select v-model="currentProduct.category" class="input-admin">
                <option value="Anillos">Anillos</option>
                <option value="Aretes">Aretes</option>
                <option value="Collares">Collares</option>
                <option value="Gargantillas">Gargantillas</option>
                <option value="Pulseras">Pulseras</option>
                <option value="Sets">Sets</option>
                <option value="Piedras Sueltas">Piedras Sueltas</option>
                <option value="Dijes">Dijes</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="label-admin">Descripción de la Joya (Incluir Referencia)</label>
            <textarea v-model="currentProduct.description" rows="2" class="input-admin resize-none"></textarea>
          </div>

          <div>
            <h4 class="text-brand-white tracking-[0.3em] text-[10px] border-b border-brand-white/10 pb-2 mb-6 opacity-60">Especificaciones Técnicas</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label class="label-admin">Gema Principal</label>
                <input v-model="currentProduct.gemstoneType" placeholder="Ej: Esmeralda Muzo" type="text" class="input-admin">
              </div>
              <div>
                <label class="label-admin">Peso Carate (ct)</label>
                <input v-model="currentProduct.caratWeight" placeholder="Ej: 1.85 ct" type="text" class="input-admin">
              </div>
              <div>
                <label class="label-admin">Peso Total de la pieza</label>
                <input v-model="currentProduct.totalWeight" placeholder="Ej: 5.40 gr" type="text" class="input-admin">
              </div>
              <div>
                <label class="label-admin">Metal Base</label>
                <input v-model="currentProduct.metalType" placeholder="Ej: Oro 18K" type="text" class="input-admin">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div class="md:col-span-2">
                <label class="label-admin">Detalle de Diamantes / Acompañamiento</label>
                <input v-model="currentProduct.diamondDetails" placeholder="Ej: 24 Diamantes corte brillante, claridad VVS1" type="text" class="input-admin">
              </div>
              <div>
                <label class="label-admin">Tipo de Corte (Gema)</label>
                <input v-model="currentProduct.cutType" placeholder="Ej: Esmeralda / Oval" type="text" class="input-admin">
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h4 class="text-brand-white tracking-[0.3em] text-[10px] border-b border-brand-white/10 pb-2 mb-6 opacity-60">Ocasión / Colección</h4>
              <div class="flex flex-wrap gap-4">
                <label v-for="occ in ['Compromiso', 'Bodas', 'Quinceaños', 'Aniversario', 'Regalo']" :key="occ" class="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" :value="occ" v-model="currentProduct.occasions" class="checkbox-admin">
                  <span class="text-[10px] text-brand-white/70 group-hover:text-brand-gold transition-colors">{{ occ }}</span>
                </label>
              </div>
            </div>
            <div class="flex items-center space-x-10">
              <div class="flex-1">
                <label class="label-admin">Stock Disponible</label>
                <input v-model="currentProduct.stock" type="number" min="0" class="input-admin">
              </div>
              <label class="flex items-center space-x-3 cursor-pointer mt-4">
                <input type="checkbox" v-model="currentProduct.featured" class="checkbox-admin">
                <span class="text-[10px] text-brand-gold tracking-wide">Destacar en Inicio</span>
              </label>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-end border-b border-brand-white/10 pb-2 mb-6">
              <h4 class="text-brand-white tracking-[0.3em] text-[10px] opacity-60">Galería Fotográfica</h4>
              <button type="button" @click="addImageInput" class="text-brand-gold text-[9px] tracking-wide hover:text-brand-white transition-colors">+ Añadir Enlace</button>
            </div>
            <div class="space-y-4">
              <div v-for="(img, index) in currentProduct.images" :key="index" class="flex items-center space-x-4 bg-brand-white/5 p-3 border border-brand-white/5">
                <input v-model="img.imageUrl" type="url" placeholder="https://dominio.com/imagen.jpg" class="flex-1 bg-transparent border-b border-brand-white/10 p-2 text-brand-white text-xs focus:border-brand-gold outline-none">
                
                <label class="flex items-center space-x-2 cursor-pointer" title="Marcar como imagen principal">
                  <input type="radio" :name="'thumb-' + currentProduct.id" :value="true" v-model="img.isThumbnail" @change="currentProduct.images.forEach((i, idx) => i.isThumbnail = (index === idx))" class="checkbox-admin rounded-full">
                  <span class="text-[9px] text-brand-white/40">Portada</span>
                </label>
                
                <button type="button" @click="removeImageInput(index)" class="text-red-500 hover:text-red-300 transition-colors"><Icon icon="lucide:x" class="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-6 pt-10 border-t border-brand-white/10">
            <button type="button" @click="showProductModal = false" class="text-brand-white/40 text-[10px] tracking-[0.3em] hover:text-brand-white transition-colors">Cancelar</button>
            <button type="submit" class="bg-brand-gold text-brand-black px-12 py-4 text-[10px] font-bold tracking-[0.3em] hover:bg-brand-white transition-all shadow-lg shadow-brand-gold/10">
              Guardar Joya
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/main.css";

.label-admin {
  @apply text-[9px] text-brand-white/40 tracking-wide block mb-2;
}

.input-admin {
  @apply w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none transition-colors;
}

.checkbox-admin {
  @apply h-4 w-4 accent-brand-gold cursor-pointer;
}

/* Oculta la rueda del input date por defecto en algunos navegadores */
input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.5;
    cursor: pointer;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
}
</style>