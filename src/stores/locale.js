import { defineStore } from 'pinia';
import { ref } from 'vue';
import { messages } from '@/i18n/messages';

/**
 * Idioma del sitio (ES / EN). Guarda la preferencia y detecta el navegador:
 * si el visitante tiene el navegador en inglés y no ha elegido, arranca en EN.
 *
 * Uso en componentes:
 *   import { useLocale } from '@/stores/locale';
 *   const { t, locale } = useLocale();  →  {{ t('nav.home') }}
 */
export const useLocaleStore = defineStore('locale', () => {
  const saved = localStorage.getItem('locale');
  const browser = (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  const locale = ref(saved || browser);

  function setLocale(l) {
    locale.value = l === 'en' ? 'en' : 'es';
    localStorage.setItem('locale', locale.value);
    document.documentElement.lang = locale.value;
  }

  // Traduce una clave. Reactivo: al leer locale.value, la vista se re-renderiza al cambiar.
  function t(key) {
    const dict = messages[locale.value] || messages.es;
    return dict[key] ?? messages.es[key] ?? key;
  }

  // Sincroniza el atributo lang del <html> al iniciar
  document.documentElement.lang = locale.value;

  return { locale, setLocale, t };
});

// Azúcar para importar directo el t/locale sin acordarse del store
export function useLocale() {
  const store = useLocaleStore();
  return { t: store.t, locale: store.locale, setLocale: store.setLocale };
}
