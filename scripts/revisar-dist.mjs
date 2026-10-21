/**
 * Candado antes de cada push: busca en `dist/` lo que nunca debe publicarse.
 *
 * Uso: `npm run build && npm run revisar`.
 *
 * Falla si encuentra:
 * - un término de `docs/terminos-prohibidos.txt` (el nombre del partner, el DNI…),
 *   uno por línea, sin distinguir mayúsculas ni tildes. Las líneas con # se ignoran;
 * - una dirección IPv4;
 * - 8 dígitos seguidos en el texto visible, que podrían ser un DNI;
 * - "Ingeniero" o "Ingeniera" usados como título.
 *
 * `docs/` está en .gitignore: los términos nunca llegan al repo. Por eso este
 * script no corre en CI, y por eso falla si el archivo falta o está vacío: sin él
 * no revisa lo más importante. Al informar, tapa el término: el DNI no se copia
 * ni a la consola.
 *
 * El PDF del CV no se lee (su texto va comprimido), pero sale de /cv/index.html,
 * que sí se revisa.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RAIZ, 'dist');
const TERMINOS = join(RAIZ, 'docs', 'terminos-prohibidos.txt');
const EXTENSIONES = new Set(['.html', '.xml', '.txt', '.json', '.js', '.mjs', '.css', '.svg', '.webmanifest']);

const IPV4 = /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g;
const OCHO_DIGITOS = /(?<![\d.,])\d{8}(?![\d.,])/g;
const INGENIERO = /\bingenier[oa]s?\b/gi;

/** Minúsculas y sin tildes, para que "Ingeniería" y "ingenieria" cuenten igual. */
const normalizar = (texto) => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/** Solo el texto que ve la persona: sin scripts, estilos ni etiquetas. */
const textoVisible = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');

function leerTerminos() {
  if (!existsSync(TERMINOS)) {
    console.error('Falta docs/terminos-prohibidos.txt: escribe ahí el nombre del partner y el DNI, uno por línea.');
    process.exit(1);
  }
  const terminos = readFileSync(TERMINOS, 'utf8')
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter((linea) => linea && !linea.startsWith('#'))
    .map(normalizar);
  if (terminos.length === 0) {
    console.error('docs/terminos-prohibidos.txt está vacío: el candado no revisaría lo más importante.');
    process.exit(1);
  }
  return terminos;
}

function* archivos(carpeta) {
  for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
    const ruta = join(carpeta, entrada.name);
    if (entrada.isDirectory()) yield* archivos(ruta);
    else if (EXTENSIONES.has(extname(entrada.name).toLowerCase())) yield ruta;
  }
}

/**
 * Unos caracteres alrededor del hallazgo, con el hallazgo tapado. También se tapan
 * los términos y los números de 8 dígitos que caigan cerca, para no imprimirlos.
 */
function contexto(texto, inicio, largo) {
  const tapar = (trozo) =>
    terminos.reduce((t, termino) => t.replaceAll(termino, '████'), normalizar(trozo)).replace(OCHO_DIGITOS, '########');
  // Se descarta la palabra que el corte deja a medias: podría ser parte de un término.
  const antes = tapar(texto.slice(Math.max(0, inicio - 40), inicio).replace(/^\S*\s/, ''));
  const despues = tapar(texto.slice(inicio + largo, inicio + largo + 40).replace(/\s\S*$/, ''));
  return `…${antes}████${despues}…`.replace(/\s+/g, ' ');
}

if (!existsSync(DIST)) {
  console.error('Falta dist/. Corre primero `npm run build`.');
  process.exit(1);
}

const terminos = leerTerminos();
const hallazgos = [];
let revisados = 0;

for (const ruta of archivos(DIST)) {
  revisados++;
  const archivo = relative(RAIZ, ruta).replaceAll('\\', '/');
  const crudo = readFileSync(ruta, 'utf8');
  const plano = normalizar(crudo);
  const anotar = (motivo, texto, inicio, largo) =>
    hallazgos.push({ archivo, motivo, contexto: contexto(texto, inicio, largo) });

  terminos.forEach((termino, i) => {
    let desde = plano.indexOf(termino);
    while (desde !== -1) {
      anotar(`término n.º ${i + 1} de la lista`, plano, desde, termino.length);
      desde = plano.indexOf(termino, desde + termino.length);
    }
  });

  for (const m of crudo.matchAll(IPV4)) anotar('dirección IPv4', crudo, m.index, m[0].length);
  for (const m of crudo.matchAll(INGENIERO)) anotar(`"${m[0]}" como título`, crudo, m.index, m[0].length);

  if (extname(ruta) === '.html') {
    const visible = textoVisible(crudo);
    for (const m of visible.matchAll(OCHO_DIGITOS)) anotar('8 dígitos seguidos (¿DNI?)', visible, m.index, m[0].length);
  }
}

if (hallazgos.length > 0) {
  console.error(`El candado encontró ${hallazgos.length} problema(s) en ${revisados} archivos de dist/:`);
  for (const h of hallazgos) console.error(`- ${h.archivo}: ${h.motivo}\n  ${h.contexto}`);
  console.error('No hagas push hasta corregirlo.');
  process.exit(1);
}

console.log(`Candado: ${revisados} archivos de dist/ revisados, sin hallazgos (${terminos.length} términos de la lista).`);
