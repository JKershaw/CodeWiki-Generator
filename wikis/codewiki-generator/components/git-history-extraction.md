---
title: Git History Extraction
category: component
sourceFile: test-run-local.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Git History Extraction

## Purpose and Overview

`test-run-local.js` enables self-referential testing of the CodeWiki Processor by extracting commit history directly from the local git repository instead of relying on external GitHub API calls. This approach validates the processor's core functionality against real-world commit data without network dependencies, API rate limits, or external repository access.

## Key Functionality

### Local Commit Extraction
The `getLocalCommits()` function retrieves detailed commit metadata from the git history, including:
- Commit SHAs and messages
- List of modified, added, and deleted files
- Unified diff patches for each file change
- Special handling for edge cases (first commits, deletions, binary files)

### Mock GitHub Client Injection
Rather than calling the real GitHub API, the test harness injects a mock client into the Processor that returns locally-extracted commit data. This decouples testing from external services while maintaining API compatibility.

### Orchestrated Test Execution
The `main()` function coordinates the complete workflow:
1. Initializes the Processor with configured cost limits
2. Injects the mock GitHub client with local commits
3. Executes processor logic on the extracted history
4. Displays processing results and resource consumption statistics

### Isolated Output
Generated wiki artifacts are written to `generated-wiki/` rather than `dev-wiki/`, preserving development documentation while allowing test iterations.

## Relationships

- **Processor Class**: Depends on the core Processor for processing logic; injects local data via the GitHub client interface
- **GitHub API Bypass**: Replaces live GitHub API calls with local git data, enabling testing without network constraints
- **Integration Testing Pattern**: Demonstrates a reusable approach for validating the processor's workflow on real repository data
- **Cost Validation**: Helps validate processor statistics and cost limit controls before running against external repositories

## Usage Example

```javascript
const { main } = require('./test-run-local.js');

// Run the local test
// Extracts commits from current repository, processes them with the Processor,
// and outputs results to generated-wiki/ directory
main();
```

The script executes as a standalone Node.js process:

```bash
node test-run-local.js
```

Output includes processing results, file statistics, and resource consumption metrics for the extracted commits.

## Testing

No automated tests are currently available for this module. However, the file itself functions as an integration test for the Processor, validating its behavior against local git history.