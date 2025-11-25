---
title: Multi-agent documentation generation architecture
category: concept
sourceFile: lib/processor.js
related: [meta/overview.md, components/code-analysis-agent.md, components/documentation-writer-agent.md, components/wiki-index-agent.md, concepts/file-significance-filtering.md]
created: 2025-11-25
updated: 2025-11-25
---

# Multi-agent documentation generation architecture

## Purpose and [Overview](../meta/overview.md)

The multi-agent documentation generation architecture is the core orchestration system that coordinates specialized agents to generate comprehensive documentation for codebases. This architecture enables modular, composable documentation generation by having different agents focus on specific aspects like code analysis, writing, guide generation, and wiki management.

## Key Functionality

The processor implements a multi-agent pattern where specialized agents collaborate to analyze code and generate documentation:

- **[Code Analysis Agent](../components/code-analysis-agent.md)** - Analyzes source code to identify concepts and components
- **[Documentation Writer Agent](../components/documentation-writer-agent.md)** - Generates written documentation from analysis results
- **Meta Analysis Agent** - Provides higher-level insights and relationships
- **[Wiki Index Agent](../components/wiki-index-agent.md)** - Manages wiki structure and navigation
- **Guide Generation Agent** - Synthesizes operational guides from repository structure analysis

The system features category-based content organization, filtering wiki pages by metadata categories (component, concept) to create structured documentation. Repository structure analysis detects technology stacks and frameworks to generate context-aware guides. Graceful failure handling ensures the documentation pipeline continues even if individual agents fail, with warning logging rather than hard failures.

## Relationships

The processor serves as the central orchestrator that coordinates multiple specialized agents and managers:

- Integrates with `WikiManager` for page creation and content management
- Uses `StateManager` for maintaining processing state across runs  
- Coordinates multiple analysis agents (code, tech debt, security) for comprehensive coverage
- Implements [file significance filtering](../concepts/file-significance-filtering.md) and context determination for efficient processing
- Connects to existing wiki infrastructure while maintaining the established agent pattern

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

// Process a repository
await processor.processRepository(repositoryPath);

// Process specific commits
await processor.processCommit(commitHash, changedFiles);
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Comprehensive testing of core functionality including `processCommit`, `isSignificantFile`, `getRelevantContext`, `determinePagePath`, and `processRepository`
- Tests validate agent coordination, error handling, and content organization patterns