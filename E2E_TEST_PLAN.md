# End-to-End Testing Plan

## Overview

This plan outlines the implementation of comprehensive E2E testing using Playwright, along with multi-project support to enable testing against a demo wiki while maintaining the production wiki.

## Goals

1. ✅ Enable users to switch between multiple wiki projects
2. ✅ Create a demo wiki for testing and demonstration
3. ✅ Implement Playwright-based E2E tests
4. ✅ Start with smoke tests, expand to feature tests
5. ✅ Capture screenshots at key points for visual validation
6. ✅ Test core user flows: viewing and navigating wikis

## Architecture Changes

### 1. Multi-Project Support

**Current State**: Wiki hardcoded to `./wiki` directory

**Target State**: Support multiple wiki projects in `./wikis/[project-name]/`

```
wikis/
  ├── codewiki-generator/    # Main project wiki
  │   ├── index.md
  │   ├── concepts/
  │   ├── components/
  │   └── guides/
  └── demo/                   # Demo wiki for testing
      ├── index.md
      ├── concepts/
      ├── components/
      └── guides/
```

**Backend Changes**:

1. **WikiManager** - Accept project path parameter
   ```javascript
   class WikiManager {
     constructor(projectPath = './wikis/default') {
       this.projectPath = projectPath;
       this.wikiDir = path.join(projectPath, 'wiki');
     }
   }
   ```

2. **New API Endpoints**:
   - `GET /api/projects` - List available wiki projects
   - `GET /api/projects/:project/status` - Get project metadata
   - `GET /wiki/:project/:page(*)` - View wiki page from specific project

3. **DashboardController** - Handle project context
   ```javascript
   async listProjects(req, res) {
     const projects = await this.getAvailableProjects();
     res.json({ projects });
   }

   async renderWikiPage(req, res) {
     const project = req.params.project || 'codewiki-generator';
     const pagePath = req.params[0];
     // Load from wikis/[project]/...
   }
   ```

**Frontend Changes**:

1. **Project Selector Component** (views/dashboard.ejs)
   ```html
   <div class="project-selector">
     <label for="project">Project:</label>
     <select id="project" onchange="switchProject(this.value)">
       <option value="codewiki-generator">CodeWiki Generator</option>
       <option value="demo">Demo Project</option>
     </select>
   </div>
   ```

2. **State Management** (public/app.js)
   ```javascript
   // Store selected project in localStorage
   const currentProject = localStorage.getItem('selectedProject') || 'codewiki-generator';

   function switchProject(project) {
     localStorage.setItem('selectedProject', project);
     window.location.reload();
   }
   ```

### 2. Demo Wiki Creation

**Purpose**: Provide a small, predictable wiki for testing

**Content Structure**:

```
wikis/demo/
  ├── index.md                      # Main index with links
  ├── concepts/
  │   ├── test-driven-development.md
  │   └── continuous-integration.md
  ├── components/
  │   ├── calculator.md
  │   └── validator.md
  └── guides/
      └── quick-start.md
```

**Characteristics**:
- ✅ Minimal but complete (5-7 pages)
- ✅ Predictable content for test assertions
- ✅ Cross-links between pages
- ✅ All page types represented (concept, component, guide)
- ✅ Test coverage metadata included
- ✅ Source file references
- ✅ No external dependencies

**Demo Content Examples**:

```markdown
# Calculator Component

## Purpose
A simple calculator component for demonstration purposes.

## Key Functionality
- Addition, subtraction, multiplication, division
- Input validation
- Error handling for division by zero

## Usage Example
```javascript
const Calculator = require('./calculator');
const calc = new Calculator();
const result = calc.add(2, 3); // 5
```

## Testing
**Test Coverage**: tests/unit/calculator.test.js
- 12 test cases
- 100% code coverage
- Edge cases: division by zero, invalid inputs

## Related
- [Validator](validator.md) - Input validation
- [Test-Driven Development](../concepts/test-driven-development.md)
```

## Playwright Setup

### Installation

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Configuration

**playwright.config.js**:
```javascript
module.exports = {
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm start',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
};
```

### Test Structure

```
tests/e2e/
  ├── fixtures/
  │   ├── demo-wiki.js          # Demo wiki content generator
  │   └── test-helpers.js       # Common test utilities
  ├── helpers/
  │   ├── navigation.js         # Navigation helpers
  │   └── screenshots.js        # Screenshot utilities
  ├── smoke.spec.js             # Smoke tests (basic functionality)
  ├── navigation.spec.js        # Wiki navigation tests
  ├── project-switching.spec.js # Project selector tests
  ├── content-rendering.spec.js # Content display tests
  └── visual-regression.spec.js # Visual comparison tests
```

## Test Implementation Plan

### Phase 1: Infrastructure (Priority: HIGH)

**Tasks**:
1. ✅ Update WikiManager to support project paths
2. ✅ Add project listing endpoint to DashboardController
3. ✅ Update wiki page routes to include project parameter
4. ✅ Create wikis/ directory structure
5. ✅ Update generate-self-wiki.js to output to wikis/codewiki-generator/
6. ✅ Add tests for multi-project support

**Acceptance Criteria**:
- WikiManager can load from different project directories
- API returns list of available projects
- Wiki pages load from correct project directory
- Existing functionality not broken

### Phase 2: Frontend Project Selector (Priority: HIGH)

**Tasks**:
1. ✅ Add project selector UI to dashboard
2. ✅ Implement project switching logic
3. ✅ Update wiki viewer to use selected project
4. ✅ Add project context to all wiki links
5. ✅ Persist selected project in localStorage

**Acceptance Criteria**:
- User can see list of available projects
- User can switch between projects
- Selected project persists across page reloads
- Wiki pages load from correct project

### Phase 3: Demo Wiki Creation (Priority: HIGH)

**Tasks**:
1. ✅ Create demo wiki content structure
2. ✅ Write demo pages (5-7 pages total)
3. ✅ Add cross-links between demo pages
4. ✅ Include metadata (test coverage, source files)
5. ✅ Add demo wiki generator script

**Acceptance Criteria**:
- Demo wiki has all page types (concept, component, guide)
- All pages have proper frontmatter
- Cross-links work correctly
- Content is appropriate for testing

### Phase 4: Playwright Setup (Priority: MEDIUM)

**Tasks**:
1. ✅ Install Playwright dependencies
2. ✅ Create playwright.config.js
3. ✅ Set up test directory structure
4. ✅ Create test helpers and fixtures
5. ✅ Configure CI/CD integration

**Acceptance Criteria**:
- Playwright installed and configured
- Test server starts automatically
- Tests can run on multiple browsers
- Screenshots saved to appropriate directory

### Phase 5: Smoke Tests (Priority: HIGH)

**tests/e2e/smoke.spec.js**:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Smoke Tests', () => {
  test('server responds to health check', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('dashboard loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CodeWiki Generator/);
    await page.screenshot({ path: 'test-results/screenshots/dashboard.png' });
  });

  test('can view demo wiki index', async ({ page }) => {
    await page.goto('/');

    // Select demo project
    await page.selectOption('#project', 'demo');

    // Navigate to wiki
    await page.click('text=View Wiki');

    // Verify index page loads
    await expect(page.locator('h1')).toContainText('Demo Project');
    await page.screenshot({ path: 'test-results/screenshots/demo-index.png' });
  });

  test('no console errors on page load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    expect(errors).toHaveLength(0);
  });
});
```

**Acceptance Criteria**:
- All smoke tests pass
- Screenshots captured
- Tests run in < 30 seconds
- No console errors

### Phase 6: Navigation Tests (Priority: MEDIUM)

**tests/e2e/navigation.spec.js**:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Wiki Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.selectOption('#project', 'demo');
    await page.click('text=View Wiki');
  });

  test('can navigate from index to concept page', async ({ page }) => {
    // Click on concept link
    await page.click('text=Test-Driven Development');

    // Verify navigation
    await expect(page.locator('h1')).toContainText('Test-Driven Development');
    await expect(page).toHaveURL(/concepts\/test-driven-development/);

    await page.screenshot({ path: 'test-results/screenshots/concept-page.png' });
  });

  test('can navigate from concept to component via cross-link', async ({ page }) => {
    await page.click('text=Test-Driven Development');

    // Click cross-link to component
    await page.click('text=Calculator');

    // Verify navigation
    await expect(page.locator('h1')).toContainText('Calculator');
    await expect(page).toHaveURL(/components\/calculator/);

    await page.screenshot({ path: 'test-results/screenshots/component-page.png' });
  });

  test('can use breadcrumb navigation', async ({ page }) => {
    await page.click('text=Calculator');

    // Click breadcrumb to go back
    await page.click('.breadcrumb >> text=Index');

    // Verify back at index
    await expect(page.locator('h1')).toContainText('Demo Project');
  });

  test('can navigate to guide and back', async ({ page }) => {
    await page.click('text=Quick Start');

    // Verify guide page
    await expect(page.locator('h1')).toContainText('Quick Start');

    // Navigate back
    await page.goBack();

    // Verify at index
    await expect(page.locator('h1')).toContainText('Demo Project');
  });

  test('all links on index page are clickable', async ({ page }) => {
    const links = await page.locator('a[href^="/wiki/"]').all();
    expect(links.length).toBeGreaterThan(0);

    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });
});
```

### Phase 7: Project Switching Tests (Priority: MEDIUM)

**tests/e2e/project-switching.spec.js**:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Project Switching', () => {
  test('can see both projects in selector', async ({ page }) => {
    await page.goto('/');

    const options = await page.locator('#project option').allTextContents();
    expect(options).toContain('CodeWiki Generator');
    expect(options).toContain('Demo Project');
  });

  test('switching projects loads different content', async ({ page }) => {
    await page.goto('/');

    // Start with demo
    await page.selectOption('#project', 'demo');
    await page.click('text=View Wiki');
    const demoTitle = await page.locator('h1').textContent();

    // Switch to main project
    await page.goto('/');
    await page.selectOption('#project', 'codewiki-generator');
    await page.click('text=View Wiki');
    const mainTitle = await page.locator('h1').textContent();

    // Verify different content
    expect(demoTitle).not.toBe(mainTitle);
  });

  test('selected project persists across page reloads', async ({ page }) => {
    await page.goto('/');

    // Select demo
    await page.selectOption('#project', 'demo');

    // Reload page
    await page.reload();

    // Verify demo still selected
    const selectedValue = await page.locator('#project').inputValue();
    expect(selectedValue).toBe('demo');
  });
});
```

### Phase 8: Content Rendering Tests (Priority: LOW)

**tests/e2e/content-rendering.spec.js**:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Content Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.selectOption('#project', 'demo');
    await page.click('text=View Wiki');
  });

  test('markdown headers render correctly', async ({ page }) => {
    await page.click('text=Calculator');

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(4); // Purpose, Functionality, Usage, Testing
  });

  test('code blocks have syntax highlighting', async ({ page }) => {
    await page.click('text=Calculator');

    const codeBlock = page.locator('pre code');
    await expect(codeBlock).toBeVisible();

    // Check for syntax highlighting classes
    const className = await codeBlock.getAttribute('class');
    expect(className).toContain('language-javascript');
  });

  test('test coverage information displays', async ({ page }) => {
    await page.click('text=Calculator');

    await expect(page.locator('text=Test Coverage')).toBeVisible();
    await expect(page.locator('text=12 test cases')).toBeVisible();
  });

  test('source file reference displays', async ({ page }) => {
    await page.click('text=Calculator');

    await expect(page.locator('text=Source File')).toBeVisible();
  });

  test('related pages section shows links', async ({ page }) => {
    await page.click('text=Calculator');

    const relatedSection = page.locator('text=Related');
    await expect(relatedSection).toBeVisible();

    const relatedLinks = page.locator('.related-pages a');
    await expect(relatedLinks).toHaveCount(2); // Validator, TDD
  });
});
```

### Phase 9: Visual Regression (Priority: LOW)

**tests/e2e/visual-regression.spec.js**:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Visual Regression', () => {
  test('dashboard matches baseline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('dashboard-baseline.png');
  });

  test('index page matches baseline', async ({ page }) => {
    await page.goto('/wiki/demo/index');
    await expect(page).toHaveScreenshot('index-baseline.png');
  });

  test('component page matches baseline', async ({ page }) => {
    await page.goto('/wiki/demo/components/calculator');
    await expect(page).toHaveScreenshot('component-baseline.png');
  });

  test('mobile view matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('dashboard-mobile-baseline.png');
  });
});
```

## Test Helpers

**tests/e2e/helpers/navigation.js**:

```javascript
async function navigateToWikiPage(page, project, pagePath) {
  await page.goto('/');
  await page.selectOption('#project', project);
  await page.click('text=View Wiki');
  if (pagePath) {
    await page.goto(`/wiki/${project}/${pagePath}`);
  }
}

async function captureScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true
  });
}

module.exports = { navigateToWikiPage, captureScreenshot };
```

## CI/CD Integration

**GitHub Actions** (.github/workflows/e2e-tests.yml):

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Create demo wiki
        run: node scripts/create-demo-wiki.js

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-results
          path: test-results/

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: test-results/screenshots/
```

## Success Criteria

### Functional Requirements
- ✅ Users can switch between multiple wiki projects
- ✅ Demo wiki loads and displays correctly
- ✅ All wiki navigation works (links, breadcrumbs, back button)
- ✅ Content renders properly (markdown, code blocks, metadata)
- ✅ Selected project persists across sessions

### Test Requirements
- ✅ All smoke tests pass (4 tests)
- ✅ All navigation tests pass (5 tests)
- ✅ All project switching tests pass (3 tests)
- ✅ All content rendering tests pass (5 tests)
- ✅ Tests run on Chromium, Firefox, and WebKit
- ✅ Screenshots captured at key points
- ✅ Total test execution time < 2 minutes
- ✅ No flaky tests (100% pass rate on 3 consecutive runs)

### Code Quality
- ✅ All existing tests still pass (275 tests)
- ✅ New code has unit test coverage
- ✅ E2E tests are maintainable and well-documented
- ✅ No degradation in performance

## Timeline Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| 1. Infrastructure | Backend multi-project support | 4-6 hours |
| 2. Frontend | Project selector UI | 2-3 hours |
| 3. Demo Wiki | Content creation | 2-3 hours |
| 4. Playwright Setup | Installation & config | 1-2 hours |
| 5. Smoke Tests | 4 basic tests | 2-3 hours |
| 6. Navigation Tests | 5 navigation tests | 3-4 hours |
| 7. Switching Tests | 3 project tests | 2-3 hours |
| 8. Content Tests | 5 rendering tests | 2-3 hours |
| 9. Visual Tests | 4 screenshot tests | 1-2 hours |
| **Total** | | **19-29 hours** |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing functionality | High | Comprehensive unit tests, gradual rollout |
| Flaky E2E tests | Medium | Use proper waits, retry logic, stable selectors |
| Demo wiki maintenance | Low | Automate creation, keep minimal |
| CI/CD slowdown | Medium | Parallel test execution, selective test runs |
| Screenshot differences across environments | Medium | Use consistent Docker images, ignore minor diffs |

## Next Steps

1. **Immediate**: Review and approve this plan
2. **Week 1**: Implement Phases 1-3 (multi-project support + demo wiki)
3. **Week 2**: Implement Phases 4-5 (Playwright setup + smoke tests)
4. **Week 3**: Implement Phases 6-8 (navigation, switching, content tests)
5. **Week 4**: Implement Phase 9 (visual tests) + CI/CD integration
6. **Ongoing**: Maintain and expand test coverage as features are added
