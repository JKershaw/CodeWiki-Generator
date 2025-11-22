---
title: Cost-limited testing
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Cost-limited testing

## Purpose and Overview

Cost-limited testing provides a safety mechanism for testing AI-powered code analysis tools by setting explicit cost boundaries and output isolation. This approach prevents unexpected API expenses during development and validation phases while ensuring the system works correctly on real codebases.

## Key Functionality

The cost-limited testing pattern implements several protective measures:

- **Cost caps**: Sets maximum spending limits (e.g., $0.50) to prevent runaway API costs during testing
- **Output isolation**: Generates test results in separate directories to avoid overwriting production documentation
- **Self-validation**: Tests the CodeWiki Generator by processing its own repository, providing real-world validation
- **Comprehensive reporting**: Collects and displays detailed statistics about processing performance and costs

### Test Execution Flow

1. **Setup**: Configures processor with cost limits and isolated output directory
2. **Processing**: Runs the full repository analysis with all safety constraints active
3. **Monitoring**: Tracks API usage, token consumption, and processing time
4. **Reporting**: Displays comprehensive statistics including:
   - Files processed and token counts
   - API costs and usage patterns
   - Processing duration and performance metrics
   - Error counts and success rates

## Relationships

The cost-limited testing integrates with core system components:

- **Processor class**: Uses the main processing engine with safety parameters
- **Repository processing**: Demonstrates the complete `processRepository` workflow
- **Statistics collection**: Showcases all available monitoring and reporting capabilities
- **Error handling**: Provides template for robust testing error management

## Usage Examples

### Basic Test Run

```javascript
// Set cost limit and isolated output
const maxCost = 0.50;
const outputDir = 'test-output/wiki-docs';

// Process with safety constraints
const stats = await processor.processRepository('.', outputDir);
```

### Monitoring Test Results

```javascript
// Check if cost limit was respected
if (stats.totalCost > maxCost) {
  console.warn(`Cost exceeded limit: $${stats.totalCost}`);
}

// Validate processing success
console.log(`Processed ${stats.filesProcessed} files`);
console.log(`Total tokens: ${stats.totalTokens}`);
```

This testing approach ensures safe development iteration and provides confidence before processing larger or production repositories.