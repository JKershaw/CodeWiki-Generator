---
title: Phase-based processing workflow
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Phase-based Processing Workflow

## Purpose and Overview

The phase-based processing workflow structures code analysis and documentation generation into distinct, sequential phases that execute based on completion status and resource constraints. This approach ensures that primary operations complete successfully while secondary operations like index generation can degrade gracefully without affecting the core workflow.

## Key Functionality

The workflow operates through multiple specialized phases:

- **Analysis Phase**: Code analysis and documentation generation via `CodeAnalysisAgent` and `DocumentationWriterAgent`
- **Meta-analysis Phase**: Higher-level insights through `MetaAnalysisAgent`
- **Index Generation Phase**: Wiki navigation structure creation via `WikiIndexAgent`

Each phase checks completion status and available resources before executing. The `generateWikiIndex` function exemplifies this pattern:

```javascript
// Conditional execution based on processing state
if (processingResult.completed && !processingResult.costLimitReached) {
  try {
    await generateWikiIndex(wikiManager, repositoryInfo);
  } catch (error) {
    // Graceful degradation - log but don't fail
    console.warn('Wiki index generation failed:', error);
  }
}
```

## Relationships

The workflow integrates multiple components through a unified agent architecture:

- **WikiManager** provides page collection and file system operations for index generation
- **Agent instances** (`wikiIndexAgent`, `codeAnalysisAgent`, etc.) handle specialized processing tasks
- **Repository context** flows through phases to maintain consistency across generated content
- **Processing state** determines which phases execute and how failures are handled

## Usage Examples

### Adding a New Processing Phase

Follow the established pattern when integrating additional phases:

```javascript
// Check prerequisites
if (processingResult.completed && resourcesAvailable()) {
  try {
    // Execute phase with proper context
    await newPhaseFunction(contextManager, additionalData);
  } catch (error) {
    // Handle gracefully based on phase criticality
    handlePhaseError(error, 'new-phase');
  }
}
```

### Configuring Phase Dependencies

Phases can be made conditional on specific completion criteria:

```javascript
// Only execute if previous phases succeeded
if (processingResult.analysisComplete && processingResult.docsGenerated) {
  await executeAdvancedPhase();
}
```

The workflow design promotes robustness by isolating phase failures and maintaining clear dependencies between processing stages.