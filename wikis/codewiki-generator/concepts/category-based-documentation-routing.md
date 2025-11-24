---
title: Category-based documentation routing
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Category-based Documentation Routing

## Purpose and Overview

The category-based documentation routing system intelligently routes documentation concepts to different wiki directories (components, concepts, guides) based on explicit category metadata. Rather than storing all concepts in a single location, this system enables a flexible, scalable documentation structure that accommodates different types of knowledge artifacts and improves discoverability through logical organization.

## Key Functionality

**Category-Driven Routing**

The system determines documentation location based on a concept's category field:
- `component` → stored in the components directory
- `concept` → stored in the concepts directory  
- `guide` → stored in the guides directory

**Backward Compatibility**

The routing functions accept both legacy string-based concept names and new object-based formats with category metadata. This allows gradual migration of callers without breaking existing code.

**Path Resolution**

The `determinePagePath()` function maps concept categories to their appropriate wiki directories and generates the target page path. This centralized logic ensures consistent routing decisions across the system.

## Relationships

- **`processConceptDocumentation()`** — Accepts concept objects with category metadata and orchestrates documentation processing
- **`determinePagePath()`** — Called by `processConceptDocumentation()` to compute the target wiki page location based on category
- **`wikiManager`** — Receives computed paths and persists categorized documentation via `getPage()` and `upsertPage()` operations
- **Concept category field** — Drives all routing decisions throughout the documentation workflow

## Usage Example

```javascript
const processor = new Processor(mockWikiManager, mockStateManager);

// Process concept with category metadata (new format)
const conceptWithCategory = {
  name: 'API Authentication',
  category: 'guide'
};

processor.processConceptDocumentation(conceptWithCategory);
// Routes to: guides/API Authentication

// Legacy string format still supported (routes to default location)
processor.processConceptDocumentation('Legacy Concept Name');
```

## Testing

Test coverage for this component is comprehensive:

- **26 test cases** across **6 test suites** in `tests/unit/processor.test.js`
- Dedicated test suite: **determinePagePath** — validates category-to-directory mapping and backward compatibility
- Integration testing with mock `wikiManager` ensures routing paths are correctly passed to persistence operations
- Test coverage includes both object-based and string-based concept parameter formats