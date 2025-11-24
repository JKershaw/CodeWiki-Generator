---
title: Self-documenting repository pattern
category: concept
sourceFile: generate-self-wiki.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Self-Documenting Repository Pattern

## Purpose and Overview

`generate-self-wiki.js` implements a self-documenting repository pattern that automatically generates wiki documentation from local git history without requiring external API calls. This approach enables continuous, cost-controlled documentation that stays synchronized with code changes as the repository evolves.

## Key Functionality

The script extracts documentation data directly from the local git repository and feeds it into the core wiki generation pipeline:

- **Local Git History Extraction**: Retrieves recent commits, file changes, and diffs from the local git repository using git CLI, eliminating dependency on GitHub API calls
- **Data Source Injection**: Mocks the GitHub client interface to inject local commit data into the existing `Processor` class workflow, reusing established documentation generation logic
- **Cost-Controlled Generation**: Implements configurable cost limits (default $1.00 maximum) and meta-analysis frequency controls to prevent runaway API usage during documentation processing
- **Wiki Output**: Generates documentation files to the `./wiki/` directory for version control inclusion

The workflow operates as follows:
1. `getLocalCommits()` extracts commit history with file-level changes and patch details
2. `main()` orchestrates the Processor class with mocked GitHub client data
3. Documentation is written to `./wiki/` with cost constraints enforced throughout

## Relationships

- **Depends on** `Processor` class (`./lib/processor`) for core wiki generation logic
- **Uses** git CLI via `execSync` to access repository history directly
- **Outputs to** `./wiki/` directory for inclusion in version control
- **Integrates with** existing Processor interface by mocking the GitHub client, allowing local data to flow through established documentation pipelines

## Usage Example

```javascript
const { main } = require('./generate-self-wiki');

// Run the self-documentation generation process
main().catch(error => {
  console.error('Wiki generation failed:', error);
  process.exit(1);
});
```

This command extracts recent commits from the local repository and generates documentation files to `./wiki/` with automatic cost management.

## Testing

No automated tests are currently available for this component. Testing should verify:
- Correct extraction of commits and file changes from git history
- Proper cost limit enforcement during processing
- Successful wiki file generation in the output directory
- Mock GitHub client interface integration with Processor class