const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive UI Screenshot Tests for CodeWiki Generator
 *
 * This test suite navigates through all major UI sections and takes
 * detailed screenshots for visual review and bug detection.
 */

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, '../../test-results/ui-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

test.describe('Comprehensive UI Screenshots', () => {

  test('01 - Dashboard Overview', async ({ page }) => {
    console.log('Capturing Dashboard overview...');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Full page screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, '01-dashboard-full.png'),
      fullPage: true
    });

    // Screenshot of header
    const header = page.locator('header, .header, h1').first();
    if (await header.isVisible()) {
      await header.screenshot({
        path: path.join(screenshotsDir, '01-dashboard-header.png')
      });
    }

    // Screenshot of status section
    const statusSection = page.locator('text=Processing Status').locator('..').first();
    if (await statusSection.isVisible()) {
      await statusSection.screenshot({
        path: path.join(screenshotsDir, '01-dashboard-status.png')
      });
    }

    // Screenshot of controls
    const controls = page.locator('text=Controls').locator('..').first();
    if (await controls.isVisible()) {
      await controls.screenshot({
        path: path.join(screenshotsDir, '01-dashboard-controls.png')
      });
    }
  });

  test('02 - Wiki Index Page (codewiki-generator)', async ({ page }) => {
    console.log('Capturing main wiki index page...');

    await page.goto('/wiki/codewiki-generator/index');
    await page.waitForLoadState('networkidle');

    // Full page screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, '02-wiki-index-full.png'),
      fullPage: true
    });

    // Screenshot navigation/breadcrumb
    const breadcrumb = page.locator('nav.breadcrumb, .breadcrumb');
    if (await breadcrumb.isVisible()) {
      await breadcrumb.screenshot({
        path: path.join(screenshotsDir, '02-wiki-breadcrumb.png')
      });
    }

    // Screenshot table of contents
    const toc = page.locator('.toc, #toc, text=Table of Contents').locator('..').first();
    if (await toc.isVisible()) {
      await toc.screenshot({
        path: path.join(screenshotsDir, '02-wiki-toc.png')
      });
    }
  });

  test('03 - Wiki Concept Pages', async ({ page }) => {
    console.log('Capturing concept pages...');

    // Try to navigate to architecture concept page
    await page.goto('/wiki/codewiki-generator/concepts/architecture');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(screenshotsDir, '03-wiki-concept-architecture.png'),
      fullPage: true
    });

    // Try another concept page if it exists
    try {
      await page.goto('/wiki/codewiki-generator/concepts/agent-collaboration');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: path.join(screenshotsDir, '03-wiki-concept-agents.png'),
        fullPage: true
      });
    } catch (e) {
      console.log('Agent collaboration page not found, skipping...');
    }
  });

  test('04 - Wiki Component Pages', async ({ page }) => {
    console.log('Capturing component pages...');

    try {
      await page.goto('/wiki/codewiki-generator/components/processor');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: path.join(screenshotsDir, '04-wiki-component-processor.png'),
        fullPage: true
      });

      // Capture code blocks if present
      const codeBlocks = page.locator('pre, code');
      const count = await codeBlocks.count();
      if (count > 0) {
        await codeBlocks.first().screenshot({
          path: path.join(screenshotsDir, '04-wiki-code-block.png')
        });
      }
    } catch (e) {
      console.log('Processor component page not found, skipping...');
    }
  });

  test('05 - Wiki Guide Pages', async ({ page }) => {
    console.log('Capturing guide pages...');

    try {
      await page.goto('/wiki/codewiki-generator/guides/getting-started');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: path.join(screenshotsDir, '05-wiki-guide-getting-started.png'),
        fullPage: true
      });
    } catch (e) {
      console.log('Getting started guide not found, skipping...');
    }

    try {
      await page.goto('/wiki/codewiki-generator/guides/development-workflow');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: path.join(screenshotsDir, '05-wiki-guide-development.png'),
        fullPage: true
      });
    } catch (e) {
      console.log('Development workflow guide not found, skipping...');
    }
  });

  test('06 - Planning View', async ({ page }) => {
    console.log('Capturing planning view...');

    await page.goto('/planning');
    await page.waitForLoadState('networkidle');

    // Full page screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, '06-planning-full.png'),
      fullPage: true
    });

    // Screenshot of project selector
    const projectSelector = page.locator('#project, select');
    if (await projectSelector.first().isVisible()) {
      await projectSelector.first().screenshot({
        path: path.join(screenshotsDir, '06-planning-selector.png')
      });
    }

    // Screenshot of tasks if visible
    const tasksSection = page.locator('.tasks, #tasks, text=Tasks').locator('..').first();
    if (await tasksSection.isVisible()) {
      await tasksSection.screenshot({
        path: path.join(screenshotsDir, '06-planning-tasks.png')
      });
    }
  });

  test('07 - Analytics View', async ({ page }) => {
    console.log('Capturing analytics view...');

    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');

    // Full page screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, '07-analytics-full.png'),
      fullPage: true
    });

    // Wait a bit for any charts to render
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(screenshotsDir, '07-analytics-loaded.png'),
      fullPage: true
    });

    // Screenshot individual charts/sections if present
    const charts = page.locator('canvas, .chart, svg');
    const chartCount = await charts.count();
    if (chartCount > 0) {
      await charts.first().screenshot({
        path: path.join(screenshotsDir, '07-analytics-chart.png')
      });
    }
  });

  test('08 - Projects View', async ({ page }) => {
    console.log('Capturing projects view...');

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Full page screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, '08-projects-full.png'),
      fullPage: true
    });

    // Screenshot of project cards if present
    const projectCards = page.locator('.project-card, .project, .card');
    const cardCount = await projectCards.count();
    if (cardCount > 0) {
      await projectCards.first().screenshot({
        path: path.join(screenshotsDir, '08-projects-card.png')
      });
    }
  });

  test('09 - Wiki Page Links and Navigation', async ({ page }) => {
    console.log('Testing wiki navigation and links...');

    await page.goto('/wiki/codewiki-generator/index');
    await page.waitForLoadState('networkidle');

    // Find and screenshot all link sections
    const linkSections = page.locator('h2, h3');
    const sectionCount = await linkSections.count();

    console.log(`Found ${sectionCount} sections on index page`);

    if (sectionCount > 0) {
      // Screenshot first few sections
      for (let i = 0; i < Math.min(3, sectionCount); i++) {
        const section = linkSections.nth(i);
        const text = await section.textContent();
        const filename = text.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);

        await section.screenshot({
          path: path.join(screenshotsDir, `09-wiki-section-${i}-${filename}.png`)
        });
      }
    }

    // Screenshot related pages section if present
    const relatedPages = page.locator('.related-pages, text=Related Pages').locator('..').first();
    if (await relatedPages.isVisible()) {
      await relatedPages.screenshot({
        path: path.join(screenshotsDir, '09-wiki-related-pages.png')
      });
    }
  });

  test('10 - Mobile Responsive Views', async ({ page }) => {
    console.log('Capturing mobile responsive views...');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

    // Dashboard mobile
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(screenshotsDir, '10-mobile-dashboard.png'),
      fullPage: true
    });

    // Wiki index mobile
    await page.goto('/wiki/codewiki-generator/index');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(screenshotsDir, '10-mobile-wiki-index.png'),
      fullPage: true
    });

    // Planning mobile
    await page.goto('/planning');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(screenshotsDir, '10-mobile-planning.png'),
      fullPage: true
    });

    // Tablet size
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(screenshotsDir, '10-tablet-dashboard.png'),
      fullPage: true
    });
  });

  test('11 - UI Element States', async ({ page }) => {
    console.log('Capturing UI element states...');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hover states on buttons
    const startButton = page.locator('button:has-text("Start Processing")');
    if (await startButton.isVisible()) {
      await startButton.hover();
      await page.screenshot({
        path: path.join(screenshotsDir, '11-button-hover-state.png')
      });
    }

    // Focus states
    const projectSelect = page.locator('#project');
    if (await projectSelect.isVisible()) {
      await projectSelect.focus();
      await page.screenshot({
        path: path.join(screenshotsDir, '11-select-focus-state.png')
      });
    }

    // Dropdown open
    if (await projectSelect.isVisible()) {
      await projectSelect.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(screenshotsDir, '11-select-open-state.png')
      });
    }
  });

  test('12 - Error and Edge Cases', async ({ page }) => {
    console.log('Capturing error states...');

    // Try to access non-existent wiki page
    const response = await page.goto('/wiki/codewiki-generator/nonexistent-page');

    if (response.status() === 404) {
      await page.screenshot({
        path: path.join(screenshotsDir, '12-error-404-page.png'),
        fullPage: true
      });
    }

    // Try invalid API endpoint
    await page.goto('/api/invalid-endpoint');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(screenshotsDir, '12-error-api-404.png'),
      fullPage: true
    });
  });

  test('13 - Console Errors Check', async ({ page }) => {
    console.log('Checking for console errors across pages...');

    const errors = [];
    const warnings = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push({
          text: msg.text(),
          location: msg.location()
        });
      } else if (msg.type() === 'warning') {
        warnings.push({
          text: msg.text(),
          location: msg.location()
        });
      }
    });

    page.on('pageerror', error => {
      errors.push({
        text: `Page error: ${error.message}`,
        stack: error.stack
      });
    });

    // Test all major pages
    const pagesToTest = [
      '/',
      '/wiki/codewiki-generator/index',
      '/planning',
      '/analytics',
      '/projects'
    ];

    for (const url of pagesToTest) {
      console.log(`  Testing ${url}...`);
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
    }

    // Write errors to file
    const errorReport = {
      timestamp: new Date().toISOString(),
      errors,
      warnings,
      errorCount: errors.length,
      warningCount: warnings.length
    };

    fs.writeFileSync(
      path.join(screenshotsDir, '13-console-errors.json'),
      JSON.stringify(errorReport, null, 2)
    );

    console.log(`Found ${errors.length} errors and ${warnings.length} warnings`);

    if (errors.length > 0) {
      console.log('\nConsole Errors:');
      errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.text}`);
      });
    }

    if (warnings.length > 0) {
      console.log('\nConsole Warnings:');
      warnings.forEach((warn, i) => {
        console.log(`  ${i + 1}. ${warn.text}`);
      });
    }
  });
});

test.describe('Accessibility and Layout Issues', () => {

  test('14 - Check for Layout Issues', async ({ page }) => {
    console.log('Checking for layout issues...');

    await page.goto('/wiki/codewiki-generator/index');
    await page.waitForLoadState('networkidle');

    // Check for overlapping elements
    const issues = await page.evaluate(() => {
      const problems = [];

      // Check for elements with negative margins that might overlap
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el, index) => {
        const style = window.getComputedStyle(el);

        // Check for visibility issues
        if (style.visibility === 'hidden' && el.textContent.trim().length > 0) {
          problems.push({
            type: 'hidden-content',
            element: el.tagName,
            text: el.textContent.substring(0, 50)
          });
        }

        // Check for overflow issues
        if (style.overflow === 'visible' && el.scrollWidth > el.clientWidth) {
          problems.push({
            type: 'horizontal-overflow',
            element: el.tagName,
            class: el.className
          });
        }
      });

      return problems;
    });

    fs.writeFileSync(
      path.join(screenshotsDir, '14-layout-issues.json'),
      JSON.stringify({ timestamp: new Date().toISOString(), issues }, null, 2)
    );

    console.log(`Found ${issues.length} potential layout issues`);

    if (issues.length > 0) {
      console.log('Layout Issues:');
      issues.slice(0, 10).forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue.type} - ${issue.element}`);
      });
    }
  });

  test('15 - Screenshot Summary', async ({ page }) => {
    console.log('\n========================================');
    console.log('Screenshot Test Suite Complete!');
    console.log('========================================');
    console.log(`Screenshots saved to: ${screenshotsDir}`);
    console.log('\nGenerated screenshots:');

    const files = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
    files.sort().forEach((file, i) => {
      console.log(`  ${i + 1}. ${file}`);
    });

    console.log(`\nTotal: ${files.length} screenshots`);
    console.log('========================================\n');
  });
});
