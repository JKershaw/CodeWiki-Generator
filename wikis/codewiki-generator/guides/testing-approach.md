# Testing Approach

## Overview

CodeWiki-Generator uses Jest as its testing framework with comprehensive test coverage for all agents, clients, and processing logic. This guide explains testing patterns used throughout the codebase and how to write tests for new features.

## Running Tests

1. **Run all tests:**
```bash
npm test
```

2. **Run tests in watch mode (auto-rerun on file changes):**
```bash
npm test -- --watch
```

3. **Run a specific test file:**
```bash
npm test -- src/agents/__tests__/GuideGenerationAgent.test.ts
```

4. **Run tests matching a pattern:**
```bash
npm test -- --testNamePattern="should generate"
```

5. **Generate and view coverage report:**
```bash
npm test -- --coverage
```

Coverage is tracked across all agent classes and client integrations.

## Test Structure

Tests follow a consistent pattern organized by component:

```
src/
├── agents/
│   └── __tests__/
│       ├── ArchitectureOverviewAgent.test.ts
│       ├── GuideGenerationAgent.test.ts
│       ├── MetaAnalysisAgent.test.ts
│       └── WikiIndexAgent.test.ts
├── clients/
│   └── __tests__/
│       ├── ClaudeClient.test.ts
│       └── GitHubClient.test.ts
└── processors/
    └── __tests__/
        └── Processor.test.ts
```

Each test file mirrors its source component and tests both success and failure paths.

## Testing Patterns

### 1. Test Environment Isolation

Tests use mock implementations to avoid external API calls:

```typescript
// Example: Mocking GitHub API client
const mockGitHubClient = {
  getRepositoryMetadata: jest.fn().mockResolvedValue({
    name: 'test-repo',
    description: 'A test repository',
    language: 'TypeScript'
  }),
  getCommitHistory: jest.fn().mockResolvedValue([
    { sha: 'abc123', message: 'Initial commit' }
  ])
};

// Use in test
const agent = new ArchitectureOverviewAgent(mockGitHubClient);
```

### 2. Cost-aware Testing

All tests that use the ClaudeClient verify cost tracking:

```typescript
// Tests verify API usage is tracked
expect(mockClaudeClient.getTotalCost()).toBeLessThan(0.50);
expect(mockClaudeClient.getTokenUsage()).toBeDefined();
```

### 3. State Validation Pattern

Tests verify that processing state remains valid throughout operations:

```typescript
// Test state schema validation
const state = {
  status: 'processing',
  pagesGenerated: 5,
  linksCreated: 12,
  errors: []
};

expect(state.status).toMatch(/^(pending|processing|complete)$/);
expect(typeof state.pagesGenerated).toBe('number');
```

### 4. Error Handling Tests

Tests verify graceful degradation and proper error handling:

```typescript
// Test resilient API communication
mockGitHubClient.getCommitHistory.mockRejectedValueOnce(
  new Error('API rate limited')
);

// System should retry with exponential backoff
const result = await agent.analyze();
expect(result.status).toBe('partial'); // Graceful degradation
```

### 5. JSON Parsing Tests

Tests verify resilient JSON parsing with malformed responses:

```typescript
// Test handling of malformed LLM responses
const malformedResponse = 'Some text {invalid json} more text';
const parsed = parseJSON(malformedResponse);
expect(parsed).toBeDefined(); // Should extract valid parts
```

## Key Test Files and Their Purpose

| Test File | Purpose | Key Coverage |
|-----------|---------|--------------|
| `GuideGenerationAgent.test.ts` | Operational guide generation | Context enrichment, markdown sanitization, placeholder substitution |
| `ArchitectureOverviewAgent.test.ts` | Architecture documentation | Repository introspection, code pattern analysis |
| `MetaAnalysisAgent.test.ts` | Cross-page analysis | Link discovery, relationship graphs |
| `WikiIndexAgent.test.ts` | Index generation | Category-based aggregation, metadata lifecycle |
| `ClaudeClient.test.ts` | AI API integration | Cost tracking, token counting, response parsing |
| `GitHubClient.test.ts` | GitHub integration | Paginated aggregation, retry logic, rate limiting |

## Writing New Tests

When adding new features, follow this pattern:

1. **Create test file next to source:**
```bash
# Source at: src/agents/MyNewAgent.ts
# Create test at: src/agents/__tests__/MyNewAgent.test.ts
```

2. **Use describe and it blocks:**
```typescript
describe('MyNewAgent', () => {
  let agent: MyNewAgent;
  let mockClaudeClient: jest.Mocked<ClaudeClient>;

  beforeEach(() => {
    mockClaudeClient = createMockClaudeClient();
    agent = new MyNewAgent(mockClaudeClient);
  });

  it('should generate output with cost tracking', async () => {
    const result = await agent.process();
    expect(result).toBeDefined();
    expect(mockClaudeClient.getTotalCost()).toBeGreaterThan(0);
  });
});
```

3. **Test both success and failure:**
```typescript
it('should handle API errors gracefully', async () => {
  mockClaudeClient.generateContent.mockRejectedValueOnce(
    new Error('API Error')
  );
  
  const result = await agent.process();
  expect(result.errors).toContain('API Error');
  expect(result.status).toBe('partial');
});
```

4. **Verify state persistence:**
```typescript
it('should maintain valid processing state', async () => {
  await agent.process();
  const state = agent.getState();
  expect(state).toMatchObject({
    status: expect.any(String),
    timestamp: expect.any(Number),
    pageCount: expect.any(Number)
  });
});
```

## Mock Helper Utilities

The codebase provides mock utilities for consistent testing:

```typescript
// Import mock helpers
import { 
  createMockClaudeClient,
  createMockGitHubClient,
  createMockWikiManager
} from '../__mocks__';

// Use in tests
const mockClient = createMockClaudeClient();
mockClient.generateContent.mockResolvedValueOnce('Generated content');
```

## Coverage Goals

- **Line Coverage**: Aim for 80%+
- **Branch Coverage**: 75%+ (especially for error handling paths)
- **Function Coverage**: 80%+

Check coverage with:
```bash
npm test -- --coverage --coverageReporters=text-summary
```

## Debugging Tests

1. **Run single test in debug mode:**
```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand --testNamePattern="test name"
```

2. **Add console output:**
```typescript
it('should work', () => {
  console.log('Debug info:', myVariable);
  expect(true).toBe(true);
});
```

3. **Use test.only to isolate one test:**
```typescript
it.only('should work', () => {
  expect(true).toBe(true);
});
```

## Next Steps

- Review [Agent-based Architecture](./concepts/architecture.md) to understand components being tested
- Check [Extension Patterns](./guides/extension-patterns.md) for adding new agents with proper test structure
- Explore test files in `src/__tests__/` to see real examples