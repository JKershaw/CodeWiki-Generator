---
title: Link discovery and mention detection
category: component
sourceFile: lib/agents/documentation-writer-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Link Discovery and Mention Detection

## Purpose and Overview

This component provides intelligent hyperlink generation for wiki documentation by discovering page mentions within content and converting them into markdown links. It enables interconnected content discovery while preventing self-references and duplicate linking, ensuring that generated documentation maintains both navigability and integrity.

## Key Functionality

The component operates through several coordinated mechanisms:

- **Mention Discovery**: Delegates to `LinkDiscoveryAgent` to identify references to other pages within the content, abstracting the mention-finding logic from the linking process.

- **Self-Reference Prevention**: Filters out links that reference the current page being documented, avoiding circular self-references.

- **Duplicate Link Detection**: The `_isAlreadyLinked()` function detects if a mention is already within existing markdown link syntax, preventing double-linking and corruption of previously formatted links.

- **Markdown-Aware Formatting**: The `_createLink()` function generates markdown link syntax while preserving bold formatting markers (`**text**`), ensuring consistent visual presentation in the final documentation.

- **Position-Preserving Replacement**: Uses a position-based strategy to accurately replace mention text with links without disrupting surrounding content or other formatting.

## Relationships

- **LinkDiscoveryAgent**: This component depends on `LinkDiscoveryAgent` to perform the core work of identifying page mentions in content. The separation of concerns allows mention detection logic to evolve independently.

- **DocumentationWriterAgent**: Functions as part of the larger documentation generation workflow, integrated with existing `ClaudeClient` and `PromptManager` components.

- **Markdown Processing Pipeline**: The link detection algorithm works within a markdown syntax-aware context, parsing and manipulating links without corrupting existing formatting or structure.

## Usage Example

```javascript
// Within DocumentationWriterAgent
const linkDiscovery = new LinkDiscoveryAgent(/* dependencies */);

// Discover mentions in content and add cross-links
const contentWithLinks = await this.addCrossLinks(
  currentPageTitle,
  markdownContent,
  availablePages
);

// The function:
// 1. Discovers page mentions via LinkDiscoveryAgent
// 2. Filters out self-references
// 3. Checks each mention against existing links
// 4. Creates properly formatted markdown links
// 5. Returns updated content with new cross-references
```

## Testing

No automated tests are currently available for this component. Comprehensive test coverage is recommended, particularly for:

- Edge cases involving nested markdown formatting
- Self-reference filtering accuracy
- Detection of already-linked mentions
- Position accuracy when multiple mentions exist in content