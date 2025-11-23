---
title: Debug scripts pattern
category: guide
sourceFile: Not specified
related: [components/link-discovery-agent.md, concepts/cross-linking-system.md]
created: 2025-11-23
updated: 2025-11-23
---

# Debug Scripts Pattern

## Purpose and Overview

Debug scripts are standalone testing utilities that verify specific subsystems in isolation without running the full application. This pattern enables developers to quickly test and troubleshoot individual components like cross-linking functionality, making debugging more efficient and targeted.

## Key Functionality

The debug scripts pattern provides:

- **Isolated testing** - Tests specific subsystems independently of the main application
- **Component verification** - Validates individual functionality like link discovery and page relationships
- **Development assistance** - Offers quick feedback during development and debugging cycles
- **Integration testing** - Verifies how components work together in controlled scenarios

Debug scripts typically load necessary components, execute specific test scenarios, and output results for manual verification. They serve as lightweight alternatives to full test suites when rapid iteration is needed.

## Relationships

Debug scripts integrate with core wiki components:

- **WikiManager** - Loads and retrieves wiki pages for testing scenarios
- **[LinkDiscoveryAgent](../components/link-discovery-agent.md)** - Performs content analysis and mention detection
- **[Cross-linking system](../concepts/cross-linking-system.md)** - Tests the end-to-end functionality of related page discovery

These scripts act as consumers of the main system components, providing a testing harness that exercises real functionality with controlled inputs.

## Usage Example

```javascript
const WikiManager = require('./wiki-manager');
const LinkDiscoveryAgent = require('./link-discovery-agent');

async function main() {
  const wikiManager = new WikiManager('./wiki-content');
  const linkAgent = new [LinkDiscoveryAgent](../components/link-discovery-agent.md)(wikiManager);
  
  // Test related pages discovery
  const page = await wikiManager.getPage('architecture.md');
  const relatedPages = await linkAgent.findRelatedPages(page);
  
  console.log(`Found ${relatedPages.length} related pages`);
  relatedPages.forEach(p => console.log(`- ${p.title}`));
}

main().catch(console.error);
```

## Testing

No automated tests are currently available for the debug scripts pattern. The scripts themselves serve as manual testing tools, providing immediate feedback through console output and allowing developers to verify component behavior interactively.