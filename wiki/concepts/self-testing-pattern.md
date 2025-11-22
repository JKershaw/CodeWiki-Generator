---
title: Self-testing pattern
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Self-testing Pattern

## Purpose and Overview

The self-testing pattern demonstrates how the CodeWiki Generator validates itself by processing its own repository. This provides both real-world testing of the system and serves as a practical example for users wanting to understand the tool's capabilities.

## Key Functionality

The `test-run.js` script orchestrates a complete test run with several important features:

- **Cost-limited execution**: Sets a maximum token budget (50,000 tokens) to prevent unexpected API expenses during testing
- **Output isolation**: Generates documentation to a separate `test-docs` directory to avoid overwriting development documentation  
- **Comprehensive statistics**: Collects and reports detailed metrics including:
  - Files processed and token usage
  - API costs and rate limiting
  - Processing time and error counts
  - File type distribution

### Error Handling

The script includes robust error handling that catches processing failures and still reports available statistics, ensuring visibility into what succeeded even when errors occur.

## Relationships

- Uses the `Processor` class from `lib/processor` as the main processing engine
- Demonstrates the complete `processRepository` workflow
- Provides a template that users can adapt for testing their own repositories
- Shows practical implementation of the configuration options available in the system

## Usage Examples

### Running the Self-Test

```bash
node test-run.js
```

### Adapting for Your Repository

```javascript
const processor = new Processor({
  maxTokens: 25000,        // Adjust cost limit
  outputDir: './my-docs',  // Set output directory
  // ... other configuration options
});

const stats = await processor.processRepository('./my-project');
```

### Understanding Statistics Output

The test run provides detailed statistics that help monitor processing:

- **Token usage**: Tracks consumption against your budget
- **Cost tracking**: Shows estimated API costs
- **Performance metrics**: Processing speed and bottlenecks
- **Coverage analysis**: Which files were processed successfully

This self-testing approach validates that the CodeWiki Generator works correctly while providing users with a clear example of how to safely test the tool on their own codebases.