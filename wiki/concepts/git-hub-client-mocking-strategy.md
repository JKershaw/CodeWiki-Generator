---
title: GitHub Client Mocking Strategy
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# GitHub Client Mocking Strategy

## Purpose and Overview

The GitHub Client Mocking Strategy provides a testing approach that allows the documentation tool to process repositories using local git commands instead of the GitHub API. This enables self-hosted testing and development without requiring API credentials or network access.

## Key Functionality

### Local Git Integration
- **`getLocalCommits()`** - Executes shell commands to extract commit history, file changes, and diffs directly from the local `.git` directory
- **Dependency Injection** - Replaces the standard GitHub client with a mock that sources data from local git rather than remote APIs
- **Self-Documentation** - Tests the tool against its own codebase, providing both validation and real-world output examples

### Testing Workflow
The `test-run-local.js` script orchestrates a complete processing cycle:
1. Mocks the GitHub client interface with local git data
2. Instantiates the main `Processor` class with mocked dependencies
3. Processes the current repository using identical logic to production
4. Outputs results to `generated-wiki/` to avoid conflicts with development documentation

## Relationships

- **Depends on**: `lib/processor.js` Processor class for core processing logic
- **Mocks**: GitHub client interface from the main processor workflow
- **Integrates with**: Local git repository through shell command execution
- **Outputs to**: `generated-wiki/` directory (separate from `dev-wiki/`)

## Usage Examples

### Running Local Tests
```bash
node test-run-local.js
```

### Mock Implementation Pattern
```javascript
const mockGitHubClient = {
  getCommits: () => getLocalCommits(),
  // Other GitHub API methods mocked with local alternatives
};

const processor = new Processor(mockGitHubClient, options);
```

This strategy demonstrates practical dependency injection for testing external API integrations and provides a foundation for offline development workflows.