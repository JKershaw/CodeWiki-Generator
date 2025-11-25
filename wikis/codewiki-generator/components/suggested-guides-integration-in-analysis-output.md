---
title: Suggested guides integration in analysis output
category: component
sourceFile: lib/agents/code-analysis-agent.js
related: [components/code-analysis-agent.md, meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Suggested Guides Integration in Analysis Output

## Purpose and [Overview](../meta/overview.md)

The suggested guides integration extends the [code analysis agent](../components/code-analysis-agent.md)'s output schema to include recommended documentation guides alongside traditional code concepts. This enhancement enables the analysis agent to provide contextual documentation recommendations based on code analysis results, improving the overall documentation discovery experience.

## Key Functionality

The component adds a `suggestedGuides` field to the analysis response schema, working in conjunction with the existing `concepts`, `codeElements`, and `relationships` fields. The integration:

- **Extends Response Schema**: Incorporates suggested guides as a first-class output alongside existing analysis results
- **Maintains Schema Consistency**: Follows the same validation and normalization patterns as other response fields
- **Supports Documentation Routing**: Enables downstream systems to recommend relevant guides based on analyzed code patterns
- **Preserves Backward Compatibility**: Works seamlessly with existing response processing without breaking changes

The suggested guides are processed through the same defensive data normalization pipeline as other response components, ensuring consistent data structure and handling of malformed inputs.

## Relationships

This component integrates with several key system elements:

- **[Code Analysis Agent](../components/code-analysis-agent.md)**: Core agent that generates the enhanced response structure
- **Response Validation System**: The `_validateResponse` method processes suggested guides through the same normalization pipeline
- **Category-aware Concept Extraction**: Works alongside the categorized concept system to provide comprehensive analysis output
- **Documentation Generation Pipeline**: Downstream consumers can use suggested guides for enhanced documentation workflows

## Usage Example

```javascript
const CodeAnalysisAgent = require('./lib/agents/code-analysis-agent');

const agent = new CodeAnalysisAgent();

// Analysis response now includes suggestedGuides field
const analysisResult = {
  concepts: [
    {
      name: 'DashboardController',
      category: 'component',
      abstraction: 'low',
      reason: 'Main controller for dashboard',
      sourceFile: 'lib/dashboard-controller.js'
    }
  ],
  codeElements: [],
  relationships: [],
  suggestedGuides: [
    'mvc-patterns',
    'controller-best-practices'
  ]
};
```

## Testing

**Test Coverage**: tests/unit/code-analysis-agent.test.js
- 10 test cases across 3 test suites
- Primary test categories: CodeAnalysisAgent, _validateResponse, isSignificantFile
- Includes validation testing for the enhanced response schema with suggested guides integration