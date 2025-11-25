---
title: Category-based wiki content organization
category: concept
sourceFile: lib/processor.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Category-based Wiki Content Organization

## Purpose and [Overview](../meta/overview.md)

The category-based wiki content organization system provides structured documentation management by classifying and filtering wiki pages based on metadata categories such as "component" and "concept". This organizational pattern enables the multi-agent documentation system to generate different types of targeted output and maintain coherent documentation structure across the codebase.

## Key Functionality

The system organizes wiki content through several key mechanisms:

- **Metadata-driven categorization**: Pages are classified with category metadata that determines their organizational structure and purpose
- **Content filtering**: Wiki pages can be filtered by category to create specialized documentation views (guides, indexes, component lists)
- **Multi-agent integration**: Different documentation agents use category information to determine how to process and present content
- **Structured output generation**: Categories enable the system to generate appropriate documentation types based on content classification rather than file location

The organization supports two primary categories:
- **Component**: Concrete code elements, classes, modules, and functional units
- **Concept**: Abstract patterns, architectural decisions, and system-wide design principles

## Relationships

This organizational system integrates with several key components:

- **WikiManager**: Manages page creation, updates, and metadata assignment using category information
- **GuideGenerationAgent**: Uses category filtering to synthesize component and concept documentation into operational guides
- **WikiIndexAgent**: Leverages categories to create structured navigation and content discovery
- **DocumentationWriterAgent**: Applies appropriate category metadata when generating new wiki pages
- **MetaAnalysisAgent**: Analyzes content relationships across categories for comprehensive documentation

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with wiki manager and agents
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent
});

// Wiki manager filters content by category
mockWikiManager.searchPages = jest.fn().mockResolvedValue([
  { title: 'Authentication Service', category: 'component' },
  { title: 'Multi-agent Architecture', category: 'concept' }
]);

// Process repository with category-aware organization
await processor.processRepository('/path/to/repo');
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Tests cover processor initialization, commit processing, file significance detection, context retrieval, page path determination, and repository-level processing
- Includes comprehensive mocking of WikiManager and agent dependencies to verify category-based organization workflows