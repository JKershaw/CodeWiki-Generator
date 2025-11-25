---
title: Multi-Project Wiki Organization
category: concept
sourceFile: generate-self-wiki.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Multi-Project Wiki Organization

## Purpose and Overview

Multi-Project Wiki Organization represents an architectural evolution from a single project wiki structure to support documentation generation for multiple projects simultaneously. This organizational pattern establishes the foundation for scalable documentation infrastructure by transitioning from `./wiki` to `./wikis/codewiki-generator/` structure.

## Key Functionality

The multi-project organization restructures the wiki directory hierarchy to accommodate multiple projects within a single documentation system. Instead of maintaining documentation in a single `wiki` folder, the system creates project-specific subdirectories under a `wikis` parent directory. This allows each project to maintain its own documentation space while sharing common infrastructure and tooling.

The reorganization enables:
- Isolated documentation spaces per project
- Shared wiki generation infrastructure
- Scalable expansion to additional projects
- Centralized management of multiple project documentations

## Relationships

This organizational pattern serves as the foundational structure for Phase 1 of the E2E testing infrastructure. It connects to the wiki generation system by providing the target directory structure that `generate-self-wiki.js` uses for output. The multi-project structure enables the documentation system to scale beyond single-project limitations and supports the broader testing and documentation strategy.

## Usage Example

```javascript
// The organizational structure is implemented through directory paths
// Example project structure:
// ./wikis/codewiki-generator/  (instead of ./wiki)
// ./wikis/project-name/

// Wiki generation targeting multi-project structure
const outputPath = './wikis/codewiki-generator/';
// Generate documentation to project-specific wiki directory
```

## Testing

No automated tests found for this organizational concept.