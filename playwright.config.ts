import { defineConfig } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}/little-mechanic/`,
    browserName: 'chromium',
    // A landscape tablet, the app's main target.
    viewport: { width: 1180, height: 820 },
    hasTouch: true,
    deviceScaleFactor: 2,
    screenshot: 'only-on-failure',
  },
  webServer: {
    // `npm run build` also type-checks; lint and the build already do that, so only bundle here.
    command: `npx vite build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/little-mechanic/`,
    reuseExistingServer: !process.env.CI,
  },
});
