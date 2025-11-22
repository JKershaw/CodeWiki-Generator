---
title: backward compatibility pattern
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Backward Compatibility Pattern

## Purpose and Overview

The backward compatibility pattern ensures seamless migration from legacy string-based concept arrays to the new structured concept object format. This pattern allows existing implementations to continue working while enabling enhanced functionality through categorization and metadata support.

## Key Functionality

### Format Normalization

The pattern automatically detects and converts between two concept formats:

**Legacy Format (String Array):**
```javascript
["concept name", "another concept"]
```

**Structured Format (Object Array):**
```javascript
[
  {
    "name": "concept name",
    "category": "concept",
    "abstraction": "medium", 
    "reason": "explanation of why this was extracted"
  }
]
```

### Enhanced Validation

The `_validateResponse` function now handles both formats by:
- Detecting the input format type
- Converting string arrays to structured objects with default values
- Preserving existing structured objects unchanged
- Ensuring consistent output format for downstream processing

### Default Value Assignment

When converting legacy string concepts, the pattern applies sensible defaults:
- **category**: `"concept"`
- **abstraction**: `"medium"`
- **reason**: Generic explanation noting automatic conversion

## Relationships

- **Enables concept categorization system**: Provides the structured foundation needed for category-aware routing and specialized handlers
- **Supports migration workflows**: Allows gradual transition from legacy implementations without breaking existing functionality
- **Integrates with validation pipeline**: Works within the existing response validation flow to ensure data consistency

## Usage Examples

### Automatic Conversion
```javascript
// Input (legacy format)
["user authentication", "data validation"]

// Automatically converted to
[
  {
    "name": "user authentication",
    "category": "concept", 
    "abstraction": "medium",
    "reason": "Converted from legacy string format"
  },
  {
    "name": "data validation",
    "category": "concept",
    "abstraction": "medium", 
    "reason": "Converted from legacy string format"
  }
]
```

### Mixed Format Handling
The pattern gracefully handles responses containing both formats, normalizing everything to the structured format for consistent downstream processing.