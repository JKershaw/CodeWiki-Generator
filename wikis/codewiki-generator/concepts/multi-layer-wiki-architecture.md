---
title: Multi-layer wiki architecture
category: concept
sourceFile: lib/agents/meta-document-ingestion-agent.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Multi-layer Wiki Architecture

## Purpose and Overview

The multi-layer wiki architecture provides a structured approach for organizing documentation into hierarchical layers (meta, history, quality) with automated categorization and cross-referencing. This system enables intelligent transformation of root documentation files into interconnected wiki pages through the MetaDocumentIngestionAgent, which handles content analysis, metadata extraction, and relationship mapping.

## Key Functionality

The architecture centers around the `MetaDocumentIngestionAgent` class, which implements a comprehensive document transformation pipeline:

- **Document Processing**: Transforms markdown files into structured wiki pages with intelligent content analysis
- **Category Mapping**: Automatically maps document types (philosophy, specification, progress) to appropriate wiki layers
- **Metadata Generation**: Creates frontmatter with relationships, tags, and categorization data
- **Content Management**: Handles token limits through intelligent truncation that preserves document structure
- **Cross-referencing**: Establishes connections between related wiki pages for navigation and discovery

The agent uses AI-powered analysis through Claude API integration to extract semantic meaning and generate appropriate categorization. A robust JSON parsing system handles API responses with progressive repair capabilities.

## Relationships

The multi-layer wiki architecture integrates with several core system components:

- **ClaudeClient**: Provides AI-powered document analysis and content transformation
- **PromptManager**: Supplies template-based processing for consistent output formatting
- **Agent Architecture**: Functions as part of the broader agent-based system pattern
- **Wiki System**: Connects through category mapping to establish the layered organization structure

## Usage Example

```javascript
const MetaDocumentIngestionAgent = require('./lib/agents/meta-document-ingestion-agent');

// Initialize the agent
const agent = new MetaDocumentIngestionAgent(claudeClient, promptManager);

// Process a documentation file into wiki format
const result = await agent.ingestDocument(sourceFilePath, content, options);

// The result contains structured wiki content with frontmatter and categorization
```

## Testing

No automated tests found for this component. Testing coverage should be implemented to validate document transformation accuracy, category mapping logic, and error handling for malformed content.