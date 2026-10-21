/**
 * Captura las piezas de marca (`src/pages/marca/*`) a PNG con Edge headless.
 *
 * Uso: `npm run imagenes` (construye el sitio y luego corre este script).
 *
 * Cada pieza es una página de /marca dibujada a su tamaño exacto: la IA hace solo
 * el fondo, y el texto y el QR los pone la página con la fuente del sitio.
 * - Las tarjetas al compartir (`/marca/og/<slug>/`) van a `public/og/`, que se
 *   publica, y se copian a `dist/og/` para que el build ya hecho las incluya. Van
 *   en JPG: en PNG pesan unos 440 KB, y WhatsApp no muestra la vista previa de
 *   una imagen de más de 300 KB.
 * - Las piezas que no se publican (el fondo de Zoom y el banner de LinkedIn) van a
 *   `docs/marca/`, que git ignora.
 * Verifica que cada imagen tenga el tamaño pedido.
 */
import { preview } from 'astro';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// sharp viene con Astro, que lo usa para optimizar imágenes.
import sharp from 'sharp';
import { buscarNavegador, headless } from './navegador.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUERTO = 4330;

const DIST = join(RAIZ, 'dist');

// Una tarjeta por carpeta de dist/marca/og/: la lista sale de src/data/og.ts.
const tarjetas = existsSync(join(DIST, 'marca', 'og'))
  ? readdirSync(join(DIST, 'marca', 'og'), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  : [];

const PIEZAS = [
  ...tarjetas.map((slug) => ({ ruta: `/marca/og/${slug}/`, salida: `public/og/${slug}.jpg`, ancho: 1200, alto: 630 })),
  { ruta: '/marca/banner/', salida: 'docs/marca/banner-linkedin.png', ancho: 1584, alto: 396 },
  { ruta: '/marca/zoom/', salida: 'docs/marca/fondo-zoom.png', ancho: 1920, alto: 1080 },
];

function capturar(navegador, url, salida, ancho, alto) {
  return headless(
    navegador,
    [
      `--window-size=${ancho},${alto}`,
      '--force-device-scale-factor=1',
      '--hide-scrollbars',
      // Margen para que carguen las fuentes y el fondo antes de capturar.
      '--virtual-time-budget=8000',
      `--screenshot=${salida}`,
      url,
    ],
    salida,
  );
}

async function medidas(imagen) {
  const { width, height } = await sharp(imagen).metadata();
  return { ancho: width, alto: height, kb: Math.round(statSync(imagen).size / 1024) };
}

if (!existsSync(join(DIST, 'marca'))) {
  console.error('Falta dist/marca/. Corre primero `npm run build` (o usa `npm run imagenes`).');
  process.exit(1);
}

const navegador = buscarNavegador();
const servidor = await preview({ root: RAIZ, server: { host: '127.0.0.1', port: PUERTO }, logLevel: 'warn' });
let errores = 0;

try {
  for (const pieza of PIEZAS) {
    const salida = join(RAIZ, pieza.salida);
    mkdirSync(dirname(salida), { recursive: true });
    // Edge solo captura en PNG: el JPG sale de esa captura.
    const enJpg = salida.endsWith('.jpg');
    const captura = enJpg ? salida.replace(/\.jpg$/, '.captura.png') : salida;
    await capturar(navegador, `http://127.0.0.1:${PUERTO}${pieza.ruta}`, captura, pieza.ancho, pieza.alto);
    if (enJpg) {
      await sharp(captura).jpeg({ quality: 88, mozjpeg: true }).toFile(salida);
      rmSync(captura);
    }
    const { ancho, alto, kb } = await medidas(salida);
    const bien = ancho === pieza.ancho && alto === pieza.alto;
    if (!bien) errores++;
    console.log(`${bien ? 'OK ' : 'MAL'} ${pieza.salida} · ${ancho}×${alto} (pedido ${pieza.ancho}×${pieza.alto}) · ${kb} KB`);
    if (pieza.salida.startsWith('public/')) {
      const copia = join(DIST, pieza.salida.slice('public/'.length));
      mkdirSync(dirname(copia), { recursive: true });
      copyFileSync(salida, copia);
    }
  }
} finally {
  await servidor.stop();
}

if (errores > 0) {
  console.error('Alguna pieza no salió del tamaño pedido.');
  process.exit(1);
}
