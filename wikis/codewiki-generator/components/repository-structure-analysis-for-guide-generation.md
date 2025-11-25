---
title: Repository structure analysis for guide generation
category: component
sourceFile: lib/processor.js
related: [meta/overview.md, concepts/multi-agent-documentation-generation-architecture.md, concepts/category-based-wiki-content-organization.md]
created: 2025-11-25
updated: 2025-11-25
---

# Repository Structure Analysis for Guide Generation

## Purpose and [Overview](../meta/overview.md)

The repository structure analysis component scans directory structures and file patterns to extract repository metadata (language, framework, architecture) that informs automated guide generation. It enables the documentation system to create context-aware operational guides tailored to the specific technology stack being documented.

## Key Functionality

- **Directory Scanning**: Traverses repository file structure to identify technology patterns and frameworks
- **Metadata Extraction**: Detects programming languages, build tools, and architectural patterns from file presence and naming conventions
- **Context Building**: Aggregates repository information to provide contextual input for guide generation
- **Framework Detection**: Identifies specific frameworks and tools based on configuration files and project structure
- **Integration Support**: Feeds structured repository data to the GuideGenerationAgent for targeted documentation synthesis

The component works by analyzing file extensions, configuration files, directory naming patterns, and project structure to build a comprehensive profile of the codebase that guides the documentation generation process.

## Relationships

This component integrates within the [multi-agent documentation generation architecture](../concepts/multi-agent-documentation-generation-architecture.md) as a supporting service:

- **Feeds GuideGenerationAgent**: Provides repository context data that influences guide content and structure
- **Supports Processor Pipeline**: Functions as part of the broader documentation processing workflow in `lib/processor.js`
- **Complements Wiki Infrastructure**: Works alongside [category-based wiki content organization](../concepts/category-based-wiki-content-organization.md) to create structured, technology-specific documentation
- **Enables Context-Aware Generation**: Allows other agents to tailor their output based on detected repository characteristics

## Usage Example

```javascript
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// Repository analysis occurs during processing
const result = await processor.processRepository(repositoryPath);
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Covers Processor initialization, commit processing, file significance detection, context retrieval, page path determination, and repository processing workflows
- Includes comprehensive mocking of dependencies and validation of integration patterns