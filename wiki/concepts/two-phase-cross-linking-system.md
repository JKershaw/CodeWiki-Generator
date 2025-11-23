---
title: Two-phase cross-linking system
category: concept
sourceFile: Not specified
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Two-phase Cross-linking System

## Purpose and Overview

The two-phase cross-linking system implements a sophisticated linking strategy that separates relationship discovery from link application to prevent content analysis interference. This approach first analyzes original page content to identify relationships, then applies inline links without affecting subsequent content analysis operations.

## Key Functionality

The system operates in two distinct phases:

1. **Discovery Phase**: Analyzes original page content to identify potential relationships and cross-references without modifying the content
2. **Application Phase**: Applies the discovered links as inline modifications to the page content

This separation ensures that link insertion doesn't interfere with content analysis algorithms, maintaining the integrity of relationship detection. The system orchestrates the entire process through `addCrossPageLinks`, which loads full page data, discovers relationships on pristine content, then applies the links. Modified pages are updated using `updatePage` rather than creating new entries, preserving existing page structure and metadata.

## Relationships

- **Depends on LinkDiscoveryAgent** for relationship detection during the discovery phase
- **Uses DocumentationWriterAgent** for intelligent link insertion during the application phase
- **Integrates with WikiManager** for page data loading and persistence operations
- **Modifies page metadata** to include discovered related page references for future navigation

## Usage Example

```javascript
const { addCrossPageLinks } = require('./cross-linking-system');
const wikiManager = require('./wiki-manager');

// Add cross-links to a specific page
await addCrossPageLinks('api-authentication', wikiManager);

// The system will:
// 1. Load the original content of 'api-authentication'
// 2. Discover relationships to other pages (e.g., 'user-management', 'security-config')
// 3. Apply inline links without affecting future content analysis
// 4. Update the page with enhanced content and related page metadata
```

## Testing

No automated tests are currently available for this component. Testing should cover both phases of the linking process, relationship accuracy, and metadata preservation during page updates.