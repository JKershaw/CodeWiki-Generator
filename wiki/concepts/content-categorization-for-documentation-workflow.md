---
title: Content categorization for documentation workflow
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Content Categorization for Documentation Workflow

## Purpose and Overview

Content categorization establishes a systematic approach to organizing documentation by type and abstraction level, enabling targeted generation strategies for different kinds of content. This pattern separates concepts from components and applies abstraction-based processing to optimize documentation workflows.

## Key Functionality

The categorization system operates on two primary dimensions:

### Content Types
- **Concepts**: Architectural patterns, design principles, and abstract ideas
- **Components**: Concrete implementation elements like classes, functions, and modules

### Abstraction Levels
- **High**: Architectural patterns and system-wide concepts
- **Medium**: Implementation patterns and mid-level design decisions  
- **Low**: Specific code elements and concrete implementations

### Processing Strategy

Content categorization enables different documentation agents to:
- Apply type-specific generation templates
- Route content through appropriate processing pipelines
- Optimize output format based on abstraction level
- Maintain consistent organization across generated documentation

## Relationships

This categorization pattern integrates across the documentation workflow:

- **WikiProcessor**: Uses categories to determine which agents process specific content types
- **GuideGenerationAgent**: Leverages categorization to separate operational guides from reference documentation
- **Page Generation**: Applies different templates and formatting based on content category
- **Index Creation**: Organizes navigation and cross-references using categorical structure

## Usage Examples

### Category Assignment
```javascript
{
  "name": "Authentication middleware",
  "category": "concept",
  "abstraction": "medium",
  "reason": "Implements cross-cutting security pattern applied throughout the application"
}
```

### Type-Based Processing
```javascript
// Separate processing paths based on category
const concepts = analysis.concepts.filter(item => item.category === 'concept');
const components = analysis.concepts.filter(item => item.category === 'component');

// Apply different generation strategies
await generateConceptualDocs(concepts);
await generateReferenceDocs(components);
```

The categorization system ensures that architectural concepts receive different treatment than implementation details, maintaining appropriate documentation depth and focus for each content type.