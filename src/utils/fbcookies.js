/**
 * Lee las cookies _fbp / _fbc que pone el Pixel de Meta.
 * Se envían al backend para que la API de conversiones (CAPI) pueda atribuir
 * los eventos (Contact, Lead, Purchase) a los anuncios correctos.
 */
export function getCookie(name) {
  try {
    const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m[2]) : null;
  } catch {
    return null;
  }
}

export function getFbCookies() {
  return { fbp: getCookie('_fbp'), fbc: getCookie('_fbc') };
}
