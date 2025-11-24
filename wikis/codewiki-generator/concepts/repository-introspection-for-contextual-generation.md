---
title: Repository introspection for contextual generation
category: concept
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Guide Generation Agent

## Purpose and Overview

The Guide Generation Agent orchestrates the creation of operational guides from wiki documentation by analyzing repository characteristics and leveraging Claude AI for intelligent content generation. It bridges existing wiki knowledge with context-aware, project-specific documentation by detecting repository traits (test frameworks, CI/CD systems, package managers, TypeScript, Docker) and using them to tailor generated guides.

## Key Functionality

### Primary Operations

**generateGuides(wikiData)**
- Accepts structured wiki data containing concepts and components
- Detects repository characteristics through file system introspection
- Formats wiki structure and repository metadata for Claude API consumption
- Sends crafted prompts to Claude AI for guide generation
- Validates and returns structured guide output

**detectRepositoryInfo()**
- Analyzes project files to identify:
  - Test frameworks (Jest, Mocha, Vitest, etc.)
  - CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins, CircleCI, etc.)
  - Package managers (npm, yarn, pnpm, etc.)
  - TypeScript configuration
  - Docker setup
- Returns metadata used as context for generation

**Wiki Structure Formatting**
- `_formatWikiStructure()` converts wiki concepts and components into readable prompt context
- `_formatRepositoryInfo()` transforms detected repository metadata into human-readable format
- Both methods prepare data for inclusion in Claude prompts

### Generation Pattern

The agent follows a consistent workflow:
1. Accept wiki data and repository context
2. Introspect the file system for project characteristics
3. Format wiki content and repository info for AI consumption
4. Delegate content generation to Claude API via PromptManager templates
5. Validate structured JSON response from Claude
6. Return validated guide structure

## Relationships

- **Dependencies**: Uses `ClaudeClient` for API communication and `PromptManager` for prompt template rendering
- **Architecture**: Part of a multi-agent documentation system; sibling to other specialized documentation agents
- **Input**: Consumes wiki data structure (concepts and components array)
- **Output**: Validates and returns JSON-structured guides
- **Role**: Acts as the contextual generation layer between raw wiki data and Claude AI

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();

const wikiData = {
  concepts: [
    { name: 'caching', category: 'concept', description: '...' }
  ],
  components: [
    { name: 'CacheManager', type: 'class', description: '...' }
  ]
};

const guides = await agent.generateGuides(wikiData);
// Returns validated guide structure tailored to repository characteristics
```

## Testing

No automated tests are currently available for this component. Testing should validate:
- Repository introspection accuracy across different project configurations
- Wiki data formatting correctness
- Claude API response validation
- Guide structure compliance with expected schema