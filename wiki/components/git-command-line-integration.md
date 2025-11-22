---
title: Git Command Line Integration
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Git Command Line Integration

## Purpose and Overview

The Git Command Line Integration provides a self-hosted testing mechanism that processes local git repositories directly through shell commands instead of requiring GitHub API access. This enables developers to test the documentation generation tool on their own codebase without external dependencies or API rate limits.

## Key Functionality

### Local Git Data Extraction

The `getLocalCommits` function executes git commands to extract:
- Commit history with metadata (hash, author, message, timestamp)
- File change lists for each commit
- Unified diffs showing actual code modifications
- Filtering for relevant file types (excluding test files, build outputs)

### GitHub Client Mocking

The integration implements a mock GitHub client that:
- Replaces the external API dependency with local data
- Maintains the same interface as the production GitHub client
- Enables the processor to run unchanged while using local git data
- Supports dependency injection testing patterns

### Self-Documentation Testing

The `test-run-local.js` script demonstrates:
- Processing the tool's own repository as a real-world test case
- Generating documentation to `generated-wiki/` to avoid development conflicts
- Providing validation of output quality on actual codebase
- Serving as a working example for other repositories

## Relationships

- **Depends on**: `lib/processor.js` Processor class for core documentation generation
- **Mocks**: GitHub client interface from the main processor workflow
- **Outputs to**: `generated-wiki/` directory (separate from `dev-wiki/`)
- **Shares**: Same processing options, statistics, and configuration as production

## Usage Examples

### Running Local Test

```bash
node test-run-local.js
```

### Key Implementation Pattern

```javascript
const mockGitHubClient = {
  getCommits: () => getLocalCommits(),
  // Other GitHub API methods mocked as needed
};

const processor = new Processor(options, mockGitHubClient);
```

### Git Command Integration

The tool executes standard git commands to gather data:
```bash
git log --oneline -n 50
git show --name-only <commit-hash>
git show <commit-hash> -- <file-path>
```

This approach provides a complete alternative to GitHub API integration while maintaining full compatibility with the existing processing pipeline.