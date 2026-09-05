import { beacon } from '@/utils/beacon';
import { getAttribution } from '@/utils/utm';

/**
 * Analítica propia (first-party): registra cada interacción clave en NUESTRO
 * backend (/api/events), para tener métricas independientes de GA/Meta.
 * Fire & forget: nunca bloquea ni rompe la UX.
 */

// Id persistente del visitante (para agrupar por "sesión")
function clientId() {
  try {
    let id = localStorage.getItem('cushion_cid');
    if (!id) {
      id = 'c_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('cushion_cid', id);
    }
    return id;
  } catch {
    return null;
  }
}

export function logEvent(type, data = {}) {
  try {
    const a = getAttribution() || {};
    beacon('/events', {
      type,
      source:      data.source || null,
      label:       data.label || null,
      path:        typeof window !== 'undefined' ? window.location.pathname : null,
      sessionId:   clientId(),
      utmSource:   a.utm_source || null,
      utmMedium:   a.utm_medium || null,
      utmCampaign: a.utm_campaign || null,
      utmContent:  a.utm_content || null,
      utmTerm:     a.utm_term || null,
      placement:   a.utm_placement || null,
    });
  } catch {
    /* noop */
  }
}
