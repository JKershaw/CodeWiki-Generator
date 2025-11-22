---
title: Git Integration Layer
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Git Integration Layer

The Git Integration Layer provides direct access to local git repository data, enabling the CodeWiki Generator to process commit history and file changes without relying on the GitHub API. This component primarily serves local development and testing scenarios where API costs or access limitations make GitHub integration impractical.

## Key Functionality

### Local Git Data Extraction

The `getLocalCommits` function executes git commands to retrieve:
- Commit history with author, date, and message information
- File change lists for each commit (added, modified, deleted files)
- Full file contents at specific commit points

```javascript
// Extracts commits using git log and processes file changes
const commits = getLocalCommits(repoPath, maxCommits);
```

### GitHub API Substitution

The layer implements a mock GitHub client interface that substitutes local git data for GitHub API responses:
- Replaces `github.getCommits()` with local git log output
- Substitutes `github.getFileContent()` with local file system reads
- Maintains the same data structure expected by the Processor class

### Standalone Test Execution

The `test-run-local.js` module orchestrates complete test runs by:
1. Configuring the Processor with mocked GitHub client
2. Processing local repository data through the standard analysis pipeline
3. Outputting results to `generated-wiki/` directory to avoid conflicts

## Relationships

**Processor Integration**: Implements the same interface expected by the Processor class, allowing seamless substitution of data sources without modifying core analysis logic.

**Git Command Interface**: Uses Node.js `child_process.execSync` to execute git commands directly, parsing output into structured data formats.

**File System Access**: Reads local files directly instead of fetching content through GitHub API, providing immediate access to current working directory state.

## Usage Examples

### Running Local Tests

```bash
node test-run-local.js
```

This processes the current repository's git history and generates documentation in the `generated-wiki/` directory.

### Development Workflow

1. Make code changes to the CodeWiki Generator
2. Run local test to verify changes work correctly
3. Review generated output in `generated-wiki/`
4. Iterate without API costs or rate limits

The Git Integration Layer enables rapid development iteration by providing immediate feedback on changes without external dependencies.