---
title: Category-aware routing system
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Category-aware Routing System

## Purpose and Overview

The category-aware routing system organizes documentation by automatically directing content to appropriate directories based on concept categories. This enables structured knowledge management across different types of content (concepts, components, guides) while maintaining backward compatibility with existing string-based concept definitions.

## Key Functionality

### Enhanced Concept Processing

The system extends `processConceptDocumentation` to handle both legacy string formats and new object-based concept definitions:

```javascript
// Legacy string format (still supported)
concepts: ["routing system", "documentation"]

// New object format with categorization
concepts: [
  {
    name: "routing system",
    category: "concept",
    abstraction: "medium"
  }
]
```

### Intelligent Path Determination

The `determinePagePath` function routes documentation based on concept categories:

- **concept** → `concepts/` directory
- **component** → `components/` directory  
- **guide** → `guides/` directory
- **default** → `components/` directory (for backward compatibility)

This replaces the previous behavior of defaulting all content to the `components/` directory.

### Flexible Representation

The system supports mixed formats within the same concept array, allowing gradual migration from string-based to object-based definitions without breaking existing functionality.

## Relationships

- **Extends** the existing documentation processing pipeline with categorization logic
- **Integrates** with WikiManager for organized page creation across multiple directories
- **Maintains** full backward compatibility with string-based concept identification
- **Enables** structured knowledge organization for different content types

## Usage Examples

### Basic Categorization

```javascript
{
  concepts: [
    {
      name: "authentication flow",
      category: "guide",
      abstraction: "high"
    },
    {
      name: "LoginButton", 
      category: "component",
      abstraction: "low"
    }
  ]
}
```

### Mixed Format Support

```javascript
{
  concepts: [
    "legacy concept",  // Routes to components/ (default)
    {
      name: "new concept",
      category: "concept"  // Routes to concepts/
    }
  ]
}
```

The system automatically detects the format and applies appropriate routing logic, ensuring seamless operation during transition periods.