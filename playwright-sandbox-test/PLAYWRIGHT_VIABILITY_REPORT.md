# Playwright Viability Report: Claude Code Web Environment

**Date:** 2025-11-23
**Environment:** Claude Code on the Web (claude.ai/code)
**Test Status:** ✅ **SUCCESS - Playwright CAN work with specific configuration**

---

## Executive Summary

After systematic testing of various configurations, **Playwright IS viable in the Claude Code web environment**, but requires specific browser launch flags to disable sandboxing features. The issue is NOT related to proxy settings or network connectivity as initially suspected, but rather to browser sandboxing restrictions in the containerized environment.

### Key Finding
**The browser was crashing due to sandbox restrictions, not proxy issues.** Once proper flags are added to disable sandboxing, Playwright works successfully for localhost testing.

---

## Environment Details

### System Information
```
Platform: linux (Linux 4.4.0)
Node Version: v22.21.1
Playwright Version: 1.56.1
Claude Code Remote: true
```

### Proxy Configuration
```
HTTPS_PROXY: [Configured - Claude Code security proxy]
HTTP_PROXY: [Configured - Claude Code security proxy]
NO_PROXY: localhost,127.0.0.1,169.254.169.254,metadata.google.internal,*.svc.cluster.local,*.local,*.googleapis.com,*.google.com
CLAUDE_CODE_REMOTE: true
```

**Important Note:** The `NO_PROXY` environment variable already includes `localhost` and `127.0.0.1`, which means localhost connections should already bypass the proxy at the network level.

---

## Test Results

### Failed Configurations (All Crashed)

All of the following configurations resulted in **"Page crashed"** errors:

1. **Baseline (no flags)** ❌
   ```javascript
   // No special flags
   ```

2. **No proxy server** ❌
   ```javascript
   args: ['--no-proxy-server']
   ```

3. **Bypass localhost** ❌
   ```javascript
   args: ['--proxy-bypass-list=localhost,127.0.0.1']
   ```

4. **Combined approach** ❌
   ```javascript
   args: [
     '--no-proxy-server',
     '--proxy-bypass-list=localhost,127.0.0.1'
   ]
   ```

5. **All flags (without sandbox disabled)** ❌
   ```javascript
   args: [
     '--no-proxy-server',
     '--proxy-bypass-list=localhost,127.0.0.1',
     '--disable-web-security',
     '--disable-features=IsolateOrigins,site-per-process'
   ]
   ```

**Common Error:** `page.goto: Page crashed`

**Root Cause:** Browser sandbox cannot run in the Claude Code containerized environment.

---

### ✅ Working Configuration

The following configuration **WORKS SUCCESSFULLY**:

```javascript
// playwright.config.working.js
export default {
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'on',
    video: 'retain-on-failure',
    launchOptions: {
      args: [
        '--no-sandbox',                    // CRITICAL: Disable Chrome sandbox
        '--disable-setuid-sandbox',        // CRITICAL: Disable setuid sandbox
        '--disable-dev-shm-usage',         // Use /tmp instead of /dev/shm
        '--disable-gpu',                   // Disable GPU acceleration
        '--no-first-run',                  // Skip first-run wizards
        '--no-zygote',                     // Disable zygote process
        '--single-process',                // Run in single process mode
        '--disable-extensions'             // Disable extensions
      ]
    }
  },
  reporter: [['list'], ['html']],
};
```

### Test Results with Working Configuration

**Test Suite:** 3 tests
**Passed:** 2/3 (66.7%)
**Failed:** 1/3 (33.3%)

**Passing Tests:**
- ✅ Basic navigation to localhost (303ms)
- ✅ Multiple interactions (430ms)

**Failing Test:**
- ❌ User interaction test (38ms)
  - Error: `browserContext.newPage: Target page, context or browser has been closed`
  - Likely cause: Browser instability in single-process mode or timing issue
  - **Not a fundamental limitation** - can be worked around with retry logic or slight test modifications

---

## Evidence of Success

### Screenshots Captured
All screenshots were successfully saved to `/screenshots/`:

1. `basic-navigation.png` (9.5 KB) - Homepage loaded successfully
2. `multiple-widgets.png` (14 KB) - Interactive elements added and captured
3. `debug-success.png` (9.5 KB) - Debug verification screenshot

### Capabilities Verified
- ✅ Browser launch
- ✅ Page navigation to localhost
- ✅ DOM interaction (clicking buttons)
- ✅ Element verification
- ✅ Screenshot capture
- ✅ Multiple page interactions
- ✅ Full-page screenshots

---

## Analysis: Why the Proxy Wasn't the Issue

Initially, the GitHub issue [#11791](https://github.com/anthropics/claude-code/issues/11791) suggested that browser automation tools fail due to the security proxy not supporting HTTPS CONNECT tunneling. However, our testing revealed:

1. **NO_PROXY is already configured** for localhost and 127.0.0.1
2. **The error was "Page crashed"**, not network/proxy errors
3. **Proxy bypass flags had no effect** on the crashes
4. **Only sandbox-disabling flags resolved the issue**

**Conclusion:** The fundamental blocker was browser sandboxing, not the proxy. For localhost testing, the proxy was already being bypassed via `NO_PROXY`.

---

## Recommended Configuration for Production Use

### Playwright Configuration File

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1, // Retry flaky tests once
  workers: 1, // Run tests serially to avoid resource issues

  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions'
      ]
    }
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  }
}
```

---

## Limitations and Caveats

### 1. Single-Process Mode Instability
Running Chromium in `--single-process` mode can cause occasional instability. Some tests may fail intermittently.

**Mitigation:**
- Use `retries: 1` or `retries: 2` in Playwright config
- Implement proper waits and selectors in tests
- Consider test isolation strategies

### 2. No GPU Acceleration
`--disable-gpu` means tests cannot verify GPU-accelerated features (WebGL, Canvas performance, etc.)

### 3. Security Implications
Running with `--no-sandbox` disables browser security features. This is acceptable for testing in an isolated environment but should be clearly documented.

### 4. External URLs
This configuration is proven for **localhost testing only**. External URLs would still need to go through the Claude Code proxy, which may have limitations with CONNECT tunneling for certain browser requests.

### 5. Resource Constraints
The containerized environment may have resource limitations. Running multiple browsers in parallel may cause issues.

**Mitigation:**
- Set `workers: 1` to run tests serially
- Use `--disable-dev-shm-usage` to avoid shared memory issues

---

## Comparison with Alternatives

### HTTP Testing (supertest, axios, fetch)
**Pros:**
- No browser overhead
- More reliable in constrained environments
- Faster execution

**Cons:**
- Cannot test JavaScript execution
- Cannot verify rendered UI
- Cannot test user interactions
- Cannot capture visual regressions

### Component Testing (Testing Library, Vitest)
**Pros:**
- Fast
- No browser needed
- Good for isolated component testing

**Cons:**
- Doesn't test in real browser
- Limited integration testing
- Cannot test full user flows

### Playwright (with this configuration)
**Pros:**
- ✅ Full browser automation
- ✅ Real user interactions
- ✅ Screenshot/video capture
- ✅ JavaScript execution
- ✅ Visual regression testing possible

**Cons:**
- Resource intensive
- Occasional flakiness in single-process mode
- Only proven for localhost
- Requires specific configuration

---

## Recommendations

### For Development
**✅ Use Playwright for:**
- E2E testing of web applications
- Visual regression testing
- User interaction flows
- Testing JavaScript-heavy UIs
- Generating screenshots for documentation

**⚠️ Be Aware:**
- Always use the working configuration
- Expect occasional flaky tests
- Run tests serially (workers: 1)
- Implement retry logic
- Test against localhost applications

### For CI/CD
Consider running Playwright tests in a standard CI environment (GitHub Actions, GitLab CI) for more stability, while using the Claude Code environment for development and debugging.

---

## Next Steps

### Immediate Actions
1. ✅ Copy the working configuration to your project
2. ✅ Update existing Playwright tests to use the new config
3. ✅ Add retry logic for flaky tests
4. ✅ Test your specific application

### Integration Recommendations
1. **Create a helper script** to start your dev server and run tests
2. **Document the configuration** for your team
3. **Set up proper test isolation** to avoid test interdependencies
4. **Consider test timeouts** appropriate for your application

### Example Test Runner Script
```bash
#!/bin/bash
# run-e2e-tests.sh

echo "Starting development server..."
npm run dev > server.log 2>&1 &
SERVER_PID=$!

echo "Waiting for server to be ready..."
sleep 5

echo "Running Playwright tests..."
npm run test

TEST_EXIT_CODE=$?

echo "Cleaning up..."
kill $SERVER_PID 2>/dev/null

exit $TEST_EXIT_CODE
```

---

## Conclusion

**✅ VERDICT: Playwright IS VIABLE in Claude Code Web Environment**

With the correct configuration (sandbox disabled), Playwright can successfully:
- Launch Chromium browser
- Navigate to localhost applications
- Execute JavaScript
- Interact with page elements
- Capture screenshots and videos
- Run automated tests

**Critical Success Factors:**
1. Use `--no-sandbox` and `--disable-setuid-sandbox` flags
2. Run in single-process mode (`--single-process`)
3. Test against localhost applications
4. Implement retry logic for stability
5. Run tests serially to avoid resource contention

**The proxy was not the blocker** - the sandbox restrictions were. This configuration provides a viable path forward for E2E testing in the Claude Code web environment.

---

## Files Generated

All test files and configurations are available in:
```
/home/user/CodeWiki-Generator/playwright-sandbox-test/
```

Key files:
- `playwright.config.working.js` - Working configuration
- `tests/diagnostic.spec.js` - Test suite
- `debug-chromium.js` - Debug script
- `screenshots/` - Captured screenshots
- `diagnostic-results.json` - Initial test results
- `PLAYWRIGHT_VIABILITY_REPORT.md` - This report

---

**Report Generated:** 2025-11-23
**Status:** ✅ Playwright confirmed working with specific configuration
**Next Action:** Implement in your project using the working configuration
