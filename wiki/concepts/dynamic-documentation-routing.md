---
title: Dynamic documentation routing
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Dynamic Documentation Routing

## Purpose and Overview

Dynamic documentation routing enables flexible organization of generated documentation by automatically directing content to appropriate directories based on concept categories. This system replaces hardcoded path logic with category-aware routing, allowing the documentation generator to scale across different types of code artifacts.

## Key Functionality

The routing system operates through two enhanced functions that work together to categorize and place documentation:

### Category-Aware Concept Processing

The `processConceptDocumentation` function handles both object and string concept formats, extracting category information to determine proper routing:

- **Object concepts**: Reads category directly from concept metadata
- **String concepts**: Defaults to "component" category for backward compatibility
- **Flexible processing**: Maintains existing documentation generation while adding categorization

### Dynamic Path Determination

The `determinePagePath` function routes documentation based on concept category:

```
components/ - for component-type concepts
concepts/ - for high-level architectural concepts  
guides/ - for procedural or instructional content
```

This replaces the previous hardcoded assumption that all concepts were components.

## Relationships

**Extends Processor Class**: Builds upon existing concept extraction pipeline while maintaining backward compatibility with current documentation generation workflows.

**Integrates with WikiManager**: Leverages the wiki management system's page creation capabilities, now with categorized directory structure.

**Supports Categorization Strategy**: Works with the broader concept extraction system that identifies and categorizes different types of code artifacts during analysis.

## Usage Examples

### Basic Category Routing
```javascript
// Concept with explicit category
const concept = {
  name: "Authentication Flow",
  category: "concept",
  // ... other properties
};
// Routes to: concepts/authentication-flow.md
```

### Backward Compatibility
```javascript
// String-based concept (legacy format)
const concept = "UserService";
// Routes to: components/userservice.md (default category)
```

The system automatically handles mixed concept formats within the same processing pipeline, ensuring smooth migration from hardcoded routing to dynamic categorization.