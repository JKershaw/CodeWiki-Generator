---
title: Global metadata tracking
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Global Metadata Tracking

## Purpose and Overview

Global metadata tracking provides systematic collection and persistence of page metadata across the wiki system. This enables enhanced navigation, relationship mapping, and future features like link tracking by maintaining a centralized view of all page attributes and connections.

## Key Functionality

The system captures and stores essential metadata for every wiki page through the `updatePageGlobalMetadata` function:

- **Page identification**: Full path, title, and category information
- **Lifecycle tracking**: Creation timestamps for new pages, update timestamps for existing pages
- **Link preparation**: Placeholder fields for incoming and outgoing page relationships (future feature)

The metadata update process differentiates between page creation and updates, ensuring accurate lifecycle tracking while building a foundation for relationship mapping between wiki pages.

## Relationships

- **Extends WikiManager**: Adds metadata persistence capabilities to the core wiki management functionality
- **Integrates with Processor workflows**: Hooks into existing page creation and update processes to automatically capture metadata
- **Prepares for link tracking**: Establishes the data structure needed for future page relationship and link analysis features

## Implementation Notes

The system uses a lifecycle-aware approach where:
- New pages receive a `createdAt` timestamp
- Existing pages get an `updatedAt` timestamp
- Both track the same core metadata (path, title, category) consistently

This design supports wiki evolution tracking while maintaining a clean separation between creation and modification events.