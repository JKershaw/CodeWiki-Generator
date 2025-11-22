---
title: Commit-based documentation processing
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Commit-based Documentation Processing

## Purpose and Overview

The commit-based documentation processing system automatically generates and maintains wiki documentation by analyzing code changes as they occur in commits. This approach ensures documentation stays current with the codebase by treating each commit as a trigger for potential documentation updates.

## Key Functionality

### Processing Workflow

1. **Commit Analysis** - The `Processor` class examines each commit to identify modified files
2. **Significance Filtering** - Only files deemed significant through `isSignificantFile()` are processed
3. **Code Analysis** - The `CodeAnalysisAgent` extracts concepts, components, and relationships from modified code
4. **Context Discovery** - `getRelevantContext()` finds related existing wiki pages to provide background
5. **Documentation Generation** - The `DocumentationWriterAgent` creates or updates documentation using the analysis and context
6. **Page Management** - New documentation is saved to the wiki with standardized paths

### Multi-Agent Coordination

The system employs specialized agents that work together:
- **CodeAnalysisAgent** - Understands code structure and extracts meaningful concepts
- **DocumentationWriterAgent** - Generates human-readable documentation from technical analysis
- **Processor** - Orchestrates the workflow and manages state between agents

### Context-Aware Generation

The system intelligently finds related documentation by:
- Analyzing file paths to identify related concepts
- Searching existing wiki pages for relevant context
- Providing this context to documentation agents for more informed generation

## Relationships

- **WikiManager** - Handles all wiki page creation, updates, and retrieval operations
- **StateManager** - Tracks processing state and prevents duplicate work
- **File System** - Monitors commits and accesses modified files for analysis

## Key Components

### Processor Class

The main orchestrator that coordinates the entire workflow through:
- `processCommit()` - Entry point for commit-based processing
- `processConceptDocumentation()` - Handles individual concept documentation
- `determinePagePath()` - Maps concepts to standardized wiki page URLs

### File Significance Detection

The `isSignificantFile()` function filters out files that don't warrant documentation, focusing processing power on meaningful code changes rather than configuration files, build artifacts, or trivial modifications.

### Page Organization Strategy

Concepts are automatically mapped to kebab-case page paths, creating a consistent and predictable wiki structure that scales with codebase growth.