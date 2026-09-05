import api from '@/api/axios';

/**
 * POST "a prueba de navegación".
 *
 * Problema: axios (XHR) se CANCELA cuando el navegador se va a otra parte
 * (ej. el celular salta a la app de WhatsApp al tocar un enlace wa.me).
 * Eso hacía que Telegram / Consultas WhatsApp / la analítica propia solo
 * registraran los clics que NO navegaban (como el botón de la ficha, que abre
 * WhatsApp con window.open y mantiene viva la página).
 *
 * Solución: fetch con `keepalive` (o navigator.sendBeacon como respaldo)
 * sobrevive a la navegación, igual que lo hace el Pixel de Meta.
 *
 * Fire & forget: nunca bloquea ni rompe la UX.
 */
export function beacon(path, payload) {
  try {
    const base = (api.defaults.baseURL || '').replace(/\/+$/, '');
    const url = base + path;
    const body = JSON.stringify(payload);

    if (typeof fetch === 'function') {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
        credentials: 'omit',
      }).catch(() => {});
      return;
    }

    // Respaldo para navegadores sin fetch keepalive
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
    }
  } catch {
    /* noop */
  }
}
