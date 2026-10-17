/**
 * Fuente única del perfil profesional.
 *
 * De aquí salen la web, el CV en PDF y los textos de LinkedIn y Symplicity, así
 * que ninguno puede contradecir a otro. Si un dato cambia, se cambia aquí.
 *
 * Reglas de redacción:
 * - Siempre "Estudiante de Ingeniería Industrial", nunca "Ingeniero".
 * - El código es evidencia, no el titular.
 * - De BBA se nombra la empresa, pero las demos usan datos ficticios.
 * - Lo que no está verificado no entra aquí.
 */

export interface Enlace {
  etiqueta: string;
  url: string;
}

export interface Rol {
  cargo: string;
  modalidad: string;
  desde: string;
  /** `null` mientras el rol siga vigente. */
  hasta: string | null;
  logros: string[];
}

export interface Experiencia {
  empresa: string;
  descripcion: string;
  ubicacion: string;
  roles: Rol[];
}

export interface Proyecto {
  slug: string;
  nombre: string;
  contexto: string;
  resumen: string;
  herramientas: string[];
  enlace?: Enlace;
}

export interface Certificado {
  nombre: string;
  emisor: string;
  /** Emisor abreviado para espacios cortos (CV). */
  emisorCorto: string;
  fecha: string | null;
  vence?: string;
  id?: string;
  url?: string;
  /** Respalda a qué cluster del mercado: A procesos, B supply chain, C datos. */
  cluster: 'A' | 'B' | 'C' | 'cliente';
  /** Sale en el CV. HubSpot queda solo en LinkedIn y la web. */
  enCv: boolean;
}

export interface Pilar {
  titulo: string;
  frase: string;
  evidencia: string[];
}

export const persona = {
  nombre: 'Bruno Saavedra Carbajal',
  nombreCorto: 'Bruno Saavedra',
  titulo: 'Estudiante de Ingeniería Industrial',
  universidad: 'Universidad de Lima',
  ubicacion: 'Lima, Perú',
  email: 'saavedracbr@gmail.com',
  /** Va en el CV. `null` lo oculta (por ejemplo, para una versión sin teléfono). */
  telefono: '+51 982 064 185' as string | null,
  web: 'https://saavedracbr.com',
  linkedin: 'https://www.linkedin.com/in/saavedracbr',
} as const;

/** La oferta profesional: la misma frase en todos los puntos de contacto. */
export const oferta = {
  frase:
    'Digitalizo operaciones: llevo procesos de planta y de back-office del Excel y el papel a ERP, automatización y datos.',
  busqueda:
    'Busco prácticas preprofesionales en mejora continua y procesos, planeamiento y supply chain, o analítica de operaciones.',
  /** Resumen de tres líneas para la cabecera del CV (el título ya va en la cabecera). */
  resumenCv:
    'Digitalizo operaciones: llevo procesos de planta y de back-office del Excel y el papel a ERP, automatización y datos. Lidero la implementación de Odoo en una planta de material POP y packaging (23 módulos a medida) y vengo de ventas B2B con multinacionales, así que veo el proceso desde el sistema y desde el cliente.',
  rolesObjetivo: [
    'Mejora continua / Procesos / Transformación',
    'Planeamiento / Supply chain / Compras',
    'Data / BI en operaciones',
  ],
} as const;

export const pilares: Pilar[] = [
  {
    titulo: 'De proceso a sistema',
    frase: 'Levanto el proceso con quienes lo hacen, lo rediseño y lo llevo a un sistema que la gente adopta.',
    evidencia: ['ERP Odoo en BBA Pack', 'Capacitación del personal', 'Certificados UNI de procesos y SIG'],
  },
  {
    titulo: 'Automatización e integración',
    frase: 'Conecto equipos, sistemas y entidades para quitar trabajo manual.',
    evidencia: ['Biométrico → ERP → planilla', 'Facturación electrónica SUNAT', 'Control guía↔factura'],
  },
  {
    titulo: 'Datos para decidir',
    frase: 'Convierto datos en indicadores y decisiones.',
    evidencia: ['Dashboard de matrícula U. de Lima', 'Modelo de pronóstico BSG', 'EDA, Big Data y Google Analytics'],
  },
  {
    titulo: 'Visión de negocio y cliente',
    frase: 'Entiendo al cliente y sé presentar a gerencia.',
    evidencia: ['Ventas B2B con multinacionales', 'Presentaciones a la Gerencia General'],
  },
];

export const experiencia: Experiencia[] = [
  {
    empresa: 'BBA Pack E.I.R.L.',
    descripcion: 'Fabricante de material POP y packaging para marcas de consumo masivo e industria',
    ubicacion: 'Lima, Perú',
    roles: [
      {
        cargo: 'ERP Project Manager',
        modalidad: 'Por proyecto desde 2026',
        desde: 'dic. 2023',
        hasta: null,
        logros: [
          'Lidero la implementación de Odoo 19 (ERP) en planta: levantamiento de procesos, diseño de la solución, 23 módulos a medida, pruebas y capacitación. Hoy lo usan más de 15 usuarios internos.',
          'Talento Humano (en piloto, para más de 100 colaboradores): conecté el biométrico ZKTeco con el ERP y diseñé un respaldo con Raspberry Pi y batería de 12 V para no perder marcas en los apagones. Los turnos rotativos pasan del Excel al sistema y las asistencias alimentarán la planilla PLAME.',
          'Facturación electrónica SUNAT desde el ERP (guías de remisión, comprobantes, retenciones y detracciones) y un control que cruza cada guía con su factura para que ningún despacho quede sin facturar.',
          'Presenté el proyecto a la Gerencia General y capacité al personal administrativo y operativo.',
        ],
      },
      {
        cargo: 'Ejecutivo de Ventas Corporativas B2B',
        modalidad: 'Jornada completa',
        desde: 'mar. 2025',
        hasta: 'abr. 2026',
        logros: [
          'Atendí a equipos de trade marketing de Colgate-Palmolive, Grupo Arcor y Aceros Arequipa en proyectos de material POP y packaging, como nexo entre el cliente y la planta.',
          'Contribuí a un aumento del 33 % en la facturación del equipo (2025 frente a 2024) y usé el ERP para comprometer fechas de entrega reales y seguir cada pedido hasta el despacho.',
        ],
      },
    ],
  },
];

export const educacion = {
  institucion: 'Universidad de Lima',
  carrera: 'Ingeniería Industrial',
  /** `null` muestra "Pregrado en curso" en el CV. Actualizar al cambiar de ciclo. */
  ciclo: '8.º' as string | null,
  egresoEstimado: 'dic. 2027' as string | null,
  cursos: [
    'Procesos Industriales',
    'Sostenibilidad Industrial (estrategia ESG en Company Game)',
    'Simuladores de negocio: Business Strategy Game y The Fresh Connection',
  ],
} as const;

export const URL_DASHBOARD =
  'https://datastudio.google.com/reporting/6b1bf0ae-b8a9-4ca6-bb0a-421d744cdee5';

export const proyectos: Proyecto[] = [
  {
    slug: 'portafolio-demos',
    nombre: 'Demos interactivas de procesos digitalizados',
    contexto: 'Portafolio personal',
    resumen:
      'Explico con demos que cualquiera puede probar, y con datos ficticios, los procesos que llevé al ERP: turnos de planta sin Excel, del huellero a la planilla y control guía↔factura.',
    herramientas: ['Astro', 'TypeScript'],
    enlace: { etiqueta: 'saavedracbr.com/demos', url: 'https://saavedracbr.com/demos' },
  },
  {
    slug: 'dashboard-matricula',
    nombre: 'Dashboard de matrícula en la U. de Lima',
    contexto: 'Investigación de mercado propia',
    resumen:
      'Recopilé y organicé datos de matrícula, postulantes e ingresantes por carrera en un dashboard de 4 páginas: evolución histórica, visión por carrera y participación por periodo.',
    herramientas: ['Looker Studio'],
    enlace: { etiqueta: 'Ver dashboard', url: URL_DASHBOARD },
  },
  {
    slug: 'bsg-optimizer',
    nombre: 'Modelo de decisiones para Business Strategy Game',
    contexto: 'Curso, U. de Lima',
    resumen:
      'Modelo de pronóstico de demanda y evaluación de decisiones de precio, producción y capacidad. Con backtesting sobre rondas anteriores, el error de pronóstico (WAPE) bajó de 31.8 % a 17.0 %.',
    herramientas: ['Python'],
  },
];

const UNI = 'Universidad Nacional de Ingeniería – Programa de Iniciación Tecnológica';

/** En el orden en que se muestran: de más a menos alineado con los clusters. */
export const certificados: Certificado[] = [
  {
    nombre: 'Gestión por procesos',
    emisor: UNI,
    emisorCorto: 'UNI',
    fecha: 'ago. 2024',
    id: '016-0011324',
    cluster: 'A',
    enCv: true,
  },
  {
    nombre: 'Fundamentos de Sistemas Integrados de Gestión',
    emisor: UNI,
    emisorCorto: 'UNI',
    fecha: 'sep. 2024',
    id: '016-0014695',
    cluster: 'A',
    enCv: true,
  },
  {
    nombre: 'The Fresh Connection',
    emisor: 'Inchainge',
    emisorCorto: 'Inchainge',
    fecha: 'jun. 2026',
    id: '1KF4F5G2LM9SHEZJ',
    url: 'https://game.thefreshconnection.eu/certificate/1KF4F5G2LM9SHEZJ',
    cluster: 'B',
    enCv: true,
  },
  {
    nombre: 'Ciencia de datos 1: Exploratory Data Analysis',
    emisor: UNI,
    emisorCorto: 'UNI',
    fecha: 'ago. 2024',
    id: '016-0010959',
    cluster: 'C',
    enCv: true,
  },
  {
    nombre: 'Google Analytics',
    emisor: 'Google Skillshop',
    emisorCorto: 'Google',
    fecha: 'jun. 2026',
    vence: 'jun. 2027',
    id: '185469105',
    url: 'https://skillshop.credential.net/77ac5eb6-92b6-411a-9516-862db9e30af6',
    cluster: 'C',
    enCv: true,
  },
  {
    nombre: 'Ciencia de datos: Big Data',
    emisor: UNI,
    emisorCorto: 'UNI',
    fecha: 'ago. 2024',
    id: '016-0014462',
    cluster: 'C',
    enCv: true,
  },
  {
    nombre: 'Inbound Marketing',
    emisor: 'HubSpot Academy',
    emisorCorto: 'HubSpot',
    fecha: 'may. 2026',
    vence: 'jun. 2028',
    url: 'https://app.hubspot.com/academy/achievements/rjwmbptr/es/1/bruno-rolando-saavedra-carbajal/inbound-marketing',
    cluster: 'cliente',
    enCv: false,
  },
];

/** Sin SAP ni Power BI: no se ponen hasta tener una pieza que lo pruebe. */
export const habilidades = [
  {
    grupo: 'Procesos y operaciones',
    items: [
      'Mapeo y mejora de procesos',
      'Implementación de ERP (Odoo)',
      'KPIs',
      'Planificación de turnos y producción',
      'Gestión del cambio y capacitación',
    ],
  },
  {
    grupo: 'Datos y herramientas',
    items: ['Excel', 'SQL', 'Python', 'Looker Studio', 'Google Analytics 4', 'Git', 'IA generativa (Claude)'],
  },
] as const;

export const idiomas = [
  { idioma: 'Español', nivel: 'Nativo' },
  { idioma: 'Inglés', nivel: 'Intermedio' },
] as const;
