---
title: System-level documentation generation pipeline
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# System-level Documentation Generation Pipeline

## Purpose and Overview

The documentation generation pipeline in `lib/processor.js` orchestrates the creation of comprehensive system documentation by progressing through multiple stages: detailed code analysis, wiki content organization, and finally synthesis into a cohesive architecture overview. This represents an evolution from code-centric documentation toward holistic system understanding, enabling maintainers and contributors to grasp both implementation details and architectural patterns.

## Key Functionality

The processor implements a multi-stage documentation generation workflow:

1. **Code Analysis** - Analyzes source files to extract concepts, components, and relationships
2. **Wiki Content Organization** - Retrieves and categorizes all wiki pages (concepts, components, guides) through the `generateArchitectureOverview` function
3. **Architecture Synthesis** - Delegates to `ArchitectureOverviewAgent` to synthesize categorized wiki content into a unified system architecture document
4. **Resilient Completion** - Ensures architecture overview failures are logged as warnings but don't halt the entire pipeline, allowing partial documentation generation to succeed

The `generateArchitectureOverview` function:
- Retrieves all wiki pages via `WikiManager.getAllPages()`
- Organizes pages by their category metadata
- Invokes `ArchitectureOverviewAgent` to synthesize content
- Writes output to `concepts/architecture.md`

## Relationships

- **ArchitectureOverviewAgent** follows the established multi-agent pattern alongside `DocumentationWriterAgent`, `MetaAnalysisAgent`, `WikiIndexAgent`, and `GuideGenerationAgent`
- **Sequencing** - Architecture overview generation executes before wiki guides and index generation, establishing a logical flow where system-level documentation informs more detailed guides
- **WikiManager dependency** - Relies on `WikiManager.getAllPages()` to retrieve properly categorized content
- **Non-blocking error handling** - Adopts the existing pattern used throughout the processor where failures log warnings without halting the pipeline

## Usage Example

```javascript
const Processor = require('./lib/processor');

const processor = new Processor({
  wikiManager: wikiManagerInstance,
  stateManager: stateManagerInstance
});

// Architecture overview is generated as part of the documentation pipeline
await processor.processRepository(repoPath);

// The architecture overview is written to concepts/architecture.md
// and synthesizes all categorized wiki pages into a cohesive system view
```

## Testing

The processor includes 26 test cases across 6 test suites covering:
- Core processor initialization and lifecycle
- `processCommit` handling with wiki updates
- `isSignificantFile` filtering logic
- `getRelevantContext` for documentation analysis
- `determinePagePath` for wiki structure
- `processRepository` for end-to-end workflows

Test coverage validates that architecture overview generation integrates correctly with existing agents and maintains the documented error-handling semantics of non-blocking warnings on synthesis failures.