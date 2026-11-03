import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// BASE_PATH is set by the PR preview workflow (e.g. /little-mechanic/pr-preview/pr-1/).
const base = process.env.BASE_PATH ?? '/little-mechanic/';
const isPreview = process.env.VITE_DEPLOY_ENV === 'preview';

export default defineConfig({
  base,
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [
    react(),
    {
      // Keep PR previews out of search engines.
      name: 'preview-noindex',
      transformIndexHtml: () =>
        isPreview
          ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' }]
          : [],
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/testSetup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'eslint.config.test.ts'],
    css: false,
    restoreMocks: true,
  },
});
