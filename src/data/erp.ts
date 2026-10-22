/**
 * El ERP de BBA Pack, proceso por proceso: la página /erp y la portada.
 *
 * Cada paso es uno o varios módulos propios, contados en `modulos` y escritos
 * en lenguaje de negocio. Los nombres técnicos de los módulos no se publican.
 * Mismas reglas que `perfil.ts`: solo lo verificado, "en piloto" mientras lo
 * esté, sin nombrar al partner y sin detalles de la red ni de la seguridad.
 */
import type { ImageMetadata } from 'astro';
import { cifrasErp } from './perfil.ts';
import { casos, type Caso } from './casos.ts';
// Ilustraciones hechas con IA (prompts B3 del plan v3): sin texto, cifras ni pantallas.
import imgTurnos from '../assets/procesos/turnos-produccion.jpg';
import imgHuellero from '../assets/procesos/huellero-planilla.jpg';
import imgRucFactura from '../assets/procesos/ruc-factura.jpg';
import imgPedidoDespacho from '../assets/procesos/pedido-despacho.jpg';

export interface Ilustracion {
  src: ImageMetadata;
  alt: string;
}

export interface PasoProceso {
  titulo: string;
  detalle: string;
  /** Módulos propios que hay detrás de este paso. */
  modulos: number;
}

/** Título, bajada y "útil para" salen del caso que cuenta el proceso. */
export interface Proceso {
  caso: Caso;
  ilustracion: Ilustracion;
  pasos: PasoProceso[];
  modulos: number;
}

export interface Hito {
  periodo: string;
  titulo: string;
  detalle: string;
}

const definicion: { caso: string; ilustracion: Ilustracion; pasos: PasoProceso[] }[] = [
  {
    caso: 'turnos-produccion',
    ilustracion: {
      src: imgTurnos,
      alt: 'Ilustración: una pizarra de turnos con su calendario y un reloj, junto a tres estaciones de trabajo de la planta unidas por flechas.',
    },
    pasos: [
      {
        titulo: 'Hoja diaria de turnos',
        detalle:
          'Por equipo, día y turno. A cada operario se le asigna proceso, estación de trabajo, producto y cantidad, y la hoja se imprime en PDF.',
        modulos: 1,
      },
      {
        titulo: 'El turno es del día en que se entra',
        detalle: 'Cada turno llega a la nómina entero y en el día de su hoja, también el de noche.',
        modulos: 1,
      },
      {
        titulo: 'Calendario que se lee de un vistazo',
        detalle: 'El calendario mensual de turnos muestra el día de la semana sobre cada fecha.',
        modulos: 1,
      },
    ],
  },
  {
    caso: 'huellero-planilla',
    ilustracion: {
      src: imgHuellero,
      alt: 'Ilustración: un lector de huella en la pared, conectado a una caja de respaldo, a la nube y a una hoja de planilla.',
    },
    pasos: [
      {
        titulo: 'Marcas en tiempo real',
        detalle:
          'El biométrico envía cada marca al ERP sin duplicarla, el personal se da de alta desde el ERP y un respaldo guarda las marcas si se va la luz o el internet.',
        modulos: 1,
      },
      {
        titulo: 'Marcas ancladas al turno',
        detalle: 'Cada entrada y salida se empareja con el turno planificado. Lo que no encaja queda señalado.',
        modulos: 1,
      },
      {
        titulo: 'PLAME para SUNAT',
        detalle: 'La nómina genera los 6 archivos del PDT PLAME, con las tablas oficiales y validaciones antes de generarlos.',
        modulos: 1,
      },
    ],
  },
  {
    caso: 'ruc-factura',
    ilustracion: {
      src: imgRucFactura,
      alt: 'Ilustración: una guía de remisión y una factura unidas con un clip, un sello de verificación y un camión de despacho.',
    },
    pasos: [
      {
        titulo: 'Cliente validado con SUNAT',
        detalle: 'Estado, condición, deuda coactiva y si es agente de retención, consultados por API y no tecleados.',
        modulos: 4,
      },
      {
        titulo: 'Empresa y contacto',
        detalle: 'Se factura a la empresa, no a la persona que hizo el pedido, y se muestra su nombre comercial.',
        modulos: 1,
      },
      {
        titulo: 'Guía de remisión completa',
        detalle: 'Los 13 motivos de traslado de SUNAT (el estándar de Odoo trae 8) y guías también para recepciones.',
        modulos: 1,
      },
      {
        titulo: 'Factura desde la guía',
        detalle: 'Una factura por guía, con lo realmente entregado, enlazadas en los dos sentidos.',
        modulos: 1,
      },
      {
        titulo: 'Retención o detracción, sola',
        detalle: 'La factura marca sola la retención o la detracción del IGV, y nunca las dos.',
        modulos: 1,
      },
      {
        titulo: 'Factura en formato SUNAT',
        detalle: 'PDF según el anexo de SUNAT, con detracción, retención, cuotas y QR, y consulta de su estado.',
        modulos: 2,
      },
      {
        titulo: 'Control guía↔factura',
        detalle: 'Cada despacho con guía recibe uno de 4 veredictos, para que ninguno quede sin facturar.',
        modulos: 1,
      },
    ],
  },
  {
    caso: 'pedido-despacho',
    ilustracion: {
      src: imgPedidoDespacho,
      alt: 'Ilustración: un pedido que pasa a una orden de producción, a la estantería del almacén y al camión de despacho.',
    },
    pasos: [
      {
        titulo: 'De la oportunidad al pedido',
        detalle: 'Cada pedido muestra de qué oportunidad comercial viene.',
        modulos: 1,
      },
      {
        titulo: 'Fecha de entrega por línea',
        detalle: 'Las guías y las órdenes de producción se agrupan por fecha, sin mezclar entregas.',
        modulos: 1,
      },
      {
        titulo: 'La OC del cliente, de punta a punta',
        detalle: 'Viaja a cada orden de producción y al albarán. Si se cancela el pedido, se cancelan sus órdenes.',
        modulos: 1,
      },
      {
        titulo: 'Producción pendiente',
        detalle: 'Un reporte de lo que falta producir, por fecha límite o por producto.',
        modulos: 1,
      },
      {
        titulo: 'Albarán con lo fabricado',
        detalle: 'Muestra el producto a fabricar y separa código y nombre.',
        modulos: 1,
      },
      {
        titulo: 'Stock que no queda en negativo',
        detalle: 'Ningún movimiento puede dejar un almacén interno en negativo, salvo las ubicaciones exentas.',
        modulos: 1,
      },
    ],
  },
];

export const procesos: Proceso[] = definicion.map(({ caso: slug, ilustracion, pasos }) => {
  const caso = casos.find((c) => c.slug === slug);
  if (!caso) throw new Error(`erp.ts: no hay un caso "${slug}" en casos.ts.`);
  return { caso, ilustracion, pasos, modulos: pasos.reduce((total, paso) => total + paso.modulos, 0) };
});

// Si alguien agrega o quita un paso sin cuadrar las cifras, el build falla aquí.
const totalModulos = procesos.reduce((total, proceso) => total + proceso.modulos, 0);
if (totalModulos !== cifrasErp.modulos || procesos.length !== cifrasErp.procesos) {
  throw new Error(
    `erp.ts suma ${totalModulos} módulos en ${procesos.length} procesos; perfil.ts dice ${cifrasErp.modulos} en ${cifrasErp.procesos}.`,
  );
}

export const trayectoria: Hito[] = [
  {
    periodo: 'dic. 2023',
    titulo: 'Empiezo a liderar el ERP',
    detalle: 'Implementación de Odoo en la planta: procesos, configuración y capacitación.',
  },
  {
    periodo: '2024',
    titulo: 'Primeras automatizaciones',
    detalle: 'Acciones automatizadas y módulos con Odoo Studio, la herramienta sin código de Odoo.',
  },
  {
    periodo: '2025',
    titulo: 'Módulos propios',
    detalle: 'Desarrollo los primeros módulos a medida, que se integraban a través del partner externo.',
  },
  {
    periodo: 'dic. 2025 – abr. 2026',
    titulo: 'Google Workspace ↔ ERP',
    detalle: 'Contactos sincronizados con Google y gastos que se creaban solos desde la factura en PDF, leída con IA (Gemini).',
  },
  {
    periodo: 'mar. 2026',
    titulo: 'Internalización y migración',
    detalle:
      'El partner sale y exige desinstalar todo lo personalizado. Reconstruyo el ERP, lo migro de Odoo 17 a 19 y monto entornos de desarrollo, pruebas y producción.',
  },
  {
    periodo: 'mar.–jul. 2026',
    titulo: 'SUNAT, ventas y producción',
    detalle: 'Factura desde la guía, clientes validados con SUNAT y trazabilidad del pedido. En julio ordeno todo en módulos por proceso.',
  },
  {
    periodo: 'ago. 2026',
    titulo: 'Talento Humano',
    detalle: 'Turnos de producción, biométricos conectados al ERP y la PLAME desde la nómina.',
  },
  {
    periodo: 'oct. 2026',
    titulo: 'Piloto en planta',
    detalle: 'Talento Humano entra en piloto con más de 100 colaboradores, con su respaldo para apagones.',
  },
];

export const metodo: Omit<PasoProceso, 'modulos'>[] = [
  { titulo: 'Levantar el proceso', detalle: 'Con quienes lo hacen, en planta o en oficina.' },
  { titulo: 'Definir la regla', detalle: 'Escribir la regla de negocio antes de tocar el sistema.' },
  {
    titulo: 'Construir',
    detalle:
      'Módulos a medida en Odoo, en entregas pequeñas (Scrum adaptado): cada módulo es una parte del proceso que se revisa y corrige por separado. Con IA (Claude Code) como copiloto.',
  },
  { titulo: 'Probar', detalle: 'Pruebas automáticas para las reglas que no pueden fallar.' },
  { titulo: 'Ensayar', detalle: 'En un entorno aparte, igual al real, antes de tocar producción.' },
  { titulo: 'Publicar', detalle: 'El cambio pasa a producción solo después de probarse.' },
  { titulo: 'Capacitar', detalle: 'Y ajustar con lo que dicen los usuarios.' },
];

/**
 * Scripts de Google Apps Script alrededor del ERP. Se usaron hasta abr. 2026,
 * así que van en pasado. No son módulos de Odoo: no entran en la suma de arriba,
 * y no se publica su código ni sus enlaces.
 */
export const integraciones: (Omit<PasoProceso, 'modulos'> & { volumen: string })[] = [
  {
    titulo: 'Contactos sincronizados',
    detalle:
      'Odoo y Google Contacts se sincronizaban en los dos sentidos, casi en tiempo real, sin que un lado reenviara sin fin el cambio del otro.',
    volumen: 'Unas 30 actualizaciones al mes',
  },
  {
    titulo: 'Gastos desde la factura',
    detalle:
      'La factura en PDF entraba a una carpeta de Drive, la IA (Gemini) leía sus datos y el gasto se creaba en Odoo con la factura adjunta. Si algo fallaba, llegaba una alerta por correo.',
    volumen: 'Unas 20 facturas al mes',
  },
];

export const notaIntegraciones = `Scripts de Google Apps Script, de dic. 2025 a abr. 2026. No suman a los ${cifrasErp.modulos} módulos.`;

export const reservas = [
  'El sistema y los datos son de BBA Pack: aquí no hay capturas del ERP real ni nombres de personas.',
  'Las demos están hechas desde cero y usan datos ficticios.',
  'Tampoco publico detalles de la red ni de la seguridad de la planta.',
];
