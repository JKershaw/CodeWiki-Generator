---
title: Directory mapping strategy
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Directory Mapping Strategy

## Purpose and Overview

The directory mapping strategy organizes documentation files into appropriate directories based on concept categories rather than placing everything in a default location. This system routes concepts marked as 'concept', 'component', or 'guide' to their respective directories, creating a more logical information architecture for wiki documentation.

## Key Functionality

### Category-Based Routing
- **Concepts**: Routed to `/concepts/` directory for high-level explanatory content
- **Components**: Routed to `/components/` directory for code implementation details  
- **Guides**: Routed to `/guides/` directory for procedural documentation
- **Default**: Unspecified categories fall back to `/components/` directory

### Concept Object Processing
The strategy handles two input formats:
- **Legacy strings**: Processed as components with default routing
- **Concept objects**: Include `name` and `category` properties for precise routing

```javascript
// Legacy format (routes to /components/)
"UserAuthentication"

// New object format (routes based on category)
{
  name: "UserAuthentication", 
  category: "component"
}
```

### File Path Generation
Combines category-based directory routing with kebab-case naming:
- Converts concept names to kebab-case format
- Prepends appropriate directory based on category
- Maintains `.md` extension for markdown files

## Relationships

### Integration Points
- **WikiManager**: Extends existing wiki integration with enhanced path determination
- **Documentation Pipeline**: Works within the broader documentation generation workflow
- **Naming Conventions**: Integrates with established kebab-case file naming

### Processing Flow
1. `processConceptDocumentation` receives concept input (string or object)
2. Extracts name and category information
3. `determinePagePath` maps category to directory and formats filename
4. Returns complete file path for documentation storage

## Usage Examples

### Concept Object Definition
```javascript
const concepts = [
  { name: "Authentication Flow", category: "concept" },
  { name: "UserService", category: "component" },
  { name: "Getting Started", category: "guide" }
];
```

### Generated Paths
- `Authentication Flow` → `/concepts/authentication-flow.md`
- `UserService` → `/components/user-service.md`  
- `Getting Started` → `/guides/getting-started.md`