# Testing Approach

## Introduction

This guide explains how tests are organized and written in CodeWiki-Generator. The project uses **Jest**, a modern testing framework that provides excellent coverage for Node.js applications. Understanding testing patterns here will help you write reliable tests for new features.

## Test Organization

Tests are located in the `tests/` directory and organized by feature:

```
tests/
├── config.test.js           # Configuration module tests
├── state.test.js            # State management tests
├── wiki.test.js             # Wiki operations tests
└── [other test files]
```

Test files follow the naming convention: `[module].test.js`

## Running Tests

### Basic Commands

Run all tests once:
```bash
npm test
```

Run tests in watch mode (reruns on file changes during development):
```bash
npm test -- --watch
```

Run a specific test file:
```bash
npm test -- tests/config.test.js
```

Run tests matching a pattern:
```bash
npm test -- --testNamePattern="validation"
```

### Coverage Reports

Generate a coverage report to see which code is tested:
```bash
npm test -- --coverage
```

This creates a coverage report showing:
- **Statements**: Percentage of statements executed
- **Branches**: Percentage of conditional branches tested
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

Aim for at least 80% coverage on new code.

## Testing Patterns Used

### 1. Configuration Validation Pattern Tests

Tests verify that configuration is correctly validated and applied:

```javascript
describe('Configuration validation', () => {
  it('should validate required fields', () => {
    // Test that missing required fields throw errors
  });

  it('should apply environment-based configuration', () => {
    // Test that different environments load correct config
  });
});
```

**Key aspects tested:**
- Required fields are validated
- Environment-based config separation (test vs. production)
- Default values are applied correctly

### 2. State Management Tests

Tests verify persistent state operations:

```javascript
describe('Persistent State Management', () => {
  it('should persist state to file', () => {
    // Test file-based persistence
  });

  it('should validate state schema', () => {
    // Test State Schema Validation Pattern
  });

  it('should handle directory operations', () => {
    // Test File-based State Persistence with Directory Handling
  });
});
```

**Key aspects tested:**
- State persists correctly to disk
- Schema validation prevents invalid state
- Directory creation and cleanup works

### 3. Wiki Operations Tests

Tests verify markdown management and page operations:

```javascript
describe('Wiki Page Operations', () => {
  it('should parse frontmatter correctly', () => {
    // Test Frontmatter Parsing Pattern
  });

  it('should serialize pages with metadata', () => {
    // Test Frontmatter-based Page Serialization
  });

  it('should search content with context', () => {
    // Test Content Search with Context Extraction
  });
});
```

**Key aspects tested:**
- YAML frontmatter parsing works correctly
- Page serialization preserves metadata
- Search functionality returns relevant context

### 4. Mock Credential Injection

Tests use mocked credentials to avoid hardcoding secrets:

```javascript
describe('Authentication', () => {
  beforeEach(() => {
    // Mock credential injection for testing
    process.env.TEST_CREDENTIAL = 'mock-token';
  });

  afterEach(() => {
    delete process.env.TEST_CREDENTIAL;
  });

  it('should use injected credentials', () => {
    // Test that mocked credentials work
  });
});
```

**Key aspects:**
- Never hardcode real credentials in tests
- Use environment variables for test credentials
- Clean up after each test

## Writing New Tests

### 1. Test File Structure

Create test files following this structure:

```javascript
describe('Feature Name', () => {
  // Setup before each test
  beforeEach(() => {
    // Initialize test fixtures
  });

  // Cleanup after each test
  afterEach(() => {
    // Clean up files, mocks, etc.
  });

  // Individual test cases
  it('should do something specific', () => {
    // Arrange: Set up test conditions
    const input = { /* test data */ };

    // Act: Execute the code
    const result = myFunction(input);

    // Assert: Verify the result
    expect(result).toBe(expectedValue);
  });
});
```

### 2. Testing State Operations

When testing Persistent State Management:

```javascript
it('should persist state to file', () => {
  // Arrange
  const testState = { id: 1, data: 'test' };

  // Act
  saveState(testState);

  // Assert
  const loaded = loadState();
  expect(loaded).toEqual(testState);
});
```

### 3. Testing Configuration

When testing Configuration validation:

```javascript
it('should validate required configuration', () => {
  // Arrange
  const invalidConfig = { /* missing required field */ };

  // Act & Assert
  expect(() => {
    validateConfig(invalidConfig);
  }).toThrow('Required field missing');
});
```

### 4. Testing Markdown Operations

When testing Wiki operations:

```javascript
it('should parse frontmatter from markdown', () => {
  // Arrange
  const markdown = `---
title: Test Page
date: 2024-01-01
---
# Content`;

  // Act
  const { frontmatter, content } = parsePage(markdown);

  // Assert
  expect(frontmatter.title).toBe('Test Page');
  expect(content).toContain('# Content');
});
```

## Best Practices

1. **One assertion focus**: Each test should verify one behavior
2. **Descriptive names**: Use `it('should...')` to clearly state what's being tested
3. **Setup and teardown**: Use `beforeEach()` and `afterEach()` for common setup
4. **Avoid test interdependence**: Tests should run in any order
5. **Mock external dependencies**: Don't make real API calls or file operations in unit tests
6. **Test edge cases**: Empty inputs, null values, invalid data
7. **Keep tests fast**: Mock slow operations, use in-memory alternatives
8. **Test error paths**: Verify that errors are thrown appropriately

## Running Tests Before Commit

Always run tests before committing changes:

```bash
# Run all tests
npm test

# Check coverage
npm test -- --coverage

# If using git hooks, tests run automatically
git commit -m "Add new feature"
```

## Continuous Integration

When you push code to the repository, CI/CD automatically runs:
```bash
npm test
```

Ensure your code passes all tests before pushing to avoid CI failures.

## Debugging Tests

Run a specific test with Node debugger:

```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand tests/config.test.js
```

Then open Chrome DevTools at `chrome://inspect` to debug.

Or use VS Code's debugger with this configuration in `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```