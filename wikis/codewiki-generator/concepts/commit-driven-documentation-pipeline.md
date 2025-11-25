---
title: Commit-driven documentation pipeline
category: concept
sourceFile: lib/processor.js
related: [components/processor-class.md, meta/overview.md, concepts/file-significance-filtering.md]
created: 2025-11-25
updated: 2025-11-25
---

# Processor Orchestration Class

## Purpose and Overview

The Processor orchestration class serves as the central coordinator for the commit-driven documentation pipeline, managing the complete workflow from commit analysis to documentation generation. It delegates specialized tasks to dedicated agents (code analysis, documentation writing, tech debt assessment, security review) while orchestrating wiki management and state tracking to maintain automated, up-to-date project documentation.

## Key Functionality

The Processor class implements several core capabilities:

- **Commit Processing**: Analyzes commit data to identify significant file changes, filters out non-essential files (binary files, deletions), and extracts relevant code for documentation
- **Context-Aware Analysis**: Retrieves related wiki pages based on file paths to provide analyzers with existing documentation context, improving analysis quality through knowledge base integration
- **Concept-to-Page Mapping**: Converts identified code concepts into structured wiki pages using kebab-case naming conventions and category-based organization (components/ directory)
- **Agent Coordination**: Orchestrates multiple specialized agents (CodeAnalysisAgent, DocumentationWriterAgent, TechDebtAgent, SecurityAgent) through a unified interface
- **Repository-Wide Processing**: Supports both incremental commit-based updates and comprehensive repository analysis for complete documentation coverage

Key methods include `processCommit()` for handling individual commits, `isSignificantFile()` for filtering relevant changes, `getRelevantContext()` for wiki context retrieval, and `determinePagePath()` for consistent documentation organization.

## Relationships

The Processor integrates with several critical system components:

- **WikiManager**: Handles all wiki operations including page creation, updates, searches, and relationship management through methods like `getPage()`, `createPage()`, and `getRelatedPages()`
- **StateManager**: Manages processing state persistence and tracks documentation lifecycle across multiple commits using `loadState()` and state tracking capabilities
- **Analysis Agents**: Coordinates specialized agents for different analysis aspects - CodeAnalysisAgent for code understanding, DocumentationWriterAgent for content generation, TechDebtAgent for technical debt assessment, and SecurityAgent for security reviews
- **File System Integration**: Processes repository files and commit data to drive the documentation pipeline workflow

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with required managers and agents
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// Process a commit to generate documentation
await processor.processCommit(commitData);

// Process entire repository for comprehensive documentation
await processor.processRepository(repositoryPath);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive testing of core methods: `processCommit`, `isSignificantFile`, `getRelevantContext`, `determinePagePath`, and `processRepository`
- Validates complete processor workflow including manager coordination, agent orchestration, and the full commit-to-documentation pipeline