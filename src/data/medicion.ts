/**
 * Medición de visitas: el ID de GA4 y la UTM de cada canal que trae gente al sitio.
 *
 * El ID de medición (G-…) es público por naturaleza: va en el HTML de cada
 * página. Mientras sea `null`, el sitio no carga Google Analytics ni muestra el
 * aviso del pie.
 */
export const GA4_ID: string | null = 'G-8BBBGC2CZ7';

/** Parámetros UTM por canal. En GA4 se leen en Adquisición → Fuente / medio. */
export const utm = {
  /** El QR del CV en PDF, el que se descarga del sitio o se sube a Symplicity. */
  cv: { utm_source: 'cv', utm_medium: 'qr' },
  /** El QR del CV impreso para la feria (`npm run cv:feria`). */
  feria: { utm_source: 'feria', utm_medium: 'cv_impreso', utm_campaign: 'feria-ulima-30' },
  /** El QR del fondo de Zoom. */
  zoom: { utm_source: 'zoom', utm_medium: 'fondo' },
} as const;

export type Canal = keyof typeof utm;

/** La portada del sitio con la UTM de un canal. */
export function urlConUtm(sitio: string, canal: Canal): string {
  const url = new URL('/', sitio);
  for (const [clave, valor] of Object.entries(utm[canal])) url.searchParams.set(clave, valor);
  return url.href;
}
