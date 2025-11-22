---
title: Mock GitHub Client Pattern
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Mock GitHub Client Pattern

## Purpose and Overview

The Mock GitHub Client Pattern enables local development and testing of the CodeWiki Generator without requiring GitHub API access or incurring API costs. This pattern substitutes the external GitHub API dependency with local git repository data, allowing developers to test the system on itself using the project's own commit history.

## Key Functionality

### Local Git Data Extraction
The pattern extracts commit history and file changes directly from the local git repository using Node.js `child_process.execSync()` commands:

- **Commit History**: Retrieves commit metadata (hash, author, date, message) via `git log`
- **File Changes**: Captures added, modified, and deleted files for each commit via `git diff-tree`
- **Content Retrieval**: Fetches file contents at specific commits using `git show`

### Dependency Injection Implementation
The mock client implements the same interface as the actual GitHub client, providing:

- `getCommits()` method that returns locally extracted commit data
- `getFileContent()` method that retrieves file contents from git history
- Seamless substitution without modifying core processor logic

### Isolated Test Environment
- Outputs generated documentation to `generated-wiki/` directory to avoid conflicts with development wiki
- Operates entirely offline without external API dependencies
- Processes real project data for authentic testing scenarios

## Relationships

### Core Integration
- **Processor Class**: Uses the standard `lib/processor` with mocked GitHub client injected
- **Git Commands**: Integrates with local git repository through shell command execution
- **File System**: Writes output to separate directory structure for test isolation

### Interface Compatibility
The mock client maintains API compatibility with the real GitHub client interface, ensuring the Processor class operates identically regardless of data source. This demonstrates clean dependency injection and interface segregation principles.

## Usage Examples

### Running Local Tests
```bash
node test-run-local.js
```

### Integration in Development Workflow
The pattern is particularly useful for:
- **Feature Development**: Testing new processing logic without API limits
- **Configuration Changes**: Validating output formatting and structure changes
- **Performance Testing**: Measuring processing speed on known datasets
- **Debugging**: Stepping through code with consistent, reproducible data

The mock pattern demonstrates how external service dependencies can be abstracted away for development purposes while maintaining full functional compatibility with production systems.