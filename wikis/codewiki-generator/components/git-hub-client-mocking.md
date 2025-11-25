---
title: GitHub Client Mocking
category: component
sourceFile: test-run-local.js
related: [meta/overview.md, guides/local-git-based-testing.md]
created: 2025-11-25
updated: 2025-11-25
---

# GitHub Client Mocking

## Purpose and [Overview](../meta/overview.md)

Provides a dependency injection pattern for replacing the real GitHub client with a mock implementation that returns local git data. This enables isolated testing of the processor without external API calls, allowing developers to safely iterate and debug using local repository history.

## Key Functionality

The GitHub Client Mocking component implements several core capabilities:

- **Mock GitHub Client Creation**: Replaces the real GitHub client with a local implementation that uses `execSync` to extract git data
- **Git History Extraction**: Retrieves commit history, file changes, and diffs from the local git repository
- **Error Handling**: Manages edge cases such as initial commits and deleted files during git operations
- **Data Format Translation**: Converts local git data into the format expected by the GitHub client interface

The mock client uses git commands to simulate GitHub API responses, providing the same data structure while eliminating network dependencies and API rate limits.

## Relationships

This component connects to several other parts of the system:

- **Processor**: Receives the mocked GitHub client as a dependency injection, allowing it to run against local data
- **[Local Git-based Testing](../guides/local-git-based-testing.md)**: Serves as the foundation for the local testing pattern that enables safe iteration
- **Cost-Bounded Processing**: Works with the processor's cost awareness system, though local testing bypasses actual API costs
- **Statistics Tracking**: Integrates with the processor's statistics collection to provide insights during local testing

## Usage Example

```javascript
// Mock GitHub client with local git data
const mockGitHubClient = createMockClient();

// Inject mock client into processor
const processor = new Processor({
  githubClient: mockGitHubClient,
  maxCost: 1000
});

// Run processor on local repository
const results = await processor.run();
```

## Testing

No automated tests found. Testing is performed through local execution using the mock client to validate processor behavior against actual repository history.