---
title: Self-documentation through local git history
category: concept
sourceFile: generate-self-wiki.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Self-documentation through local git history

## Purpose and Overview

This component enables the wiki system to document itself by processing its own git repository history locally. It provides a bootstrap mechanism for automated documentation generation by extracting commit data, file changes, and patches directly from the local git repository without requiring external API access.

## Key Functionality

- **Local Git Data Extraction**: Processes git commits, file changes, and patches using shell commands to access local repository data
- **Offline Processing**: Operates independently of GitHub API by substituting local git history data for remote API responses  
- **Cost-Bounded Generation**: Implements budget constraints (demonstrated with $1 limit) to control documentation generation costs
- **Mock Client Pattern**: Provides a testable implementation that decouples the documentation processor from external dependencies
- **Self-Referential Documentation**: Enables the tool to analyze and document its own codebase as a working example

## Relationships

This component works as a standalone alternative to GitHub API-based documentation generation. It integrates with the broader wiki system by providing the same data structure as external API clients but sourced from local git commands. The mock client pattern established here can be used for testing other components that typically depend on external APIs.

## Usage Example

```javascript
// Run self-documentation generation
node generate-self-wiki.js

// The script processes local git history with budget constraints
// and generates documentation for the current repository
```

## Testing

No automated tests found. The component serves as both a functional tool and a demonstration of self-documenting capabilities through processing its own repository.