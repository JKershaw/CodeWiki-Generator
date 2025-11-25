---
title: Category-based Documentation Organization
category: concept
sourceFile: lib/processor.js
related: [meta/overview.md, components/architecture-overview-agent.md]
created: 2025-11-25
updated: 2025-11-25
---

# Category-based Documentation Organization

## Purpose and [Overview](../meta/overview.md)

Category-based Documentation Organization provides a systematic approach to organizing wiki pages using metadata categories (concepts, components, guides), enabling semantic grouping and hierarchical documentation management. This pattern supports the architecture [overview](../meta/overview.md) agent in synthesizing system-level documentation from categorized content across multiple document types.

## Key Functionality

- **Metadata Categorization**: Automatically classifies documentation into semantic categories during the generation process
- **Two-phase Pipeline**: Implements a two-phase approach where content documentation is generated first from code analysis, followed by meta-documentation synthesis (architecture overviews, guides, indexes)
- **Architecture Overview Generation**: Integrates the [ArchitectureOverviewAgent](../components/architecture-overview-agent.md) to create system-level documentation by synthesizing categorized wiki pages
- **Graceful Degradation**: Handles errors in optional documentation steps without failing the entire process, ensuring partial success doesn't block subsequent generation steps

The system processes files through significance filtering, generates categorized documentation, and then synthesizes higher-level architectural insights in a separate phase to avoid being blocked by cost limits or individual failures.

## Relationships

- **Integrates with**: WikiManager for page storage and retrieval, StateManager for process state tracking
- **Coordinates**: Multiple agent types (DocumentationWriterAgent, MetaAnalysisAgent, [ArchitectureOverviewAgent](../components/architecture-overview-agent.md)) in the processing pipeline
- **Supports**: Architecture [overview](../meta/overview.md) generation through categorized content synthesis
- **Extends**: Existing agent pattern established in the codebase for consistent integration

## Usage Example

```javascript
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// Process repository with category-based organization
await processor.processRepository('/path/to/repo');

// Access categorized documentation
const concepts = await mockWikiManager.searchPages({ category: 'concept' });
const components = await mockWikiManager.searchPages({ category: 'component' });
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Tests cover core processor functionality including processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository methods
- Validates integration with WikiManager, StateManager, and various agent components