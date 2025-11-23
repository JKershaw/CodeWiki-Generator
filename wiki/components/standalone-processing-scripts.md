---
title: Standalone processing scripts
category: component
sourceFile: Not specified
related: [concepts/cross-linking-system.md]
created: 2025-11-23
updated: 2025-11-23
---

# Standalone Processing Scripts

## Purpose and Overview

Standalone processing scripts provide entry points for batch operations on existing wiki content, particularly for automated cross-linking maintenance. These scripts use the core processor library to perform specific maintenance tasks across the entire wiki directory structure without requiring manual intervention.

## Key Functionality

The standalone scripts orchestrate wiki-wide operations through the following capabilities:

- **Cross-link generation**: Automatically analyzes all wiki pages to identify opportunities for internal linking between related content
- **Batch processing**: Operates across the entire wiki directory structure in a single execution
- **Error handling**: Includes robust error handling to ensure processing continues even when individual pages encounter issues
- **Maintenance automation**: Provides a repeatable process for keeping wiki cross-references up to date as content evolves

The scripts act as a bridge between manual wiki editing and automated content enhancement, ensuring that the wiki's interconnected structure remains comprehensive and current.

## Relationships

These scripts depend on several core components:

- **Processor class**: Uses the main processing engine from `lib/processor` module for all wiki operations
- **Wiki directory structure**: Operates directly on the file system organization of wiki content
- **[Cross-linking system](../concepts/cross-linking-system.md)**: Implements the automated linking logic as part of the broader wiki processing pipeline

The standalone scripts represent the executable layer of the wiki maintenance system, providing command-line access to the underlying processing capabilities.

## Usage Example

```javascript
const { Processor } = require('./lib/processor');

async function main() {
  try {
    const processor = new Processor({
      wikiPath: './wiki',
      linkingRules: { minRelevanceScore: 0.7 }
    });
    
    await processor.addCrossLinksToAllPages();
    console.log('Cross-linking completed successfully');
  } catch (error) {
    console.error('Processing failed:', error);
    process.exit(1);
  }
}

main();
```

## Testing

No automated tests are currently available for the standalone processing scripts. Testing would benefit from integration tests that verify cross-link generation across sample wiki content and error handling scenarios.