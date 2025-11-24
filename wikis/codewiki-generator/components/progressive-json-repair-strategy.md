---
title: Progressive JSON repair strategy
category: component
sourceFile: lib/agents/meta-document-ingestion-agent.js
related: [_history/components/progressive-json-repair-strategy/2025-11-24T14-38-56.md]
created: 2025-11-24
updated: 2025-11-24
---

# [Progressive JSON repair strategy](../_history/components/progressive-json-repair-strategy/2025-11-24T14-38-56.md)

## Purpose and Overview

The [Progressive JSON repair strategy](../_history/components/progressive-json-repair-strategy/2025-11-24T14-38-56.md) implements robust parsing of LLM responses with multiple fallback mechanisms for handling malformed JSON, code blocks, and response wrapper text. This component ensures reliable data extraction from Claude API responses even when the JSON is partially corrupted or wrapped in markdown formatting.

## Key Functionality

The strategy operates through the `_parseJSON` method which attempts multiple parsing approaches in sequence:

1. **Direct parsing** - Attempts standard JSON.parse() on the raw response
2. **Code block extraction** - Strips markdown code fences and tries parsing the inner content
3. **Response wrapper removal** - Removes common LLM response text that may wrap the actual JSON
4. **Progressive cleaning** - Applies increasingly aggressive text cleaning strategies

This multi-layered approach handles common failure modes in LLM-generated JSON responses, such as:
- Markdown code block formatting (`json` blocks)
- Explanatory text before or after the JSON
- Incomplete or truncated responses
- Special character encoding issues

The strategy integrates with the [intelligent content truncation](../components/intelligent-content-truncation.md) system to ensure that even when source documents are truncated to fit token limits, the resulting JSON parsing remains robust.

## Relationships

This component operates within the MetaDocumentIngestionAgent and connects to:

- **ClaudeClient** - Processes responses from Claude API calls that may contain malformed JSON
- **PromptManager** - Works with template-generated prompts that expect JSON responses
- **[Meta-document ingestion system](../concepts/meta-document-ingestion-system.md)** - Provides reliable data extraction for wiki page generation
- **[Intelligent content truncation](../components/intelligent-content-truncation.md)** - Ensures parsing works even with truncated source content

## Usage Example

```javascript
const MetaDocumentIngestionAgent = require('./lib/agents/meta-document-ingestion-agent.js');

const agent = new MetaDocumentIngestionAgent(claudeClient, promptManager);
const sourceFile = 'PROJECT_PHILOSOPHY.md';
const content = fs.readFileSync(sourceFile, 'utf8');

// The _parseJSON method is used internally during document ingestion
const result = await agent.ingestDocument(sourceFile, content);
// Returns structured wiki data with metadata extracted via progressive JSON parsing
```

## Testing

No automated tests found for this component.