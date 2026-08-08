import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axios';

/**
 * Tasa de cambio COP→USD para mostrar precios de referencia en dólares.
 * Se pide una sola vez al backend (que la trae de una API pública, con margen).
 * Si no carga, simplemente no mostramos el USD (silencioso, no rompe nada).
 */
export const useFxStore = defineStore('fx', () => {
  const copPerUsd = ref(0);
  const loaded = ref(false);
  let inflight = null;

  async function fetchRate() {
    if (loaded.value) return;
    if (inflight) return inflight;
    inflight = (async () => {
      try {
        const res = await api.get('/config/fx');
        copPerUsd.value = res.data?.copPerUsd || 0;
        loaded.value = true;
      } catch (e) {
        // Sin tasa → no mostramos USD. No es crítico.
      } finally {
        inflight = null;
      }
    })();
    return inflight;
  }

  // Convierte un precio en COP a USD aproximado (redondeado). null si no hay tasa.
  function toUsd(cop) {
    if (!copPerUsd.value || !cop) return null;
    return Math.round(cop / copPerUsd.value);
  }

  // "≈ $968 USD" o null
  function formatUsd(cop) {
    const usd = toUsd(cop);
    return usd != null ? `≈ $${usd.toLocaleString('en-US')} USD` : null;
  }

  return { copPerUsd, loaded, fetchRate, toUsd, formatUsd };
});
