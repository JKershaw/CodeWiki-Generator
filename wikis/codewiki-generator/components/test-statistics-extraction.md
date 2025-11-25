---
title: Test Statistics Extraction
category: component
sourceFile: lib/test-coverage-analyzer.js
related: [components/flexible-test-file-discovery.md, meta/overview.md, components/test-coverage-analysis.md]
created: 2025-11-25
updated: 2025-11-25
---

# Test Statistics Extraction

## Purpose and [Overview](../meta/overview.md)

The Test Statistics Extraction component provides regex-based parsing capabilities to extract quantitative metrics from test files, including test counts, describe blocks, and test categories. It serves as a core utility for documentation generation and coverage reporting by analyzing the structure and content of test files.

## Key Functionality

- **Pattern-based Parsing**: Uses regular expressions to identify and count test constructs (`it()`, `test()`, `describe()`) within test files
- **Metrics Extraction**: Extracts comprehensive statistics including:
  - Total number of tests
  - Number of describe blocks
  - Test categories and organization patterns
- **Test Discovery Integration**: Works in conjunction with [flexible test file discovery](../components/flexible-test-file-discovery.md) to locate and analyze tests across various project structures
- **Coverage Analysis**: Generates structured data for test coverage reporting and documentation purposes

## Relationships

This component operates as part of the larger **[Test Coverage Analysis](../components/test-coverage-analysis.md)** system, working closely with:

- **[Flexible Test File Discovery](../components/flexible-test-file-discovery.md)**: Relies on discovered test files as input for statistical analysis
- **Test Coverage Analyzer**: Serves as the extraction engine within the broader coverage analysis workflow
- **Documentation Generation**: Provides structured metrics data for automated documentation creation

## Usage Example

```javascript
const TestCoverageAnalyzer = require('./lib/test-coverage-analyzer');

// Initialize analyzer with project path
const analyzer = new TestCoverageAnalyzer('/test/project');

// Analyze a source file for test statistics
const result = await analyzer.analyzeFile('src/component.js');

// Result structure:
// {
//   hasTests: boolean,
//   testFile: string|null,
//   totalTests: number,
//   describeBlocks: number,
//   testCategories: array
// }
```

## Testing

**Test Coverage**: tests/unit/test-coverage-analyzer.test.js
- **42 test cases** across **19 test suites**
- **Test categories**: TestCoverageAnalyzer, analyzeFile, Processor, Component, method1, method2, Creation, Usage, generateSummary, _findTestFile, _extractTestStats, Method 1, Method 2
- Comprehensive coverage of extraction logic, edge cases, and integration scenarios