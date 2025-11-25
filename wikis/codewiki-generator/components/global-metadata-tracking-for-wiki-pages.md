---
title: Global metadata tracking for wiki pages
category: component
sourceFile: lib/processor.js
related: [meta/overview.md, components/global-metadata-tracking-system.md]
created: 2025-11-25
updated: 2025-11-25
---

# Global Metadata Tracking for Wiki Pages

## Purpose and Overview

The global metadata tracking system provides centralized management of wiki page metadata within the processor component. It maintains a unified registry of page properties including titles, categories, creation dates, and link relationships to enable cross-referencing capabilities and support future analytics features.

## Key Functionality

- **Centralized Metadata Registry**: Maintains comprehensive page metadata (title, category, created date, incoming/outgoing links) through the WikiManager's `updatePageGlobalMetadata()` method
- **Lifecycle Event Synchronization**: Automatically triggers metadata updates at critical page lifecycle points (creation and modification) to ensure consistency between page content and global metadata
- **Decoupled Architecture**: Separates metadata management from individual page files, creating a single source of truth for page state information
- **Link Relationship Tracking**: Records incoming and outgoing page links to support future link analysis and page discovery features
- **Audit Trail Foundation**: Establishes patterns for versioning and change tracking through systematic metadata capture

The system operates by intercepting page lifecycle events and maintaining synchronization between page operations and the global metadata index, ensuring the central registry accurately reflects the current state of all wiki pages.

## Relationships

- **WikiManager**: Primary integration point that handles both page operations (`createPage()`, `updatePage()`) and metadata synchronization (`updatePageGlobalMetadata()`)
- **Processor**: Orchestrates the dual-phase lifecycle by coordinating page operations with metadata updates during commit processing and repository analysis
- **Page Discovery System**: Provides foundational data structure for future features like link analysis, related page suggestions, and wiki analytics
- **State Management**: Works alongside the state management system to maintain consistent page metadata across application sessions

## Usage Example

```javascript
// Processor setup with WikiManager integration
const mockWikiManager = {
  getPage: jest.fn(),
  createPage: jest.fn(),
  updatePage: jest.fn(),
  searchPages: jest.fn(),
  getRelatedPages: jest.fn(),
  updatePageGlobalMetadata: jest.fn()
};

// The processor automatically handles metadata tracking
// After page creation or update, metadata synchronization occurs
processor.processCommit(commitData); // Triggers page operations + metadata updates
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Comprehensive testing of processor functionality including metadata tracking workflows
- Test categories: Processor initialization, commit processing, file significance detection, context retrieval, page path determination, and repository processing
- Validates metadata synchronization through mock WikiManager interactions