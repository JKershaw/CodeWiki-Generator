---
title: Category-based documentation organization
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Category-based Documentation Organization

## Purpose and Overview

The `lib/processor.js` module implements a category-based guide generation system that organizes and filters wiki documentation by metadata categories (components, concepts) to create targeted operational guides. This system extends the documentation pipeline with specialized guide generation capabilities, enabling the creation of focused, contextually-aware documentation that maps to the codebase's actual structure and categorization.

## Key Functionality

### Guide Generation Workflow

The `generateWikiGuides()` function orchestrates the complete guide generation process:

1. **Content Collection**: Retrieves all wiki pages using `WikiManager.getAllPages()`
2. **Categorization**: Filters pages by metadata categories (components, concepts) to organize documentation hierarchically
3. **Repository Analysis**: Invokes `detectRepositoryInfo()` to scan the repository file structure and extract technology stack, configuration, and file type information
4. **Guide Generation**: Delegates to `GuideGenerationAgent` for intelligent analysis and guide creation based on collected metadata and repository context
5. **Persistence**: Saves generated guides back to the wiki for accessibility

### Repository Introspection

The `detectRepositoryInfo()` function analyzes the codebase structure to extract:
- Technology stack detection (frameworks, languages, tools in use)
- File type distribution and patterns
- Configuration file presence and types

This information contextualizes guide generation, ensuring guides reflect the actual repository environment.

### Directory Scanning

The `scanDir()` utility recursively traverses the repository while:
- Excluding hidden directories (prefixed with `.`)
- Filtering out `node_modules` and similar dependency directories
- Collecting file paths for systematic analysis

## Relationships

- **Agent Pattern Integration**: `GuideGenerationAgent` follows the established pattern of specialized agents (`CodeAnalysisAgent`, `DocumentationWriterAgent`, `MetaAnalysisAgent`, `WikiIndexAgent`) that handle focused documentation tasks
- **Pipeline Sequencing**: Guide generation executes before `generateWikiIndex()`, establishing guides as prerequisite documentation
- **WikiManager Dependency**: Relies on `WikiManager.getAllPages()` to access categorized wiki content
- **Complementary Analysis**: Repository introspection enhances existing code analysis functionality with richer contextual information
- **Error Handling**: Implements graceful degradation—guide generation failures are logged as warnings without halting the overall processing pipeline

## Usage Example

```javascript
const processor = new Processor(wikiManager, stateManager, codeAnalysisAgent, docWriterAgent);

// The guide generation workflow runs as part of repository processing
await processor.generateWikiGuides();

// Generated guides are automatically persisted to the wiki
// and become available through wiki queries and indexes
```

## Testing

Test coverage is comprehensive with **26 test cases** across **6 test suites** in `tests/unit/processor.test.js`:

- **Processor**: Core functionality tests
- **processCommit**: Commit processing logic
- **isSignificantFile**: File significance determination
- **getRelevantContext**: Context extraction for documentation
- **determinePagePath**: Wiki path resolution
- **processRepository**: Full repository processing workflow

The test suite validates the complete guide generation pipeline including agent integration, wiki persistence, and error handling behavior.