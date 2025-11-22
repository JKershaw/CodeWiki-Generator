---
title: Template-driven prompting
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Template-driven Prompting

## Purpose and Overview

Template-driven prompting provides a structured approach for generating consistent AI prompts by using predefined templates with variable substitution. This pattern ensures reliable prompt formatting and enables reusable prompt logic across different AI interactions within the codebase analysis system.

## Key Functionality

The template-driven prompting system works through several key mechanisms:

### Template Management
- **Structured Templates**: Uses the `PromptManager` to maintain reusable prompt templates with placeholder variables
- **Dynamic Substitution**: Replaces template variables with context-specific data like file changes, diff content, and related documentation
- **Consistent Formatting**: Ensures all AI prompts follow standardized structure for predictable responses

### Content Optimization
- **Token Management**: Automatically truncates large diffs using the `_truncateDiff` function (60% start, 30% end) to stay within LLM token limits
- **Smart Filtering**: Applies `isSignificantFile` logic to focus prompts only on meaningful code changes, excluding configuration and build artifacts
- **Context Integration**: Incorporates related wiki pages and documentation context into prompts for more informed AI analysis

### Response Structure
- **Validation Pipeline**: Uses `_validateResponse` to ensure AI outputs match expected template structure
- **Fallback Handling**: Provides default values for missing response fields to maintain system reliability
- **Normalized Output**: Produces consistent response format compatible with downstream knowledge graph systems

## Relationships

The template-driven prompting pattern integrates with several system components:

- **ClaudeClient**: Delivers formatted prompts to the AI service and receives structured responses
- **CodeAnalysisAgent**: Primary consumer that orchestrates the template-based analysis workflow
- **Wiki System**: Provides contextual documentation that gets incorporated into prompt templates
- **Agent Architecture**: Serves as the prompt generation layer within the broader automated documentation system

## Usage Examples

### Basic Template-driven Analysis
```javascript
const agent = new CodeAnalysisAgent(claudeClient, promptManager);
const analysis = await agent.analyzeCode(fileChanges, relatedPages);
// Returns structured output based on prompt template
```

### Configuration
```javascript
const maxDiffLines = 200; // Configurable truncation threshold
// Large diffs automatically truncated to fit template constraints
```

The template-driven approach ensures consistent AI interactions while handling the complexity of variable content sizes and maintaining reliable output structure across all code analysis operations.