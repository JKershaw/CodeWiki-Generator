---
title: Local git history extraction for documentation
category: component
sourceFile: generate-self-wiki.js
related: [_history/components/local-git-history-extraction-for-documentation/2025-11-24T14-38-56.md]
created: 2025-11-24
updated: 2025-11-24
---

# [Local Git History Extraction for Documentation](../_history/components/local-git-history-extraction-for-documentation/2025-11-24T14-38-56.md)

## Purpose and Overview

This component enables automatic wiki documentation generation by extracting commit history and file changes directly from the local git repository, eliminating the need for GitHub API calls. It implements a [self-documenting repository pattern](../concepts/self-documenting-repository-pattern.md) where code changes automatically flow into updated documentation as part of the development workflow.

## Key Functionality

The component provides the following capabilities:

- **Local commit extraction**: Retrieves recent commits from the git repository using CLI commands, including file changes and unified diffs
- **Cost-controlled generation**: Implements configurable API cost limits (default $1.00 max) and meta-analysis frequency to prevent excessive expenses during documentation generation
- **GitHub client mocking**: Injects local commit data into the existing `Processor` workflow by mocking the GitHub client interface, reusing established documentation generation logic
- **Wiki output**: Generates documentation to the `./wiki/` directory for version control inclusion

The `getLocalCommits()` function serves as the primary data extraction point, querying the git repository for commit information that would otherwise require GitHub API access. The `main()` function orchestrates the entire wiki generation pipeline, bridging local git history with the core `Processor` class.

## Relationships

This component integrates with the following parts of the codebase:

- **Processor class** (`./lib/processor`): Provides core wiki generation logic that this component leverages
- **Git CLI**: Accesses repository history via `execSync` without requiring GitHub authentication
- **Wiki output directory** (`./wiki/`): Version-controlled storage for generated documentation
- **GitHub client interface**: Mocked to inject local commit data into the Processor's existing workflow

## Usage Example

```javascript
const { main } = require('./generate-self-wiki');

// Run the wiki generation process
// Extracts commits from local repository and generates documentation
main();
```

The script can be executed as part of your repository maintenance workflow:

```bash
node generate-self-wiki.js
```

Configure cost limits by modifying the `maxCost` parameter in the script to balance documentation quality with API expenses. Adjust `metaAnalysisFrequency` to control how frequently the system analyzes commits for documentation updates.

## Testing

No automated tests are currently available for this component. Consider contributing tests that verify:
- Correct extraction of commit history from the local repository
- Proper formatting of diffs and file changes
- Accurate cost calculation and limit enforcement
- Successful wiki file generation