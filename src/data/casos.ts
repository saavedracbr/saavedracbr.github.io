/**
 * Casos del portafolio: problema → lo que hice → resultado.
 *
 * Los cuatro primeros son los procesos del ERP de BBA (ver `erp.ts`); el último
 * cuenta los dos motores propios del electivo Juego de Negocios.
 * Mismas reglas que `perfil.ts`: nada que no esté verificado, "en piloto"
 * mientras lo esté, y ningún dato de la red ni de personas reales de BBA.
 * Las métricas que aún no existen van en `porMedir`, no se inventan.
 */
import type { Enlace } from './perfil.ts';

export interface Paso {
  titulo: string;
  detalle: string;
}

export interface Diagrama {
  titulo: string;
  /** `flujo` dibuja flechas entre pasos; `lista` los muestra como opciones. */
  tipo: 'flujo' | 'lista';
  pasos: Paso[];
  nota?: string;
}

export interface Cifra {
  valor: string;
  etiqueta: string;
}

export interface Caso {
  slug: string;
  titulo: string;
  /** Una línea: qué se resolvió. Sirve de descripción en tarjetas y metadatos. */
  bajada: string;
  contexto: string;
  estado: string;
  /** Las áreas a las que le sirve el caso, para el reclutador que lo lee. */
  paraRol: string;
  herramientas: string[];
  cifras: Cifra[];
  problema: string[];
  solucion: string[];
  diagramas: Diagrama[];
  resultado: string[];
  porMedir: string[];
  /** La demo interactiva: un aviso mientras no esté publicada, o qué se prueba en ella. */
  demo?: string;
  /** Dónde está la demo, cuando ya está publicada. */
  demoUrl?: string;
  enlaces: Enlace[];
}

const contextoBba = 'BBA Pack · ERP Project Manager';
const verErp: Enlace = { etiqueta: 'El ERP completo, proceso por proceso', url: '/erp' };

export const casos: Caso[] = [
  {
    slug: 'turnos-produccion',
    titulo: 'Turnos de producción sin Excel',
    bajada: 'La hoja de turnos que se llenaba e imprimía cada día en Excel, ahora en el ERP y conectada a la nómina.',
    contexto: contextoBba,
    estado: 'En piloto',
    paraRol: 'Planeamiento de la producción, operaciones y mejora de procesos',
    herramientas: ['Odoo 19', 'Planificación', 'Nómina', 'Python'],
    cifras: [
      { valor: '100+', etiqueta: 'colaboradores en el piloto' },
      { valor: '19:00', etiqueta: 'la hora desde la que Odoo pasaba el turno al día siguiente' },
    ],
    problema: [
      'Cada día, la jefatura de producción llenaba en Excel la hoja de turnos: quién trabaja en qué proceso, en qué estación, con qué producto y cuánto. Luego la imprimía.',
      'Las horas se sumaban a mano y nada impedía asignar a la misma persona a dos tareas a la vez.',
      'Al pasar los turnos al ERP apareció otro problema: Odoo fecha la jornada en hora UTC, y en Perú (UTC−5) eso pasaba al día siguiente cualquier turno que empezara desde las 19:00. El turno de noche caía en la jornada equivocada.',
    ],
    solucion: [
      'Llevé la hoja al ERP tal como la usa la planta: por equipo, día y turno. A cada operario se le asigna proceso, estación de trabajo, producto, cantidad y una observación.',
      'Al elegir el equipo se cargan sus miembros con su última asignación, y el producto de una línea se copia a las de abajo. Armar la hoja ya no es empezar de cero.',
      'El turno de noche, de 22:00 a 06:00, es una sola jornada continua. La entrada, la salida y las horas se pueden ajustar los días en que se entra antes o se sale más tarde.',
      'Si un operario cambia de tarea a mitad del turno, se fija una hora de cambio y su jornada se parte en dos tramos. Dos asignaciones de la misma persona nunca se solapan.',
      'La hoja se imprime en PDF, agrupada por proceso o en una sola lista.',
      'Apliqué la regla de la planta, "el turno es del día en que se entra": cada turno llega a la nómina entero y en el día de su hoja.',
    ],
    diagramas: [
      {
        titulo: 'De la hoja a la nómina',
        tipo: 'flujo',
        pasos: [
          { titulo: 'Equipo y turno', detalle: 'Se elige el equipo y se cargan sus miembros.' },
          { titulo: 'Asignación', detalle: 'Proceso, estación, producto y cantidad por operario.' },
          { titulo: 'Hoja impresa', detalle: 'El PDF que se usa en planta.' },
          { titulo: 'Nómina', detalle: 'Cada turno, entero, en el día de su hoja.' },
        ],
      },
      {
        titulo: '¿De qué día es el turno de noche?',
        tipo: 'lista',
        pasos: [
          {
            titulo: 'Odoo estándar',
            detalle:
              'Fecha por UTC: el turno de 22:00 a 06:00 cae entero en el día siguiente, y uno de tarde que termina a las 22:00 se parte en dos días.',
          },
          {
            titulo: 'Regla de la planta',
            detalle: 'El turno es del día en que se entra: el de la hoja, el que el operario reconoce como suyo.',
          },
        ],
        nota: 'El cambio solo toca los turnos que vienen de la hoja. El resto del ERP sigue como lo trae Odoo.',
      },
    ],
    resultado: [
      'La hoja diaria de turnos vive en el ERP y se imprime desde ahí.',
      'Los turnos llegan a la nómina en el día correcto, sin corregirlos a mano.',
      'Está en piloto con más de 100 colaboradores, junto con las asistencias del biométrico.',
    ],
    porMedir: [
      'Minutos al día para armar la hoja de turnos, antes y después.',
      'Turnos corregidos a mano en la nómina por mes.',
    ],
    demo: 'Arma la hoja de un equipo inventado, parte una jornada con hora de cambio y compara de qué día es el turno de noche según Odoo y según la planta.',
    demoUrl: '/demos/turnos',
    enlaces: [verErp],
  },
  {
    slug: 'huellero-planilla',
    titulo: 'Del huellero a la planilla PLAME',
    bajada:
      'Las marcas del biométrico llegan solas al ERP, se cruzan con el turno y terminan en la PLAME, sin perderse en un apagón.',
    contexto: contextoBba,
    estado: 'En piloto',
    paraRol: 'Mejora de procesos, automatización y gestión de personas',
    herramientas: ['Odoo 19', 'Biométrico ZKTeco', 'Raspberry Pi', 'PLAME (SUNAT)', 'Python'],
    cifras: [
      { valor: '100+', etiqueta: 'colaboradores en el piloto' },
      { valor: '6', etiqueta: 'archivos de la PLAME generados desde la nómina' },
    ],
    problema: [
      'Recursos Humanos descargaba las marcas con el programa del biométrico y las importaba a mano al ERP. Cada empleado nuevo se daba de alta tecleándolo en el aparato.',
      'Con turnos rotativos, una salida olvidada se emparejaba con la entrada del turno siguiente, y el descanso entre ambos contaba como trabajado.',
      'En un apagón se apagan el biométrico y el router, y las marcas de ese rato se pierden o no llegan.',
      'La PLAME para SUNAT se armaba aparte de la nómina.',
    ],
    solucion: [
      'Conecté el biométrico al ERP. Cada marca llega en cuanto se produce, y un reenvío o una importación repetida nunca la duplica.',
      'Las altas del personal se hacen desde el ERP, no en el aparato.',
      'Cada entrada y salida se empareja con su turno planificado. Siempre se guarda la hora que marcó la persona, con sus horas extra. El sistema nunca inventa una hora de salida, y lo que no encaja queda señalado como "fuera de turno".',
      'Las marcas de un código que el ERP no conoce no se pierden: quedan pendientes y se asignan solas cuando se registra el código en la ficha del empleado.',
      'Una Raspberry Pi hace de puente. Si se cae internet, guarda las marcas y las reenvía cuando vuelve la conexión.',
      'Para los apagones diseñé un respaldo eléctrico con batería que mantiene encendidos el biométrico, el router y la Pi.',
      'La nómina genera los 6 archivos que importa el PDT PLAME de SUNAT, con las tablas oficiales y validaciones antes de generarlos.',
    ],
    diagramas: [
      {
        titulo: 'Cómo viaja una marca',
        tipo: 'flujo',
        pasos: [
          { titulo: 'Biométrico', detalle: 'El operario marca con su huella.' },
          { titulo: 'Raspberry Pi', detalle: 'Recibe la marca. Si no hay internet, la guarda.' },
          { titulo: 'ERP Odoo', detalle: 'Empareja entrada y salida y la cruza con el turno.' },
          { titulo: 'Planilla PLAME', detalle: 'Horas por turno y los archivos para SUNAT.' },
        ],
      },
      {
        titulo: 'Respaldo para apagones (diseño propio)',
        tipo: 'flujo',
        pasos: [
          { titulo: 'Red de 220 V', detalle: 'Con luz, alimenta todo y carga la batería.' },
          { titulo: 'Fuente y batería de 12 V', detalle: 'Si se corta la luz, la batería entra sola y nada se reinicia.' },
          { titulo: 'Fusibles por equipo', detalle: 'Una falla en un equipo no apaga a los demás.' },
          { titulo: 'Biométrico, router y Pi', detalle: 'Siguen marcando y enviando. La Pi va a 5 V con un conversor.' },
        ],
      },
    ],
    resultado: [
      'El sistema está probado de punta a punta: las marcas llegan del biométrico al ERP y se cruzan con el turno.',
      'El piloto arranca con más de 100 colaboradores. La Raspberry Pi y el respaldo se instalan en planta en octubre de 2026.',
      'Los archivos de la PLAME salen de la misma nómina del ERP.',
    ],
    porMedir: [
      'Marcas perdidas por mes.',
      'Horas de Recursos Humanos para cuadrar asistencias, antes y después.',
      'Tiempo de cierre de la planilla.',
      'Horas de autonomía del respaldo en una prueba de apagón.',
    ],
    demo: 'Próximamente: una demo con datos ficticios para simular un apagón y seguir las marcas hasta la planilla.',
    enlaces: [verErp],
  },
  {
    slug: 'ruc-factura',
    titulo: 'Del RUC a la factura',
    bajada:
      'Facturación SUNAT de punta a punta y un control que cruza cada guía con su factura, para que ningún despacho quede sin cobrar.',
    contexto: contextoBba,
    estado: 'En producción',
    paraRol: 'Back-office, control interno y finanzas',
    herramientas: ['Odoo 19', 'Facturación electrónica SUNAT', 'APIs de SUNAT', 'Python'],
    cifras: [
      { valor: '4', etiqueta: 'veredictos posibles por despacho' },
      { valor: '13', etiqueta: 'motivos de traslado en la guía (el estándar de Odoo trae 8)' },
    ],
    problema: [
      'Los datos del cliente se tecleaban a mano. Un RUC mal escrito, o un cliente con problemas en SUNAT, se descubría recién al facturar.',
      'Había que acordarse, factura por factura, de aplicar la retención o la detracción del IGV.',
      'Cada despacho sale con su guía de remisión electrónica, pero la factura se emite por separado. Si no se emite, o se emite sin atarla al despacho, nadie lo nota hasta el cierre.',
      'Revisarlo a mano obliga a cruzar dos listas largas, guía por guía.',
    ],
    solucion: [
      'Al registrar un cliente, sus datos se completan desde SUNAT por API: razón social, estado, condición, deuda coactiva y si es agente de retención.',
      'Se factura a la empresa y no a la persona que hizo el pedido.',
      'La factura marca sola si lleva retención o detracción del IGV, y nunca las dos.',
      'La guía de remisión trae los 13 motivos de traslado de SUNAT y sirve también para recepciones.',
      'La factura sale desde la guía, una por guía y con lo realmente entregado. Su PDF sigue el formato de SUNAT, con cuotas y QR.',
      'Sobre todo eso armé un informe de control que revisa cada despacho con guía y le da un veredicto. Avisa cuando el comprobante que declara la guía no coincide con la factura enlazada.',
    ],
    diagramas: [
      {
        titulo: 'Del cliente al control',
        tipo: 'flujo',
        pasos: [
          { titulo: 'Cliente', detalle: 'Se registra validado con SUNAT.' },
          { titulo: 'Guía de remisión', detalle: 'El despacho sale con su guía electrónica.' },
          { titulo: 'Factura', detalle: 'Desde la guía, con retención o detracción si corresponde.' },
          { titulo: 'Control', detalle: 'Cada despacho queda en uno de cuatro veredictos.' },
        ],
      },
      {
        titulo: 'Los cuatro veredictos',
        tipo: 'lista',
        pasos: [
          { titulo: 'Correcto', detalle: 'Hay una factura emitida y atada al despacho.' },
          { titulo: 'Factura en borrador', detalle: 'La factura existe, pero aún no se emite.' },
          { titulo: 'Facturado sin enlace', detalle: 'El pedido se facturó, pero la factura no quedó atada a este despacho.' },
          { titulo: 'Sin factura', detalle: 'No hay factura por ninguna vía: hay que emitirla.' },
        ],
        nota: '"Sin factura" y "Facturado sin enlace" se corrigen distinto. Por eso el informe los separa.',
      },
    ],
    resultado: [
      'Los clientes entran al ERP validados con SUNAT, sin teclear sus datos.',
      'Administración ve en una sola lista qué despachos faltan facturar y por qué, sin cruzar hojas de Excel.',
      'Los despachos que salieron sin factura se separan de los que se facturaron pero sin enlace.',
    ],
    porMedir: ['Despachos sin factura detectados por mes.', 'Días entre el despacho y la factura.'],
    demo: 'Próximamente: una demo con datos ficticios para filtrar despachos y ver cada veredicto.',
    enlaces: [verErp],
  },
  {
    slug: 'pedido-despacho',
    titulo: 'Del pedido al despacho',
    bajada:
      'Cada pedido se sigue hasta su orden de producción y su guía, con su fecha de entrega, y el inventario no puede quedar en negativo.',
    contexto: contextoBba,
    estado: 'En producción',
    paraRol: 'Supply chain, planeamiento y operaciones',
    herramientas: ['Odoo 19', 'Ventas', 'Fabricación', 'Inventario'],
    cifras: [
      { valor: 'Por línea', etiqueta: 'fecha de entrega, en vez de una sola por pedido' },
      { valor: '15+', etiqueta: 'usuarios internos del ERP' },
    ],
    problema: [
      'La planta fabrica contra pedido, y un mismo pedido puede traer líneas con fechas de entrega distintas. Odoo estándar maneja una sola fecha por pedido.',
      'La orden de compra del cliente se quedaba en el pedido: producción y despacho no la veían.',
      'Si un cliente cancelaba, sus órdenes de producción seguían en curso.',
      'Un movimiento mal registrado podía dejar el stock en negativo, y el inventario dejaba de ser confiable.',
    ],
    solucion: [
      'Cada línea del pedido lleva su propia fecha de entrega. Las guías y las órdenes de producción se agrupan por fecha, sin mezclar entregas distintas.',
      'La orden de compra del cliente viaja a cada orden de producción y al albarán. Si se cancela el pedido, se cancelan sus órdenes de producción en curso.',
      'Un reporte muestra lo que falta producir, por fecha límite o por producto.',
      'El albarán muestra el producto a fabricar y separa código y nombre.',
      'Ningún movimiento de inventario puede dejar un almacén interno en negativo. Las ubicaciones que lo necesitan se marcan como exentas.',
      'Cada pedido muestra de qué oportunidad comercial viene, así que el camino se sigue desde la venta.',
    ],
    diagramas: [
      {
        titulo: 'El camino de un pedido',
        tipo: 'flujo',
        pasos: [
          { titulo: 'Oportunidad', detalle: 'La venta empieza en el CRM.' },
          { titulo: 'Pedido', detalle: 'Cada línea con su fecha de entrega y la OC del cliente.' },
          { titulo: 'Producción', detalle: 'Órdenes agrupadas por fecha, con la OC del cliente.' },
          { titulo: 'Despacho', detalle: 'Albarán con lo fabricado, sin dejar stock en negativo.' },
        ],
      },
    ],
    resultado: [
      'Producción y despacho ven la orden de compra del cliente en cada documento.',
      'Las entregas con fechas distintas ya no se mezclan.',
      'El inventario no puede quedar en negativo por un movimiento mal registrado.',
    ],
    porMedir: ['Pedidos entregados a tiempo por mes.', 'Ajustes de inventario por stock negativo, antes y después.'],
    enlaces: [verErp],
  },
  {
    slug: 'juego-de-negocios',
    titulo: 'Juego de Negocios: dos simuladores, dos motores propios',
    bajada:
      'Por mi cuenta construí un motor para cada simulador del curso: uno sobre SAP (ERPsim) y una réplica del Business Strategy Game.',
    contexto: 'U. de Lima · electivo de 9.º nivel, llevado en 7.º ciclo · proyecto propio',
    estado: 'Proyecto propio',
    paraRol: 'Planeamiento, supply chain y analítica',
    herramientas: ['Python', 'XGBoost', 'SAP S/4HANA (ERPsim)', 'Google Colab', 'Business Strategy Game'],
    cifras: [
      { valor: '7 %', etiqueta: 'error en ingresos netos de la réplica del BSG, en 8 años' },
      { valor: '31.8 % → 17.0 %', etiqueta: 'error en utilidad neta, al corregir el modelo de costos' },
    ],
    problema: [
      'En el electivo Juego de Negocios se dirige una empresa en dos simuladores: ERPsim, que corre sobre SAP, y el Business Strategy Game (BSG). Cada ronda obliga a decidir con información incompleta, y decidir a ojo sale caro.',
      'En ERPsim, una empresa de muesli compra, produce y distribuye a 3 regiones. Hay que decidir cuánto mandar a cada una sin quedarse sin stock ni llenar el almacén, y un envío pequeño puede costar más en flete de lo que deja.',
      'En el BSG, las decisiones de precio, producción y capacidad se envían sin saber cómo van a mover los resultados del año.',
    ],
    solucion: [
      'El curso no pedía ninguno de los dos motores: los construí por mi cuenta, en Python.',
      'Para ERPsim, en Google Colab: el motor lee los datos del juego por OData y un modelo XGBoost pronostica la demanda diaria por producto y región, según el precio y el marketing.',
      'Con ese pronóstico fija un inventario objetivo de 5 días de cobertura más un margen por el error del pronóstico, atiende primero a las regiones que se quedaron sin stock y respeta la capacidad de cada almacén.',
      'Calcula el costo real de cada producto desde su receta y revisa si cada envío paga su flete. El resultado sale como la tabla que se carga en la transacción de traslados de SAP.',
      'Para el BSG, una réplica del simulador: lee los reportes del juego, simula cada año y evalúa decisiones de precio, producción y capacidad antes de enviarlas.',
      'La validé con backtesting de 8 años contra los resultados reales del juego. Al revisar el modelo de costos encontré defectos que se compensaban entre sí, y los corregí.',
    ],
    diagramas: [
      {
        titulo: 'El motor para ERPsim',
        tipo: 'flujo',
        pasos: [
          { titulo: 'Datos del juego', detalle: 'Ventas, precios y stock, leídos por OData.' },
          { titulo: 'Pronóstico', detalle: 'XGBoost, por producto y región.' },
          { titulo: 'Inventario objetivo', detalle: '5 días de cobertura más un margen.' },
          { titulo: 'Prioridad y capacidad', detalle: 'Primero las regiones sin stock, hasta el tope del almacén.' },
          { titulo: '¿Paga el flete?', detalle: 'Cada envío se compara con lo que cuesta mandarlo.' },
          { titulo: 'Tabla para SAP', detalle: 'Los traslados, listos para cargar.' },
        ],
      },
      {
        titulo: 'La réplica del BSG',
        tipo: 'flujo',
        pasos: [
          { titulo: 'Reportes del juego', detalle: 'Los resultados de cada año.' },
          { titulo: 'Réplica en Python', detalle: 'Simula el año con las decisiones tomadas.' },
          { titulo: 'Backtesting de 8 años', detalle: 'Lo simulado contra lo real.' },
          { titulo: 'Corregir defectos', detalle: 'Los que se compensaban entre sí.' },
        ],
      },
    ],
    resultado: [
      'La réplica del BSG reproduce 8 años con 7 % de error en ingresos netos; el error en utilidad neta bajó de 31.8 % a 17.0 % al corregir el modelo de costos.',
      'Al corregir defectos que se compensaban, el error subió antes de bajar: preferí un modelo honesto a una cifra bonita.',
      'El motor de ERPsim entrega la tabla de traslados lista para cargar en SAP.',
    ],
    porMedir: [],
    // El Colab se enlaza cuando ya no tenga credenciales en el código.
    enlaces: [{ etiqueta: 'Más proyectos: supply chain, producto y automatización', url: '/proyectos' }],
  },
];
