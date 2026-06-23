/**
 * Detección de errores de tipeo comunes en correos.
 *
 * Cuando alguien escribe "juan@gmial.com" o "ana@hotmal.com", devuelve la
 * corrección sugerida ("juan@gmail.com") para mostrarla como "¿Quisiste decir...?".
 * No bloquea — solo sugiere. Evita que pedidos se pierdan por un typo.
 */

// Dominios más comunes en Colombia
const COMMON_DOMAINS = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.es',
  'icloud.com', 'hotmail.es', 'outlook.es', 'live.com', 'live.com.co',
  'gmail.com.co', 'me.com', 'protonmail.com',
];

// TLDs comunes (para corregir "gmail.con" → "gmail.com")
const COMMON_TLDS = ['com', 'co', 'es', 'net', 'org', 'com.co'];

// Distancia de Levenshtein (cuántas ediciones para pasar de a → b)
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/**
 * Devuelve un correo sugerido si detecta un typo probable, o null si está bien.
 * @param {string} email
 * @returns {string|null}
 */
export function suggestEmail(email) {
  if (!email || !email.includes('@')) return null;

  const [local, domainRaw] = email.toLowerCase().trim().split('@');
  if (!local || !domainRaw) return null;

  // Si el dominio ya es uno común exacto, no sugerimos nada
  if (COMMON_DOMAINS.includes(domainRaw)) return null;

  // Buscar el dominio común más cercano (máx 2 ediciones de diferencia)
  let best = null;
  let bestDist = Infinity;
  for (const d of COMMON_DOMAINS) {
    const dist = levenshtein(domainRaw, d);
    if (dist < bestDist) { bestDist = dist; best = d; }
  }
  if (best && bestDist > 0 && bestDist <= 2) {
    return `${local}@${best}`;
  }

  // Si no, intentar corregir solo el TLD ("gmail.con" → "gmail.com")
  const parts = domainRaw.split('.');
  if (parts.length >= 2) {
    const tld = parts.slice(1).join('.');
    let bestTld = null, bestTldDist = Infinity;
    for (const t of COMMON_TLDS) {
      const dist = levenshtein(tld, t);
      if (dist < bestTldDist) { bestTldDist = dist; bestTld = t; }
    }
    if (bestTld && bestTldDist > 0 && bestTldDist <= 1) {
      return `${local}@${parts[0]}.${bestTld}`;
    }
  }

  return null;
}
