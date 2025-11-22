---
title: legacy format migration
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Legacy Format Migration

## Purpose and Overview

Legacy format migration provides a seamless upgrade path from string-based concept representation to a more structured object-based format. This migration pattern ensures backward compatibility while enabling enhanced functionality like category-aware concept extraction and intelligent routing.

## Key Functionality

The migration system transforms legacy string concepts into structured objects with the following properties:

- **Format Detection**: Automatically identifies whether incoming concepts are in legacy string format or new object format
- **Automatic Transformation**: Converts string concepts to object format with default categorization
- **Validation Integration**: Works within the `_validateResponse` function to ensure all output follows the new format
- **Category Assignment**: Assigns appropriate categories to migrated concepts based on content analysis

### Migration Process

1. **Input Analysis**: Checks if concept data is a string (legacy) or object (current)
2. **Structure Conversion**: Transforms strings into objects with required fields:
   - `name`: The original concept string
   - `category`: Auto-assigned based on content or context
   - `abstraction`: Calculated abstraction level
   - `reason`: Generated explanation for categorization
3. **Validation**: Ensures migrated concepts meet current schema requirements

## Relationships

- **Enables**: Category-aware concept extraction by normalizing all concepts to object format
- **Supports**: Backward compatibility in `_validateResponse` function
- **Connects**: To guide generation workflow through enhanced concept metadata
- **Foundation for**: Concept format normalization across the entire system

## Usage Examples

### Legacy Input Processing

```javascript
// Legacy format (string array)
const legacyConcepts = ["user authentication", "data validation"];

// After migration (object array)
const migratedConcepts = [
  {
    name: "user authentication",
    category: "security",
    abstraction: "medium",
    reason: "core security mechanism for system access control"
  },
  {
    name: "data validation",
    category: "data-processing",
    abstraction: "high", 
    reason: "fundamental pattern for ensuring data integrity"
  }
];
```

### Mixed Format Handling

The migration system handles scenarios where responses contain both legacy and current format concepts, normalizing everything to the new structure without data loss.