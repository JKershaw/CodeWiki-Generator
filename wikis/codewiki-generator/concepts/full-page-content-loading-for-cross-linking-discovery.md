---
title: Full-page content loading for cross-linking discovery
category: concept
sourceFile: debug-related.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Full-Page Content Loading for Cross-Linking Discovery

## Purpose and Overview

This debug script validates the cross-linking discovery functionality by loading complete page content (rather than metadata alone) and testing the `LinkDiscoveryAgent` against real wiki data. It establishes a pattern for diagnosing why pages aren't being discovered as related and verifies that mention and relation detection work correctly before integration into the main system.

## Key Functionality

The script orchestrates a debugging workflow that:

1. **Full-page content loading** — Loads all wiki pages with complete content, not just metadata, which is essential for accurate mention detection
2. **Agent validation** — Tests `LinkDiscoveryAgent` functionality on sample pages to verify it correctly identifies cross-links and related pages
3. **Data flow verification** — Demonstrates the complete flow from page retrieval through link analysis, helping identify where discovery failures occur

The `main()` function coordinates the workflow by:
- Using `WikiManager` to retrieve pages with full content
- Passing page content to `LinkDiscoveryAgent` for analysis
- Testing mention and relation discovery on representative pages

## Relationships

| Component | Role |
|-----------|------|
| **WikiManager** | Provides page retrieval with both metadata listing and full content loading capabilities |
| **LinkDiscoveryAgent** | Analyzes page content to discover mentions and related pages through content inspection |

**Key Dependency**: `LinkDiscoveryAgent` requires full page content—metadata alone is insufficient for accurate mention detection. This script ensures that complete content is loaded before analysis begins.

## Usage Example

```javascript
const WikiManager = require('./wiki-manager');
const LinkDiscoveryAgent = require('./link-discovery-agent');

async function main() {
  const wikiManager = new WikiManager();
  const agent = new LinkDiscoveryAgent();
  
  // Load all pages with full content
  const pages = await wikiManager.getAllPages();
  
  // Test link discovery on a sample page
  const samplePage = pages[0];
  const discoveredLinks = await agent.analyzePageContent(samplePage);
  
  console.log('Discovered mentions:', discoveredLinks);
}

main();
```

## Testing

No automated tests are currently available for this debug script. This script serves as a manual validation tool for developers to verify cross-linking functionality against real wiki data before integrating changes into the main system.

To use this for validation:
1. Run the script against your wiki data
2. Inspect console output for discovered mentions and relations
3. Compare results against expected cross-links to identify discovery gaps