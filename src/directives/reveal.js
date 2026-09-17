/**
 * Directiva v-reveal: anima la aparición de un elemento cuando entra en el
 * viewport al hacer scroll (fade + subida suave). Se dispara una sola vez.
 *
 * Uso:  <section v-reveal>…</section>
 *       <div v-reveal="{ delay: 150 }">…</div>   (retraso en ms, para escalonar)
 *
 * Respeta prefers-reduced-motion (accesibilidad) mostrando todo sin animación.
 */

let observer = null;

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  return observer;
}

export default {
  mounted(el, binding) {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = getObserver();
    if (reduce || !io) {
      el.classList.add('is-visible');
      return;
    }

    el.classList.add('reveal');
    const opts = binding.value || {};
    if (opts.variant) el.classList.add(`reveal--${opts.variant}`);
    if (opts.delay) el.style.transitionDelay = `${opts.delay}ms`;
    io.observe(el);
  },
  unmounted(el) {
    if (observer) observer.unobserve(el);
  },
};
