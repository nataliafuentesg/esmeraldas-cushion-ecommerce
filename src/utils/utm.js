/**
 * Captura y persistencia de parámetros de campaña (UTM + click IDs).
 *
 * Cuando un visitante llega desde un anuncio, la URL trae ?utm_source=...&utm_campaign=...
 * Esos datos solo están en la URL en ese primer momento; al navegar se pierden.
 * Aquí los guardamos en localStorage (30 días) para poder atribuir la venta a la
 * campaña aunque el cliente navegue o vuelva días después.
 */

const STORAGE_KEY = 'cushion_attribution';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

// utm_content = anuncio · utm_term = grupo de anuncios · utm_placement = ubicación
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_placement'];

/**
 * Se llama una vez al cargar la app. Si la URL trae parámetros de campaña,
 * los guarda (sobrescribe la atribución anterior — última campaña gana).
 */
export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const data = {};
    let hasUtm = false;

    for (const key of UTM_KEYS) {
      const val = params.get(key);
      if (val) { data[key] = val; hasUtm = true; }
    }
    // IDs de clic de las plataformas (útiles aunque no haya UTM)
    if (params.get('fbclid')) { data.fbclid = params.get('fbclid'); hasUtm = true; }
    if (params.get('gclid'))  { data.gclid = params.get('gclid'); hasUtm = true; }
    if (params.get('ttclid')) { data.ttclid = params.get('ttclid'); hasUtm = true; }

    if (hasUtm) {
      data.savedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch { /* localStorage no disponible — ignorar */ }
}

/**
 * Devuelve la atribución guardada (o null si expiró / no hay).
 */
export function getAttribution() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.savedAt || Date.now() - data.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
