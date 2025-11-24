---
title: Two-phase cross-linking with content awareness
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Two-Phase Cross-Linking with Content Awareness

## Purpose and Overview

This processor implements a critical architectural pattern for maintaining semantic integrity during batch page processing. The two-phase approach ensures that page relationships are discovered from original content *before* any modifications are applied, preventing loss of semantic information (such as bold mentions) that are essential for accurate link detection.

## Key Functionality

The processor coordinates two distinct phases of cross-linking:

**Phase 1: Content Analysis**
- `LinkDiscoveryAgent.findRelatedPages()` analyzes the original, unmodified page content
- Scans for semantic relationships, including bold mentions and contextual clues
- Identifies pages that should be cross-linked before any content modifications occur

**Phase 2: Link Injection**
- `DocumentationWriterAgent.addCrossLinks()` operates on the same page collection
- Adds inline hyperlinks based on discovered relationships
- Modifications are applied only after relation discovery completes

**Full-Page Materialization**
- Explicit materialization step loads complete page objects (including content, path, and metadata) from metadata records
- Ensures all required fields are available for agent processing
- Includes content validation to skip pages without content during cross-linking

## Relationships

- **LinkDiscoveryAgent** depends on `allPages` containing full content to accurately detect semantic relationships
- **DocumentationWriterAgent** operates on the materialized page collection after relation discovery completes
- **WikiManager.updatePage()** persists modified content and updated metadata, replacing direct `writePage()` calls
- **WikiManager.getPage()** is called iteratively during the materialization phase
- Metadata updates flow through the updated frontmatter structure to persistence

This coordination prevents the common race condition where links are added before related pages are discovered, which would corrupt the relationship detection process.

## Usage Example

```javascript
const processor = new Processor(mockWikiManager, mockStateManager, {
  linkDiscoveryAgent: mockLinkDiscoveryAgent,
  docWriterAgent: mockDocWriterAgent
});

// Process pages with full content materialization
const allPages = await processor.getAllPages(); // Phase 0: Materialization

const relatedPages = await linkDiscoveryAgent.findRelatedPages(allPages); // Phase 1: Discovery

await docWriterAgent.addCrossLinks(allPages, relatedPages); // Phase 2: Injection

// Persist all updates
for (const page of allPages) {
  if (page.content) {
    await mockWikiManager.updatePage(page.path, page.content, page.metadata);
  }
}
```

## Testing

Test coverage is comprehensive with **26 test cases** across **6 test suites** located in `tests/unit/processor.test.js`.

Test categories include:
- Processor initialization and core functionality
- `processCommit` workflow
- `isSignificantFile` filtering
- `getRelevantContext` content retrieval
- `determinePagePath` path resolution
- `processRepository` batch operations

Mock implementations verify correct sequencing of the two phases and proper interaction between `WikiManager`, state management, and agent components.