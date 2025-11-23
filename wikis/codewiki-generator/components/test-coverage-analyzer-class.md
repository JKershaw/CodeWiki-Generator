---
title: TestCoverageAnalyzer class
category: component
sourceFile: lib/test-coverage-analyzer.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# TestCoverageAnalyzer Class

## Purpose and Overview

The TestCoverageAnalyzer class provides automated test coverage analysis for source files in a documentation generation system. It discovers test files using common naming patterns and directory structures, then extracts test statistics and generates formatted summaries for inclusion in project documentation.

## Key Functionality

- **Test File Discovery**: Automatically finds test files using convention-based patterns and directory structures
- **Statistics Extraction**: Parses test file content to count tests, describe blocks, and categorize test types
- **Coverage Analysis**: Analyzes test coverage for individual source files and generates comprehensive reports
- **Summary Generation**: Creates formatted markdown text summarizing test coverage information for documentation output

The analyzer works by taking a source file path and searching for corresponding test files, then parsing those files to extract meaningful statistics about test coverage and organization.

## Relationships

- Integrates with documentation generation systems to provide test coverage information
- Uses file system operations to discover and analyze test files across the project
- Follows convention-based test file discovery patterns to locate relevant test files
- Outputs formatted markdown content that can be embedded in generated documentation

## Usage Example

```javascript
const TestCoverageAnalyzer = require('./lib/test-coverage-analyzer');

// Initialize analyzer with project test directory
const analyzer = new TestCoverageAnalyzer('/test/project');

// Analyze test coverage for a source file
const result = await analyzer.analyzeFile('src/my-component.js');

// Generate markdown summary
const summary = analyzer.generateSummary(result);
```

The `analyzeFile` method returns an object with test coverage details including:
- `hasTests`: Boolean indicating if tests were found
- `testFile`: Path to the discovered test file
- `totalTests`: Number of test cases found
- `describeBlocks`: Number of describe blocks
- `testCategories`: Array of test category names

## Testing

**Test Coverage**: tests/unit/test-coverage-analyzer.test.js
- 42 test cases across 19 test suites
- Comprehensive coverage including edge cases like missing source files and various test file patterns
- Test categories cover core functionality: TestCoverageAnalyzer, analyzeFile, _findTestFile, _extractTestStats, generateSummary, and various processing methods