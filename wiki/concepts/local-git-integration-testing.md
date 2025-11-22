---
title: Local Git Integration Testing
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Local Git Integration Testing

## Purpose and Overview

Local Git Integration Testing enables the documentation generator to test itself on its own codebase without requiring GitHub API access. This self-hosted testing approach validates the tool's functionality while providing real-world examples of output quality.

## Key Functionality

### Git Command Line Integration
- **`getLocalCommits`** extracts commit history, file changes, and diffs directly from the local git repository using shell commands
- Bypasses GitHub API limitations and provides immediate access to repository data
- Returns structured data compatible with the main processor's expected format

### GitHub Client Mocking Strategy
- Replaces the external GitHub API dependency with local data sources through dependency injection
- Maintains the same interface as the production GitHub client while sourcing data from local git commands
- Enables isolated testing without network dependencies or API rate limits

### Self-Documentation Workflow
- **`test-run-local.js`** serves as a standalone test script that processes the tool's own repository
- Uses the same `Processor` class and configuration options as the production workflow
- Outputs results to `generated-wiki/` directory to avoid conflicts with development documentation

## Relationships

- **Depends on**: `lib/processor.js` Processor class for core analysis functionality
- **Mocks**: GitHub client interface from the main processor workflow
- **Integrates with**: Local git repository through shell command execution
- **Outputs**: Compatible markdown documentation using the same templates and formatting

## Usage Examples

### Running Local Testing
```bash
node test-run-local.js
```

### Key Configuration
- Uses local git repository as data source
- Processes recent commits (configurable count)
- Applies same analysis options as production workflow
- Generates statistics and documentation files

### Output Structure
- Documentation files written to `generated-wiki/` directory
- Includes concept analysis, component documentation, and relationship mapping
- Provides processing statistics and validation of tool functionality

This testing approach demonstrates practical dependency injection patterns and provides a reliable method for validating tool behavior during development.