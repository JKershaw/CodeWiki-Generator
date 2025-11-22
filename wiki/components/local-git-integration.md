---
title: Local git integration
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Local Git Integration

## Purpose and Overview

Local git integration enables the documentation generator to analyze and document a repository using local git history instead of GitHub API calls. This component demonstrates a self-documentation pattern where the system generates wiki pages about its own codebase by extracting commit data, file changes, and diffs directly from the local git repository.

## Key Functionality

### Git Data Extraction

The `getLocalCommits` function extracts structured data from the local git repository using shell commands:

- **Commit History**: Retrieves commit SHA, author, date, and message using `git log --oneline`
- **File Changes**: Uses `git diff-tree` to identify added, modified, and deleted files for each commit
- **Content Diffs**: Extracts actual code changes with `git show` for detailed analysis

### GitHub Client Mocking

The system overrides the standard GitHub API client by creating a mock object that:

- Mimics the expected `githubClient` interface structure
- Returns locally extracted git data in the same format as GitHub API responses
- Enables the existing `Processor` class to work seamlessly with local data

### Self-Documentation Workflow

The `main` function orchestrates the process by:

1. Setting up a `Processor` instance with the mocked GitHub client
2. Configuring it to analyze the current repository
3. Running the standard documentation generation pipeline

## Relationships

### Component Dependencies

- **Processor Integration**: Uses the existing `Processor` class from `lib/processor` without modification
- **Interface Compatibility**: Maintains compatibility with the processor's `githubClient` expectations
- **Pipeline Reuse**: Leverages the same analysis and documentation generation pipeline used for GitHub-based workflows

### Data Flow

```
Local Git Repository → Shell Commands → Structured Data → Mocked GitHub Client → Processor → Wiki Documentation
```

## Usage Examples

### Basic Self-Documentation

```javascript
// Run self-documentation on current repository
node generate-self-wiki.js
```

### Integration Pattern

```javascript
// Use local git integration in custom workflows
const processor = new Processor({
  githubClient: {
    getCommits: () => getLocalCommits(),
    // ... other mocked methods
  }
});
```

This pattern can be extended to create local-first documentation workflows for repositories without GitHub integration or for offline analysis scenarios.