import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://ai-parent-coaching.pages.dev',
  build: {
    format: 'directory',
  },
});
