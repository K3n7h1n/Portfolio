// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://enzolocatelli.fr',
  integrations: [tailwind(), sitemap()],
  adapter: node({
    mode: 'standalone',
  }),
});