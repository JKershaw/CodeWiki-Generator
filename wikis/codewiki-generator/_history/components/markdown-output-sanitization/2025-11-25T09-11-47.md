---
title: Markdown output sanitization
category: component
sourceFile: lib/agents/architecture-overview-agent.js
related: [components/architecture-overview-agent.md, meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Markdown Output Sanitization

## Purpose and [Overview](../meta/overview.md)

Markdown output sanitization implements cleaning logic to strip code blocks and frontmatter from LLM-generated content, ensuring consistent documentation artifacts. This component addresses the common issue of language models returning formatted output that includes unwanted markdown decorations or metadata headers.

## Key Functionality

The sanitization process removes specific markdown elements that can interfere with clean documentation generation:

- **Code block removal** - Strips triple-backtick code fences and their contents from LLM responses
- **Frontmatter cleaning** - Removes YAML/metadata headers that models sometimes include
- **Output normalization** - Ensures consistent formatting independent of model-specific output quirks

The sanitization occurs as a post-processing step after receiving responses from the Claude API, transforming raw LLM output into clean markdown suitable for documentation files.

## Relationships

This component operates within the [ArchitectureOverviewAgent](../components/architecture-overview-agent.md) workflow:

- **Integrates with ArchitectureOverviewAgent** - Used as the final step in the documentation generation pipeline
- **Post-processes Claude API responses** - Cleans output from LLM calls before writing to architecture.md
- **Supports multi-category wiki aggregation** - Ensures clean formatting regardless of the complexity of input data types (concepts, components, guides)

## Usage Example

```javascript
const ArchitectureOverviewAgent = require('./lib/agents/architecture-overview-agent');

const agent = new [ArchitectureOverviewAgent](../components/architecture-overview-agent.md)();
// Sanitization occurs internally during the generation process
// Raw LLM output is automatically cleaned before final output
const cleanedContent = agent.generateArchitectureOverview(wikiData);
```

## Testing

No automated tests found for this component.