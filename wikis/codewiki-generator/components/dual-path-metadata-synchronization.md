---
title: Dual-path metadata synchronization
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Dual-path Metadata Synchronization

## Purpose and Overview

The dual-path metadata synchronization component ensures that wiki page metadata remains consistent across different document lifecycle stages—both when pages are created and when they are updated. By routing both creation and update workflows through a shared metadata update mechanism, this system maintains a centralized, authoritative view of all documentation while reserving fields for future link tracking and discoverability features.

## Key Functionality

The `updatePageGlobalMetadata` function is the central synchronization point that handles metadata updates for wiki pages. It maintains the following metadata fields:

- **title**: The page's display name
- **category**: Classification for organizational purposes
- **created**: Timestamp of initial page creation (included only on new pages)
- **incomingLinks**: Array placeholder for future backlink tracking (initialized empty)
- **outgoingLinks**: Array placeholder for future forward link tracking (initialized empty)

The dual-path design works by:

1. **Creation Path**: When a new page is created, `updatePageGlobalMetadata` is called with a payload that includes the creation timestamp
2. **Update Path**: When an existing page is updated, the same function is called with a slightly different payload (omitting the creation timestamp to preserve the original value)

Both paths converge on the same metadata update mechanism, ensuring that:
- Metadata schema is consistent across all pages
- Future queries can reliably access page relationships
- The system is prepared for link tracking and documentation analysis features

## Relationships

The dual-path metadata synchronization integrates with:

- **WikiManager**: Provides persistent storage through `updatePageGlobalMetadata` method
- **Processor class**: Triggers metadata updates during page creation and update workflows
- **Future link analysis**: The reserved `incomingLinks` and `outgoingLinks` fields enable graph-based documentation analysis once link detection is implemented

The component ensures that page creation and update workflows don't create inconsistent metadata states, providing a foundation for interconnected documentation management.

## Usage Example

```javascript
// Within Processor class during page creation
await this.wikiManager.updatePageGlobalMetadata(pageTitle, {
  title: pageTitle,
  category: pageCategory,
  created: new Date().toISOString(),
  incomingLinks: [],
  outgoingLinks: []
});

// During page update (same function, different payload - no created timestamp)
await this.wikiManager.updatePageGlobalMetadata(pageTitle, {
  title: pageTitle,
  category: pageCategory,
  incomingLinks: [],
  outgoingLinks: []
});
```

## Testing

The component is covered by **26 test cases** across **6 test suites** in `tests/unit/processor.test.js`, including:

- Processor initialization and state management
- processCommit workflow validation
- Page path determination logic
- Context relevance filtering
- Repository processing end-to-end scenarios

The test suite validates that metadata synchronization occurs correctly in both creation and update scenarios, ensuring consistency across the document lifecycle.