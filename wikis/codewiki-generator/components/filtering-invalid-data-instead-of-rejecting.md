---
title: Filtering invalid data instead of rejecting
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Filtering Invalid Data Instead of Rejecting

## Purpose and Overview

This component implements a fault-tolerant approach that filters out invalid guide data rather than rejecting entire responses when errors occur. Instead of throwing errors when individual guides are malformed, it returns only the valid guides, allowing the system to achieve partial success and maintain functionality even when some data is corrupted.

## Key Functionality

The filtering mechanism works by:

- **Selective validation**: Validates each guide individually rather than treating the entire collection as an all-or-nothing unit
- **Invalid data removal**: Automatically removes malformed or invalid guides from the response while preserving valid ones
- **Partial success handling**: Returns successfully parsed guides even when some guides fail validation
- **Error isolation**: Prevents individual guide parsing failures from affecting the processing of other valid guides

This approach transforms potential complete failures into partial successes, significantly improving the robustness of guide generation operations.

## Relationships

This component works in conjunction with:

- **Multi-stage JSON parsing robustness**: Provides the parsing foundation that identifies which guides are valid or invalid
- **Graceful degradation with empty fallback**: Serves as an intermediate step before falling back to empty results
- **Contextual error logging for debugging**: Logs details about filtered invalid data to help diagnose parsing issues
- **Guide Generation Agent**: Implemented within the main agent to improve overall reliability

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();
const result = await agent.generateGuides(requestData);

// result.guides contains only valid guides
// Invalid guides are filtered out automatically
console.log(`Generated ${result.guides.length} valid guides`);
```

## Testing

No automated tests found for this component. Consider adding tests to verify filtering behavior with mixed valid/invalid data scenarios.