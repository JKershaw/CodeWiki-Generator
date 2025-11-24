---
title: Output normalization and cleaning
category: component
sourceFile: lib/agents/architecture-overview-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Output Normalization and Cleaning

## Purpose and Overview

Output normalization and cleaning is a post-processing mechanism that ensures Claude AI-generated architecture documentation maintains consistent markdown formatting. This component removes extraneous markdown code block wrappers and frontmatter that Claude may include in its responses, producing clean, immediately usable documentation suitable for project wikis.

## Key Functionality

The `_cleanMarkdown` method handles the transformation of raw Claude output into standardized markdown:

- **Removes markdown code blocks**: Strips outer ` ```markdown ` and ` ``` ` wrappers that Claude wraps around generated content
- **Eliminates frontmatter**: Removes YAML/TOML frontmatter blocks (delimited by `---` or `+++`) that may appear at the beginning of responses
- **Preserves internal formatting**: Maintains all inner markdown structure, code examples, and formatting within the cleaned content

This is critical because Claude's output formatting can be inconsistent—sometimes it wraps entire responses in code blocks for safety, or includes metadata headers. The cleaning step normalizes this variability into valid markdown.

The cleaning process integrates into the main `generateArchitectureOverview` workflow as a final step before returning the generated architecture documentation.

## Relationships

- **ArchitectureOverviewAgent**: The `_cleanMarkdown` method operates as a private utility within this class
- **ClaudeClient**: Receives raw, potentially inconsistent output from Claude API that requires normalization
- **Output documentation**: Produces clean markdown that feeds directly into documentation files (e.g., `architecture.md`)
- **Other formatting methods**: Works alongside `_formatConcepts`, `_formatComponents`, and `_formatGuides` which normalize *input* data; this method normalizes *output* data

## Usage Example

```javascript
const ArchitectureOverviewAgent = require('./lib/agents/architecture-overview-agent');

const agent = new ArchitectureOverviewAgent(claudeClient, promptManager);

// generateArchitectureOverview internally calls _cleanMarkdown on Claude's response
const cleanedMarkdown = await agent.generateArchitectureOverview(
  wikiData.concepts,
  wikiData.components,
  wikiData.guides
);

// Result is clean markdown ready for documentation
console.log(cleanedMarkdown);
```

The cleaning happens automatically within `generateArchitectureOverview` as the final processing step, ensuring the returned markdown is normalized regardless of Claude's formatting choices.

## Testing

No automated tests are currently available for this component. Test coverage should validate:
- Removal of markdown code block wrappers
- Elimination of YAML/TOML frontmatter variants
- Preservation of internal markdown structure and links
- Handling of edge cases (nested code blocks, multiple frontmatter sections)