import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axios';

/**
 * Cache global de productos — evita peticiones duplicadas cuando el usuario
 * navega entre Home (Destacados), Colección y Búsqueda dentro de la misma sesión.
 *
 * La segunda vista que cargue productos los recibe al instante desde memoria,
 * sin petición de red.
 */
export const useProductsStore = defineStore('products', () => {
  const products = ref([]);
  const loading = ref(false);
  const loaded = ref(false);

  async function fetchProducts() {
    if (loaded.value || loading.value) return;
    loading.value = true;
    try {
      const res = await api.get('/products');
      products.value = res.data;
      loaded.value = true;
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      loading.value = false;
    }
  }

  return { products, loading, loaded, fetchProducts };
});
