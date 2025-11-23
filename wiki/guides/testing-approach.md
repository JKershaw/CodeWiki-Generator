---
related: []
updated: 2025-11-23
---

# Testing Approach

## Introduction

This guide explains how to run tests and understand the testing patterns used in CodeWiki-Generator. The project uses Jest as its testing framework.

## Prerequisites

- Repository set up (see Getting Started guide)
- Node.js and npm installed

## Running Tests

1. **Run all tests**
   ```bash
   npm test
   ```

2. **Run tests in watch mode**
   ```bash
   npm run test:watch
   ```

3. **Run tests with coverage**
   ```bash
   npm run test:coverage
   ```

## Testing Patterns

### Agent Testing
Tests for ArchitectureOverviewAgent and GuideGenerationAgent focus on:
- Input validation and [repository structure analysis](../components/repository-structure-analysis.md)
- Output format validation (proper markdown generation)
- LLM response handling and JSON cleaning

### JSON Response Testing
Given the system's reliance on LLM APIs:
- Tests validate [resilient LLM response parsing](../concepts/resilient-llm-response-parsing.md)
- [Progressive JSON repair strategy](../components/progressive-json-repair-strategy.md) is tested with malformed inputs
- JSON response cleaning is verified for various edge cases

### Repository Analysis Testing
- [Repository fingerprinting](../concepts/repository-fingerprinting.md) accuracy
- Structure analysis correctness
- Pattern recognition for different project types

## Writing New Tests

1. **Follow the existing pattern**
   ```javascript
   describe('ComponentName', () => {
     test('should handle expected behavior', () => {
       // Test implementation
     });
   });
   ```

2. **Mock LLM responses**
   - Test with various response formats
   - Include malformed JSON scenarios
   - Test timeout and error conditions

3. **Test documentation output**
   - Validate markdown structure
   - Check link generation
   - Verify category organization

## Common Test Scenarios

- Repository structure variations
- LLM API response variations
- JSON parsing edge cases
- Documentation generation completeness

## Next Steps

- Run the full test suite before making changes
- Add tests for new agents or patterns
- See Development Workflow for integration testing