---
title: URL Parsing and Normalization
category: component
sourceFile: lib/github.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# URL Parsing and Normalization

## Purpose and Overview

The URL parsing and normalization component handles the conversion of GitHub repository URLs in multiple formats (HTTPS and SSH) into standardized owner and repository name components. This enables consistent API consumption across the application regardless of the URL format users provide.

## Key Functionality

The `parseRepoUrl` function is the core of this component, accepting GitHub URLs in the following formats:

- **HTTPS**: `https://github.com/owner/repo` or `https://github.com/owner/repo.git`
- **SSH**: `git@github.com:owner/repo.git` or `git@github.com:owner/repo`

The function normalizes these URLs and extracts:
- **owner**: The GitHub user or organization name
- **repo**: The repository name (with `.git` suffix removed if present)

This normalized data is then used throughout the `GitHubClient` class for API operations that require owner and repository parameters.

## Relationships

- **Part of**: `GitHubClient` class in `lib/github.js`
- **Used by**: All repository-level operations (`getRepoInfo`, `getCommits`, `getCommit`, `getFileContent`)
- **Integrates with**: GitHub API calls that require owner and repository identifiers

## Usage Example

```javascript
const { GitHubClient } = require('./lib/github');

const githubClient = new GitHubClient();

// Parse HTTPS format
const httpsUrl = 'https://github.com/octocat/Hello-World.git';
const { owner, repo } = githubClient.parseRepoUrl(httpsUrl);
// Result: { owner: 'octocat', repo: 'Hello-World' }

// Parse SSH format
const sshUrl = 'git@github.com:octocat/Hello-World';
const { owner, repo } = githubClient.parseRepoUrl(sshUrl);
// Result: { owner: 'octocat', repo: 'Hello-World' }

// Use parsed components for API calls
const commits = await githubClient.getCommits(owner, repo);
```

## Testing

Test coverage for URL parsing and normalization is included in `tests/unit/github.test.js` as part of the broader GitHubClient test suite (18 test cases across 7 test suites). The `parseRepoUrl` tests verify correct parsing of both HTTPS and SSH URL formats, including handling of optional `.git` suffixes and edge cases.