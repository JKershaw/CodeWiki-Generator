---
title: Category-aware concept extraction
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Category-aware concept extraction

## Purpose and Overview

Category-aware concept extraction enhances the documentation generation pipeline by systematically categorizing extracted concepts into components, concepts, and guides. This enables intelligent routing of documentation to appropriate directories rather than defaulting all content to a single location.

## Key Functionality

The system processes concepts in two formats:
- **Object format**: Concepts with explicit category metadata (`{name, category, abstraction, reason}`)
- **String format**: Simple concept names that default to component categorization

### Core Operations

- **Enhanced concept processing**: `processConceptDocumentation` handles both format types while maintaining backward compatibility
- **Dynamic path routing**: `determinePagePath` directs documentation to category-specific directories:
  - Components → `/components/`
  - Concepts → `/concepts/`
  - Guides → `/guides/`
- **Categorized documentation creation**: Generates appropriately structured pages based on concept type and abstraction level

### Category Types

- **Components**: Code elements like classes, functions, modules
- **Concepts**: Abstract ideas, patterns, architectural decisions
- **Guides**: Process documentation, tutorials, best practices

## Relationships

Extends the existing Processor class architecture while preserving full backward compatibility with string-based concept extraction. Integrates seamlessly with WikiManager to create categorized page hierarchies and builds upon the established concept extraction pipeline without disrupting existing workflows.

## Usage Examples

### Object-based concept extraction
```javascript
const concepts = [
  {
    name: "Authentication middleware",
    category: "component",
    abstraction: "medium",
    reason: "Core security component handling request validation"
  },
  {
    name: "Event-driven architecture",
    category: "concept", 
    abstraction: "high",
    reason: "Architectural pattern enabling loose coupling"
  }
];
```

### Backward-compatible string format
```javascript
const concepts = ["UserService", "DatabaseConnection"];
// Automatically categorized as components
```

The system intelligently routes each concept type to its appropriate documentation section, creating organized, navigable documentation that reflects the logical structure of the codebase.