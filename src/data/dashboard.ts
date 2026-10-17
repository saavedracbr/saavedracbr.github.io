/**
 * Dashboard "Alumnado ULima" (Data Studio, antes Looker Studio).
 *
 * Las cifras de matrícula vienen de la tabla "Periodo / Alumnos" de la página
 * "Visión General por Carrera" del propio dashboard, leídas el 17 oct. 2026.
 * Si el dashboard se actualiza, se actualizan aquí.
 */
import { URL_DASHBOARD } from './perfil.ts';

/**
 * El informe permite insertarse en otros sitios (Archivo → Insertar informe en
 * Data Studio, habilitado el 17 oct. 2026). Si algún día se desactiva, poner
 * esto en `false` y la página queda solo con el botón al dashboard.
 */
export const DASHBOARD_INCRUSTABLE = true;

export const URL_DASHBOARD_EMBED = `${URL_DASHBOARD.replace('/reporting/', '/embed/reporting/')}/page/p_4r1t3wd72d`;

/** Alumnos matriculados por periodo, en miles. */
export const matricula = [
  { periodo: '2020-1', miles: 22.3 },
  { periodo: '2020-2', miles: 22.3 },
  { periodo: '2021-1', miles: 24.6 },
  { periodo: '2021-2', miles: 23.7 },
  { periodo: '2022-1', miles: 25.0 },
  { periodo: '2022-2', miles: 24.1 },
  { periodo: '2023-1', miles: 27.0 },
  { periodo: '2023-2', miles: 26.2 },
  { periodo: '2024-1', miles: 29.1 },
  { periodo: '2024-2', miles: 28.6 },
  { periodo: '2025-1', miles: 30.7 },
  { periodo: '2025-2', miles: 29.7 },
] as const;

const inicio = matricula[0];
const pico = matricula.reduce((max, m) => (m.miles > max.miles ? m : max));

/** Crecimiento de la matrícula del primer periodo al pico, en %. */
export const crecimientoMatricula = Math.round(((pico.miles - inicio.miles) / inicio.miles) * 100);

export const resumenMatricula = { inicio, pico, crecimiento: crecimientoMatricula };

export const paginasDashboard = [
  { titulo: 'Evolución histórica', detalle: 'Matriculados, postulantes e ingresantes por periodo, desde 2020.' },
  { titulo: 'Visión general por carrera', detalle: 'Cuánto pesa cada carrera en la matrícula total.' },
  { titulo: 'Evolución de matrícula por carrera', detalle: 'La matrícula de cada carrera, periodo a periodo.' },
  { titulo: 'Participación por periodo', detalle: 'El peso de cada carrera en cada semestre.' },
];
