---
title: Local Development Testing
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Local Development Testing

The local development testing module enables testing the CodeWiki Generator on itself using local git history instead of GitHub API calls. This allows developers to iterate and debug without external dependencies or rate limits.

## Key Functionality

The module replaces the GitHub API client with a mock that extracts equivalent data directly from the local git repository:

### Git Data Extraction

- **Commit History**: Uses `git log` to retrieve commit SHAs, messages, and timestamps
- **File Changes**: Executes `git diff --name-only` to identify modified files per commit
- **Patch Generation**: Captures full diffs via `git show` for content analysis
- **Error Handling**: Gracefully handles git command failures and empty results

### Mock Client Pattern

The module implements the same interface as the GitHub client:
- `getCommits()` - Returns locally extracted commit data
- `getFileContent()` - Reads files directly from filesystem
- `getCommitDiff()` - Provides git-generated patches

### Processing Pipeline

1. Extracts recent commits from local repository
2. Creates mock GitHub client with local data
3. Initializes processor with mocked dependencies
4. Generates wiki content to separate output directory (`generated-wiki/`)

## Relationships

- **Depends on**: `lib/processor` for core analysis logic
- **Mocks**: `githubClient` interface from main application
- **Outputs to**: `generated-wiki/` directory (separate from production `dev-wiki/`)
- **Processes**: Same repository structure and files as production workflow

## Usage

Run the local test script directly:

```bash
node test-run-local.js
```

This processes the current repository's git history and generates documentation in the `generated-wiki/` directory, allowing comparison with production output and validation of changes before deployment.

The script is particularly useful for:
- Testing configuration changes
- Debugging analysis logic
- Validating output format modifications
- Development without GitHub API rate limits