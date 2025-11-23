import { test, expect } from '@playwright/test';

test.describe('Playwright Sandbox Diagnostics', () => {

  test('Basic navigation to localhost', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await expect(page.locator('h1')).toContainText('Test Dashboard');
    await page.screenshot({ path: 'screenshots/basic-navigation.png' });
  });

  test('User interaction test', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Click button
    await page.click('[data-testid="add-widget"]');

    // Verify widget appeared
    await expect(page.locator('.widget')).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'screenshots/with-widget.png' });
  });

  test('Multiple interactions', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Add 3 widgets
    for (let i = 0; i < 3; i++) {
      await page.click('[data-testid="add-widget"]');
    }

    // Verify count
    const widgets = await page.locator('.widget').count();
    expect(widgets).toBe(3);

    await page.screenshot({
      path: 'screenshots/multiple-widgets.png',
      fullPage: true
    });
  });
});
