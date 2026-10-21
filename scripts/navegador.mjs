/**
 * Edge (o Chrome) en modo headless, para los scripts que imprimen o capturan el
 * sitio: `cv-pdf.mjs` (el CV en PDF) e `imagenes.mjs` (fondo de Zoom y demás piezas).
 *
 * Si el navegador termina con código 0 pero el archivo no aparece, el proceso no
 * pudo escribir: pasa en shells con sandbox. Córrelo desde PowerShell.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const NAVEGADORES = [
  process.env.CV_NAVEGADOR,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/microsoft-edge',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export function buscarNavegador() {
  const encontrado = NAVEGADORES.find((ruta) => existsSync(ruta));
  if (!encontrado) {
    throw new Error('No encontré Edge ni Chrome. Indica la ruta con la variable CV_NAVEGADOR.');
  }
  return encontrado;
}

/** Corre el navegador headless con `args`; resuelve con su código de salida, su stdout y su stderr. */
function correr(navegador, args) {
  // Perfil temporal: no toca el perfil del usuario ni choca con un Edge abierto.
  const perfil = mkdtempSync(join(tmpdir(), 'headless-'));
  const todos = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${perfil}`,
    ...args,
  ];
  return new Promise((resolver, rechazar) => {
    const proceso = spawn(navegador, todos, { stdio: ['ignore', 'pipe', 'pipe'] });
    let salidaEstandar = '';
    let errores = '';
    proceso.stdout.on('data', (d) => (salidaEstandar += d));
    proceso.stderr.on('data', (d) => (errores += d));
    proceso.on('error', rechazar);
    proceso.on('close', (codigo) => {
      rmSync(perfil, { recursive: true, force: true });
      resolver({ codigo, salidaEstandar, errores });
    });
  });
}

/**
 * Corre el navegador headless con `args` y espera a que escriba `salida`.
 * Borra antes la salida anterior: si el navegador no escribe, falla en vez de
 * dar por buena la copia vieja.
 */
export async function headless(navegador, args, salida) {
  rmSync(salida, { force: true });
  const { codigo, salidaEstandar, errores } = await correr(navegador, args);
  if (codigo !== 0 || !existsSync(salida)) {
    throw new Error(`El navegador terminó con código ${codigo} sin escribir ${salida}.\n${salidaEstandar}${errores}`);
  }
}

/** El DOM de `url` tal como queda después de correr sus scripts (`--dump-dom`). */
export async function volcarDom(navegador, url, args = []) {
  const { codigo, salidaEstandar, errores } = await correr(navegador, [...args, '--dump-dom', url]);
  if (codigo !== 0 || !salidaEstandar) {
    throw new Error(`El navegador terminó con código ${codigo} sin devolver el DOM de ${url}.\n${errores}`);
  }
  return salidaEstandar;
}
