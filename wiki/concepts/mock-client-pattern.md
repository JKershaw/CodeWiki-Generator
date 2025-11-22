---
title: Mock Client Pattern
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Mock Client Pattern

## Purpose and Overview

The Mock Client Pattern enables local testing of the CodeWiki Generator by replacing the GitHub API client with a mock that uses local git repository data. This allows developers to test the generator on itself without making external API calls or requiring network access.

## Key Functionality

### Local Git Data Extraction

The `getLocalCommits` function extracts commit history directly from the local git repository using shell commands:

- Retrieves commit SHA, author, date, and message
- Identifies changed files for each commit
- Generates file diffs using `git show`
- Structures data to match GitHub API response format

### Dependency Injection

The pattern uses dependency injection to substitute the GitHub client:

```javascript
// Mock the GitHub client interface
const mockGithubClient = {
  getCommits: () => localCommits,
  getFileContent: (path) => fs.readFileSync(path, 'utf8'),
  // ... other GitHub API methods
};

// Inject mock into processor
const processor = new Processor(config, mockGithubClient);
```

### Test Execution

The `main` function orchestrates local testing by:

- Configuring the processor with mocked dependencies
- Processing the current repository using local git data
- Outputting results to `generated-wiki/` directory

## Relationships

- **Uses** `lib/processor` module for core processing logic
- **Mocks** GitHub API client interface with local git operations
- **Outputs** to separate directory (`generated-wiki/`) to avoid conflicts with development wiki
- **Processes** same codebase structure as production but with local data source

## Usage Examples

Run local testing:

```bash
node test-run-local.js
```

The script processes the current repository's git history and generates documentation based on local commits, allowing developers to:

- Test changes without GitHub API rate limits
- Validate generator behavior during development
- Debug processing logic with known local data
- Iterate quickly on documentation generation improvements

This pattern is particularly useful for development workflows where frequent testing is needed without external dependencies.