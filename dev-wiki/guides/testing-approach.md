---
title: Testing Approach
created: 2025-11-22
updated: 2025-11-22
related: [Architecture, Getting Started]
---

# Testing Approach

CodeWiki Generator follows strict test-driven development (TDD) principles.

## Test-First Philosophy

**Every feature starts with a failing test.**

1. Write a test that describes the desired behavior
2. Run the test - it should fail (red)
3. Write the minimum code to make it pass (green)
4. Refactor if needed
5. Commit when tests pass

## Test Structure

```
tests/
├── unit/
│   ├── wiki-manager.test.js
│   ├── state-manager.test.js
│   ├── github.test.js
│   ├── agents/
│   │   ├── code-analysis-agent.test.js
│   │   ├── documentation-writer-agent.test.js
│   │   └── meta-analysis-agent.test.js
│   └── processor.test.js
├── integration/
│   └── full-flow.test.js
└── fixtures/
    ├── sample-commits.json
    ├── sample-diffs.txt
    └── expected-wiki-pages.md
```

## Testing Tools

- **Jest**: Test runner and assertion library
- **Mocks**: For external dependencies (GitHub, Anthropic)
- **Fixtures**: Sample data for consistent testing

## Unit Testing Principles

### Test Isolation
Each test should be independent:
- No shared state between tests
- Clean up after each test
- Use beforeEach/afterEach for setup/teardown

### Mock External Services
Never call real APIs in tests:
- Mock GitHub API responses
- Mock Anthropic API responses
- Use in-memory storage instead of filesystem when possible

### Test Edge Cases
Don't just test the happy path:
- Invalid inputs
- Missing data
- API errors
- Rate limits
- Network failures
- Malformed responses

### Clear Test Names
Test names should describe what they test:
```javascript
describe('WikiManager', () => {
  describe('getPage', () => {
    it('should return page with parsed frontmatter', () => { ... });
    it('should return null for non-existent page', () => { ... });
    it('should handle pages without frontmatter', () => { ... });
  });
});
```

## Integration Testing

Test the full pipeline with realistic data:
- Create a minimal test repository
- Mock external APIs with deterministic responses
- Verify complete workflow from commit to wiki page
- Check state persistence
- Validate error recovery

## Self-Validation Testing

The ultimate test: **Run the generator on itself**

After major features:
1. Process this codebase's git history
2. Generate documentation
3. Read the generated wiki
4. Ask: "Can I understand the system from this?"
5. If not, improve the documentation agents

This is qualitative but critical - if the system can't document itself well, it won't document other code well.

## Test Coverage Goals

- Unit tests: 80%+ coverage
- Integration tests: Cover all major workflows
- Error paths: All error handlers tested
- Edge cases: Boundary conditions covered

## Mocking Strategy

### GitHub API Mocks
```javascript
const mockOctokit = {
  rest: {
    repos: {
      getCommit: jest.fn(() => Promise.resolve({ data: mockCommitData }))
    }
  }
};
```

### Anthropic API Mocks
```javascript
const mockAnthropic = {
  messages: {
    create: jest.fn(() => Promise.resolve({
      content: [{ text: JSON.stringify(mockAnalysis) }]
    }))
  }
};
```

### File System Mocks
Use in-memory structures or temp directories:
```javascript
const mockWiki = new Map();
const wikiManager = new WikiManager(mockWiki);
```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm test:watch

# Coverage report
npm test -- --coverage

# Specific test file
npm test -- wiki-manager.test.js
```

## Debugging Tests

Use Jest's built-in debugging:
```javascript
it('should do something', () => {
  console.log(JSON.stringify(result, null, 2));
  expect(result).toBe(expected);
});
```

Or use Node debugger:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Continuous Testing

During development:
1. Keep tests running in watch mode
2. Write test first for new feature
3. Implement until test passes
4. Refactor if needed
5. Move to next test

## Test Quality Checks

Good tests are:
- **Fast**: Run quickly so you run them often
- **Isolated**: Don't depend on other tests
- **Repeatable**: Same result every time
- **Clear**: Easy to understand what's being tested
- **Focused**: Test one thing at a time

## Common Testing Patterns

### Setup and Teardown
```javascript
describe('Component', () => {
  let component;

  beforeEach(() => {
    component = new Component();
  });

  afterEach(() => {
    component.cleanup();
  });

  it('should work', () => { ... });
});
```

### Async Testing
```javascript
it('should fetch data', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});
```

### Error Testing
```javascript
it('should throw on invalid input', () => {
  expect(() => parseData(null)).toThrow('Invalid input');
});
```

## Documentation Through Tests

Tests serve as living documentation:
- They show how to use the API
- They demonstrate edge cases
- They prove features work
- They catch regressions

Well-written tests make code reviews easier and onboarding faster.
