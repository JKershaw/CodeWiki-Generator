---
title: MetaDocumentIngestionAgent
category: component
sourceFile: lib/agents/meta-document-ingestion-agent.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# MetaDocumentIngestionAgent

## Purpose and Overview

The MetaDocumentIngestionAgent transforms root-level documentation files into structured wiki pages with intelligent categorization and cross-referencing. It serves as the primary pipeline for converting project documentation (specifications, progress reports, philosophy docs) into a multi-layered wiki architecture with automated metadata extraction.

## Key Functionality

**Document Processing Pipeline**
- Ingests markdown files and analyzes content using AI-powered document analysis
- Extracts structured metadata including categories, relationships, and key concepts
- Applies intelligent content truncation to handle token limits while preserving document structure
- Generates frontmatter with categorization and cross-page relationships

**Multi-Layer Wiki Architecture**
- Maps document categories to wiki layers (meta/history/quality) through `_categoryToLayer`
- Creates structured output with automated categorization
- Maintains cross-referencing between related documentation pages

**Robust Content Handling**
- Implements progressive JSON parsing with repair capabilities for API responses
- Handles content truncation intelligently, preserving start and end sections
- Manages token limits while maintaining document coherence

## Relationships

The MetaDocumentIngestionAgent integrates with several core system components:

- **ClaudeClient**: Provides AI-powered document analysis and content transformation
- **PromptManager**: Supplies template-based processing for consistent output formatting
- **Wiki System**: Connects through category mapping to broader documentation architecture
- **Agent Architecture**: Part of the larger agent-based processing pattern for document workflows

## Usage Example

```javascript
const MetaDocumentIngestionAgent = require('./lib/agents/meta-document-ingestion-agent');

const agent = new MetaDocumentIngestionAgent(claudeClient, promptManager);

// Ingest a documentation file into the wiki system
const result = await agent.ingestDocument(filePath, fileContent);

// Generate frontmatter for wiki page structure
const frontmatter = agent.generateFrontmatter(metadata, relationships);
```

## Testing

No automated tests found. Test coverage should be added to verify document transformation accuracy and wiki structure generation.