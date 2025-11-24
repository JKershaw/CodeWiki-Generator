---
title: Meta-documentation ingestion system
category: concept
sourceFile: ingest-meta-docs.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Meta-documentation Ingestion System

## Purpose and Overview

The meta-documentation ingestion system automates the transformation of existing documentation files into structured wiki content with proper frontmatter, categorization, and cross-references. It provides a CLI-based workflow for selectively or bulk processing source documents through an AI agent that generates appropriate wiki formatting.

## Key Functionality

The system operates through a declarative configuration approach:

- **Document Mapping**: The `META_DOCS` constant defines source-to-target mappings, specifying categories, document types, and wiki paths for each source file
- **AI-Powered Processing**: Uses `MetaDocumentIngestionAgent` to analyze source content and generate appropriate frontmatter and wiki formatting
- **Batch Processing**: Supports both selective document processing (by specifying filenames) and bulk ingestion of all configured documents
- **Error Handling**: Provides comprehensive error reporting and processing summaries

The `ingestDocument` function handles individual file processing, while the `main` function serves as the CLI entry point with argument parsing and progress reporting.

## Relationships

The ingestion system integrates tightly with the broader documentation infrastructure:

- Depends on `MetaDocumentIngestionAgent` for AI-powered document analysis and transformation
- Uses `WikiManager` for file operations, page creation, and wiki structure management  
- Connects with the existing cross-referencing system to maintain proper inter-document links
- Forms part of the agent-based documentation ecosystem alongside other specialized processing agents

## Usage Example

```javascript
// Run selective document ingestion
node ingest-meta-docs.js README.md CONTRIBUTING.md

// Process all configured meta-documents
node ingest-meta-docs.js

// The META_DOCS configuration maps source files to wiki structure
const META_DOCS = [
  {
    sourceFile: 'README.md',
    category: 'overview',
    type: 'guide',
    targetPath: 'project-overview.md'
  }
];
```

## Testing

No automated tests are currently available for this component. Testing relies on manual verification of document processing and wiki integration.