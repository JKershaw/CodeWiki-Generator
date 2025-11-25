---
title: Category-based Documentation Organization
category: concept
sourceFile: lib/processor.js
related: [meta/overview.md, components/architecture-overview-agent.md]
created: 2025-11-25
updated: 2025-11-25
---

# Category-based Documentation Organization

## Purpose and Overview

Category-based Documentation Organization is an architectural pattern that filters and routes wiki pages by metadata categories (concepts, components, guides) to generate specialized documentation outputs. This systematic approach enables content aggregation and synthesis across different documentation types, supporting automated architecture overview generation and structured knowledge management.

## Key Functionality

- **Metadata-driven Content Routing**: Automatically filters wiki pages based on category metadata to create specialized content streams for different documentation purposes
- **Multi-agent Integration**: Works seamlessly with the existing agent-based architecture, including DocumentationWriterAgent, GuideGenerationAgent, and the new ArchitectureOverviewAgent
- **Systematic Content Aggregation**: Enables synthesis of categorized content into unified documentation outputs like architecture overviews
- **Specialized Documentation Generation**: Supports generation of different documentation types by providing organized, category-specific content collections
- **Extensible Category System**: Supports flexible categorization schemes that can be extended for new documentation types and organizational needs

## Relationships

- **Integrates with**: ArchitectureOverviewAgent for generating system-level documentation from categorized content
- **Extends**: Multi-agent documentation pipeline established in the processor architecture
- **Coordinates with**: WikiManager for accessing and organizing categorized page data
- **Supports**: DocumentationWriterAgent and GuideGenerationAgent by providing structured content inputs
- **Enables**: Higher-level documentation synthesis through systematic content organization and routing

## Usage Example

```javascript
const Processor = require('./lib/processor');

const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent
});

// Process repository with category-based organization
await processor.processRepository(repositoryPath, options);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive testing of processor functionality including content routing and agent coordination
- Test categories cover core processor methods: processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository