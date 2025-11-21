// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import netlify from '@astrojs/netlify';
// import node from '@astrojs/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
  output: 'server',
  adapter: netlify(),
  // adapter: node({
  //   mode: 'standalone',
  // }),
});
