---
title: Metadata synchronization on page lifecycle events
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Metadata Synchronization on Page Lifecycle Events

## Purpose and Overview

The metadata synchronization system ensures that centralized metadata about wiki pages stays in sync with actual page content throughout the page lifecycle. This system triggers metadata updates automatically at key lifecycle points (page creation and update), maintaining a single source of truth about page state and supporting features like link tracking, analytics, and audit trails.

## Key Functionality

The system operates through the Processor component which:

- **Triggers synchronized updates** at critical lifecycle events when pages are created or modified
- **Maintains centralized metadata** including page title, category, created date, and incoming/outgoing links
- **Establishes consistency patterns** where metadata updates happen automatically without manual intervention
- **Decouples metadata management** from individual page files, enabling centralized tracking and analysis
- **Supports audit trails** by maintaining historical metadata state through versioning

The synchronization occurs through `WikiManager.updatePageGlobalMetadata()` calls that are consistently triggered during page processing workflows.

## Relationships

This concept depends on and connects to:

- **WikiManager** - Provides the `updatePageGlobalMetadata()` method that performs the actual metadata updates
- **Processor** - Acts as the orchestrator that triggers metadata synchronization during page processing
- **Global metadata tracking component** - Stores and manages the centralized metadata that gets synchronized
- **Page lifecycle events** - Creation and update events serve as the triggers for synchronization

## Usage Example

```javascript
// Mock setup showing the metadata synchronization pattern
const mockWikiManager = {
  getPage: jest.fn(),
  createPage: jest.fn(),
  updatePage: jest.fn(),
  searchPages: jest.fn(),
  getRelatedPages: jest.fn(),
  updatePageGlobalMetadata: jest.fn()  // Key method for metadata sync
};

// The Processor automatically calls updatePageGlobalMetadata
// during page lifecycle events - no manual synchronization needed
const processor = new Processor({
  wikiManager: mockWikiManager,
  // other dependencies...
});
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Test categories include: Processor, processCommit, isSignificantFile, getRelevantContext, determinePagePath, processRepository
- Validates that metadata synchronization occurs properly during page processing workflows