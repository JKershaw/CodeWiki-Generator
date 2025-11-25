---
title: Local Git-based Testing
category: guide
sourceFile: test-run-local.js
related: [meta/overview.md, components/git-hub-client-mocking.md]
created: 2025-11-25
updated: 2025-11-25
---

# Local Git-based Testing

## Purpose and [Overview](../meta/overview.md)

Local Git-based Testing provides a pattern for running the processor on local repository history without external API dependencies. This enables safe iteration and debugging on the codebase itself by mocking GitHub API calls with local git data.

## Key Functionality

This testing approach implements several key components:

- **Git History Extraction**: Uses `execSync` to extract commit history, file changes, and diffs from the local git repository, with proper error handling for edge cases like initial commits and deleted files
- **[GitHub Client Mocking](../components/git-hub-client-mocking.md)**: Replaces the real GitHub API client with a mock implementation that returns local git data instead of making external API calls
- **Cost-Bounded Processing**: Demonstrates the processor's cost awareness through `maxCost` parameters and detailed statistics collection for understanding API usage constraints
- **Statistics Tracking**: Collects detailed metrics on processing efficiency and resource usage during test runs

The system parses git output to reconstruct the same data structure that would normally come from the GitHub API, allowing the processor to run identically whether using live API data or local git history.

## Relationships

This testing pattern connects to several core components:

- **Processor Core**: Tests the main processing logic without external dependencies
- **GitHub API Client**: Demonstrates the dependency injection pattern by providing a mock replacement
- **Cost Management System**: Validates cost tracking and budget constraints in a controlled environment
- **Statistics Collection**: Tests metrics gathering and reporting functionality

## Usage Example

```javascript
// Mock GitHub client with local git data
const mockGitHubClient = {
  // Returns local git data instead of API calls
};

// Run processor with cost bounds and statistics
const processor = new Processor({
  githubClient: mockGitHubClient,
  maxCost: 1000
});

const result = await processor.run();
console.log(result.statistics);
```

## Testing

No automated tests found. The local testing approach serves as a manual testing and debugging tool rather than part of the automated test suite.