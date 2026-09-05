import api from '@/api/axios';

/**
 * POST "a prueba de navegación".
 *
 * Problema: al tocar un enlace wa.me en el celular, el navegador salta a la app
 * de WhatsApp y CANCELA cualquier petición en curso. axios (XHR) y hasta
 * `fetch` con JSON fallan, porque JSON obliga a un "preflight" CORS (una
 * petición OPTIONS previa) que no alcanza a completarse durante la navegación.
 * Por eso solo se registraban los clics que NO navegaban (la ficha usa
 * window.open y mantiene viva la página).
 *
 * Solución: `navigator.sendBeacon` con content-type `text/plain`. Al ser una
 * "petición simple" NO dispara preflight y el navegador la entrega aunque la
 * página se vaya — igual que lo hace el Pixel de Meta. El backend recibe el
 * cuerpo como texto y lo parsea como JSON.
 *
 * Fire & forget: nunca bloquea ni rompe la UX.
 */
export function beacon(path, payload) {
  try {
    const base = (api.defaults.baseURL || '').replace(/\/+$/, '');
    const url = base + path;
    const body = JSON.stringify(payload);

    // 1) sendBeacon (lo más confiable al salir de la página)
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
      if (navigator.sendBeacon(url, blob)) return;
    }

    // 2) Respaldo: fetch keepalive, también como text/plain (sin preflight)
    if (typeof fetch === 'function') {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body,
        keepalive: true,
        credentials: 'omit',
        mode: 'cors',
      }).catch(() => {});
    }
  } catch {
    /* noop */
  }
}
