---
title: Category-based document classification
category: concept
sourceFile: ingest-meta-docs.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Category-based document classification

**Location:** `ingest-meta-docs.js`

## Purpose and Overview

This system implements a structured taxonomy for organizing project documentation into categories (meta, history, quality) and automating their ingestion into the codebase wiki. It provides a CLI tool that processes meta-documentation files through AI analysis and converts them into properly formatted wiki pages with automated categorization and cross-referencing.

## Key Functionality

The component operates through three main mechanisms:

- **Document Classification**: Uses the `META_DOCS` configuration to map source files to specific categories and document types, defining processing rules and target wiki locations
- **AI-Powered Processing**: Leverages the `ingestDocument` function to analyze documents through Claude, generate appropriate frontmatter, and structure content for wiki consumption
- **Batch Operations**: Provides a CLI interface through the `main` function that supports selective or complete document processing with progress reporting and error handling

The system maintains a structured approach where each document type has predefined processing rules, ensuring consistent organization and formatting across different categories of project documentation.

## Relationships

This component integrates deeply with the codebase's documentation infrastructure:

- **MetaDocumentIngestionAgent**: Relies on this agent for AI-powered document analysis and content structuring
- **WikiManager**: Uses the wiki management system for creating and updating structured wiki content
- **Cross-referencing System**: Integrates with existing wiki page linking and navigation features
- **Agent Architecture**: Extends the established agent-based pattern for specialized document processing tasks

## Usage Example

```javascript
// Run the CLI tool for all documents
node ingest-meta-docs.js

// The system processes documents defined in META_DOCS configuration
// Each document goes through:
// 1. Category-based classification
// 2. AI analysis via MetaDocumentIngestionAgent
// 3. Wiki page generation with proper frontmatter
// 4. Integration into existing wiki structure
```

The tool operates as a command-line utility that reads the `META_DOCS` configuration to determine which files to process and how to categorize them within the wiki structure.

## Testing

No automated tests are currently available for this component. Testing would need to cover document classification accuracy, CLI functionality, and integration with the wiki management system.