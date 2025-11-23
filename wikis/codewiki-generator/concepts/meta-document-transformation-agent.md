---
title: Meta-document transformation agent
category: concept
sourceFile: lib/agents/meta-document-ingestion-agent.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Meta-document transformation agent

## Purpose and Overview

The Meta-document transformation agent is a specialized AI-powered component that converts root-level documentation files (philosophy, specifications, progress notes) into structured wiki content. It automatically categorizes content, generates cross-references, and creates proper frontmatter for integration into the codebase documentation system.

## Key Functionality

The agent processes markdown documents through several key operations:

- **Document Analysis**: Analyzes source content to determine appropriate categories, tags, and relationships
- **Intelligent Truncation**: Preserves document structure when content exceeds token limits by keeping beginning and end portions while maintaining readability
- **JSON Response Handling**: Implements progressive parsing with repair strategies to handle malformed AI-generated JSON responses, including markdown cleanup and content extraction
- **Frontmatter Generation**: Creates structured metadata including categories, tags, layer mappings, and relationship information
- **Cross-referencing**: Identifies and establishes connections between documents for wiki navigation

The transformation process leverages Claude AI for content analysis and restructuring, with robust error handling for parsing responses that may contain formatting issues or incomplete JSON.

## Relationships

The agent integrates with several core system components:

- **ClaudeClient**: Processes document content through AI analysis and transformation
- **PromptManager**: Renders templates for consistent AI prompt formatting
- **Wiki System**: Generates compatible frontmatter and content structure
- **Agent Framework**: Part of the broader agent-based documentation processing pipeline

## Usage Example

```javascript
const MetaDocumentIngestionAgent = require('./lib/agents/meta-document-ingestion-agent');

const agent = new MetaDocumentIngestionAgent({
  claudeClient: claudeInstance,
  promptManager: promptInstance
});

const result = await agent.ingestDocument({
  filePath: 'docs/philosophy.md',
  content: markdownContent,
  sourceType: 'philosophy'
});

// Result contains structured wiki content with frontmatter
const wikiPage = agent.generateFrontmatter(result);
```

## Testing

No automated tests are currently available for this component.