---
title: CLI document processing tool
category: guide
sourceFile: ingest-meta-docs.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# CLI Document Processing Tool

## Purpose and Overview

The CLI document processing tool provides a command-line interface for ingesting existing documentation files into a structured wiki format. It automates the transformation of source documents by processing them through an AI agent to generate appropriate frontmatter, categorization, and cross-references.

## Key Functionality

- **Document Mapping**: Uses the `META_DOCS` configuration array to map source files to wiki categories, document types, and target paths
- **Selective Processing**: Allows processing of individual documents or bulk ingestion of all configured documents
- **Automated Processing**: Leverages `MetaDocumentIngestionAgent` to analyze documents and generate structured frontmatter
- **Progress Reporting**: Provides command-line feedback with error handling and processing summaries
- **Wiki Integration**: Writes processed documents directly to the wiki structure using WikiManager

The tool reads from a predefined mapping configuration, processes each document through Claude-based analysis, generates appropriate metadata and cross-references, then writes the transformed content to the target wiki location.

## Relationships

- **Depends on**: `MetaDocumentIngestionAgent` for AI-powered document processing and frontmatter generation
- **Integrates with**: `WikiManager` for file operations, wiki page management, and maintaining wiki structure
- **Part of**: The broader agent-based documentation system that includes automated categorization and cross-referencing
- **Extends**: Existing wiki infrastructure by providing automated content ingestion capabilities

## Usage Example

```javascript
// Run from command line for bulk processing
node ingest-meta-docs.js

// Process a specific document by index
node ingest-meta-docs.js 0

// The tool uses the META_DOCS configuration internally
const META_DOCS = [
  {
    category: 'concepts',
    type: 'guide', 
    sourcePath: 'docs/example.md',
    targetPath: 'wiki/guides/example.md'
  }
];
```

## Testing

No automated tests found for this component. Testing would need to be performed manually by running the CLI tool with various document configurations and verifying the generated wiki output.