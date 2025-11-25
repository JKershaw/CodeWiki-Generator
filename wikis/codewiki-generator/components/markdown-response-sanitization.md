---
title: Markdown Response Sanitization
category: component
sourceFile: lib/agents/documentation-writer-agent.js
related: [components/documentation-writer-agent.md, concepts/agent-based-documentation-pipeline.md, meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Markdown Response Sanitization

## Purpose and [Overview](../meta/overview.md)

Markdown Response Sanitization is a utility pattern that cleans Claude's markdown output by removing extraneous code block wrappers that the AI model may add around responses. This ensures consistent documentation format when generating wiki content through the [Documentation Writer Agent](../components/documentation-writer-agent.md).

## Key Functionality

The sanitization process removes markdown code block delimiters (triple backticks) that Claude sometimes wraps around its entire response, even when the content isn't meant to be displayed as a code block. This cleaning step is essential for maintaining proper markdown formatting in generated documentation, preventing the wiki content from being incorrectly rendered as code instead of formatted text.

The sanitization happens as part of the documentation generation pipeline, processing Claude's raw response before it's saved or returned as final documentation content.

## Relationships

This component operates within the [Documentation Writer Agent](../components/documentation-writer-agent.md) (`lib/agents/documentation-writer-agent.js`) as part of the [agent-based documentation pipeline](../concepts/agent-based-documentation-pipeline.md). It works in conjunction with:

- **[Documentation Writer Agent](../components/documentation-writer-agent.md)** - Uses this sanitization pattern to clean responses from Claude API
- **ClaudeClient** - Processes the raw responses from Claude before sanitization
- **[Agent-based Documentation Pipeline](../concepts/agent-based-documentation-pipeline.md)** - Fits into the modular workflow where specialized agents handle distinct documentation tasks

## Usage Example

```javascript
// Within the Documentation Writer Agent
const response = await claudeClient.generateResponse(prompt);

// Sanitize markdown by removing code block wrappers
const sanitizedContent = response
  .replace(/^```markdown\n/, '')
  .replace(/\n```$/, '')
  .trim();

return sanitizedContent;
```

## Testing

No automated tests found for this component.