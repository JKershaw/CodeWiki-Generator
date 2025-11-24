---
title: Graceful Error Handling in Post-Processing
category: guide
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Graceful Error Handling in Post-Processing

## Purpose and Overview

Graceful error handling in post-processing ensures that optional pipeline stages (like wiki index generation) fail without interrupting the main documentation workflow. This pattern maintains system robustness when new agents are added to the multi-agent pipeline, allowing non-critical features to degrade gracefully while preserving core functionality.

## Key Functionality

The post-processing error handling pattern operates through the following mechanisms:

- **Conditional Execution**: Optional post-processing steps are only invoked after successful main pipeline completion, preventing cascading failures
- **Isolated Error Boundaries**: Each post-processing agent runs in its own error context, capturing failures without propagating them upstream
- **Cost-Aware Gating**: Post-processing respects global cost limits—if processing halted due to `cost_limit`, optional stages are skipped entirely
- **Silent Degradation**: Failures in optional agents log warnings but don't terminate the processor, allowing partial results to be saved

The `generateWikiIndex` function exemplifies this pattern. It orchestrates wiki index generation by:

1. Collecting all processed wiki pages via `wikiManager.getAllPages()`
2. Preparing structured data with page metadata (title, category fields)
3. Invoking WikiIndexAgent to generate navigational index
4. Writing results to `index.md`

If any step fails, the processor continues to calculate final cost summaries and returns successfully, treating the index as a value-add rather than a requirement.

## Relationships

This pattern integrates into the broader multi-agent pipeline architecture:

- **Agent Integration**: WikiIndexAgent joins CodeAnalysisAgent, DocumentationWriterAgent, and MetaAnalysisAgent as a post-processing phase
- **Pipeline Sequencing**: `generateWikiIndex` executes conditionally after successful processing but before cost summary calculation
- **State Dependencies**: Relies on WikiManager to provide page data and metadata populated by earlier pipeline stages
- **Cost Coordination**: Respects processor-level cost boundaries, automatically skipping when resource constraints are exceeded

## Usage Example

```javascript
// Within the processor's main execution flow
if (shouldGenerateIndex && !costLimitExceeded) {
  try {
    await generateWikiIndex(wikiManager, metaData);
  } catch (error) {
    logger.warn('Wiki index generation failed:', error.message);
    // Continue processing - index generation is optional
  }
}

// Processor completes successfully regardless of index generation outcome
return processingResults;
```

The calling code does not need to handle index generation failures explicitly—the processor encapsulates error handling internally, maintaining separation of concerns between optional post-processing and core pipeline logic.

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Coverage includes: Processor initialization, commit processing, file significance detection, context retrieval, page path determination, and repository processing

Core test categories validate both successful and failure paths in the multi-agent pipeline, ensuring that post-processing stages handle errors appropriately without affecting primary documentation generation.