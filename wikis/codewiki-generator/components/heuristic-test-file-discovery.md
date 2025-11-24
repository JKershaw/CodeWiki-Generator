---
title: Heuristic Test File Discovery
category: component
sourceFile: lib/test-coverage-analyzer.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Heuristic Test File Discovery

## Purpose and Overview

The `TestCoverageAnalyzer` analyzes test coverage for source files by automatically discovering and examining corresponding test files across a project. It enables documentation generation tools to automatically include test coverage metrics without requiring external configuration, making it adaptable to various testing frameworks and project structures.

## Key Functionality

The analyzer uses a heuristic approach to discover test files by checking multiple naming patterns and directory conventions (supporting Jest, Mocha, and similar frameworks). Once a test file is located, it performs static analysis using regex pattern matching to extract test metadata including test counts, describe blocks, and test categories—all without executing test code.

**Core Operations:**

- **Test File Discovery**: Checks multiple naming patterns (e.g., `*.test.js`, `*.spec.js`) and directory conventions (e.g., `__tests__`, `test/`) to locate test files corresponding to source files
- **Static Analysis**: Parses test file content to extract test statistics (test count, suite count, test categories) through regex pattern matching
- **Coverage Summarization**: Generates formatted markdown-style summaries suitable for inclusion in source documentation

## Relationships

The `TestCoverageAnalyzer` integrates into documentation generation pipelines as an analyzer component that enriches source file documentation with test coverage information. It operates independently through file system operations to discover and read test files, making it compatible with various project structures and testing setups.

## Usage Example

```javascript
const TestCoverageAnalyzer = require('./lib/test-coverage-analyzer');

// Initialize analyzer with project root path
const analyzer = new TestCoverageAnalyzer('/path/to/project');

// Analyze test coverage for a source file
const coverage = await analyzer.analyzeFile('src/utils/helper.js');

// Generate markdown summary for documentation
const summary = await analyzer.generateSummary();
```

The `analyzeFile` method returns an object containing:
- `hasTests`: Boolean indicating if tests exist
- `testFile`: Path to the discovered test file
- `totalTests`: Count of individual tests found
- `describeBlocks`: Count of test suites/describe blocks
- `testCategories`: Array of test category labels

Returns empty results when no test file is found or when the source file path is unspecified.

## Testing

This component is covered by comprehensive unit tests:

- **Test File**: `tests/unit/test-coverage-analyzer.test.js`
- **Test Coverage**: 42 test cases across 19 test suites
- **Categories Tested**: Component creation, initialization, `analyzeFile`, `_findTestFile`, `_extractTestStats`, `generateSummary`, and edge case handling