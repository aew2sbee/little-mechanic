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
    css: false,
    restoreMocks: true,
    // Only tests that render React need a DOM; building jsdom for pure logic is most of the run time.
    projects: [
      {
        extends: true,
        test: { name: 'logic', environment: 'node', include: ['src/**/*.test.ts', 'eslint.config.test.ts'] },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./src/testSetup.ts'],
        },
      },
    ],
  },
});
