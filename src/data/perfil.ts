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
 * - El partner externo que tuvo BBA no se nombra, y no se publican detalles de
 *   seguridad ni de la red de la planta.
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
  /** Dónde ver el detalle, al pie del rol en el CV. */
  enlace?: Enlace;
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

export interface GrupoHabilidades {
  grupo: string;
  /** Salen en el CV, en este orden. */
  items: string[];
  /** Solo en LinkedIn y la web: el CV no tiene espacio para todo. */
  ampliado: string[];
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
    'Busco prácticas preprofesionales en mejora continua y procesos, transformación digital y ERP, planeamiento y supply chain, o analítica de operaciones.',
  /** Resumen de tres líneas para la cabecera del CV (el título ya va en la cabecera). */
  resumenCv:
    'Digitalizo operaciones: llevo procesos de planta y de back-office del Excel y el papel a ERP, automatización y datos. Desde 2023 lidero el ERP Odoo de una planta de POP y packaging: lo migré de Odoo 17 a 19 y suma 23 módulos propios en producción. Vengo de ventas B2B: veo el proceso desde el sistema y desde el cliente.',
  rolesObjetivo: [
    'Mejora continua / Procesos / Transformación digital y consultoría ERP',
    'Planeamiento / Supply chain / Compras',
    'Data / BI en operaciones',
  ],
} as const;

/** Cifras del ERP de BBA que se pueden publicar: todas verificadas. */
export const cifrasErp = {
  modulos: 23,
  procesos: 4,
  usuarios: '15+',
  colaboradores: '100+',
  versionDesde: 17,
  versionHasta: 19,
} as const;

export const pilares: Pilar[] = [
  {
    titulo: 'De proceso a sistema',
    frase: 'Levanto el proceso con quienes lo hacen, lo rediseño y lo llevo a un sistema que la gente adopta.',
    evidencia: ['ERP Odoo: 23 módulos en producción', 'Migración de Odoo 17 a 19', 'Certificados UNI de procesos y SIG'],
  },
  {
    titulo: 'Automatización e integración',
    frase: 'Conecto equipos, sistemas y entidades para quitar trabajo manual. Construyo con IA como copiloto.',
    evidencia: ['Huellero → ERP → planilla PLAME', 'Facturación y guías SUNAT', 'Control guía↔factura', 'Claude Code'],
  },
  {
    titulo: 'Datos para decidir',
    frase: 'Convierto datos en indicadores y decisiones.',
    evidencia: ['Dashboard de matrícula U. de Lima', 'Réplica del BSG', 'EDA, Big Data y Google Analytics'],
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
        modalidad: 'Freelance desde may. 2026',
        desde: 'dic. 2023',
        hasta: null,
        logros: [
          'Lidero el ERP Odoo de la planta: de automatizaciones en Studio a 23 módulos propios en producción, con más de 15 usuarios. En 2026, al salir el partner externo, reconstruí las personalizaciones y migré de Odoo 17 a 19.',
          'Talento Humano (en piloto, más de 100 colaboradores): llevé del Excel al ERP la hoja diaria de turnos por equipo, proceso y estación; integré en tiempo real los biométricos ZKTeco, con un respaldo en Raspberry Pi para no perder marcas en los apagones; y la nómina genera los archivos de la PLAME para SUNAT.',
          'Facturación SUNAT de punta a punta: clientes validados por API, factura 1:1 desde la guía de remisión, retenciones y detracciones automáticas y un control guía↔factura para que ningún despacho quede sin facturar.',
          'Trazabilidad del pedido al despacho: fecha de entrega por línea, la orden de compra del cliente en cada orden de producción y albarán, reporte de producción pendiente y bloqueo del stock negativo.',
          'Levanto cada proceso con sus usuarios, lo pruebo en un entorno aparte antes de producción y capacito al personal; presenté el proyecto a la Gerencia General. Construyo con IA (Claude Code) como copiloto.',
        ],
        enlace: { etiqueta: 'saavedracbr.com/erp', url: 'https://saavedracbr.com/erp' },
      },
      {
        cargo: 'Ejecutivo de Ventas Corporativas B2B',
        modalidad: 'Jornada parcial',
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
  /** Solo electivos: los obligatorios de la malla los lleva toda la carrera. Ordenados por relevancia. */
  electivos: [
    'Juego de Negocios (ERPsim y Business Strategy Game)',
    'Sostenibilidad Industrial (estrategia ESG en Company Game)',
    'Metodologías Ágiles',
    'Gerencia B2B',
    'Herramientas de Marketing Digital',
    'Taller de Liderazgo',
  ],
} as const;

export const URL_DASHBOARD =
  'https://datastudio.google.com/reporting/6b1bf0ae-b8a9-4ca6-bb0a-421d744cdee5';

/** Los del CV. El trabajo en BBA no va aquí: ya está en Experiencia y en /erp. */
export const proyectos: Proyecto[] = [
  {
    slug: 'dashboard-matricula',
    nombre: 'Dashboard de matrícula en la U. de Lima',
    contexto: 'Investigación de mercado propia',
    resumen:
      'Matrícula, postulantes e ingresantes por carrera desde 2020, en un dashboard de 4 páginas.',
    herramientas: ['Data Studio'],
    enlace: { etiqueta: 'Ver dashboard', url: URL_DASHBOARD },
  },
  {
    slug: 'bsg-optimizer',
    nombre: 'Modelo de decisiones para Business Strategy Game',
    /** Iniciativa propia: el curso no pedía ni enseñaba el modelo. */
    contexto: 'Proyecto propio (electivo Juego de Negocios)',
    resumen:
      'Réplica del simulador: reproduce 8 años con 7 % de error en ingresos netos; el error en utilidad neta bajó de 31.8 % a 17.0 % al corregir el modelo de costos.',
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
    url: 'https://certificados.uni.edu.pe/verificador/search.php?cert_id=cert_9a7c5fd318f9a6fca552441c675d16f7',
    cluster: 'A',
    enCv: true,
  },
  {
    nombre: 'Fundamentos de Sistemas Integrados de Gestión',
    emisor: UNI,
    emisorCorto: 'UNI',
    fecha: 'sep. 2024',
    id: '016-0014695',
    url: 'https://certificados.uni.edu.pe/verificador/search.php?cert_id=cert_7b09ee67e9d8f59cd5896af42827dbb5',
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
    url: 'https://certificados.uni.edu.pe/verificador/search.php?cert_id=cert_f7628ad47d66236d68cafc0cd7d48f24',
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
    /** Es una constancia de asistencia (16 h), no un certificado aprobado. */
    url: 'https://certificados.uni.edu.pe/verificador/search.php?cert_id=asis_058df5df4f8ac81eb760c221ad535902',
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

/**
 * Cada habilidad tiene detrás un módulo del ERP, un proyecto o un certificado.
 * Sin SAP ni Power BI: no se ponen hasta tener una pieza que lo pruebe.
 */
export const habilidades: GrupoHabilidades[] = [
  {
    grupo: 'Procesos y operaciones',
    items: [
      'Mapeo y mejora de procesos',
      'Implementación de ERP',
      'Planificación de turnos y producción',
      'Control de inventario',
      'KPIs',
      'Gestión del cambio y capacitación',
    ],
    ampliado: [
      'Levantamiento de requerimientos',
      'Gestión de proyectos',
      'Gestión de proveedores',
      'Order-to-cash',
      'Fabricación contra pedido (make-to-order)',
      'Control interno despacho–factura',
      'Turnos rotativos y nocturnos',
      'Trazabilidad de pedidos',
    ],
  },
  {
    grupo: 'Normativa Perú',
    items: [
      'Facturación electrónica y GRE (SUNAT)',
      'Detracciones y retenciones del IGV',
      'PLAME (PDT 0601)',
    ],
    ampliado: [
      'Planilla Electrónica (tablas paramétricas)',
      'Consulta RUC y estado de comprobantes',
      'Rentas de 5.ª categoría',
      'Notas de crédito y débito',
    ],
  },
  {
    grupo: 'ERP y tecnología',
    items: [
      'Odoo 17–19 (Studio, módulos a medida, migración)',
      'Integración con APIs y biométricos',
      'Excel',
      'SQL',
      'Python',
      'Data Studio',
      'Google Analytics 4',
      'Git',
      'IA generativa (Claude Code)',
    ],
    ampliado: [
      'Odoo: Ventas, CRM, Inventario, Fabricación, Contabilidad, Asistencias, Planificación y Nómina',
      'Odoo.sh (desarrollo, pruebas y producción)',
      'Reportes PDF a medida',
      'Pruebas automatizadas',
      'Docker',
      'Raspberry Pi y Linux',
      'Biométricos ZKTeco',
    ],
  },
];

/** El nivel se muestra tal cual. Inglés: B2, nunca C1 (el Duolingo Score no es una certificación). */
export const idiomas = [
  { idioma: 'Español', nivel: 'nativo' },
  { idioma: 'Inglés', nivel: 'B2, Duolingo Score 128/160, oct. 2026' },
] as const;
