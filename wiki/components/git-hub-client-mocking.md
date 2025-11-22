---
title: GitHub client mocking
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# GitHub Client Mocking

## Purpose and Overview

GitHub client mocking enables the documentation generation system to process local git repositories without requiring GitHub API access. This component overrides the standard GitHub client interface to extract commit data, file changes, and diffs directly from the local git repository using shell commands.

## Key Functionality

The mocking system provides a drop-in replacement for the GitHub API client that:

- **Extracts commit history** using `git log` with JSON formatting to retrieve commit messages, authors, and timestamps
- **Captures file changes** by parsing `git diff --name-status` output to identify added, modified, and deleted files
- **Generates content diffs** using `git show` to provide the actual code changes for each commit
- **Maintains API compatibility** by structuring the extracted data to match the expected GitHub client interface

The `getLocalCommits` function serves as the core data extraction mechanism, executing git commands via `execSync` and parsing the results into the format expected by the existing processor pipeline.

## Relationships

This component integrates seamlessly with the existing codebase architecture:

- **Reuses Processor class** from `lib/processor` without modification
- **Mimics githubClient interface** so the processor can operate transparently on local vs. remote data
- **Leverages existing pipeline** for analysis, classification, and documentation generation
- **Enables self-documentation** by allowing the system to analyze its own git history

## Usage Examples

### Basic Self-Documentation

```javascript
// Override the GitHub client with local git data
processor.githubClient = {
  getCommits: () => getLocalCommits(),
  // Other required interface methods...
};

// Process using existing pipeline
await processor.processRepository();
```

### Custom Commit Range

```javascript
// Modify git log command for specific date range
const commits = execSync(
  'git log --since="2024-01-01" --pretty=format:\'{"commit":"%H","message":"%s","author":"%an","date":"%ai"}\' --reverse',
  { encoding: 'utf-8' }
);
```

The mocking approach allows developers to generate comprehensive documentation for private repositories or work offline while maintaining full compatibility with the existing documentation generation workflow.