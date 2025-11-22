---
title: Context-aware documentation generation
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Context-aware Documentation Generation

## Purpose and Overview

The context-aware documentation generation system automatically creates and updates wiki documentation by analyzing code commits and understanding the relationships between different parts of the codebase. It intelligently finds related wiki pages to provide context, enabling more accurate and comprehensive documentation generation.

## Key Functionality

### Commit Processing Workflow

The system processes commits through a coordinated multi-agent approach:

1. **File Analysis** - Identifies significant files using `isSignificantFile()` to filter out trivial changes
2. **Context Discovery** - Uses `getRelevantContext()` to find related wiki pages based on file paths and existing documentation
3. **Agent Coordination** - Orchestrates CodeAnalysisAgent and DocumentationWriterAgent to analyze code and generate documentation
4. **Page Management** - Maps concepts to standardized wiki pages using `determinePagePath()` for consistent organization

### Core Components

- **Processor Class** - Main orchestrator that manages the entire documentation generation workflow
- **processCommit()** - Handles single commit analysis and documentation updates
- **processConceptDocumentation()** - Creates or updates documentation for individual concepts identified in the code
- **getRelevantContext()** - Analyzes file paths and existing wiki structure to find contextually related pages

### Intelligent Context Awareness

The system goes beyond simple code analysis by:
- Analyzing file paths to understand architectural relationships
- Cross-referencing existing wiki pages to maintain consistency
- Providing relevant context to documentation agents for better output quality
- Mapping concepts to standardized kebab-case page paths for organized wiki structure

## Relationships

The context-aware documentation generation integrates with several key components:

- **WikiManager** - Handles all wiki page creation, updates, and retrieval operations
- **CodeAnalysisAgent** - Provides technical analysis of code changes and identifies concepts
- **DocumentationWriterAgent** - Generates human-readable documentation from analysis results
- **StateManager** - Tracks processing state and prevents duplicate work across commits

This creates a coordinated system where each component contributes specialized functionality while the Processor orchestrates the overall workflow.

## Usage Examples

### Processing a Feature Commit
```javascript
// Automatically processes all significant files in a commit
await processor.processCommit(commitHash);
```

### Custom File Significance Rules
The `isSignificantFile()` function can be extended to include project-specific rules for determining which files warrant documentation.

### Wiki Organization
Concepts are automatically mapped to consistent page paths (e.g., "User Authentication" becomes `/user-authentication`) ensuring predictable wiki structure.