---
title: Test coverage documentation system
category: concept
sourceFile: lib/test-coverage-analyzer.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Test Coverage Analyzer

## Purpose and Overview

The Test Coverage Analyzer automatically discovers and analyzes test files to provide test coverage insights for documentation generation. It follows convention-based patterns to find test files, extract statistics, and generate formatted summaries for inclusion in project documentation.

## Key Functionality

- **Test File Discovery**: Locates test files using common naming patterns and directory structures (e.g., `*.test.js`, `*.spec.js`)
- **Statistics Extraction**: Parses test file content to count test cases, describe blocks, and categorize tests
- **Summary Generation**: Creates formatted markdown output summarizing test coverage information
- **Convention-Based Analysis**: Works with standard test file organization patterns without requiring configuration

The analyzer processes source files by searching for corresponding test files, analyzing their structure, and extracting meaningful statistics like total test count, test suites, and test categories.

## Relationships

- Integrates with the documentation generation system to automatically include test coverage information
- Uses file system operations to discover and read test files across the project
- Follows established test file naming conventions and directory structures
- Outputs markdown-formatted summaries that can be embedded in generated documentation

## Usage Example

```javascript
const TestCoverageAnalyzer = require('./lib/test-coverage-analyzer');

// Initialize analyzer with project test directory
const analyzer = new TestCoverageAnalyzer('/test/project');

// Analyze coverage for a specific source file
const result = await analyzer.analyzeFile('src/component.js');
console.log(result);
// {
//   hasTests: true,
//   testFile: 'tests/component.test.js',
//   totalTests: 15,
//   describeBlocks: 3,
//   testCategories: ['Creation', 'Usage', 'Error handling']
// }

// Generate markdown summary for documentation
const summary = analyzer.generateSummary(result);
```

## Testing

**Test Coverage**: tests/unit/test-coverage-analyzer.test.js
- 42 test cases across 19 test suites
- Comprehensive coverage of core functionality including file analysis, test discovery, and summary generation
- Test categories include: TestCoverageAnalyzer, analyzeFile, Processor, Component methods, Creation, Usage, generateSummary, _findTestFile, _extractTestStats