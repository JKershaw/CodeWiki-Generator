---
title: Cost-controlled Test Runs
category: concept
sourceFile: test-run-local.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Cost-controlled Test Runs

## Purpose and Overview

Cost-controlled test runs establish a practice of executing system tests with bounded API costs (typically $2 limit) to validate the system's cost-awareness while preventing expensive accidental test executions. This approach ensures safe testing of API-dependent workflows without risking unexpected charges from external service calls.

## Key Functionality

- **Cost Boundaries**: Sets explicit spending limits before test execution to prevent runaway API costs
- **Local Testing Infrastructure**: Utilizes git-based commit extraction to reduce external API dependencies during testing
- **GitHub Client Mocking**: Replaces live GitHub API calls with local git data to eliminate API costs while preserving test validity
- **Git History Processing**: Extracts commits and file-level diffs directly from local repository using `execSync`, handling edge cases like root commits and deleted files
- **Production Safety**: Prevents overwriting production wiki output during test runs

## Relationships

Cost-controlled test runs connect to several key components:

- **Local Git-based Testing Infrastructure**: Provides the foundation for API-free testing by extracting data from local git history
- **GitHub Client Mocking Pattern**: Implements the interface substitution that enables cost-free testing
- **Processor Component**: Acts as the primary target for cost-controlled testing, receiving mocked GitHub data instead of live API responses

## Usage Example

```javascript
// Mock GitHub client with local git data
const mockGitHubClient = {
  getCommits: () => {
    // Extract from local git log instead of GitHub API
    const gitOutput = execSync('git log --format="%H|%s|%an|%ad"');
    return parseCommitsFromGitOutput(gitOutput);
  },
  getDiff: (commitHash) => {
    // Get diff from local git instead of GitHub API
    const diffOutput = execSync(`git show ${commitHash}`);
    return parseDiffOutput(diffOutput);
  }
};

// Run processor with cost limit and mocked client
const processor = new Processor({ 
  costLimit: 2.00,
  githubClient: mockGitHubClient 
});
```

## Testing

No automated tests found for this component. The cost-controlled approach itself serves as a manual testing strategy rather than having its own test suite.