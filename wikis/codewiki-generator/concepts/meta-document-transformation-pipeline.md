---
title: Meta-document transformation pipeline
category: concept
sourceFile: lib/agents/meta-document-ingestion-agent.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Meta-document Transformation Pipeline

## Purpose and Overview

The meta-document transformation pipeline converts root documentation files into structured wiki content with automated categorization and metadata extraction. This system enables systematic ingestion of project documentation while maintaining cross-references and layered organization across the wiki structure.

## Key Functionality

The `MetaDocumentIngestionAgent` serves as the core transformation engine that:

- **Processes source documents** - Reads markdown files and analyzes content using AI-powered document analysis
- **Extracts structured metadata** - Automatically generates frontmatter with relationships, categories, and wiki-specific properties
- **Manages content length** - Intelligently truncates content while preserving critical start and end sections for token limit compliance
- **Maps to wiki layers** - Transforms document categories (philosophy, specification, progress) into corresponding wiki layers (meta, history, quality)
- **Handles API responses robustly** - Includes progressive JSON repair mechanisms for processing Claude API responses

The transformation process follows a multi-stage pipeline:
1. Document ingestion and content analysis
2. AI-powered categorization and cross-reference extraction
3. Metadata generation with relationship mapping
4. Layer assignment based on document type
5. Structured wiki page output with frontmatter

## Relationships

The agent integrates deeply with the broader wiki architecture:

- **Uses ClaudeClient** for AI-powered document analysis and intelligent content processing
- **Integrates with PromptManager** for template-based processing and consistent transformation patterns
- **Connects to wiki system** through the category-to-layer mapping mechanism that enables multi-level organization
- **Part of agent-based architecture** that enables modular document processing and extensible transformation workflows

## Usage Example

```javascript
const MetaDocumentIngestionAgent = require('./lib/agents/meta-document-ingestion-agent');

const agent = new MetaDocumentIngestionAgent(claudeClient, promptManager);
const result = await agent.ingestDocument(filePath, content, outputPath);
```

## Testing

No automated tests found for this component.