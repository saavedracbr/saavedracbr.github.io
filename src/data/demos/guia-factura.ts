/**
 * Demo de guía↔factura: todo es inventado.
 *
 * Clientes, RUC, productos, precios, guías y facturas son de ejemplo, para
 * mostrar las reglas del caso `ruc-factura` sin código ni datos de BBA. Los
 * clientes van por letras griegas (Cliente Alfa, Cliente Beta…) para que se vea
 * que no son empresas reales, y sus RUC tienen el dígito verificador mal a
 * propósito: SUNAT no podría asignar ninguno, así que ninguno es el de una
 * empresa real. Si alguien pone un RUC válido, el build falla aquí abajo.
 *
 * Los números de guía y de factura van sin los ceros de relleno (T001-301 y no
 * T001-00000301): SUNAT acepta las dos formas, y así el candado no los confunde
 * con un DNI.
 */

export interface Cliente {
  id: string;
  razonSocial: string;
  ruc: string;
  /** Lo que devuelve SUNAT al registrarlo: aquí, inventado. */
  agenteRetencion: boolean;
}

export interface Producto {
  nombre: string;
  unidad: string;
  /** Valor unitario sin IGV, en soles. Los insumos no se venden: no tienen precio. */
  precio: number;
  /** Tasa de detracción si es un servicio sujeto al SPOT. */
  detraccion?: number;
}

export interface Linea {
  producto: string;
  cantidad: number;
  /** Lo que pedía el pedido, cuando la guía entregó otra cantidad. */
  pedida?: number;
}

export interface Motivo {
  codigo: string;
  nombre: string;
  /** Solo las ventas se facturan: el resto de guías no entra al control. */
  venta: boolean;
}

export interface Guia {
  numero: string;
  /** Día de octubre de 2026. */
  dia: number;
  motivo: string;
  /** El cliente, si es una venta. */
  cliente?: string;
  /** A quién va, si no es una venta. */
  destino?: string;
  pedido?: string;
  lineas: Linea[];
  /** El comprobante que la propia guía declara como relacionado. */
  declara?: string;
}

export interface Factura {
  /** Correlativo de la serie F001. Un borrador aún no tiene número. */
  correlativo?: number;
  /** Día de octubre en que se emitió o, si es un borrador, en que se creó. */
  dia: number;
  cliente: string;
  pedido?: string;
  /** La guía a la que está atada. Si falta, la factura no está enlazada a ningún despacho. */
  guia?: string;
  estado: 'emitida' | 'borrador';
  lineas: Linea[];
}

/** El mes de la demo: octubre de 2026. El control se mira al cierre, el sáb. 31. */
export const MES = { anio: 2026, mes: 10, nombre: 'octubre', cierre: 31 };
export const IGV = 0.18;
/** La retención del IGV: el 3 % del total, si el cliente es agente de retención. */
export const RETENCION = 0.03;
/** La retención y la detracción solo van si la factura pasa de este monto. */
export const UMBRAL = 700;
export const SERIE_GUIA = 'T001';
export const SERIE_FACTURA = 'F001';

export const clientes: Cliente[] = [
  { id: 'alfa', razonSocial: 'Cliente Alfa S.A.C.', ruc: '20611111114', agenteRetencion: true },
  { id: 'beta', razonSocial: 'Cliente Beta S.A.', ruc: '20622222227', agenteRetencion: false },
  { id: 'gamma', razonSocial: 'Cliente Gamma S.A.C.', ruc: '20633333331', agenteRetencion: false },
  { id: 'delta', razonSocial: 'Cliente Delta E.I.R.L.', ruc: '20644444445', agenteRetencion: false },
  { id: 'epsilon', razonSocial: 'Cliente Épsilon S.R.L.', ruc: '20655555558', agenteRetencion: false },
];

export const productos: Record<string, Producto> = {
  exhibidor: { nombre: 'Exhibidor de mostrador', unidad: 'un.', precio: 12.5 },
  display: { nombre: 'Display de piso', unidad: 'un.', precio: 95 },
  caja: { nombre: 'Caja plegadiza impresa', unidad: 'millar', precio: 380 },
  afiche: { nombre: 'Afiche impreso A2', unidad: 'ciento', precio: 60 },
  instalacion: {
    nombre: 'Instalación de exhibidores en el punto de venta',
    unidad: 'local',
    precio: 125,
    detraccion: 0.12,
  },
  planchas: { nombre: 'Planchas de cartón', unidad: 'millar', precio: 0 },
  pliegos: { nombre: 'Pliegos impresos, para laminar', unidad: 'millar', precio: 0 },
};

/** Los 13 motivos de traslado de la guía de remisión, según SUNAT. */
export const motivos: Motivo[] = [
  { codigo: '01', nombre: 'Venta', venta: true },
  { codigo: '02', nombre: 'Compra', venta: false },
  { codigo: '03', nombre: 'Venta con entrega a terceros', venta: true },
  { codigo: '04', nombre: 'Traslado entre establecimientos de la misma empresa', venta: false },
  { codigo: '05', nombre: 'Consignación', venta: false },
  { codigo: '06', nombre: 'Devolución', venta: false },
  { codigo: '07', nombre: 'Recojo de bienes transformados', venta: false },
  { codigo: '08', nombre: 'Importación', venta: false },
  { codigo: '09', nombre: 'Exportación', venta: true },
  { codigo: '13', nombre: 'Otros', venta: false },
  { codigo: '14', nombre: 'Venta sujeta a confirmación del comprador', venta: true },
  { codigo: '17', nombre: 'Traslado de bienes para transformación', venta: false },
  { codigo: '18', nombre: 'Traslado emisor itinerante de comprobantes de pago', venta: false },
];

const g = (n: number) => `${SERIE_GUIA}-${n}`;

/** Las 24 guías de octubre: 20 de venta y 4 que no se facturan. */
export const guias: Guia[] = [
  { numero: g(301), dia: 1, motivo: '01', cliente: 'alfa', pedido: 'PV-0405', lineas: [{ producto: 'display', cantidad: 40 }] },
  { numero: g(302), dia: 2, motivo: '01', cliente: 'beta', pedido: 'PV-0406', lineas: [{ producto: 'caja', cantidad: 12 }] },
  { numero: g(303), dia: 5, motivo: '03', cliente: 'gamma', pedido: 'PV-0407', lineas: [{ producto: 'exhibidor', cantidad: 300 }] },
  { numero: g(304), dia: 5, motivo: '04', destino: 'Almacén 2 de la misma empresa', lineas: [{ producto: 'display', cantidad: 60 }] },
  { numero: g(305), dia: 6, motivo: '01', cliente: 'delta', pedido: 'PV-0408', lineas: [{ producto: 'afiche', cantidad: 20 }] },
  // Un pedido chico de un agente de retención: no pasa de S/ 700, así que no lleva retención.
  { numero: g(306), dia: 7, motivo: '03', cliente: 'alfa', pedido: 'PV-0409', lineas: [{ producto: 'exhibidor', cantidad: 40 }] },
  { numero: g(307), dia: 8, motivo: '01', cliente: 'epsilon', pedido: 'PV-0410', lineas: [{ producto: 'caja', cantidad: 8 }] },
  // Su factura se hizo desde el pedido y no quedó atada a la guía.
  { numero: g(308), dia: 9, motivo: '01', cliente: 'beta', pedido: 'PV-0411', lineas: [{ producto: 'display', cantidad: 25 }] },
  { numero: g(309), dia: 12, motivo: '17', destino: 'Taller Omega, para laminar', lineas: [{ producto: 'pliegos', cantidad: 10 }] },
  { numero: g(310), dia: 13, motivo: '01', cliente: 'gamma', pedido: 'PV-0412', lineas: [{ producto: 'afiche', cantidad: 50 }] },
  { numero: g(311), dia: 14, motivo: '03', cliente: 'delta', pedido: 'PV-0413', lineas: [{ producto: 'exhibidor', cantidad: 500 }] },
  // Se pidieron 1,000 y se entregaron 960: la factura sale por 960.
  {
    numero: g(312),
    dia: 15,
    motivo: '01',
    cliente: 'alfa',
    pedido: 'PV-0414',
    lineas: [{ producto: 'exhibidor', cantidad: 960, pedida: 1000 }],
  },
  { numero: g(313), dia: 16, motivo: '01', cliente: 'epsilon', pedido: 'PV-0415', lineas: [{ producto: 'display', cantidad: 30 }] },
  { numero: g(314), dia: 19, motivo: '02', destino: 'Planta, desde Proveedor Kappa', lineas: [{ producto: 'planchas', cantidad: 6 }] },
  { numero: g(315), dia: 20, motivo: '03', cliente: 'beta', pedido: 'PV-0416', lineas: [{ producto: 'exhibidor', cantidad: 200 }] },
  // Declara la factura de la guía anterior: el control lo avisa aparte del veredicto.
  {
    numero: g(316),
    dia: 21,
    motivo: '01',
    cliente: 'gamma',
    pedido: 'PV-0417',
    lineas: [{ producto: 'caja', cantidad: 15 }],
    declara: `${SERIE_FACTURA}-425`,
  },
  // Igual que la 308: facturada desde el pedido, sin enlace.
  { numero: g(317), dia: 22, motivo: '01', cliente: 'delta', pedido: 'PV-0418', lineas: [{ producto: 'display', cantidad: 20 }] },
  { numero: g(318), dia: 23, motivo: '06', destino: 'Proveedor Kappa', lineas: [{ producto: 'planchas', cantidad: 2 }] },
  { numero: g(319), dia: 26, motivo: '01', cliente: 'alfa', pedido: 'PV-0419', lineas: [{ producto: 'afiche', cantidad: 30 }] },
  { numero: g(320), dia: 27, motivo: '03', cliente: 'epsilon', pedido: 'PV-0420', lineas: [{ producto: 'exhibidor', cantidad: 150 }] },
  { numero: g(321), dia: 28, motivo: '01', cliente: 'beta', pedido: 'PV-0421', lineas: [{ producto: 'caja', cantidad: 6 }] },
  // Los dos despachos del cierre que nadie facturó.
  { numero: g(322), dia: 29, motivo: '03', cliente: 'gamma', pedido: 'PV-0422', lineas: [{ producto: 'display', cantidad: 15 }] },
  { numero: g(323), dia: 30, motivo: '01', cliente: 'delta', pedido: 'PV-0423', lineas: [{ producto: 'exhibidor', cantidad: 400 }] },
  { numero: g(324), dia: 30, motivo: '01', cliente: 'alfa', pedido: 'PV-0424', lineas: [{ producto: 'caja', cantidad: 20 }] },
];

const linea = (guia: string): Linea[] =>
  guias.find((x) => x.numero === guia)!.lineas.map(({ producto, cantidad }) => ({ producto, cantidad }));
const desdeGuia = (correlativo: number, dia: number, guia: string): Factura => {
  const { cliente, pedido } = guias.find((x) => x.numero === guia)!;
  return { correlativo, dia, cliente: cliente!, pedido, guia, estado: 'emitida', lineas: linea(guia) };
};

/**
 * Las 20 facturas de octubre, como salen del ERP (con los borradores). Por los
 * totales, octubre cuadra: 20 guías de venta y 20 facturas. Pero una es de una
 * guía de septiembre, otra es un servicio sin guía, dos no están atadas a su
 * despacho, dos son borradores y a dos despachos no les llegó ninguna.
 */
export const facturas: Factura[] = [
  // De la última guía de septiembre (T001-298), emitida el 1 de octubre.
  { correlativo: 412, dia: 1, cliente: 'epsilon', pedido: 'PV-0404', guia: g(298), estado: 'emitida', lineas: [{ producto: 'afiche', cantidad: 40 }] },
  desdeGuia(413, 1, g(301)),
  desdeGuia(414, 2, g(302)),
  desdeGuia(415, 6, g(303)),
  desdeGuia(416, 6, g(305)),
  desdeGuia(417, 7, g(306)),
  desdeGuia(418, 8, g(307)),
  // Hecha desde el pedido PV-0411: el despacho T001-308 queda "facturado sin enlace".
  { correlativo: 419, dia: 9, cliente: 'beta', pedido: 'PV-0411', estado: 'emitida', lineas: linea(g(308)) },
  desdeGuia(420, 13, g(310)),
  desdeGuia(421, 14, g(311)),
  desdeGuia(422, 15, g(312)),
  desdeGuia(423, 16, g(313)),
  // Un servicio: no traslada bienes, así que no tiene guía ni entra al control.
  { correlativo: 424, dia: 19, cliente: 'alfa', estado: 'emitida', lineas: [{ producto: 'instalacion', cantidad: 20 }] },
  desdeGuia(425, 20, g(315)),
  desdeGuia(426, 21, g(316)),
  { correlativo: 427, dia: 23, cliente: 'delta', pedido: 'PV-0418', estado: 'emitida', lineas: linea(g(317)) },
  desdeGuia(428, 26, g(319)),
  desdeGuia(429, 28, g(321)),
  { ...desdeGuia(0, 27, g(320)), correlativo: undefined, estado: 'borrador' },
  { ...desdeGuia(0, 30, g(324)), correlativo: undefined, estado: 'borrador' },
];

// --- Que ningún RUC de la demo pueda ser el de una empresa real ---

const PESOS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
function digitoVerificador(diez: string) {
  const suma = [...diez].reduce((total, d, i) => total + Number(d) * PESOS[i], 0);
  const resto = 11 - (suma % 11);
  return resto === 10 ? 0 : resto === 11 ? 1 : resto;
}
for (const c of clientes) {
  if (!/^\d{11}$/.test(c.ruc) || digitoVerificador(c.ruc.slice(0, 10)) === Number(c.ruc[10])) {
    throw new Error(`guia-factura.ts: el RUC de ${c.razonSocial} es válido. Cambia su último dígito para que no sea real.`);
  }
}
