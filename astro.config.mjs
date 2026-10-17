// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Dónde se publica. Por defecto, el dominio definitivo en la raíz. Mientras el
// DNS de saavedracbr.com siga apuntando a la landing POP, el sitio se sirve en
// `saavedracbr.github.io`, también en la raíz: el repositorio es el sitio de
// usuario de GitHub Pages.
const SITE = process.env.PUBLIC_SITE ?? 'https://saavedracbr.com';
const BASE = process.env.PUBLIC_BASE ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  // Fuentes autoalojadas: el CV en PDF y la web usan las mismas, sin pedir nada
  // a Google en runtime.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-body',
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'Consolas', 'monospace'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
