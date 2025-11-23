---
title: Document category mapping configuration
category: component
sourceFile: ingest-meta-docs.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Document Category Mapping Configuration

## Purpose and Overview

The document category mapping configuration provides a structured approach to mapping source documentation files to categorized wiki locations with metadata for automated processing workflows. This configuration drives the meta-documentation ingestion system, enabling automated transformation and integration of various document types into the wiki structure.

## Key Functionality

The configuration system centers around the `META_DOCS` constant, which defines an array mapping source files to their corresponding wiki categories and target paths. The system processes documents through several key operations:

- **File-to-Category Mapping**: Maps source documentation files to specific wiki categories and target locations
- **Batch Processing**: Handles multiple documents through the `ingestDocument` function with error handling and progress reporting
- **CLI Orchestration**: Provides command-line interface through the `main` function for argument parsing and summary reporting
- **Integration Pipeline**: Connects with MetaDocumentIngestionAgent for intelligent content processing and WikiManager for structured wiki operations

The ingestion workflow transforms raw documentation into structured wiki content while maintaining category organization and cross-referencing capabilities.

## Relationships

This component serves as a central configuration layer that integrates multiple system components:

- **Depends on MetaDocumentIngestionAgent**: Leverages intelligent content processing capabilities for document transformation
- **Integrates with WikiManager**: Utilizes structured wiki operations for content placement and organization  
- **Extends agent-based architecture**: Built upon existing documentation workflow patterns
- **Provides CLI interface**: Connects automated documentation systems with command-line tooling

## Usage Example

```javascript
// Configure document mappings
const META_DOCS = [
  {
    sourceFile: 'path/to/source.md',
    category: 'concepts',
    targetPath: 'wiki/concepts/target.md'
  }
];

// Process individual document
await ingestDocument(documentConfig);

// CLI batch processing
await main(process.argv);
```

## Testing

No automated tests are currently available for this component. Testing coverage should be added to validate configuration mapping accuracy and ingestion pipeline reliability.