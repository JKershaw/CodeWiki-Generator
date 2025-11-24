---
title: Debug-driven validation of agent functionality
category: guide
sourceFile: debug-related.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Debug-driven Validation of Agent Functionality

## Purpose and Overview

This script provides a debugging and validation framework for testing agent implementations against real wiki data. It establishes a pattern for developers to isolate and verify LinkDiscoveryAgent functionality before integrating changes into the main system, ensuring that mention and relation discovery work correctly across wiki pages.

## Key Functionality

**Full-Page Content Loading**
The script loads complete page content rather than metadata alone, which is essential for accurate link discovery. This addresses a critical gap where metadata-only loading was insufficient for detecting cross-links and page mentions.

**Agent Validation**
The script orchestrates a testing workflow that:
- Loads all pages from the wiki with full content
- Isolates a sample page for testing
- Runs LinkDiscoveryAgent analysis on the sample
- Validates mention and relation detection results

**Testing Pattern**
Establishes a reusable template for developers to create isolated test environments, allowing verification of agent behavior without affecting the production system.

## Relationships

- **Depends on WikiManager**: Retrieves page data and provides full content loading capabilities
- **Depends on LinkDiscoveryAgent**: Uses the agent's analysis methods to discover mentions and related pages
- **Data Flow**: Wiki pages → full content loading → LinkDiscoveryAgent analysis → validation results
- **Integration Point**: Validates the interaction between wiki data management and link discovery before system integration

## Usage Example

```javascript
const WikiManager = require('./wiki-manager');
const LinkDiscoveryAgent = require('./link-discovery-agent');

async function main() {
  const wikiManager = new WikiManager();
  
  // Load all pages with full content
  const pages = await wikiManager.loadAllPages();
  
  // Test LinkDiscoveryAgent on a sample page
  const agent = new LinkDiscoveryAgent();
  const samplePage = pages[0];
  const discoveredLinks = agent.analyzeContent(samplePage);
  
  console.log('Discovered mentions:', discoveredLinks);
}

main();
```

## Testing

No automated test suite currently exists for this component. Testing is performed manually by running the debug script against live wiki data and validating that:
- All pages load successfully with complete content
- LinkDiscoveryAgent correctly identifies mentions in page content
- Discovered relations match expected cross-links
- The workflow executes without errors

To test this functionality, execute the script directly and inspect console output for validation results.