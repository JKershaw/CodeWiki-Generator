---
title: Progressive JSON parsing with repair
category: component
sourceFile: lib/agents/meta-document-ingestion-agent.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Progressive JSON parsing with repair

## Purpose and Overview

Progressive JSON parsing with repair is a robust error-handling component that processes AI-generated JSON responses with multiple fallback strategies. It addresses the common issue of malformed JSON from language models by implementing progressive repair techniques including markdown cleanup and content extraction.

## Key Functionality

The parsing system employs a multi-stage approach to handle unreliable JSON responses:

- **Primary parsing**: Attempts direct JSON parsing of the raw response
- **Markdown cleanup**: Strips markdown code block formatting (```json tags) that commonly wrap AI responses
- **Content extraction**: Uses regex patterns to extract JSON content from mixed-format responses
- **Graceful degradation**: Returns structured error information when all parsing attempts fail

The component maintains detailed logging at each stage, allowing developers to understand parsing failures and improve prompt engineering. It specifically handles common AI response patterns like markdown-wrapped JSON and partial JSON responses.

## Relationships

This component operates as part of the MetaDocumentIngestionAgent system:

- **Used by**: `ingestDocument()` method to process Claude AI responses
- **Integrates with**: ClaudeClient for receiving AI-generated content
- **Supports**: Wiki content generation pipeline through reliable JSON extraction
- **Part of**: Agent-based documentation transformation system

## Usage Example

```javascript
const agent = new MetaDocumentIngestionAgent(claudeClient, promptManager);

// The _parseJSON method is called internally during document processing
const result = await agent.ingestDocument(sourceContent, filePath);

// Progressive parsing handles various response formats:
// - Clean JSON: {"category": "concept", "title": "..."}
// - Markdown wrapped: ```json\n{"category": "concept"}\n```
// - Mixed content: "Here's the analysis:\n```json\n{...}\n```\nAdditional notes..."
```

## Testing

No automated tests found. The component would benefit from unit tests covering various malformed JSON scenarios and parsing edge cases to ensure robust handling of AI response variations.