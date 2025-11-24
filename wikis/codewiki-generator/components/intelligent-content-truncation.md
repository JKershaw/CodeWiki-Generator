---
title: Intelligent content truncation
category: component
sourceFile: lib/agents/meta-document-ingestion-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Intelligent Content Truncation

## Purpose and Overview

The intelligent content truncation component preserves document structure and context when content exceeds token limits by keeping the first 60% and last 40% of the original text. This approach maintains both the introduction/setup and conclusion/key outcomes while respecting LLM processing constraints.

## Key Functionality

The truncation strategy operates on the principle that document beginnings and endings contain the most critical information. When content needs to be shortened:

- **Structure Preservation**: Maintains document flow by keeping opening context and concluding information
- **Smart Splitting**: Calculates content boundaries based on character count rather than arbitrary cutoffs  
- **Context Retention**: Ensures both setup information and final outcomes remain accessible
- **Token Management**: Respects processing limits while maximizing information density

The component splits content at the 60% mark, discards the middle portion, and appends the final 40% with a clear truncation indicator. This prevents loss of critical document structure that would occur with simple head-only or tail-only truncation.

## Relationships

The intelligent content truncation integrates with several system components:

- **Meta-Document Ingestion Agent**: Primary consumer that applies truncation during document processing
- **ClaudeClient Integration**: Respects token limits for LLM processing while maximizing usable content
- **Wiki Page Generation**: Ensures truncated content maintains readability and coherence in generated pages
- **Progressive JSON Repair**: Works alongside other content processing strategies to handle various edge cases

## Usage Example

```javascript
const MetaDocumentIngestionAgent = require('./lib/agents/meta-document-ingestion-agent');

const agent = new MetaDocumentIngestionAgent();
const longContent = "Very long document content that exceeds token limits...";

// Truncation happens internally during document processing
const result = await agent.ingestDocument({
  filePath: './docs/long-specification.md',
  content: longContent
});

// Content is intelligently truncated while preserving structure
console.log(result.content); // Contains first 60% + last 40% with truncation marker
```

## Testing

No automated tests found for this component. Testing coverage should include validation of boundary calculations, content preservation accuracy, and integration with the broader ingestion pipeline.