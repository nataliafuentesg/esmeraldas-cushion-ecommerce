<script setup>
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import api from '@/api/axios';

const products = ref([]);
const loading = ref(true);

// --- ESTADOS PARA FILTROS Y BÚSQUEDA ---
const searchQuery = ref('');
const filterCategory = ref('Todas');
const filterStock = ref('Todos');

// Modal y edición
const showProductModal = ref(false);
const isEditing = ref(false);

const emptyProduct = {
  id: null, name: '', description: '', price: 0, category: 'Anillos', stock: 1, featured: false,
  gemstoneType: '', caratWeight: '', cutType: '', clarity: '', metalType: '', 
  images: [{ imageUrl: '', isPrimary: true, displayOrder: 1 }]
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

// --- MAGIA REACTIVA: PRODUCTOS FILTRADOS ---
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // 1. Filtro por Búsqueda (Texto)
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // 2. Filtro por Categoría
    const matchesCategory = filterCategory.value === 'Todas' || product.category === filterCategory.value;
    
    // 3. Filtro por Stock
    const matchesStock = filterStock.value === 'Todos' || 
                         (filterStock.value === 'Con Stock' && product.stock > 0) ||
                         (filterStock.value === 'Agotados' && product.stock === 0);
                         
    return matchesSearch && matchesCategory && matchesStock;
  });
});

const openModalNew = () => {
  isEditing.value = false;
  currentProduct.value = { ...emptyProduct, images: [{ imageUrl: '', isPrimary: true, displayOrder: 1 }] };
  showProductModal.value = true;
};

const openModalEdit = (prod) => {
  isEditing.value = true;
  currentProduct.value = { 
    ...prod, 
    images: prod.images?.length ? [...prod.images] : [{ imageUrl: '', isPrimary: true, displayOrder: 1 }] 
  };
  showProductModal.value = true;
};

const addImageInput = () => {
  currentProduct.value.images.push({ imageUrl: '', isPrimary: false, displayOrder: currentProduct.value.images.length + 1 });
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
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-brand-white/10 pb-4 gap-4">
      <h3 class="text-2xl font-serif-elegant text-brand-white tracking-widest uppercase">Catálogo de Alta Joyería</h3>
      <button @click="openModalNew" class="bg-brand-white text-brand-black px-4 py-2 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-brand-gold transition-colors flex items-center space-x-2">
        <Icon icon="lucide:plus" class="w-4 h-4" /><span>Añadir Joya</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-brand-white/5 p-4 border border-brand-white/10">
      
      <div class="relative">
        <Icon icon="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-white/50" />
        <input v-model="searchQuery" type="text" placeholder="Buscar por nombre..." 
               class="w-full bg-brand-black border border-brand-white/20 pl-10 pr-4 py-2 text-brand-white text-xs uppercase tracking-widest focus:border-brand-gold outline-none transition-colors placeholder:text-brand-white/30">
      </div>

      <div>
        <select v-model="filterCategory" class="w-full bg-brand-black border border-brand-white/20 px-4 py-2 text-brand-white text-xs uppercase tracking-widest focus:border-brand-gold outline-none cursor-pointer">
          <option value="Todas" class="bg-brand-black">Todas las Categorías</option>
          <option value="Anillos" class="bg-brand-black">Anillos</option>
          <option value="Aretes" class="bg-brand-black">Aretes</option>
          <option value="Collares" class="bg-brand-black">Collares</option>
          <option value="Pulseras" class="bg-brand-black">Pulseras</option>
          <option value="Piedras Sueltas" class="bg-brand-black">Piedras Sueltas</option>
        </select>
      </div>

      <div>
        <select v-model="filterStock" class="w-full bg-brand-black border border-brand-white/20 px-4 py-2 text-brand-white text-xs uppercase tracking-widest focus:border-brand-gold outline-none cursor-pointer">
          <option value="Todos" class="bg-brand-black">Cualquier Stock</option>
          <option value="Con Stock" class="bg-brand-black">Disponibles</option>
          <option value="Agotados" class="bg-brand-black">Agotados</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-brand-gold uppercase tracking-widest text-xs animate-pulse">Cargando catálogo...</div>

    <div v-else-if="filteredProducts.length === 0" class="text-center py-12 border border-brand-white/10 bg-brand-white/5">
      <p class="text-brand-white/50 font-sans-luxury text-sm tracking-widest uppercase">
        No se encontraron joyas que coincidan con tu búsqueda.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in filteredProducts" :key="product.id" class="border border-brand-white/10 bg-brand-black/50 p-6 relative group transition-all hover:border-brand-gold/50">
        
        <div class="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button @click="openModalEdit(product)" class="bg-brand-white/20 text-white p-2 hover:bg-brand-gold transition-colors"><Icon icon="lucide:edit" class="w-4 h-4" /></button>
          <button @click="deleteProduct(product.id, product.name)" class="bg-red-900/80 text-white p-2 hover:bg-red-600 transition-colors"><Icon icon="lucide:trash-2" class="w-4 h-4" /></button>
        </div>
        
        <div class="flex justify-between items-start mb-1">
          <p class="text-brand-gold text-[10px] uppercase tracking-[0.2em]">{{ product.category }}</p>
          <span v-if="product.featured" class="bg-brand-gold/20 text-brand-gold text-[8px] px-2 py-0.5 uppercase tracking-widest border border-brand-gold/30">Destacado</span>
        </div>
        
        <h4 class="text-brand-white font-serif-elegant text-lg mb-1 truncate pr-16">{{ product.name }}</h4>
        <p class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em] mb-4">{{ product.gemstoneType || 'Sin gema' }} | {{ product.metalType || 'Metal' }}</p>
        
        <div class="flex justify-between items-end mt-4 pt-4 border-t border-brand-white/10">
          <p class="text-brand-white/80 font-sans-luxury tracking-widest">${{ product.price.toLocaleString() }}</p>
          <p class="text-[10px] font-bold uppercase tracking-[0.2em]" :class="product.stock > 0 ? 'text-green-500' : 'text-red-500'">
            {{ product.stock > 0 ? `Stock: ${product.stock}` : 'AGOTADO' }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="showProductModal" class="fixed inset-0 bg-brand-black/95 z-50 flex items-center justify-center p-4">
      <div class="bg-brand-black border border-brand-gold p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <h3 class="text-xl md:text-2xl font-serif-elegant text-brand-gold mb-6 uppercase tracking-wider">
          {{ isEditing ? 'Editar Joya' : 'Añadir Nueva Joya' }}
        </h3>
        
        <form @submit.prevent="saveProduct" class="space-y-8">
          <div>
            <h4 class="text-brand-white uppercase tracking-widest text-xs border-b border-brand-white/10 pb-2 mb-4">Información General</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">Nombre Comercial</label>
                <input v-model="currentProduct.name" type="text" required class="w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none">
              </div>
              <div>
                <label class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">Precio (COP)</label>
                <input v-model="currentProduct.price" type="number" required class="w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none">
              </div>
              <div>
                <label class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">Categoría</label>
                <select v-model="currentProduct.category" class="w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none">
                  <option value="Anillos" class="bg-brand-black">Anillos</option>
                  <option value="Aretes" class="bg-brand-black">Aretes</option>
                  <option value="Collares" class="bg-brand-black">Collares</option>
                  <option value="Pulseras" class="bg-brand-black">Pulseras</option>
                  <option value="Piedras Sueltas" class="bg-brand-black">Piedras Sueltas</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">Stock</label>
                <input v-model="currentProduct.stock" type="number" min="0" required class="w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none">
              </div>
              <div class="flex items-end pb-2">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" v-model="currentProduct.featured" class="form-checkbox text-brand-gold bg-transparent border-brand-white/20">
                  <span class="text-[10px] text-brand-white uppercase tracking-[0.2em]">Destacar en Inicio</span>
                </label>
              </div>
            </div>
            <div class="mt-4">
              <label class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">Descripción</label>
              <textarea v-model="currentProduct.description" rows="2" class="w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none resize-none"></textarea>
            </div>
          </div>

          <div>
            <h4 class="text-brand-white uppercase tracking-widest text-xs border-b border-brand-white/10 pb-2 mb-4">Especificaciones de Alta Joyería</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><label class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">Gema Principal</label><input v-model="currentProduct.gemstoneType" placeholder="Ej: Esmeralda" type="text" class="w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none"></div>
              <div><label class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">Quilates (String)</label><input v-model="currentProduct.caratWeight" placeholder="Ej: 1.50 ct" type="text" class="w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none"></div>
              <div><label class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">Tipo de Corte</label><input v-model="currentProduct.cutType" placeholder="Ej: Emerald" type="text" class="w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none"></div>
              <div><label class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">Claridad</label><input v-model="currentProduct.clarity" placeholder="Ej: VVS1" type="text" class="w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none"></div>
              <div><label class="text-[10px] text-brand-white/50 uppercase tracking-[0.2em]">Metal Base</label><input v-model="currentProduct.metalType" placeholder="Ej: Oro 18k" type="text" class="w-full bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-end border-b border-brand-white/10 pb-2 mb-4">
              <h4 class="text-brand-white uppercase tracking-widest text-xs">Galería de Imágenes</h4>
              <button type="button" @click="addImageInput" class="text-brand-gold text-[10px] uppercase tracking-widest hover:text-brand-white">+ Añadir URL</button>
            </div>
            <div class="space-y-3">
              <div v-for="(img, index) in currentProduct.images" :key="index" class="flex items-center space-x-2 md:space-x-4">
                <span class="text-brand-white/50 text-xs hidden md:inline">{{ index + 1 }}.</span>
                <input v-model="img.imageUrl" type="url" placeholder="https://ruta.jpg" class="flex-1 bg-transparent border-b border-brand-white/20 p-2 text-brand-white text-sm focus:border-brand-gold outline-none">
                <button type="button" @click="removeImageInput(index)" class="text-red-500 hover:text-red-300 px-2"><Icon icon="lucide:x" class="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-6 mt-6 border-t border-brand-white/10">
            <button type="button" @click="showProductModal = false" class="text-brand-white/50 uppercase text-xs tracking-widest hover:text-brand-white">Cancelar</button>
            <button type="submit" class="bg-brand-gold text-brand-black px-6 md:px-8 py-3 uppercase text-xs font-bold tracking-[0.2em] hover:bg-brand-white transition-colors">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>