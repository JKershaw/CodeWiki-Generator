---
title: Local Git-based Testing Infrastructure
category: component
sourceFile: test-run-local.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Local Git-based Testing Infrastructure

## Purpose and Overview

The Local Git-based Testing Infrastructure provides a self-contained testing approach that extracts commits and diffs directly from local git history instead of relying on the GitHub API. This enables testing without external dependencies and prevents accidentally overwriting production wiki output during development.

## Key Functionality

- **Git History Extraction**: Parses git log output and file-level diffs using `execSync` to retrieve commit data locally
- **GitHub Client Mocking**: Creates a mock interface that injects local commits in place of GitHub API calls, allowing the Processor to run against local repository data
- **Edge Case Handling**: Manages special scenarios like root commits and deleted files during diff extraction
- **Cost-controlled Execution**: Implements bounded API cost limits ($2 limit) to validate system cost-awareness and prevent expensive accidental test runs

The infrastructure works by executing git commands directly on the local repository, parsing their output into the same data structures expected by the main processing pipeline, then substituting these local data sources for external API calls.

## Relationships

This component serves as a testing harness for the main **Processor** component, allowing it to run against local git data instead of live GitHub repositories. It maintains the same interface contracts as the GitHub client components, ensuring compatibility with existing processing logic while providing isolation for development and testing scenarios.

## Usage Example

```javascript
const { execSync } = require('child_process');

// Extract commits from local git history
const gitLog = execSync('git log --oneline -10', { encoding: 'utf8' });
const commits = gitLog.trim().split('\n');

// Create mock GitHub client with local data
const mockGitHubClient = {
  getCommits: () => Promise.resolve(localCommits),
  getDiff: (sha) => Promise.resolve(extractLocalDiff(sha))
};

// Run processor with local data and cost limits
const result = await processor.run(mockGitHubClient, { maxCost: 2.00 });
```

## Testing

No automated tests found for this component. The infrastructure itself serves as a testing tool for validating the main processing pipeline against local repository data.