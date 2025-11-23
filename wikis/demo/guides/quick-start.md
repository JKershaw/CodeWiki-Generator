---
title: Quick Start Guide
type: guide
created: 2025-11-23
updated: 2025-11-23
related:
  - concepts/test-driven-development.md
  - concepts/continuous-integration.md
---

# Quick Start Guide

Welcome! This guide will help you explore the demo wiki and understand how the CodeWiki-Generator works.

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed
- **npm 9+** installed
- A web browser (Chrome, Firefox, or Safari)
- Basic familiarity with command line

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/example/codewiki-generator.git
cd codewiki-generator
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js for the web server
- Jest for testing
- Playwright for E2E testing
- Anthropic SDK for AI integration

**Expected output:**
```
added 245 packages, and audited 246 packages in 12s
found 0 vulnerabilities
```

### 3. Verify Installation

```bash
npm test
```

All 275 tests should pass:
```
Test Suites: 18 passed, 18 total
Tests:       275 passed, 275 total
Snapshots:   0 total
Time:        6.521 s
```

## Running the Application

### 1. Start the Server

```bash
npm start
```

**Expected output:**
```
Server running on http://localhost:3000
Documentation generator initialized
Test coverage analyzer ready
```

### 2. Open the Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the CodeWiki Generator Dashboard with:
- **Processing Status** panel
- **Controls** panel (Start, Pause, Step buttons)
- **Wiki Project** selector (switch between projects)
- **Generated Wiki** links

### 3. Switch to Demo Wiki

1. In the **Wiki Project** section, select "Demo" from the dropdown
2. Click on **Wiki Index** link
3. Explore the demo documentation

## Exploring the Demo Wiki

The demo wiki contains sample documentation to showcase features:

### Component Documentation

Visit these pages to see how code components are documented:
- [Calculator Component](/wiki/demo/components/calculator) - Arithmetic operations with examples
- [Validator Component](/wiki/demo/components/validator) - Input validation utilities

**What to notice**:
- Clear purpose and overview section
- Key functionality breakdown
- Usage examples with actual code
- Test coverage information
- Cross-links to related pages

### Concept Explanations

Explore these conceptual pages:
- [Test-Driven Development](/wiki/demo/concepts/test-driven-development) - TDD methodology
- [Continuous Integration](/wiki/demo/concepts/continuous-integration) - CI/CD practices

**What to notice**:
- Clear explanations of concepts
- Practical examples and code snippets
- Best practices and pitfalls
- Relationships to other concepts

### Navigation Features

Try these navigation features:
- Click **breadcrumb links** at the top to navigate up
- Use **Related Pages** sidebar to explore connections
- Click **Wiki Index** to see full page list
- Use browser back button to return to previous pages

## Running Tests

### Unit Tests

```bash
npm test
```

Runs all 275 unit and integration tests in ~6.5 seconds.

### Test Coverage

```bash
npm run test:coverage
```

Generates detailed coverage report showing which lines of code are tested.

### Watch Mode (for development)

```bash
npm run test:watch
```

Automatically re-runs tests when files change. Perfect for [Test-Driven Development](/wiki/demo/concepts/test-driven-development).

## Project Structure

```
codewiki-generator/
├── lib/                  # Core library code
│   ├── agents/          # AI agents for analysis
│   ├── prompts/         # LLM prompt templates
│   └── *.js             # Utility modules
├── wikis/               # Generated wikis
│   ├── codewiki-generator/  # Project wiki
│   └── demo/            # Demo wiki (you are here!)
├── tests/               # Test suites
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/            # End-to-end tests
├── views/              # EJS templates
├── public/             # Static assets (CSS, JS)
└── server.js           # Web server entry point
```

## Next Steps

Now that you've explored the demo wiki:

1. **Generate Documentation for Your Own Project**:
   - Return to the dashboard (http://localhost:3000)
   - Enter a GitHub repository URL
   - Click "Start Processing"
   - Watch as the wiki is generated

2. **Learn About the Architecture**:
   - Switch to "Codewiki Generator" project in the dropdown
   - Explore the actual codebase documentation
   - See real examples of generated docs

3. **Run End-to-End Tests**:
   ```bash
   npm run test:e2e
   ```
   - See Playwright tests in action
   - View generated screenshots

4. **Customize the Generator**:
   - Modify prompts in `lib/prompts/`
   - Adjust AI agents in `lib/agents/`
   - Run tests to ensure nothing breaks

## Troubleshooting

### Server Won't Start

**Issue**: Port 3000 already in use

**Solution**:
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Tests Failing

**Issue**: Some tests fail after installation

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Wiki Not Loading

**Issue**: Wiki pages return 404 errors

**Solution**:
- Ensure you're using the correct project in the dropdown
- Check that wikis/demo/ directory exists
- Restart the server

## Getting Help

- **Documentation**: Explore all pages in the wiki
- **Test Examples**: See `tests/` directory for usage examples
- **Source Code**: Check `lib/` directory for implementation details
- **Issues**: Report problems on GitHub

## Summary

You've now:
- ✅ Installed the CodeWiki Generator
- ✅ Started the web server
- ✅ Explored the demo wiki
- ✅ Learned about navigation and features
- ✅ Run the test suite
- ✅ Understood the project structure

Ready to generate documentation for your own projects!
