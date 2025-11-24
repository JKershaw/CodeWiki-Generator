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

/**
 * Helper function to get screenshot path organized by device type
 * @param {Object} testInfo - Playwright test info object
 * @param {string} filename - Screenshot filename
 * @returns {string} Full path for screenshot
 */
function getScreenshotPath(testInfo, filename) {
  const deviceDir = path.join(screenshotsDir, testInfo.project.name);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return path.join(deviceDir, filename);
}

test.describe('Comprehensive UI Screenshots', () => {

  test('01 - Dashboard Overview', async ({ page }, testInfo) => {
    console.log(`Capturing Dashboard overview [${testInfo.project.name}]...`);

    // Use domcontentloaded instead of networkidle because SSE keeps connection open
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for key elements to ensure page is ready
    await page.waitForSelector('header', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000); // Brief wait for dynamic content

    // Full page screenshot
    await page.screenshot({
      path: getScreenshotPath(testInfo, '01-dashboard-full.png'),
      fullPage: true
    });

    // Screenshot of header
    const header = page.locator('header, .header, h1').first();
    if (await header.isVisible()) {
      await header.screenshot({
        path: getScreenshotPath(testInfo, '01-dashboard-header.png')
      });
    }

    // Screenshot of status section
    const statusSection = page.locator('text=Processing Status').locator('..').first();
    if (await statusSection.isVisible()) {
      await statusSection.screenshot({
        path: getScreenshotPath(testInfo, '01-dashboard-status.png')
      });
    }

    // Screenshot of controls
    const controls = page.locator('text=Controls').locator('..').first();
    if (await controls.isVisible()) {
      await controls.screenshot({
        path: getScreenshotPath(testInfo, '01-dashboard-controls.png')
      });
    }
  });

  test('02 - Wiki Index Page (codewiki-generator)', async ({ page }, testInfo) => {
    console.log(`Capturing main wiki index page [${testInfo.project.name}]...`);

    await page.goto('/wiki/codewiki-generator/index');
    await page.waitForLoadState('networkidle');

    // Full page screenshot
    await page.screenshot({
      path: getScreenshotPath(testInfo, '02-wiki-index-full.png'),
      fullPage: true
    });

    // Screenshot navigation/breadcrumb
    const breadcrumb = page.locator('nav.breadcrumb, .breadcrumb');
    if (await breadcrumb.isVisible()) {
      await breadcrumb.screenshot({
        path: getScreenshotPath(testInfo, '02-wiki-breadcrumb.png')
      });
    }

    // Screenshot table of contents
    try {
      const toc = await page.locator('.toc, #toc').first().or(page.getByText('Table of Contents').locator('..')).first();
      if (await toc.isVisible()) {
        await toc.screenshot({
          path: getScreenshotPath(testInfo, '02-wiki-toc.png')
        });
      }
    } catch (e) {
      console.log('TOC not found, skipping screenshot');
    }
  });

  test('03 - Wiki Concept Pages', async ({ page }, testInfo) => {
    console.log(`Capturing concept pages [${testInfo.project.name}]...`);

    // Try to navigate to architecture concept page
    await page.goto('/wiki/codewiki-generator/concepts/architecture');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: getScreenshotPath(testInfo, '03-wiki-concept-architecture.png'),
      fullPage: true
    });

    // Try another concept page if it exists
    try {
      await page.goto('/wiki/codewiki-generator/concepts/agent-collaboration');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: getScreenshotPath(testInfo, '03-wiki-concept-agents.png'),
        fullPage: true
      });
    } catch (e) {
      console.log('Agent collaboration page not found, skipping...');
    }
  });

  test('04 - Wiki Component Pages', async ({ page }, testInfo) => {
    console.log(`Capturing component pages [${testInfo.project.name}]...`);

    try {
      await page.goto('/wiki/codewiki-generator/components/processor');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: getScreenshotPath(testInfo, '04-wiki-component-processor.png'),
        fullPage: true
      });

      // Capture code blocks if present
      const codeBlocks = page.locator('pre, code');
      const count = await codeBlocks.count();
      if (count > 0) {
        await codeBlocks.first().screenshot({
          path: getScreenshotPath(testInfo, '04-wiki-code-block.png')
        });
      }
    } catch (e) {
      console.log('Processor component page not found, skipping...');
    }
  });

  test('05 - Wiki Guide Pages', async ({ page }, testInfo) => {
    console.log(`Capturing guide pages [${testInfo.project.name}]...`);

    try {
      await page.goto('/wiki/codewiki-generator/guides/getting-started');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: getScreenshotPath(testInfo, '05-wiki-guide-getting-started.png'),
        fullPage: true
      });
    } catch (e) {
      console.log('Getting started guide not found, skipping...');
    }

    try {
      await page.goto('/wiki/codewiki-generator/guides/development-workflow');
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: getScreenshotPath(testInfo, '05-wiki-guide-development.png'),
        fullPage: true
      });
    } catch (e) {
      console.log('Development workflow guide not found, skipping...');
    }
  });

  test('06 - Planning View', async ({ page }, testInfo) => {
    console.log(`Capturing planning view [${testInfo.project.name}]...`);

    await page.goto('/planning', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Full page screenshot
    await page.screenshot({
      path: getScreenshotPath(testInfo, '06-planning-full.png'),
      fullPage: true
    });

    // Screenshot of project selector
    const projectSelector = page.locator('#project, select');
    if (await projectSelector.first().isVisible()) {
      await projectSelector.first().screenshot({
        path: getScreenshotPath(testInfo, '06-planning-selector.png')
      });
    }

    // Screenshot of tasks if visible
    try {
      const tasksSection = await page.locator('.tasks, #tasks').first().or(page.getByText('Tasks').locator('..')).first();
      if (await tasksSection.isVisible()) {
        await tasksSection.screenshot({
          path: getScreenshotPath(testInfo, '06-planning-tasks.png')
        });
      }
    } catch (e) {
      console.log('Tasks section not found, skipping screenshot');
    }
  });

  test('07 - Analytics View', async ({ page }, testInfo) => {
    console.log(`Capturing analytics view [${testInfo.project.name}]...`);

    await page.goto('/analytics', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for analytics to load

    // Full page screenshot
    await page.screenshot({
      path: getScreenshotPath(testInfo, '07-analytics-full.png'),
      fullPage: true
    });

    // Wait a bit for any charts to render (if Chart.js loads successfully)
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: getScreenshotPath(testInfo, '07-analytics-loaded.png'),
      fullPage: true
    });

    // Screenshot individual charts/sections if present (Chart.js may not load in test environment)
    try {
      const charts = page.locator('canvas, .chart, svg');
      const chartCount = await charts.count();
      if (chartCount > 0) {
        await charts.first().screenshot({
          path: getScreenshotPath(testInfo, '07-analytics-chart.png')
        });
      }
    } catch (e) {
      console.log('Charts not rendered (expected in network-restricted environments)');
    }
  });

  test('08 - Projects View', async ({ page }, testInfo) => {
    console.log(`Capturing projects view [${testInfo.project.name}]...`);

    await page.goto('/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Full page screenshot
    await page.screenshot({
      path: getScreenshotPath(testInfo, '08-projects-full.png'),
      fullPage: true
    });

    // Screenshot of project cards if present
    const projectCards = page.locator('.project-card, .project, .card');
    const cardCount = await projectCards.count();
    if (cardCount > 0) {
      await projectCards.first().screenshot({
        path: getScreenshotPath(testInfo, '08-projects-card.png')
      });
    }
  });

  test('09 - Wiki Page Links and Navigation', async ({ page }, testInfo) => {
    console.log(`Testing wiki navigation and links [${testInfo.project.name}]...`);

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
          path: getScreenshotPath(testInfo, `09-wiki-section-${i}-${filename}.png`)
        });
      }
    }

    // Screenshot related pages section if present
    try {
      const relatedPages = await page.locator('.related-pages').first().or(page.getByText('Related Pages').locator('..')).first();
      if (await relatedPages.isVisible()) {
        await relatedPages.screenshot({
          path: getScreenshotPath(testInfo, '09-wiki-related-pages.png')
        });
      }
    } catch (e) {
      console.log('Related pages section not found, skipping screenshot');
    }
  });

  test('11 - UI Element States', async ({ page }, testInfo) => {
    // Hover states don't work on touch devices - skip for mobile and tablet
    test.skip(testInfo.project.name !== 'desktop', 'Hover states not applicable on touch devices');

    console.log(`Capturing UI element states [${testInfo.project.name}]...`);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Hover states on buttons
    const startButton = page.locator('button:has-text("Start Processing")');
    if (await startButton.isVisible()) {
      await startButton.hover();
      await page.screenshot({
        path: getScreenshotPath(testInfo, '11-button-hover-state.png')
      });
    }

    // Focus states
    const projectSelect = page.locator('#project');
    if (await projectSelect.isVisible()) {
      await projectSelect.focus();
      await page.screenshot({
        path: getScreenshotPath(testInfo, '11-select-focus-state.png')
      });
    }

    // Dropdown open
    if (await projectSelect.isVisible()) {
      await projectSelect.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: getScreenshotPath(testInfo, '11-select-open-state.png')
      });
    }
  });

  test('12 - Error and Edge Cases', async ({ page }, testInfo) => {
    console.log(`Capturing error states [${testInfo.project.name}]...`);

    // Try to access non-existent wiki page
    const response = await page.goto('/wiki/codewiki-generator/nonexistent-page');

    if (response.status() === 404) {
      await page.screenshot({
        path: getScreenshotPath(testInfo, '12-error-404-page.png'),
        fullPage: true
      });
    }

    // Try invalid API endpoint
    await page.goto('/api/invalid-endpoint');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: getScreenshotPath(testInfo, '12-error-api-404.png'),
      fullPage: true
    });
  });

  test('13 - Console Errors Check', async ({ page }, testInfo) => {
    console.log(`Checking for console errors across pages [${testInfo.project.name}]...`);

    const errors = [];
    const warnings = [];

    // Patterns for known/expected errors to ignore
    const ignoredPatterns = [
      /Failed to load resource.*favicon/i,
      /CORS policy/i,
      /Chart is not defined/i, // Expected in network-restricted environments
      /net::ERR_/i, // Network errors for CDN resources in restricted environments
      /Failed to fetch/i // Network fetch failures for external resources
    ];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Check if this error should be ignored
        const shouldIgnore = ignoredPatterns.some(pattern => pattern.test(text));
        if (!shouldIgnore) {
          errors.push({
            text,
            location: msg.location()
          });
        }
      } else if (msg.type() === 'warning') {
        warnings.push({
          text: msg.text(),
          location: msg.location()
        });
      }
    });

    page.on('pageerror', error => {
      const text = `Page error: ${error.message}`;
      const shouldIgnore = ignoredPatterns.some(pattern => pattern.test(text));
      if (!shouldIgnore) {
        errors.push({
          text,
          stack: error.stack
        });
      }
    });

    // Test all major pages with appropriate wait strategies
    const pagesToTest = [
      { url: '/', waitUntil: 'domcontentloaded', description: 'Dashboard (SSE)' },
      { url: '/wiki/codewiki-generator/index', waitUntil: 'networkidle', description: 'Wiki Index' },
      { url: '/planning', waitUntil: 'domcontentloaded', description: 'Planning' },
      { url: '/analytics', waitUntil: 'domcontentloaded', description: 'Analytics' },
      { url: '/projects', waitUntil: 'domcontentloaded', description: 'Projects' }
    ];

    for (const pageConfig of pagesToTest) {
      console.log(`  Testing ${pageConfig.description}...`);
      try {
        await page.goto(pageConfig.url, {
          waitUntil: pageConfig.waitUntil,
          timeout: 10000
        });
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log(`    Timeout on ${pageConfig.url}, continuing...`);
      }
    }

    // Write errors to file
    const errorReport = {
      timestamp: new Date().toISOString(),
      errors,
      warnings,
      errorCount: errors.length,
      warningCount: warnings.length,
      note: 'Chart.js errors are ignored as they are expected in network-restricted test environments'
    };

    fs.writeFileSync(
      getScreenshotPath(testInfo, '13-console-errors.json'),
      JSON.stringify(errorReport, null, 2)
    );

    console.log(`Found ${errors.length} errors and ${warnings.length} warnings (after filtering)`);

    if (errors.length > 0) {
      console.log('\nConsole Errors:');
      errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.text}`);
      });
    }

    if (warnings.length > 0 && warnings.length <= 10) {
      console.log('\nConsole Warnings (first 10):');
      warnings.slice(0, 10).forEach((warn, i) => {
        console.log(`  ${i + 1}. ${warn.text}`);
      });
    }

    // Only fail on critical errors (not the expected Chart.js issue)
    const criticalErrors = errors.filter(e =>
      !e.text.includes('Chart') &&
      !e.text.includes('network') &&
      !e.text.includes('CDN')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Accessibility and Layout Issues', () => {

  test('14 - Check for Layout Issues', async ({ page }, testInfo) => {
    console.log(`Checking for layout issues [${testInfo.project.name}]...`);

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
      getScreenshotPath(testInfo, '14-layout-issues.json'),
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

  test('15 - Screenshot Summary', async ({ page }, testInfo) => {
    console.log('\n========================================');
    console.log(`Screenshot Test Suite Complete: ${testInfo.project.name.toUpperCase()}`);
    console.log('========================================');

    const projectDir = path.join(screenshotsDir, testInfo.project.name);

    if (fs.existsSync(projectDir)) {
      const files = fs.readdirSync(projectDir).filter(f => f.endsWith('.png') || f.endsWith('.json'));
      files.sort().forEach((file, i) => {
        console.log(`  ${i + 1}. ${file}`);
      });
      console.log(`\nTotal: ${files.length} files for ${testInfo.project.name}`);
    } else {
      console.log(`No screenshots found for ${testInfo.project.name}`);
    }

    // Cross-project summary (only run once for desktop to avoid duplication)
    if (testInfo.project.name === 'desktop') {
      console.log('\n========================================');
      console.log('CROSS-PROJECT SUMMARY');
      console.log('========================================');

      const allProjects = ['desktop', 'mobile', 'tablet'];
      let grandTotal = 0;

      allProjects.forEach(proj => {
        const dir = path.join(screenshotsDir, proj);
        if (fs.existsSync(dir)) {
          const count = fs.readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.json')).length;
          console.log(`${proj.padEnd(10)}: ${count} files`);
          grandTotal += count;
        } else {
          console.log(`${proj.padEnd(10)}: 0 files (not yet run)`);
        }
      });

      console.log(`\n🎉 Grand Total: ${grandTotal} files across all devices`);
      console.log(`📁 Location: ${screenshotsDir}`);
    }

    console.log('========================================\n');
  });
});
