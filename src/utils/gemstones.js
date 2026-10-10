/**
 * Agrupa las joyas por piedra preciosa a partir del campo libre `gemstoneType`,
 * que está lleno de variantes y typos ("Esmeralda", "Esmeraldas", "Esmerlada",
 * "Záfiros"...). En vez de comparar el texto exacto, buscamos por palabra clave.
 *
 * Bonus: una pieza COMBINADA (ej. "Esmeralda, Rubí, diamante zafiro") coincide
 * con varias piedras a la vez → aparece en cada filtro correspondiente.
 */

// Normaliza: minúsculas y sin tildes, para que el match no falle por acentos.
const norm = (s) =>
  (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// `image`: foto de stock de la gema (sube las tuyas a Cloudinary y pégalas aquí).
// Si queda vacío, el acordeón usa como respaldo una pieza real de esa piedra.
export const GEMSTONES = [
  { id: 'esmeralda', key: 'gem.esmeralda', re: /esmer|emerald/, color: '#2f6b4f', image: 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1791648319/Emerald_gemstones_tyv9hc.jpg' },
  { id: 'diamante',  key: 'gem.diamante',  re: /diaman|diamond/, color: '#7f9aa6', image: 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1791648320/Diamonds_msakcs.jpg' },
  { id: 'zafiro',    key: 'gem.zafiro',    re: /zafir|sapphire/, color: '#2b4c8c', image: 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1791648319/Blue_sapphire_gemstones_sparkling_2K_20261010110451_w7gjqp.jpg' },
  { id: 'rubi',      key: 'gem.rubi',      re: /rubi|ruby/,      color: '#8e2436', image: 'https://res.cloudinary.com/dfmvlqtfb/image/upload/v1791648364/Ruby_gemstones_macro_close-up_2K_20261010110552_n2khkp.jpg' },
];

/** ¿El producto tiene la piedra `gemId`? ('todas' siempre true) */
export function matchesGemstone(product, gemId) {
  if (!gemId || gemId === 'todas') return true;
  const g = GEMSTONES.find((x) => x.id === gemId);
  if (!g) return true;
  return g.re.test(norm(product && product.gemstoneType));
}

/** Lista de piedras que contiene un producto (para badges, etc.) */
export function productGemstones(product) {
  const t = norm(product && product.gemstoneType);
  return GEMSTONES.filter((g) => g.re.test(t)).map((g) => g.id);
}
