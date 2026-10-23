/**
 * Demo del huellero: todo es inventado.
 *
 * Colaboradores, códigos y marcas son de ejemplo, para mostrar las reglas del
 * caso `huellero-planilla` sin código ni datos de BBA. Los nombres van en orden
 * alfabético (Ana A., Beto B.…) para que se vea que no son personas reales, y
 * ningún número de documento aparece: en la PLAME va uno ficticio, con letras.
 * Los turnos son los mismos de la demo de turnos.
 */
import type { TurnoId } from './turnos.ts';

export interface Colaborador {
  /** El código con el que marca en el huellero. */
  codigo: number;
  nombre: string;
  /** Su turno de la semana, de lunes a sábado. */
  turno: TurnoId;
  /** Recién llegado: su ficha aún no tiene el código, así que sus marcas quedan pendientes. */
  sinCodigo?: boolean;
}

/** La semana de la demo: del lun. 12 al dom. 18 oct. 2026. */
export const INICIO_SEMANA = '2026-10-12';
/** Hay turno de lunes a sábado; el domingo es de descanso. */
export const DIAS_CON_TURNO = 6;
/** Minutos de tolerancia: llegar o salir dentro de este margen no es tardanza ni hora extra. */
export const TOLERANCIA = 10;
/** Dos marcas del mismo código con esta distancia o menos son la misma: la segunda no cuenta. */
export const DOBLE_MARCA = 2;
/** Un corte de luz el mié. 14 (día 2), justo en el cambio de turno de la mañana. */
export const corte = { dia: 2, desde: '05:30', hasta: '06:30' };
/** El periodo de la PLAME y el formulario de su nombre de archivo. */
export const plame = { formulario: '0601', anio: '2026', mes: '10', periodo: 'octubre de 2026' };

export const colaboradores: Colaborador[] = [
  { codigo: 101, nombre: 'Ana A.', turno: 'manana' },
  { codigo: 102, nombre: 'Beto B.', turno: 'manana' },
  { codigo: 103, nombre: 'Carmen C.', turno: 'manana' },
  { codigo: 104, nombre: 'Darío D.', turno: 'tarde' },
  { codigo: 105, nombre: 'Elsa E.', turno: 'tarde' },
  { codigo: 106, nombre: 'Fabio F.', turno: 'tarde' },
  { codigo: 107, nombre: 'Gina G.', turno: 'noche' },
  { codigo: 108, nombre: 'Hugo H.', turno: 'noche' },
  { codigo: 109, nombre: 'Inés I.', turno: 'noche' },
  { codigo: 110, nombre: 'Julio J.', turno: 'manana', sinCodigo: true },
];

/**
 * Lo que manda el huellero: por código, las horas que marcó cada día de
 * calendario, de lunes a domingo. El huellero no sabe si es entrada o salida:
 * la salida del turno de noche cae en la fecha del día siguiente.
 */
export const marcas: Record<number, string[]> = {
  // Vino el domingo, su día de descanso: queda fuera de turno.
  101: ['05:56 14:03', '05:58 14:02', '05:57 14:04', '05:59 14:01', '05:55 14:05', '05:58 14:02', '08:02 12:05'],
  // El martes olvidó marcar la salida.
  102: ['05:58 14:02', '05:58', '05:59 14:01', '05:57 14:03', '05:58 14:02', '05:56 14:00', ''],
  // El jueves se quedó hasta las 16:05: 2 h 5 min extra.
  103: ['05:54 14:01', '05:57 14:03', '06:02 14:02', '05:56 16:05', '05:59 14:04', '05:55 14:01', ''],
  // El miércoles marcó dos veces al entrar; el viernes llegó 25 min tarde.
  104: ['13:57 22:02', '13:58 22:03', '13:57 13:58 22:01', '13:56 22:04', '14:25 22:03', '13:59 22:00', ''],
  // El miércoles olvidó marcar la entrada.
  105: ['13:58 22:01', '13:55 22:02', '22:03', '13:57 22:02', '13:59 22:00', '13:58 22:04', ''],
  // El miércoles su salida llegó dos veces; el sábado se quedó 1 h 30 min.
  106: ['13:56 22:03', '13:59 22:01', '13:58 22:04 22:04', '13:57 22:05', '13:58 22:02', '13:56 23:30', ''],
  107: ['21:56', '06:04 21:57', '06:02 21:55', '06:03 21:58', '06:01 21:56', '06:05 21:57', '06:02'],
  108: ['21:58', '06:03 21:56', '06:05 21:59', '06:02 21:57', '06:04 21:55', '06:01 21:58', '06:06'],
  // El jueves no vino: ni entrada el jueves ni salida el viernes.
  109: ['21:57', '06:02 21:58', '06:01 21:56', '06:03', '21:56', '06:03 21:59', '06:04'],
  // Marca normal, pero con un código que su ficha aún no tiene.
  110: ['05:57 14:02', '05:59 14:03', '05:58 14:01', '05:56 14:02', '05:57 14:04', '05:59 14:00', ''],
};
