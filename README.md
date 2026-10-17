# Portafolio de Bruno Saavedra Carbajal

Sitio personal (saavedracbr.com) con casos, demos interactivas y el CV en PDF.

## Stack

Astro 7 + Tailwind 4, sitio estático. Las fuentes (IBM Plex Sans y Mono) se autoalojan al construir.

## Estructura

```
src/
  data/perfil.ts     Fuente única: oferta, experiencia, proyectos, certificados, habilidades.
                     La web, el CV y los textos de LinkedIn salen de aquí.
  layouts/Base.astro Layout del sitio (cabecera, pie, metadatos, JSON-LD de Person).
  pages/index.astro  Portada.
  pages/cv.astro     CV de una página, pensado para imprimirse a PDF.
  styles/global.css  Tokens de diseño (claro y oscuro).
  utils/rutas.ts     Rutas independientes de dónde se publique.
scripts/cv-pdf.mjs   Imprime /cv a public/cv-bruno-saavedra.pdf con Edge headless.
```

La carpeta `docs/` (diagnóstico, ofertas analizadas y textos de LinkedIn) es solo local: está en `.gitignore` porque el repositorio es público.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en http://localhost:4321 |
| `npm run check` | Revisión de tipos |
| `npm run build` | Construye el sitio en `dist/` |
| `npm run cv` | Construye y exporta el CV a PDF. Falla si no cabe en una página o si no trae fuentes incrustadas. |

Para cambiar el CV: edita `src/data/perfil.ts` y corre `npm run cv`. En pantalla, `/cv` marca la hoja en rojo si el contenido se pasa de una página A4.

## Reglas de contenido

- Siempre "Estudiante de Ingeniería Industrial", nunca "Ingeniero".
- De BBA se nombra la empresa, pero las demos usan datos ficticios. Nada de capturas del Odoo real.
- Lo que no está verificado no se publica. La lista de pendientes vive en `docs/`, fuera del repo.

## Publicación

- Repositorio: `saavedracbr/saavedracbr.github.io`, servido por GitHub Pages en https://saavedracbr.github.io.
- Cada push a `main` construye y publica el sitio (`.github/workflows/deploy.yml`). El PDF del CV no se genera en el servidor: corre `npm run cv` en local y sube `public/cv-bruno-saavedra.pdf`.
- **No agregar `public/CNAME` hasta cambiar el DNS.** Hoy saavedracbr.com redirige a la landing POP. Con el CNAME puesto, saavedracbr.github.io redirigiría allí.
- **DNS en Hostinger (lo hace Bruno):**
  - La raíz va con registros A a GitHub Pages.
  - `www` va con un CNAME a `saavedracbr.github.io`.
  - `pop` y `arqdeco` no se tocan.
