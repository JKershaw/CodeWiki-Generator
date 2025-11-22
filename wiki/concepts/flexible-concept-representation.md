---
title: Flexible concept representation
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Flexible Concept Representation

## Purpose and Overview

The flexible concept representation system allows concepts to be defined as either simple strings (legacy format) or rich objects containing metadata and categorization information. This enables backward compatibility while supporting enhanced documentation organization through category-aware routing.

## Key Functionality

### Dual Format Support

The system accepts concepts in two formats:

- **String format** (legacy): `"Authentication service"`
- **Object format** (enhanced):
  ```javascript
  {
    name: "Authentication service",
    category: "component",
    abstraction: "medium",
    reason: "Handles user authentication across the application"
  }
  ```

### Category-Aware Routing

When processing concept documentation, the system routes content to appropriate directories based on the concept's category:

- `category: "concept"` → `/concepts/` directory
- `category: "component"` → `/components/` directory  
- `category: "guide"` → `/guides/` directory

String-based concepts default to the `/components/` directory for backward compatibility.

### Enhanced Processing

The `processConceptDocumentation` function automatically detects the concept format and extracts the appropriate name and category information for routing decisions. The `determinePagePath` function then maps categories to their corresponding documentation directories.

## Relationships

- **Extends** the existing documentation processing pipeline with categorization capabilities
- **Integrates** with WikiManager for organized page creation across multiple directories
- **Maintains compatibility** with existing string-based concept identification throughout the codebase

## Usage Examples

### Object-based concept definition:
```javascript
const concept = {
  name: "User session management",
  category: "component", 
  abstraction: "high",
  reason: "Manages user authentication state and session lifecycle"
};
```

### Processing maintains compatibility:
```javascript
// Both formats work seamlessly
processConceptDocumentation("Simple concept");
processConceptDocumentation({
  name: "Complex concept",
  category: "guide"
});
```

The system automatically handles format detection and routes documentation to the appropriate location based on category metadata.