---
title: Link discovery agent integration
category: component
sourceFile: lib/agents/documentation-writer-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Link Discovery Agent Integration

## Purpose and Overview

The link discovery agent integration enables intelligent cross-page hyperlinking within the documentation writer agent by delegating mention detection to a specialized LinkDiscoveryAgent. This separation of concerns allows the writer agent to focus on creating formatted links while the discovery agent handles the complex task of identifying related content across wiki pages.

## Key Functionality

The integration implements a **cross-page hyperlinking system** that converts text mentions into markdown links while preserving existing formatting:

- **Intelligent Link Creation**: Discovers mentions of other wiki pages within content and converts them to properly formatted markdown links
- **Format Preservation**: Maintains markdown formatting such as bold text when converting mentions to links, ensuring visual consistency
- **Duplicate Prevention**: Avoids creating self-references and duplicate links to maintain clean, readable documentation
- **Agent Separation**: Delegates mention detection logic to LinkDiscoveryAgent while handling the link formatting and insertion within the documentation writer

The system follows **markdown format preservation patterns** that ensure converted links maintain the original text styling, such as preserving bold formatting when transforming `**ComponentName**` mentions into `[**ComponentName**](./component-name)` links.

## Relationships

The link discovery integration connects several components within the documentation generation pipeline:

- **LinkDiscoveryAgent**: Performs the actual mention detection and provides discovered links to the documentation writer
- **Documentation Writer Agent**: Consumes discovered mentions and handles the markdown link creation and formatting
- **Wiki Pages**: Serves as both the source for mention discovery and the target for link generation
- **Cross-page Hyperlinking System**: Acts as the broader framework that coordinates link creation across the entire wiki structure

## Usage Example

```javascript
// Within documentation-writer-agent.js
const linkDiscoveryAgent = new LinkDiscoveryAgent(options);

// Delegate mention detection to specialized agent
const discoveredMentions = await linkDiscoveryAgent.findMentions(content);

// Process mentions and create formatted links while preserving markdown
const linkedContent = this.createLinksFromMentions(content, discoveredMentions);
```

## Testing

**Test Coverage**: No automated tests found for this specific integration. Testing would need to cover mention detection delegation, link formatting with preserved markdown styling, and prevention of duplicate/self-referential links.