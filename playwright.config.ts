import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'chrome-extension://',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chrome extension context
        contextOptions: {
          permissions: ['tabs', 'storage'],
        },
      },
    },
  ],

  webServer: process.env.CI ? undefined : {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
})