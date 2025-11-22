---
title: structured concept format
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Structured Concept Format

## Purpose and Overview

The structured concept format replaces simple string-based concept representation with rich objects containing categorization metadata. This enhancement enables intelligent routing to specialized handlers and provides detailed context about each extracted concept while maintaining backward compatibility with existing string arrays.

## Key Functionality

### Format Structure

Each concept object contains four required fields:

- **name**: The concept identifier
- **category**: Classification type (e.g., "concept", "component", "pattern")
- **abstraction**: Level of abstraction ("high", "medium", "low")
- **reason**: Explanation of why this concept was identified and its significance

### Backward Compatibility

The system automatically normalizes legacy string-based concepts to the structured format during validation. Existing implementations continue working without modification while gaining access to enhanced categorization features.

### Validation and Normalization

The `_validateResponse` function handles format conversion:
- Detects mixed arrays containing both strings and objects
- Converts string entries to structured objects with default metadata
- Ensures consistent object format across all concept entries

## Relationships

- **Enables concept categorization system**: Categories allow routing concepts to specialized processing handlers based on their type and abstraction level
- **Supports category-aware extraction**: Downstream components can make intelligent decisions based on concept metadata
- **Integrates with validation pipeline**: Works within existing response validation to ensure data consistency

## Usage Examples

### New Structured Format

```javascript
{
  "name": "dependency injection pattern",
  "category": "pattern",
  "abstraction": "medium", 
  "reason": "demonstrates loose coupling through external dependency management"
}
```

### Legacy Format (automatically converted)

```javascript
// Input: ["user authentication", "data validation"]
// Automatically becomes:
[
  {
    "name": "user authentication",
    "category": "concept",
    "abstraction": "medium",
    "reason": "extracted concept requiring categorization"
  },
  {
    "name": "data validation", 
    "category": "concept",
    "abstraction": "medium",
    "reason": "extracted concept requiring categorization"
  }
]
```

The structured format provides the foundation for intelligent concept processing while ensuring existing codebases continue functioning during migration to the enhanced system.