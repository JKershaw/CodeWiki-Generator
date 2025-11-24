---
title: Mock GitHub Client Pattern
category: component
sourceFile: test-run-local.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Mock GitHub Client Pattern

## Purpose and Overview

The Mock GitHub Client Pattern enables testing of the Processor against real git history without requiring external GitHub API calls, rate limits, or network dependencies. This pattern allows the system to validate itself on its own repository's actual commit data, establishing a self-referential testing approach that provides confidence in the processor's functionality using real-world data.

## Key Functionality

The pattern implements two core functions:

**getLocalCommits()** - Extracts commit metadata directly from the local git repository using `execSync`. For each commit, it retrieves:
- Commit SHA and message
- List of modified, added, and deleted files
- Full patch/diff content for each change
- Handles edge cases like first commits and deleted files

**main()** - Orchestrates the test execution by:
1. Initializing the Processor instance
2. Injecting a mock GitHub client that returns locally-sourced commit data instead of API calls
3. Executing the processor's standard workflow on local commits
4. Outputting results to `generated-wiki/` directory (preserving `dev-wiki/` from test artifacts)
5. Displaying processing results and statistics for validation

## Relationships

- **Depends on**: Processor class for core processing logic
- **Decouples**: GitHub API client by substituting real API calls with local data
- **Enables**: Integration testing patterns applicable to the processor's standard workflow
- **Outputs to**: Separate `generated-wiki/` directory to maintain clean separation from development artifacts

## Usage Example

```javascript
const { Processor } = require('./processor');
const { getLocalCommits, main } = require('./test-run-local');

// Execute the test run, which:
// 1. Extracts commits from local git history
// 2. Creates a mock GitHub client with that data
// 3. Runs the Processor against local commits
// 4. Outputs results to generated-wiki/
main().catch(error => console.error('Test run failed:', error));
```

To run the test locally:

```bash
node test-run-local.js
```

This executes the processor on your repository's actual commit history, generating a wiki in `generated-wiki/` without making any external API requests.

## Testing

No automated test suite is currently configured for this component. The file itself functions as an integration test by running the Processor against real repository data. To validate the mock client pattern:

1. Run `node test-run-local.js` on the codebase
2. Verify output appears in `generated-wiki/`
3. Check processor statistics and cost metrics displayed in console output
4. Inspect generated wiki content for accuracy against actual git history