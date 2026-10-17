/**
 * Rutas del sitio, independientes de dónde se sirva.
 *
 * Las páginas escriben siempre contra la raíz —`/cv`, `/casos/talento-humano`—
 * y estas funciones añaden el prefijo de publicación si algún día hace falta
 * servir bajo un subdirectorio. Con `base` en `/` son no-op.
 */

/** Prefijo bajo el que se sirve el sitio. Siempre empieza y acaba en barra. */
const BASE = normalizarBase(import.meta.env.BASE_URL);

function normalizarBase(valor: string | undefined): string {
  if (!valor || valor === '/') return '/';
  const conInicio = valor.startsWith('/') ? valor : `/${valor}`;
  return conInicio.endsWith('/') ? conInicio : `${conInicio}/`;
}

/**
 * Ruta de un enlace interno, con el prefijo de publicación puesto. Las rutas
 * que no son del sitio —`mailto:`, `https://`, anclas— se devuelven intactas.
 */
export function ruta(camino: string): string {
  if (BASE === '/') return camino;
  if (!camino.startsWith('/')) return camino;
  return `${BASE}${camino.slice(1)}`;
}

/**
 * URL absoluta de una ruta del sitio, para canónicas, tarjetas al compartir y
 * el QR del CV. Pasa primero por `ruta()` para que un subdirectorio sobreviva.
 */
export function urlAbsoluta(camino: string, sitio: URL | undefined): string {
  return new URL(ruta(camino), sitio).href;
}

/** Quita el prefijo de publicación de una ruta del navegador. */
export function sinBase(pathname: string): string {
  if (BASE === '/') return pathname;
  if (pathname === BASE) return '/';
  if (pathname === BASE.slice(0, -1)) return '/';
  return pathname.startsWith(BASE) ? `/${pathname.slice(BASE.length)}` : pathname;
}

/**
 * Dirección para mostrar en texto impreso: sin protocolo, sin `www.` y sin la
 * barra final. `https://www.linkedin.com/in/x/` → `linkedin.com/in/x`.
 */
export function urlVisible(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}
