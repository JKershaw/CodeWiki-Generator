---
title: Full-page materialization for batch processing
category: component
sourceFile: lib/processor.js
related: [_history/components/full-page-materialization-for-batch-processing/2025-11-24T14-38-56.md]
created: 2025-11-24
updated: 2025-11-24
---

# [Full-Page Materialization for Batch Processing](../_history/components/full-page-materialization-for-batch-processing/2025-11-24T14-38-56.md)

## Purpose and Overview

This component implements an explicit materialization step that loads complete page objects from metadata before batch processing operations. It ensures that all required fields—including content, path, and metadata—are available to processing agents, decoupling data fetching strategy from business logic and preventing loss of critical semantic information during multi-phase operations.

## Key Functionality

The materialization pattern works in two distinct phases:

1. **Content Discovery Phase**: The `LinkDiscoveryAgent.findRelatedPages()` function analyzes the original page content to identify semantically related pages. This phase must occur *before* any link modifications are applied, as it relies on detecting bold mentions and other semantic markers within the unmodified content.

2. **Link Injection Phase**: After relationships are discovered, `DocumentationWriterAgent.addCrossLinks()` operates on the same fully-materialized `allPages` collection to inject inline hyperlinks based on discovered relationships.

3. **Persistence Phase**: Modified content and updated metadata flow through the frontmatter structure to `WikiManager.updatePage()`, which replaces lower-level `writePage()` calls and ensures both content and metadata are persisted atomically.

The key insight is that **full page content must be loaded in the correct order**—detection before modification—to avoid losing semantic information that guides relation discovery.

## Relationships

- **LinkDiscoveryAgent** depends on `allPages` containing full content to accurately detect bold mentions and semantic relationships
- **DocumentationWriterAgent** operates on the same materialized `allPages` collection after relation discovery completes
- **WikiManager.getPage()** is called iteratively during the materialization phase, which increases I/O operations but guarantees complete data availability
- Metadata updates flow through the updated frontmatter structure to `WikiManager.updatePage()`
- **Content validation** adds defensive checks to skip pages without content during cross-linking, preventing errors on incomplete pages

## Usage Example

```javascript
// Materialization typically occurs within a batch processing loop
const processor = new Processor(mockWikiManager, mockStateManager);

// First, gather page metadata
const pageMetadata = await mockWikiManager.searchPages(criteria);

// Materialize full page objects before processing
const allPages = await Promise.all(
  pageMetadata.map(meta => mockWikiManager.getPage(meta.path))
);

// Phase 1: Discover relations from original content
const relatedPages = linkDiscoveryAgent.findRelatedPages(allPages);

// Phase 2: Apply cross-links based on discoveries
documentWriterAgent.addCrossLinks(allPages, relatedPages);

// Phase 3: Persist updated pages with new metadata
for (const page of allPages) {
  if (page.content) {  // Content validation
    await mockWikiManager.updatePage(page.path, page);
  }
}
```

## Testing

The component is covered by **26 test cases** across **6 test suites** in `tests/unit/processor.test.js`:

- **Test Categories**: Processor initialization, processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository
- **Mock Coverage**: WikiManager, StateManager, and agent mocks validate the materialization and coordination patterns
- **Validation Tests**: Include checks for [content validation in batch operations](../components/content-validation-in-batch-operations.md) to ensure pages without content are skipped safely