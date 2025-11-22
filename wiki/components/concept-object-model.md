---
title: Concept object model
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Concept Object Model

## Purpose and Overview

The concept object model enhances documentation generation by replacing simple string-based concept identification with structured objects that include category metadata. This enables category-aware routing where concepts are automatically organized into appropriate directories based on their type (concept, component, or guide).

## Key Functionality

### Object Structure
Concepts are now defined as objects with two properties:
- `name`: The concept identifier (string)
- `category`: The classification type (`"concept"`, `"component"`, or `"guide"`)

### Category-Aware Routing
The system routes documentation based on the concept's category:
- **Components**: Stored in `/components/` directory
- **Concepts**: Stored in `/concepts/` directory  
- **Guides**: Stored in `/guides/` directory

### Backward Compatibility
The implementation maintains support for legacy string-based concepts while enabling migration to the enhanced object format.

## Key Functions

### `processConceptDocumentation`
Handles both string and object concept formats, extracting category information when available and falling back to default behavior for string concepts.

### `determinePagePath`
Routes concepts to appropriate directories based on their category instead of defaulting all documentation to the components directory.

## Relationships

- **Extends WikiManager**: Integrates category metadata into existing documentation generation workflow
- **Maintains compatibility**: Works alongside existing string-based concept processing
- **File naming**: Continues to use kebab-case convention for generated file paths

## Usage Examples

### Object Format
```javascript
{
  name: "User authentication",
  category: "concept"
}
```

### Legacy String Format (still supported)
```javascript
"User authentication"
```

### Category Mapping
- `category: "concept"` → `/concepts/user-authentication.md`
- `category: "component"` → `/components/user-authentication.md`
- `category: "guide"` → `/guides/user-authentication.md`