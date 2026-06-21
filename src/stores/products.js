import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axios';

/**
 * Cache global de productos — evita peticiones duplicadas cuando el usuario
 * navega entre Home (Destacados), Colección y Búsqueda dentro de la misma sesión.
 *
 * Importante: si una carga ya está en curso, las llamadas concurrentes esperan
 * a ESA MISMA petición (no retornan vacío). Esto evita el bug de "entro a Joyas
 * y no carga nada" cuando se navega antes de que termine la carga del Home.
 */
export const useProductsStore = defineStore('products', () => {
  const products = ref([]);
  const loading = ref(false);
  const loaded = ref(false);

  // Promesa de la carga en curso (compartida entre llamadas concurrentes)
  let inflight = null;

  async function fetchProducts() {
    // Ya cargado → nada que hacer
    if (loaded.value) return;
    // Hay una carga en curso → esperamos ESA misma petición
    if (inflight) return inflight;

    loading.value = true;
    inflight = (async () => {
      try {
        const res = await api.get('/products');
        products.value = res.data;
        loaded.value = true;
      } catch (err) {
        console.error('Error cargando productos:', err);
        // No marcamos loaded → permite reintentar en la próxima navegación
      } finally {
        loading.value = false;
        inflight = null;
      }
    })();

    return inflight;
  }

  return { products, loading, loaded, fetchProducts };
});
