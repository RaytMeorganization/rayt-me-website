import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Bundled Chromium is unavailable on this macOS version; system Chrome is.
        ...(process.platform === 'darwin' ? { channel: 'chrome' } : {}),
      },
    },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7'],
        ...(process.platform === 'darwin' ? { channel: 'chrome' } : {}),
      },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      cwd: '../rayt-me-backend',
      url: 'http://127.0.0.1:4000/ready',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { API_PROXY_TARGET: 'http://127.0.0.1:4000' },
    },
  ],
})
