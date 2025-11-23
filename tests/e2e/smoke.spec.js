const { test, expect } = require('@playwright/test');

/**
 * Smoke Tests - Basic E2E Tests for CodeWiki Generator
 *
 * These tests verify the core functionality works:
 * - Server is running and healthy
 * - Dashboard loads correctly
 * - Demo wiki is viewable
 * - No console errors occur
 */

test.describe('Smoke Tests', () => {
  test('should have healthy server responding to requests', async ({ page }) => {
    // Navigate to the dashboard
    const response = await page.goto('/');

    // Verify server responded with 200 OK
    expect(response.status()).toBe(200);

    // Verify we got HTML content
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/html');

    // Take screenshot for verification
    await page.screenshot({
      path: 'test-results/screenshots/01-server-healthy.png',
      fullPage: true
    });
  });

  test('should load dashboard successfully with all key elements', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Verify page title
    await expect(page).toHaveTitle(/CodeWiki Generator Dashboard/);

    // Verify header is present
    const header = page.locator('h1');
    await expect(header).toContainText('CodeWiki Generator Dashboard');

    // Verify key sections are present
    await expect(page.locator('text=Processing Status')).toBeVisible();
    await expect(page.locator('text=Controls')).toBeVisible();
    await expect(page.locator('text=Wiki Project')).toBeVisible();
    await expect(page.locator('text=Generated Wiki')).toBeVisible();

    // Verify project selector is present
    const projectSelector = page.locator('#project');
    await expect(projectSelector).toBeVisible();

    // Verify control buttons are present
    await expect(page.locator('button:has-text("Start Processing")')).toBeVisible();
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
    await expect(page.locator('button:has-text("Step")')).toBeVisible();

    // Take screenshot of dashboard
    await page.screenshot({
      path: 'test-results/screenshots/02-dashboard-loaded.png',
      fullPage: true
    });
  });

  test('should be able to view demo wiki index page', async ({ page }) => {
    // Navigate to dashboard first
    await page.goto('/');

    // Select demo project from dropdown
    const projectSelector = page.locator('#project');
    await projectSelector.selectOption('demo');

    // Take screenshot of project selection
    await page.screenshot({
      path: 'test-results/screenshots/03-demo-selected.png',
      fullPage: true
    });

    // Navigate to demo wiki index
    await page.goto('/wiki/demo/index');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify page title
    await expect(page).toHaveTitle(/Demo Wiki/);

    // Verify header content
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('Demo Wiki');

    // Verify welcome message
    await expect(page.locator('text=Welcome to the Demo Wiki')).toBeVisible();

    // Verify navigation sections are present
    await expect(page.locator('text=Components')).toBeVisible();
    await expect(page.locator('text=Concepts')).toBeVisible();
    await expect(page.locator('text=Guides')).toBeVisible();

    // Verify links to demo pages work
    await expect(page.locator('a[href*="/wiki/demo/components/calculator"]')).toBeVisible();
    await expect(page.locator('a[href*="/wiki/demo/concepts/test-driven-development"]')).toBeVisible();

    // Verify breadcrumb navigation
    await expect(page.locator('nav.breadcrumb')).toBeVisible();
    await expect(page.locator('a[href="/"]')).toContainText('Dashboard');

    // Take screenshot of demo wiki index
    await page.screenshot({
      path: 'test-results/screenshots/04-demo-wiki-index.png',
      fullPage: true
    });
  });

  test('should load pages without console errors', async ({ page }) => {
    const consoleErrors = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      consoleErrors.push(`Page error: ${error.message}`);
    });

    // Test 1: Load dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test 2: Load demo wiki index
    await page.goto('/wiki/demo/index');
    await page.waitForLoadState('networkidle');

    // Test 3: Navigate to a component page
    await page.goto('/wiki/demo/components/calculator');
    await page.waitForLoadState('networkidle');

    // Test 4: Navigate to a concept page
    await page.goto('/wiki/demo/concepts/test-driven-development');
    await page.waitForLoadState('networkidle');

    // Take final screenshot
    await page.screenshot({
      path: 'test-results/screenshots/05-no-console-errors.png',
      fullPage: true
    });

    // Verify no console errors occurred
    expect(consoleErrors).toHaveLength(0);

    if (consoleErrors.length > 0) {
      console.log('Console errors detected:');
      consoleErrors.forEach(error => console.log('  -', error));
    }
  });
});

test.describe('Demo Wiki Navigation', () => {
  test('should navigate between related pages using links', async ({ page }) => {
    // Start at demo wiki index
    await page.goto('/wiki/demo/index');

    // Click on Calculator component link
    await page.click('a[href*="/wiki/demo/components/calculator"]');
    await page.waitForLoadState('networkidle');

    // Verify we're on the calculator page
    await expect(page.locator('h1')).toContainText('Calculator Component');

    // Take screenshot
    await page.screenshot({
      path: 'test-results/screenshots/06-calculator-page.png',
      fullPage: true
    });

    // Verify related pages section exists
    const relatedPages = page.locator('.related-pages');
    if (await relatedPages.isVisible()) {
      // If related pages exist, verify they're clickable
      await expect(relatedPages.locator('a').first()).toBeVisible();
    }

    // Navigate back to index using breadcrumb
    await page.click('nav.breadcrumb a[href*="/wiki/demo/index"]');
    await page.waitForLoadState('networkidle');

    // Verify we're back at index
    await expect(page.locator('h1')).toContainText('Demo Wiki');

    // Take screenshot
    await page.screenshot({
      path: 'test-results/screenshots/07-navigation-complete.png',
      fullPage: true
    });
  });
});
