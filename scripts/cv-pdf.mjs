/**
 * Imprime /cv a PDF con Edge (o Chrome) en modo headless.
 *
 * Uso: `npm run cv` (construye el sitio y luego corre este script).
 *
 * 1. Levanta `astro preview` sobre `dist/` en un puerto libre.
 * 2. Imprime http://127.0.0.1:<puerto>/cv/ a `public/cv-bruno-saavedra.pdf`
 *    y lo copia a `dist/`, para que el build ya publicado lo incluya.
 * 3. Verifica que el PDF tenga **una sola página** y fuentes incrustadas
 *    (texto real, seleccionable). Si no, termina con error.
 */
import { preview } from 'astro';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NOMBRE = 'cv-bruno-saavedra.pdf';
const SALIDA = join(RAIZ, 'public', NOMBRE);
const PUERTO = 4329;

const NAVEGADORES = [
  process.env.CV_NAVEGADOR,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/microsoft-edge',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

function buscarNavegador() {
  const encontrado = NAVEGADORES.find((ruta) => existsSync(ruta));
  if (!encontrado) {
    throw new Error('No encontré Edge ni Chrome. Indica la ruta con la variable CV_NAVEGADOR.');
  }
  return encontrado;
}

function imprimir(navegador, url, salida) {
  // Perfil temporal: no toca el perfil del usuario ni choca con un Edge abierto.
  const perfil = mkdtempSync(join(tmpdir(), 'cv-pdf-'));
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${perfil}`,
    '--no-pdf-header-footer',
    // Margen para que carguen las fuentes antes de imprimir.
    '--virtual-time-budget=8000',
    '--run-all-compositor-stages-before-draw',
    `--print-to-pdf=${salida}`,
    url,
  ];
  return new Promise((resolver, rechazar) => {
    const proceso = spawn(navegador, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let registro = '';
    proceso.stdout.on('data', (d) => (registro += d));
    proceso.stderr.on('data', (d) => (registro += d));
    proceso.on('error', rechazar);
    proceso.on('close', (codigo) => {
      rmSync(perfil, { recursive: true, force: true });
      if (codigo === 0 && existsSync(salida)) resolver();
      else rechazar(new Error(`El navegador terminó con código ${codigo}.\n${registro}`));
    });
  });
}

function verificar(pdf) {
  const bytes = readFileSync(pdf);
  const texto = bytes.toString('latin1');
  // Cada página es un objeto /Type /Page (el árbol que las agrupa es /Pages).
  const paginas = (texto.match(/\/Type\s*\/Page(?![a-z])/g) ?? []).length;
  const fuentesIncrustadas = /\/FontFile[23]?\b/.test(texto);
  return { paginas, fuentesIncrustadas, kb: Math.round(bytes.length / 1024) };
}

if (!existsSync(join(RAIZ, 'dist', 'cv', 'index.html'))) {
  console.error('Falta dist/cv/. Corre primero `npm run build` (o usa `npm run cv`).');
  process.exit(1);
}

mkdirSync(dirname(SALIDA), { recursive: true });
const navegador = buscarNavegador();
const servidor = await preview({ root: RAIZ, server: { host: '127.0.0.1', port: PUERTO }, logLevel: 'warn' });

try {
  const url = `http://127.0.0.1:${PUERTO}/cv/`;
  console.log(`Imprimiendo ${url} con ${navegador}`);
  await imprimir(navegador, url, SALIDA);
} finally {
  await servidor.stop();
}

const { paginas, fuentesIncrustadas, kb } = verificar(SALIDA);
copyFileSync(SALIDA, join(RAIZ, 'dist', NOMBRE));
console.log(`PDF: public/${NOMBRE} · ${kb} KB · ${paginas} página(s) · fuentes incrustadas: ${fuentesIncrustadas ? 'sí' : 'no'}`);

if (paginas !== 1) {
  console.error('El CV debe ocupar una sola página. Recorta contenido en src/data/perfil.ts.');
  process.exit(1);
}
if (!fuentesIncrustadas) {
  console.error('El PDF no trae fuentes incrustadas: el texto podría no ser seleccionable.');
  process.exit(1);
}
