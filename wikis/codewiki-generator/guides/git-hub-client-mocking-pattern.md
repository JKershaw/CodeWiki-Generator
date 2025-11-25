---
title: GitHub Client Mocking Pattern
category: guide
sourceFile: test-run-local.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# GitHub Client Mocking Pattern

## Purpose and Overview

The GitHub Client Mocking Pattern enables testing of the commit processing system without relying on external GitHub API calls. This pattern extracts commits and diffs directly from local git history and injects them into the system by mocking the GitHub client interface, providing a self-contained testing environment.

## Key Functionality

This pattern implements several key components:

- **Local Git History Extraction**: Uses `execSync` to run git commands and parse commit data from the local repository
- **Diff Processing**: Extracts file-level diffs with error handling for edge cases like root commits and deleted files
- **GitHub Client Interface Mocking**: Replaces GitHub API calls with locally sourced commit data while maintaining the same interface
- **Cost-controlled Execution**: Enables testing with bounded API costs (typically $2 limit) to prevent expensive accidental executions

The system parses git log output to build commit objects that match the expected GitHub API response format, allowing the existing processor logic to work unchanged with local data.

## Relationships

This mocking pattern connects to several system components:

- **Processor**: Receives mocked GitHub client instead of real API client, allowing normal processing flow with local data
- **Local Git Repository**: Serves as the data source for commits and diffs instead of GitHub API
- **Cost Management System**: Integrates with existing cost controls to enable bounded test runs
- **Wiki Output System**: Can be configured to avoid overwriting production wiki content during testing

## Usage Example

```javascript
// Extract commits from local git history
const commits = execSync('git log --format=format:%H|%s|%an|%ae|%ad --date=iso', { encoding: 'utf8' });

// Mock the GitHub client interface
const mockGitHubClient = {
  getCommits: () => parseLocalCommits(commits),
  getDiff: (commitSha) => execSync(`git show ${commitSha}`, { encoding: 'utf8' })
};

// Inject mock client into processor
const processor = new Processor(mockGitHubClient, { maxCost: 2.00 });
```

## Testing

No automated tests found for this component. The mocking pattern itself serves as a testing infrastructure for the broader system, enabling local validation without external dependencies.