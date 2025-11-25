---
title: Meta-document ingestion and wiki transformation
category: component
sourceFile: lib/agents/meta-document-ingestion-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Meta-document Ingestion and Wiki Transformation

## Purpose and Overview

The meta-document ingestion agent transforms root-level markdown documents (philosophy documents, specifications, progress reports) into structured wiki pages with metadata, cross-references, and categorization. It bridges the gap between raw documentation input and the wiki system's layered architecture by intelligently extracting structure and context from unstructured content.

## Key Functionality

**Document Processing and Categorization**
- Ingests markdown documents and categorizes them into documentation layers (meta/history/quality/concepts/components/guides)
- Routes content to appropriate wiki layers based on document type and content analysis
- Applies content truncation with boundary preservation when documents exceed token limits, using a 60/40 split to maintain critical information at document start and end

**Metadata Extraction**
- Leverages Claude AI with context awareness of existing wiki pages to extract structured metadata
- Generates titles, identifies themes and concepts, and creates cross-references to related pages
- Enables intelligent linking and contextual understanding across the entire documentation system

**Robust Response Handling**
- Implements progressive JSON repair with fallback parsing for LLM-generated responses
- Handles common formatting issues by attempting direct parsing, then progressively cleaning responses (removing markdown blocks, extracting JSON structure)
- Ensures reliable processing despite variability in AI-generated output format

## Relationships

This agent serves as a critical bridge component in the documentation ecosystem:
- **Input**: Receives raw markdown documents from various sources
- **Processing**: Utilizes Claude AI for content analysis and metadata extraction
- **Output**: Produces structured wiki pages that integrate with the broader wiki system
- **Dependencies**: Relies on existing wiki page knowledge for contextual cross-referencing
- **Integration**: Feeds into the multi-layer wiki organization system for hierarchical knowledge management

## Usage Example

```javascript
const MetaDocumentIngestionAgent = require('./lib/agents/meta-document-ingestion-agent');

const agent = new MetaDocumentIngestionAgent();
const markdownContent = "# Project Philosophy\n\nThis document outlines...";
const result = await agent.ingestDocument(markdownContent);
```

## Testing

No automated tests found. Testing coverage should be implemented to validate document processing, metadata extraction accuracy, and JSON parsing reliability.