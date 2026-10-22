/**
 * Demo de la hoja de turnos: todo es inventado.
 *
 * Equipos, nombres, procesos, estaciones y productos son de ejemplo, para mostrar
 * las reglas del caso `turnos-produccion` sin código ni datos de BBA.
 */

export type TurnoId = 'manana' | 'tarde' | 'noche';

export interface Turno {
  nombre: string;
  /** Horas en formato HH:MM, hora de Lima. */
  entrada: string;
  salida: string;
}

export const turnos: Record<TurnoId, Turno> = {
  manana: { nombre: 'Mañana', entrada: '06:00', salida: '14:00' },
  tarde: { nombre: 'Tarde', entrada: '14:00', salida: '22:00' },
  noche: { nombre: 'Noche', entrada: '22:00', salida: '06:00' },
};

/** Cada proceso con sus estaciones de trabajo. */
export const procesos: { nombre: string; estaciones: string[] }[] = [
  { nombre: 'Impresión', estaciones: ['Impresora offset 1', 'Impresora digital 2'] },
  { nombre: 'Troquelado', estaciones: ['Troqueladora 1', 'Troqueladora 2'] },
  { nombre: 'Pegado', estaciones: ['Pegadora 1'] },
  { nombre: 'Armado', estaciones: ['Mesa de armado 1', 'Mesa de armado 2', 'Mesa de armado 3'] },
  { nombre: 'Embalaje', estaciones: ['Zona de embalaje'] },
];

export const productos = [
  'Exhibidor de piso',
  'Display de mostrador',
  'Caja plegadiza',
  'Bandeja troquelada',
  'Cabecera de góndola',
  'Stopper de anaquel',
];

export interface Asignacion {
  proceso: string;
  estacion: string;
  producto: string;
  cantidad: number;
}

export interface Miembro {
  nombre: string;
  /** La última asignación: con ella se precarga la hoja al elegir el equipo. */
  ultima: Asignacion;
  /** Un cambio de tarea a mitad del turno, para que la demo lo traiga hecho. */
  cambio?: { hora: string; luego: Asignacion };
}

export interface Equipo {
  id: string;
  nombre: string;
  supervisor: string;
  turno: TurnoId;
  miembros: Miembro[];
}

export const equipos: Equipo[] = [
  {
    id: 'a',
    nombre: 'Equipo A',
    supervisor: 'Rosa T.',
    turno: 'manana',
    miembros: [
      { nombre: 'Carla V.', ultima: { proceso: 'Impresión', estacion: 'Impresora digital 2', producto: 'Cabecera de góndola', cantidad: 150 } },
      { nombre: 'Diego R.', ultima: { proceso: 'Troquelado', estacion: 'Troqueladora 1', producto: 'Display de mostrador', cantidad: 300 } },
      {
        nombre: 'Pedro H.',
        ultima: { proceso: 'Pegado', estacion: 'Pegadora 1', producto: 'Display de mostrador', cantidad: 250 },
        cambio: {
          hora: '10:00',
          luego: { proceso: 'Armado', estacion: 'Mesa de armado 2', producto: 'Display de mostrador', cantidad: 120 },
        },
      },
      { nombre: 'Lucía M.', ultima: { proceso: 'Armado', estacion: 'Mesa de armado 1', producto: 'Exhibidor de piso', cantidad: 25 } },
      { nombre: 'Sofía G.', ultima: { proceso: 'Armado', estacion: 'Mesa de armado 3', producto: 'Stopper de anaquel', cantidad: 400 } },
      { nombre: 'Andrés C.', ultima: { proceso: 'Embalaje', estacion: 'Zona de embalaje', producto: 'Display de mostrador', cantidad: 300 } },
    ],
  },
  {
    id: 'b',
    nombre: 'Equipo B',
    supervisor: 'Jorge P.',
    turno: 'tarde',
    miembros: [
      { nombre: 'Martín L.', ultima: { proceso: 'Impresión', estacion: 'Impresora offset 1', producto: 'Bandeja troquelada', cantidad: 900 } },
      { nombre: 'Valeria Q.', ultima: { proceso: 'Troquelado', estacion: 'Troqueladora 2', producto: 'Bandeja troquelada', cantidad: 700 } },
      { nombre: 'Renato F.', ultima: { proceso: 'Pegado', estacion: 'Pegadora 1', producto: 'Caja plegadiza', cantidad: 800 } },
      { nombre: 'Paola D.', ultima: { proceso: 'Armado', estacion: 'Mesa de armado 2', producto: 'Cabecera de góndola', cantidad: 60 } },
      { nombre: 'Hugo N.', ultima: { proceso: 'Embalaje', estacion: 'Zona de embalaje', producto: 'Bandeja troquelada', cantidad: 1200 } },
    ],
  },
  {
    id: 'c',
    nombre: 'Equipo C',
    supervisor: 'Miguel S.',
    turno: 'noche',
    miembros: [
      { nombre: 'Elena B.', ultima: { proceso: 'Impresión', estacion: 'Impresora offset 1', producto: 'Caja plegadiza', cantidad: 1200 } },
      {
        nombre: 'Iván Z.',
        ultima: { proceso: 'Troquelado', estacion: 'Troqueladora 1', producto: 'Caja plegadiza', cantidad: 600 },
        cambio: {
          hora: '02:00',
          luego: { proceso: 'Pegado', estacion: 'Pegadora 1', producto: 'Caja plegadiza', cantidad: 500 },
        },
      },
      { nombre: 'Karen O.', ultima: { proceso: 'Troquelado', estacion: 'Troqueladora 2', producto: 'Bandeja troquelada', cantidad: 800 } },
      { nombre: 'Raúl E.', ultima: { proceso: 'Armado', estacion: 'Mesa de armado 1', producto: 'Exhibidor de piso', cantidad: 30 } },
      { nombre: 'Nadia J.', ultima: { proceso: 'Embalaje', estacion: 'Zona de embalaje', producto: 'Caja plegadiza', cantidad: 1000 } },
    ],
  },
];
