---
title: Test File Discovery by Convention
category: component
sourceFile: lib/test-coverage-analyzer.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Test File Discovery by Convention

## Purpose and Overview

Test File Discovery by Convention implements an automated system for locating test files using established naming and directory patterns without requiring explicit configuration. This component enables documentation generators to automatically identify and analyze test coverage by searching for common test file patterns such as `.test.js`, `.spec.js`, and conventional test directories like `__tests__`, `unit`, and `integration`.

## Key Functionality

The component discovers test files through multiple conventional patterns:

- **Directory-based discovery**: Searches `unit/`, `integration/`, and `__tests__/` directories
- **Naming convention matching**: Identifies files ending with `.test.js` or `.spec.js`
- **Graceful degradation**: Returns empty results rather than failing when tests are not found
- **Metadata extraction**: Parses discovered test files to extract test counts, describe blocks, and test categories using regex patterns

The system prioritizes convention over configuration, automatically scanning multiple potential locations to find the most relevant test files for any given source file.

## Relationships

This component is part of the **Test Coverage Analysis Pattern** and works closely with:

- **Test Metadata Extraction**: Processes discovered test files to extract structured metrics
- **Test Coverage Analyzer**: Serves as the discovery mechanism within the broader coverage analysis system
- **Documentation generators**: Provides test information to enhance generated documentation with coverage details

## Usage Example

```javascript
const TestCoverageAnalyzer = require('./lib/test-coverage-analyzer');

// Initialize analyzer with project root
const analyzer = new TestCoverageAnalyzer('/test/project');

// Analyze a source file for test coverage
const result = await analyzer.analyzeFile('src/some-component.js');

// Handle the results
if (result.hasTests) {
  console.log(`Found ${result.totalTests} tests in ${result.testFile}`);
  console.log(`Test suites: ${result.describeBlocks}`);
} else {
  console.log('No tests found for this file');
}
```

## Testing

**Test Coverage**: `tests/unit/test-coverage-analyzer.test.js`
- 42 test cases across 19 test suites
- Comprehensive coverage including edge cases for missing files and graceful degradation scenarios
- Test categories include: TestCoverageAnalyzer, analyzeFile, Processor, Component, Creation, Usage, generateSummary, and internal methods (_findTestFile, _extractTestStats)