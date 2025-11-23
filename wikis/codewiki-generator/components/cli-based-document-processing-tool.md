---
title: CLI-based document processing tool
category: component
sourceFile: ingest-meta-docs.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# CLI-based Document Processing Tool

## Purpose and Overview

This CLI tool provides automated ingestion and processing of project meta-documentation into a structured wiki format. It uses AI-powered analysis through Claude to transform specifications, progress reports, and guides into consistently formatted wiki pages with proper categorization and cross-referencing.

## Key Functionality

The tool operates through three main components:

- **META_DOCS Configuration**: Defines a mapping of source documents to target wiki locations, including category assignments (meta, history, quality) and document type classifications
- **Document Processing Pipeline**: Uses the MetaDocumentIngestionAgent to analyze content, extract key information, and generate appropriate frontmatter for wiki integration
- **CLI Interface**: Provides batch or selective document processing with progress reporting and error handling for operational visibility

The system automatically categorizes documents based on their type and content, ensuring consistent organization within the wiki structure while maintaining cross-references to related documentation.

## Relationships

This component integrates deeply with the existing documentation infrastructure:

- **MetaDocumentIngestionAgent**: Leverages AI-powered analysis for content processing and structure extraction
- **WikiManager**: Uses the wiki management system for content persistence and organization
- **Agent Architecture**: Extends the established agent-based pattern for document processing workflows
- **Cross-referencing System**: Maintains links and relationships between wiki pages during the ingestion process

## Usage Example

```javascript
// Run the CLI tool for all configured documents
node ingest-meta-docs.js

// The tool will process documents defined in META_DOCS configuration
// Example configuration structure:
const META_DOCS = {
  'source-file.md': {
    category: 'meta',
    type: 'specification',
    target: 'wiki/specifications/source-file.md'
  }
};

// Each document goes through the ingestDocument function
await ingestDocument(docConfig, sourceFile);
```

## Testing

No automated tests are currently available for this component. Testing is performed through manual execution of the CLI tool with sample documents.