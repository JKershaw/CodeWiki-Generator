# UI Bug Fix Implementation Plan

**Created:** November 23, 2025
**Based on:** UI-BUG-REPORT.md
**Sprint Goal:** Fix all P0 and P1 bugs, improve test reliability

---

## Overview

This plan addresses the bugs identified in the UI screenshot testing. We'll tackle issues in priority order, starting with critical bugs that break functionality, then addressing layout and test infrastructure issues.

**Total Issues:** 6 bugs + 3 test improvements
**Estimated Effort:** 2-3 days
**Success Criteria:** All P0/P1 bugs fixed, tests passing, analytics working

---

## Phase 1: Critical Bugs (P0) - IMMEDIATE

### Task 1.1: Fix Analytics Chart Loading Failure ⚠️ HIGHEST PRIORITY

**Bug:** Analytics dashboard shows "Chart is not defined" error
**Priority:** P0 - Critical
**Estimated Time:** 1-2 hours
**Complexity:** Low

#### Investigation Steps:
1. Review `views/analytics.ejs` for chart library imports
2. Check if Chart.js or similar library is included
3. Verify public assets and CDN availability
4. Test chart rendering in browser console

#### Implementation Plan:
```
Step 1: Examine analytics.ejs template
  - Check <script> tags for chart library
  - Verify library version and CDN URLs
  - Look for initialization code

Step 2: Add/Fix Chart.js import
  - Add Chart.js CDN or npm package
  - Preferred: Use CDN for quick fix
  - Example: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

Step 3: Review chart initialization code
  - Check public/analytics.js or inline scripts
  - Ensure Chart is properly referenced
  - Add error handling for missing library

Step 4: Add fallback error handling
  - Check if Chart is defined before using
  - Display user-friendly error if library fails to load
  - Add retry button
```

#### Files to Modify:
- `views/analytics.ejs` - Add Chart.js import
- `public/analytics.js` (if exists) - Add Chart availability check
- `lib/dashboard-controller.js` - Add graceful degradation

#### Testing:
```bash
# Manual test
1. Start server: npm start
2. Navigate to http://localhost:3000/analytics
3. Verify charts render without errors
4. Check browser console for errors

# Automated test
npx playwright test tests/e2e/ui-screenshots.spec.js -g "Analytics"
```

#### Success Criteria:
- [ ] Analytics page loads without errors
- [ ] Charts render with actual or demo data
- [ ] No "Chart is not defined" errors
- [ ] Screenshot test passes

---

### Task 1.2: Optimize Dashboard Loading & SSE Handling

**Bug:** Dashboard takes 30+ seconds, never reaches "networkidle"
**Priority:** P0 - Critical (for testing), P1 (for users)
**Estimated Time:** 2-3 hours
**Complexity:** Medium

**Note:** SSE keeps connections open by design. This is NOT a bug, but impacts testing.

#### Investigation Steps:
1. Confirm SSE is the root cause of timeout
2. Check if SSE starts immediately on page load
3. Review if any synchronous blocking occurs during load
4. Measure actual user-perceived page load time

#### Two-Part Solution:

**Part A: Optimize SSE Connection Timing**
```
Current: SSE connects immediately when dashboard loads
Proposed: Defer SSE connection until after page is fully loaded

Step 1: Modify dashboard.ejs
  - Move EventSource initialization to DOMContentLoaded
  - Add small delay (100-200ms) after page load

Step 2: Add loading indicator
  - Show "Loading activity feed..." during SSE connect
  - Display connection status to user

Step 3: Add reconnection logic
  - Handle SSE disconnects gracefully
  - Auto-reconnect with exponential backoff
```

**Part B: Improve Test Strategy**
```
Step 1: Update Playwright tests for SSE-enabled pages
  - Use 'domcontentloaded' instead of 'networkidle'
  - Add explicit waits for specific elements

Step 2: Create test helper for SSE pages
  - Helper function: waitForDashboardReady()
  - Waits for key elements, not network idle

Step 3: Consider mock SSE endpoint for tests
  - Create test-mode that disables SSE
  - Or mock SSE with static data
```

#### Files to Modify:
- `views/dashboard.ejs` - Defer SSE connection
- `public/dashboard.js` (if exists) - SSE initialization
- `tests/e2e/ui-screenshots.spec.js` - Update wait strategy
- `lib/dashboard-controller.js` - Optional: test mode flag

#### Implementation:
```javascript
// Example: Defer SSE in dashboard.ejs
window.addEventListener('DOMContentLoaded', () => {
  // Wait for page to fully render
  setTimeout(() => {
    const eventSource = new EventSource('/api/activity/feed');
    eventSource.onmessage = (event) => {
      // Handle activity updates
    };
  }, 200);
});
```

#### Testing:
```bash
# Test dashboard load time
1. Open browser DevTools Network tab
2. Navigate to http://localhost:3000/
3. Measure DOMContentLoaded time (should be < 2s)
4. Verify SSE connection establishes after

# Automated test
npx playwright test tests/e2e/ui-screenshots.spec.js -g "Dashboard"
```

#### Success Criteria:
- [ ] Dashboard loads visual content in < 3 seconds
- [ ] SSE connects after initial render
- [ ] Playwright tests pass with updated strategy
- [ ] User experience not degraded

---

## Phase 2: High Priority Bugs (P1) - THIS SPRINT

### Task 2.1: Fix Horizontal Overflow on Wiki Pages

**Bug:** H1 and P elements overflow container width
**Priority:** P1 - High
**Estimated Time:** 1 hour
**Complexity:** Low

#### Investigation Steps:
1. Identify which CSS file controls wiki page styling
2. Test on different screen sizes to see overflow
3. Check if specific content triggers it (long URLs, code, etc.)

#### Implementation Plan:
```
Step 1: Locate wiki page CSS
  - Check public/*.css files
  - Look for wiki-specific stylesheets
  - Check views/wiki-page.ejs for inline styles

Step 2: Add overflow prevention CSS
  - Add to wiki content container
  - Apply to h1, h2, h3, p elements
  - Ensure responsive

Step 3: Test across breakpoints
  - Desktop (1920px, 1440px, 1024px)
  - Tablet (768px)
  - Mobile (375px, 414px)
```

#### CSS Fix:
```css
/* Add to wiki page stylesheet */
.wiki-content,
.wiki-content h1,
.wiki-content h2,
.wiki-content h3,
.wiki-content p {
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

/* For code blocks and pre tags */
.wiki-content pre,
.wiki-content code {
  max-width: 100%;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Ensure container limits */
.wiki-content {
  max-width: 100%;
  overflow-x: hidden;
}
```

#### Files to Modify:
- `public/wiki-styles.css` (or equivalent)
- `views/wiki-page.ejs` - Add/update stylesheet link

#### Testing:
```bash
# Manual testing
1. Navigate to wiki pages with long content
2. Resize browser window to narrow widths
3. Check for horizontal scrollbars
4. Test long URLs, long code blocks

# Automated test
npx playwright test tests/e2e/ui-screenshots.spec.js -g "Layout"
```

#### Success Criteria:
- [ ] No horizontal scrollbars on wiki pages
- [ ] Content remains readable on mobile
- [ ] Layout issues test reports 0 issues
- [ ] All text wraps appropriately

---

### Task 2.2: Mobile/Tablet Responsive Testing

**Bug:** Cannot test mobile views due to SSE timeout
**Priority:** P1 - High
**Estimated Time:** 1 hour (after Task 1.2)
**Complexity:** Low (depends on Task 1.2)

**Dependency:** Must complete Task 1.2 first

#### Implementation Plan:
```
Step 1: Update test strategy (after SSE fix)
  - Apply same 'domcontentloaded' strategy
  - Add viewport-specific waits

Step 2: Re-run mobile tests
  - Test iPhone SE (375x667)
  - Test iPad (768x1024)
  - Test larger tablets (1024x768)

Step 3: Capture missing screenshots
  - Mobile dashboard
  - Mobile wiki pages
  - Mobile planning/projects views

Step 4: Review screenshots for issues
  - Check text readability
  - Verify tap targets (min 44px)
  - Check navigation usability
  - Ensure no overflow
```

#### Files to Modify:
- `tests/e2e/ui-screenshots.spec.js` - Update mobile test waits

#### Testing:
```bash
# Run mobile-specific tests
npx playwright test tests/e2e/ui-screenshots.spec.js -g "Mobile"

# Manual mobile testing
1. Use browser DevTools device emulation
2. Test on actual devices if available
3. Check touch interactions
```

#### Success Criteria:
- [ ] All 4 mobile screenshots captured
- [ ] No UI breakage on small screens
- [ ] Touch targets appropriately sized
- [ ] Navigation works on mobile

---

## Phase 3: Test Infrastructure Improvements - THIS SPRINT

### Task 3.1: Fix Playwright Selector Syntax Errors

**Issue:** Tests fail due to incorrect selector syntax
**Priority:** P1 - High
**Estimated Time:** 30 minutes
**Complexity:** Very Low

#### Affected Tests:
1. Test #2: Wiki Index Page (TOC selector)
2. Test #6: Planning View (tasks selector)
3. Test #9: Wiki Navigation (related pages selector)

#### Implementation:
```javascript
// BEFORE (incorrect):
const toc = page.locator('.toc, #toc, text=Table of Contents').locator('..').first();

// AFTER (correct):
const toc = page.locator('.toc, #toc').or(page.getByText('Table of Contents')).locator('..').first();

// OR use separate locators:
let tocElement;
try {
  tocElement = page.locator('.toc, #toc').first();
  if (!(await tocElement.isVisible())) {
    tocElement = page.getByText('Table of Contents').locator('..').first();
  }
} catch (e) {
  tocElement = page.getByText('Table of Contents').locator('..').first();
}
```

#### Files to Modify:
- `tests/e2e/ui-screenshots.spec.js`
  - Line ~78: TOC selector
  - Line ~186: Tasks selector
  - Line ~272: Related pages selector

#### Testing:
```bash
# Run affected tests
npx playwright test tests/e2e/ui-screenshots.spec.js -g "Wiki Index"
npx playwright test tests/e2e/ui-screenshots.spec.js -g "Planning View"
npx playwright test tests/e2e/ui-screenshots.spec.js -g "Navigation"
```

#### Success Criteria:
- [ ] All 3 tests pass without selector errors
- [ ] Screenshots captured successfully
- [ ] No regression in other tests

---

### Task 3.2: Improve Console Error Detection

**Issue:** Console error test timed out
**Priority:** P2 - Medium
**Estimated Time:** 30 minutes
**Complexity:** Low

**Dependency:** Complete after Task 1.2 (SSE fix)

#### Implementation Plan:
```
Step 1: Update console error test to use new wait strategy
  - Use 'domcontentloaded' for all pages
  - Don't wait for 'networkidle' on dashboard

Step 2: Add timeout handling
  - Set reasonable timeout per page (10s)
  - Continue testing other pages if one times out

Step 3: Improve error categorization
  - Separate critical errors from warnings
  - Ignore known harmless errors (CORS on localhost, etc.)
  - Flag Chart-related errors as critical
```

#### Files to Modify:
- `tests/e2e/ui-screenshots.spec.js` - Console error test

#### Implementation:
```javascript
// Example improved console error test
test('Console Errors Check', async ({ page }) => {
  const errors = [];
  const warnings = [];
  const ignoredPatterns = [
    /Failed to load resource.*favicon/,
    /CORS policy/
  ];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore known harmless errors
      if (!ignoredPatterns.some(pattern => pattern.test(text))) {
        errors.push({ text, location: msg.location() });
      }
    }
  });

  const pagesToTest = [
    { url: '/', waitUntil: 'domcontentloaded' },
    { url: '/wiki/codewiki-generator/index', waitUntil: 'networkidle' },
    { url: '/planning', waitUntil: 'domcontentloaded' },
    { url: '/analytics', waitUntil: 'domcontentloaded' },
    { url: '/projects', waitUntil: 'domcontentloaded' }
  ];

  for (const pageConfig of pagesToTest) {
    try {
      await page.goto(pageConfig.url, {
        waitUntil: pageConfig.waitUntil,
        timeout: 10000
      });
      await page.waitForTimeout(1000);
    } catch (e) {
      console.log(`Timeout testing ${pageConfig.url}, continuing...`);
    }
  }

  // Write report
  fs.writeFileSync(
    path.join(screenshotsDir, '13-console-errors.json'),
    JSON.stringify({ errors, warnings, errorCount: errors.length }, null, 2)
  );

  // Flag critical errors (e.g., Chart is not defined)
  const criticalErrors = errors.filter(e =>
    e.text.includes('Chart') ||
    e.text.includes('is not defined')
  );

  expect(criticalErrors).toHaveLength(0);
});
```

#### Success Criteria:
- [ ] Console error test completes successfully
- [ ] Report generated with all pages tested
- [ ] Critical errors caught and reported
- [ ] Known harmless errors ignored

---

## Phase 4: Medium Priority Enhancements (P2) - NEXT SPRINT

### Task 4.1: Enhance Error Page UX

**Priority:** P2 - Medium
**Estimated Time:** 1-2 hours
**Complexity:** Low

#### Improvements:
1. Better center error message layout
2. Add helpful suggestions (search, similar pages)
3. Add breadcrumb navigation
4. More user-friendly error text

#### Implementation Ideas:
```html
<!-- Improved 404 page -->
<div class="error-page">
  <nav class="breadcrumb">
    <a href="/">Dashboard</a> /
    <a href="/wiki/<%= project %>"><%= project %></a> /
    <span>Page Not Found</span>
  </nav>

  <div class="error-content">
    <h1>Page Not Found</h1>
    <p class="error-message">
      We couldn't find the page "<%= page %>" in the <%= project %> wiki.
    </p>

    <div class="suggestions">
      <h3>Suggestions:</h3>
      <ul>
        <li><a href="/wiki/<%= project %>/index">Browse the wiki index</a></li>
        <li><a href="/api/wiki/<%= project %>/search?q=<%= page %>">Search for similar pages</a></li>
        <li><a href="/">Return to dashboard</a></li>
      </ul>
    </div>
  </div>
</div>
```

#### Files to Modify:
- `views/error.ejs` - Enhance layout
- `public/error-styles.css` (create) - Add styling

---

### Task 4.2: Add Loading States & Progress Indicators

**Priority:** P2 - Medium
**Estimated Time:** 2 hours
**Complexity:** Medium

#### Features to Add:
1. Dashboard loading skeleton/spinner
2. Analytics chart loading state
3. Progress indicator for SSE connection
4. Page transition loading

#### Implementation:
```html
<!-- Loading skeleton for dashboard -->
<div class="loading-skeleton" id="dashboard-skeleton">
  <div class="skeleton-header"></div>
  <div class="skeleton-stats"></div>
  <div class="skeleton-content"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dashboard-skeleton').style.display = 'none';
});
</script>
```

---

## Implementation Schedule

### Day 1: Critical Bugs
- **Morning:** Task 1.1 - Fix Analytics chart (2h)
- **Afternoon:** Task 1.2 - Dashboard SSE optimization (3h)
- **End of Day:** Test fixes, verify both work

### Day 2: High Priority & Test Improvements
- **Morning:** Task 2.1 - Fix overflow CSS (1h)
- **Morning:** Task 3.1 - Fix test selectors (0.5h)
- **Afternoon:** Task 2.2 - Mobile testing (1h)
- **Afternoon:** Task 3.2 - Console error test (0.5h)
- **End of Day:** Full test suite run

### Day 3: Validation & Documentation
- **Morning:** Re-run all screenshot tests
- **Morning:** Manual testing across browsers
- **Afternoon:** Update documentation
- **Afternoon:** Code review and commit

---

## Testing Strategy

### After Each Fix:
1. Run specific test for that feature
2. Check browser console for errors
3. Manual verification in browser
4. Take before/after screenshots

### Before Final Commit:
```bash
# Full test suite
npm test  # Unit tests
npx playwright test tests/e2e/  # All E2E tests

# Specific validation
npx playwright test tests/e2e/ui-screenshots.spec.js
npx playwright test tests/e2e/smoke.spec.js

# Generate report
npx playwright show-report test-results/e2e-report
```

### Manual Testing Checklist:
- [ ] Analytics charts render correctly
- [ ] Dashboard loads within 3 seconds (visual content)
- [ ] No horizontal scrollbars on wiki pages
- [ ] Mobile views render correctly
- [ ] No console errors on any page
- [ ] SSE activity feed updates work
- [ ] Error pages display properly

---

## Success Metrics

### Test Results Target:
- All 15 UI screenshot tests pass
- 0 critical console errors
- 0 layout overflow issues
- All screenshots captured successfully

### Performance Targets:
- Dashboard DOMContentLoaded < 2s
- Analytics page load < 3s
- No test timeouts
- SSE connection time < 500ms after page load

### Code Quality:
- All fixes include comments
- CSS follows existing patterns
- Tests are maintainable
- No regression in existing features

---

## Risk Assessment

### Low Risk:
- CSS overflow fixes (Task 2.1)
- Test selector fixes (Task 3.1)
- Error page UX (Task 4.1)

### Medium Risk:
- Analytics chart fix (Task 1.1) - External dependency
- Console error detection (Task 3.2) - May catch new issues

### Higher Risk:
- SSE timing changes (Task 1.2) - Could affect real-time updates
  - **Mitigation:** Thorough testing of activity feed
  - **Rollback plan:** Keep old implementation in git history

---

## Dependencies & Blockers

### External Dependencies:
- Chart.js CDN availability (Task 1.1)
- No npm package additions required

### Task Dependencies:
- Task 2.2 depends on Task 1.2 completion
- Task 3.2 depends on Task 1.2 completion

### Potential Blockers:
- None identified - all fixes are straightforward
- Chart.js version compatibility (low risk)

---

## Rollback Plan

### If Analytics Fix Fails:
1. Remove Chart.js import
2. Display "Analytics coming soon" message
3. File issue for proper implementation

### If SSE Changes Break Activity Feed:
1. Revert to immediate SSE connection
2. Update tests to skip dashboard networkidle
3. Document SSE test strategy

### General Rollback:
```bash
# Each task in separate commit
git log --oneline  # Find commit to revert
git revert <commit-hash>
git push
```

---

## Post-Implementation

### Documentation Updates:
1. Update README with testing instructions
2. Document SSE testing strategy
3. Add troubleshooting guide for common issues
4. Update CLAUDE.md with testing requirements

### Knowledge Sharing:
1. Demo analytics dashboard to team
2. Share mobile testing results
3. Document lessons learned
4. Update test documentation

### Monitoring:
1. Watch for Chart.js errors in production logs
2. Monitor page load times
3. Track SSE connection success rate
4. Review user feedback on analytics

---

## Next Steps After This Plan

1. **Create GitHub Issues:** One issue per task
2. **Set up project board:** Track progress
3. **Code review process:** All fixes reviewed before merge
4. **User testing:** Get feedback on analytics and mobile views
5. **Performance baseline:** Establish metrics for future comparison

---

**Plan Status:** Ready for Implementation
**Approved By:** Pending Review
**Start Date:** TBD
**Target Completion:** 3 days after start
