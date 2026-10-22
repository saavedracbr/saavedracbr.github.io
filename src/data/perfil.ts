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
import { GA4_ID } from './medicion.ts';

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
  periodo?: string;
  /** Va en la tarjeta de la web y, si no hay `resumenCv`, en el CV: cabe en dos líneas del CV. */
  resumen: string;
  /** Nombre y resumen del CV, cuando los de la web no caben o no se leen bien solos. */
  nombreCv?: string;
  resumenCv?: string;
  herramientas: string[];
  /** Etiqueta corta en la tarjeta: "En alfa", "En curso". */
  estado?: string;
  /** Sección de /proyectos. */
  grupo: 'supply' | 'producto' | 'otros';
  /** Sale en el CV, en el orden de la lista. */
  enCv: boolean;
  /** Página de este sitio con el detalle. En la web manda sobre `enlace`. */
  pagina?: Enlace;
  /** Enlace absoluto: el del CV, y el de la web cuando no hay `pagina`. */
  enlace?: Enlace;
}

export interface Electivo {
  nombre: string;
  /** Entre paréntesis después del nombre, en el CV. */
  detalle?: string;
  codigo: string;
  /** Dónde se ve lo que aprendí, en /proyectos. Sin `url` cuando no hay una página que lo muestre. */
  aplicado: { texto: string; url?: string };
}

export interface Actividad {
  nombre: string;
  detalle: string;
  fecha?: string;
  /** Externa (constancia verificable) o del sitio (`/certificados/…`). */
  url?: string;
  enCv: boolean;
  /** Texto en la línea "Actividades" del CV, que tiene que caber en un renglón. */
  nombreCv?: string;
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
    evidencia: [
      'Huellero → ERP → planilla PLAME',
      'Facturación y guías SUNAT',
      'Control guía↔factura',
      'Gastos desde la factura con IA (Gemini)',
      'Claude Code',
    ],
  },
  {
    titulo: 'Datos para decidir',
    frase: 'Convierto datos en indicadores y decisiones.',
    evidencia: [
      'Motor ERPsim sobre SAP',
      'Réplica del BSG',
      'Dashboard de matrícula U. de Lima',
      'EDA, Big Data y Google Analytics',
    ],
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
          'Integré Google Workspace con el ERP (Apps Script): contactos sincronizados en los dos sentidos y gastos creados desde la factura en PDF, leída con IA (Gemini); hasta abr. 2026, unas 30 actualizaciones y 20 facturas al mes.',
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
          // Un solo logro para que el CV quepa en una página con los 3 proyectos.
          'Nexo entre la planta y el trade marketing de Colgate-Palmolive, Grupo Arcor y Aceros Arequipa; contribuí al +33 % en la facturación del equipo (2025 frente a 2024) y seguí cada pedido en el ERP hasta el despacho.',
        ],
      },
    ],
  },
];

/** Solo electivos: los obligatorios de la malla los lleva toda la carrera. Ordenados por relevancia. */
const electivosCursados: Electivo[] = [
  {
    nombre: 'Juego de Negocios',
    detalle: 'ERPsim y Business Strategy Game',
    codigo: '5673',
    aplicado: {
      texto: 'Dos motores propios: uno para ERPsim, que corre sobre SAP, y una réplica del BSG.',
      url: '/casos/juego-de-negocios',
    },
  },
  {
    nombre: 'Sostenibilidad Industrial',
    detalle: 'estrategia ESG en Company Game',
    codigo: '560100',
    aplicado: { texto: 'Company Game: un protocolo para medir la estrategia ESG (en curso).', url: '/proyectos#otros' },
  },
  {
    nombre: 'Metodologías Ágiles',
    codigo: '560032',
    aplicado: { texto: 'Scrum adaptado en el ERP: cada módulo es una entrega pequeña del proceso.', url: '/erp#metodo' },
  },
  {
    nombre: 'Gerencia B2B',
    codigo: '560029',
    aplicado: { texto: 'Ventas B2B a multinacionales: contribuí al +33 % en la facturación del equipo.' },
  },
  {
    nombre: 'Herramientas de Marketing Digital',
    codigo: '560005',
    // La medición con GA4 se cuenta solo cuando el sitio ya la tiene puesta.
    aplicado: {
      texto: GA4_ID
        ? 'Certificados de Google Analytics y de inbound marketing (HubSpot); mido este sitio y la feria con GA4.'
        : 'Certificados de Google Analytics y de inbound marketing (HubSpot).',
    },
  },
  {
    nombre: 'Taller de Liderazgo',
    codigo: '560076',
    aplicado: {
      texto: 'Liderar el ERP tras la salida del partner externo y capacitar a sus más de 15 usuarios.',
      url: '/erp',
    },
  },
];

export const educacion = {
  institucion: 'Universidad de Lima',
  carrera: 'Ingeniería Industrial',
  /** `null` muestra "Pregrado en curso" en el CV. Actualizar al cambiar de ciclo. */
  ciclo: '8.º' as string | null,
  egresoEstimado: 'dic. 2027' as string | null,
  electivos: electivosCursados,
} as const;

export const URL_DASHBOARD =
  'https://datastudio.google.com/reporting/6b1bf0ae-b8a9-4ca6-bb0a-421d744cdee5';
const URL_CERTIFICADO_TFC = 'https://game.thefreshconnection.eu/certificate/1KF4F5G2LM9SHEZJ';

/**
 * Todo lo que no es el ERP de BBA, que ya está en Experiencia y en /erp. La web
 * los agrupa en /proyectos; el CV toma los de `enCv`, en este orden.
 */
export const proyectos: Proyecto[] = [
  {
    slug: 'juego-de-negocios',
    nombre: 'Juego de Negocios: motores para ERPsim (SAP) y el BSG',
    /** Iniciativa propia: el curso no pedía ni enseñaba los motores. */
    contexto: 'Proyecto propio',
    periodo: 'abr.–jul. 2026',
    resumen:
      'Pronóstico de demanda con XGBoost y reposición a 3 regiones con la tabla de traslados de SAP; la réplica del BSG reproduce 8 años con 7 % de error en ingresos netos.',
    herramientas: ['Python', 'XGBoost', 'SAP S/4HANA'],
    grupo: 'supply',
    enCv: true,
    pagina: { etiqueta: 'Ver el caso', url: '/casos/juego-de-negocios' },
    enlace: { etiqueta: 'Ver el caso', url: `${persona.web}/casos/juego-de-negocios` },
  },
  {
    slug: 'tfc-gemelo-digital',
    nombre: 'Gemelo digital para The Fresh Connection',
    contexto: 'Modelos de Sistemas Logísticos · rol Supply Chain',
    periodo: 'may.–jun. 2026',
    resumen:
      'Lee los reportes del simulador, replica 26 semanas de la cadena de jugos (recetas, contratos y costos) y busca con recocido simulado la configuración de mayor ROI antes de cada ronda.',
    resumenCv:
      'Replica la cadena de jugos (recetas, contratos y costos) para evaluar decisiones antes de cada ronda.',
    herramientas: ['Python (FastAPI)', 'React'],
    grupo: 'supply',
    enCv: true,
    enlace: { etiqueta: 'Certificado de Inchainge', url: URL_CERTIFICADO_TFC },
  },
  {
    slug: 'uli-manager',
    nombre: 'ULiManager',
    nombreCv: 'ULiManager (alfa) e investigación de mercado',
    contexto: 'Producto propio',
    periodo: 'desde may. 2026',
    resumen:
      'App para universitarios: lee la matrícula y los sílabos, proyecta el promedio y sincroniza el horario con Google Calendar. Su investigación de mercado es un dashboard de matrícula de la U. de Lima desde 2020.',
    herramientas: ['Python (Streamlit)', 'APIs de Google', 'Data Studio'],
    estado: 'En alfa',
    grupo: 'producto',
    enCv: true,
  },
  {
    slug: 'dashboard-matricula',
    nombre: 'Dashboard de matrícula de la U. de Lima',
    contexto: 'Investigación de mercado de ULiManager',
    resumen:
      'Matrícula, postulantes e ingresantes por carrera desde 2020, en un dashboard de 4 páginas.',
    herramientas: ['Data Studio'],
    grupo: 'producto',
    // En el CV va dentro de ULiManager.
    enCv: false,
    pagina: { etiqueta: 'Ver el dashboard', url: '/dashboard' },
    enlace: { etiqueta: 'Ver dashboard', url: URL_DASHBOARD },
  },
  {
    slug: 'planificador-matricula',
    nombre: 'Planificador de matrícula',
    contexto: 'Producto propio',
    periodo: 'ago. 2026',
    resumen:
      'Una sola página web que lee los horarios de la U. de Lima y arma las combinaciones de secciones sin cruces. Es el problema de programar la producción: encajar actividades con restricciones.',
    herramientas: ['HTML', 'JavaScript'],
    estado: 'Demo con datos ficticios',
    // Archivo estático en public/demos/: sin red, sin localStorage y con horarios inventados.
    pagina: { etiqueta: 'Probar la demo', url: '/demos/planificador/' },
    grupo: 'producto',
    enCv: false,
  },
  {
    slug: 'prontuario',
    nombre: 'Prontuario',
    contexto: 'MVP para un estudio de abogados',
    periodo: 'sep.–oct. 2026',
    resumen:
      'Con una placa, reúne en un solo reporte PDF lo que dicen varias fuentes públicas: SUNARP, SOAT, SAT, MTC y otras.',
    herramientas: ['Python (FastAPI)', 'React', 'PostgreSQL'],
    grupo: 'otros',
    enCv: false,
  },
  {
    slug: 'organizador-gmail',
    nombre: 'Organizador de Gmail',
    contexto: 'Productividad propia',
    periodo: 'desde dic. 2025',
    resumen:
      'Cuatro bandejas en una: un script etiqueta cada correo según la cuenta a la que llegó y, en la del trabajo, según el área del remitente.',
    herramientas: ['Google Apps Script'],
    grupo: 'otros',
    enCv: false,
  },
  {
    slug: 'finper',
    nombre: 'Finper',
    contexto: 'App de finanzas personales',
    periodo: 'sep.–oct. 2026',
    resumen:
      'Lee los estados de cuenta en PDF y los avisos del banco, clasifica cada movimiento y lo analiza, con una app Android y despliegue en Google Cloud.',
    herramientas: ['Python (FastAPI)', 'Next.js', 'Android', 'Google Cloud'],
    grupo: 'otros',
    enCv: false,
  },
  {
    slug: 'arqdeco',
    nombre: 'Sitio web de ARQDECO PERÚ',
    contexto: 'Cliente: arquitectura y seguridad de edificaciones',
    periodo: 'ago. 2026',
    resumen: 'Sitio corporativo estático, sin servidor que mantener ni base de datos.',
    herramientas: ['Astro', 'Tailwind CSS'],
    grupo: 'otros',
    enCv: false,
    enlace: { etiqueta: 'Ver el preview', url: 'https://arqdeco.saavedracbr.com' },
  },
  {
    slug: 'casio-procesos',
    nombre: 'Suite para la calculadora Casio fx-9860GIII',
    contexto: 'Curso Procesos Industriales',
    periodo: 'sep.–oct. 2026',
    resumen:
      'Programas que resuelven los ejercicios del curso con sus fórmulas y tablas: refrigeración, ciclo Rankine, psicrometría y secado.',
    herramientas: ['MicroPython'],
    grupo: 'otros',
    enCv: false,
  },
  {
    slug: 'company-game',
    nombre: 'Company Game: estrategia ESG',
    contexto: 'Electivo Sostenibilidad Industrial',
    periodo: 'desde sep. 2026',
    resumen:
      'En la ronda de prueba, que se reinicia, armé un protocolo para medir y no para ganar: cómo mueve cada decisión el valor de la compañía en lo económico, lo ambiental y lo social.',
    herramientas: [],
    estado: 'En curso',
    grupo: 'otros',
    enCv: false,
  },
];

/**
 * Círculos y congresos. Next-Gen no va. En el de Gestión de Proyectos estuvo
 * por periodos; cuenta solo oct.–nov. 2025, cuando fue con el círculo al CONCEPMI.
 * El certificado del CONCEPMI no tiene URL pública (su QR solo trae el código),
 * así que el PDF va en el sitio.
 */
export const actividades: Actividad[] = [
  {
    nombre: 'Círculo de Gestión de Proyectos',
    detalle: 'U. de Lima, carrera de Ingeniería de Sistemas · miembro',
    fecha: 'oct.–nov. 2025',
    enCv: true,
    nombreCv: 'Círculo de Gestión de Proyectos y V CONCEPMI 2025 del PMI',
  },
  {
    nombre: 'Círculo Trends & Innovation Marketing',
    detalle: 'U. de Lima · miembro',
    fecha: 'desde sep. 2026',
    enCv: false,
  },
  {
    nombre: 'Círculo Inteligencia de Datos en Marketing',
    detalle: 'U. de Lima · miembro',
    fecha: 'desde oct. 2026',
    enCv: false,
  },
  {
    nombre: 'V CONCEPMI 2025, del PMI',
    detalle: 'Con el círculo, en la delegación de la U. de Lima · 20 h',
    fecha: '15–16 nov. 2025',
    url: '/certificados/concepmi-2025.pdf',
    enCv: false,
  },
  {
    nombre: 'IV Congreso Internacional de Ingeniería Industrial',
    detalle: 'U. de Lima · 12 h',
    fecha: '29–30 oct. 2025',
    url: 'https://v.ulima.pe/446405c42efe4937.pdf',
    enCv: false,
  },
  {
    nombre: 'V Congreso Internacional de Ingeniería Industrial',
    detalle: 'U. de Lima · 16 h',
    fecha: '1–2 sep. 2026',
    url: 'https://v.ulima.pe/814a827b74482a16.pdf',
    enCv: true,
    nombreCv: 'Congresos de Ingeniería Industrial 2025 y 2026',
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
    url: URL_CERTIFICADO_TFC,
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
    /** Es una constancia de asistencia (16 h), no un certificado aprobado: sale del CV para que entren los proyectos. */
    url: 'https://certificados.uni.edu.pe/verificador/search.php?cert_id=asis_058df5df4f8ac81eb760c221ad535902',
    cluster: 'C',
    enCv: false,
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
 * SAP solo como el simulador ERPsim, que prueba el motor de Juego de Negocios.
 * Sin Power BI: no se pone hasta tener una pieza que lo pruebe.
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
      'SAP S/4HANA (simulador ERPsim)',
      'Integración con APIs y biométricos',
      'Excel',
      'SQL',
      'Python',
      'Google Apps Script',
      'Data Studio',
      'Google Analytics 4',
      'Git',
      'IA generativa (Claude Code, Gemini API)',
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
