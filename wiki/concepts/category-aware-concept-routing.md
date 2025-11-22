---
title: Category-aware concept routing
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Category-aware Concept Routing

## Purpose and Overview

Category-aware concept routing organizes documentation generation by directing concepts to appropriate directories based on their categorization rather than using a single default location. This systematic approach improves information architecture by separating concepts, components, and guides into distinct organizational structures within the documentation system.

## Key Functionality

The routing system processes concept objects that contain both a name and category, replacing the previous string-based approach:

- **Concept Object Model**: Structures concepts with `name` and `category` properties instead of simple strings
- **Directory Mapping**: Routes concepts to specific directories based on category (`concept`, `component`, or `guide`)
- **Enhanced Processing**: The `processConceptDocumentation` function handles both legacy string concepts and new categorized objects
- **Path Determination**: `determinePagePath` function implements the routing logic, directing each concept to its appropriate directory location

## Relationships

This system extends the existing WikiManager integration while maintaining backward compatibility:

- **Legacy Support**: Continues to process string-based concepts during transition periods
- **WikiManager Integration**: Works within the established documentation generation pipeline
- **Naming Convention Compatibility**: Integrates with existing kebab-case file naming standards
- **Metadata Enhancement**: Adds category information to the concept processing workflow

## Usage Examples

### New Object-Based Concepts

```javascript
const concepts = [
  {
    name: "User Authentication",
    category: "component"
  },
  {
    name: "Event-driven Architecture",
    category: "concept"
  },
  {
    name: "Getting Started Tutorial",
    category: "guide"
  }
];
```

### Backward Compatibility

The system continues to handle legacy string-based concepts:

```javascript
const legacyConcepts = [
  "Database Connection",
  "API Endpoints"
];
```

The routing ensures that `component` category concepts go to the components directory, `concept` category items are routed to a concepts directory, and `guide` category items are placed in a guides directory, creating a clear organizational hierarchy in the generated documentation.