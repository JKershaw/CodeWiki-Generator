const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright E2E Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/e2e',

  // Maximum time one test can run for
  timeout: 30 * 1000,

  // Test execution settings
  fullyParallel: false,  // Run serially to avoid resource issues in sandbox
  forbidOnly: !!process.env.CI,
  retries: 1,  // Handle occasional flakiness in sandboxed environment
  workers: 1,  // Run tests serially to avoid resource contention

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-results/e2e-report' }],
    ['list']
  ],

  // Shared settings for all projects
  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:3000',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Browser launch options - CRITICAL for sandbox environment
    launchOptions: {
      args: [
        '--no-sandbox',                 // CRITICAL: Bypass sandbox restrictions
        '--disable-setuid-sandbox',     // CRITICAL: Disable setuid sandbox
        '--disable-dev-shm-usage',      // Use /tmp instead of /dev/shm
        '--disable-gpu',                // Disable GPU acceleration
        '--no-first-run',               // Skip first run tasks
        '--no-zygote',                  // Disable zygote process
        '--single-process',             // Run in single process mode
        '--disable-extensions'          // Disable extensions
      ]
    }
  },

  // Test projects for different devices
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true
      },
    },
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
        isMobile: true,
        hasTouch: true
      },
    }
  ],

  // Web server configuration
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // Output directory for test artifacts
  outputDir: 'test-results/e2e-artifacts',
});
