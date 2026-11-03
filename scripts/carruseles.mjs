/**
 * Imprime los carruseles de LinkedIn (`src/pages/marca/carrusel/*`) a PDF con
 * Edge headless.
 *
 * Uso: `npm run carruseles` (construye el sitio y luego corre este script).
 *
 * Cada carrusel va a `docs/marca/carrusel-<slug>.pdf`, que git ignora: el PDF lo
 * subes tú al post como documento. Verifica que el PDF tenga una página por
 * lámina, de 1080×1350, y que traiga las fuentes incrustadas.
 *
 * Si tiene una sola lámina, sale además en PNG (`docs/marca/lamina-<slug>.png`):
 * esa va al post como imagen, porque un documento de una página no se desliza.
 */
import { preview } from 'astro';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
// sharp viene con Astro, que lo usa para optimizar imágenes.
import sharp from 'sharp';
import { buscarNavegador, headless } from './navegador.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUERTO = 4331;
const DIST = join(RAIZ, 'dist');
const CARPETA = join(DIST, 'marca', 'carrusel');
// 1080×1350 px a 96 ppp, en puntos de PDF (72 por pulgada).
const LAMINA_PX = [1080, 1350];
const PAGINA_PT = [810, 1012.5];

if (!existsSync(CARPETA)) {
  console.error('Falta dist/marca/carrusel/. Corre primero `npm run build` (o usa `npm run carruseles`).');
  process.exit(1);
}

const slugs = readdirSync(CARPETA, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

function imprimir(navegador, url, salida) {
  return headless(
    navegador,
    [
      '--no-pdf-header-footer',
      // Margen para que carguen las fuentes y las ilustraciones antes de imprimir.
      '--virtual-time-budget=8000',
      '--run-all-compositor-stages-before-draw',
      `--print-to-pdf=${salida}`,
      url,
    ],
    salida,
  );
}

function capturar(navegador, url, salida) {
  return headless(
    navegador,
    [
      `--window-size=${LAMINA_PX.join(',')}`,
      '--force-device-scale-factor=1',
      '--hide-scrollbars',
      '--virtual-time-budget=8000',
      `--screenshot=${salida}`,
      url,
    ],
    salida,
  );
}

function verificar(pdf) {
  const texto = readFileSync(pdf).toString('latin1');
  const paginas = (texto.match(/\/Type\s*\/Page(?![a-z])/g) ?? []).length;
  const caja = texto.match(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/);
  const medida = caja ? [Number(caja[1]), Number(caja[2])] : null;
  const fuentesIncrustadas = /\/FontFile[23]?\b/.test(texto);
  return { paginas, medida, fuentesIncrustadas };
}

const navegador = buscarNavegador();
const servidor = await preview({ root: RAIZ, server: { host: '127.0.0.1', port: PUERTO }, logLevel: 'warn' });
let errores = 0;

try {
  for (const slug of slugs) {
    const html = readFileSync(join(CARPETA, slug, 'index.html'), 'utf8');
    const laminas = (html.match(/class="lamina\b/g) ?? []).length;
    const salida = join(RAIZ, 'docs', 'marca', `carrusel-${slug}.pdf`);
    mkdirSync(dirname(salida), { recursive: true });
    const url = `http://127.0.0.1:${PUERTO}/marca/carrusel/${slug}/`;
    await imprimir(navegador, url, salida);

    const { paginas, medida, fuentesIncrustadas } = verificar(salida);
    const tamanoBien = medida && Math.abs(medida[0] - PAGINA_PT[0]) < 1 && Math.abs(medida[1] - PAGINA_PT[1]) < 1;
    const bien = paginas === laminas && tamanoBien && fuentesIncrustadas;
    if (!bien) errores++;
    console.log(
      `${bien ? 'OK ' : 'MAL'} ${relative(RAIZ, salida).replaceAll('\\', '/')} · ${paginas} página(s) de ${laminas} lámina(s) · ` +
        `${medida ? medida.join('×') : '?'} pt (pedido ${PAGINA_PT.join('×')}) · fuentes incrustadas: ${fuentesIncrustadas ? 'sí' : 'no'}`,
    );

    if (laminas === 1) {
      const png = join(RAIZ, 'docs', 'marca', `lamina-${slug}.png`);
      await capturar(navegador, url, png);
      const { width, height } = await sharp(png).metadata();
      const pngBien = width === LAMINA_PX[0] && height === LAMINA_PX[1];
      if (!pngBien) errores++;
      console.log(`${pngBien ? 'OK ' : 'MAL'} ${relative(RAIZ, png).replaceAll('\\', '/')} · ${width}×${height} (pedido ${LAMINA_PX.join('×')})`);
    }
  }
} finally {
  await servidor.stop();
}

if (errores > 0) {
  console.error('Algún carrusel no salió con una página por lámina, de 1080×1350 y con fuentes incrustadas (o su PNG, de 1080×1350).');
  process.exit(1);
}
