---
title: Meta-document ingestion system
category: concept
sourceFile: ingest-meta-docs.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Meta-document Ingestion System

## Purpose and Overview

The meta-document ingestion system automates the processing of project meta-documentation (specifications, progress reports, guides) into structured wiki content. It uses AI-powered analysis to generate appropriate frontmatter and categorization, ensuring consistent organization and cross-referencing across the documentation ecosystem.

## Key Functionality

The system operates through a category-based classification approach that organizes documents into three main taxonomies: meta (specifications, planning), history (progress reports, retrospectives), and quality (guides, standards). 

The ingestion process involves three core components:
- **META_DOCS configuration** - Maps source files to categories, document types, and target wiki locations
- **ingestDocument function** - Processes individual documents through Claude analysis, generates structured frontmatter, and handles wiki integration with comprehensive error handling
- **CLI interface** - Provides batch or selective document processing with detailed progress reporting

Documents are analyzed using the MetaDocumentIngestionAgent, which extracts key metadata and relationships, then written to the wiki using WikiManager for consistent formatting and cross-referencing.

## Relationships

The system integrates deeply with the existing codebase architecture:
- **Depends on MetaDocumentIngestionAgent** for AI-powered document analysis and metadata extraction
- **Uses WikiManager** for structured wiki content management and page organization
- **Integrates with wiki cross-referencing system** to maintain document relationships and navigation
- **Extends the agent-based architecture pattern** established for other document processing workflows

## Usage Example

```javascript
// Run the meta-document ingestion CLI tool
node ingest-meta-docs.js

// Process specific document types
node ingest-meta-docs.js --category meta

// The system will:
// 1. Load META_DOCS configuration
// 2. Process each document through Claude analysis
// 3. Generate structured wiki content with frontmatter
// 4. Write to appropriate wiki locations
// 5. Provide summary reporting of ingestion results
```

## Testing

No automated tests are currently available for this component. Testing would benefit from coverage of the document classification logic, error handling scenarios, and wiki integration workflows.