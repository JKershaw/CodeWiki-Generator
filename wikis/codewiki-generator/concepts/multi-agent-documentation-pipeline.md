---
title: Multi-Agent Documentation Pipeline
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Multi-Agent Documentation Pipeline

## Purpose and Overview

The Multi-Agent Documentation Pipeline is an extensible, phase-based architecture that orchestrates specialized agents to automatically generate, analyze, and organize documentation from source code. Each agent handles a distinct responsibility—code analysis, documentation writing, metadata enrichment, and wiki navigation—allowing the system to scale with new processing phases while maintaining clean separation of concerns.

## Key Functionality

### Pipeline Architecture

The processor implements a multi-stage pipeline where specialized agents process documentation sequentially:

- **CodeAnalysisAgent**: Examines source files to extract structural information and concepts
- **DocumentationWriterAgent**: Generates markdown documentation based on analysis results
- **MetaAnalysisAgent**: Enriches documentation with metadata and categorization
- **WikiIndexAgent**: Automatically generates navigational index pages from processed documentation

### Wiki Index Generation

The `generateWikiIndex()` function orchestrates index page creation by:

1. Collecting all processed wiki pages via `wikiManager.getAllPages()`
2. Preparing structured data with page metadata (title, category, abstractions)
3. Invoking WikiIndexAgent to generate index content
4. Writing the generated index to `index.md`
5. Handling errors gracefully without interrupting the main pipeline

### Cost-Aware Processing

Index generation respects cost control boundaries—it is conditionally skipped if the processing pipeline stopped due to cost limit constraints, ensuring optional post-processing features don't override system resource controls.

## Relationships

The Multi-Agent Documentation Pipeline integrates four specialized agents into a cohesive workflow:

- **WikiIndexAgent** extends the existing agent ecosystem alongside CodeAnalysis, DocumentationWriter, and MetaAnalysis agents
- **generateWikiIndex()** is conditionally invoked after successful processing completion, before final cost summary calculation
- **WikiIndexAgent** depends on `wikiManager.getAllPages()` to retrieve all processed documentation pages
- **Cost boundaries** prevent index generation when overall processing has been constrained by cost limits

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with wiki and state managers
const processor = new Processor(wikiManager, stateManager);

// Process repository - automatically generates documentation and index
await processor.processRepository(repositoryPath, options);

// Index generation occurs automatically as part of the pipeline
// if cost limits weren't exceeded during processing
```

The wiki index is generated automatically during the `processRepository()` workflow. The `generateWikiIndex()` method is invoked internally after all agents have processed the codebase, creating an organized `index.md` file that aggregates and categorizes all generated documentation pages.

## Testing

**Test Coverage**: 26 test cases across 6 test suites in `tests/unit/processor.test.js`

Test categories include:
- Processor initialization and lifecycle
- Commit processing workflow
- File significance determination
- Context retrieval and relevance
- Page path determination
- Repository-level processing

The test suite validates:
- Graceful error handling during optional post-processing phases
- Cost limit enforcement on index generation
- Integration of WikiIndexAgent into the overall pipeline
- State management and wiki page persistence