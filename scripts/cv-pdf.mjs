/**
 * Imprime /cv a PDF con Edge (o Chrome) en modo headless.
 *
 * Uso:
 * - `npm run cv`: construye el sitio, imprime /cv a `public/cv-bruno-saavedra.pdf`
 *   y lo copia a `dist/`, para que el build ya publicado lo incluya.
 * - `npm run cv:feria`: el CV impreso de la feria, con la UTM de la feria en el QR.
 *   Construye aparte en `dist-feria/` (con CV_CANAL=feria), imprime a
 *   `docs/cv-feria.pdf`, que no se publica, y borra `dist-feria/`.
 *
 * En los dos casos levanta `astro preview` en un puerto libre y verifica que el
 * CV no se pase de la hoja, que el PDF tenga **una sola página** y que traiga
 * fuentes incrustadas (texto real, seleccionable). Si no, termina con error.
 */
import { build, preview } from 'astro';
import { existsSync, mkdirSync, readFileSync, copyFileSync, rmSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buscarNavegador, headless, volcarDom } from './navegador.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NOMBRE = 'cv-bruno-saavedra.pdf';
const PUERTO = 4329;
const FERIA = process.argv.includes('--feria');

const DIST = join(RAIZ, FERIA ? 'dist-feria' : 'dist');
const SALIDA = FERIA ? join(RAIZ, 'docs', 'cv-feria.pdf') : join(RAIZ, 'public', NOMBRE);

function imprimir(navegador, url, salida) {
  return headless(
    navegador,
    [
      '--no-pdf-header-footer',
      // Margen para que carguen las fuentes antes de imprimir.
      '--virtual-time-budget=8000',
      '--run-all-compositor-stages-before-draw',
      `--print-to-pdf=${salida}`,
      url,
    ],
    salida,
  );
}

/**
 * La hoja tiene alto fijo y `overflow: hidden`: lo que no cabe se corta sin
 * crear una segunda página. El script de /cv marca la hoja con `desborda`; aquí
 * se lee esa marca en el DOM, a un ancho de escritorio (el de impresión).
 */
async function seDesborda(navegador, url) {
  const dom = await volcarDom(navegador, url, ['--window-size=1280,1000', '--virtual-time-budget=8000']);
  if (!/id="hoja"/.test(dom)) throw new Error(`No encontré la hoja del CV en ${url}.`);
  return /class="hoja[^"]*\bdesborda\b/.test(dom);
}

function verificar(pdf) {
  const bytes = readFileSync(pdf);
  const texto = bytes.toString('latin1');
  // Cada página es un objeto /Type /Page (el árbol que las agrupa es /Pages).
  const paginas = (texto.match(/\/Type\s*\/Page(?![a-z])/g) ?? []).length;
  const fuentesIncrustadas = /\/FontFile[23]?\b/.test(texto);
  return { paginas, fuentesIncrustadas, kb: Math.round(bytes.length / 1024) };
}

if (FERIA) {
  // El QR toma su UTM de CV_CANAL al construir (ver src/pages/cv.astro).
  process.env.CV_CANAL = 'feria';
  console.log('Construyendo el CV de la feria en dist-feria/');
  await build({ root: RAIZ, outDir: DIST, logLevel: 'warn' });
} else if (!existsSync(join(DIST, 'cv', 'index.html'))) {
  console.error('Falta dist/cv/. Corre primero `npm run build` (o usa `npm run cv`).');
  process.exit(1);
}

mkdirSync(dirname(SALIDA), { recursive: true });
const navegador = buscarNavegador();
const servidor = await preview({ root: RAIZ, outDir: DIST, server: { host: '127.0.0.1', port: PUERTO }, logLevel: 'warn' });

let desborda;
try {
  const url = `http://127.0.0.1:${PUERTO}/cv/`;
  console.log(`Imprimiendo ${url} con ${navegador}`);
  desborda = await seDesborda(navegador, url);
  await imprimir(navegador, url, SALIDA);
} finally {
  await servidor.stop();
  if (FERIA) rmSync(DIST, { recursive: true, force: true });
}

const { paginas, fuentesIncrustadas, kb } = verificar(SALIDA);
if (!FERIA) copyFileSync(SALIDA, join(DIST, NOMBRE));
const destino = relative(RAIZ, SALIDA).replaceAll('\\', '/');
console.log(`PDF: ${destino} · ${kb} KB · ${paginas} página(s) · fuentes incrustadas: ${fuentesIncrustadas ? 'sí' : 'no'}`);

if (desborda || paginas !== 1) {
  console.error('El CV debe caber en una sola página. Recorta contenido en src/data/perfil.ts.');
  process.exit(1);
}
if (!fuentesIncrustadas) {
  console.error('El PDF no trae fuentes incrustadas: el texto podría no ser seleccionable.');
  process.exit(1);
}
