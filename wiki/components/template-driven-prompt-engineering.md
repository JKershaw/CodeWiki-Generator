---
title: Template-driven prompt engineering
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Template-driven Prompt Engineering

Template-driven prompt engineering enables consistent, reusable AI interactions by separating prompt structure from dynamic content. This approach standardizes how the system communicates with language models while maintaining flexibility for different use cases.

## Key Functionality

The `DocumentationWriterAgent` demonstrates this pattern by using structured templates to generate wiki documentation from code analysis:

- **Template-based prompts**: Uses `PromptManager` to render prompts from templates, ensuring consistent formatting and context across documentation requests
- **AI model integration**: Communicates with Claude AI (claude-sonnet-4-20250514) through `ClaudeClient` using templated prompts
- **Response processing**: Sanitizes and cleans up AI-generated markdown content to ensure proper formatting
- **Context handling**: Accepts concept names, code analysis data, and optional existing content as template variables

### Core Components

- `writeDocumentation()` - Main generation method that combines template rendering with AI processing
- `sanitizeMarkdown()` - Cleans up AI responses by removing code block wrappers and excess whitespace
- Model configuration with 3000 token limit for controlled output length

## Relationships

This component sits at the intersection of several system layers:

- **Consumes**: Code analysis output from `CodeAnalysisAgent`
- **Depends on**: `PromptManager` for template rendering and `ClaudeClient` for AI communication
- **Uses**: `documentation-writer` prompt template for standardized AI instructions
- **Part of**: Multi-agent documentation automation pipeline

## Usage Example

```javascript
const agent = new DocumentationWriterAgent();
const documentation = await agent.writeDocumentation(
  "Template-driven prompt engineering",
  codeAnalysisData,
  existingContent // optional
);
```

The template approach ensures that prompts maintain consistent structure, context, and instructions while allowing dynamic insertion of specific code analysis data and concept information. This pattern scales across different documentation types and AI interactions throughout the system.