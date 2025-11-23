---
title: Meta-documentation ingestion system
category: concept
sourceFile: ingest-meta-docs.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Meta-documentation Ingestion System

## Purpose and Overview

The meta-documentation ingestion system provides automated processing and structured ingestion of documentation files into a wiki system. It transforms source documentation through intelligent content processing, applies category mapping, and integrates documents into the wiki with proper cross-referencing and metadata handling.

## Key Functionality

The system operates through a configuration-driven approach with three main components:

- **META_DOCS Configuration**: Defines mappings between source documentation files and their target wiki categories and paths
- **Document Processing Pipeline**: The `ingestDocument` function processes individual documents through the ingestion workflow with error handling and progress reporting
- **CLI Orchestration**: The `main` function handles command-line argument parsing, batch processing of multiple documents, and provides summary reporting of ingestion results

The system supports automated categorization of different document types and provides intelligent content transformation through integration with specialized ingestion agents.

## Relationships

The ingestion system integrates with several key components:

- **MetaDocumentIngestionAgent**: Handles intelligent content processing and transformation of source documents
- **WikiManager**: Provides structured wiki operations for document storage and organization  
- **Agent-based Architecture**: Extends the existing agent system for documentation workflows
- **CLI Infrastructure**: Offers command-line interface integration with broader automated documentation systems

## Usage Example

```javascript
// Run ingestion for all configured documents
node ingest-meta-docs.js

// Process specific document by providing source file path
node ingest-meta-docs.js path/to/source-document.md

// The system will automatically:
// 1. Look up the document in META_DOCS configuration
// 2. Process through MetaDocumentIngestionAgent
// 3. Store in appropriate wiki category via WikiManager
```

## Testing

No automated tests are currently available for this component. Consider adding test coverage for the document processing pipeline and configuration validation.