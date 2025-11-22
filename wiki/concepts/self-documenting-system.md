---
title: Self-documenting system
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Self-documenting System

The self-documenting system enables the codebase to analyze and document itself by examining its own git history instead of relying on external repositories. This provides a way to generate comprehensive documentation about the system's own evolution and structure without incurring API costs or requiring external access.

## Key Functionality

The system works by substituting the standard GitHub API integration with local git commands to extract the same type of information:

- **Local Git Integration**: Directly queries the local repository using git commands to retrieve commit history, file changes, and patches
- **Mock Client Pattern**: Replaces the GitHub API client with a local data source while maintaining the same interface and data structure
- **Existing Processing Pipeline**: Leverages the same `Processor` class and analysis logic used for external repositories

The `getLocalCommits` function serves as the core extraction mechanism, gathering commit data with file modifications and generating patches that mirror the structure expected by the standard processing workflow.

## Relationships

The self-documenting system integrates seamlessly with existing components:

- **Reuses Processor Class**: Uses the same `lib/processor` logic for analysis and documentation generation
- **Maintains Output Structure**: Generates documentation in the same wiki directory format as external repository analysis
- **Preserves Cost Controls**: Applies identical cost limiting and processing constraints as the main system
- **Shares Configuration**: Uses the same processor configuration options and parameters

## Usage

The self-documentation process runs through the `generate-self-wiki.js` script:

```bash
node scripts/generate-self-wiki.js
```

The `main` function orchestrates the entire process by:
1. Configuring the processor with local git integration
2. Setting up cost limits and processing parameters
3. Executing the analysis using local commit data
4. Generating documentation output to the standard wiki structure

## Local vs Remote Processing

Key differences from external repository analysis:

- **No API Rate Limits**: Direct git access eliminates GitHub API constraints
- **Complete History Access**: Can analyze the full repository history without pagination limits
- **Real-time Data**: Accesses current state without API caching delays
- **Enhanced File Context**: Direct file system access provides richer context for analysis