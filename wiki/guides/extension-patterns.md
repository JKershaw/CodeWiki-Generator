---
related: []
updated: 2025-11-23
---

# Extension Patterns

## Introduction

This guide shows how to extend CodeWiki-Generator by adding new agents, documentation types, or analysis patterns. The system follows the [architecture synthesis agent pattern](../concepts/architecture-synthesis-agent-pattern.md).

## Prerequisites

- Understanding of the existing codebase (see Getting Started)
- Familiarity with the agent pattern used
- Knowledge of LLM API integration

## Adding New Documentation Agents

### 1. Create Agent Class
Follow the pattern established by [ArchitectureOverviewAgent](../components/architecture-overview-agent.md) and [GuideGenerationAgent](../components/guide-generation-agent.md):

```javascript
class NewDocumentationAgent {
  constructor(config) {
    this.config = config;
  }
  
  async generateDocumentation(repositoryContext) {
    // Implement generation logic
    // Use [resilient LLM response parsing](../concepts/resilient-llm-response-parsing.md)
    // Apply JSON response cleaning
  }
}
```

### 2. Implement Response Handling
Use the established patterns for LLM integration:
- Apply progressive JSON repair strategy
- Implement [resilient LLM response parsing](../concepts/resilient-llm-response-parsing.md)
- Use JSON response cleaning utilities

### 3. Follow Category Organization
Ensure your agent outputs follow [category-based content organization](../concepts/category-based-content-organization.md):
- Concepts: Abstract patterns and principles
- Components: Concrete code elements
- Guides: Operational documentation

## Adding New Repository Analysis

### 1. Extend [Repository Fingerprinting](../concepts/repository-fingerprinting.md)
```javascript
// Add new analysis patterns
const analyzeNewPattern = (repositoryStructure) => {
  // Implement pattern recognition
  // Return structured analysis
};
```

### 2. Update Structure Analysis
- Identify new file patterns
- Recognize framework-specific structures
- Extract configuration patterns

## Adding Documentation Categories

### 1. Define Category Structure
```markdown
## New Category
- item1.md
- item2.md
```

### 2. Update Index Generation
- Modify wiki index generation logic
- Ensure auto-navigation includes new categories
- Update cross-references

## Integration Patterns

### 1. Agent Coordination
- Agents should work independently
- Share repository context through standardized interface
- Avoid tight coupling between agents

### 2. Output Coordination
- Follow consistent markdown formatting
- Use standard linking conventions
- Maintain category boundaries

### 3. Error Handling
- Implement graceful degradation
- Use progressive JSON repair for LLM responses
- Provide meaningful error messages

## Testing New Extensions

1. **Unit Tests**
   - Test agent logic independently
   - Mock LLM responses
   - Validate output format

2. **Integration Tests**
   - Test with real repository structures
   - Validate cross-agent coordination
   - Check documentation completeness

## Best Practices

- Follow the established agent pattern
- Use [repository fingerprinting](../concepts/repository-fingerprinting.md) for context
- Implement resilient parsing for LLM responses
- Maintain category-based organization
- Write comprehensive tests

## Next Steps

- Study existing agents for implementation patterns
- Review [system-level documentation generation](../concepts/system-level-documentation-generation.md) flow
- Test extensions with various repository types
- See Testing Approach for validation strategies