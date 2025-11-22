---
title: Git Integration for Commit Processing
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Git Integration for Commit Processing

## Purpose and Overview

The Git Integration component enables local testing and development of the CodeWiki Generator by extracting commit data directly from a local git repository instead of relying on the GitHub API. This allows developers to test the generator on the codebase itself without making external API calls or requiring network access.

## Key Functionality

### Local Commit Extraction

The `getLocalCommits` function executes git commands to extract structured commit data:

- Retrieves commit SHA, author, date, and message using `git log`
- Identifies changed files for each commit with `--name-only` flag
- Generates file diffs using `git show` for detailed change analysis
- Returns data in the same format expected by the main processor

### Mock Client Pattern

The component implements a dependency injection approach by creating a mock GitHub client that:

- Substitutes the external GitHub API with local git data
- Maintains the same interface as the real GitHub client
- Allows the core processor logic to run unchanged
- Outputs results to a separate `generated-wiki/` directory

## Relationships

The Git Integration component connects to the broader system through:

- **lib/processor**: Uses the core processing module unchanged, demonstrating the modularity of the architecture
- **GitHub Client Interface**: Implements the same methods expected by the processor, enabling seamless substitution
- **File System**: Reads from the local `.git` directory and writes to `generated-wiki/` for isolated testing
- **Shell Commands**: Leverages native git commands for data extraction, avoiding additional dependencies

## Usage Examples

### Running Local Test

```bash
node test-run-local.js
```

This executes the generator on the current repository using local git history.

### Integration in Development Workflow

The mock client pattern can be extended for other testing scenarios:

```javascript
const mockClient = {
  getCommits: () => getLocalCommits(),
  // Add other GitHub API methods as needed
};

const processor = new Processor(mockClient);
```

This approach enables rapid iteration and testing without API rate limits or network dependencies.