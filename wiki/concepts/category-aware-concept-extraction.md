---
title: category-aware concept extraction
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Category-Aware Concept Extraction

## Purpose and Overview

Category-aware concept extraction provides intelligent classification and routing of extracted concepts by type and purpose, moving beyond simple string-based representations to structured object formats. This system enables more sophisticated concept processing while maintaining backward compatibility with existing string-based concept formats through automatic migration patterns.

## Key Functionality

### Concept Format Normalization
- **Legacy Support**: Automatically converts string-based concepts to structured object format
- **Object Structure**: Transforms concepts into objects with `name`, `category`, `abstraction`, and `reason` properties
- **Validation**: Ensures consistent data structure across the concept extraction pipeline

### Category Classification
- **Type Routing**: Categorizes concepts by their fundamental nature (concept, implementation, pattern)
- **Abstraction Levels**: Assigns abstraction ratings (high, medium, low) for concept hierarchy organization
- **Purpose Context**: Provides reasoning for each concept's classification and significance

### Migration Strategy
The `_validateResponse` function handles the transition between formats:
- Detects legacy string arrays in concept responses
- Converts strings to normalized concept objects with default categorization
- Preserves existing object-formatted concepts without modification

## Relationships

- **Enables Guide Generation**: Category-aware concepts feed into the guide suggestion workflow through the `suggestedGuides` field
- **Supports Concept Hierarchy**: Abstraction levels enable structured organization of extracted concepts
- **Integrates with Analysis Pipeline**: Provides enriched concept data for downstream processing and documentation generation

## Usage Examples

### Legacy Format (Automatically Migrated)
```javascript
// Input: ["authentication", "user management"]
// Output: [
//   { name: "authentication", category: "concept", abstraction: "medium", reason: "..." },
//   { name: "user management", category: "concept", abstraction: "medium", reason: "..." }
// ]
```

### Modern Object Format
```javascript
{
  name: "dependency injection",
  category: "pattern",
  abstraction: "high",
  reason: "enables flexible component composition and testing isolation"
}
```

The system seamlessly handles both formats, ensuring consistent downstream processing regardless of input structure.