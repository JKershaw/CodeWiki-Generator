---
title: Mock client pattern
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Mock Client Pattern

## Purpose and Overview

The mock client pattern enables the system to analyze itself by substituting external API clients with local data sources. This pattern allows the documentation generator to process its own repository using local git commands instead of making API calls to external services.

## Key Functionality

The pattern works by replacing the GitHub API client with a mock implementation that:

- **Extracts local git history** using the `getLocalCommits` function to retrieve commit data, file changes, and patches directly from the local repository
- **Preserves existing processing logic** by maintaining the same data structure and interfaces as the original API client
- **Enables cost-free self-analysis** by eliminating external API calls when documenting the current codebase

The mock client provides identical data formats to the real GitHub client, ensuring that downstream processing components (`Processor` class, cost limiting, wiki generation) operate without modification.

## Relationships

- **Extends the Processor architecture** by providing an alternative data source while reusing existing processing and output logic
- **Integrates with local git commands** through `getLocalCommits` to access repository history without network dependencies
- **Maintains compatibility** with the same cost limiting and wiki generation systems used for external repository analysis
- **Outputs to identical structure** as the main processor, generating the same wiki directory layout and documentation format

## Usage Examples

The pattern is implemented in the self-documentation workflow:

```javascript
// Mock client substitutes GitHub API calls with local git data
const processor = new Processor({
  // ... configuration
  mockMode: true // Triggers local git integration
});

// Process using local repository data instead of API calls
await processor.processRepository();
```

This enables the system to document itself using the same logic and output format as external repository analysis, but with zero API costs and no network dependencies.