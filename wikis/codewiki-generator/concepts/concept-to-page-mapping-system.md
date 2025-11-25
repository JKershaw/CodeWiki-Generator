---
title: Concept-to-page mapping system
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Concept-to-page mapping system

## Purpose and Overview

The concept-to-page mapping system converts identified code concepts into structured wiki documentation pages using standardized naming conventions and organizational patterns. It transforms code analysis results into a consistent wiki structure through kebab-case naming and category-based organization.

## Key Functionality

The mapping system operates through several key mechanisms:

- **Naming Convention Transform**: Converts concept names to kebab-case format for URL-friendly page names
- **Category-based Organization**: Routes different concept types (components, concepts, etc.) to appropriate wiki directories
- **Path Generation**: Creates structured page paths following the pattern `{category}/{kebab-case-name}`
- **Wiki Integration**: Coordinates with wiki management to create and update pages based on mapping rules

The system ensures that code concepts maintain consistent representation in the wiki regardless of their source file location or naming style in the codebase.

## Relationships

This system integrates closely with several other components:

- **Processor orchestration class**: Uses the mapping system to determine where documentation should be created or updated
- **Wiki management**: Receives mapped page paths to perform actual page operations
- **Code analysis agents**: Provide the raw concepts that need to be mapped to wiki pages
- **Documentation writer agents**: Consume the mapped page structure to generate appropriate content

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with required dependencies
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// The mapping system works internally when processing concepts
const pagePath = processor.determinePagePath(conceptName, conceptType);
// Results in paths like: "components/processor-orchestration-class"
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Covers core mapping functionality through `determinePagePath` tests
- Validates integration with processor workflow and wiki operations
- Tests concept processing and page path generation scenarios