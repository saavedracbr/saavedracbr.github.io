/**
 * Tarjetas al compartir (og:image): una por página, 1200×630.
 *
 * `src/pages/marca/og/[slug].astro` dibuja cada una con estos textos y
 * `npm run imagenes` la captura a `public/og/<slug>.png`. Cada página pide la
 * suya con la prop `imagen` de Base.astro; el build falla si pide una que no
 * está en esta lista.
 *
 * Los textos son más cortos que la descripción de la página: tienen que leerse
 * en la vista previa de LinkedIn o WhatsApp, que es pequeña.
 */
import { casos } from './casos.ts';
import { resumenMatricula } from './dashboard.ts';
import { persona, oferta, cifrasErp } from './perfil.ts';

export const ANCHO_OG = 1200;
export const ALTO_OG = 630;

export interface TarjetaOg {
  slug: string;
  antetitulo: string;
  titulo: string;
  bajada: string;
  /** Etiquetas cortas al pie del texto: cifras verificadas o el estado del caso. */
  datos?: string[];
}

const [lema, detalleLema] = oferta.frase.split(': ');
const { inicio, pico, crecimiento } = resumenMatricula;
const datosErp = [
  `${cifrasErp.modulos} módulos en producción`,
  `${cifrasErp.procesos} procesos`,
  `Odoo ${cifrasErp.versionDesde} → ${cifrasErp.versionHasta}`,
];

export const tarjetasOg: TarjetaOg[] = [
  {
    slug: 'inicio',
    antetitulo: `${persona.titulo} · ${persona.universidad}`,
    titulo: lema,
    bajada: `${detalleLema.charAt(0).toUpperCase()}${detalleLema.slice(1)}`,
    datos: datosErp,
  },
  {
    slug: 'erp',
    antetitulo: 'BBA Pack · ERP Project Manager',
    titulo: 'El ERP de una planta, proceso por proceso',
    bajada: `Lo reconstruí tras la salida del partner externo y lo migré de Odoo ${cifrasErp.versionDesde} a ${cifrasErp.versionHasta}: hoy conecta los turnos, el huellero, la planilla y SUNAT.`,
    datos: datosErp,
  },
  {
    slug: 'casos',
    antetitulo: 'Casos',
    titulo: 'Procesos reales, contados de principio a fin',
    bajada:
      'El problema, lo que hice y el resultado: cuatro procesos del ERP de una planta y dos motores propios para simuladores.',
  },
  ...casos.map((caso) => ({
    slug: caso.slug,
    antetitulo: caso.contexto,
    titulo: caso.titulo,
    bajada: caso.bajada,
    datos: [caso.estado],
  })),
  {
    slug: 'proyectos',
    antetitulo: 'Proyectos',
    titulo: 'Más allá del ERP',
    bajada:
      'Supply chain, producto y automatización: un gemelo digital para The Fresh Connection, motores para ERPsim y el BSG, y ULiManager.',
  },
  {
    slug: 'dashboard',
    antetitulo: 'Producto propio · Investigación de mercado',
    titulo: '¿Cómo crece la U. de Lima?',
    bajada: `La matrícula creció ${crecimiento} % entre ${inicio.periodo} y ${pico.periodo}: un dashboard de 4 páginas en Data Studio.`,
  },
  {
    slug: 'cv',
    antetitulo: 'CV · una página',
    titulo: persona.nombre,
    bajada: `${persona.titulo}, ${persona.universidad}. ${oferta.frase}`,
  },
];

/** La tarjeta de una página. Rompe el build si no existe, como el chequeo de los módulos en erp.ts. */
export function tarjetaOg(slug: string): TarjetaOg {
  const tarjeta = tarjetasOg.find((t) => t.slug === slug);
  if (!tarjeta) throw new Error(`og.ts: no hay una tarjeta "${slug}". Súmala a tarjetasOg y corre \`npm run imagenes\`.`);
  return tarjeta;
}
