---
title: Local Development Testing
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Local Development Testing

## Purpose and Overview

The Local Development Testing system enables developers to test the CodeWiki Generator on itself using local git history instead of the GitHub API. This eliminates API rate limits and costs during development while providing a realistic test environment using the actual codebase.

## Key Functionality

The system works by substituting the GitHub API client with a mock implementation that sources data from local git commands:

- **Local Git Integration**: Uses `git log` and `git show` commands to extract commit history and file changes
- **API Mocking**: Replaces the `githubClient.getCommits()` interface with local git data
- **Isolated Output**: Generates documentation in `generated-wiki/` to avoid conflicts with the development wiki
- **Self-Testing**: Runs the complete processing pipeline on the codebase itself

### Core Components

- `getLocalCommits()`: Executes git commands to retrieve commit data and transforms it into the expected GitHub API format
- `main()`: Orchestrates the test by configuring the Processor with mocked dependencies and local repository settings

## Relationships

The local testing system integrates with several core components:

- **Processor Class**: Uses the main `lib/processor` without modification by implementing its expected interface
- **GitHub Client Interface**: Mocks the `getCommits()` method to provide local data instead of API responses
- **File System**: Reads from the current repository and writes output to isolated directories
- **Node.js Child Process**: Executes git commands via `execSync` for data extraction

## Usage Examples

Run the local test script directly:

```bash
node test-run-local.js
```

The script automatically:
1. Detects the current repository path
2. Extracts recent commit history using git
3. Processes the commits through the standard pipeline
4. Outputs generated documentation to `generated-wiki/`

This approach allows developers to validate changes, test new features, and debug the system without external dependencies or API costs.